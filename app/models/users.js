'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var User = new Schema({
    local: {
        id: String,
        username: String,
        password: String
    },
    github: {
        id: String,
        displayName: String,
        username: String
    }
});

User.methods.generateId = function() {
    return new mongoose.mongo.ObjectId();
};

User.methods.generateHash = function(password) {
    let salt = bcrypt.genSaltSync(process.env.salt);
    return bcrypt.hashSync(password, salt);
};

User.methods.compareHash = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
