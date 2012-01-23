goog.provide('Application.Controls.Examples.ExampleTileMultipleItemRender');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleTileMultipleItemRender = Application.Controls.Examples.ControlOverview.extend({
	
	createComponents : function()
	{
		var datasource = [
			                 {'name':'Speedy','speed':"50"},
			                 {'name':'Winky','speed':"60"},
			                 {'name':'Lotus','speed':"30"},
			                 {'name':'Snail','speed':"10"}
			                  ];
			
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setItemRender(function(){
			return new Application.Controls.Examples.ExampleTileCustomItemRenderControl2();
		})
		
		listRender.setItemRenderByIndex(1,Application.Controls.Examples.ExampleTileCustomItemRenderControl3,true)
		
		listRender.addCssClass("ExampleTileSimple2");
		listRender.setPlaceHolderWidth("50%;");
		
		listRender.bind('onCommand',this.getProxy(function(e,params){
			
			if (params.command == 'save' || params.command == 'cancel')
			{
				listRender.setItemRenderByIndex(params.index,Application.Controls.Examples.ExampleTileCustomItemRenderControl3);
			}
			else if (params.command == 'delete')
			{
				listRender.removeItem(params.data);
			}
			else
			{
				listRender.setItemRenderByIndex(params.index,Application.Controls.Examples.ExampleTileCustomItemRenderControl2);
			}
			
		}));
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);	

		this.addControl(grid);	
	}
});

namespace('Application.Controls.Examples').ExampleTileCustomItemRenderControl2 = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("ExampleTileSimple3ItemRender1")
		
		var ix = new Banana.Controls.Panel();
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				this.name = new Banana.Controls.TextBox()
				.setData(this.data.name)
		).setData('Name'));
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				this.speed = new Banana.Controls.TextBox()
				.setData(this.data.speed)
		).setData('Speed'));		
		
		var buttonsC = new Banana.Controls.Panel();
		buttonsC.addControl(new Banana.Controls.Button()
				.setText("Save")
				.bind('click',this.getProxy(function(){
					
					this.data.name = this.name.getData();
					this.data.foo = this.speed.getData();
					
					var data = {};
					data.index = this.getListRender().getIndexByItemRender(this);
					data.command = 'save';
					this.getListRender().triggerEvent('onCommand',data);
		})));
		buttonsC.addControl(new Banana.Controls.Button()
		.setText("Cancel")
		.setStyle("margin-left:2px;")
		.bind('click',this.getProxy(function(){
			
			this.data.name = this.name.getData();
			this.data.speed = this.speed.getData();
			
			var data = {};
			data.index = this.getListRender().getIndexByItemRender(this);
			data.command = 'cancel';
			this.getListRender().triggerEvent('onCommand',data);
		})));
		
		buttonsC.addControl(new Banana.Controls.Button()
		.setText("Delete")
		.setStyle("margin-left:2px;")
		.bind('click',this.getProxy(function(){
			
			var data = {};
			data.index = this.getListRender().getIndexByItemRender(this);
			data.command = 'delete';
			data.data = this.data;
			this.getListRender().triggerEvent('onCommand',data);
		})));
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				buttonsC
		).setData(''));
		
		this.panel.addControl(ix);
		this.panel.addControl("<div style='clear:both;'></div>");
		
		this.addControl(this.panel);
	},
	
	getIsSelectable : function()
	{
		return false;
	}
	
});

namespace('Application.Controls.Examples').ExampleTileCustomItemRenderControl3 = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("ExampleTileSimple3ItemRender2")
		
		var ix = new Banana.Controls.Panel();
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Label()
				.setData(this.data.name)
		).setData('Name'));
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Label()
				.setData(this.data.speed)
		).setData('Speed'));	
		
		ix.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Button()
				.setText("Edit")
				.bind('click',this.getProxy(function(){	
					var data = {};
					data.index = this.getListRender().getIndexByItemRender(this);
					data.command = 'edit';
					this.getListRender().triggerEvent('onCommand',data);
				}))
		).setData(''));
		
		this.panel.addControl(ix);
		this.panel.addControl("<div style='clear:both;'></div>");
		
		this.addControl(this.panel);
	},
	
	getIsSelectable : function()
	{
		return false;
	}
	
});