/**
 * @author Nick de Groot <nick.degroot[at]vivesta[dot]com>
 * @package Banana.Util
 * @summary Dom Helper. dom writer for various banana actions
 */

goog.provide('Banana.Util.LogManager');

// include different loggers
goog.require('Banana.Util.Logger');
goog.require('Banana.Util.Logger.Console');

/**
 * @namespace Banana.Util
 */
namespace('Banana.Util');

/**
 * This file defines the LogManager. It allows sending log messages
 * to different logging instances
 * 
 * @constructor
 */
Banana.Util.LogManager = function()
{
	this.loggers = [];
	
	this.errorData = []; // storing error data
	
	this.levels = {};
	this.levels.debug = false;
	this.levels.notice = false;
	this.levels.warning = false;
	this.levels.error = false;
	this.levels.route = false;	
	
	this.showTime = true;
};

/**
 * Add a logger
 * 
 * @param String|Banana.Util.Logger logger Logger to add
 */
Banana.Util.LogManager.prototype.addLogger = function(logger)
{
	if (typeof(logger) == 'string')
		logger = eval('new Banana.Util.Logger.' + logger);
	this.loggers.push(logger);
};

/**
 * Show information about the logging. Which loggers are loaded
 * and which levels are shown
 * 
 */
Banana.Util.LogManager.prototype.getInfo = function()
{
	var msg = "";
	if (!this.loggers.length)
	{
		msg += "No loggers are defined\r\n";
	}
	else
	{
		msg += "Banana is using loggers:\r\n";
		for (var x = 0; x < this.loggers.length; x++)
		{
			msg += this.loggers[x].id + "\r\n";
		}
	}
	
	msg += "\r\nLogger is showing messages:\r\n";
	for (var i in this.levels)
	{
		if (this.levels[i])
		{
			msg += i + "\r\n";
		}
	}
	
	alert(msg);	
};

/**
 * Turn a level on or off
 * 
 * @param String  level Level to set
 * @param Boolean value Value to set
 */
Banana.Util.LogManager.prototype.setLevel = function (level, value)
{
	this.levels[level] = value;
};

/**
 * Should times be shown in the messages
 * 
 * @param Boolean value True if it should
 */
Banana.Util.LogManager.prototype.showTimes = function (value)
{
	this.showTime = value;
};

/**
 * Add error data to the logger to store
 * 
 * @param {Mixed}  data Error data
 * @param {String} page [optional] Page error occured
 */
Banana.Util.LogManager.prototype.addErrorData = function(data, page)
{
	if (!page)
		page = window.location.href;
	
	var error = {};
	error.page = page;
	error.data = data;
	
	this.errorData.push(error);
};

/**
 * Return the error data
 * 
 * @return {Array} The error data
 */
Banana.Util.LogManager.prototype.getErrorData = function()
{
	return this.errorData;
}

/**
 * Clear the error data
 *
 */
Banana.Util.LogManager.prototype.resetErrorData = function()
{
	this.errorData = [];
}

/**
 * Write a message to all loggers
 * 
 * @param String msg Message to write
 */
Banana.Util.LogManager.prototype.write = function(msg, type)
{
	if (type)
		msg = "[" + type + "]\t" + msg;
	
	if (this.showTime)
	{
		var d = new Date();
		var curr_hour = d.getHours();
		var curr_min = d.getMinutes();

		var curr_sec = d.getSeconds();
		var curr_msec = d.getMilliseconds();

		msg = curr_hour + ":" + curr_min + ":"	+ curr_sec + ":" + curr_msec + " | " + msg;		
	}
	
	for (var x = 0; x < this.loggers.length; x++)
		this.loggers[x].write(msg);
};

/**
 * Send a debug message
 * 
 * @param String msg Message
 */
Banana.Util.LogManager.prototype.debug = function(msg)
{
	if (this.levels['debug'])
		this.write(msg, 'DEBUG');	
};

/**
 * Send a notice message
 * 
 * @param String msg Message
 */
Banana.Util.LogManager.prototype.notice = function(msg)
{
	if (this.levels['notice'])
		this.write(msg, 'NOTICE');	
};

/**
 * Send a warning message
 * 
 * @param String msg Message
 */
Banana.Util.LogManager.prototype.warning = function(msg)
{
	if (this.levels['warning'])
		this.write(msg, 'WARNING');	
};

/**
 * Send an error message
 * 
 * @param String msg Message
 */
Banana.Util.LogManager.prototype.error = function(msg)
{
	if (this.levels['error'])
		this.write(msg, 'ERROR');	
};

/**
 * Send a route message
 * 
 * @param String msg Message
 */
Banana.Util.LogManager.prototype.route = function(msg)
{
	if (this.levels['route'])
		this.write(msg, 'ROUTE');	
};


