'use strict';

var Poll = require('../models/polls.js');
var shortid = require('shortid');
var mongoose = require('mongoose');

function PollHandler() {

    this.addNewPoll = function(req, res) {

        var newPoll = new Poll();

        //generate randomize string for url usage
        var shortUrl = shortid.generate();

        //prepare data for saving
        var data = {};
        Object.keys(req.body).filter(function(key) {
            if (key === 'title') {
                return false;
            }
            return true;
        }).map(function(key) {
            data[req.body[key]] = 0;
        });

        newPoll.id = shortUrl;
        newPoll.createdByUserId = req.user.github.id || req.user.local.id;
        newPoll.title = req.body.title || 'New Poll';
        newPoll.data = data;
        newPoll.save(function(err) {
            if (err) throw err;
            res.redirect('/polls/' + shortUrl);
        });
    };

    this.updatePollData = function(req, res) {

        let str = 'data.';
        let data = {};

        //prepare updata parameters
        if (req.body.select) {
            str = str + req.body.select;
            data[str] = 1;
            data = { $inc: data };
        }
        else if (req.body.newoption) {
            str = str + req.body.newoption;
            data[str] = 1;
        }

        Poll.findOneAndUpdate({ 'id': req.params.pollid }, data)
            .exec(function(err, result) {
                if (err) throw err;
                res.redirect('/polls/' + req.params.pollid);
            });
    }


    this.deletePoll = function(req, res) {
        Poll.findOneAndRemove({ 'id': req.body.data })
            .exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    //get single poll data
    this.getPollData = function(req, res) {
        Poll.findOne({ 'id': req.params.pollid })
            .exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    //get polls created by user
    this.getUserList = function(req, res) {
        let id = req.user.github.id || req.user.local.id;
        Poll.find({ 'createdByUserId': id })
            .exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    //get all polls
    this.getPollList = function(req, res) {
        Poll.find()
            .exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    }

}


module.exports = PollHandler;
