var express = require('express');
var router = express.Router();
//let mongoose = require('mongoose');
let users = require('../model/users');
let db = require("./connectdb");




router.changePassword = (req,res) =>{

  users.findOne({user:req.body.user},function (err,user) {
    if(user == null)
      res.json({message: 'Not found'});
    else if (err)
      res.json({message: "error", errmsg: err});
    else {
      user.password = req.body.password;
      user.save(function (err) {
        if(err)
          res.json({message: "error", errmsg: err});
        else
          res.json({message:'Update successfully'})
      })
    }



  })
}

router.deleteUser = (req,res) =>{
  users.findOneAndRemove({user: req.params.user},function (err,user) {
    if(err)
      res.json({message: "Not found", errmsg: err});
    else if(user == null)
      res.json({message: "Not found"});
    else
      res.json({message:'Delete successfully'})
  });
}

router.register = (req,res) =>{

  res.setHeader('Content-Type', 'application/json');
  users.findOne({user: req.body.user},function (err,user) {         // if username existed

    if(user !== null)
      res.json({message: 'Username has been register'});
    else if (err)
      res.json({message: "error", errmsg: err});

    else {
      users.findOne({email: req.body.email}, function (err, user) {        //if email existed
        console.log("bbbbb");
        if (user !== null)
          res.json({message: 'Email has been register'});
        else if (err)
          res.json({message: "error", errmsg: err});

        let user2= new users();
        user2.email = req.body.email;
        user2.user = req.body.user;
        user2.password = req.body.password;


        router.get('/', function (req, res, next) {
          res.send('respond with a resource');
        });

        user2.save(function (err) {
          if (err)
            res.json({message: 'register false', errmsg: err});
          else
            res.json({message: 'register successfully', data: user2})
        })
      });
    }


  });
};



router.login = (req,res) =>{
  if(req.body.user !== undefined) {

    users.findOne({user: req.body.user}, function (err, user) {
      const pwd = req.body.password;
      console.log(pwd+ " "+user.password);
      if(user == null)
        res.json({message: 'Not Found'});
      else if (err)
        res.json({message: "error", errmsg: err});

      else if (user.password === pwd)
        res.json({message: "error password"});
      else
        res.json({message: "login successfully"});
    });
  }

  else if(req.body.email !== undefined){
    users.findOne({email: req.body.email}, function (err, user) {
      const pwd = req.body.password;
      if(user == null)
        res.json({message: 'Not Found'});
      else if(err)
        res.json({message: "error", errmsg: err});


      else if (user.password !== pwd)
        res.json({message: "error password"});
      else
        res.json({message: "login successfully"});

    });
  }
  else
    res.json({message:'no message'});
}

/* GET users listing. */
router.getUsers = (req,res) =>{
  console.log("test");
  res.setHeader('Content-Type', 'application/json');
  users.find(function (err,users) {
    if (err)
      res.send(err);

    res.send(JSON.stringify(users, null, 5));
  });
}

router.findUserByName = (req,res) =>{
  res.setHeader('Content-Type', 'application/json');
  users.findOne({user:req.params.user},function (err,user) {
    if(err)
      res.json({message:"Not found", errmsg: err});
    else
      res.send(JSON.stringify(user, null, 5));
  })
}

module.exports = router;
