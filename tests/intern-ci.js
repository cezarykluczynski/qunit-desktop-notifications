define({
	suites: [
		"tests/unit/smoke",
		"tests/unit/environment",
		"tests/unit/profile"
	],
	proxyPort: 9090,
	proxyUrl: "http://localhost:9090/",
	capabilities: {
		"selenium-version": "2.45.0"
	},
	tunnel: "SauceLabsTunnel",
	tunnelOptions: {
		port: 4444
	},
	environments: [
		{ browserName: "Firefox", os: "Windows 7", browserVersion: "37" },
		{ browserName: "Chrome" }
	],
	maxConcurrency: 3,
	functionalSuites: [
		"tests/functional/edit",
		"tests/functional/delete",
		"tests/functional/register",
		"tests/functional/initialization",
		"tests/functional/localStorage",
		"tests/functional/panel"
	],
	excludeInstrumentation: /^(node_modules|bower_components|tests)/
});