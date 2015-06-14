define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var boilerplate = testHelper.getAppUrl( "boilerplate.html" );

	registerSuite({
		name: "New profile",

		"Profile can be created.": function () {
			var self = this;

			return this.remote
				.get( boilerplate )
				.setFindTimeout( 1000 )
				/** Open panel by clicking entry. */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Open new profile to edit. */
				.findById( "qunit-desktop-notifications-panel" )
				.findByCssSelector( "button[action=new]" )
					.click()
					.end()
				/** Check if input was focused. */
				.execute( function () {
					return document.activeElement.getAttribute( "name" );
				})
				.then( function ( activeElementName ) {
					assert.equal( activeElementName, "name" );
				})
				/** Assert that "Save" button is disabled when no name is typed. */
				.findByCssSelector( "button[action=\"save\"]" )
					.isEnabled()
					.then( function ( enabled ) {
						assert.notOk( enabled );
					})
					.end()
				/** Enter profile name. */
				.findByCssSelector( "input[name=\"name\"]" )
					.type( "Test" )
					.end()
				/** Assert that "Save" button is enabled when name is typed. */
				.findByCssSelector( "button[action=\"save\"]" )
					.isEnabled()
					.then( function ( enabled ) {
						assert.ok( enabled );
					})
					.end()
				/** Find option, and assert it's label. */
				.findByCssSelector( "select option[value=\"test\"]" )
					.getVisibleText()
					.then( function ( text ) {
						assert.equal( text, "test" );
					})
					.end()
				/** Select two events. */
				.findByCssSelector( ".events-wrapper" )
					.isDisplayed()
					.then( function ( visible ) {
						assert.ok( visible );
					})
					.findByCssSelector( "[qdn-event=\"begin\"]" )
						.click()
						.end()
					.findByCssSelector( "[qdn-event=\"done\"]" )
						.click()
						.end()
					.end()
				/** Save profile. */
				.findByCssSelector( "button[action=save]" )
					.click()
					.end()
				/** Get profiles from local storage. */
				.execute( function () {
					return JSON.parse( QUnitDesktopNotifications.utils.localStorage( "profiles" ) );
				})
				/** Assert that the profile was saved. */
				.then( function ( profiles ) {
					assert.deepEqual( profiles.test, {
							begin: true,
							done: true,
							log: false,
							moduleDone: false,
							moduleStart: false,
							testDone: false,
							testStart: false
					}, "Profile saved to localStorage." );
				})
				/** Find option again, and assert it's been keept in select. */
				.findByCssSelector( "select option[name=\"test\"]" )
					.getVisibleText()
					.then( function ( text ) {
						assert.equal( text, "test" );
					})
					.end()
		}
	});
});