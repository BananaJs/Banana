/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Button control   
 */

goog.provide('Banana.Controls.Button');

goog.require('Banana.Controls.Panel');

/** @namespace Banana.Controls.Button */
namespace('Banana.Controls').Button = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.Button.prototype */
{
	/**
	 * Creates a simple button
	 * 
	 * Example:
	 
	   var button = new Banana.Controls.Button();
	   
	   this.addControl(button); //add button to a collection
	   
	   button.bind('click',function(){
	   		//do something here
	   });
	 *
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super(); //call parent constructor

		this.addCssClass('BButton');
		this.addCssClass('BButtonHover');

		this.bind('click',this.getProxy(function(e)
		{
			if (this.enabled !== undefined && this.enabled === false)
			{
				e.stopImmediatePropagation();
				e.stopPropagation();//needed?? dont think so
			}
		}));
	},
	
	/**
	 * @return {String}
	 */
	getTagName : function()
	{
		return 'button';
	},

	/**
	 * @ignore
	 * @override
	 */
	createComponents : function()
	{
		if (this.imageUrl)
		{
			this.image = new Banana.Controls.Image();
			this.image.setImage(this.imageUrl);
			this.addControl(this.image);
		}
		else
		{
			this.label = new Banana.Controls.Label().addCssClass('BButtonLabel');
			if (this.labelStyle)
			{
				this.label.setStyle(this.labelStyle);
			}
			if (this.labelClass)
			{
				this.label.addCssClass(this.labelClass);
			}
			this.label.setData(this.text);
			this.addControl(this.label);
		}
	},

	/**
	 *@param {boolean} enables or disables button
	 *@returns {Banana.Controls.Button}
	 */
	setEnabled : function(enabled)
	{
		if (!enabled)
		{
			this.addCssClass('BButtonDisabled');
			this.removeCssClass('BButtonHover');
		}
		else
		{
			this.removeCssClass('BButtonDisabled');
			this.addCssClass('BButtonHover');			
		}
		
		this.enabled = enabled;
		return this;
	},
	
	/**
	 * sets style on the text label
	 * @param {String} style
	 * @returns {this}
	 */
	setLabelStyle : function(style)
	{
		this.labelStyle = style;
		return this;
	},

	/**
	 * sets css class on the label of the button
	 * @param {String} clas
	 * @returns {this}
	 */
	setLabelCssClass : function(clas)
	{
		this.labelClass = clas;
		return this;
	},

	/**
	 * sets the text on the button
	 *
	 * @param {String} text
	 * @return {this} 
	 */
	setText : function(text)
	{
		this.text = text;
		return this;
	},
	
	/**
	 * @param {String} image
	 * @returns {this}
	 */
	setImage : function(image)
	{
		this.imageUrl = image;
		if (this.isRendered)
		{
			this.image.setImage(this.imageUrl);
		}
		return this;
	}
});