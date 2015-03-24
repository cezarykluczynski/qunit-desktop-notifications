var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"src/qunit-desktop-notifications"
], function ( registerSuite, assert, require, qunit, qunitDesktopNotifications ) {
	registerSuite({
		name: "Smoke test",
		"QUnitDesktopNotifications is created.": function () {
			assert.equal( typeof self.QUnitDesktopNotifications, "object", "OK" );
		},
		"QUnitDesktopNotifications is exposed as window property.": function () {
			if ( typeof window !== "undefined" ) {
				assert.equal( typeof window.QUnitDesktopNotifications, "object", "OK" );
			} else {
				this.skip( "Browser context required, but missing." );
			}
		}
	});
});