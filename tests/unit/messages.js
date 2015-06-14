var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"src/qunit-desktop-notifications"
], function ( registerSuite, assert, require, qunit ) {
	var n = self.QUnitDesktopNotifications.notifications;

	registerSuite({
		name: "Messages.",

		"begin": function () {
			assert.equal( n.getMessageTitle( "begin", {} ), "Tests began." );

			assert.equal( n.getMessageBody( "begin", { totalTests: 0 } ), "No tests are scheduled." );
			assert.equal( n.getMessageBody( "begin", { totalTests: 1 } ), "1 test is scheduled." );
			assert.equal( n.getMessageBody( "begin", { totalTests: 2 } ), "2 tests are scheduled." );
		},
		done: function () {
			assert.equal( n.getMessageTitle( "done", { failed: 0 } ), "Tests are done, without errors." );
			assert.equal( n.getMessageTitle( "done", { failed: 1 } ), "Tests are done, with errors." );

			assert.equal( n.getMessageBody( "done", { total: 0, passed: 0, failed: 0 } ),
				"No tests executed, 0 passed, 0 failed." );
			assert.equal( n.getMessageBody( "done", { total: 1, passed: 1, failed: 0 } ),
				"1 test executed, 1 passed, 0 failed." );
			assert.equal( n.getMessageBody( "done", { total: 1, passed: 0, failed: 1 } ),
				"1 test executed, 0 passed, 1 failed." );
			assert.equal( n.getMessageBody( "done", { total: 2, passed: 2, failed: 0 } ),
				"2 tests executed, 2 passed, 0 failed." );
			assert.equal( n.getMessageBody( "done", { total: 2, passed: 1, failed: 1 } ),
				"2 tests executed, 1 passed, 1 failed." );
			assert.equal( n.getMessageBody( "done", { total: 2, passed: 0, failed: 2 } ),
				"2 tests executed, 0 passed, 2 failed." );
		}

	});
});