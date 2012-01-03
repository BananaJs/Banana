/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Base input data control. Provides functionality to act as a input data control 
 */

goog.provide('Banana.Controls.DataControls.InputControl');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.InputControl */
namespace('Banana.Controls').InputControl = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.InputControl.prototype */
{
	/**
 	 * Abstract basic input control. will be rendered as <input></input>
 	 * Checkbox/radiobutton/text etc extends from this control
 	 *
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
		this.bind('change',this.getProxy(this.onChange));
	}
});

/**
 * focus the input control
 * @return {this}
 */
Banana.Controls.InputControl.prototype.focus = function()
{
	jQuery('#'+this.clientId).focus();
	return this;
};

/**
 * this function is called after user changes something in the dom
 */
Banana.Controls.InputControl.prototype.onChange = function()
{
	this.setData(this.getDomData(),false,true);
	this.isChanged = true;
};

/**
 * @return {String}
 */
Banana.Controls.InputControl.prototype.getTagName = function()
{
	return 'input';
};

/**
 * @param {String} v value of the control
 * @return {this}
 */
Banana.Controls.InputControl.prototype.setValue = function(v)
{
	this.value = v;
	return this;
};

/**
 * @return {String} value of the control
 */
Banana.Controls.InputControl.prototype.getValue = function()
{
	return this.value;
};

/**
 * sets name of the input control. Not required!
 * @param {String} n
 * @return {this}
 */
Banana.Controls.InputControl.prototype.setName = function(n)
{
	this.name = n;
	return this;
};

/**
 * gets name of the input control
 * @return {String} 
 */
Banana.Controls.InputControl.prototype.getName = function()
{
	return this.name;
};