define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var boilerplate = testHelper.getAppUrl( "boilerplate.html" );

	registerSuite({
		name: "Profiles panel",

		/** Check if the panel is created on first click on "Desktop Notifications" link. */
		"Panel is created after first click on entry link.": function () {
			var self = this;

			return this.remote
				.get( boilerplate )
				.setFindTimeout( 1000 )
				/** Check if $panel property is null at first. */
				.execute( function () {
					return QUnitDesktopNotifications.$panel;
				})
				.then( function ( $panel ) {
					assert.typeOf( $panel, "null", "Panel not created before first click on entry link." );
				})
				/** Find panel entry and click it. */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Check if $panel property is an object now. */
				.execute( function () {
					return QUnitDesktopNotifications.$panel;
				})
				.then( function ( $panel ) {
					assert.typeOf( $panel, "object", "Panel is an object after click on entry link." );
				});
		},

		/** Check if the panel can be toggled by clicking on entry link. */
		"Panel is toggled by clicking on entry link.": function () {
			var self = this;

			return this.remote
				.get( boilerplate )
				.setFindTimeout( 1000 )
				/** Check if $panel property is null at first. */
				.execute( function () {
					return QUnitDesktopNotifications.$panel;
				})
				.then( function ( $panel ) {
					assert.typeOf( $panel, "null", "Panel not created before first click on entry link." );
				})
				/** Find panel entry and click it. */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Check if panel is visible. */
				.findById( "qunit-desktop-notifications-panel" )
					.isDisplayed()
					.then( function ( visible ) {
						assert.ok( visible, "Panel is visible after first click on entry link." );
					})
					.end()
				/** Find panel entry and click it (2). */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Check if panel is visible (2). */
				.findById( "qunit-desktop-notifications-panel" )
					.isDisplayed()
					.then( function ( visible ) {
						assert.notOk( visible, "Panel is not visible after second click on entry link." );
					})
					.end()
				/** Find panel entry and click it (3). */
				.findById( "qunit-desktop-notifications-entry" )
					.click()
					.end()
				/** Check if panel is visible (3). */
				.findById( "qunit-desktop-notifications-panel" )
					.isDisplayed()
					.then( function ( visible ) {
						assert.ok( visible, "Panel is visible after third click on entry link." );
					})
					.end();
		},

		/** Check if the panel is created on first click on "Desktop Notifications" link. */
		"Panel has all the initial elements.": function () {
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
					/** Check profiles select visibility. */
					.findByTagName( "select" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Select is visible." );
						})
						.end()
					/** Check events wrapper visibility. */
					.findByCssSelector( ".events-wrapper" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.notOk( visible, "Events wrapper is not visible." );
						})
						.end()
					/** Check buttons wrapper visibility. */
					.findByCssSelector( ".buttons-wrapper" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Buttons wrapper is visible." );
						})
						.end()
					/** Check profiles label visibility. */
					.findByTagName( "label" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Label is visible." );
						})
						.getVisibleText()
						.then( function( text ) {
							assert.equal( text, "Choose profile to edit:", "Label text matched." );
						})
						.end()
				.end();
		},
		/** Check if the panel is created on first click on "Desktop Notifications" link. */
		"Toggling between editing and previewing.": function () {
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
					/** Check events wrapper visibility. */
					.findByCssSelector( ".events-wrapper" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.notOk( visible, "Events wrapper is not visible." );
						})
						.end()
					/** "Delete" button visibility check. */
					.findByCssSelector( ".button-delete" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Button \"Delete\" is visible." );
						})
						.end()
					/** "Edit" button visibility check. */
					.findByCssSelector( ".button-edit" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Button \"Edit\" is visible." );
						})
						/** Click "Edit" button. */
						.click()
						.end()
					/** Check events wrapper visibility again. */
					.findByCssSelector( ".events-wrapper" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Events wrapper is visible after \"Edit\" was clicked." );
						})
						.end()
					/** "Save" button visibility check. */
					.findByCssSelector( ".button-save" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Button \"Save\" is visible." );
						})
						.end()
					/** "Cancel" button visibility check. */
					.findByCssSelector( ".button-cancel" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.ok( visible, "Button \"Cancel\" is visible." );
						})
						/** Click "Cancel" button. */
						.click()
						.end()
					/** Check events wrapper visibility again. */
					.findByCssSelector( ".events-wrapper" )
						.isDisplayed()
						.then( function ( visible ) {
							assert.notOk( visible, "Events wrapper is not visible after \"Cancel\" was clicked." );
						})
						.end()
				.end();
		},

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
				.findByCssSelector( ".button-edit" )
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
				.findByCssSelector( ".button-save" )
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