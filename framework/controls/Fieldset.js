/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Fieldset 
 */

goog.provide('Banana.Controls.Fieldset');

/** @namespace Banana.Controls.Fieldset */
namespace('Banana.Controls').Fieldset = Banana.UiControl.extend(
/** @lends Banana.Controls.Fieldset.prototype */
{
	/**
	 * Creates a fieldset
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init: function()
	{
		this._super();
		
		this.addCssClass('BFieldset');
	},

	/**
	 * @return {String}
	 */
	getTagName : function()
	{
		return 'fieldset';
	}
});