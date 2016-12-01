'use strict';

var router = require('./router');
var jwtDecoder = require('express-jwt');
var dalUserList = require('../dal/userList');
var Boom = require('boom');
var privateKey = require('../jwt/privateKey');
var logger = require('winston');

var role_mng = require('../role_mng');
role_mng.use(function(req, act) {
	// check permissions.admin of the jwt from the request, (i.e., owner of jwt) ,
	// who is updating some other user (i.e., req.body.username)
	if (act === 'do this' && req.user.permissions.admin === 'true') {
		return true;
	}
})
	
router
    .options('/user',
        function (req, res, next) {
            res.status(204);
            next();
        }
    )

    .post('/user',
            function(req, res) {
    			var errmsg = 'Unable to post new user';
                dalUserList.postCreatedUser(req)
                    .then(function(result){
                    	if (result) {
                    		res.status(201);
                    		res.json();
                    	} else {
                            throw new Error({message: errmsg});
                        }
                    })
                    .catch(function(error){
                        var boomErr;
                        if (error.message === 'Duplicate key') {
                            boomErr = Boom.conflict(error.message);
                        } else if (error.message === errmsg) {
                            boomErr = Boom.badImplementation(error.message)
                        } else {
                            boomErr = Boom.badImplementation(error.message)
                        }
                        logger.error(error.message);
                        res.status(boomErr.output.statusCode);
                        res.json(boomErr.output);
                    });
            }
    )

    .put('/user',
    		jwtDecoder({secret: privateKey}),
    		role_mng.middleware(),
    		role_mng.can('do this'),
            function(req, res) {
				var errmsg = 'Unable to put permissions on user';
    			dalUserList.putUserPermissionsByUsername(req)
	    			.then(function(result){
	                	if (result) {
	                		res.status(204);
	                		res.json();
	                	} else {
	                        throw new Error({message: errmsg});
	                    }
	                })
	                .catch(function(error){
	                    var boomErr;
                        if (error.message === 'Username not found') {
                            boomErr = Boom.notFound(error.message);
                        } else if (error.message === errmsg) {
	                        boomErr = Boom.badImplementation(error.message)
	                    } else {
	                        boomErr = Boom.badImplementation(error.message)
	                    }
	                    logger.error(error.message);
	                    res.status(boomErr.output.statusCode);
	                    res.json(boomErr.output);
	                });
            }
    )

    .get('/user',
    		jwtDecoder({secret: privateKey}),
    		role_mng.middleware(),
    		role_mng.can('do this'),
            function(req, res) {
				var errmsg = 'Unable to get permissions on user';
    			dalUserList.getUserPermissionsByUsername(req)
	    			.then(function(result){
	                	if (result) {
	                		res.status(200);
	                		res.json(result);
	                	} else {
	                        throw new Error({message: errmsg});
	                    }
	                })
	                .catch(function(error){
	                    var boomErr;
                        if (error.message === 'Username not found') {
                            boomErr = Boom.notFound(error.message);
                        } else if (error.message === errmsg) {
	                        boomErr = Boom.badImplementation(error.message)
	                    } else {
	                        boomErr = Boom.badImplementation(error.message)
	                    }
	                    logger.error(error.message);
	                    res.status(boomErr.output.statusCode);
	                    res.json(boomErr.output);
	                });
            }
    )

    .get('/token',
    		jwtDecoder({secret: privateKey}),
    		role_mng.middleware(),
    		role_mng.can('do this'),
            function(req, res) {
                console.log('DECODED', req.user);
                res.json('test ok');
            }
    );

module.exports = router;
