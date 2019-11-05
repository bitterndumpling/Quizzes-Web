let mongoose = require('mongoose');


let usersSchema = new mongoose.Schema({
    email: String,
    user: String,
    password: String
    },{collection:'users'});


module.exports = mongoose.model('Users',usersSchema);