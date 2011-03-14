dojo.provide("nz.ac.auckland.tupleSpace.widgets.TupleSpaceWidget");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("nz.ac.auckland.tupleSpace.manager");

(function(){
	
	var ts = nz.ac.auckland.tupleSpace, 
		tsm = nz.ac.auckland.tupleSpace.manager, 
		tupleSpace = tsm.getXTupleSpace();
	
	dojo.declare("nz.ac.auckland.tupleSpace.widgets.TupleSpaceWidget", [dijit._Widget, dijit._Templated], {
		
		// attach points
		tupleTableBody: null,
		baseClass: "tupleSpaceMonitor",
		
		templatePath: dojo.moduleUrl("nz.ac.auckland.tupleSpace.widgets", "templates/TupleSpaceWidget.html"),
		
		postCreate: function() {
			this.inherited(arguments);

			this.connect(tupleSpace, "write", "update");
			this.connect(tupleSpace, "take", "update");
			this.connect(tupleSpace, "reset", "update");
		},
		
		update: function() {
			dojo.empty(this.tupleTableBody);
			for (var uuid in tupleSpace._tupleSpace) {
			    if (tupleSpace._tupleSpace.hasOwnProperty(uuid)) {
			    	var t = tupleSpace._tupleSpace[uuid];
					var tr = dojo.create("tr", {}, this.tupleTableBody);
					tr.innerHTML = "<td>" + uuid + "</td>" + 
			    				   "<td>" + t.topic + "</td>" + 
			    				   "<td>" + t.payload + "</td>" +
			    				   "<td>" + t.timeStamp + "</td>" + 
			    				   "<td>" + t.sourceId + "</td>" +
			    				   "<td>" + t.targetId + "</td>";
			    }
			}
		},
		
		reset: function() {
			tupleSpace.reset();
		}
	});

})();