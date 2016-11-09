'use strict';

var router = require('./router');

router
    .options('/redis',
        function (req, res, next) {
            res.status(204);
            next();
        }
    )
    .get('/redis',
    	function (req, res, next) {
    		req.cmsDb.get('foo', function (err, reply) {
    			if (err) {
    				return res.status(500).end();
    			}
    		    res.json(reply);
    		});
    	}
    );

module.exports = router;
