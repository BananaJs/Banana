/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Switch button 
 */

goog.provide('Banana.Controls.SwitchButton');

goog.require('Banana.Controls.DataControls');

/** @namespace Banana.Controls.SwitchButton */
namespace('Banana.Controls').SwitchButton = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.SwitchButton.prototype */
{
	/**
	 * Creates a switch button. Default state = off (false)
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
		this.status = false;
	},
	
	/**
	 * @override
	 */
	createComponents : function()
	{
		this.image = new Banana.Controls.Image();
		this.addControl(this.image);
		
		this.bind('click',this.getProxy(function()
		{
			this.status = this.status ? false : true; 
		
			this.triggerEvent('switched',this.status);
			this.bindImage();
			this.image.invalidateDisplay();
			
		}));
		
		this.bindImage();
	},
	
	/**
	 * Binds image
	 * @ignore
	 */
	bindImage : function()
	{
		if (this.status)
		{
			this.image.setImage(this.onImage);
		}
		else
		{
			this.image.setImage(this.offImage);
		}
	},
	
	/**
	 * Sets image representing the on status
	 * @param {String} image name
	 * @return {this}
	 */
	setOnImage : function(image)
	{
		this.onImage = image;
		
		if (this.isRendered)
		{
			this.bindImage();
		}
		
		return this;
	},
	
	/**
	 * Sets image representing the off status
	 * @param {String} image name
	 * @return {this}
	 */
	setOffImage : function(image)
	{
		this.offImage = image;
		
		if (this.isRendered)
		{
			this.bindImage();
		}
		
		return this;
	},
	
	/**
	 * Switches on button
	 * @return {this}
	 */
	on : function()
	{
		this.status = true;
		
		if (this.isRendered)
		{
			this.bindImage();
		}
		
		return this;
		
	},
	
	/**
	 * Switches off button
	 * @return {this} 
	 */
	off : function()
	{
		this.status = false;
		
		if (this.isRendered)
		{
			this.bindImage();
		}
		
		return this;
	}
});