goog.provide('Application.Controls.Examples.ExampleTreeDataGrid');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');
	

namespace('Application.Controls.Examples').ExampleTreeDataGrid = Application.Controls.Examples.ControlOverview.extend	({
	

	createComponents : function()
	{
			var datasource =[]; 
			
			var s1 = {'name':'s1','children':[]};
			var s2 = {'name':'s2','children':[]};
			var s3 = {'name':'s3','children':[]};
			var s4 = {'name':'s4','children':[]};
			var s5 = {'name':'s5','children':[]};
			var s6 = {'name':'s6','children':[]};
			var s7 = {'name':'s7','children':[]};
			var s8 = {'name':'s8','children':[]};
			
			datasource.push(s7);
			datasource.push(s1);
			datasource.push(s2);
			datasource.push(s3);
			
			s7.children.push(s8);
			s1.children.push(s4);
			s1.children.push(s5);		
			s4.children.push(s6);
			
			var list = new Banana.Controls.DataGrid();
	
			var listRender = new Banana.Controls.DataGridTreeListRender();
			listRender.setChildProperty("children");
			
			list.setListRender(listRender);		
			list.setDataSource(datasource);
				
			this.addControl(list);			
	}
});