/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary CharLimitFieldValidator
 */

goog.provide('Banana.Controls.Decorators.CharLimitFieldValidator');

goog.require('Banana.Controls.Decorators.Validator');

/** @namespace Banana.Controls.Decorators.CharLimitFieldValidator */
namespace('Banana.Controls.Decorators').CharLimitFieldValidator = Banana.Controls.Decorators.Validator.extend(
/** @lends Banana.Controls.Decorators.CharLimitFieldValidator.prototype */
{
	/**
	 * Creates a character limit field validator
	 * Use setMaxChars to set max. Use this control only with input controls
	 * 
	 * @param {Banana.Controls.InputControl} c
	 * @constructs
	 * @extends Banana.Controls.Decorators.Validator
	 */
	init : function(c)
	{
		this._super(c);
		
		this.showIndicator = false;
	},
	
	/**
	 * @override
	 * @param {String} data
	 */
	validateData : function(data)
	{
		if (!data)
		{
			return true;
		}
		
		return (data.length <= this.maxChars);
	},

	/**
	 * @param {int} max characters
	 * @return {this}
	 */
	setMaxChars : function(max)
	{
		this.maxChars = max
		return this;
	},

	/**
	 * @override
	 * if no infotext is supplied then we show max character as warning tag
	 */
	getInfoText : function()
	{
		return this.infoText || 'Max '+this.maxChars+' chars';
	}
});