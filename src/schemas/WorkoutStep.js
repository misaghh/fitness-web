const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    title: {type: String},
    description: {type: String},
    duration: {type: Number}
})

module.exports = mongoose.model("workout_step", schema);