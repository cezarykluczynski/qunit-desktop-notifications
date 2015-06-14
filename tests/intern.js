define({
	suites: [
		"tests/unit/smoke",
		"tests/unit/environment",
		"tests/unit/messages",
		"tests/unit/profile"
	],
	proxyPort: 9090,
	proxyUrl: "http://localhost:9090/",
	capabilities: {
		"selenium-version": "2.45.0"
	},
	/** "Chrome", nor "Firefox", won't work here. */
	environments: [
		{ browserName: "chrome" }
	],
	maxConcurrency: 1,
	functionalSuites: [
		"tests/functional/edit",
		"tests/functional/new",
		"tests/functional/delete",
		"tests/functional/register",
		"tests/functional/initialization",
		"tests/functional/localStorage",
		"tests/functional/panel"
	],
	excludeInstrumentation: /tests|node_modules|bower_components/
});