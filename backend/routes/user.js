'use strict';

var router = require('./router');
var jwtDecoder = require('express-jwt');
var dalUserList = require('../dal/userList');
var Boom = require('boom');
var privateKey = require('../jwt/privateKey');
var logger = require('winston');

var role_mng = require('../role_mng');
role_mng.use(function(req, act) {
	if (act === 'do this' && req.user.role === 'admin') {
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
                dalUserList.postCreatedUser(req)
                    .then(function(result){
                    	if (result) {
                    		res.status(201);
                    		res.json();
                    	} else {
                            throw new Error({message: 'Unable to post new user'});
                        }
                    })
                    .catch(function(error){
                        var boomErr;
                        if (error.message === 'Duplicate key') {
                            boomErr = Boom.conflict(error.message);
                        } else if (error.message === 'Unable to post new user') {
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
