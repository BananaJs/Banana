/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Page 
 */

goog.provide('Banana.PageTemplate');

goog.require('Banana.Page');

/** @namespace Banana.ContentPlaceholder */
namespace('Banana').PageTemplate  = Banana.Page.extend(
/** @lends Banana.PageTemplate.prototype */
{	
	/**
	 * Creates a page template.
	 * A page template is no different from a page. 
	 * By default banana pages are loaded inside a page template.
	 * You might create your own page template with navigation buttons on top and a center
	 * where your pages are getting inserted and maybe a footer with some info. 
	 * @constructs
	 * @extends Banana.Page
	 */
	init : function()
	{
		this._super();
		this.addCssClass("BPageTemplate")
		this.content = new Banana.Controls.Panel();
	},
	
	/**
	 * @override
	 */
	createComponents : function()
	{
		this.addControl(this.content);
	},
	
	/**
	 * Initiates the render process
	 * Automatically called by the application
	 */
	run : function()
	{	
		if (!this.isRendered)
		{
			this._super();
		}
		else
		{
			this.triggerEvent('renderComplete',this);
		}
	
		this.pageControl.setApplication(this.getApplication());
		this.pageControl.run(this.content);
	},

	/**
	 * Automatically called by the application
	 * @param {Banana.Page} page
	 */
	addPageControl : function(page)
	{
		page.setContentPlaceHolder(this);
		this.pageControl = page;		
	}
});