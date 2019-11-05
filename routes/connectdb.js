let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/quizdb');
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


db.exports = db;