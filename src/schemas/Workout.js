const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: {type: String},
    id: {type: String},
    name: {type: String},
    type: {type: String},
    date_created: {type: Number},
    workoutSteps: [
        {
            title: {type: String},
            description: {type: String},
            duration: {type: Number}
        }
    ],
})

module.exports = mongoose.model("workout", schema);