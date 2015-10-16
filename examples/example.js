/**
 * ...
 * @author zen
 */

(function() {
	
	
	// Make some clocks using the current time or if specified
	// Send all clocks to a specific time
	var now 	= moment();
	var london	= now.clone().tz("Europe/London");
	
	//var newYork    	= london.clone().tz( "America/New_York");
	//var losAngeles 	= london.clone().tz("America/Los_Angeles");

	//newYork.format();    // 2014-06-01T12:00:00-04:00
	//losAngeles.format(); // 2014-06-01T09:00:00-07:00
	//london.format();     // 2014-06-01T17:00:00+01:00
	
	// Select all elements on the DOM with class name svg--clock
	// determine it's data-attribute 
	function setClocks( time )
	{
		// loop through all html elements with class svg--clock
		var clockElements = document.getElementsByClassName( "svg--clock" );
		
		// These are static clocks that cannot be manipulated
		for (var i = 0, l = clockElements.length; i < l; ++i ) 
		{
			var clock 		= clockElements[ i ];
			// Create the clock instance :D
			var timeZone 	= clock.getAttribute('data-timezone') || "Europe/London";
			// Use moment.js to change the timezone
			//var time 		= time.clone().tz( timeZone );
			var time 		= time.tz( timeZone );
			// find the difference in times because of timezone...
			// and create a new date based as such : 'December 17, 1995 03:24:00'
			var date 		= new Date( time.format("MMMM D YYYY, hh:mm:ss") );
			// Now create our clock
			var markup 		= SVGClock.get( date );
			// and replace the html Element contents
			clock.innerHTML = markup;
		}
		
	}
	
	setClocks( now );
	
})();