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
    
    console.log(body.username);

    const doesUserExist = await User.find({username: body.username});

    if(doesUserExist.length > 0) {
        res.status(501);
        res.send('Username taken');
        return;
    }

    const id = uuid();

    const user = await User.create({
        id,
        username: 'test-shayan',
        date_joined: new Date().getTime(),
        streak: 0
    });

    res.status(200);
    res.send("User created");
})

app.post('/api/create-workout', async (req, res) => {

    const body = req.body;
    
    console.log(body);

    const id = uuid();

    const workoutSteps = [
        {
            title: "Warmp Up",
            description: "Spend some time warming up before doing anything",
            duration: 15
        }
    ]

    const workout = await Workout.create({
        id,
        user_id: "user-id-here",
        name: "Workout Name",
        type: "Legs",
        date_created: new Date().getTime(),
        workoutSteps: [
            {
                title: "Warmp Up",
                description: "Spend some time warming up before doing anything",
                duration: 123
            }
        ]
    });


    console.log(workout);

    res.status(200);
    res.send(workout);
})

app.listen(PORT, () => console.log("Server starting", PORT));