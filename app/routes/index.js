'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function(app, passport, bodyparser) {

	function notLoggedToLogin(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.redirect('/login');
		}
	}

	function isLoggedToHome(req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/home');
		}
		else {
			return next();
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(isLoggedToHome, function(req, res) {
			res.render('index.pug');
		});

	app.route('/signup')
		.get(isLoggedToHome, function(req, res) {
			res.render('signup.pug', { message: req.flash('signupMessage') });
		})
		.post(passport.authenticate('local-signup', {
			successRedirect: '/home',
			failureRedirect: '/signup',
			failureFlash: true
		}));

	app.route('/login')
		.get(isLoggedToHome, function(req, res) {
			res.render('login.pug', { message: req.flash('loginMessage') });
		})
		.post(passport.authenticate('local-login', {
			successRedirect: '/home',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/logout')
		.get(function(req, res) {
			var redirectPath = req.headers.referer.split(process.env.APP_URL);
			req.logout();
			res.redirect(redirectPath[1]);
		});

	app.route('/home')
		.get(notLoggedToLogin, function(req, res) {
			let name = req.user.local.username || req.user.github.displayName;
			res.render('home.pug', { isHome: true, name: name });
		});

	app.route('/home/list')
		.get(pollHandler.getUserList)
		.delete(pollHandler.deletePoll);

	app.route('/polllist')
		.get(function(req, res) {
			res.render('list.pug', { auth: req.isAuthenticated() });
		});

	app.route('/polllist/listdata')
		.get(pollHandler.getPollList);

	/*
	individual poll routes
	*/
	app.route('/polls/:pollid')
		.get(function(req, res) {
			res.render('poll.pug', { auth: req.isAuthenticated(), pollid: req.params.pollid });
		});

	app.route('/polls/:pollid/update')
		.get(pollHandler.getPollData)
		.post(pollHandler.updatePollData);

	app.route('/submit')
		.post(notLoggedToLogin, pollHandler.addNewPoll);

	/*
	Github routes
	*/
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/home',
			failureRedirect: '/login'
		}));

	app.route('/api/:id')
		.get(notLoggedToLogin, function(req, res) {
			res.json(req.user.github);
		});

};
