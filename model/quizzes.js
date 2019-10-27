let mongoose = require('mongoose');

let quizzesSchema = new mongoose.Schema({
        title: String,
        creator: String,
        date: Date,
        times: {type: Number, default:0},
        questions: [{
            'id': Number,
            'type': Number,
            'question': String,
            'answer': [String],
            'test': String
        }]
    },
    {collection:'quizzesdb'});
module.exports = mongoose.model('Quizzes', quizzesSchema);