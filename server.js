'use strict';

const path = process.cwd();
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyparser = require('body-parser');
var flash = require('connect-flash');
var app = express();

require('dotenv').load();
require('./app/config/passport')(passport);

app.set('views', process.cwd() + '/public');
app.set('view engine', 'pug');

mongoose.connect(process.env.MONGO_URI,{ useMongoClient: true });
mongoose.Promise = global.Promise;

app.use('/bootstrap', express.static(path + '/node_modules/bootstrap/dist')); 
app.use('/jquery', express.static(path + '/node_modules/jquery/dist'));
app.use('/js', express.static(path + '/node_modules/chart.js/dist'));
app.use('/controllers', express.static(path + '/app/controllers'));
app.use('/public', express.static(path + '/public'));
app.use('/common', express.static(path + '/app/common'));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(flash());

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport, bodyparser);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});


