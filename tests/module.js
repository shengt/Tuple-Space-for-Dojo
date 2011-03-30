dojo.provide("nz.ac.auckland.tests.module");

try {
	dojo.require("nz.ac.auckland.tests.TupleSpace");
	dojo.require("nz.ac.auckland.tests.XTupleSpace");
	doh.registerUrl("Tuple Space: Inter-widget Communication", dojo.moduleUrl("nz.ac.auckland", "tests/test_InterWidgetCommunication.html"), 3600000);
	doh.registerUrl("Tuple Space: Map-widget Communication", dojo.moduleUrl("nz.ac.auckland", "tests/test_MapWidgetCommunication.html"), 3600000);
} catch (e) {
	doh.debug(e);
}
