module.exports = function (grunt) {
	/** Load built-in grunt task from intern. */
	grunt.loadNpmTasks( "intern" );

	/** Load task for uploading coverage reports to coveralls.io. */
	grunt.loadNpmTasks( "grunt-coveralls" );

	grunt.initConfig({
		/** Intern config: one sub-task for client unit tests and one sub-task for functional tests. */
		intern: {
			client: {
				options: {
					runType: "client",
					config: "tests/intern",
					reporters: [ "combined", "lcov" ]
				}
			},
			runner: {
				options: {
					runType: "runner",
					config: "tests/intern",
					reporters: [ "combined", "lcov" ]
				}
			}
		},
		coveralls: {
			all: {
				src: "./lcov.info",
				force: true
			}
		}
	});

	/** Main task for local testing. */
	grunt.registerTask( "test", function () {
		grunt.task.run( "delete-coverage-reports" );
		grunt.task.run( "intern" );
	});

	/** Aliases for both sub-tasks. */
	grunt.registerTask( "test:client", "intern:client" );
	grunt.registerTask( "test:runner", "intern:runner" );

	/** Make "test" task the default task for "grunt" command. */
	grunt.registerTask( "default", [ "test" ] );

	/** Deletes coverage-final.json, so combined coverage will be accurate. */
	grunt.registerTask( "delete-coverage-reports", function () {
		try {
			require( "fs" ).unlinkSync( "coverage-final.json" );
		} catch ( i ) {}
		try {
			require( "fs" ).unlinkSync( "lcov.info" );
		} catch ( i ) {}
	});

	grunt.registerTask( "list-root-dir", function () {
		console.log( require( "fs" ).readdirSync( "." ) );
	});
};