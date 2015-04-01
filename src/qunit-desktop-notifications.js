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
	$entry: null,
	$panel: null,
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

	this.decideURLConfigItem();
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
	if ( this.config.disabled === true ) {
		return false;
	}

	/** If there is not localStorage, there is not possibility to write profiles. */
	if ( this.utils.localStorage() === false ) {
		console.error( "This browser does not support localStorage, and QUnit Desktop Notifications won't work " +
			"without it." );

		return false;
	}

	/** Don't start multiple times, because QUnit handlers should be registered only once. */
	if ( this._started ) {
		console.warn( "QUnit Desktop Notifications should be started once." );

		return false;
	}

	/** After initial validation, now it's considered started. */
	this._started = true;

	return true;
}

/** Adds handlers for all QUnit event. */
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

/** Local storage utility: getter, setter and detector. */
QUnitDesktopNotifications.utils.localStorage = function ( key, value ) {
	/** Return false if local storage is not available in the browser. */
	if ( ! this.localStorageAvailable() ) {
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

/** Returns false if local storage is not available in the browser, true otherwise. */
QUnitDesktopNotifications.utils.localStorageAvailable = function () {
	return 'localStorage' in window;
};

QUnitDesktopNotifications.options = function ( options ) {
	/**
	 * Iterate over properties in default config and overwrite every property found if it's found in
	 * QUnitDesktopNotifications config.
	 */
	for ( var i in options ) {
		if ( this.config.hasOwnProperty( i ) ) {
			this.config[ i ] = options[ i ];

			/** If we have to disable plugin or not prepend URL config item,
			 *  URL config presence should be validated. */
			if ( [ "disabled", "urlConfig" ].indexOf( i ) > -1 ) {
				this.decideURLConfigItem();
			}
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

/** First minute or last minute change of URL item presence. */
QUnitDesktopNotifications.decideURLConfigItem = function () {
	/** Whether to mount or dismount URL item from QUnit. */
	var mount = this.config.disabled === false && this.config.urlConfig === true;

	/* Try to find URL item among existing items. */
	for ( var i = 0; i < QUnit.config.urlConfig.length; i++ ) {
		if ( QUnit.config.urlConfig[ i ].id === "dnp" ) {
			/** If item was found and it should not be there, remove it. */
			if ( ! mount ) {
				QUnit.config.urlConfig.splice( i, 1 );
			}

			return;
		}
	}

	/** Register urlConfig entry that will let switch profiles. */
	QUnit.config.urlConfig.push({
		/** Short for "desktop notifications profile". */
		id: "dnp",
		/** Label will also be a entry point for profiles configurator. */
		label: "<a id=\"qunit-desktop-notifications-entry\" href=\"javascript:void(0)\">" +
			"Desktop Notifications</a> profile",
		tooltip: "Profiles can be configured when Desktop Notifications link is clicked. If no profile is " +
			"selected, the first profile on the list is treated as default. Page reload is required for this " +
			"list to refresh available profiles.",
		value: this.profiles.names()
	});
};

QUnitDesktopNotifications.prependLinkToDom = function () {
	/** Return if URL config item should be left when it is, and not replaced by only a link to panel. */
	if ( this.config.urlConfig ) {
		return;
	}

	/** Add new entry, containing only a link. */
	var link = document.createElement( "a" );
	link.innerText = "Desktop Notifications";
	link.href = "javascript:void(0)";
	link.id = "qunit-desktop-notifications-entry";
	document.getElementById( "qunit-testrunner-toolbar" ).appendChild( link );
};

QUnitDesktopNotifications.addDomHandlers = function () {
	this.$entry = document.getElementById( "qunit-desktop-notifications-entry" );

	if ( ! this.$entry ) {
		return;
	}

	/** Add handler, for when the link is clicked, desktop notifications config panel should toggle. */
	this.$entry.addEventListener( "click", function () {
		QUnitDesktopNotifications.togglePanel();
	});
};

/** Shows or hides panel. */
QUnitDesktopNotifications.togglePanel = function () {
	if ( this.$panel === null ) {
		this.createPanel();
	}

	var display = this.$panel.style.display === "none" ? "block" : "none";

	/** Show panel if it's hidden, hide panel is it's shown. */
	this.$panel.style.display = display;

	if ( display === "block" ) {
		this.setPanelPosition();
	}
};

/** One time panel creation, called on first click. */
QUnitDesktopNotifications.createPanel = function () {
	/** Create panel wrapper, add a class, and an ID. */
	this.$panel = document.createElement( "div" );
	this.$panel.setAttribute( "id", "qunit-desktop-notifications-panel" );

	/** Add wrapper to DOM. */
	document.body.appendChild( this.$panel );

	/** Set display to none, this.togglePanel() will set it to block. */
	this.$panel.style.display = "none";
};

/** Panel positioning, called each time panel is being shown. */
QUnitDesktopNotifications.setPanelPosition = function () {
	/** Get position of entry link. */
	var left = this.$entry.offsetLeft;
	var top = this.$entry.offsetTop;

	/** Get height of entry link. */
	var height = parseInt( getComputedStyle( this.$entry ).height, 10 );

	/** Position panel relative to entry link: a full height lower and a full height to the left. */
	this.$panel.style.left = "" + ( left - height ) + "px";
	this.$panel.style.top = "" + ( top + height ) + "px";
};

QUnitDesktopNotifications.profiles = {
	names: function () {
		return  [ "default" ];
	}
};

/** In case QUnit was not found, generate error and don't initialize desktop notifications. */
if ( typeof window.QUnit === "undefined" ) {
	console.error( "QUnit Desktop Notifications should be included after QUnit." );
} else if ( self.start() === true ) {
	QUnit.begin( function () {
		self.prependLinkToDom();
		self.addDomHandlers();
		self.log.begin();
	});
}

/** Expose QUnitDesktopNotification as global property. */
window.QUnitDesktopNotifications = QUnitDesktopNotifications;

})( this );