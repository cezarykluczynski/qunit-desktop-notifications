define({
	suites: [
		"tests/unit/smoke"
	],
	proxyPort: 9090,
	proxyUrl: "http://localhost:9090/",
	capabilities: {
		"selenium-version": "2.45.0"
	},
	environments: [
		{ browserName: "firefox" },
		{ browserName: "internet explorer" },
		{ browserName: "chrome" }
	],
	maxConcurrency: 1,
	loader: {
		packages: [
			{ name: "app", location: "src/" },
			{ name: "tests", location: "tests/" }
		]
	},
	functionalSuites: [],
	excludeInstrumentation: /^(node_modules|bower_components|tests)/
});