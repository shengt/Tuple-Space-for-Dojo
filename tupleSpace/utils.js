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
		getTimeStamp: function(date) {
			// To avoid time stamp confliction.
			date = date || new Date();
			return date.valueOf() * 1000;
		},
		
		/**
		 * Get uuid
		 */
		getUuid: function() {
			return "_tuple_" + dojox.uuid.generateTimeBasedUuid().replace(/-/g, "");
		},
		
		serialize: function(tuple) {
			return dojo.toJson(tuple);
		},
		
		unserialize: function(str) {
			var obj = dojo.fromJson(str),
				type = dojo.getObject(obj.declaredClass);
			return dojo.mixin(new type(), dojo.fromJson(str));
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