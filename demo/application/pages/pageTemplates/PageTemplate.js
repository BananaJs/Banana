
goog.provide('Application.Pages.PageTemplates.PageTemplate');

namespace('Application.Pages.PageTemplates').PageTemplate = Banana.PageTemplate.extend({
	
	init : function()
	{
		this._super();
		
		this.loader = new Banana.Controls.Loader();
		this.addControl(this.loader);
	},
	
	createComponents : function()
	{	
		var con = new Banana.Controls.Panel().addCssClass('MainContainer')
		
		this.addControl(con);
		
		var link = new Banana.Controls.Link();
		link.addControl("Banana Javascript Framework");
		link.setHref("#section=Home");
		link.addCssClass("HomeLink")
		
		var menuBar = new Banana.Controls.Panel().addCssClass("Header");
		menuBar.addControl(link)
		
		
	
		
		var p = new Banana.Controls.Panel().addCssClass("headerButtons")
		//p.addCssClass("borderPanel")
		
		var link = new Banana.Controls.Link();
		link.addCssClass("menusub");;
		link.addControl("Examples");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Examples");
			e.preventDefault();
		}));
		link.setHref("#section=Examples");
		p.addControl(link);
		
		var link = new Banana.Controls.Link();
		link.addCssClass("menusub");;
		link.addControl("Download");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Examples");
			e.preventDefault();
		}));
		link.setHref("#section=Examples");
		p.addControl(link);

		var link = new Banana.Controls.Link();
		link.addCssClass("menusub");;
		link.addControl("Documention");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Examples");
			e.preventDefault();
		}));
		link.setHref("#section=Examples");
		p.addControl(link);

		
		
		menuBar.addControl(p)
		
		
		
		
		con.addControl(menuBar);
		
		con.addControl(this.content);
		
		var footer = new Banana.Controls.Panel().addCssClass("footer");
		footer.addControl("Banana Framework 2011");
		con.addControl(footer);
		
		con.addControl('<div style="clear:both;"></div>');
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
