/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"btpacademy/easyapp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
