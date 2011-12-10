/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Radiobutton
 */

goog.provide('Banana.Controls.DataControls.RadioButton');

goog.require('Banana.Controls.DataControls.InputControl');

/** @namespace Banana.Controls.RadioButton */
namespace('Banana.Controls').RadioButton = Banana.Controls.InputControl.extend(
/** @lends Banana.Controls.RadioButton.prototype */
{
	/**
	 * Creates a radiobutton.
	 * @constructs
	 * @extends Banana.Controls.InputControl
	 */
	init : function()
	{
		this._super();
		this.setAttribute('type','radio');
		this.addCssClass('BRadioButton');
	},
	
	/**
	 * sets name on a radiobutton, multi radio buttons with same names behave like grouped radiobuttons
	 *
	 * @param {String} name of the group
	 * @return {this}
	 */
	setName : function(name)
	{
		this.setAttribute('name',name);
		return this;
	},
	
	/**
	 * @override
	 * 
	 * @param {String} data
	 */
	setDomData : function(data)
	{
		if (this.isRendered)
		{
			Banana.Util.DomHelper.setCheckBoxData(data, this);
		}
		return this;
	},
	
	/**
	 * @override
	 * @return {String}
	 */
	getDomData : function()
	{
		if (this.isRendered)
		{
			return Banana.Util.DomHelper.getCheckBoxData(this);
		}
	}	
});