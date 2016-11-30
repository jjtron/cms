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
					reject(err);
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
					reject(err);
				}
				if (reply) {
					resolve(reply);
				} else {
					reject({message: 'Username not found'});
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
				reject(err);
			}
			if (reply === 1) {
				resolve(true);
			} else if (reply === 0){
				reject({message: 'Duplicate key'});
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
					reject(err);
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
					reject(err);
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
					reject(err);
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

module.exports = {
	hget: hget,
	zscore: zscore,
	sadd: sadd,
	hset: hset,
	hmset: hmset,
	zadd: zadd
}