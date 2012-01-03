/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary HBox control  
 */

goog.provide('Banana.Controls.VBox');

goog.require('Banana.Controls.Panel');

/** @namespace Banana.Controls.Layout.VBox */
namespace('Banana.Controls').VBox = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.VBox.prototype */
{
	/**
	 * Creates a HBox in which all added controls are aligned vertically.
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
		this.spacing = 0;
	},

	/**
	 * sets space between controls
	 * @param {int} s 
	 */
	setSpacing : function(s)
	{
		this.spacing = s;
		return this;
	},

	/**
	 * @override
	 * @ignore
	 */
	updateDisplay : function()
	{
		this._super();

		for (var i = 0, len = this.controls.length; i < len; i++)
		{
			var c = this.controls[i];
			if (!(c instanceof Banana.Control))
			{
				continue;
			}

			if (c.getStyleProperty('float') == 'none')
			{
				c.setCss({'clear':'both','float':'','width':'100%'});
			}
			else
			{
				c.setCss({'clear':'both','float':''});
			}
			

			if (i < this.controls.length)
			{
				c.setCss({'margin-bottom':this.spacing+'px'});
			}
		}
	}
});