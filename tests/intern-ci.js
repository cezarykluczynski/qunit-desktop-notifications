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
	tunnel: "SauceLabsTunnel",
	tunnelOptions: {
		port: 4444
	},
	environments: [
		{ browserName: "Firefox" },
		{ browserName: "Chrome" },
		{ browserName: "Internet Explorer", platform: "Windows 8.1", version: "11" }
	],
	maxConcurrency: 3,
	functionalSuites: [
		"tests/functional/register",
		"tests/functional/initialization",
		"tests/functional/localStorage"
	],
	excludeInstrumentation: /^(node_modules|bower_components|tests)/
});