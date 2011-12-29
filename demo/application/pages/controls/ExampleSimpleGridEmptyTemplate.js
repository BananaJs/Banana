goog.provide('Application.Controls.Examples.SimpleGridEmptyTemplate');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').SimpleGridEmptyTemplate = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{	
		var datagrid = new Banana.Controls.DataGrid();
		var controlPanel = new Banana.Controls.DataGridControlPanel();
		datagrid.setControlPanel(controlPanel);

		controlPanel.setTopButtons([ new Banana.Controls.Button().setText('Load data')
		                         .bind('click',this.getProxy(function(){
		                        	 this.populateGrid();
		                         }))]);
		controlPanel.setButtons([
		                         new Banana.Controls.Button().setText('Delete selected')
		                         .bind('click',this.getProxy(function(){
		                        	 var selectedIndices = listRender.getSelectedIndices(true);
		                        	 
		                        	 listRender.removeSelectedItems();
		                         }))]);

		datagrid.setEmptyTemplate(function(){
			var p = new Banana.Controls.Panel();
			p.addControl("No data. press load data");
			return p;
		})
		var listRender = datagrid.getListRender();
		listRender.setColumns(this.getColumns());
			
		this.addControl(datagrid);
		
		this.datagrid = datagrid;
		window.lol = datagrid;
	},

	populateGrid : function()
	{
		this.datagrid.setDataSource(this.getDataSource());
		//this.datagrid.setDataSource([]);
	},
	
	getColumns : function()
	{
		return [
		               new Banana.Controls.DataGridColumn().setHeaderText('Id').setDataField('id').setSortField("id"),
		               new Banana.Controls.DataGridColumn().setHeaderText('Name').setDataField('name').setSortField("name"),
		               new Banana.Controls.DataGridColumn().setHeaderText('Description').setDataField('description').setSortField("description"),
		               new Banana.Controls.DataGridColumn().setHeaderText('Color').setDataField('color').setSortField("color")
		               .bind('onItemCreated',this.getProxy(function(e,param){
		            	  
		            	   if (param.data.color == 1)
		            	   {
		            		   param.control.setData("red");
		            	   }
		            	   else
		            	   {
		            		   param.control.setData("yellow");
		            	   }
		            	   
		               }))
		               ,
		               new Banana.Controls.DataGridColumn().setHeaderText('Country').setDataField('country').setSortField("country")
		               ];
	},
	
	getDataSource : function()
	{
		var orgsource = [
		 {id:1,'name':'Orange','description':'Mare neque','country':'Peru','color':1},
         {id:2,'name':'Apple','description':'Diam a nulla placerat ru','country':'Spain','color':1},
         {id:3,'name':'Banana','description':'Llis eros eget mauri','country':'Spain','color':1},
         {id:4,'name':'Orange','description':'Morbi sollicitudin','country':'Peru','color':1},
         {id:5,'name':'Bolwara','description':'Er in adipiscing turpis.','country':'Peru','color':1}
        ]
		
		return orgsource;
	}
});