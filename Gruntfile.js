module.exports = function (grunt) {
	/** Load built-in grunt task from intern. */
	grunt.loadNpmTasks( "intern" );

	grunt.initConfig({
		/** Intern config: one sub-task for client unit tests and one sub-task for functional tests. */
		intern: {
			client: {
				options: {
					runType: "client",
					config: "tests/intern",
					reporters: [ "combined" ]
				}
			},
			runner: {
				options: {
					runType: "runner",
					config: "tests/intern",
					reporters: [ "combined" ]
				}
			}
		}
	});

	/** Main task for testing. */
	grunt.registerTask( "test", function () {
		grunt.task.run( "delete-coverage-final" );
		grunt.task.run( "intern" );
	});

	/** Aliases for both sub-tasks. */
	grunt.registerTask( "test:client", "intern:client" );
	grunt.registerTask( "test:runner", "intern:runner" );

	/** Make "test" task the default task for "grunt" command. */
	grunt.registerTask( "default", [ "test" ] );

	/** Deletes coverage-final.json, so combined coverage will be accurate. */
	grunt.registerTask( "delete-coverage-final", function () {
		try {
			require( "fs" ).unlinkSync( "coverage-final.json" );
		} catch ( i ) {}
	});
};