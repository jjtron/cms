'use strict';

var rn = require('random-number');
var redis = require('../redis');
var userListDal = {

	getUserByIdAndPassword : function(username, password) {
		return promise();
	},

    postCreatedUser: function (req) {

    	// create a new random user id
    	var userid = rn({min: 1000000000, max: 9999999999, integer: true});
    	
    	// ensure the username is not used already
    	return redis.sadd(req, 'username-set', req.body.username)
    		.then(() => {
    			// ensure the new user id is not used already
    			return redis.sadd(req, 'userid-set', userid);
    		})
    		.then(() => {
    			// add the user username
	    		return redis.hset(req, {
	    			hashName: 'user',
	    			id: userid,
	    			paramName: 'username',
	    			paramValue: req.body.username
	    		});
    		})
    		.then(() => {
    			// add the user password
	    		return redis.hset(req, {
	    			hashName: 'user',
	    			id: userid,
	    			paramName: 'password',
	    			paramValue: req.body.password
	    		});
    		})
    		.then(() => {
    			// add the user group as readonly
	    		return redis.hset(req, {
	    			hashName: 'user',
	    			id: userid,
	    			paramName: 'group',
	    			paramValue: 'readonly'
	    		});
    		})
    		.then(() => {
    			// add the secondary scored set index
	    		return redis.zadd(req, {
	    			setName: 'user.name.index',
	    			score: userid,
	    			value: req.body.username
	    		});
    		});
    },

    authUserByIdAndPassword: function (req) {
    	var userscore;
    	return redis.zscore (req, 'user.name.index', req.body.username)
    		.then((score) => {
    			userscore = score;
    			return redis.hget (req, 'user', score, 'password');
    		})
    		.then((password) => {
    			if (password === req.body.password) {
    				return redis.hget (req, 'user', userscore, 'group');
    			} else {
    				return Promise.reject(new Error('Invalid password'));
    			}
    		})
    		.then((group) => {
    			return Promise.resolve(group);
    		})
    		.catch((e) => {
    			return Promise.reject(new Error(e.message));
    		});
    },
}

module.exports = userListDal;