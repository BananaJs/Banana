goog.provide("Application.Controls.HomeTileItemRender");

namespace('Application.Controls').HomeTileItemRender = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("DemoHomeTile")
		
		var title = new Banana.Controls.Panel();
		title.addCssClass("DemoHomeTileTitle")
		title.addControl(this.data.title);
		
		var contents = new Banana.Controls.Panel();
		contents.addCssClass("DemoHomeTileContents");
		contents.addControl(this.data.contents);
		
		var link = new Banana.Controls.Link();
		link.addControl("View");
		link.setHref('#section='+this.data.link);
		
		var linkContainer = new Banana.Controls.Panel();
		linkContainer.addCssClass("DemoHomeTileLinkContainer");
		linkContainer.addControl(link);
		
		this.panel.addControl(title);
		this.panel.addControl(contents);
		this.panel.addControl(linkContainer);

		this.addControl(this.panel);
	},
	
	updateDisplay : function()
	{
		//make sure that our tile got the same height as width.	
		this.panel.setCss({'height':Math.round(this.panel.getDimensions().width * 0.8)});
	},
	
	
	select : function()
	{
		this.panel.addCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	deselect : function()
	{
		this.panel.removeCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	getIsSelectable : function()
	{
		return false;
	}
	
});