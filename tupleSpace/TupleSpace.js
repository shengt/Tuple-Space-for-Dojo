dojo.provide("nz.ac.auckland.tupleSpace.TupleSpace");
dojo.provide("nz.ac.auckland.tupleSpace.Tuple");
dojo.provide("nz.ac.auckland.tupleSpace.TupleTemplate");

dojo.require("nz.ac.auckland.tupleSpace.utils");

/**
 * TupleSpace in dojo
 */
dojo.declare("nz.ac.auckland.tupleSpace.TupleSpace", null, {
	// Page wide tuple space
	_tupleSpace: {},
	_blockingList: {},
	
	/**
	 * Write a tuple into tuple space
	 * @param tuple
	 * @param callback(tuple, error)
	 */
	write: function(tuple, callback) {
		var error = null;
		if (tuple) {
			this._tupleSpace[tuple.uuid] = tuple;
		} else {
			error = "Tuple is required!"
		}
		
		if (dojo.isFunction(callback)) {
			callback(tuple, error);
		}
		
		// call blocking callbacks
		if (!error) {
			this._callBlocked(tuple);
		}
	},
	
	read: function(tupleTemplate, callback, predict) {
		var proxy = function(tuples, error) {
			if (!error) {
				if (tuples.length > 0) {
					tuples = [tuples[0]];
				}
				callback(tuples);
			} else {
				callback(null, error);
			}
		};
		this.readAllMatched(tupleTemplate, proxy, predict);
	},
	
	/**
	 * @Override
	 * @param {Object} tupleTemplate
	 * @param {Object} callback
	 */
	readp: function(tupleTemplate, callback) {
		this.read(tupleTemplate, callback, true);
	},
	
	take: function(tupleTemplate, callback, predict) {
		var self = this;
		var proxy = function(tuples, error) {
			if (!error) {
				dojo.forEach(tuples, function(tuple) {
					try {
						delete self._tupleSpace[tuple.uuid];
					} catch (e) {
						// Tuple is not there.
					}
				}, this);
				callback(tuples);
			} else {
				callback(tuples, error);
			}
		};
		this.read(tupleTemplate, proxy, predict);
	},
	
	takep: function(tupleTemplate, callback) {
		this.take(tupleTemplate, callback, true);
	},
	
	/**
	 * Read a tuple from tuple space
	 * @param tupleTemplate
	 * @param callback(tuples, error)
	 * @predict
	 *    true: non-blocking operation. The callback function will be called immediately after the read is called, no matter if the tuple exists
	 *    false: blocking operation. The callback function will not be called until the tuple exists.
	 */
	readAllMatched: function(tupleTemplate, callback, predict) {
		var results = this._getAll(tupleTemplate);
		
		if (results.length === 0) {
			if (predict) {
				// non-blocking operation
				callback(results);
			} else {
				// blocking operation
				this._block(tupleTemplate, callback);
			}
		} else {
			callback(results);
		}
	},
	
	readAllMatchedp: function(tupleTemplate, callback) {
		this.readAllMatched(tupleTemplate, callback, true);
	},
	
	/**
	 * Take a tuple from tuple space
	 * @param tupleTemplate
	 * @param callback(tuples, error)
	 * @predict
	 *    true: non-blocking operation. The callback function will be called immediately after the read is called, no matter if the tuple exists
	 *    false: blocking operation. The callback function will not be called until the tuple exists.
	 */
	takeAllMatched: function(tupleTemplate, callback, predict) {
		var self = this;
		var proxy = function(tuples, error) {
			if (!error) {
				dojo.forEach(tuples, function(tuple) {
					try {
						delete self._tupleSpace[tuple.uuid];
					} catch (e) {
						// Tuple is not there.
					}
				}, this);
				callback(tuples);
			} else {
				callback(null, error);
			}
		};
		this.readAllMatched(tupleTemplate, proxy, predict);
	},
	
	takeAllMatchedp: function(tupleTemplate, callback) {
		this.takeAllMatched(tupleTemplate, callback, true);
	},
	
	/**
	 * Clean all tuples and callbacks in tuplespace.
	 * Caution: this function will remove all data and reset the tuple space.
	 */
	reset: function() {
		this._tupleSpace = {};
		this._blockingList = {};
	},
	
	size: function() {
		var element_count = 0;
		for(var e in this._tupleSpace) {
		    if(this._tupleSpace.hasOwnProperty(e)) {
		        element_count++;
		    }
		}
		return element_count;
	},
	
	_block: function(tupleTemplate, callback) {
		var key = nz.ac.auckland.tupleSpace.utils.serialize(tupleTemplate);
		if (!this._blockingList[key]) {
			this._blockingList[key] = [];
		}
		this._blockingList[key].push(callback);
	},
	
	_getAll: function(tupleTemplate) {
		var results = [];
		for (id in this._tupleSpace) {
			if (this._tupleSpace.hasOwnProperty(id) && this._tupleSpace[id]) {
				if (tupleTemplate.match(this._tupleSpace[id])) {
					results.push(this._tupleSpace[id]);
				}
			}
		}
		return results;
	},
	
	_callBlocked: function(tuple) {
		for (var key in this._blockingList) {
			if (this._blockingList.hasOwnProperty(key)) {
				var tupleTemplate = nz.ac.auckland.tupleSpace.utils.unserialize(key);
				
				if (tupleTemplate.match(tuple)) {
					while (dojo.isArray(this._blockingList[key]) && this._blockingList[key].length > 0 && this._tupleSpace[tuple.uuid]) {
						var cb = this._blockingList[key].pop();
						
						// Clean blocking list to prevent it becomes too big.
						if (this._blockingList[key].length === 0) {
							delete this._blockingList[key];
						}
						
						try {
							// synchronized invoke callbacks
							cb([tuple]);
						} catch (e) {
							// do nothing
						}
					}
				}
			}
		}
	}
});

/**
 * Tuple class
 */
dojo.declare("nz.ac.auckland.tupleSpace.Tuple", null, {
	uuid: "",
	parameters: null,
	
	constructor: function() {
		this.uuid = nz.ac.auckland.tupleSpace.utils.getUuid();
		this.parameters = arguments;
	}
});

/**
 * Tuple template is the same as Tuple
 */
dojo.declare("nz.ac.auckland.tupleSpace.TupleTemplate", null, {
	
	parameters: null,
	
	constructor: function() {
		this.parameters = arguments;
	},
	
	/** 
	 * Match the tuple with tuple template.
	 * @param tupleTemplate
	 */
	match: function(tuple) {
		if (tuple) {
			var max = Math.min(this.parameters.length, tuple.parameters.length);
			for (var i = 0; i < max; i++) {
				if (!this.matchField(tuple.parameters[i], this.parameters[i])) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	},
	
	matchField: function(value, template) {
		if (value !== template) {
			if (nz.ac.auckland.tupleSpace.utils.isRegex(template)) {
				return template.text(value);
			} else if (template === "%%") {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
});