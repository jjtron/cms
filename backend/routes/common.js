'use strict';

var router = require('./router');
var redis = require('../redis');
var privateKey = require('../jwt/privateKey');
var jwtDecoder = require('express-jwt');
var logger = require('winston');
var Boom = require('boom');
var role_mng = require('../role_mng');
role_mng.use(function(req, act) {
	var amlAccess = req.user.permissions.aml;
	if (act === 'get-sscan' && (amlAccess === 'editor' || amlAccess === 'readonly' )) {
		return true;
	}
});

router
    .options('/^(subset|exists)$',
        function (req, res, next) {
            res.status(204);
            next();
        }
    )
    .get('/subset',
    	jwtDecoder({secret: privateKey}),
		role_mng.can('get-sscan'),
    	function (req, res, next) {
    		redis.sscan(req, req.query.pattern, req.query.set, false)
    			.then((r) => {
            		res.status(200);
            		res.json(r);
    			})
	            .catch((error) => {
		            var boomErr;
	                if (error.message.startsWith('Redis method error')) {
	                    boomErr = Boom.badGateway(error.message);
	                } else {
	                    boomErr = Boom.badImplementation(error.message)
	                }
		            logger.error(error.message);
		            res.status(boomErr.output.statusCode);
		            res.json(boomErr.output);
	            });
    	}
    )
    .get('/exists',
        	jwtDecoder({secret: privateKey}),
    		role_mng.can('get-sscan'),
        	function (req, res, next) {
        		redis.sscan(req, req.query.pattern, req.query.set, true)
        			.then((r) => {
                		res.status(200);
                		res.json(r);
        			})
    	            .catch((error) => {
    		            var boomErr;
    	                if (error.message.startsWith('Redis method error')) {
    	                    boomErr = Boom.badGateway(error.message);
    	                } else {
    	                    boomErr = Boom.badImplementation(error.message)
    	                }
    		            logger.error(error.message);
    		            res.status(boomErr.output.statusCode);
    		            res.json(boomErr.output);
    	            });
        	}
        );

module.exports = router;