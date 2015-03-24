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
var QUnitDesktopNotifications = {};

QUnitDesktopNotifications.utils = {};

QUnitDesktopNotifications.utils.localStorage = function ( key, value ) {
	/** Return false if local storage is not available in the browser. */
	if ( ! 'localStorage' in window ) {
		return false;
	}

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

window.QUnitDesktopNotifications = QUnitDesktopNotifications;

})( this );