let experss = require('express');
let router = experss.Router();
let mongoose = require('mongoose');
let quizzes = require('../model/quizzes');



mongoose.connect('mongodb://localhost:27017/quizzesdb');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.deleteQuiz = (req,res) =>{
    quizzes.findByIdAndRemove(req.params.id,function (err) {
        if(err)
            res.json({ message: 'Quiz NOT Deleted!',errmsg:err});
        else
            res.json({ message: 'Quiz Deleted!'});
    })
}



router.getQuizzes = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    quizzes.find(function (err,quiz) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(quiz, null, 5));

    });
}

router.findOneQuiz = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    quizzes.findById(req.params.id,function (err,quiz) {

        if(err)
            res.send(err);

        res.send(JSON.stringify(quiz, null, 5));
    })
}


module.exports = router;