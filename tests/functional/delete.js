define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var boilerplate = testHelper.getAppUrl( "boilerplate.html" );

	registerSuite({
		name: "Deleting",

		/** Check if the profile can be saved. */
		"Default profile can't be deleted.": function () {
			var self = this;

			return this.remote
				.get( boilerplate )
				.setFindTimeout( 1000 )
				/** Open panel by clicking entry. */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Find panel entry and click it. */
				.findById( "qunit-desktop-notifications-panel" )
				/** Find select, and set it's vaule to "silent" then assert delete button state. */
				.findByCssSelector( "select" )
					.click()
					.findByCssSelector( "option[name=silent]" )
						.click()
						.end()
					.end()
				.findByCssSelector( "button[action=delete]" )
				.isEnabled()
				.then( function ( enabled ) {
					assert.ok( enabled, "Delete button is enable when \"default\" profile is not selected." );
				})
				.end()
				/** Find select, and set it's vaule to "default" then assert delete button state. */
				.findByCssSelector( "select" )
					.click()
					.findByCssSelector( "option[name=default]" )
						.click()
						.end()
					.end()
				.findByCssSelector( "button[action=delete]" )
				.isEnabled()
				.then( function ( enabled ) {
					assert.notOk( enabled, "Delete button is disabled when \"default\" profile is selected." );
				})
				.end();
		}
	});
});