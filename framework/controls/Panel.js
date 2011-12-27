/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Panel control which is an equivalent of a html div  
 */

goog.provide('Banana.Controls.Panel');

goog.require('Banana.UiControl');

/** @namespace Banana.Controls.Panel */
namespace('Banana.Controls').Panel = Banana.UiControl.extend(
/** @lends Banana.Controls.Panel.prototype */
{
	/**
	 * Creates simple panel. A panel can be used as a building block for many custom controls. 
	 * 
	 * Example:
	 
	 var panel = new Panel();
	 panel.setStyle("height:100px; width:200px; background-color:red;");
	 
	 this.addControl(panel); //add to collection
	 
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * @return {String}
 */
Banana.Controls.Panel.prototype.getTagName = function()
{
	return 'div';
};