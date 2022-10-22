require('dotenv').config();

console.log("Running");

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const path = require("path");

const {v4: uuid} = require('uuid');

const User = require('./schemas/User.js');
const Workout = require('./schemas/Workout.js');
const Recipe = require('./schemas/Recipe.js');
const WorkoutLikes = require('./schemas/WorkoutLikes');
const RecipeLikes = require('./schemas/RecipeLikes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 1458;

const USER = process.env.MONGO_DB_USER;
const PASSWORD = process.env.MONGO_DB_PASSWORD;
const DB_NAME = process.env.MONGO_DB_NAME;

const mongoUrl = `mongodb+srv://${USER}:${PASSWORD}@cluster0.rcx9d.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection
    .once('open', () => {
        console.log("Connected")
    }).on('error', (error) => {
        console.log("error:", error);
    })

app.post('/api/create-user', async (req, res) => {

    const body = req.body;

    if(typeof body === 'undefined' || typeof body.username === 'undefined') {
        res.status(501);
        res.send('Invalid username');
        return;
    }

    const doesUserExist = await User.find({username: body.username});

    if(doesUserExist.length > 0) {
        res.status(501);
        res.send('Username taken');
        return;
    }

    const id = uuid();
    const username = body.username;

    const user = await User.create({
        id,
        username: username,
        date_joined: new Date().getTime(),
        streak: 0
    });

    res.status(200);
    res.send("User created");
})

app.post('/api/create-workout', async (req, res) => {

    const body = req.body;

    // Search for the user
    const users = await User.find({username: body.username});

    // if there are no users found with that username we return
    if(users.length === 0) {

        res.status(404);
        res.send("User not found");
        return;
    } 

    // getting the user
    const user = users[0];

    // parsing the request body
    const name = body.name;
    const type = body.type;

    const _workoutSteps = body.workoutSteps;

    const workoutSteps = [];

    for(const w of _workoutSteps) {
        workoutSteps.push({
            title: w.title,
            description: w.description,
            duration: w.duration
        })
    }

    if(workoutSteps.length === 0) {
        res.status(403);
        res.send("Must provide at least one workout step");
        return;
    }

    const id = uuid();

    const workout = await Workout.create({
        id,
        user_id: user.id,
        name: name,
        type: type,
        date_created: new Date().getTime(),
        workoutSteps: workoutSteps
    });


    console.log(workout);

    res.status(200);
    res.send(workout);
})

app.post('/api/create-recipe', async (req, res) => {

    const body = req.body;

    // Search for the user
    const users = await User.find({username: body.username});

    // if there are no users found with that username we return
    if(users.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
    } 

    // getting the user
    const user = users[0];

    // parsing the request body
    const name = body.name;
    const calories = body.calories;

    const _recipeSteps = body.recipeSteps;

    const recipeSteps = [];

    for(const r of _recipeSteps) {
        recipeSteps.push({
            title: r.title,
            description: r.description
        })
    }

    if(recipeSteps.length === 0) {
        res.status(403);
        res.send("Must provide at least one recipe step");
        return;
    }

    const id = uuid();

    const recipe = await Recipe.create({
        id,
        user_id: user.id,
        name: name,
        calories: calories,
        date_created: new Date().getTime(),
        recipeSteps: recipeSteps
    });


    console.log(recipe);

    res.status(200);
    res.send(recipe);
})

app.post('/api/like-recipe', async (req, res) => {

    const body = req.body;

    // Search for the user
    const users = await User.find({username: body.username});

    // if there are no users found with that username we return
    if(users.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
    } 

    // getting the user
    const user = users[0];

    // Search for the recipes
    const recipes = await Recipe.find({id: body.recipe_id});

    // if there are no recipes found with that id we return
    if(recipes.length === 0) {
        res.status(404);
        res.send("Recipe not found");
        return;
    } 

    // getting the user
    const recipe = recipes[0];

    const likes = await RecipeLikes.find({recipe_id: recipe.id, user_id: user.id});
    const like = likes[0];

    if(likes.length > 0) {
        const deleteLike = await RecipeLikes.deleteOne({id: like.id});

        res.status(200);
        res.send("Unliked recipe");
        return;
    }

    const id = uuid();

    const recipeLike = await RecipeLikes.create({
        id,
        user_id: user.id,
        recipe_id: recipe.id,
        date_liked: new Date().getTime()
    });


    console.log(recipeLike);

    res.status(200);
    res.send(recipeLike);
})

app.post('/api/like-workout', async (req, res) => {

    const body = req.body;

    // Search for the user
    const users = await User.find({username: body.username});

    // if there are no users found with that username we return
    if(users.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
    } 

    // getting the user
    const user = users[0];

    // Search for the recipes
    const workouts = await Workout.find({id: body.workout_id});

    // if there are no recipes found with that id we return
    if(workouts.length === 0) {
        res.status(404);
        res.send("Workout not found");
        return;
    } 

    // getting the user
    const workout = workouts[0];

    const likes = await WorkoutLikes.find({recipe_id: workout.id, user_id: user.id});
    const like = likes[0];

    if(likes.length > 0) {
        const deleteLike = await WorkoutLikes.deleteOne({id: like.id});

        res.status(200);
        res.send("Unliked workout");
        return;
    }

    const id = uuid();

    const workoutLike = await WorkoutLikes.create({
        id,
        user_id: user.id,
        workout_id: workout.id,
        date_liked: new Date().getTime()
    });


    console.log(workoutLike);

    res.status(200);
    res.send(workoutLike);
})

app.get('/api/workouts/:username', async (req, res) => {
    const params = req.params;

    console.log("params:", params);

    if(typeof params === 'undefined') {

        res.status(501);
        res.send("Invalid request, missing param username");
        return;
    }

    // Search for the user
    const users = await User.find({username: params.username});

    // if there are no users found with that username we return
    if(users.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
    } 

    const user = users[0];

    const workouts = await Workout.find({user_id: user.id});

    res.status(200);
    res.send(workouts);
})

app.get('/api/recipes/:username', async (req, res) => {
    const params = req.params;

    console.log("params:", params);

    if(typeof params === 'undefined') {

        res.status(501);
        res.send("Invalid request, missing param username");
        return;
    }

    // Search for the user
    const users = await User.find({username: params.username});

    // if there are no users found with that username we return
    if(users.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
    } 

    const user = users[0];

    const recipes = await Recipe.find({user_id: user.id});

    res.status(200);
    res.send(recipes);
})

app.get('/api/workout-likes/:username', async (req, res) => {
    const params = req.params;

    console.log("params:", params);

    if(typeof params === 'undefined') {

        res.status(501);
        res.send("Invalid request, missing param username");
        return;
    }

    // Search for the user
    const users = await User.find({username: params.username});

    // if there are no users found with that username we return
    if(users.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
    } 

    const user = users[0];

    const likes = await WorkoutLikes.find({user_id: user.id});

    res.status(200);
    res.send(likes);
})

app.get('/api/recipe-likes/:username', async (req, res) => {
    const params = req.params;

    console.log("params:", params);

    if(typeof params === 'undefined') {

        res.status(501);
        res.send("Invalid request, missing param username");
        return;
    }

    // Search for the user
    const users = await User.find({username: params.username});

    // if there are no users found with that username we return
    if(users.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
    } 

    const user = users[0];

    const likes = await RecipeLikes.find({user_id: user.id});

    res.status(200);
    res.send(likes);
})

app.listen(PORT, () => console.log("Server starting", PORT));