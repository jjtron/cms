var Boom = require('boom');
var ConnectRoles = require('connect-roles');
var role_mng = new ConnectRoles({
	  failureHandler: function (req, res, action) {
	    var accept = req.headers.accept || '';
	    res.status(403);
	    if (~accept.indexOf('html')) {
	    	res.render('access-denied', {action: action});
	    } else {
            res.json(Boom.forbidden('Access Denied - You don\'t have permission to: ' + action).output);
	    }
	  }
	});

module.exports = role_mng;