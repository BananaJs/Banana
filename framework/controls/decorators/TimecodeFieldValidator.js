/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Timecode Field Validator
 */

goog.provide('Banana.Controls.Decorators.TimecodeFieldValidator');

goog.require('Banana.Controls.Decorators.Validator');

/** @namespace Banana.Controls.Decorators.TimecodeFieldValidator  */
namespace('Banana.Controls.Decorators').TimecodeFieldValidator = Banana.Controls.Decorators.Validator.extend(
/** @lends Banana.Controls.Decorators.TimecodeFieldValidator.prototype */
{

	/**
	 * Creates a timecode field validator
	 * 
	 * Matches date, time(code) or date and time(code)
	 * Matches DD-MM-YYYY where 00 < DD < 32, 00 < MM < 13, 1900 =< YYYY < 3000
	 * Matches HH:MM:SS:FF or HH:MM:SS where 00 =< HH < 24, 00 =< MM/SS < 60, and 00 =< FF < 25
	 * 
	 * @param {Banana.Controls.InputControl} controlToValidate
	 * @constructs
	 * @extends Banana.Controls.Decorators.Validator
	 */
	init : function(controlToValidate)
	{
		this._super(controlToValidate);

		this.showIndicator = false;
	},

	/**
	 * @param {boolean} r
	 * if true we need to pass data in order to pass the validation. false means that we can exclude data
	 * in order to pass validation
	 */
	setRequired : function(r)
	{
		this.required = r;

		this.showIndicator = r;
		return this;
	},

	/**
	 * @override
	 * @param {String} data
	 */
	validateData : function(data)
	{
		if (!data && !this.required)
		{
			return true;
		}
		else if (!data)
		{
			return false;
		}
		
		// Matches date, time(code) or date and time(code)
		// Matches DD-MM-YYYY where 00 < DD < 32, 00 < MM < 13, 1900 =< YYYY < 3000
		// Matches HH:MM:SS:FF or HH:MM:SS where 00 =< HH < 24, 00 =< MM/SS < 60, and 00 =< FF < 25
		if (data.match(/^((0?[1-9]|[12][0-9]|3[01])[\- \/.](0?[1-9]|1[012])[\- \/.](19|20)?[0-9]{2})? ?((2[0-3]|[0-1][0-9]):(5[0-9]|[0-4][0-9]):(5[0-9]|[0-4][0-9])(:(2[0-4]|[0-1][0-9]))?)?$/))
		{
			return true;
		}
		return false;
	},

	/**
	 * @override
	 * @return {String}
	 */
	getInfoText : function()
	{
		return 'Valid timecode required';
	}
});