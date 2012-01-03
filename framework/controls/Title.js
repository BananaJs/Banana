/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Title control 
 */

goog.provide('Banana.Controls.Title');

/** @namespace Banana.Controls.Title */
namespace('Banana.Controls').Title = Banana.UiControl.extend(
/** @lends Banana.Controls.Title.prototype */
{
	/**
	 * Creates a title
	 * @param {String} tag i.e h2 
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init: function(tag)
	{
		this._super();
		
		this.addCssClass('BTitle');
		
		this.tag = 'h2';
		if (tag)
			this.tag = tag;
	},

	/**
	 * Specifies the tag.
	 * Note not possible to change this after rerender
	 * @param {String} tag
	 * @return {this}
	 */
	setTagName: function(tag)
	{
		this.tag = tag;
		return this;
	},

	/**
	 * @return {String}
	 */
	getTagName : function()
	{
		return this.tag;
	}
});