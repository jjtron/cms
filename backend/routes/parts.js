'use strict';

var router = require('./router');
var jwtDecoder = require('express-jwt');
var Boom = require('boom');
var privateKey = require('../jwt/privateKey');
var logger = require('winston');
var partsDal = require('../dal/parts');

var role_mng = require('../role_mng');
role_mng.use(function(req, act) {
	var amlAccess = req.user.permissions.aml;
	if ((act === 'post-amp' || act === 'edit-parts') && amlAccess === 'editor') {
		return true;
	}
	if (act === 'get-part' && (amlAccess === 'editor' || amlAccess === 'readonly' )) {
		return true;
	}
});
	
router
    .options('/^(part|amp)$',
        function (req, res, next) {
            res.status(204);
            next();
        }
    )

	.put('/part',
    		jwtDecoder({secret: privateKey}),
    		role_mng.can('edit-parts'),
	        function(req, res) {
				var errmsg = 'Unable to update part by part name';

				partsDal.putPart(req)
					.then((result) => {
			        	if (result) {
			        		res.status(200);
			        		res.json(result);
			        	} else {
			                throw new Error({message: errmsg});
			            }
					})
			        .catch(function(error){
			            var boomErr;
		                if (error.message.startsWith('Duplicate key')) {
		                    boomErr = Boom.conflict(error.message);
		                } else if (error.message.startsWith('Unprocessable Entity')) {
		                    boomErr = Boom.badData(error.message);
		                } else if (error.message.startsWith('Redis method error')) {
		                    boomErr = Boom.badGateway(error.message);
		                } else if (error.message === 'Part update collision') {
		                    boomErr = Boom.conflict(error.message);
		                } else if (error.message.startsWith('Entity not found')) {
		                    boomErr = Boom.badData(error.message);
		                } else if (error.message === errmsg) {
		                    boomErr = Boom.badImplementation(error.message)
		                } else {
		                    boomErr = Boom.badImplementation(error.message)
		                }
		                req.cmsDb.unwatch();
			            logger.error(error.message);
			            res.status(boomErr.output.statusCode);
			            res.json(boomErr.output);
			        });
	})

	.get('/part',
    		jwtDecoder({secret: privateKey}),
    		role_mng.can('get-part'),
	        function(req, res) {
				var errmsg = 'Unable to get part by part name';
				partsDal.getPart(req)
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
			            if (error.message === errmsg) {
			                boomErr = Boom.badImplementation(error.message)
			            } else if (error.message.startsWith('Redis method error')) {
		                    boomErr = Boom.badGateway(error.message);
		                } else {
			                boomErr = Boom.badImplementation(error.message)
			            }
			            logger.error(error.message);
			            res.status(boomErr.output.statusCode);
			            res.json(boomErr.output);
			        });
	})

    .post('/part',
    		jwtDecoder({secret: privateKey}),
    		role_mng.can('edit-parts'),
            function(req, res) {
				var errmsg = 'Unable to post new part';
		    	
		    	// watch the part record sets for the new name, id, and aml
		    	req.cmsDb.watch('partname-set','partid-set','aml-set');

				partsDal.postPart(req)
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
		                if (error.message.startsWith('Duplicate key')) {
		                    boomErr = Boom.conflict(error.message);
		                } else if (error.message === 'New part collision') {
		                    boomErr = Boom.conflict(error.message);
		                } else if (error.message.startsWith('Redis method error')) {
		                    boomErr = Boom.badGateway(error.message);
		                } else if (error.message === errmsg) {
		                    boomErr = Boom.badImplementation(error.message)
		                } else {
		                    boomErr = Boom.badImplementation(error.message)
		                }
		                req.cmsDb.unwatch();
		                logger.error(error.message);
		                res.status(boomErr.output.statusCode);
		                res.json(boomErr.output);
		            });
            }
    )
    .post('/amp',
    		jwtDecoder({secret: privateKey}),
    		role_mng.can('post-amp'),
            function(req, res) {
				var errmsg = 'Unable to post new amp';

		    	// watch the part record sets for the new name, id, and aml
		    	req.cmsDb.watch('amp-set','ampid-set','mfgr-set','mpn-set');

				partsDal.postAmp(req)
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
		                if (error.message.startsWith('Duplicate key')) {
		                    boomErr = Boom.conflict(error.message);
		                } else if (error.message.startsWith('Redis method error')) {
		                    boomErr = Boom.badGateway(error.message);
		                } else if (error.message === errmsg) {
		                    boomErr = Boom.badImplementation(error.message)
		                } else {
		                    boomErr = Boom.badImplementation(error.message)
		                }
		                req.cmsDb.unwatch();
		                logger.error(error.message);
		                res.status(boomErr.output.statusCode);
		                res.json(boomErr.output);
		            });
            }
    );

module.exports = router;
