goog.provide('Application.Controls.Examples.ExampleGridCustomItemRender');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleGridCustomItemRender = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{	
		var datagrid = new Banana.Controls.DataGrid();
		var controlPanel = new Banana.Controls.DataGridControlPanel();
		datagrid.setControlPanel(controlPanel);

		controlPanel.setButtons([
		                         new Banana.Controls.Button().setText('Edit details')
		                         .bind('click',this.getProxy(function(){
		                        	 var selectedIndices = listRender.getSelectedIndices(true);
		                        	 
		                        	 ir = function(){
		                        		 return new Application.Controls.Examples.CustomItemRender2();
		                        	 }
		                        	 
		                        	 listRender.setItemRenderByIndices(listRender.getSelectedIndices(true),ir);
		                         })),
		                         new Banana.Controls.Button().setText('Show details')
		                         .bind('click',this.getProxy(function(){
		                        	
		                        	 ir = function(){
		                        		 return new Application.Controls.Examples.CustomItemRender1();
		                        	 }
		                        	 
		                        	 listRender.setItemRenderByIndex(2,ir);
		                         }))
		                         ]);

		var listRender = datagrid.getListRender();
		listRender.setColumns(this.getColumns());
		
		listRender.bind('resetItemRender',this.getProxy(function(e,params){
			 ir = listRender.defaultContentItemRender;
        	 listRender.setItemRenderByIndex(params.index,ir);		
		}));
		
		listRender.bind('onCommand',this.getProxy(function(e,params){
			
			var index = params.index;
			var commandName = params.commandName;
			
			//check if at index is already custom item render.
			if (listRender.hasItemRenderAt(index,Application.Controls.Examples.CustomItemRender1))
			{		
				var irClosed = function() 
				{	
					return new listRender.defaultContentItemRender();
				};
			}
			else
			{		
				var irOpened = function()
				{
					return new Application.Controls.Examples.CustomItemRender2();
				};
			}
		
			listRender.setItemRenderByIndex(index,irOpened);
			
		}))
			
		this.addControl(datagrid);
		
		this.datagrid = datagrid;
		this.populateGrid();
	},

	populateGrid : function()
	{
		this.datagrid.setDataSource(this.getDataSource());
	},
	
	getColumns : function()
	{
		return [
		        	   new Banana.Controls.DataGridImageButtonColumn().setCommandName('expand').setImageUrl(Banana.Application.settings.imagedir+'/arrowopen.png').setStyle('cursor:pointer;width:20px;'),
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


namespace('Application.Controls.Examples').CustomItemRender1 = Banana.Controls.DataGridTableContentItemRender.extend({
	
	createComponents : function()
	{
		this.mainColumn = new Banana.Controls.TableCol();
		this.mainColumn.setAttribute('colSpan',this.listRender.columns.length);
		this.mainColumn.addCssClass('examplesCustomItemRender');
		this.addControl(this.mainColumn);
		
		this.table = new Banana.Controls.Table();
		this.mainColumn.addControl(this.table);
		
		var topRow = new Banana.Controls.TableRow();
		topRow.setStyle('padding:0;margin:0;');
		this.table.addControl(topRow);

		var bottomRow = new Banana.Controls.TableRow();
		bottomRow.setStyle('padding:0;margin:0;');
		this.table.addControl(bottomRow);
			
		this.createColumns(topRow);
		
		this.createExtraControls(bottomRow);
	},
	
	createColumns : function(target)
	{
		var columns = this.listRender.columns;
		
		for (var j =0, clen = columns.length; j < clen; j++)
		{
			var columnController = columns[j]; //column defined by user
			
			var control = columnController.getControl();
		
			if (j == 0)
			{
				control.setImage(Banana.Application.settings.imagedir+'/arrowclose.png');
			}
			
			if (columnController.getDataField())
			{		
				control.setData(Banana.Util.getDataByPath(this.getData(),columnController.getDataField()));
			}
						
			var column = new Banana.Controls.TableCol();
			column.setStyle(columnController.getStyle());
			column.addControl(control);
			
			target.addControl(column);
			
			columnController.triggerEvent('onItemCreated',{'control':control,'data':this.getData()});
		}				
	},	
	
	createExtraControls : function(target)
	{
		var datasource = [
		                  {'ordered':'123','date':'2011-12-12','by':'John'},
		                  {'ordered':'6578','date':'2011-12-12','by':'John'},
		                  {'ordered':'543','date':'2011-12-12','by':'Sue'}
		                  ];
		
		var columns = [
		               new Banana.Controls.DataGridColumn().setHeaderText('# Ordered').setDataField('ordered'),
		               new Banana.Controls.DataGridColumn().setHeaderText('By').setDataField('by'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Date').setDataField('date')
		               ]
		
		var datagrid = new Banana.Controls.DataGrid();
				
		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);
		
		datagrid.setDataSource(datasource);
			
		target.addControl(datagrid);		
	},

	getIsSelectable : function()
	{
		return false;
	}	
});



namespace('Application.Controls.Examples').CustomItemRender2 = Banana.Controls.DataGridTableContentItemRender.extend({
	

	createComponents : function()
	{
		this.mainColumn = new Banana.Controls.TableCol();
		this.mainColumn.setAttribute('colSpan',this.listRender.columns.length);
		this.mainColumn.addCssClass('examplesCustomItemRender');
		this.addControl(this.mainColumn);
		
		this.table = new Banana.Controls.Table();
		this.mainColumn.addControl(this.table);
		
		var topRow = new Banana.Controls.TableRow();
		topRow.setStyle('padding:0;margin:0;');
		this.table.addControl(topRow);
		
		var column = new Banana.Controls.TableCol();
		topRow.addControl(column);
		
		
		var tb = new Banana.Controls.TextBox();
		var vali = new Banana.Controls.Decorators.RequiredFieldValidator(tb);
		var c = new Banana.Controls.Decorators.LabelDecorator(vali).setData('New name')

		column.addControl(c);
		
		var but1 = new Banana.Controls.Button().setText("save");
		but1.bind('click',this.getProxy(function(){
			
			if (vali.isValid())
			{
				this.data.name =  tb.getData();
				var data = {};
				data.index = this.getListRender().getIndexByItemRender(this);
				this.getListRender().triggerEvent('resetItemRender',data);
			}
		}));
		var but2 = new Banana.Controls.Button().setText("cancel");
		but2.bind('click',this.getProxy(function(){
			var data = {};
			data.index = this.getListRender().getIndexByItemRender(this);
			this.getListRender().triggerEvent('resetItemRender',data);
		}))

		column.addControl(but1);
		column.addControl(but2);
	//	panel.addControl(tb);
	},
	
	getIsSelectable : function()
	{
		return false;
	}	
});

