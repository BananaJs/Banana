goog.provide('Application.Controls.Datagrids.TablegridCustomItemRender');


namespace('Application.Controls.Datagrids').TablegridCustomItemRender = Banana.Controls.Panel.extend	({
	
	createComponents : function()
	{	
		this.datagrid = new Banana.Controls.DataGrid();

		var listRender = this.datagrid.getListRender();
		
		listRender.setItemRender(Application.Controls.Datagrids.CustomItemRender); 
		
		listRender.setColumns(this.getColumns());
			
		this.addControl(this.datagrid);
			
		this.populateGrid();
	},

	populateGrid : function()
	{
		this.datagrid.setDataSource(this.getDataSource());
	},
	
	getColumns : function()
	{
		return [
		        	   new Banana.Controls.DataGridButtonColumn().setButtonText("Edit").setHeaderText('Id').setStyle("width:50px;"),
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


namespace('Application.Controls.Datagrids').CustomItemRender = Banana.Controls.DataGridTableContentItemRender.extend({
	
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



namespace('Application.Controls.Datagrids').CustomItemRender2 = Banana.Controls.DataGridTableContentItemRender.extend({
	

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

