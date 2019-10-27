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
      if(err)
        res.send(err);

    res.send(JSON.stringify(user, null, 5));
  })
}

module.exports = router;
