/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Regex validator
 */

goog.provide('Banana.Controls.Decorators.RegExValidator');

goog.require('Banana.Controls.Decorators.Validator');

/** @namespace Banana.Controls.Decorators.RegExValidator  */
namespace('Banana.Controls.Decorators').RegExValidator = Banana.Controls.Decorators.Validator.extend(
/** @lends Banana.Controls.Decorators.RegExValidator.prototype */
{

	/**
	 * Creates a regex validator
	 * use setRegExString to supply regex
	 * 
	 * example
	 * new Banana.Controls.Decorators.RegExValidator(
			new Banana.Controls.TextBox()
			.dataSetBind('data','user.postcode')
		).setRegExString(/^[1-9]{1}[0-9]{3}\s?[A-Za-z]{2}$/)
		.setValidateOnEventType('keyup')
		.setInfoText('valide postcode needed example 1111AA')
	 * 
	 * @param {Banana.Controls.InputControl} c
	 * @constructs
	 * @extends Banana.Controls.Decorators.Validator
	 */
	init : function(c)
	{
		this._super(c);
	},
	
	/**
	 * @override
	 * 
	 * @param {mixed} data
	 */
	validateData : function(data)
	{
		var exp = new RegExp(this.regExString);
		
		if (data && data.match(exp))
		{
			return true
		}
		
		return false;
	},
	
	/**
	 * sets regex string
	 * 
	 * @param {String} string
	 */
	setRegExString : function(string)
	{
		this.regExString = string;
		return this;
	}	
});