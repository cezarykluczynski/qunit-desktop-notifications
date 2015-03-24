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
					reporters: [ "console" ]
				}
			},
			runner: {
				options: {
					runType: "runner",
					config: "tests/intern",
					reporters: [ "console" ]
				}
			}
		}
	});

	/** Main task for testing. */
	grunt.registerTask( "test", "intern" );

	/** Aliases for both sub-tasks. */
	grunt.registerTask( "test:client", "intern:client" );
	grunt.registerTask( "test:runner", "intern:runner" );

	/** Make "test" task the default task for "grunt" command. */
	grunt.registerTask( "default", [ "test" ] );
};