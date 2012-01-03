/**
 * @author    Nick de Groot <nick.degroot[at]vivesta[dot]com>
 * @link 	  www.vivesta.com
 * @copyright Copyright &copy; 2010
 * @license   xxx
 * @version   0.0.1
 * @package   Banana
 *
 * Console Logger Object
 * 
 * The Console logger logs its messages to the console
 * 
 */

goog.provide('Banana.Util.Logger.Console');
goog.require('Banana.Util.Logger');

/**
 * @namespace Banana.Util.Logger
 */
namespace('Banana.Util.Logger');

/**
 * Console Logger
 * 
 * @constructor
 */
Banana.Util.Logger.Console = function()
{
	this.id = 'Console';
	
	if (!window.console)
	{
		window.console = {
			'log': function(){return;}, 
			'error': function(){return;},
			'time': function(){return;},
			'timeEnd': function(){return;}
		};
	}
};

/**
 * @lends Banana.Util.Logger
 */
Banana.Util.Logger.Console.prototype = new Banana.Util.Logger();


/**
 * Write a message to the console
 * 
 * @param String msg Message
 */
Banana.Util.Logger.Console.prototype.write = function(msg)
{
	console.log(msg);
};

