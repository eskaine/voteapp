'use strict';

/*
Reference: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
*/

var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, done) {
			process.nextTick(function() {
				User.findOne({ 'local.username': username }, function(err, user) {
					if (err) return done(err);

					if (user) {
						return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
					}
					else {
						var newUser = new User();
						newUser.local.id = newUser.generateId();
						newUser.local.username = username;
						newUser.local.password = newUser.generateHash(password);
						newUser.save(function(err) {
							if (err) throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, done) {
			process.nextTick(function() {
				User.findOne({ 'local.username': username }, function(err, user) {
					if (err) return done(err);

					if (!user)
						return done(null, false, req.flash('loginMessage', 'No user found.'));
					if (!user.compareHash(password))
						return done(null, false, req.flash('loginMessage', 'Wrong password.'));

					return done(null, user);
				});
			});
		}));

	passport.use(new GitHubStrategy({
			clientID: configAuth.githubAuth.clientID,
			clientSecret: configAuth.githubAuth.clientSecret,
			callbackURL: configAuth.githubAuth.callbackURL
		},
		function(token, refreshToken, profile, done) {
			process.nextTick(function() {
				User.findOne({ 'github.id': profile.id }, function(err, user) {
					if (err) return done(err);

					if (user) {
						return done(null, user);
					}
					else {
						var newUser = new User();
						newUser.github.id = profile.id;
						newUser.github.username = profile.username;
						newUser.github.displayName = profile.displayName;
						newUser.save(function(err) {
							if (err) throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}));
};
