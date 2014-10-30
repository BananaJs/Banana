/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Link Button Component
 */

goog.provide('Banana.Controls.LinkButton');

goog.require('Banana.Controls.Button');

/** @namespace Banana.Controls.LinkButton */
namespace('Banana.Controls').LinkButton = Banana.Controls.Button.extend(
/** @lends Banana.Controls.LinkButton.prototype */
{	
	/**
	 * Creates a link button. Basically the same as a Button. Except that it looks like a link
	 * The only thing we do here is applying a different style to the Button control
	 * 
	 * @constructs
	 * @extends Banana.Controls.Button
	 */
	init : function()
	{
		this._super();
		this.addCssClass('BLinkButton');
	}	
});