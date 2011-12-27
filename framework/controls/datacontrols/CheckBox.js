/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Checkbox control  
 */

goog.provide('Banana.Controls.DataControls.CheckBox');

goog.require('Banana.Controls.DataControls.InputControl');

/** @namespace Banana.Controls.CheckBox */
namespace('Banana.Controls').CheckBox = Banana.Controls.InputControl.extend(
/** @lends Banana.Controls.CheckBox.prototype */
{
	/**
	 * Creates a Checkbox control
	 * @constructs
	 * @extends Banana.Controls.InputControl
	 */
	init : function()
	{
		this._super();
		this.setAttribute('type','checkbox');
		this.addCssClass('BCheckbox');
		this.setData(false);

		this.bind('change',this.getProxy(this.onChange));
	},
	
	/**
	 * Used to apply the data to the dom
	 * @ingore
	 */
	setDomData : function(data)
	{
		if (this.isRendered)
		{
			Banana.Util.DomHelper.setCheckBoxData(data, this);
		}
	},
	
	/**
	 * @ignore
	 */
	getDomData : function()
	{
		if (this.isRendered)
		{
			return Banana.Util.DomHelper.getCheckBoxData(this);
		}
	}		
});