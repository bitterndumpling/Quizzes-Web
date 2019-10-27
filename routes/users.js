var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let users = require('../model/users');

mongoose.connect('mongodb://localhost:27017/usersdb');

let db = mongoose.connection;

db.on('error', function (err) {
  console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
  console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.register = (req,res) =>{

  res.setHeader('Content-Type', 'application/json');
  users.find({user: req.body.user},function (err,user) {         // if username existed
    if(user.length !== 0)
      res.send({message: 'Username has been register'});
    else if (err)
      res.json({message: "error", errmsg: err});
  })

  users.find({email: req.body.email},function (err,user) {        //if email existed
    if(user.length !== 0)
      res.send({message: 'Email has been register'});
    else if (err)
      res.json({message: "error", errmsg: err});
  })

  var user = new users();
  user.email = req.body.email;
  user.user = req.body.user;
  user.password = req.body.password;

  user.save(function (err) {
    if(err)
      res.json({message:'register false',errmsg:err});
    else
      res.json({message:'register successfully',data:user})
  })

}

router.login = (req,res) =>{
  if(req.body.user !== undefined) {

    users.find({user: req.body.user}, function (err, user) {
      if(user.length === 0)
        res.send({message: 'Not Found'});
      else if (err)
        res.json({message: "error", errmsg: err});

      const pwd = req.body.password;
      if (user[0].password !== pwd)
        res.json({message: "error password"});
      else
        res.json({message: "login successfully"});
    });
  }

  else if(req.body.email !== undefined){
    users.find({email: req.body.email}, function (err, user) {
      if(user.length === 0)
        res.send({message: 'Not Found'});
      else if(err)
        res.json({message: "error", errmsg: err});
      const pwd = req.body.password;

      if (user[0].password !== pwd)
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
  res.setHeader('Content-Type', 'application/json');
  users.find(function (err,users) {
      if (err)
        res.send(err);

        res.send(JSON.stringify(users, null, 5));
      });
}

router.findUserByName = (req,res) =>{
  res.setHeader('Content-Type', 'application/json');
  users.find({user:req.params.user},function (err,user) {
    if(user.length === 0)
      res.send({message: 'Not Found'});
    if(err)
      res.send(err);

    res.send(JSON.stringify(user, null, 5));
  })
}

module.exports = router;
