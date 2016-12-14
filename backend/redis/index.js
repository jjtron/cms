'use strict';

/**
 * hget
 * returns value of the hash by and id and the field
 * all other outcomes return an error
 */
var hget = function (req, hashPrefix, hashid, field) {
	var p = new Promise(function(resolve, reject) {
		req.cmsDb.hget(
			hashPrefix + ':' + hashid,
			field,
			function (err, reply) {
				if (err) {
					reject({message: 'Redis method error: hget'});
				}
				if (reply) {
					resolve(reply);
				} else {
					reject({message: 'Cant find hash key or field'});
				}
			});
	});
	return p;
}

/**
 * zscore
 * returns score of the value
 * all other outcomes return an error
 */
var zscore = function (req, indexName, value) {
	var p = new Promise(function(resolve, reject) {
		req.cmsDb.zscore(
			indexName,
			value,
			function (err, reply) {
				if (err) {
					reject({message: 'Redis method error: zscore'});
				}
				if (reply) {
					resolve(reply);
				} else {
					reject({message: 'Entity not found: ' + value});
				}
			});
	});
	return p;
}

/**
 * sadd
 * returns true if added successfully
 * all other outcomes return an error
 */
var sadd = function (req, set, key) {
	var p = new Promise(function(resolve, reject) {
		req.cmsDb.sadd(set, key, function (err, reply) {
			if (err) {
				reject({message: 'Redis method error: sadd'});
			}
			if (reply === 1) {
				resolve(true);
			} else if (reply === 0){
				reject({message: 'Duplicate key: set ' + set});
			} else {
				reject({message: 'Unknown error; not duplicate key'});
			}
		});
	});
	return p;
}

/**
 * hset
 * returns true if added successfully
 * all other outcomes return an error
 */
var hset = function (req, hashParams) {
	var p = new Promise(function(resolve, reject) {
		req.cmsDb.hset(
			hashParams.hashName + ':' + hashParams.id,
			hashParams.paramName,
			hashParams.paramValue,
			function (err, reply) {
				if (err) {
					reject({message: 'Redis method error: hset'});
				}
				if (reply) {
					resolve(true);
				} else {
					reject({message: 'Unknown error; failed to post'});
				}
			});
	});
	return p;
}

/**
 * hmset
 * returns true if added successfully
 * all other outcomes return an error
 */
var hmset = function (req, params) {
	var p = new Promise(function(resolve, reject) {
		req.cmsDb.hmset(...params,
			function (err, reply) {
				if (err) {
					reject({message: 'Redis method error: hmset'});
				}
				if (reply) {
					resolve(true);
				} else {
					reject({message: 'Unknown error; failed to post'});
				}
			});
	});
	return p;
}

/**
 * hgetall
 * returns hash parameters
 * all other outcomes return an error
 */
var hgetall = function (req, key) {
	var p = new Promise(function(resolve, reject) {
		req.cmsDb.hgetall(
			key,
			function (err, reply) {
				if (err) {
					reject({message: 'Redis method error: hgetall'});
				}
				if (reply) {
					resolve(reply);
				} else {
					reject({message: 'Unknown error; failed to retrieve data'});
				}
			});
	});
	return p;
}

/**
 * zadd
 * returns true if added successfully
 * all other outcomes return an error
 */
var zadd = function (req, setParams) {
	var p = new Promise(function(resolve, reject) {
		req.cmsDb.zadd(
			setParams.setName,
			setParams.score,
			setParams.value,
			function (err, reply) {
				if (err) {
					reject({message: 'Redis method error: zadd'});
				}
				if (reply) {
					resolve(true);
				} else {
					reject({message: 'Unknown error; failed to post'});
				}
			});
	});
	return p;
}

/**
 * sscan
 * looks for a single unique item in a set
 * all other outcomes return an error
 */
var sscan = function (req, needle, haystack, unique) {

	unique = (typeof unique === 'undefined') ? true : unique;
	
	var nonUniqueResults = new Array();

	var pOuterPromise = new Promise(function(resolve, reject) {

	    var fnInner = (key, cursor, pattern) => {
	    	var pInnerPromise = new Promise((resolve, reject) => {
	    		req.cmsDb.sscan(key, cursor, 'match', pattern,
					function (err, reply) {
						if (err) {
							reject({message: 'Redis method error: sscan'});
						}
						if (reply) {
							resolve(reply);
						}
					});
	    	});
	    	return pInnerPromise;
	    };

	    var fnOuter = function (key, cursor, pattern) {
	        fnInner(key, cursor, pattern)
	        	.then((reply) => {
	            	var nextCursor = reply[0];
	            	var results = reply[1];
	            	if (unique) {
		            	// assume only one unique item will be hit,
		            	// so results.length will not be 0 on that hit
		            	// and then stop searching
		            	if (nextCursor !== '0' && results.length === 0) {
		                	fnOuter(key, nextCursor, pattern);
		            	} else {
		            		fnResultUnique(reply);
		            	}
	            	} else {
		            	// dont stop searching until cursor back at 0
		            	if (nextCursor !== '0') {
		            		nonUniqueResults = nonUniqueResults.concat(results);
		                	fnOuter(key, nextCursor, pattern);
		            	} else {
		            		nonUniqueResults = nonUniqueResults.concat(results);
		            		fnResultList(nonUniqueResults);
		            	}
	            	}
	        	},
	        	(err) => {
	        		reject(err);
	        	});
	    };

		var fnResultUnique = (r) => {
			if (r[1].length > 0) {
				resolve(true);
			} else {
				resolve(false);
			}
		};

		var fnResultList = (r) => {
			resolve(r);
		};

	    fnOuter(haystack, 0, needle);
	});

	return pOuterPromise;
}

/**
 * multiSetAdd
 * adds items to an array of set objects 
 * 		{setName: string, value: string}
 * resolve if success, reject if failure
 */
var multiSetAdd = function (req, sets, addType) {
	return new Promise ((resolve, reject) => {
		var m = req.cmsDb.multi();
		sets.forEach((set) => {
			m.sadd(set.setName, set.value);
		});
		m.exec((err, resp) => {
			if (err) {
				reject({message: 'Redis method error: multiSetAdd'});
			}
			if (resp && resp.join('') === '1'.repeat(sets.length)) {
				resolve();
			} else {
				reject({message: 'New ' + addType + ' collision'});
			}
		});
	});
}

module.exports = {
	hget: hget,
	zscore: zscore,
	sadd: sadd,
	hset: hset,
	hmset: hmset,
	hgetall: hgetall,
	zadd: zadd,
	sscan: sscan,
	multiSetAdd: multiSetAdd
}