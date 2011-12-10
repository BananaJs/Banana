/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Timecode
 */

goog.provide('Banana.Controls.DataControls.Timecode');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.Timecode */
namespace('Banana.Controls').Timecode = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.Timecode.prototype */
{
	/**
	 * Creates a timecode control. Timecode format is HH:MM:SS:FF 
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function(mask)
	{
		this._super();

		this.ctrl = new Banana.Controls.MaskedTextBox().setStyle('width:80px;').setMask(mask || '99:99:99:99');
		this.addControl(new Banana.Controls.Decorators.TimecodeFieldValidator(this.ctrl));
	},
	
	/**
	 * @override
	 * @param {String} data in HH:MM:SS:FF format
	 * @param {boolean} ignoreEvent
	 * @param {boolean} ignoreDom
	 * @return {this}
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		this.ctrl.setData(data);
		return this;
	},
	
	/**
	 * @return {String} 
	 */
	getData : function()
	{
		return this.ctrl.getData();
	},
	
	/**
	 * @override
	 * Propagates to the right control
	 * @param {boolean} enable
	 * @return {this} 
	 */
	setEnabled : function(enable)
	{
		this.ctrl.setEnabled(enable);
		return this;
	},
	
	/**
	 * @override
	 * @return {boolean}
	 */
	getEnabled : function()
	{
		return this.ctrl.getEnabled();
	}
});