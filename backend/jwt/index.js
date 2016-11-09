'use strict';

var jwt = require('jsonwebtoken');

var getJwt = function getJwt(user, privateKey) {
    return jwt.sign(user, privateKey);
};

module.exports = getJwt;
