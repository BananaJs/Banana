goog.provide('Application.Pages.PageTemplates.PageTemplate');

/**
 * Template contains header with link and the content
 */
namespace('Application.Pages.PageTemplates').PageTemplate = Banana.PageTemplate.extend({
	
	init : function()
	{
		this._super();
		
		this.addCssClass("DemoTemplate")
	},
	
	createComponents : function()
	{	
		this.top = new Banana.Controls.Panel();
		this.top.addCssClass("DemoTopContainer");		
		this.addControl(this.top);
		
		this.createLinks();
			
		var content = new Banana.Controls.Panel();
		content.addCssClass("DemoPageContent");
		this.addControl(content);
		
		content.addControl(this.content);
		content.addControl('<div style="clear:both;"></div>')
	},
	
	createLinks : function()
	{
		var linkPanel = new Banana.Controls.Panel();
		linkPanel.addCssClass("DemoLinkPanel");
		
		this.top.addControl(linkPanel);
		
		var link = new Banana.Controls.Link();
		link.addControl("Home");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Home");
			e.preventDefault();
		}));
		link.setHref("#section=Home");
		linkPanel.addControl(link);
	}
});