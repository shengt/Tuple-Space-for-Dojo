dojo.provide("nz.ac.auckland.tupleSpace.manager");

dojo.require("nz.ac.auckland.tupleSpace.TupleSpace");
dojo.require("nz.ac.auckland.tupleSpace.XTupleSpace");

(function() {
	var ts = nz.ac.auckland.tupleSpace, tsm = ts.manager;
	
	dojo.mixin(tsm, {
		getTupleSpace: function() {
			ts._tupleSpace = ts._tupleSpace || new ts.TupleSpace();
			return ts._tupleSpace;
		},
		
		getXTupleSpace: function() {
			ts._xTupleSpace = ts._xTupleSpace || new ts.XTupleSpace();
			return ts._xTupleSpace;
		}
	});
})();