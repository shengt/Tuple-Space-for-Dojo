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
		}
	});
})();