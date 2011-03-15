dojo.provide("nz.ac.auckland.tupleSpace.utils");

dojo.require("dojox.uuid");
dojo.require("dojox.uuid.Uuid");
dojo.require("dojox.uuid.generateTimeBasedUuid");

(function() {
	var d = dojo, ts = nz.ac.auckland.tupleSpace, tsu = ts.utils;
	
	dojo.mixin(tsu, {
		
		/**
		 * Get current time.
		 */
		getTimeStamp: function() {
			return (new Date()).valueOf();
		},
		
		/**
		 * Get uuid
		 */
		getUuid: function() {
			return "_tuple_" + dojox.uuid.generateTimeBasedUuid().replace(/-/g, "");
		},
		
		isRegex: function(regex) {
			return Object.prototype.toString.call(regex) === "[object RegExp]";
		},
		
		startsWith: function(str, start, ignoreCase) {
			if(ignoreCase) {
	            str = str.toLowerCase();
	            start = start.toLowerCase();
	        }
	        return str.indexOf(start) == 0;
		},
		
		endsWith: function(str, end, ignoreCase) {
			if(ignoreCase) {
	            str = str.toLowerCase();
	            end = end.toLowerCase();
	        }
	        if((str.length - end.length) < 0){
	            return false;
	        }
	        return str.lastIndexOf(end) == str.length - end.length;
		}
	});
})();