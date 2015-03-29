Work in progress, not yet usable.

Build status
============
[![Sauce Test Status](https://saucelabs.com/browser-matrix/qunit-dn.svg)](https://saucelabs.com/u/qunit-dn)

Installation
============
Installation via Bower:
```sh
bower install qunit-desktop-notifications
```

Or download [from GitHub](https://github.com/cezarykluczynski/qunit-desktop-notifications/tree/master/src).

Include QUnit Desktop Notifications in you page, after QUnit:
```html
<link href="path/to/qunit.css" rel="stylesheet">
<script src="path/to/qunit.js"></script>
<link href="path/to/qunit-desktop-notifications.css" rel="stylesheet">
<script src="path/to/qunit-desktop-notifications.js"></script>
```

Configuration
=============
QUnit Desktop Notifications has to be configured before QUnit.start() is called.
If you call QUnit.start() explicitly, just call options method of QUnit Desktop Notifications
before you call QUnit.start(). Otherwise, configuration should be included right after
plugin inclusion.

Available configuration:

```javascript
QUnitDesktopNotifications.options({
	disabled: false, // whether the plugin should be disabled
	urlConfig: true  // whether to add URL config item to QUnit toolbar
})
```

Profiles
========
Profiles are a way to configure what kind of events will generate desktop notifications.

Development
===========
If you would like to participate in development of this plugin install repository:

```sh
npm install --global bower grunt-cli selenium-standalone@latest
npm install
bower install
selenium-standalone install
```

Running tests
=============
Unit tests are run using Node.

Functional tests are run using local Selenium WebDriver.

To run all tests:
```sh
grunt test
```

To run unit tests using Node:
```sh
grunt test:client
```

To run functional test using Selenium WebDriver:
```sh
selenium-standalone start # start Selenium Server
grunt test:runner # run tests when Selenium Server started
```

To run all test using SauceLabs:
```sh
node_modules/.bin/intern-runner config=tests/intern-ci
```

Known issues
============
* Stop local Selenium server before running Sauce Labs tests from local machine.
Also stop SauceLabs tests before starting local server, as both use the same port.