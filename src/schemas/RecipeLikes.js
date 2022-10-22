const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    id: {type: String},
    user_id: {type: String},
    recipe_id: {type: String}
})

module.exports = mongoose.model("recipe-like", schema);