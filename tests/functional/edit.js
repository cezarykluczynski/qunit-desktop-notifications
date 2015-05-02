define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var boilerplate = testHelper.getAppUrl( "boilerplate.html" );

	registerSuite({
		name: "Editing",

		/** Check if the profile can be saved. */
		"Profile can be edited, then saved.": function () {
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
				.findByCssSelector( "button[action=edit]" )
					.click()
					.end()
				/** Check of one element is checked when editing default profile. */
				.findAllByCssSelector( ".events-wrapper > li > input:checked" )
					.then( function ( elements ) {
						assert.equal( elements.length, 1, "One element checked." );
					})
					.end()
				/** Select another QUnit event by clicking on checkbox. */
				.findByCssSelector( "input[qdn-event=begin]" )
					.click()
					.end()
				/** Save profile. */
				.findByCssSelector( "button[action=save]" )
					.click()
					.end()
				/** Get profiles from local storage. */
				.execute( function () {
					return JSON.parse( QUnitDesktopNotifications.utils.localStorage( "profiles" ) );
				})
				.then( function ( profiles ) {
					assert.deepEqual( profiles, {
						"default": {
							begin: true,
							done: true,
							log: false,
							moduleDone: false,
							moduleStart: false,
							testDone: false,
							testStart: false
						},
						"silent": {}
					}, "Profiles saved to localStorage." );
				});
		}
	});
});