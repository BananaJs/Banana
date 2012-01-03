/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Textarea
 */

goog.provide('Banana.Controls.DataControls.TextArea');

goog.require('Banana.Controls.DataControls.InputControl');

/** @namespace Banana.Controls.TextArea */
namespace('Banana.Controls').TextArea = Banana.Controls.InputControl.extend(
/** @lends Banana.Controls.TextArea.prototype */
{
	/**
	 * Creates a text area
	 * @constructs
	 * @extends Banana.Controls.InputControl
	 */
	init : function()
	{
		this.data = "";

		this._super();
		this.setAttribute('type','text');
		this.addCssClass('BTextbox');

		this.bind('keyup',this.getProxy(function(){

			this.setData(Banana.Util.DomHelper.getData(this),false,true);
		}));
	}
});

/**
 * @override
 * @return {String}
 */
Banana.Controls.TextArea.prototype.getTagName = function()
{
	return 'textarea';
};
