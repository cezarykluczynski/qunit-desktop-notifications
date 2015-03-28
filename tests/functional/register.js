define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var url = testHelper.getAppUrl( "boilerplate.html" );

	registerSuite({
		name: "Registering within QUnit.",

		/** Check if link to profile configuration is added. */
		"Entry point is added to DOM.": function () {
			return this.remote
				.get( url )
				.setFindTimeout( 3000 )
				.findByCssSelector( "body" )
				.findById( "qunit-testrunner-toolbar" )
				.findById( "qunit-desktop-notifications-entry" )
				.getVisibleText()
				.then( function ( text ) {
					assert.strictEqual( text, "Desktop Notifications" );
				});
		},
		/** Check if url config item is prepended to QUnit toolbar. */
		"URL config item is added.": function () {
			return this.remote
				.get( url )
				.setFindTimeout( 3000 )
				.findByCssSelector( "body" )
				.findById( "qunit-testrunner-toolbar" )
				.findById( "qunit-urlconfig-dnp" )
				.getSpecAttribute( "title" )
				.then( function ( title ) {
					assert.include( title, "Desktop Notifications" );
				});
		}
	});
});