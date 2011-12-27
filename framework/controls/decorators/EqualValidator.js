/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Equal validator
 */

goog.provide('Banana.Controls.Decorators.EqualValidator');

goog.require('Banana.Controls.Decorators.Validator');

/** @namespace Banana.Controls.Decorators.EqualValidator */
namespace('Banana.Controls.Decorators').EqualValidator = Banana.Controls.Decorators.Validator.extend(
/** @lends Banana.Controls.Decorators.EqualValidator.prototype */
{

	/**
	 * Creates a equal validator
	 * Use setControlIdToMath to determine against which control the decorated control should match its data.
	 * Note that this control doesn't compare complex objects like arrays or objects. Use controls with string data only
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
	 * sets the control id to match data on
	 * 
	 * @param {String} controlId
	 * @return {this}
	 */
	setControlIdToMatch: function(controlId)
	{
		this.controlIdToMatch = controlId;
		
		return this;
	},
	
	/**
	 * sets the control id to match data on
	 * 
	 * @param {Banana.Control} control
	 * @return {this}
	 */
	setControlIdMatch : function(control)
	{
		this.controlIdToMatch = control.id;
	},
	
	/**
	 * validates data
	 * 
	 * @overrided
	 * @param {String} data
	 */
	validateData : function(data)
	{
		control = this.getPage().findControl(this.controlIdToMatch);
		
		if (data === control.getData())
		{
			return true;
		}
		
		return false;
	}	
});