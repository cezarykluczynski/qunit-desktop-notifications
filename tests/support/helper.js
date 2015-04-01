define({
	getAppUrl: function ( filename ) {
		return "http://localhost:9090/app/" + filename;
	},
	clone: function ( obj ) {
		if (null == obj || typeof obj !== "object" ) {
			return obj;
		}

		var copy = obj.constructor();

		for ( var i in obj ) {
			if ( obj.hasOwnProperty( i ) ) {
				copy[ i ] = obj[ i ];
			}
		}

		return copy;
	}
});
