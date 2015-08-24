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
	$new: null,
	$profilesLabel: null,
	$buttonsWrapper: null,
	$list: null,
	$newProfile: null,
	$name: null,
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
	this.askNotificationsPermission();

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
	QUnit.begin( self.log.begin );
	QUnit.done( self.log.done );
	QUnit.log( self.log.log );
	QUnit.moduleDone( self.log.moduleDone );
	QUnit.moduleStart( self.log.moduleStart );
	QUnit.testDone( self.log.testDone );
	QUnit.testStart( self.log.testStart );
};

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

/** Notifications logger. */
QUnitDesktopNotifications.log = {
	begin: function ( details ) {
		self.notifications.addNotification( "begin", details );
	},
	done: function ( details ) {
		self.notifications.addNotification( "done", details );
	},
	log: function ( details ) {
		self.notifications.addNotification( "log", details );
	},
	moduleDone: function ( details ) {
		self.notifications.addNotification( "moduleDone", details );
	},
	moduleStart: function ( details ) {
		self.notifications.addNotification( "moduleStart", details );
	},
	testDone: function ( details ) {
		self.notifications.addNotification( "testDone", details );
	},
	testStart: function ( details ) {
		self.notifications.addNotification( "testStart", details );
	},
};

QUnitDesktopNotifications.notifications = {
	addNotification: function ( eventName, details ) {
		/** Do nothing if notifications are not available. */
		if ( ! self.canNotify() ) {
			return;
		}

		/** Do nothing if user should not be notified of this event, according to profile settings. */
		if ( ! self.profiles.shouldNotify( eventName ) ) {
			return;
		}

		new window.Notification( this.getMessageTitle( eventName, details ), {
			body: this.getMessageBody( eventName, details ),
			icon: this.getMessageIcon( eventName, details )
		});
	},
	/** Return message body. */
	getMessageBody: function ( eventName, details ) {
		/** Message could be either a string or a function. */
		var message = {
			begin: function () {
				return {
					0: "No tests are scheduled.",
					1: "1 test is scheduled.",
					2: details.totalTests + " tests are scheduled.",
				}[ details.totalTests >= 2 ? 2 : details.totalTests ];
			},
			done: function () {
				var total = {
					0: "No tests executed",
					1: "1 test executed",
					2: details.total + " tests executed",
				}[ details.total >= 2 ? 2 : details.total ];

				return total + ", " + details.passed + " passed, " + details.failed + " failed.";
			},
			log: "Assertion \"" + details.name + "\" " + ( details.result ? "passed" : "failed" ),
			moduleStart: "Module \"" + details.name + "\" started",
			moduleStop: "Module \"" + details.name + "\" finished",
		}[ eventName ];

		return typeof message === "function" ? message() : message;
	},
	/** Return message title. */
	getMessageTitle: function ( eventName, details ) {
		return {
			begin: "Tests began.",
			done: "Tests are done, " + ( details.failed ? "with" : "without" ) + " errors.",
			log: "Assertion " + ( details.result ? "passed" : "failed" ) + ".",
			moduleStart: "Module started.",
			moduleStop: "Module finished.",
		}[ eventName ];
	},
	getMessageIcon: function ( eventName, details ) {
		/** Callback from "begin" family has only informational icon. */
		if ( [ "begin", "moduleStart", "testStart" ].indexOf( eventName ) > -1 ) {
			return this.icons.info;
		}

		/** Callbacks from "done" family can either have "success" or "error" icon. */
		if ( [ "done", "moduleDone", "testDone" ].indexOf( eventName ) > -1 ) {
			return details.failed ? this.icons.error : this.icons.tick;
		}

		/** Single assertion has "result" key set to true if assertion passed. */
		return details.result ? this.icons.tick : this.icons.error;
	},
	icons: {
		/**
		 * Source: http://commons.wikimedia.org/wiki/File:Allowed.svg
		 * License: public domain
		 */
		tick: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAlCAYAAAAwYKuzAAAABmJLR0QA/wD/AP+gvaeTAAACA0lEQVRY" +
			"he2Xv27UMBzHP75juEOAEt6gvacoNzBcIhh6fYx2pYAAZWBD6EShbDQVb9F0KW1VqajqU6QDO5TNAgkzXFOlJydx/jgnVffZLFv2R1/H" +
			"dn6wYIF9nF3/cVZfp00RHW7oT4RSJ07ofdL1d9sWSuOG/gTUKwABK721wQO5Fx+kx8xNMC2XIGClN166L6OLa8m5COrkEgTiUX91+Z6M" +
			"4m/Tdsu4oR+Aelc0Toh/w5/rx2d32pBKyEsujYLNX+vHZ9BigmXkLjcOPyftVgSrykELgnXkwLJgXTmwKNiEHFgSbEoOMt7ivMfbQC4w" +
			"kUOooEgONIIPQ29bKHUyTaG03MTkEp7ec0fvTea88dQ5u/5HYPOqOeyPB3dlFB+WkGtkW7WCTjjaEvBipt9I0pbctaC7430QQrzMGJMr" +
			"aVMOoOt+8Yd0+FowbthfW/oj9y6+z8gFoN4WriJUcLlxtFVWDqAr9+MfvfHybwFPC1YZpZO8Sq5QbppcNTlI3YOmv0EIFaA6wnSs6Wkt" +
			"FARwQu+ZgO06EyZU/eZmuXHNyCg+N9vufJqSA80vv4zi8/548BcYVZqxxoHQoa1JZBSfVkmy7oHQkVk0lU6y4eQScqs60yRtJJdQWHYW" +
			"HZwmD4QOo7o4c7stbWsa48I9td1PABQ8ty1XCTf03rg7/ut5eyy4NfwHkLQKbZNGe+8AAAAASUVORK5CYII=",
		/**
		 * Source: http://commons.wikimedia.org/wiki/File:Not_allowed.svg
		 * License: public domain
		 */
		error: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAlCAYAAAAwYKuzAAAABmJLR0QA/wD/AP+gvaeTAAAB+0lEQVR" +
			"Yhe2YTXLiMBCFn1zZz2AugNrHyCJXgsAwNc56kiIhA0dikeQWFifAukE6i5gqh9hW66eKmireDvmp9ZUkpG4BF10E2Mnk5lwxM5fhQLT" +
			"hLNvVRKt4rE/VRCvOsp0l+ufyDgJaomcFTJufyxSQTYwlADAws0TPQYC2KNYM3J40R0G24Y5i4NYWxbqvj+oMVBRPYF4MjPWYG/M7Fu4" +
			"riVrnVfXLCVgXxTWYXwRjlrkxDyI4rUso9dflY6Wux1X11m77tsR5Vb0qYCYY916y3DXRSgKngNkpXNPeLUs0ZWDj5uxfbueytuBGxmx" +
			"7vvUrBjIFnBMwFDIVnAgQkG9yACWYldQr+ZOJAAGvmXRKMnMtr1wpIH3gGr+fYiB94Zo+/gqBDIEDBNlMl0bGbMF859GlDIEDAgEBAEr" +
			"98HD/DB4mpJP0nDuRd4IBBAAGwh3lDekFGAl3lBekeA/WWpeIhwM+k94/UrPsqvO4WwEgNgtq6yol3PEosUQSyGVNBBfk4AzGZCUp8sl" +
			"BwBQpUwrI7qIpYT4XC/l/Fk0d9fAXKWAmhQOAfL+/dxVifUVT5zk4NmbDwLwvUMjFPzJm2wfJwDyoaDpoPVdKrVvmILi2TvckMy/G+/3" +
			"g88egDlovaqJ3SzR1u2WyRNOa6P2g9dDrhUfAMz6/XRSrD9VuF/4svRvsAAAAAElFTkSuQmCC",
		/**
		 * Source: http://commons.wikimedia.org/wiki/File:Info_Simple.svg
		 * License: public domain
		 */
		info: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAEAUlEQVRY" +
			"hd2ZXWxTZRiAn/druw42TbpkwATm2q5uovEnDDUgc8OBOL3T6IUSExNRYzY0XpiYGJdxY4yJiAuJk3C1EKJMEzWCExhZgpDMBS80TLe1" +
			"OCdkELexhY7R7rzebMtod7qedlDjc3e+9zvv9/TnfD/vETKhSY2/K1KFi80oGwRdB6xJ6PWXIucQusXSrvDmQA9NYjkdSpx0Lq/pW2N5" +
			"TAPKC8BqhyMNobS5rXjLHycq/l5SwdKn/vR5pmLNirwCeB2JJTOlIp9pTN4/f9I/lrWgvy78nKAtQHGWYokMA2+EjwXbU3WyFVy//mfP" +
			"iK+oRdCdSyyWyD7f6OibPT1VsYWCCwreU/Nb4aQ7vx3Ylu4oHrdQXuoBoG8wRjyuaRsqcjRqlj873LHq6qKC5U/2eTUmPyjyWLoD1Dy0" +
			"nA/eLqa4yAXApZFp3vnoMl3dUSeSJ12e6e39R0JT89tNYkcrZj52Ind/pZfW3avm5ABWFLnYv3sl91Wk/zwJWjMdd32Y2H6DYPDx/ueB" +
			"19POCuza4cOV9DHB5RIaXvQ5SYWoNgbqBp5ZUHDt1sE7VKTVUUagwp9nG7s7aB9LQWtwW/+K2Ys5QQ+xZuB2p9n+GZu2jV0esY+loEhV" +
			"mmcvDEDZ9kgZykuZZGv7dtw+9o19LCXKy/4t4TthRtDErVcBdya5vjw6waHvJ5LaD343TntHcnuaeIxYOwGkpqbTPeguHQJWZpoNYOOD" +
			"y3jkgWUA/HR2kjO/TGaTDkEvDPiCpRLc0r9RjZzKKttNQi152G0ZUyukP+vPEirLIzSzctjRNxij7/z1TP0Ql9a6Ba3K5Ob66gIad6Se" +
			"5z5tG2VPFoIoG9wIoQy+QI6fjnI1alF1bz5bNxVkLpGauwxKSSZ3/to3xf7DV3itaZjTWT4QKSgxQGG2Wa5MON7Jp8ttBofb/luNATKe" +
			"TW8BEwbhYq4tUnDRoPTm2sIOgV6jyNlci9ihQo8xltWZaxE7dFo6zUB18AwwmGuZRBQJR074u81MOeJgroUSMWodAlEDoCp7gJu2HGRA" +
			"FBefwMyGNXI8MIxyILdO81A+H+govwTzziQmz3oXcj8nCnrBcy323uz1nGD/kdC4qL7lNKHbLZSWLHxaKFuder+4EIo0/n6qcm51S1qH" +
			"A3UD+0jjbFxfXcDTtYWsC+axtsRepDd8nfBQjAOHxzh7bsq2H4CK7I38GNg1vy3pyB32BRpQvl5MMFSWxxOPFqSUA6gM5FFfXUBJ8aJn" +
			"sq8im/xJv2DGxaN8r+D1pL8Ril5TYjYFJUfFo1n+0+W3+eS6gLlA2edGIscCX8S97ooZydT/8vSYUpG9VtxULiYH/5ciehL2ryFmz6Gj" +
			"LNFriH8B/0FuJFmUIa0AAAAASUVORK5CYII="
	}
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
	this.refreshName();
	this.refreshConfig();
	this.refreshButtons();
	this.setButtonDeleteStatus();
}

QUnitDesktopNotifications.profiles.refreshSelect = function () {
	/** All profiles names. */
	var names = this.getNames();

	/** Get either the existing select, or create a new one. */
	var $select = self.$select || document.createElement( "select" );

	if ( ! self.$select ) {
		$select.addEventListener( "change", function () {
			self.profiles.setButtonDeleteStatus();
		});
	}

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

/** Creates or appends labels. */
QUnitDesktopNotifications.profiles.refreshLabels = function () {
	if ( ! self.$profilesLabel ) {
		self.$profilesLabel = document.createElement( "label" );
	}

	self.$panel.appendChild( self.$profilesLabel );
};

/** Creates or appends input containing profile name. */
QUnitDesktopNotifications.profiles.refreshName = function () {
	if ( ! self.$name ) {
		self.$name = document.createElement( "input" );
		self.$name.setAttribute( "name", "name" );
		self.$name.setAttribute( "placeholder", "Enter profile name" );
	}

	self.$panel.appendChild( self.$name );
};

/** Create HTML for profile config. */
QUnitDesktopNotifications.profiles.refreshConfig = function () {
	/** List of QUnit events names. */
	var keys = Object.keys( self.log );

	/** Declare variable early. */
	var $item, $checkbox, $label, eventName, checkboxName;

	/** Create wrapper. */
	self.$list = self.$list || document.createElement( "ul" );
	self.$list.className = "events-wrapper";
	self.$list.innerHTML = "";

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

		/** Variable for the iteration. */
		var i, group, buttonName, $button;

		/** Buttons to create for both groups: previewing and editing profile. */
		var buttonsGroups = {
			preview: [ "edit", "delete", "new" ],
			edit: [ "save", "cancel" ]
		};

		/** Go over the groups, then over the buttons. */
		for ( group in buttonsGroups ) {
			for ( i = 0; i < buttonsGroups[ group ].length; i++ ) {
				/** Save button name in variable. */
				buttonName = buttonsGroups[ group ][ i ];

				/** Save button reference in variable, and in main plugin object. */
				$button = self[ "$" + buttonName ] = document.createElement( "button" );

				/** Set button label. */
				$button.innerHTML = buttonName[ 0 ].toUpperCase() + buttonName.slice( 1 );

				/** Set action for which the button is responsible. */
				$button.setAttribute( "action", buttonName );

				/** Set class name matching the group name. */
				$button.className = group;

				/** Add handler for click: do the action matching button "action" param. */
				$button.addEventListener( "click", function () {
					profiles[ this.getAttribute( "action" ) ]();
				});

				/** Insert button into wrapper. */
				self.$buttonsWrapper.appendChild( $button );
			}
		}
	}

	/** Insert wrapper into panel. */
	self.$panel.appendChild( self.$buttonsWrapper );
};

/** Sets status of delete button, disablsing it if profile name is default. */
QUnitDesktopNotifications.profiles.setButtonDeleteStatus = function () {
	/** Whether the profile name is "default". */
	var defaultProfileIsSelected = self.profiles.selectedProfileName() === "default";

	/** Disable button, is profile name is "default", and show apriopriate label. */
	self.$delete.disabled = defaultProfileIsSelected;
	self.$delete.setAttribute( "title", defaultProfileIsSelected ? "Default profile cannot be deleted" : "" );
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
		return {};
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

	/** Refresh select contents. */
	this.refreshVisible();
};

/** Reverts panel state to previewing profiles. */
QUnitDesktopNotifications.profiles.cancel = function () {
	/** Set class name to preview: some button will be shown, other will be hidden. Panel itself will be hidden. */
	self.$panel.className = "preview";

	/** Disable select: no changing profiles while editing. */
	self.$select.removeAttribute( "disabled" );

	/** Toggle label for select. */
	self.$profilesLabel.innerHTML = "Choose profile to edit:";

	/** Remove placeholder for new item, if it's present. */
	if ( self.$newProfile && self.$newProfile.parentNode === self.$select ) {
		self.$select.removeChild( self.$newProfile );
		self.$newProfile = null;

		/** Remove handler from name input. */
		self.$name.removeEventListener( "keyup", QUnitDesktopNotifications.profiles.newProfileNameHandle );
	}
};

/** Handler for saving new profile name. */
QUnitDesktopNotifications.profiles.newProfileNameHandle = function () {
	if ( ! self.$newProfile ) {
		return;
	}

	/** Remove non-ASCII characters from string, and make string lowercase. */
	var normalizedLabel = event.target.value.replace( /[^\x00-\x7F]/g, "" ).toLowerCase();;

	self.$newProfile.text = self.$newProfile.value = normalizedLabel;

	normalizedLabel.length === 0 ?
		self.$save.setAttribute( "disabled", "disabled" ) :
		self.$save.removeAttribute( "disabled" );
};

/** Creates new profile. */
QUnitDesktopNotifications.profiles.new = function () {
	/** Set select label. */
	self.$profilesLabel.innerHTML = "Creating new profile...";

	/** Create new option and append it to select. */
	self.$newProfile = document.createElement( "option" );
	self.$select.appendChild( self.$newProfile );

	/** Select the newly created profile. */
	self.$select.selectedIndex = self.$select.childNodes.length - 1;

	/** Disable select on the newly created element. */
	self.$select.setAttribute( "disabled", "disabled" );

	/** Set class name to edit: some button will be shown, other will be hidden. Panel itself will be shown. */
	self.$panel.className = "edit new";

	var a = self.$name.addEventListener( "keyup", QUnitDesktopNotifications.profiles.newProfileNameHandle );

	/** Clear name input. */
	self.$name.value = "";

	/** With no name, "Save" button has to be disabled. */
	self.$save.setAttribute( "disabled", "disabled" );

	/** Focus cursor on user input. */
	self.$name.focus();
};

/** Deleting selected profile. */
QUnitDesktopNotifications.profiles.delete = function () {
	var profileName = this.selectedProfileName();

	/** Remove profile from local cache. */
	this.profile( profileName, null );

	/** Save refreshed profiles object to local storage. */
	this.saveToLocalStorage();

	this.refreshVisible();
};

/** Returns true if notification for eventName should be generated for current profile, false otherwise. */
QUnitDesktopNotifications.profiles.shouldNotify = function ( eventName ) {
	return !! this.profile( QUnit.urlParams.dnp )[ eventName ];
};

/** Ask for permission to show notifications. */
QUnitDesktopNotifications.askNotificationsPermission = function () {
	if ( ! window.Notification ) {
		console.error( "QUnit Desktop Notification require API to work." );
		return false;
	}

	/**
	 * If permission isn't "default", user either decided on allowing or disallowing permission.
	 * Let's respect that decision.
	 */
	if ( window.Notification.permission !== "default" ) {
		return false;
	}

	/** Ask for permission. */
	window.Notification.requestPermission();
};

/** Ask for permission to show notifications. */
QUnitDesktopNotifications.canNotify = function () {
	return window.Notification && window.Notification.permission === "granted";
};

/** In case QUnit was not found, generate error and don't initialize desktop notifications. */
if ( typeof window.QUnit === "undefined" ) {
	console.error( "QUnit Desktop Notifications should be included after QUnit." );
} else if ( self.start() === true ) {
	QUnit.begin( function () {
		self.prependLinkToDom();
		self.addDomHandlers();
	});
}

/** Expose QUnitDesktopNotification as global property. */
window.QUnitDesktopNotifications = QUnitDesktopNotifications;

})( this );
