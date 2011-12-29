goog.provide('Application.Controls.Examples.ExampleTileSimple2');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleTileSimple2 = Application.Controls.Examples.ControlOverview.extend({
	
	createComponents : function()
	{
		var datasource = [
			                 "a","b","c","d","e","f","g","h","i","j","k","l"
			                  ];
			
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setItemRender(function(){
			return new Application.Controls.Examples.ExampleTileSimple2TileItemRender();
		})
		
		listRender.addCssClass("ExampleTileSimple2");
		//listRender.setPlaceHolderWidth("25%;");
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);	

		this.addControl(grid);	
	}
	
});


namespace('Application.Controls.Examples').ExampleTileSimple2TileItemRender = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("ExampleTileSimple2ItemRender")
		
		this.panel.addControl(this.data);
		
		this.addControl(this.panel);
	},
	
	select : function()
	{
		this.panel.addCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	deselect : function()
	{
		this.panel.removeCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	mouseOver : function()
	{
		this.panel.addCssClass("ExampleTileSimple2ItemRenderMouseover")
	},
	
	mouseOut : function()
	{
		this.panel.removeCssClass("ExampleTileSimple2ItemRenderMouseover")
	},
	
	getIsSelectable : function()
	{
		return true;
	}
	
});