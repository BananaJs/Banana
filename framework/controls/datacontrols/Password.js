/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Password control.
 */

goog.provide('Banana.Controls.DataControls.Password');

goog.require('Banana.Controls.DataControls.TextBox');

/** @namespace Banana.Controls.Password */
namespace('Banana.Controls').Password = Banana.Controls.TextBox.extend(
/** @lends Banana.Controls.Password.prototype */
{
	/**
	 * Creates a password control.
	 * @constructs
	 * @extends Banana.Controls.TextBox
	 */
	init : function()
	{
		this._super();
		this.setAttribute('type','password');
	}
});