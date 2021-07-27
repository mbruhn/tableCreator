jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 tables in the list
// * All 3 tables have at least one tablefields

sap.ui.require([
	"sap/ui/test/Opa5",
	"creator/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"creator/test/integration/pages/App",
	"creator/test/integration/pages/Browser",
	"creator/test/integration/pages/Master",
	"creator/test/integration/pages/Detail",
	"creator/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "creator.view."
	});

	sap.ui.require([
		"creator/test/integration/MasterJourney",
		"creator/test/integration/NavigationJourney",
		"creator/test/integration/NotFoundJourney",
		"creator/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});