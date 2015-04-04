define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var boilerplate = testHelper.getAppUrl( "boilerplate.html" );
	var stopped = testHelper.getAppUrl( "stopped.html" );

	registerSuite({
		name: "Registering within QUnit",

		/** Check if link to profile configuration is added. */
		"Entry point is added to DOM.": function () {
			return this.remote
				.get( boilerplate )
				.setFindTimeout( 1000 )
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
				.get( boilerplate )
				.setFindTimeout( 1000 )
				.findByCssSelector( "body" )
				.findById( "qunit-testrunner-toolbar" )
				.findByCssSelector( "#qunit-urlconfig-dnp" )
				.getSpecAttribute( "title" )
				.then( function ( title ) {
					assert.include( title, "Desktop Notifications" );
				});
		},

		/** Check if url config item is prepended to QUnit toolbar. */
		"No URL config item is added.": function () {
			return this.remote
				.get( stopped )
				.setFindTimeout( 1000 )
				.execute( function () {
					/** Don't prepend URL config item. */
					QUnitDesktopNotifications.options({
						urlConfig: false
					});

					QUnit.start();
				})
				/** Check if no URL item was created. */
				.waitForDeletedByCssSelector( "#qunit-urlconfig-dnp" )
				.then( function ( ) {
					assert.ok( true, "No URL config entry created." );
				})
				/** Check if link to panel was created. */
				.findById( "qunit-desktop-notifications-entry" )
				.then( function () {
					assert.ok( true, "Link to panel created." );
				});
		}
	});
});