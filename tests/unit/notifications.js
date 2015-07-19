var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"src/qunit-desktop-notifications"
], function ( registerSuite, assert, require, qUnitDesktopNotifications ) {
	registerSuite({
		name: "Notifications",

		"Error is generated for missing Notifications object.": function () {
			if ( typeof window !== "undefined" ) {
				this.skip( "Node context required, but missing." );

				return;
			}

			assert.isFalse( QUnitDesktopNotifications.askNotificationsPermission() );
		},

		/** Check if permisions are asked when Notification.permission is set to "default". */
		"Permissions are asked then Notification object is present.": function () {
			if ( typeof window !== "undefined" ) {
				this.skip( "Node context required, but missing." );

				return;
			}

			var ok = false;

			self.Notification = {
				permission: "default",
				requestPermission: function () {
					ok = true;
				}
			};

			assert.isUndefined( QUnitDesktopNotifications.askNotificationsPermission() );
			assert.isTrue( ok );

			self.Notification = undefined;
		},

		/**
		 * Check if addNotification returns undefined instead of window.Notification instance, if notification
		 * shouldn't be generated.
		 */
		"Notification message won't be generated if notifications can't be added.": function () {
			/** Mock. */
			var canNotify = QUnitDesktopNotifications.canNotify;
			QUnitDesktopNotifications.canNotify = function () {
				return false;
			};

			assert.isUndefined( QUnitDesktopNotifications.notifications.addNotification() );

			/** Revert mock. */
			QUnitDesktopNotifications.canNotify = canNotify;
		},

		/** Check correct notification for "begin" event. */
		"Notification can be added for started tests.": function () {
			/** Mock. */
			var canNotify = QUnitDesktopNotifications.canNotify;
			var shouldNotify = QUnitDesktopNotifications.profiles.shouldNotify;
			QUnitDesktopNotifications.profiles.shouldNotify = QUnitDesktopNotifications.canNotify = function () {
				return true;
			};

			var ok = false;

			self.Notification = function ( message, optionalData ) {
				assert.equal( message, "Tests began." );
				assert.equal( optionalData.body, "2 tests are scheduled." );
				assert.equal( optionalData.icon, QUnitDesktopNotifications.notifications.icons.info );

				ok = true;
			};

			QUnitDesktopNotifications.notifications.addNotification( "begin", {
				totalTests: 2,
			});

			if ( false === ok ) {
				assert.ok( false, "window.Notification not fired." );
			}

			/** Revert mock. */
			QUnitDesktopNotifications.canNotify = canNotify;
			QUnitDesktopNotifications.profiles.shouldNotify = shouldNotify;
		},

		/** Check correct notification for "done" event. */
		"Notification can be added for done tests, without fails.": function () {
			/** Mock. */
			var canNotify = QUnitDesktopNotifications.canNotify;
			var shouldNotify = QUnitDesktopNotifications.profiles.shouldNotify;
			QUnitDesktopNotifications.profiles.shouldNotify = QUnitDesktopNotifications.canNotify = function () {
				return true;
			};

			var ok = false;

			self.Notification = function ( message, optionalData ) {
				assert.equal( message, "Tests are done, without errors." );
				assert.equal( optionalData.body, "2 tests executed, 2 passed, 0 failed." );
				assert.equal( optionalData.icon, QUnitDesktopNotifications.notifications.icons.tick );

				ok = true;
			};

			QUnitDesktopNotifications.notifications.addNotification( "done", {
				failed: 0,
				total: 2,
				passed: 2,
			});

			if ( false === ok ) {
				assert.ok( false, "window.Notification not fired." );
			}

			/** Revert mock. */
			QUnitDesktopNotifications.canNotify = canNotify;
			QUnitDesktopNotifications.profiles.shouldNotify = shouldNotify;
		},

		/** Check correct notification for "done" event. */
		"Notification can be added for done tests, with fails.": function () {
			/** Mock. */
			var canNotify = QUnitDesktopNotifications.canNotify;
			var shouldNotify = QUnitDesktopNotifications.profiles.shouldNotify;
			QUnitDesktopNotifications.profiles.shouldNotify = QUnitDesktopNotifications.canNotify = function () {
				return true;
			};

			var ok = false;

			self.Notification = function ( message, optionalData ) {
				assert.equal( message, "Tests are done, with errors." );
				assert.equal( optionalData.body, "2 tests executed, 1 passed, 1 failed." );
				assert.equal( optionalData.icon, QUnitDesktopNotifications.notifications.icons.error );

				ok = true;
			};

			QUnitDesktopNotifications.notifications.addNotification( "done", {
				failed: 1,
				total: 2,
				passed: 1,
			});

			if ( false === ok ) {
				assert.ok( false, "window.Notification not fired." );
			}

			/** Revert mock. */
			QUnitDesktopNotifications.canNotify = canNotify;
			QUnitDesktopNotifications.profiles.shouldNotify = shouldNotify;
		}
	});
});