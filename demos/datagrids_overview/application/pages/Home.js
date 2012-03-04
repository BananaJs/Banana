goog.provide('Application.Pages.MyPage');

goog.require('Application.Pages.PageTemplates.PageTemplate');
goog.require("Application.Controls.HomeTileItemRender");


goog.require('Application.Controls.Datagrids.TablegridSimple');
goog.require('Application.Controls.Datagrids.TablegridFilterable');
goog.require('Application.Controls.Datagrids.TablegridCustomItemRender');

namespace('Application.Pages').Home = Banana.Page.extend( {


	createComponents: function()
	{
	
		var t = new Banana.Controls.TabSlider();
		t.setUseAutoHeight(true);
		t.setSlideSpeed(500);
		t.setStyle("width:100%;");
		t.setUseUrlHistory(true);
		this.addControl(t);
		

		t.addContent(this.getDataGridOverview(),"Table datagrids");
		t.addContent(this.getTileGridOverview(),"Tile datagrids");
		t.addContent(this.getTreeGridOverview(),"Tree datagrids");
		//this.addControl(grid);	
	},
	
	getDataGridOverview : function()
	{
		var datasource = [
			                 {'title':'Basic Table datagrid',
			                  'control':"Application.Controls.Datagrids.TablegridSimple",
			                  'open':true,
			                  'contents': "Table datagrid shows a vertical list of items devided in rows and columns."
			                 },
			                 
			                 {'title':'Filterable',
			                  'control':"Application.Controls.Datagrids.TablegridFilterable",
				              'contents': "Table datagrid with filterable components"
				             },
				             
			                 {'title':'Custom item render',
				              'control':"Application.Controls.Datagrids.TablegridCustomItemRender",
					          'link':"ewrwe",
					          'contents': "To extend the interactivity you can define your own item render. "
					         },
					         
			                 {'title':'Dataset data provider',
			                  'link':"ewrwe",
			                  'contents': "Managing datasources with datasets"
			                 },
			                 
			                 {'title':'Simulated dynamic data',
				              'link':"ewrwe",
				              'contents': "Dynamic data coming from a server"
				             },
				             
			                 {'title':'dynamic updating contents',
					          'link':"ewrwe",
					          'contents': "Dynamic updating the contents of the list"
					         }
					        ];
		
		grid = new Banana.Controls.DataGrid();
		grid.addCssClass("DemoTableDataGrids");
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setItemRender(function(){
			return new Application.Controls.HomeTileItemRender();
		})
		
		listRender.setPlaceHolderWidth((100/3)+"%;");
		listRender.bind('onGrow',this.getProxy(function(e,f){
			
		}))
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);
		
		return grid;
					
	},
	
	getTileGridOverview : function()
	{
		var datasource = [
			                 {'title':'Basic Tile datagrid',
			                  'link':"ewrwe",
			                  'contents': "Tile datagrid in a simple form"
			                 },
			                 
			                 {'title':'Selectables',
				              'link':"ewrwe",
				              'contents': "Selectable tiles"
				             },
				             
			                 {'title':'Custom item render',
					          'link':"ewrwe",
					          'contents': "To extend the interactivity you can define your own item render. "
					         },
					         
			                 {'title':'Dataset data provider',
			                  'link':"ewrwe",
			                  'contents': "Managing datasources with datasets"
			                 },
			                 
			                 {'title':'Simulated dynamic data',
				              'link':"ewrwe",
				              'contents': "Simulate data population coming from a server"
				             },
				             
			                 {'title':'dynamic updating contents',
					          'link':"ewrwe",
					          'contents': "Adding and removing tiles based on updated datasource"
					         }
					        ];
		
		grid = new Banana.Controls.DataGrid();
		grid.addCssClass("DemoTileDataGrids");
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setItemRender(function(){
			return new Application.Controls.HomeTileItemRender();
		})
		
		listRender.setPlaceHolderWidth((100/3)+"%;");
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);
		
		return grid;
					
	},
	
	
	getTreeGridOverview : function()
	{
		var datasource = [
			                 {'title':'Basic Table datagrid',
			                  'link':"ewrwe",
			                  'contents': "Table datagrid shows a vertical list of items devided in rows and columns."
			                 },
			                 
			                 {'title':'Filterable',
				              'link':"ewrwe",
				              'contents': "Table datagrid with filterable components"
				             },
				             
			                 {'title':'Custom item render',
					          'link':"ewrwe",
					          'contents': "To extend the interactivity you can define your own item render. "
					         },
					         
			                 {'title':'Dataset data provider',
			                  'link':"ewrwe",
			                  'contents': "Managing datasources with datasets"
			                 },
			                 
			                 {'title':'Simulated dynamic data',
				              'link':"ewrwe",
				              'contents': "Dynamic data coming from a server"
				             },
				             
			                 {'title':'dynamic updating contents',
					          'link':"ewrwe",
					          'contents': "Dynamic updating the contents of the list"
					         }
					        ];
		
		grid = new Banana.Controls.DataGrid();
		grid.addCssClass('DemoTreeDataGrids');
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setItemRender(function(){
			return new Application.Controls.HomeTileItemRender();
		})
		
		listRender.setPlaceHolderWidth((100/3)+"%;");
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);
		
		return grid;
					
	}
	
	
	
});