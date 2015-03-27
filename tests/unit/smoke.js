var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"src/qunit-desktop-notifications"
], function ( registerSuite, assert, require, qunit ) {
	registerSuite({
		name: "Smoke test",
		"QUnitDesktopNotifications is created.": function () {
			/** Smoke test checking if QUnitDesktopNotifications is executed without syntax errors */
			assert.equal( typeof self.QUnitDesktopNotifications, "object", "OK" );
		},
		"QUnitDesktopNotifications is exposed as window property.": function () {
			/** Smoke test checking kind of the same as the previous test, but with browser context. */
			if ( typeof window !== "undefined" ) {
				assert.equal( typeof window.QUnitDesktopNotifications, "object", "OK" );
			} else {
				this.skip( "Browser context required, but missing." );
			}
		}
	});
});