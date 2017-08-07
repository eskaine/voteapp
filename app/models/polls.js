'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    id: String,
    createdByUserId: String,
    title: String,
    data: Schema.Types.Mixed
}); 

module.exports = mongoose.model("Poll", Poll);