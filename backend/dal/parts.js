'use strict';

var rn = require('random-number');
var redis = require('../redis');

var partsDal = {
	getPart: function (req) {
		return redis.zscore (req, 'part.name.index', req.query.partname)
			.then((score) => {
				return redis.hgetall(req, 'part:' + score);
			})
    		.catch((e) => {
    			return Promise.reject({message: e.message});
    		});
	},

	putPart: function (req) {
		// if the part aml has changed
		var newAmlString = req.body.aml.sort(function(a, b){return a-b}).join('$');
		
		var partid;
		var oldAmlString

		// get part id from part.name.index
		return redis.zscore(req, 'part.name.index', req.body.partname)
			.then((partindex) => {
				partid = partindex;
		    	// watch the part number
		    	req.cmsDb.watch('part:' + partindex);
		    	// get part object from the db
				return redis.hgetall(req, 'part:' + partindex);
			})
			.then((part) => {
				oldAmlString = part.aml;
				if (oldAmlString === newAmlString) {
					// the aml for the part is not being updated
					return Promise.resolve('noAmlChange');
				} else {
			    	// watch the aml-set
			    	req.cmsDb.watch('aml-set');
			    	// make sure the new aml for the part is not already used
					return redis.sscan(req, newAmlString, 'aml-set');
				}
			})
			.then((result) => {
				if (typeof result === 'string') {
					// the aml for the part is not being updated
					return Promise.resolve(false);
				} else if (result === false) {
					// the aml for the part is being updated, and it is not yet used
					return Promise.resolve(true);
				} else {
					// the aml for the part is being updated, and it is alreadyt used
					return Promise.reject({message: 'Duplicate key: authorized manufacturer list'});
				}
			})
			.then((isNewAml) => {
				if (isNewAml) {
					// make sure all new amp(s) are in the db 'amp-set'
					var pArray = [];
					req.body.aml.forEach((amp, i) => {
						pArray.push(redis.sscan(req, amp, 'amp-set'));
					});
					return Promise.all(pArray);
				} else {
					// the aml for the part is not being updated
					return Promise.resolve(false);
				}
			})
			.then((result) => {
				if (typeof result === 'boolean') {
					// the aml for the part is not being updated
					return Promise.resolve(false);
				} else {
					if (result.indexOf(false) === -1) {
						// all new amp(s) are in the db 'amp-set'
						return Promise.resolve(true);
					} else {
						// one or more new amp(s) are NOT in the db 'amp-set'
						return Promise.reject({message: 'Unprocessable Entity: bad approved manufacturer part'});
					}
				}
			})
			.then((isNewAml) => {
				var m = req.cmsDb.multi();
				// if the aml is a new one (and is not '')
				if (isNewAml && newAmlString) {
					// add it to the db 'aml-set'
					m.sadd('aml-set', newAmlString);
				}
				// if the aml is a new one
				if (isNewAml) {
					// remove the old one from the db 'aml-set'
					m.srem('aml-set', oldAmlString);
				}
				// set up for part key update
    			var params = new Array();
    			params.push('part' + ':' + partid);
    			Object.keys(req.body).map((key) => {
    				params.push(key);
    				if (key === 'id') {
    					params.push(partid);
    				} else if (key === 'aml') {
    					params.push(newAmlString);
    				} else {
    					params.push(req.body[key]);
    				}
    			});
    			m.hmset(...params);
    			// execute the update(s)
    			return new Promise ((resolve, reject) => {
        			m.exec((err, resp) => {
        				if (resp) {
        					resolve(true);
        				} else {
        					reject({message: 'Part update collision'});
        				}
        			});
    			});
			});
	},

    postPart: function (req) {
    	// create a new random part id
    	var partid = rn({min: 1000000000, max: 9999999999, integer: true});

    	// data string to use to check for duplicated aml
    	var amlString = req.body.aml.sort(function(a, b){return a-b}).join('$');

		var multiSet = [
		    {setName: 'partname-set', value: req.body.partname},
		    {setName: 'partid-set', value: partid},
		    {setName: 'aml-set', value: amlString}
		];

    	// ensure the partname is not used already
    	return redis.sscan(req, req.body.partname, 'partname-set')
    		.then((r) => {
    			if (!r) {
        			// ensure the new part id is not used already
        			return redis.sscan(req, partid, 'partid-set');
    			} else {
    				return Promise.reject({message: 'Duplicate key: partname'});
    			}
    		})
    		.then((r) => {
    			if (!r) {
    				if (!amlString) {
    					// no aml is not to be considered as a duplicate
    					multiSet.splice(2, 1);
    					return Promise.resolve(false)
    				}
        			// ensure the new aml is not used already
        			return redis.sscan(req, amlString, 'aml-set');
    			} else {
    				return Promise.reject({message: 'Duplicate key: part id'});
    			}
    		})
    		.then((r) => {
    			if (!r) {
					return redis.multiSetAdd(req, multiSet, 'part');
        		} else {
    				return Promise.reject({message: 'Duplicate key: authorized manufacturer list'});
    			}
    		})
    	    .then(() => {
    			// add the parts object
    			var params = new Array();
    			params.push('part' + ':' + partid);
    			Object.keys(req.body).map((key) => {
    				params.push(key);
    				if (key === 'id') {
    					params.push(partid);
    				} else if (key === 'aml') {
    					params.push(amlString);
    				} else {
    					params.push(req.body[key]);
    				}
    			});
	    		return redis.hmset(req, params);
    		})
    		.then(() => {
    			// add the secondary scored set index
	    		return redis.zadd(req, {
	    			setName: 'part.name.index',
	    			score: partid,
	    			value: req.body.partname
	    		});
    		});
    },

	postAmp: function (req) {
		// create a new random approved manufacturere part id
		var ampid = rn({min: 1000000000, max: 9999999999, integer: true});

		var multiSet = [
		    {setName: 'amp-set', value: req.body.mfgr + '|' + req.body.mpn},
		    {setName: 'ampid-set', value: ampid}
		];

		// ensure the amp is not used already
		// where amp is the concatenation of mfgr and mpn
		return redis.sscan(req, req.body.mfgr + '|' + req.body.mpn, 'amp-set')
    		.then((r) => {
    			if (!r) {
        			// ensure the new amp id is not used already
        			return redis.sscan(req, ampid, 'ampid-set');
    			} else {
    				return Promise.reject({message: 'Duplicate key: authorized manufacturer part'});
    			}
    		})
    		.then((r) => {
    			if (!r) {
        			// ensure the new mfgr is not used already
        			return redis.sscan(req,  req.body.mfgr, 'mfgr-set');
    			} else {
    				return Promise.reject({message: 'Duplicate key: authorized manufacturer part id'});
    			}
    		})
    		.then((r) => {
    			if (!r) {
    				// add the new manufacturer to multiSet array
    				multiSet.push({setName: 'mfgr-set', value: req.body.mfgr});
    			}
    			// ensure the new mpn is not used already
    			return redis.sscan(req,  req.body.mpn, 'mpn-set');
    		})
    		.then((r) => {
    			if (!r) {
    				// add the new manufacturer part number to multiSet array
    				multiSet.push({setName: 'mpn-set', value: req.body.mpn});
    			}
    			return Promise.resolve();
    		})
    		.then(() => {
    			// do the multi-set operation
    			return redis.multiSetAdd(req, multiSet, 'amp');
    		})
			.then(() => {
				// add the amp object
				var params = new Array();
				params.push('amp' + ':' + ampid);
				Object.keys(req.body).map((key) => {
					params.push(key);
					if (key === 'id') {
						params.push(ampid);
					} else {
						params.push(req.body[key]);
					}
				});
	    		return redis.hmset(req, params);
			})
			.then(() => {
				// add the secondary scored set index
	    		return redis.zadd(req, {
	    			setName: 'amp.index',
	    			score: ampid,
	    			value: req.body.mfgr + '|' + req.body.mpn
	    		});
			});
	}
}

module.exports = partsDal;