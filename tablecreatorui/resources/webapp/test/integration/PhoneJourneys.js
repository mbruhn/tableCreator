jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"creator/test/integration/NavigationJourneyPhone",
		"creator/test/integration/NotFoundJourneyPhone",
		"creator/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});