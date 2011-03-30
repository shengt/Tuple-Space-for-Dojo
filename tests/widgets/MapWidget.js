dojo.provide("nz.ac.auckland.tests.widgets.MapWidget");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.fx");
dojo.require("nz.ac.auckland.tupleSpace.manager");

(function(){
	
	var ts = nz.ac.auckland.tupleSpace, 
		tsm = nz.ac.auckland.tupleSpace.manager, 
		tupleSpace = tsm.getXTupleSpace();
	
	dojo.declare("nz.ac.auckland.tests.widgets.MapWidget", [nz.ac.auckland.eventModel._Widget, dijit._Templated], {
		
		templateString: dojo.cache("nz.ac.auckland.tests", "widgets/templates/MapWidget.html"),
		
		baseClass: "mapWidget",
		widgetsInTemplate: true,
		
		// attach points
		mapImage: null,
		
		tsTopic: "location",
		
		mapSrcBase: "http://maps.google.com/maps/api/staticmap?zoom=14&size=400x400&sensor=false",
		mapSrc: "http://maps.google.com/maps/api/staticmap?center=Auckland,New%20Zealand&zoom=14&size=400x400&sensor=false",
		
		handleEvent: function(tuple) {
			this.mapImage.src = this.mapSrcBase + "&center=" + encodeURIComponent(tuple.payload) +
								"&marker=%7c" + encodeURIComponent(tuple.payload);
		}
	});

})();