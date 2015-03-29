Work in progress, not yet usable.

Installation
============
Installation via bower:
```sh
bower install qunit-desktop-notifications
```

Include QUnit Desktop Notifications in you page, after QUnit:
```html
<script src="path/to/qunit.js"></script>
<script src="bower_components/qunit-desktop-notifications/src/qunit-desktop-notifications.js"></script>
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