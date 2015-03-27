/**
 * QUnit Desktop Notifications v0.0.1-pre.1
 *
 * https://github.com/cezarykluczynski/qunit-desktop-notifications
 *
 * Copyright 2015 Cezary Kluczyński
 * Released under the MIT license.
 * https://github.com/cezarykluczynski/qunit-desktop-notifications/blob/master/LICENSE.txt
 */
( function( window ) {
"use strict";

/** Main plugin object, also exposed as "self" for convenience. */
var self, QUnitDesktopNotifications;
self = QUnitDesktopNotifications = {
	_started: false,
	utils: {},
	config: {
		urlConfig: true,
		disabled: false
	}
};

/** Plugin initializer, should be called only once. */
QUnitDesktopNotifications.start = function () {
	if ( this.validateEnvironment() === false ) {
		return false;
	}

	this.prependToDom();
	this.addQUnitHandlers();

	return true;
};

/**
 * Validates environment: checks for QUnit presence, localStorage presence, and whether the plugin should even
 * be initialized.
 */
QUnitDesktopNotifications.validateEnvironment = function () {
		/** This is not a browser context, fail silently. */
	if ( ! window.document ) {
		return false;
	}

	/** Configured not to run, do nothing. */
	if ( this.config.on === false ) {
		return false;
	}

	/** Don't start multiple times, because QUnit handlers should be registered only once. */
	if ( this._started ) {
		console.warn( "QUnit Desktop Notifications should be started once." );

		return false;
	}

	/** If there is not localStorage, there is not possibility to write profiles. */
	if ( this.utils.localStorage() === false ) {
		console.error( "This browser does not support localStorage, and QUnit Desktop Notifications won't work " +
			"without it." );

		return false;
	}

	/** After initial validation, now it's considered started. */
	this._started = true;

	return true;
}

QUnitDesktopNotifications.addQUnitHandlers = function () {
	QUnit.done( function () {
		self.log.done();
	});

	QUnit.log( function () {
		self.log.log();
	});

	QUnit.moduleDone( function () {
		self.log.moduleDone();
	});

	QUnit.moduleStart( function () {
		self.log.moduleStart();
	});

	QUnit.testDone( function () {
		self.log.testDone();
	});

	QUnit.testStart( function () {
		self.log.testStart();
	});
}

QUnitDesktopNotifications.utils.localStorage = function ( key, value ) {
	/** Return false if local storage is not available in the browser. */
	if ( ! 'localStorage' in window ) {
		return false;
	}

	/** Prefix key for accidental collisions with other software using local storage. */
	key = this.localStoragePrefix() + key;

	if ( arguments.length > 1 ) {
		/** Act as a setter when value is passed. */
		return localStorage.setItem( key, value );
	} else if ( arguments.length === 1 ) {
		/** Act as a getter when there is no value passed. */
		return localStorage.getItem( key );
	} else if ( ! arguments.length ) {
		/** Confirm that localStorage is available, when there were no arguments passed. */
		return true;
	}
};

/** Returns key prefix for all data stored by this plugin. */
QUnitDesktopNotifications.utils.localStoragePrefix = function () {
	return "qunit-desktop-notifications-";
};

QUnitDesktopNotifications.options = function ( options ) {
	/**
	 * Iterate over properties in default config and overwrite every property found if it's found in
	 * QUnitDesktopNotifications config.
	 */
	for ( var i in options ) {
		if ( i in this.config && this.config.hasOwnProperty( i ) ) {
			config[ i ] = this.config[ i ];
		}
	}
};

QUnitDesktopNotifications.log = {
	begin: function () {},
	done: function () {},
	log: function () {},
	moduleDone: function () {},
	moduleStart: function () {},
	testDone: function () {},
	testStart: function () {}
};

QUnitDesktopNotifications.prependToDom = function () {
	if ( this.config.urlConfig ) {
		/** Register urlConfig entry that will let switch profiles. */
		QUnit.config.urlConfig.push({
			/** Short for "desktop notifications profile". */
			id: "dnp",
			/** Label will also be a entry point for profiles configurator. */
			label: "<a id=\"qunit-desktop-notifications-entry\" href=\"javascript:void(0)\">" +
				"Desktop Notifications</a> profile",
			tooltip: "Profiles can be configured when Desktop Notifications link is clicked. If no profile is " +
				"selected, the first profile on the list is treated as default. Page reload is required for this list" +
				"to refresh available profiles.",
			value: this.profiles.names()
		});
	} else {
		var link = document.createElement( "a" );
		link.innerText = "Desktop Notifications";
		link.href = "javascript:void(0)";
		link.id = "qunit-desktop-notifications-entry";
		document.getElementById( "qunit-testrunner-toolbar" ).appendChild( link );
	}
};

QUnitDesktopNotifications.addDomHandlers = function () {
	var link = document.getElementById( "qunit-desktop-notifications-entry" );

	link.addEventListener( "click", function () {
		/** @todo Open configuration panel. */
	});
};

QUnitDesktopNotifications.profiles = {
	names: function () {
		return  [ "default" ];
	}
};

/** In case QUnit was not found, generate error and don't initialize desktop notifications. */
if ( typeof window.QUnit === "undefined" ) {
	console.error( "QUnit Desktop Notifications should be included after QUnit." );
} else {
	if ( self.start() === true ) {
		QUnit.begin( function () {
			self.addDomHandlers();
			self.log.begin();
		});
	}
}

/** Expose QUnitDesktopNotification as global property. */
window.QUnitDesktopNotifications = QUnitDesktopNotifications;

})( this );