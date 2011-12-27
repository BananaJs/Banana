/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Base decorator controls
 * 
 */

goog.provide('Banana.Controls.Decorators.Decorator');

/**
@class
@name Banana.Controls.Decorators
*/

/** @namespace Banana.Controls.Decorators.Decorator */
namespace('Banana.Controls.Decorators').Decorator = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.Decorators.Decorator.prototype */
{
	/**
	 * Creates a base decorator. 
	 * 
	 * @param {Banana.Control} dc
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function(dc)
	{
		this._super();
		this.decoratedControl = dc;
	},
	
	/**
	 * @return {Banana.Control}
	 */
	getDecoratedControl : function()
	{
		if (this.decoratedControl instanceof Banana.Controls.Decorators.Decorator)
		{
			return this.decoratedControl.getDecoratedControl();
		}

		return this.decoratedControl;
	}
});