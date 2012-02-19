/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Link Component
 */

goog.provide('Banana.Controls.Link');

/** @namespace Banana.Controls.Link */
namespace('Banana.Controls').Link = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.Link.prototype */
{
	/**
	 * Creates a link control. The equivalent of href
	 * Use setHref to define a link and setText for the visible text.
	 * By default the link control does not have a target.
	 * 
	 * example use:
	 * var link = new Banana.Controls.Link();
	 * link.setHref("http://foo.com");
	 * link.setText("a link");
	 * link.bind('click',function(){});
	 *
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super(); 

		this.addCssClass('BLink');
	},
	
	/**
	 * @override
	 */
	updateDisplay : function()
	{
		if (!this.text) return;
		
		Banana.Util.DomHelper.renderHtml(this.text,this);
	},
	
	/**
	 * Sets the target we want to direct the link to.
	 * use "_blank" to direct to a new window.
	 * @param {String} target
	 */
	setTarget : function(target)
	{
		this.setAttribute('target',target);
	},
	
	/**
	 * Sets the the target link
	 * @param {String} href
	 */
	setHref : function(href)
	{
		this.setAttribute('href',href);
		return this;
	},
	
	/**
	 * Sets the text we want to display 
	 * @param {String} text
	 */
	setText : function(text)
	{
		this.text =text;
		
		if (this.isRendered)
		{
			Banana.Util.DomHelper.renderHtml(this.text,this,true);
		}
		return this;
	},
	
	/**
	 * @return {String} 
	 */
	getTagName : function()
	{
		return 'a';
	}
});