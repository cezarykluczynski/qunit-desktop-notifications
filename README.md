Work in progress, not yet usable.

Installation
============

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