/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Fieldset 
 */

goog.provide('Banana.Controls.Legend');

/** @namespace Banana.Controls.Legend */
namespace('Banana.Controls').Legend = Banana.UiControl.extend(
/** @lends Banana.Controls.Legend.prototype */
{
	/**
	 * Creates a legend. Useful as a title representation inside a fieldset 
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init: function()
	{
		this._super();
		
		this.addCssClass('BLegend');
	},

	/**
	 * @return {String}
	 */
	getTagName : function()
	{
		return 'legend';
	}
});
