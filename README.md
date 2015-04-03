Work in progress, not yet usable.

Build status
============
[![Build Status](https://travis-ci.org/cezarykluczynski/qunit-desktop-notifications.svg?branch=master)](https://travis-ci.org/cezarykluczynski/qunit-desktop-notifications)

[![Sauce Test Status](https://saucelabs.com/buildstatus/qunit-dn)](https://saucelabs.com/u/qunit-dn)

[![Coverage Status](https://coveralls.io/repos/cezarykluczynski/qunit-desktop-notifications/badge.svg)](https://coveralls.io/r/cezarykluczynski/qunit-desktop-notifications)

Installation
============
Install via Bower:
```sh
bower install qunit-desktop-notifications
```

Or [download from GitHub](https://github.com/cezarykluczynski/qunit-desktop-notifications/tree/master/src).

Include QUnit Desktop Notifications after QUnit:
```html
<link href="path/to/qunit.css" rel="stylesheet">
<script src="path/to/qunit.js"></script>
<link href="path/to/qunit-desktop-notifications.css" rel="stylesheet">
<script src="path/to/qunit-desktop-notifications.js"></script>
```

Configuration
=============
QUnit Desktop Notifications has to be configured before <code>QUnit.start()</code> is called.
If you call <code>QUnit.start()</code> explicitly, just call <code>QUnitDesktopNotifications.options()</code>
before that. Otherwise, configuration would ideally be included right after plugin inclusion,
and must be included before window load event, because QUnit uses it for auto start.

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
If you would like to participate in development of this plugin, fork this repository,
clone it, then install locally:

```sh
npm install --global bower grunt-cli selenium-standalone@latest
npm install
bower install
selenium-standalone install
```

Running tests
=============
Unit tests are run using Node. Functional tests are run using local Selenium server
or Sauce Labs VM's.

To run all tests using local Selenium server:
```sh
grunt test
```

To run unit tests using Node:
```sh
grunt test:client
```

To run functional tests using local Selenium server:
```sh
selenium-standalone start # start Selenium Server
grunt test:runner # run tests when Selenium Server started
```

To run all test using Sauce Labs:
```sh
grunt intern:runner-ci
```
For that, Sauce Labs username and accesskey needs to be available as environment variables ([more on the subject, ignore the Karma part](https://docs.saucelabs.com/tutorials/js-unit-testing/#running-karma-with-the-karma-sauce-launcher-https-github-com-karma-runner-karma-sauce-launcher-plugin)).

Known issues
============
* Stop local Selenium server before running Sauce Labs tests from local machine.
Also stop or finish SauceLabs tests before starting local server, because both use the same port.
* Running <code>grunt coveralls:all</code> can cause BSOD on Windows 7.