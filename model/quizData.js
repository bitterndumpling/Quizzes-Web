let mongoose = require('mongoose');

let quizDataSave = new mongoose.Schema({
    quizId: String,
    respondent: String,
    date: Date,
    answers:[{
        'id': Number,
        'answer': Number,
        'types': Number,
        'qtext': String

         }]
    },
    {collection:'quizDatadb'});
module.exports = mongoose.model('QuizData',quizDataSave);