/**
 * @author    Nick de Groot <nick.degroot[at]vivesta[dot]com>
 * @link 	  www.vivesta.com
 * @copyright Copyright &copy; 2010
 * @license   xxx
 * @version   0.0.1
 * @package   Banana
 *
 * Logger Object
 * 
 * The Logger object is the base object for all different Loggers
 * 
 */

goog.provide('Banana.Util.Logger');

/**
 * @namespace Banana.Util
 */
namespace('Banana.Util');

/**
 * Logger
 * 
 * @constructor
 */
Banana.Util.Logger = function()
{
	/**
	 * @var Identifier for the logger
	 */
	this.id = 'Base';	
};

/**
 * Output a message
 */
Banana.Util.Logger.prototype.write = function(msg)
{
	throw Error('Logger::write should be overloaded!');
};

