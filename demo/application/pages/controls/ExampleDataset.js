goog.provide('Application.Controls.Examples.ExampleDataset');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleDataset = Application.Controls.Examples.ControlOverview.extend	({
	
	init : function()
	{
		this._super();
		
		this.dataseta = new Banana.Data.DataSet();
		this.datasetb = new Banana.Data.DataSet();
	},
	
	updateDataset : function()
	{
		var datasourcea = [];
		datasourcea.push({id:1,'name':'Orange','description':'Mare neque','country':'Peru','color':1});
		datasourcea.push({id:2,'name':'Apple','description':'Diam a nulla placerat ru','country':'Spain','color':1});
		datasourcea.push({id:3,'name':'Banana','description':'Llis eros eget mauri','country':'Spain','color':1});
		
		this.dataseta.setData(datasourcea);
		
		this.dataseta.clientUpdate();		
	},
	
	clearDataset : function()
	{	
		this.dataseta.setData([]);
		
		this.dataseta.clientUpdate();		
	},
		
	createComponents : function()
	{	
		var columns = [];
		columns.push(new Banana.Controls.DataGridColumn().setHeaderText('Id').setDataField('id'));
		columns.push(new Banana.Controls.DataGridColumn().setHeaderText('Name').setDataField('name'));
		columns.push(new Banana.Controls.DataGridColumn().setHeaderText('Description').setDataField('description'));
		columns.push(new Banana.Controls.DataGridColumn().setHeaderText('Color').setDataField('color')
					.bind('onItemCreated',this.getProxy(function(e,param){
						  
						   if (param.data.color == 1)
						   {
							   param.control.setData("red");
						   }
						   else
						   {
							   param.control.setData("yellow");
						   }
						   
					   })));
		columns.push(new Banana.Controls.DataGridColumn().setHeaderText('Country').setDataField('country'));
		               
		var datagrid = new Banana.Controls.DataGrid();
		
		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);
		
		var controlPanel = new Banana.Controls.DataGridControlPanel();
		datagrid.setControlPanel(controlPanel);
		
		var button = new Banana.Controls.Button().setText("fill dataset");
		button.bind('click',this.getProxy(function(){
			this.updateDataset();
		}));
		
		var button2 = new Banana.Controls.Button().setText("clear dataset");
		button2.bind('click',this.getProxy(function(){
			this.clearDataset();
		}));
		
		var buttons = [];
		buttons.push(button);
		buttons.push(button2);
		controlPanel.setButtons(buttons);
		
		datagrid.dataSetSourceBind(this.dataseta);
				
		this.addControl(datagrid);
	},
	
	getCode : function()
	{
		return 'init : function() { this._super(); this.dataseta = new Banana.Data.DataSet(); this.datasetb = new Banana.Data.DataSet(); }, updateDataset : function() { var datasourcea = []; datasourcea.push({id:1,"name":"Orange","description":"Mare neque","country":"Peru","color":1}); datasourcea.push({id:2,"name":"Apple","description":"Diam a nulla placerat ru","country":"Spain","color":1}); datasourcea.push({id:3,"name":"Banana","description":"Llis eros eget mauri","country":"Spain","color":1}); this.dataseta.setData(datasourcea); this.dataseta.clientUpdate();               }, clearDataset : function() {  this.dataseta.setData([]); this.dataseta.clientUpdate();                }, createComponents : function() {      var columns = []; columns.push(new Banana.Controls.DataGridColumn().setHeaderText("Id").setDataField("id")); columns.push(new Banana.Controls.DataGridColumn().setHeaderText("Name").setDataField("name")); columns.push(new Banana.Controls.DataGridColumn().setHeaderText("Description").setDataField("description")); columns.push(new Banana.Controls.DataGridColumn().setHeaderText("Color").setDataField("color") .bind("onItemCreated",this.getProxy(function(e,param){ if (param.data.color == 1) { param.control.setData("red"); } else { param.control.setData("yellow"); } }))); columns.push(new Banana.Controls.DataGridColumn().setHeaderText("Country").setDataField("country")); var datagrid = new Banana.Controls.DataGrid(); var listRender = datagrid.getListRender(); listRender.setColumns(columns); var controlPanel = new Banana.Controls.DataGridControlPanel(); datagrid.setControlPanel(controlPanel); var button = new Banana.Controls.Button().setText("fill dataset"); button.bind("click",this.getProxy(function(){ this.updateDataset(); })); var button2 = new Banana.Controls.Button().setText("clear dataset"); button2.bind("click",this.getProxy(function(){ this.clearDataset(); })); var buttons = []; buttons.push(button); buttons.push(button2); controlPanel.setButtons(buttons); datagrid.dataSetSourceBind(this.dataseta); this.addControl(datagrid)';
	}
	
});