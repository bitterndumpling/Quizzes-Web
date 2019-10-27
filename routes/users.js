var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let users = require('../model/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
