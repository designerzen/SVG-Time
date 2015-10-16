var SVGClock = SVGClock || ( function(){

    "use strict";

    // check for availablity of features..
    var localeDataStringAvailable = typeof new Date().toLocaleDateString === 'function';
    var instances = 0;

    var TAU = Math.PI * 2,
        NAME_SPACE = "clock-",
        MONTH_NAMES = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

    // Converts a Date into a Time
    var getTime = function( date )
	{
        return {
            seconds:6*date.getSeconds(),
            minutes:6*date.getMinutes(),
            hours: 30*(date.getHours()%12) + date.getMinutes()*0.5
        };
    };

    // convert a date object into a nicely formatted string
    var formatDate = function( date) 
	{

        var seperator = ':',
			seconds = date.getSeconds(),
            time = date.getHours() + seperator + date.getMinutes() + seperator + ( seconds < 10 ? '0'+seconds : seconds );

        if (localeDataStringAvailable)
        {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return time + ' - ' + date.toLocaleDateString(undefined, options);
        }else{
            // defaults to GB English!
            return time + ' - ' + date.getDate() + '&#47;' + MONTH_NAMES[ date.getMonth() ] + '&#47;' + date.getFullYear();
        }

    };

    //////////////////////////////////////////////////////////////////////////
    // For fixed clocks that you do not wish to tamper with in future
    // If you want your clock to be animatable use the return method below
    //////////////////////////////////////////////////////////////////////////
    var getMarkup = function( date, config )
	{
        
		// id, title, diameter, showNumerals
		config = config || {};
        // extend defaults object
        var options = {
            id : config.id || NAME_SPACE + (instances++),
            title : config.title || date.toString(),
            description : config.description || formatDate( date ),
            diameter : config.diameter || 128,
            showNumerals : config.showNumerals || true,
            numeralLines : config.numeralLines || false
        };
        // var options = extend( defaults, config );

        // set our default date if none provided
        date = date || new Date();

        var halfSize = options.diameter / 2,
            iconSize = Math.ceil( halfSize * 0.01 ),
            radius = halfSize - 1,
            data = getTime(date);

        var
            seconds = {
                    style:'rect',
                    width:1,
                    height:halfSize,
					fill:'red',
                    rx:0,
                    ry:0,
                    x:-1/2,
                    y:-halfSize,
                    transform:"rotate("+ data.seconds +" 0 0)"
            },
            minutes = {
                    style:'rect',
                    width:Math.ceil(radius*0.04),
                    height:radius,
                    fill:'black',
					rx:1,
                    ry:1,
                    x:-2/2,
                    y:-radius,
                    transform:"rotate("+ data.minutes +" 0 0)"
            },
            hours   = {
                    style:'rect',
                    width:Math.ceil(radius*0.05),
                    height:halfSize*0.75,
                    fill:'black',
					rx:Math.ceil(radius*0.01),
                    ry:Math.ceil(radius*0.01),
                    x:-3/2,
                    y:-halfSize*0.75,
                    transform:"rotate("+ data.hours +" 0 0)"
            };

        // Feed me a data object and I return a SVG hand
        var createHand = function( type, hand ){
            var output = '<'+hand.style+' class="clock--hand clock--'+type+'" id="'+options.id+'-'+type+'" ';
            // loop through object to create attributes
            for ( var h in hand )
            {
                if ( h != "style" ) output += h+'="'+hand[h]+'" ';
            }
            output += '/>';
            return output;
        };

        var markup = '<svg id="'+options.id+'" class="clock tooltip-up" data-tip="'+options.description+'"';

        // viewbox is the visile section
        markup += 'viewBox="0 0 '+options.diameter+' '+options.diameter+'" ';
        // by NOT setting the height and width it scales nicely
        // markup += 'width="'+diameter+'" height="'+diameter+'" ';

        // accessibility
        markup += 'aria-label="'+options.title+' - '+options.description+'">';
        markup += '<title>'+options.title+'</title>';
        markup += '<description>'+options.description+'</description>';

        // simple centralise!
        markup += '<g transform="translate('+halfSize+','+halfSize+')">';

        // clock face
        markup += '<circle class="clock--face" id="'+options.id+'-face" r="'+halfSize+'" fill="white" />';

        // numbers, loop through and add little circles
        if (options.showNumerals)
        {
            // loop through quantity :
            var arc = TAU / 12,
                distance = radius * 0.89;

            markup += '<g class="clock--numerals">';
            for ( var n=0; n < 12; ++n )
            {
                var angle = arc * n,
                    indicator = n%3===0,
                    classes = 'clock--numeral clock--numeral-'+n+(indicator?' clock--numeral-main':''),
                    numeralX = distance * Math.sin( angle ),
                    numeralY = distance * Math.cos( angle ),
                    numeralSize = indicator ? iconSize * 1.5 : iconSize;

                    //console.log( n + '. numeral x:'+numeralX+' y:'+numeralY );
                if (options.numeralLines)
                {
                    markup += '<line id="'+options.id+'-numeral-'+n+'" '
                    markup += 'class="'+classes+'" ';
                    markup += 'cx="'+numeralX+'" cy="'+numeralY+'" r="'+numeralSize+'" />';
                }else{
                    markup += '<circle id="'+options.id+'-numeral-'+n+'" '
                    markup += 'class="'+classes+'" ';
                    markup += 'cx="'+numeralX+'" cy="'+numeralY+'" r="'+numeralSize+'" />';
                }

            }
            markup += '</g>';
        }

        // hands
        markup += createHand( 'seconds', seconds );
        markup += createHand( 'minutes', minutes );
        markup += createHand( 'hours', hours );

        // central blob
        markup += '<circle class="clock--center" id="'+options.id+'-center" r="'+parseInt( radius*0.18 )+'"/>';

        // close centering group
        markup += '</g>';
        markup += '</svg>';
        return markup;
    };


    //////////////////////////////////////////////////////////////////////////
    // Dynamic Clock with a 'set' method
    //////////////////////////////////////////////////////////////////////////
    var Clock = function( id )
    {
        // now fetch a reference to the ID's within
        var element = document.getElementById( id );
        var elements = {
            seconds:element.getElementById( id+'-seconds' ),
            minutes:element.getElementById( id+'-minutes' ),
            hours: element.getElementById( id+'-hours' )
        };
        // rotate arm
        var setHand = function( hand, rotation ){
            hand.setAttribute('transform', 'rotate('+ rotation +' 0 0)');
        };
        // If you have created a clock using createClock() which creates a new Clock()
        var setTime = function( date ){

            // check if date or data object!
            var isDate = Object.prototype.toString.call(date) === "[object Date]";
            var time = isDate ? getTime(date) : date;

            // set the tranform type with stupid prefixes...
            setHand( elements.seconds, time.seconds );
            setHand( elements.minutes, time.minutes );
            setHand( elements.hours, time.hours );
        };
        var setNow = function(){
            setTime( new Date() );
        };
        return {
            set:setTime,
            now:setNow
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // now take an input time and create our markup
    // diameter, title and id are OPTIONAL
    //////////////////////////////////////////////////////////////////////////
    var createClock = function( element, date, config  )
    {
        // create our Clock SVG markup & inject our SVG markup into the requested element
        element.innerHTML = getMarkup( date, config );
        return new Clock( element.firstElementChild.id );
    };


    return {
        create:createClock,
        get:getMarkup
    };
	
}() );
