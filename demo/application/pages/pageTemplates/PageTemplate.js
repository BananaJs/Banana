
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
		
		var menuBar = new Banana.Controls.Panel().addCssClass("Header");
		menuBar.addControl("")
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
