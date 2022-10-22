const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    id: {type: String},
    user_id: {type: String},
    name: {type: String},
    calories: {type: Number},
    date_created: {type: Number},
    recipeSteps: [
        {
            title: {type: String},
            description: {type: String}
        }
    ],
})

module.exports = mongoose.model("recipe", schema);