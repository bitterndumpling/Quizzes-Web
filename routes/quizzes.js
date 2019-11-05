let experss = require('express');
let router = experss.Router();
//let mongoose = require('mongoose');
let quizzes = require('../model/quizzes');
let db = require("./connectdb");




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
    res.setHeader('Content-Type', 'application/json');
    quizzes.findById(req.params.id,function (err,quiz) {
        if(quiz === undefined) {
            res.status(404);
            res.json({message: "Not found"});
        }
        else {
            quiz.times += 1;
            quiz.save(function (err) {
                if (err)
                    res.json({message: 'Test false', errmsg: err});
                else
                    res.json({message: 'Someone finished testing', data: quiz})
            })
        }
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
            res.json({message:"Not found", errmsg: err});

        res.send(JSON.stringify(quiz, null, 5));
    })
}


module.exports = router;


