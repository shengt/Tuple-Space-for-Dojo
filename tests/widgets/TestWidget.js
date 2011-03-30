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
		
		templateString: dojo.cache("nz.ac.auckland.tests", "widgets/templates/TestWidget.html"),
		
		baseClass: "testWidget",
		widgetsInTemplate: true,
		
		sourceId: "",
		
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
			var obj = this._getObjectFromParam();
			var tuple = new ts.XTuple(obj.sourceId, obj.targetId, obj.payload, obj.topic);
			tupleSpace.write(tuple, dojo.hitch(this, function(t, err) {
				if (!err) {
					this._showMessage("Write: " + t.uuid);
				}
			}));
		},
		
		testRead: function() {
			this.messagePane.innerHTML = "";
			var obj = this._getObjectFromParam();
			dojo.mixin(obj, {
				sourceId: "%%",
				targetId: obj.targetId || "%%",
				payload: obj.palyload || "%%",
				topic: obj.topic || "%%"
			})
			var tupleTemplate = new ts.XTupleTemplate(obj.sourceId, obj.targetId, obj.payload, obj.topic);
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
			dojo.mixin(obj, {
				sourceId: "%%",
				targetId: obj.targetId || "%%",
				payload: obj.palyload || "%%",
				topic: obj.topic || "%%"
			})
			var tupleTemplate = new ts.XTupleTemplate(obj.sourceId, obj.targetId, obj.payload, obj.topic);
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
			dojo.mixin(obj, {
				sourceId: "%%",
				targetId: obj.targetId || "%%",
				payload: obj.palyload || "%%",
				topic: obj.topic || "%%"
			})
			var tupleTemplate = new ts.XTupleTemplate(obj.sourceId, obj.targetId, obj.payload, obj.topic);
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
			dojo.mixin(obj, {
				sourceId: "%%",
				targetId: obj.targetId || "%%",
				payload: obj.palyload || "%%",
				topic: obj.topic || "%%"
			})
			var tupleTemplate = new ts.XTupleTemplate(obj.sourceId, obj.targetId, obj.payload, obj.topic);
			tupleSpace.takep(tupleTemplate, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Takep: " + t[0].uuid);
					}
				}
			}));
		},
		
		testReadLatest: function() {
			this.messagePane.innerHTML = "";
			var obj = this._getObjectFromParam();
			dojo.mixin(obj, {
				sourceId: "%%",
				targetId: obj.targetId || "%%",
				payload: obj.palyload || "%%",
				topic: obj.topic || "%%"
			})
			var tupleTemplate = new ts.XTupleTemplate(obj.sourceId, obj.targetId, obj.payload, obj.topic);
			tupleSpace.readLatest(tupleTemplate, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Read Latest: " + t[0].uuid);
					}
				}
			}));
		},
		
		testTakeLatest: function() {
			this.messagePane.innerHTML = "";
			var obj = this._getObjectFromParam();
			dojo.mixin(obj, {
				sourceId: "%%",
				targetId: obj.targetId || "%%",
				payload: obj.palyload || "%%",
				topic: obj.topic || "%%"
			})
			var tupleTemplate = new ts.XTupleTemplate(obj.sourceId, obj.targetId, obj.payload, obj.topic);
			tupleSpace.takeLatest(tupleTemplate, dojo.hitch(this, function(t, err) {
				if (!err) {
					if (t.length > 0) {
						this._showMessage("Take Latest: " + t[0].uuid);
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