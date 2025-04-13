const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/chess')
    .then(() => {
        console.log('connectedddd');
    })
    .catch((err) => {
        console.log('error');
    });

module.exports = mongoose;
