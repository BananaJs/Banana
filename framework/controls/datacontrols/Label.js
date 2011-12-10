/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Label control
 */

goog.provide('Banana.Controls.DataControls.Label');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.Label */
namespace('Banana.Controls').Label = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.Label.prototype */
{
	/**
	 * Creates a label. Useful to display text only
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
		this.addCssClass('BLabel');
		this.tagName = 'label';
	},
	
	/**
	 * overwrite this function to prevent triggering the change event 
	 * We do this to increase performance. we dont need the change event
	 * We also add the data as a control. The reason for this is because the label control will be rendered first
	 * without any data inside. then in the update display, data will be inserted. With many controls this insertion 
	 * will be noticed in the gui rendering. To prevent this we make sure that the control will always render at once with data already inside
	 *  
	 *	@param {mixed} data for the label
	 *	@param {boolean} ignoreEvent when true no datachanged is triggered. This is useful when you are running in a circle or performance issues
	 *	@param {boolean} ignoreDom when true setDomData function is not called. Useful in cases of optimizing performance
	 *  @return {this}
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		this._super(data,true,ignoreDom);
	
		this.addControl(data);
		return this;
	},
	
	/**
	 * Sets tag name of the label. use this if you want to overwrite
	 * the default label tag. for example. when you want to render images inside the label
	 * @param {String} tag
	 * @return {this}
	 */
	setTagName : function(tag)
	{
		this.tagName = tag;
		return this;
	},
	
	/**
	 * @return {String}
	 */
	getTagName : function()
	{
		return this.tagName;
	}
});

/**
 * Sets the control which belongs to the label. The result is that you can click on the label to focus the control
 * @param {Banana.Control} control
 */
Banana.Controls.Label.prototype.setForControl = function(control)
{
	this.setAttribute('for',control.clientId);
}

/**
 * writes data to dom
 * @ignore
 * @param {String} data
 */
Banana.Controls.Label.prototype.setDomData = function(data)
{
	if (this.isRendered)
	{
		if (data == undefined)
		{
			data = ' - ';
		}
		
		Banana.Util.DomHelper.setTextData(data,this)
	}
};