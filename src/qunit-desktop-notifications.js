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
	$save: null,
	$cancel: null,
	$select: null,
	$delete: null,
	$profilesLabel: null,
	$buttonsWrapper: null,
	$list: null,
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

	this.profiles.init();
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
		value: this.profiles.getNames()
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
		QUnitDesktopNotifications.panel.toggle();
	});
};

QUnitDesktopNotifications.panel = {};

/** One time panel creation, called on first click. */
QUnitDesktopNotifications.panel.create = function () {
	/** Create panel wrapper, add a class, and an ID. */
	self.$panel = document.createElement( "div" );
	self.$panel.setAttribute( "id", "qunit-desktop-notifications-panel" );
	self.$panel.className = "preview";

	/** Add wrapper to DOM. */
	document.body.appendChild( self.$panel );

	/** Set display to none, self.panel.toggle() will set it to block. */
	self.$panel.style.display = "none";
};

/** Shows or hides panel. */
QUnitDesktopNotifications.panel.toggle = function () {
	if ( self.$panel === null ) {
		self.panel.create();
		self.profiles.refreshVisible();
		self.profiles.cancel();
	}

	var display = self.$panel.style.display === "none" ? "block" : "none";

	/** Show panel if it's hidden, hide panel is it's shown. */
	self.$panel.style.display = display;

	if ( display === "block" ) {
		self.panel.setPosition();
	}
};

/** Panel positioning, called each time panel is being shown. */
QUnitDesktopNotifications.panel.setPosition = function () {
	/** Get position of entry link. */
	var left = self.$entry.offsetLeft;
	var top = self.$entry.offsetTop;

	/** Get height of entry link. */
	var height = parseInt( getComputedStyle( self.$entry ).height, 10 );

	/** Position panel relative to entry link: a full height lower and a full height to the left. */
	self.$panel.style.left = "" + ( left - height ) + "px";
	self.$panel.style.top = "" + ( top + height ) + "px";
};

QUnitDesktopNotifications.profiles = {};
QUnitDesktopNotifications.profiles.profiles = {};

QUnitDesktopNotifications.profiles.init = function () {
	this.refresh();

	/** Push default profile, if it's not there already. */
	if ( ! this.profiles.hasOwnProperty( "default" ) ) {
		this.profile( "default", {
			done: true
		});
	}

	/** Push silent profile, if it's not there already. */
	if ( ! this.profiles.hasOwnProperty( "silent" ) ) {
		this.profile( "silent", {} );
	}

	if ( typeof this[ "default" ] !== "string" ) {
		this[ "default" ] = "default";
	}
};

QUnitDesktopNotifications.profiles.refresh = function () {
	this.profiles = JSON.parse( self.utils.localStorage( "profiles" ) ) || {};
};

QUnitDesktopNotifications.profiles.refreshVisible = function () {
	this.refreshLabels();
	this.refreshSelect();
	this.refreshConfig();
	this.refreshButtons();
}

QUnitDesktopNotifications.profiles.refreshSelect = function () {
	/** All profiles names. */
	var names = this.getNames();

	/** Get either the existing select, or create a new one. */
	var $select = self.$select || document.createElement( "select" );

	/** Remove all children. */
	while ( $select.firstChild ) {
		$select.removeChild( $select.firstChild );
	}

	var $option, name;

	/** Load profiles to select. */
	for ( var i = 0; i < names.length; i++ ) {
		name = names[ i ];
		$option = document.createElement( "option" );
		$option.setAttribute( "name", name );
		$option.text = name;

		$select.appendChild( $option );
	}

	self.$select = $select;

	self.$panel.appendChild( $select );
};

QUnitDesktopNotifications.profiles.refreshLabels = function () {
	if ( ! self.$profilesLabel ) {
		self.$profilesLabel = document.createElement( "label" );
	}

	self.$panel.appendChild( self.$profilesLabel );
};

/** Create HTML for profile config. */
QUnitDesktopNotifications.profiles.refreshConfig = function () {
	/** List of QUnit events names. */
	var keys = Object.keys( self.log );

	/** Declare variable early. */
	var $item, $checkbox, $label, eventName, checkboxName;

	/** Create wrapper. */
	self.$list = document.createElement( "ul" );
	self.$list.className = "events-wrapper";

	/** Create a item describing that's the deal with the list, and add it to wrapper. */
	$item = document.createElement( "li" );
	$item.innerHTML = "Notify on those QUnit events:";
	self.$list.appendChild( $item );

	/** Go over all QUnit events names. */
	for ( var i = 0; i < keys.length; i++ ) {
		eventName =  keys[ i ];
		checkboxName = "qunit-dn-checkbox-" + eventName;

		/** Create list item. */
		$item = document.createElement( "li" );

		/** Create checkbox. */
		$checkbox = document.createElement( "input" );
		$checkbox.setAttribute( "type", "checkbox" );
		$checkbox.setAttribute( "id", checkboxName );
		$checkbox.setAttribute( "qdn-event", eventName );

		/** Create label for checkbox. */
		$label = document.createElement( "label" );
		$label.innerHTML = eventName;
		$label.setAttribute( "for", checkboxName );

		/** Insert checkbox and label into list item. */
		$item.appendChild( $checkbox );
		$item.appendChild( $label );

		/** Insert list item into wrapper. */
		self.$list.appendChild( $item );
	}

	/** Insert wrapper into panel. */
	self.$panel.appendChild( self.$list );
};

/** Adds buttons to panel. */
QUnitDesktopNotifications.profiles.refreshButtons = function () {
	var profiles = this;

	if ( ! self.$buttonsWrapper ) {
		/** Create buttons wrapper, and add class. */
		self.$buttonsWrapper = document.createElement( "div" );
		self.$buttonsWrapper.className = "buttons-wrapper";

		/** Create "Edit" button, add label, and class. */
		self.$edit = document.createElement( "button" );
		self.$edit.innerHTML = "Edit";
		self.$edit.className = "button-edit preview";

		/** Hanlder for editing profile. */
		self.$edit.addEventListener( "click", function () {
			profiles.edit();
		});

		/** Create "Delete" button, add label, and class. */
		self.$delete = document.createElement( "button" );
		self.$delete.innerHTML = "Delete";
		self.$delete.className = "button-delete preview";

		/** Handler for profile removal. */
		self.$delete.addEventListener( "click", function () {
			profiles.delete();
		});

		/** Create "Save" button, add label, and class. */
		self.$save = document.createElement( "button" );
		self.$save.innerHTML = "Save";
		self.$save.className = "button-save edit";

		/** Handler for profile saving. */
		self.$save.addEventListener( "click", function () {
			profiles.save();
		});

		/** Create "Cancel" button, add label, and class. */
		self.$cancel = document.createElement( "button" );
		self.$cancel.innerHTML = "Cancel";
		self.$cancel.className = "button-cancel edit";

		/** Handler for canceling edit. */
		self.$cancel.addEventListener( "click", function () {
			profiles.cancel();
		});

		/** Insert buttons into wrapper. */
		self.$buttonsWrapper.appendChild( self.$save );
		self.$buttonsWrapper.appendChild( self.$cancel );
		self.$buttonsWrapper.appendChild( self.$edit );
		self.$buttonsWrapper.appendChild( self.$delete );
	}

	/** Insert wrapper into panel. */
	self.$panel.appendChild( self.$buttonsWrapper );
};

/** Return all profiles names. */
QUnitDesktopNotifications.profiles.getNames = function () {
	return Object.keys( this.profiles );
};

QUnitDesktopNotifications.profiles.profile = function ( name, values ) {
	/** Go over existing profiles. */
	for ( var i in this.profiles ) {
		if ( this.profiles.hasOwnProperty( i ) && i === name ) {
			/** If profile was found and second argument is mossing, act as a getter. */
			if ( arguments.length === 1 ) {
				return this.profiles[ i ];
			}

			/** If profile was found and second argument is present, act as a setter or,
			 *  in case of second argument being a null, a delete command. */
			if ( arguments.length === 2 ) {
				if ( values === null ) {
					delete this.profiles[ i ];
				} else {
					this.profiles[ i ] = values;
				}

				return;
			}
		}
	}

	/** Act as a getter if two argument were passed and profile name wasn't find earlier. */
	if ( arguments.length === 2 && values !== null ) {
		this.profiles[ name ] = values;
	} else if ( arguments.length === 1 ) {
		return null;
	}
};

/** Save current state of profiles to localStorage. */
QUnitDesktopNotifications.profiles.saveToLocalStorage = function () {
	self.utils.localStorage( "profiles", JSON.stringify( this.profiles ) );
};

/** Return a name of currently selected profile name, or default otherwise. */
QUnitDesktopNotifications.profiles.selectedProfileName = function () {
	return self.$select.options[ self.$select.selectedIndex ].value;
};

/** Return config for currently selected profile. */
QUnitDesktopNotifications.profiles.selectedProfileConfig = function () {
	return this.profile( this.selectedProfileName() );
};

/** Start profile edit. */
QUnitDesktopNotifications.profiles.edit = function () {
	/** Set class name to edit: some button will be shown, other will be hidden. Panel itself will be shown. */
	self.$panel.className = "edit";

	/** Disable select on the profile currently being edited. */
	self.$select.setAttribute( "disabled", "disabled" );

	/** Toggle label for select. */
	self.$profilesLabel.innerHTML = "Now editing:";

	/** Get config for current profile. */
	var config = this.selectedProfileConfig();

	/** Variables used in the iteration over checkboxes. */
	var $childItem, eventName;

	for ( var i = 0; i < self.$list.children.length; i++ ) {
		/** Get first child of list item. */
		$childItem = self.$list.children[ i ].childNodes[ 0 ];

		/** Skip text nodes. */
		if ( $childItem.nodeType === 3 ) {
			continue;
		}

		/** Mark checkbox as checked if config has a corresponding property with value equal to true. */
		eventName = $childItem.getAttribute( "qdn-event" );
		$childItem.checked = config[ eventName ] === true;
	}
};

/** Saving a profile. */
QUnitDesktopNotifications.profiles.save = function () {
	/** Current profile name. */
	var name = this.selectedProfileName();

	/** Current profile config. */
	var config = this.profile( name );

	/** Variables used in the iteration over checkboxes. */
	var $childItem, eventName;

	for ( var i = 0; i < self.$list.children.length; i++ ) {
		/** Get first child of list item. */
		$childItem = self.$list.children[ i ].childNodes[ 0 ];

		/** Skip text nodes. */
		if ( $childItem.nodeType === 3 ) {
			continue;
		}

		/** Save current checkbox state to a corresponding property value on profile config's object. */
		eventName = $childItem.getAttribute( "qdn-event" );
		config[ eventName ] = $childItem.checked;
	}

	/** Save new profile config. */
	this.profile( name, config );

	/** Save everything to localStorage. */
	this.saveToLocalStorage();

	/** Revert to preview state. */
	this.cancel();
};

/** Reverts panel state to previewing profiles. */
QUnitDesktopNotifications.profiles.cancel = function () {
	/** Set class name to preview: some button will be shown, other will be hidden. Panel itself will be hidden. */
	self.$panel.className = "preview";

	/** Disable select: no changing profiles while editing. */
	self.$select.removeAttribute( "disabled" );

	/** Toggle label for select. */
	self.$profilesLabel.innerHTML = "Choose profile to edit:";
};

QUnitDesktopNotifications.profiles.delete = function () {
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