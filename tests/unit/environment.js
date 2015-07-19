var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, qUnitDesktopNotifications ) {
	registerSuite({
		name: "Plugin behaves differently based on environment.",

		/** Test if no document in window results in validateEnvironment() returning false. */
		"QUnitDesktopNotifications.validateEnvironment() returns false when there is no document.": function () {
			if ( typeof window === "undefined" ) {
				assert.isFalse( self.QUnitDesktopNotifications.validateEnvironment(), "OK: false returned." );
			} else {
				this.skip( "Node context required, but missing." );
			}
		}
	});
});