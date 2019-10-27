let mongoose = require('mongoose');

let quizDataSave = new mongoose.Schema({
    _id: String,
    respondent: String,
    date: Date,
    answers:[{
        'id': String,
        'answer': Number,
        'type': Number,
        'text': String

         }]
    },
    {collection:'quizDatadb'});
module.exports = mongoose.model('QuizData',quizDataSave);