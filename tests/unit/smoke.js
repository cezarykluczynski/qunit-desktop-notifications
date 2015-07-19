var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"src/qunit-desktop-notifications"
], function ( registerSuite, assert, require, qUnitDesktopNotifications ) {
	registerSuite({
		name: "Smoke test",
		/** Smoke test checking if QUnitDesktopNotifications is executed without syntax errors */
		"QUnitDesktopNotifications is created.": function () {
			assert.equal( typeof self.QUnitDesktopNotifications, "object", "OK" );
		},
		/** Smoke test checking kind of the same as the previous test, but with browser context. */
		"QUnitDesktopNotifications is exposed as window property.": function () {
			if ( typeof window !== "undefined" ) {
				assert.equal( typeof window.QUnitDesktopNotifications, "object", "OK" );
			} else {
				this.skip( "Browser context required, but missing." );
			}
		}
	});
});