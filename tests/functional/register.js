define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var url = testHelper.getAppUrl( "register.html" );

	registerSuite({
		name: 'Registering within QUnit',

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