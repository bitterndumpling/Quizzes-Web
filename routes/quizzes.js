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

router.addQuiz = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    let quiz = new quizzes();
    quiz.title = req.body.title;
    quiz.creator = req.body.creator;
    quiz.date = req.body.date;
    quiz.times = req.body.times;
    quiz.questions = req.body.questions;

    quiz.save(function (err) {
        if(err)
            res.json({message:'Added false',errmsg:err});
        else
            res.json({message:'Added successfully',data:quiz})
    })
}

router.editQuiz = (req,res)=>{
    quizzes.findById(req.body._id,function (err,quiz) {
        if(err){
            res.json({message:'Not found',errmsg:err});
        }
        quiz.title = req.body.title;
        quiz.date = req.body.date;
        quiz.questions = req.body.questions;
        quiz.save(function (err) {
            if(err)
                res.json({message:'Edit false',errmsg:err});
            else
                res.json({message:'Edit successfully',data:quiz})
        })
    })
}

router.doTest = (req,res) =>{
    console.log(req.body.quizId);
    quizzes.findById(req.body.quizId,function (err,quiz) {
        quiz.times += 1;
        quiz.save(function (err) {
            if(err)
                res.json({message:'Test false',errmsg:err});
            else
                res.json({message:'Someone finished testing'})
        })
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


