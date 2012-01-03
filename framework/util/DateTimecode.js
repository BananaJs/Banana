/**
 * @author Maarten van Schaijk
 * @package Banana.Util
 * @summary DateTimecode 
 */

/** @namespace Banana.Util.DateTimecode */
goog.provide('Banana.Util.DateTimecode');

/**
 * Date timecode helper class. Behaves like the regular Date class with timecode support.
 * 
 * Example:
   var date = new Banana.Util.DateTimecode("25-04-2011 20:23:12:33");
   var tc = date.getTimecode();
   var time = date.getTime(); 
 *
 * @param {String} data
 * @param {boolean} local when true we are in local time
 * @constructor
 */
Banana.Util.DateTimecode = function(data,local)
{
	var		time = new Date;
	var		FPS = 25;

	/**
	 * @ignore
	 * @param {Object} obj
	 * @returns {Object}
	 */
	var _init = function(obj)
	{
		if (!data) return;
		
		if(!isNaN(data))
		{ 
			obj.setTimecode(data);
		}		
		
		else if (local)
		{
			obj.setLocalTime(data);
		}
		else
		{
			obj.setTime(data);
		}
		
		return obj;
	}
	
	/**
	 * @return {int} timecode
	 */
	this.getTimecode = function() 
	{
		return time.getTime();
	}

	/**
	 * @param {int} timecode
	 */
	this.setTimecode = function(timecode) 
	{
		time.setTime(timecode);
		return this;
	}

	/**
	 * Ensures pair integer
	 * @ignore
	 */
	var dd = function(value) {
		return (value<10 ? '0' : '') + value;
	}
	
	/**
	 * gets local date time by given format.
	 * By default '%d-%m-%Y %H:%M:%S:%F'
	 * @param {String}  format
	 * @return {String}
	 */
	this.getLocalDateTime = function(format)
	{
		format = format || '%d-%m-%Y %H:%M:%S:%F';

		var items = {
			'H' : dd(time.getHours()),
			'M' : dd(time.getMinutes()),
			'S' : dd(time.getSeconds()),
			'F' : dd(Math.round(time.getMilliseconds()/1000*FPS)),
			'd' : dd(time.getDate()),
			'm' : dd(time.getMonth()+1),
			'Y' : time.getFullYear(),
			'w' : time.getWeek()
		};

		for (item in items) {
			format = format.replace( '%'+item, items[item] );
		}

		return format;
	}

	/**
	 * gets local time
	 * by default '%H:%M:%S:%F'
	 * @param {String} format
	 * @return {String}
	 */
	this.getLocalTime = function(format) {
		
		format = format || '%H:%M:%S:%F';

		return this.getLocalDateTime(format);
	}

	/**
	 * gets local date
	 * by default '%d-%m-%Y'
	 * @param {String} format
	 * @return {String}
	 */
	this.getLocalDate = function(format) {
		
		format = format || '%d-%m-%Y';
		return this.getLocalDateTime(format);
	}

	/**
	 * gets date time by given format.
	 * By default '%d-%m-%Y %H:%M:%S:%F'
	 * @param {String}  format
	 * @return {String}
	 */
	this.getDateTime = function(format)
	{
		format = format || '%d-%m-%Y %H:%M:%S:%F';

		var items = {
			'H' : dd(time.getUTCHours()),
			'M' : dd(time.getUTCMinutes()),
			'S' : dd(time.getUTCSeconds()),
			'F' : dd(Math.round(time.getUTCMilliseconds()/1000*FPS)),
			'd' : dd(time.getUTCDate()),
			'm' : dd(time.getUTCMonth()+1),
			'Y' : time.getUTCFullYear()
		};

		for (item in items) {
			format = format.replace( '%'+item, items[item] );
		}

		return format;
	}

	/**
	 * gets time
	 * by default '%H:%M:%S:%F'
	 * @param {String} format
	 * @return {String}
	 */
	this.getTime = function(format) 
	{
		format = format || '%H:%M:%S:%F';
		return this.getDateTime(format);
	}


	/**
	 * gets date
	 * by default '%d-%m-%Y'
	 * @param {String} format
	 * @return {String}
	 */
	this.getDate = function(format) 
	{	
		format = format || '%d-%m-%Y';
		return this.getDateTime(format);
	}

	/**
	 * @ignore
	 * @param {String} string
	 * @returns {Array}
	 */
	var stringToParts = function(string)
	{
		var e = string.split(/[-: ]/);

		// Check for missing time; only date was given
		if (e.length == 3)
		{
			e.push('0');
			e.push('0');
			e.push('0');
			e.push('0');
		}

		// Check for missing date; only time was given
		if (e.length == 4)
		{
			e.unshift('1970');
			e.unshift('1');
			e.unshift('1');
		}

		return e;
	}

	/**
	 * sets year
	 * @param {int} y
	 * @return {this}
	 */
	this.setYear = function(y)
	{
		time.setFullYear(y);
		return this;
	}
	
	/**
	 * sets utc year 
	 * @param {int} y
	 * @return {this}
	 */
	this.setUTCYear = function(y)
	{
		time.setUTCFullYear(y);
		return this;
	}

	/**
	 * get year 
	 * @return {int}
	 */
	this.getYear = function()
	{
		return time.getFullYear();
	}

	/**
	 * get utc year 
	 * @return {int}
	 */	
	this.getUTCYear = function()
	{
		return time.getUTCFullYear();
	}

	/**
	 * sets time
	 * @param {String} string
	 * @return {this}
	 */
	this.setTime = function(string)
	{
		var e = stringToParts(string);

		time.setUTCDate( 1 ); // we need this to prevent invalidation of date object when day is changed on 31st		
		time.setUTCFullYear( e[2] );
		time.setUTCMonth( e[1]-1 );
		time.setUTCDate( e[0] );
		time.setUTCHours( e[3] );
		time.setUTCMinutes( e[4] );
		time.setUTCSeconds( e[5] );
		time.setUTCMilliseconds( e[6]/FPS*1000 );

		return this;
	}
	
	/**
	 * sets local time
	 * @param {String} string
	 * @return {this}
	 */
	this.setLocalTime = function(string)
	{
		var e = stringToParts(string);
		
		time.setDate( 1 ); // we need this to prevent invalidation of date object when day is changed on 31st
		time.setFullYear( e[2] );
		time.setMonth( e[1]-1 );
		time.setDate( e[0] );
		time.setHours( e[3] );
		time.setMinutes( e[4] );
		time.setSeconds( e[5] );
		time.setMilliseconds( e[6]/FPS*1000 );

		return this;
	}

	/**
	 * @function
	 * Sets local date time
	 * @param {String} string
	 * @return {this}
	 */
	this.setLocalDateTime = this.setLocalTime;

	/**
	 * @function
	 * Sets local date
	 * @param {String} string
	 * @return {this}
	 */
	this.setLocalDate = this.setLocalTime;

	/**
	 * Adds date time
	 * @param {Banana.Util.DateTimecode} other
	 * @return {this}
	 */
	this.add = function(other) {
		this.setTimecode( this.getTimecode() + other.getTimecode() );
		return this;
	}

	/**
	 * Subtracts date time
	 * @param {Banana.Util.DateTimecode} other
	 * @return {this}
	 */
	this.sub = function(other) {
		this.setTimecode( this.getTimecode() - other.getTimecode() );
		return this;
	}

	/**
	 * Compares date time. 
	 * @param {Banana.Util.DateTimecode} other
	 * @return {int} diff between given datetime and this datetime
	 */
	this.compareTo = function(other) 
	{
		return this.getTimecode() - other.getTimecode();
	}

	/**
	 * gets week number
	 * @return {int}
	 */
	this.getWeek = function()
	{
		return time.getWeek();
	}

	/**
	 * gets day number
	 * @return {int}
	 */
	this.getDay = function()
	{
		return time.getDay();
	}
	
	/**
	 * gets month number
	 * @return {int}
	 */
	this.getMonth = function()
	{
		return time.getUTCMonth()+1;
	}
	
	/**
	 * gets local month number
	 * @return {int}
	 */
	this.getLocalMonth = function()
	{
		return time.getMonth()+1;
	}
	
	/**
	 * gets local month number
	 * @return {int}
	 */
	this.getMonthDay = function()
	{
		return time.getUTCDate();
	}
	
	/**
	 * gets local month day number
	 * @return {int}
	 */
	this.getLocalMonthDay = function()
	{
		return time.getDate();
	}
		
	/**
	 * @return Banana.Util.DateTimecode
	 * 
	 * @param {int} local
	 * @param {int} monthDay of the month. When given this day is forced
	 */
	this.addMonth = function(local,monthDay)
	{
		var month = this.getMonth()+1;
		var year = this.getYear();
		
		if (!monthDay)
		{
			if (local)
			{
				monthDay = this.getLocalMonthDay();
			}
			else
			{
				monthDay = this.getMonthDay();
			}
		}
		
		if (month == 13)
		{
			month = 1;
			year++
		}
	
		if (local)
		{
			this.setLocalTime(monthDay+'-'+month+'-'+year+' '+this.getLocalTime());
		}
		else
		{
			this.setTime(monthDay+'-'+month+'-'+year+' '+this.getTime());
		}
	}
	
	_init(this);
}

/**
* Returns the week number for this date. dowOffset is the day of week the week
* "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
* the week returned is the ISO 8601 week number.
* @ignore
* @param int dowOffset
* @return int
*/
Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
var newYear = new Date(this.getFullYear(),0,1);
var day = newYear.getDay() - dowOffset; //the day of week the year begins on
day = (day >= 0 ? day : day + 7);
var daynum = Math.floor((this.getTime() - newYear.getTime() -
(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
var weeknum;
//if the year starts before the middle of a week
if(day < 4) {
weeknum = Math.floor((daynum+day-1)/7) + 1;
if(weeknum > 52) {
nYear = new Date(this.getFullYear() + 1,0,1);
nday = nYear.getDay() - dowOffset;
nday = nday >= 0 ? nday : nday + 7;
/*if the next year starts before the middle of
the week, it is week #1 of that year*/
weeknum = nday < 4 ? 1 : 53;
}
}
else {
weeknum = Math.floor((daynum+day-1)/7);
}
return weeknum;
};
