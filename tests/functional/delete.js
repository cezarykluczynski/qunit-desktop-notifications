define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var boilerplate = testHelper.getAppUrl( "boilerplate.html" );

	registerSuite({
		name: "Deleting",

		/** Check if the profile can be deleted. */
		"Profile can be deleted.": function () {
			return this.remote
				.get( boilerplate )
				.setFindTimeout( 3000 )
				/** Open panel by clicking entry. */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Find panel entry and click it. */
				.findById( "qunit-desktop-notifications-panel" )
				/** Find select, and set it's vaule to "silent" then assert delete button state. */
				.findByCssSelector( "select" )
					.click()
					.findByCssSelector( "option[name=\"silent\"]" )
						.click()
						.end()
					.end()
				/** Assert that the "silent" profile can be deleted, and delete it. */
				.findByCssSelector( "button[action=\"delete\"]" )
					.isEnabled()
					.then( function ( enabled ) {
						assert.ok( enabled, "Delete button is enable when \"default\" profile is not selected." );
					})
					.click()
					.end()
				/** Assert that the "silent" profile was deleted. */
				.waitForDeletedByCssSelector( "select option[name=\"silent\"]" )
				.execute( function () {
					return QUnitDesktopNotifications.utils.localStorage( "silent" );
				})
				.then( function ( silent ) {
					assert.equal( silent, null, "Item was deleted from local storage." );
				});
		},

		/** Check if the default profile can't be deleted. */
		"Default profile can't be deleted.": function () {
			return this.remote
				.get( boilerplate )
				.setFindTimeout( 3000 )
				/** Open panel by clicking entry. */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Find panel entry and click it. */
				.findById( "qunit-desktop-notifications-panel" )
				/** Find select, and set it's vaule to "default" then assert delete button state. */
				.findByCssSelector( "select" )
					.click()
					.findByCssSelector( "option[name=\"default\"]" )
						.click()
						.end()
					.end()
				.findByCssSelector( "button[action=\"delete\"]" )
				.isEnabled()
				.then( function ( enabled ) {
					assert.notOk( enabled, "Delete button is disabled when \"default\" profile is selected." );
				})
				.end();
		}
	});
});