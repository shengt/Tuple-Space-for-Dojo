dojo.provide("nz.ac.auckland.tests.widgets.TestWidget");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.fx");
dojo.require("nz.ac.auckland.tupleSpace.manager");

(function(){
	
	var ts = nz.ac.auckland.tupleSpace, 
		tsm = nz.ac.auckland.tupleSpace.manager, 
		tupleSpace = tsm.getXTupleSpace();
	
	dojo.declare("nz.ac.auckland.tests.widgets.TestWidget", [dijit._Widget, dijit._Templated], {
		
		templatePath: dojo.moduleUrl("nz.ac.auckland.tests", "widgets/templates/TestWidget.html"),
		
		sourceId: null,
		
		// attach points
		targetIdInput: null,
		topicInput: null,
		payloadInput: null,
		messagePane: null,
		
		postCreate: function() {
			this.inherited(arguments);
		},
		
		testWrite: function() {
			this.messagePane.innerHTML = "";
			var tuple = dojo.mixin(new ts.Tuple(), this._getObjectFromParam());
			tupleSpace.write(tuple, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Write: " + t[0].uuid);
					}
				}
			}));
		},
		
		testRead: function() {
			this.messagePane.innerHTML = "";
			var obj = this._getObjectFromParam();
			obj.sourceId = null;
			var tupleTemplate = dojo.mixin(new ts.TupleTemplate(), obj);
			tupleSpace.read(tupleTemplate, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Read: " + t[0].uuid);
					}
				}
			}));
		},
		
		testTake: function() {
			this.messagePane.innerHTML = "";
			var obj = this._getObjectFromParam();
			obj.sourceId = null;
			var tupleTemplate = dojo.mixin(new ts.TupleTemplate(), obj);
			tupleSpace.take(tupleTemplate, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Take: " + t[0].uuid);
					}
				}
			}));
		},
		
		testReadp: function() {
			this.messagePane.innerHTML = "";
			var obj = this._getObjectFromParam();
			obj.sourceId = null;
			var tupleTemplate = dojo.mixin(new ts.TupleTemplate(), obj);
			tupleSpace.readp(tupleTemplate, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Readp: " + t[0].uuid);
					}
				}
			}));
		},
		
		testTakep: function() {
			this.messagePane.innerHTML = "";
			var obj = this._getObjectFromParam();
			obj.sourceId = null;
			var tupleTemplate = dojo.mixin(new ts.TupleTemplate(), obj);
			tupleSpace.takep(tupleTemplate, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Takep: " + t[0].uuid);
					}
				}
			}));
		},
		
		_getObjectFromParam: function() {
			return {
				sourceId: this.sourceId,
				targetId: this.targetIdInput.value,
				topic: this.topicInput.value,
				payload: this.payloadInput.value
			}
		},
		
		_showMessage: function(message) {
			this.messagePane.innerHTML = message;
			if (message) {
				dojox.fx.highlight({
					node: this.messagePane,
					duration: 1000
				}).play();
			}
		}
	});

})();