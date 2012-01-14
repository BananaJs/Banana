
goog.provide('Application.Pages.PageTemplates.PageTemplate');

namespace('Application.Pages.PageTemplates').PageTemplate = Banana.PageTemplate.extend({
	
	init : function()
	{
		this._super();
		
		this.addCssClass("template")
		
		this.loader = new Banana.Controls.Loader();
		this.addControl(this.loader);
	},
	
	createComponents : function()
	{	
		this.top = new Banana.Controls.Panel();
		this.top.addCssClass("topBar");		
		this.addControl(this.top);
		
		this.createLogo();
		this.createLinks();
			
		var content = new Banana.Controls.Panel();
		content.addCssClass("pageContent");
		this.addControl(content);
		
		content.addControl(this.content);
		
		var footer = new Banana.Controls.Panel().addCssClass("footer");
		footer.addControl("Banana Framework 2011");
		this.addControl(footer);
		
		this.addControl('<div style="clear:both;"></div>');
	},
	
	createLogo : function()
	{
		var logo = new Banana.Controls.Link();
		logo.setHref("#section=Home");
		logo.addCssClass("logo")
		this.top.addControl(logo);
	},
	
	createLinks : function()
	{
		var linkPanel = new Banana.Controls.Panel().addCssClass("headerButtons")
		linkPanel.addCssClass("linkPanel");
		
		this.top.addControl(linkPanel);
		
		var link = new Banana.Controls.Link();
		link.addCssClass("toplink");
		link.addControl("Examples");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Examples");
			e.preventDefault();
		}));
		link.setHref("#section=Examples");
		linkPanel.addControl(link);
		
		var link = new Banana.Controls.Link();
		link.addCssClass("toplink");
		link.addControl("Download");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Examples");
			e.preventDefault();
		}));
		link.setHref("#section=Examples");
		linkPanel.addControl(link);
		
		var link = new Banana.Controls.Link();
		link.addCssClass("toplink");
		link.addControl("Documentation");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Examples");
			e.preventDefault();
		}));
		link.setHref("#section=Examples");
		linkPanel.addControl(link);		
		
		
		var link = new Banana.Controls.Link();
		link.addCssClass("toplink");
		link.addControl("Contact");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Contact");
			e.preventDefault();
		}));
		link.setHref("#section=Contact");
		linkPanel.addControl(link);	
	},
	
	showLoader : function(text)
	{
		this.loader.show(text);
	},
	
	hideLoader : function()
	{
		this.loader.hide();
	},

	/**
	 * @return Banana.Control
	 */
	getMessageBar : function()
	{
		return this.messagebar;
	}	
});
