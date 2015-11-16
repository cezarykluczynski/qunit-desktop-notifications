var self = this;

define([
	"intern!object",
	"intern/chai!assert",
	"require",
	"src/qunit-desktop-notifications"
], function ( registerSuite, assert, require, qUnitDesktopNotifications ) {
	var n = self.QUnitDesktopNotifications.notifications;

	registerSuite({
		name: "Messages.",

		"begin": function () {
			assert.equal( n.getMessageTitle( "begin", {} ), "Tests began." );

			assert.equal( n.getMessageBody( "begin", { totalTests: 0 } ), "No tests are scheduled." );
			assert.equal( n.getMessageBody( "begin", { totalTests: 1 } ), "1 test is scheduled." );
			assert.equal( n.getMessageBody( "begin", { totalTests: 2 } ), "2 tests are scheduled." );

			assert.equal( n.getMessageIcon( "begin", {} ), n.icons.info );
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

			assert.equal( n.getMessageIcon( "done", { failed: 0 } ), n.icons.tick );
			assert.equal( n.getMessageIcon( "done", { failed: 1 } ), n.icons.error );
		},
		log: function () {
			assert.equal( n.getMessageTitle( "log", { result: true } ), "Assertion passed." );
			assert.equal( n.getMessageTitle( "log", { result: false } ), "Assertion failed." );

			assert.equal( n.getMessageBody( "log", { name: "Test", result: true } ), "Assertion \"Test\" passed" );
			assert.equal( n.getMessageBody( "log", { name: "Test", result: true } ), "Assertion \"Test\" passed" );

			assert.equal( n.getMessageIcon( "log", { result: true } ), n.icons.tick );
			assert.equal( n.getMessageIcon( "log", { result: false } ), n.icons.error );
		},
		moduleStart: function () {
			assert.equal( n.getMessageTitle( "moduleStart", { name: "Tests" } ), "Module started." );

			assert.equal( n.getMessageBody( "moduleStart", { name: "Tests" } ), "Module \"Tests\" started" );

			assert.equal( n.getMessageIcon( "moduleStart", {} ), n.icons.info );
		},
		moduleDone: function () {
			assert.equal( n.getMessageTitle( "moduleDone", { name: "Tests" } ), "Module finished." );

			assert.equal( n.getMessageBody( "moduleDone", { name: "Tests", failed: 0 } ), "Module \"Tests\" passed" );
			assert.equal( n.getMessageBody( "moduleDone", { name: "Tests", failed: 1 } ), "Module \"Tests\" failed" );

			assert.equal( n.getMessageIcon( "moduleDone", { failed: 0 } ), n.icons.tick );
			assert.equal( n.getMessageIcon( "moduleDone", { failed: 1 } ), n.icons.error );
		},
		testStart: function () {
			assert.equal( n.getMessageTitle( "testStart", { name: "Tests" } ), "Test started." );

			assert.equal( n.getMessageBody( "testStart", { name: "Tests" } ), "Test \"Tests\" started" );

			assert.equal( n.getMessageIcon( "testStart", {} ), n.icons.info );
		},
		testDone: function () {
			assert.equal( n.getMessageTitle( "testDone", { name: "Tests" } ), "Test finished." );

			assert.equal( n.getMessageBody( "testDone", { name: "Tests", failed: 0 } ), "Test \"Tests\" passed" );
			assert.equal( n.getMessageBody( "testDone", { name: "Tests", failed: 1 } ), "Test \"Tests\" failed" );

			assert.equal( n.getMessageIcon( "testDone", { failed: 0 } ), n.icons.tick );
			assert.equal( n.getMessageIcon( "testDone", { failed: 1 } ), n.icons.error );
		}
	});
});
