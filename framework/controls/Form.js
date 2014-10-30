/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Form
 */

goog.provide('Banana.Controls.Form');

/** @namespace Banana.Controls.Form */
namespace('Banana.Controls').Form = Banana.UiControl.extend({
/** @lends Banana.Controls.Form.prototype */

	/**
	 * Creates form control
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init : function()
	{
		this._super();
	},

	/**
	 * @ignore
	 */
	getTagName : function()
	{
		return 'form';
	}
});