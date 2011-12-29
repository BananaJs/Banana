goog.provide('Application.Controls.Examples.ExampleTileSimple');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleTileSimple = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var datasource = [
		                 "a","b","c"
		                  ];
		
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()

		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);	

		this.addControl(grid);		
	}
});