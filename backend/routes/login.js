'use strict';

var router = require('./router');
var dalUserList = require('../dal/userList');
var Boom = require('boom');
var jwtGenerator = require('../jwt');
var privateKey = require('../jwt/privateKey');
var logger = require('winston');

router
    .options('/login',
        function (req, res, next) {
            res.status(204);
            next();
        })
    .post('/login',
        function(req, res) {
            dalUserList.authUserByIdAndPassword(req)
                .then(function(result){
                    if (result) {
                		var userObj = {username: req.body.username, password: req.body.password, permissions: result};
                		var token = jwtGenerator(userObj, privateKey);
                		res.json(token);
                    } else {
                        throw new Error('Unable to authenticate user by id and password request');
                    }
                })
                .catch(function(error){
                    var boomErr;
                    if (error.message === 'Username not found') {
                        boomErr = Boom.badData(error.message);
                    } else if (error.message === 'Invalid password') {
                        boomErr = Boom.unauthorized(error.message);
                    } else {
                        boomErr = Boom.badImplementation('Internal Server Error')
                    }
                    logger.error(error.message);
                    res.status(boomErr.output.statusCode);
                    res.json(boomErr.output);
                });
        }
    );

module.exports = router;