dojo.provide("nz.ac.auckland.tupleSpace.XTupleSpace");

dojo.require("nz.ac.auckland.tupleSpace.TupleSpace");

dojo.declare("nz.ac.auckland.tupleSpace.XTupleSpace", [nz.ac.auckland.tupleSpace.TupleSpace], {
	
	/************************************
	 * Read unmaked tuple, and loop
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
			        self.clearReadMarkers();
			        callback([tuples[0]], error);
			        tuples[0].read = true;
			    }
			} else {
			    callback(tuples, error);
			}
		};
		this.readAllMatched(tupleTemplate, proxy, predict);
	},
	
	readp: function(tupleTemplate, callback) {
		this.read(tupleTemplate, callback, true);
	},
	
	clearReadMarkers: function() {
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
	}
	
});
