/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary HBox control  
 */

goog.provide('Banana.Controls.HBox');

goog.require('Banana.Controls.Panel');

/** @namespace Banana.Controls.HBox */
namespace('Banana.Control').HBox = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.HBox.prototype */
{
	/**
	 * Creates a HBox in which all added controls are aligned horizontally.
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
		this.setStyle('width:100%;position:relative;');
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
		
		var controlCount = this.controls.length;
		var thisWidth = this.getDemensions().width;
		var targetWidth = thisWidth/controlCount;

		for (var i = 0, len = controlCount; i < len; i++)
		{
			var c = this.controls[i];
			var margin = c.getDemensions().offset.left - this.getDemensions().offset.left;

		}

		targetWidth -=12;

		for (var i = 0, len = controlCount; i < len; i++)
		{
			var c = this.controls[i];

			if (i !=0)
			{
				c.setCss({'width':targetWidth+'px','float':'left','margin-left':this.spacing+'px'});
			}
			else
			{
				c.setCss({'width':targetWidth+'px','float':'left'});
			}
		}
	}
});