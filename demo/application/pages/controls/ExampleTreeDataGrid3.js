goog.provide('Application.Controls.Examples.ExampleTreeDataGrid3');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');
	

namespace('Application.Controls.Examples').ExampleTreeDataGrid3 = Application.Controls.Examples.ControlOverview.extend	({
	

	createComponents : function()
	{
			var datasource =[]; 
			
			var s1 = {'name':'a','children':[]};
			var s2 = {'name':'b','children':[]};
			var s3 = {'name':'c','children':[]};
			var s4 = {'name':'d','children':[]};
			var s5 = {'name':'e','children':[]};
			var s6 = {'name':'f','children':[]};
			var s7 = {'name':'g','children':[]};
			var s8 = {'name':'h','children':[]};
			
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
			listRender.setItemRenderByIndex("0-0-0",Application.Controls.Examples.CustomTreeItemRender);
			
			list.setListRender(listRender);
			listRender.setSortfunction(function(a,b)
			{ 
				return a.name.toString().toLowerCase().localeCompare(b.name.toString().toLowerCase())
			});
			list.setDataSource(datasource);
				
			this.addControl(list);		
			
			window.pop = listRender;
	}
});


namespace("Application.Controls.Examples").CustomTreeItemRender = Banana.Controls.DataGridTreeItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel().setStyle('float:left;background-color:red;');
		this.panel.addCssClass('BDataGridTreeItemRender');
		
		this.label = new Banana.Controls.Label().setStyle('float:left;');
		this.panel.addControl(this.label);
		
		this.addControl(this.panel);
	}
	
	
	
});


