goog.provide('Application.Controls.Examples.ExampleTileSimple');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleTileSimple = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var datasource = [
		                 "a","b","c"
		                  ];
		
		var grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender();
		listRender.setPlaceHolderWidth('100%');
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);	

		this.addControl(grid);		
	},
	
	getCode : function()
	{
		return 'createComponents : function() { var datasource = [ "a","b","c" ]; var grid = new Banana.Controls.DataGrid(); var listRender = new Banana.Controls.DataGridTileListRender(); grid.setListRender(listRender); grid.setDataSource(datasource);  this.addControl(grid);}';
	}
});