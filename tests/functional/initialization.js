define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"tests/support/helper"
], function ( registerSuite, assert, require, testHelper ) {
	var boilerplate = testHelper.getAppUrl( "boilerplate.html" );
	var stopped = testHelper.getAppUrl( "stopped.html" );

	registerSuite({
		name: "Initialization flow",

		/** Check if link to profile configuration is added. */
		"QUnitDesktopNotifications.start() returns false is environment validation failed.": function () {
			return this.remote
				.get( boilerplate )
				.execute( function () {
					/** Replace validateEnvironment with a function that returns false. */
					QUnitDesktopNotifications.validateEnvironment = function () {
						return false;
					};

					return QUnitDesktopNotifications.start();
				})
				.then( function ( result ) {
					assert.isFalse( result, "OK: false returned." );
				});
		},

		/** Check if link to profile configuration is added. */
		"QUnitDesktopNotifications.start() cannot be called twice.": function () {
			return this.remote
				.get( boilerplate )
				.execute( function () {
					return QUnitDesktopNotifications.start();
				})
				.then( function ( result ) {
					assert.isFalse( result, "OK: false returned." );
				})
				.getLogsFor( "browser" )
				.then( function ( logs ) {
					/** Firefox does not seems to carry a relevant console entries, skip. */
					if ( this._session.capabilities.browserName === "firefox" ) {
						return;
					}

					/** Iterate over all messages to find the one with multiple start attempts warning. */
					for ( var i = 0; i < logs.length; i++ ) {
						if ( logs[ i ].message.indexOf( "QUnit Desktop Notifications should be started once." ) > -1 ) {
							assert( true, "Console warning for multiple start attempts generated." );

							/** Return if found. */
							return;
						}
					}

					/** Fail assertion is message was not found. */
					assert( false, "Console warning for multiple start attempts not generated." );
				});
		}
	});

	registerSuite({
		name: "No initialization",

		/** Check if option disabled set to true will not initialize plugin. */
		"QUnitDesktopNotifications.options({ disabled: true }) makes QUnitDesktopNotifications.validateEnvironment() returns false": function () {
			return this.remote
				.get( boilerplate )
				.execute( function () {
					/** Set disabled to true. */
					QUnitDesktopNotifications.options({
						disabled: true
					});

					return QUnitDesktopNotifications.validateEnvironment();
				})
				.then( function ( result ) {
					assert.isFalse( result, "OK: QUnitDesktopNotifications.validateEnvironment() returns false." );
				});
		},

		/** Check if option disabled set to true, when QUnit.config.autostart set to false, does not initialize
		 *  plugin. */
		"QUnitDesktopNotifications.options({ disabled: true }) does not initialize plugin.": function () {
			return this.remote
				.get( stopped )
				.execute( function () {
					/** Mark plugin as not started. */
					QUnitDesktopNotifications._started = false;

					/** Set disabled to true. */
					QUnitDesktopNotifications.options({
						disabled: true
					});

					/** Validate one more time. */
					QUnitDesktopNotifications.validateEnvironment();

					return QUnitDesktopNotifications._started;
				})
				.then( function ( result ) {
					assert.isFalse( result, "OK: QUnitDesktopNotifications._started is false." );
				})
				/** Start QUnit and check if panel link was not created. */
				.execute( function () {
					QUnit.start();

					return document.getElementById( "qunit-desktop-notifications-entry" );
				})
				.then( function ( elem ) {
					assert.isNull( elem, "No link to panel was created." );
				});
		},

		/** Check if no localStorage() keeps plugin from initializing. */
		"No localStorage() keeps plugin from initializing.": function () {
			return this.remote
				.get( stopped )
				.execute( function () {
					/** Mark plugin as not started. */
					QUnitDesktopNotifications._started = false;

					/** Make localStorage() always return false. */
					QUnitDesktopNotifications.utils.localStorage = function () {
						return false;
					};

					/** Validate one more time. */
					QUnitDesktopNotifications.validateEnvironment();

					return QUnitDesktopNotifications._started;
				})
				.then( function ( result ) {
					assert.isFalse( result, "OK: QUnitDesktopNotifications._started is false." );
				});
		}
	});
});