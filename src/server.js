require('dotenv').config();

console.log("Running");

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const path = require("path");

// const {v4: uuid} = require('uuid');

// const ApiKey = require('./ApiKeys.js');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 1458;

const USER = process.env.MONGO_DB_USER;
const PASSWORD = process.env.MONGO_DB_PASSWORD;
const DB_NAME = process.env.MONGO_DB_NAME;

console.log(USER, PASSWORD, DB_NAME)

const mongoUrl = `mongodb+srv://${USER}:${PASSWORD}@cluster0.rcx9d.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection
    .once('open', () => {
        console.log("Connected")
    }).on('error', (error) => {
        console.log("error:", error);
    })

app.listen(PORT, () => console.log("Server starting", PORT));