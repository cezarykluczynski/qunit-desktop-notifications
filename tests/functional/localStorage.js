define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var url = testHelper.getAppUrl( "boilerplate.html" );

	registerSuite({
		name: "localStorage utility tests",

		"QUnitDesktopNotifications.utils.localStorage getter and setter.": function () {
			var self = this;

			return this.remote
				.get( url )
				/** Check if getter and setter works. */
				.execute( function () {
					QUnitDesktopNotifications.utils.localStorage( "key", "value" );
					return QUnitDesktopNotifications.utils.localStorage( "key" );
				})
				.then( function ( value ) {
					assert.equal( value, "value", "Correct value was set, then retrieved." );
				});
		},
		"QUnitDesktopNotifications.utils.localStorage with no parameters.": function () {
			return this.remote
				.get( url )
				/** Check if utils.localStorage() withour params returns true. */
				.execute( function () {
					return QUnitDesktopNotifications.utils.localStorage();
				})
				.then( function ( result ) {
					assert.isTrue( result, "Utility without param, and with localStorage present, returns true." );
				})
				/** Check if utils.localStorage() withour params returns false, when localStorage
				 *  is removed from window. */
				.execute( function () {
					/** Overwrite function that tells whether localStorage is available in the browser. */
					QUnitDesktopNotifications.utils.localStorageAvailable = function () {
						return false;
					};

					return QUnitDesktopNotifications.utils.localStorage();
				})
				.then( function ( result ) {
					assert.isFalse( result, "Utility without param, and without localStorage present, returns false." );
				});
		}
	});
});