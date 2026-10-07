import {Page} from "./Page.js";
import {Panel} from "./Panel.js";

/** @namespace Banana.ContentPlaceholder */
export class PageTemplate extends Page
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
	init ()
	{
		super.init();
		this.addCssClass("BPageTemplate")
		this.content = new Panel();
		this.content.addCssClass("BPageTemplateContent");
	}
	
	/**
	 * @override
	 */
	createComponents ()
	{
		this.addControl(this.content);
	}
	
	/**
	 * Initiates the render process
	 * Automatically called by the application
	 */
	run ()
	{	
		if (!this.isRendered)
		{
			super.run();
		}
		else
		{
			this.triggerEvent('renderComplete',this);
		}
	
		this.pageControl.setApplication(this.getApplication());
		this.pageControl.run(this.content);
	}

	/**
	 * Automatically called by the application
	 * @param {Banana.Page} page
	 */
	addPageControl (page)
	{
		page.setContentPlaceHolder(this);
		this.pageControl = page;		
	}
};