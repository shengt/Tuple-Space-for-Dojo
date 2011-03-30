dojo.provide("nz.ac.auckland.tests.widgets.ConferenceWidget");

dojo.require("nz.ac.auckland.eventModel._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.fx");
dojo.require("nz.ac.auckland.tupleSpace.manager");

(function(){
	
	var ts = nz.ac.auckland.tupleSpace, 
		tsm = nz.ac.auckland.tupleSpace.manager, 
		tupleSpace = tsm.getXTupleSpace();
	
	dojo.declare("nz.ac.auckland.tests.widgets.ConferenceWidget", [nz.ac.auckland.eventModel._Widget, dijit._Templated], {
		
		templateString: dojo.cache("nz.ac.auckland.tests", "widgets/templates/ConferenceWidget.html"),
		
		baseClass: "confWidget",
		widgetsInTemplate: true,
		
		// attach points
		confNameInput: null,
		locationInput: null,
		dateInput: null,
		websiteInput: null,
		
		confName: "INTERACT 2011",
		confLocation: "Lisbon, Portugal",
		confDate: "07/04/2011",
		confWebsite: "http://interact2011.org/",
		
		showDetails: function() {
			this.updateValue();
			this.multicast("location", this.confLocation);
		},
		
		updateValue: function() {
			this.confName = this.confNameInput.value;
			this.confLocation = this.locationInput.value;
			this.confDate = this.dateInput.value;
			this.confWebsite = this.websiteInput.value;
		}
	});

})();