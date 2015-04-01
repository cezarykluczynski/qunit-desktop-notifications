define({
	suites: [
		"tests/unit/smoke",
		"tests/unit/environment"
	],
	proxyPort: 9090,
	proxyUrl: "http://localhost:9090/",
	capabilities: {
		"selenium-version": "2.45.0"
	},
	/** "Chrome", nor "Firefox", won't work here. */
	environments: [
		{ browserName: "firefox" },
		{ browserName: "chrome" }
	],
	maxConcurrency: 1,
	functionalSuites: [
		"tests/functional/register",
		"tests/functional/initialization",
		"tests/functional/localStorage",
		"tests/functional/panel"
	],
	excludeInstrumentation: /^(node_modules|bower_components|tests)/
});