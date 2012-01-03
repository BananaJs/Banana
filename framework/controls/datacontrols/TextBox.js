/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary TextBox
 */

goog.provide('Banana.Controls.DataControls.TextBox');

goog.require('Banana.Controls.DataControls.InputControl');

/** @namespace Banana.Controls.TextBox */
namespace('Banana.Controls').TextBox = Banana.Controls.InputControl.extend(
/** @lends Banana.Controls.TextBox.prototype */
{

	/**
	 * Creates a textbox.
	 * 
	 * Example:
	 * 
	   var textbox = new Banana.Controls.TextBox()
	   this.addControl(textbox); //add to collection
	   
	   textbox.setData("some text");
	   
	   textbox.bind("dataChanged",function(){
	   		//do something here
	   });
	   
	   
	 * @constructs
	 * @extends Banana.Controls.InputControl
	 */
	init : function()
	{
		this.data = "";

		this._super();
		this.setAttribute('type','text');
		this.addCssClass('BTextbox');

		this.bind('keyup',this.getProxy(this.onChange));
		
		this.bind('keypress',function(event){return event.keyCode != 13;});
	}
});
