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
					/** Click "Edit" button. */
					.findByCssSelector( ".button-edit" )
						.click()
						.end()
					/** Check events wrapper visibility again. */
					.findByCssSelector( ".events-wrapper" )
					.isDisplayed()
					.then( function ( visible ) {
						assert.ok( visible, "Events wrapper is visible after \"Edit\" was clicked." );
					})
					.end()
					/** Click "Cancel" button. */
					.findByCssSelector( ".button-cancel" )
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
		}
	});
});