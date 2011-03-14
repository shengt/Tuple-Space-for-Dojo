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
	_timeStampPool: {},
	
	/**
	 * Write a tuple into tuple space
	 * @param tuple
	 * @param callback(tuple, error)
	 */
	write: function(tuple, callback) {
		var done = false;
		if (tuple instanceof nz.ac.auckland.tupleSpace.Tuple) {
			tuple.timeStamp = nz.ac.auckland.tupleSpace.utils.getTimeStamp();
			this._tupleSpace[tuple.uuid] = tuple;
			while (this._timeStampPool[tuple.timeStamp]) {
				// ensure timeStamp won't get conflicted.
				tuple.timeStamp++;
			}
			this._timeStampPool[tuple.timeStamp] = tuple;
			done = true;
		} else {
			done = false;
		}
		if (dojo.isFunction(callback)) {
			if (done) {
				callback(tuple, null);
			} else {
				callback(null, "Adding tuple failed!");
			}
		}
		
		// call blocking callbacks
		for (var key in this._blockingList) {
			var tupleTemplate = new nz.ac.auckland.tupleSpace.TupleTemplate();
			tupleTemplate = dojo.mixin(tupleTemplate, dojo.fromJson(key));
			
			if (tuple.match(tupleTemplate)) {
				while (dojo.isArray(this._blockingList[key]) && this._blockingList[key].length > 0 && this._tupleSpace[tuple.uuid]) {
					var cb = this._blockingList[key].pop();
					try {
						// synchronized invoke callbacks
						cb([tuple]);
					} catch (e) {
						// do nothing
					}
					if (this._blockingList[key].length === 0) {
						delete this._blockingList[key];
					}
				}
			}
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
						delete self._timeStampPool[tuple.timeStamp];
					} catch (e) {
						// Tuple is not there.
					}
				}, this);
				callback(tuples);
			} else {
				callback(null, error);
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
		var results = [];
		for (id in this._tupleSpace) {
			if (this._tupleSpace[id] instanceof nz.ac.auckland.tupleSpace.Tuple) {
				if (this._tupleSpace[id].match(tupleTemplate)) {
					results.push(this._tupleSpace[id]);
				}
			}
		}
		if (results.length === 0) {
			if (predict) {
				// non-blocking operation
				callback(results);
			} else {
				// blocking operation
				var key = dojo.toJson(tupleTemplate);
				if (!this._blockingList[key]) {
					this._blockingList[key] = [];
				}
				this._blockingList[key].push(callback);
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
						delete self._timeStampPool[tuple.timeStamp];
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
		this._timeStampPool = {};
	},
	
	size: function() {
		var element_count = 0;
		for(var e in this._tupleSpace) {
		    if(this._tupleSpace.hasOwnProperty(e)) {
		        element_count++;
		    }
		}
		return element_count;
	}
});

/**
 * Tuple class
 */
dojo.declare("nz.ac.auckland.tupleSpace.Tuple", null, {
	uuid: "",
	payload: null,
	timeStamp: null,
	topic: "",
	sourceId: null,
	targetId: null,
	
	constructor: function(sourceId, targetId, payload, topic, timeStamp) {
		this.payload = payload;
		this.sourceId = sourceId;
		this.targetId = targetId;
		this.topic = topic;
		this.timeStamp = timeStamp || nz.ac.auckland.tupleSpace.utils.getTimeStamp();
		this.uuid = nz.ac.auckland.tupleSpace.utils.getUuid();
	},
	
	/** 
	 * Match the tuple with tuple template.
	 * @param tupleTemplate
	 */
	match: function(tupleTemplate) {
	    // TODO: improve template matching
		if (tupleTemplate instanceof nz.ac.auckland.tupleSpace.TupleTemplate) {
			var keywordList = ['uuid', 'sourceId', 'targetId', 'topic', 'timeStamp', 'payload'];
			var valid = false;
			for (var i=0; i<keywordList.length; i++) {
				if (this[keywordList[i]] && tupleTemplate[keywordList[i]]) {
					var left = this[keywordList[i]], right = tupleTemplate[keywordList[i]];
					if (keywordList[i] === "payload") {
						left = dojo.toJson(left);
						right = dojo.toJson(right);
					}
					
					if (left != right) {
						return false;
					} else {
						if (left) {
							valid = true;
						}
					}
				}
			}
			return valid;
		} else {
			return false;
		}
	},
	
	laterThan: function(timeStamp) {
		return this.timeStamp >= timeStamp;
	},
	
	earlierThan: function(timeStam) {
		return this.timeStamp < timeStamp;
	}
});

/**
 * Tuple template is the same as Tuple
 */
dojo.declare("nz.ac.auckland.tupleSpace.TupleTemplate", [nz.ac.auckland.tupleSpace.Tuple], {
	constructor: function() {
		this.uuid = "";
		this.timeStamp = "";
	}
});