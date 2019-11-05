let mongoose = require('mongoose');

let quizzesSchema = new mongoose.Schema({
        title: String,
        creator: String,
        date: Date,
        times: {type: Number, default:0},
        questions: [{
            'id': Number,
            'types': Number,
            'question': String,
            'answer': [String],
            'qtext': String
        }]
    },
    {collection:'quizzes'});
module.exports = mongoose.model('Quizzes', quizzesSchema);