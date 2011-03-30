dojo.provide("nz.ac.auckland.tupleSpace.XTupleSpace");
dojo.provide("nz.ac.auckland.tupleSpace.XTuple");
dojo.provide("nz.ac.auckland.tupleSpace.XTupleTemplate");

dojo.require("nz.ac.auckland.tupleSpace.TupleSpace");
dojo.require("nz.ac.auckland.tupleSpace.Tuple");

dojo.declare("nz.ac.auckland.tupleSpace.XTupleSpace", [nz.ac.auckland.tupleSpace.TupleSpace], {
	
	_timeStampPool: {},
	
	write: function(tuple, callback) {
		if (tuple) {
			tuple.timeStamp = nz.ac.auckland.tupleSpace.utils.getTimeStamp();
			while (this._timeStampPool[tuple.timeStamp]) {
				// ensure timeStamp won't get conflicted.
				tuple.timeStamp++;
			}
			this._timeStampPool[tuple.timeStamp] = tuple;
		}
		
		this.inherited(arguments);
	},
	
	/************************************
	 * Read unmaked tuple, and loop
	 * @Override
	 * @param {Object} tupleTemplate
	 * @param {Object} callback
	 * @param {Object} predict
	 */
	 
	read: function(tupleTemplate, callback, predict) {
		var self = this;
		var proxy = function(tuples, error){
			if (!error && (tuples.length > 0)) {
				// find unmarked tuple
				var unmarkedTuple = null;
			    for (var i = 0; i < tuples.length; i++) {
				    if (!tuples[i].read) {
				        unmarkedTuple = tuples[i];
					    break;
				    }
			    }
				
			    if (unmarkedTuple) {
			        callback([unmarkedTuple]);
			        unmarkedTuple.read = true;
			    } else {
			        self._clearReadMarkers();
			        callback([tuples[0]], error);
			        tuples[0].read = true;
			    }
			} else {
			    callback(tuples, error);
			}
		};
		this.readAllMatched(tupleTemplate, proxy, predict);
	},
	
	readLater: function(tupleTemplate, callback, predict) {
		var self = this;
		var proxy = function(tuples, error){
			if (!error) {
				var results = dojo.filter(tuples, function(tuple){
					return tupleTemplate.earlierThan(tuple);
				});
				
				if (results.length > 0) {
					callback(results);
				} else {
					self._block(tupleTemplate, callback);
				}
			} else {
				callback(null, error);
			}
		};
		this.readAllMatched(tupleTemplate, proxy, predict);
	},
	
	_clearReadMarkers: function() {
		for(var e in this._tupleSpace) {
		    if(this._tupleSpace.hasOwnProperty(e)) {
				this._tupleSpace[e].read = false;
		    }
		}
	},
	
	/************************************
	 * Read / Take latest tuple
	 * @param {Object} tupleTemplate
	 * @param {Object} callback
	 * @param {Object} predict
	 */
	readLatest: function(tupleTemplate, callback, predict) {
		var proxy = function(tuples, error) {
			if (!error) {
				for (var i=0, max=0, t= null; i < tuples.length; i++) {
					if (max < tuples[i].timeStamp) {
						max = tuples[i].timeStamp;
						t = tuples[i];
					}
				}
				callback([t]);
			} else {
				callback(tuples, error);
			}
		};
		this.readAllMatched(tupleTemplate, proxy, predict);
	},
	
	readLatestp: function(tupleTemplate, callback) {
		this.readLatest(tupleTemplate, callback, true);
	},
	
	takeLatest: function(tupleTemplate, callback, predict) {
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
		this.readLatest(tupleTemplate, proxy, predict);
	},
	
	takeLatestp: function(tupleTemplate, callback) {
		this.takeLatest(tupleTemplate, callback, true);
	},
	
	register: function(tupleTemplate, callback) {
	    var proxy = function(tuples, error) {
            callback(tuples);
            this.register(tupleTemplate, callback);
	    }
	    this.takeLatest(tupleTemplate, proxy);
	},
	
	unregister: function() {
	    
	},
	
	/**
	 * Clean all tuples and callbacks in tuplespace.
	 * Caution: this function will remove all data and reset the tuple space.
	 */
	reset: function() {
		this.inherited(arguments);
		this._timeStampPool = {};
	}
	
});


/**
 * Tuple class
 */
dojo.declare("nz.ac.auckland.tupleSpace.XTuple", [nz.ac.auckland.tupleSpace.Tuple], {
	uuid: "",
	payload: null,
	timeStamp: 0,
	topic: "",
	sourceId: null,
	targetId: null,
	
	constructor: function(sourceId, targetId, payload, topic) {
		this.payload = payload;
		this.sourceId = sourceId;
		this.targetId = targetId;
		this.topic = topic;
		this.timeStamp = nz.ac.auckland.tupleSpace.utils.getTimeStamp();
		this.uuid = nz.ac.auckland.tupleSpace.utils.getUuid();
	}
});

/**
 * Tuple template is the same as Tuple
 */
dojo.declare("nz.ac.auckland.tupleSpace.XTupleTemplate", [nz.ac.auckland.tupleSpace.TupleTemplate], {
	payload: null,
	timeStamp: 0,
	topic: "",
	sourceId: null,
	targetId: null,
	
	constructor: function(sourceId, targetId, payload, topic, timeStamp) {
		this.sourceId = sourceId;
		this.targetId = targetId;
		this.payload = payload;
		this.topic = topic;
		this.timeStamp = timeStamp;
	},
	
	/** 
	 * Match the tuple with tuple template.
	 * @param tupleTemplate
	 */
	match: function(tuple) {
		if (tuple) {
			if (!this.matchField(tuple.sourceId, this.sourceId) || 
				!this.matchField(tuple.targetId, this.targetId) ||
				!this.matchField(tuple.topic, this.topic)) {
				return false;
			}
			return true;
		} else {
			return false;
		}
	},
	
	laterThan: function(tuple) {
		return this.timeStamp >= tuple.timeStamp;
	},
	
	earlierThan: function(tuple) {
		return this.timeStamp < tuple.timeStamp;
	}
});