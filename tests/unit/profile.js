var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"src/qunit-desktop-notifications",
	"tests/support/helper"
], function ( registerSuite, assert, require, qunit, testHelper ) {
	var basicFixture = {
		"default": {
			done: true
		},
		silent: {}
	};

	registerSuite({
		name: "Profiles getters, and setters.",

		beforeEach: function () {
			self.QUnitDesktopNotifications.profiles.profiles = testHelper.clone( basicFixture );
		},

		/** Test getter behaviour for existing value. */
		"QUnitDesktopNotifications.profiles.profile(): getter behaviour, existing value.": function () {
			assert.deepEqual( self.QUnitDesktopNotifications.profiles.profile( "default" ), {
				done: true
			}, "OK" );
		},

		/** Test getter behaviour for non-existing value. */
		"QUnitDesktopNotifications.profiles.profile(): getter behaviour, non-existing value.": function () {
			assert.equal( self.QUnitDesktopNotifications.profiles.profile( "not-here" ), null, "OK" );
		},

		/** Test setter behaviour for new value. */
		"QUnitDesktopNotifications.profiles.profile(): setter behaviour, new value.": function () {
			self.QUnitDesktopNotifications.profiles.profile( "none", {
				done: false
			});

			assert.deepEqual( self.QUnitDesktopNotifications.profiles.profile( "none" ), {
				done: false
			}, "OK" );
		},

		/** Test setter behaviour for existing value. */
		"QUnitDesktopNotifications.profiles.profile(): setter behaviour, existing value.": function () {
			self.QUnitDesktopNotifications.profiles.profile( "default", {
				done: true,
				start: true
			});

			assert.deepEqual( self.QUnitDesktopNotifications.profiles.profile( "default" ), {
				done: true,
				start: true
			}, "OK" );
		},

		/** Test delete behaviour for existing value. */
		"QUnitDesktopNotifications.profiles.profile(): delete behaviour, existing value.": function () {
			self.QUnitDesktopNotifications.profiles.profile( "default", null );

			assert.strictEqual( self.QUnitDesktopNotifications.profiles.profile( "default" ), null, "OK" );
		}
	});
});