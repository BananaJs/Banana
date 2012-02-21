goog.provide('Application.Controls.Datagrids.TablegridSimple');

namespace('Application.Controls.Datagrids').TablegridSimple = Banana.Controls.Panel.extend	({
	
	createComponents : function()
	{
		var datasource = [
		                  {id:1,'name':'Orange','description':'Mare neque','country':'Peru','color':1},
		                  {id:2,'name':'Apple','description':'Diam a nulla placerat ru','country':'Spain','color':1},
		                  {id:3,'name':'Banana','description':'Llis eros eget mauri','country':'Spain','color':1},
		                  {id:4,'name':'Orange','description':'Morbi sollicitudin','country':'Peru','color':1},
		                  {id:5,'name':'Bolwara','description':'Er in adipiscing turpis.','country':'Peru','color':1}
		                  ];
		
		var columns = [
		               new Banana.Controls.DataGridColumn().setHeaderText('Id').setDataField('id'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Description').setDataField('description'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Color').setDataField('color')
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
		               new Banana.Controls.DataGridColumn().setHeaderText('Country').setDataField('country')
		               ]
		
		var datagrid = new Banana.Controls.DataGrid();
		
		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);
		
		datagrid.setDataSource(datasource);
			
		this.addControl(datagrid);
	},
	
	getCode : function()
	{
		return 'createComponents : function() { var datasource = [ {id:1,"name":"Orange","description":"Mare neque","country":"Peru","color":1}, {id:2,"name":"Apple","description":"Diam a nulla placerat ru","country":"Spain","color":1}, {id:3,"name":"Banana","description":"Llis eros eget mauri","country":"Spain","color":1}, {id:4,"name":"Orange","description":"Morbi sollicitudin","country":"Peru","color":1}, {id:5,"name":"Bolwara","description":"Er in adipiscing turpis.","country":"Peru","color":1} ]; var columns = [ new Banana.Controls.DataGridColumn().setHeaderText("Id").setDataField("id"), new Banana.Controls.DataGridColumn().setHeaderText("Name").setDataField("name"), new Banana.Controls.DataGridColumn().setHeaderText("Description").setDataField("description"), new Banana.Controls.DataGridColumn().setHeaderText("Color").setDataField("color") .bind("onItemCreated",this.getProxy(function(e,param){ if (param.data.color == 1) { param.control.setData("red"); } else { param.control.setData("yellow"); } })) , new Banana.Controls.DataGridColumn().setHeaderText("Country").setDataField("country") ] var datagrid = new Banana.Controls.DataGrid(); var listRender = datagrid.getListRender(); listRender.setColumns(columns); datagrid.setDataSource(datasource); this.addControl(datagrid); }}';
	}
	
});