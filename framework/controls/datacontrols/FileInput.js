/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary File Input
 */

goog.provide('Banana.Controls.FileInput');

/** @namespace Banana.Controls.FileInput*/
namespace('Banana.Controls').FileInput = Banana.Controls.InputControl.extend({
/** @lends Banana.Controls.FileInput.prototype */

	/**
	 * Creates file input control
	 * @constructs
	 * @extends Banana.Controls.InputControl
	 */
	init : function()
	{
		this._super();

		this.setAttribute("type",'file');
	},

	/**
	 * @param {boolean} bool
	 * @return {this}
	 */
	setMultiple : function(bool)
	{
		this.setAttribute("multiple",bool);
		return this;
	},

	/**
	 * @return {Array} of files
	 */
	getFiles : function()
	{
		var files = document.getElementById(this.getClientId()).files;
		return files;
	}
});