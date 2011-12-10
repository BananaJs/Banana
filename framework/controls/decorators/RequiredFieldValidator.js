/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Required field validator
 */

goog.provide('Banana.Controls.Decorators.RequiredFieldValidator');

goog.require('Banana.Controls.Decorators.Validator');

/** @namespace Banana.Controls.Decorators.RequiredFieldValidator  */
namespace('Banana.Controls.Decorators').RequiredFieldValidator = Banana.Controls.Decorators.Validator.extend(
/** @lends Banana.Controls.Decorators.RequiredFieldValidator.prototype */
{
	/**
	 * Creates a required field validator. All controls  which are validated should supply data in 
	 * string, array or object format. empty string or empty array will not pass the validation
	 * 
	 * @param {Banana.Controls.InputControl} controlToValidate
	 * @constructs
	 * @extends Banana.Controls.Decorators.Validator
	 */
	init : function(controlToValidate)
	{
		this._super(controlToValidate);
		this.setInfoText('Field required');
	},
	
	/**
	 * @override
	 * @param {mixed} data to validate
	 * @return {Boolean}
	 */
	validateData : function(data)
	{
		if (data instanceof Array)
		{
			if (data.length > 0)
			{
				return true;
			}

			return false;
		}
		
		if (data == null || data == undefined)
		{
			return false;
		}
		
		data = data.toString();
		
		if (/^\s*$/.test(data)) return false;
		
		return true;
	}
});