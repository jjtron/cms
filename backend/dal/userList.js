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
    	return redis.sscan(req, 'username-set', req.body.username)
    		.then((r) => {
    			if (!r) {
    				// ensure the new user id is not used already
    				return redis.sscan(req, userid, 'userid-set');
    			} else {
    				return Promise.reject({message: 'Duplicate key: username'});
    			}
    		})
    		.then((r) => {
    			if (!r) {
					var multiSet = [
					    {setName: 'username-set', value: req.body.username},
					    {setName: 'userid-set', value: userid}
		    		];
					return redis.multiSetAdd(req, multiSet, 'username');
        		} else {
    				return Promise.reject({message: 'Duplicate key: user id'});
    			}
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
    			// add the user permissions object
    			var params = new Array();
    			params.push('permissions' + ':' + userid);
    			Object.keys(req.body.permissions).map((key) => {
    				params.push(key);
    				params.push(req.body.permissions[key]);
    			});
	    		return redis.hmset(req, params);
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
    	var userid;
    	return redis.zscore (req, 'user.name.index', req.body.username)
    		.then((score) => {
    			userid = score;
    			return redis.hget (req, 'user', userid, 'password');
    		})
    		.then((password) => {
    			if (password === req.body.password) {
    				return redis.hgetall (req, 'permissions:' + userid);
    			} else {
    				return Promise.reject(new Error('Invalid password'));
    			}
    		})
    		.catch((e) => {
    			return Promise.reject(new Error(e.message));
    		});
    },

    getUserPermissionsByUsername: function (req) {
    	return redis.zscore (req, 'user.name.index', req.query.name)
    		.then((userid) => {
    			return redis.hgetall (req, 'permissions:' + userid);
    		})
    		.catch((e) => {
    			return Promise.reject(new Error(e.message));
    		});
    },

    putUserPermissionsByUsername: function (req) {
    	var userid;
    	return redis.zscore (req, 'user.name.index', req.body.username)
    		.then((score) => {
    			userid = score;
    			var params = new Array();
    			params.push('permissions' + ':' + userid);
    			Object.keys(req.body.permissions).map((key) => {
    				params.push(key);
    				params.push(req.body.permissions[key]);
    			});
	    		return redis.hmset(req, params);
    		})
    		.catch((e) => {
    			return Promise.reject(new Error(e.message));
    		});
    }
}

module.exports = userListDal;