goog.provide('Application.Controls.Examples.ExampleTileCustomItemRender');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleTileCustomItemRender = Application.Controls.Examples.ControlOverview.extend({
	
	createComponents : function()
	{
		var datasource = [
			                 {'description':'Planet of honor','rating':"8.5"},
			                 {'description':'Love and me','rating':"4.5"},
			                 {'description':'Killer beans','rating':"6.5"},
			                 {'description':'Sacred general ','rating':"9.5"}
			                  ];
			
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setItemRender(function(){
			return new Application.Controls.Examples.ExampleTileCustomItemRenderControl();
		})
		
		listRender.addCssClass("ExampleTileSimple2");
		listRender.setPlaceHolderWidth("100%;");
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);	

		this.addControl(grid);	
	}
	
});


namespace('Application.Controls.Examples').ExampleTileCustomItemRenderControl = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("ExampleTileSimple2ItemRender2")
		
		var im = new Banana.Controls.Panel();
		im.addCssClass("ExampleTileSimple2ItemRenderBox")
		
		var ix = new Banana.Controls.Panel();
		im.addCssClass("ExampleTileSimple2ItemRenderBox2");
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Label().setData(this.data.description)
		).setData('Description'));
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Label().setData(this.data.rating)
		).setData('Rating'));
		
		
		
		this.panel.addControl(im);
		this.panel.addControl(ix);
		this.panel.addControl("<div style='clear:both;'></div>");
		
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
	
	getIsSelectable : function()
	{
		return false;
	}
	
});