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
	environments: [
		{ browserName: "Firefox" },
		{ browserName: "Chrome" }
	],
	maxConcurrency: 1,
	functionalSuites: [
		"tests/functional/register",
		"tests/functional/initialization",
		"tests/functional/localStorage"
	],
	excludeInstrumentation: /^(node_modules|bower_components|tests)/
});