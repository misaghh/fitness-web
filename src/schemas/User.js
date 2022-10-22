const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    id: {type: String},
    username: {type: String},
    date_joined: {type: Number},
    streak: {type: Number}
})

module.exports = mongoose.model("user", schema);