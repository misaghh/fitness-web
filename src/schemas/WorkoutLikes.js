const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    id: {type: String},
    user_id: {type: String},
    workout_id: {type: String}
})

module.exports = mongoose.model("workout_like", schema);