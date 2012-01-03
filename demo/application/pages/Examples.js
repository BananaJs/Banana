goog.provide('Application.Pages.Examples');

goog.require('Application.Controls.Examples.DataGridTileItemRender');
goog.require('Application.Controls.Examples.ExampleSimpleGrid');
goog.require('Application.Controls.Examples.ExampleBasicDataControls');
goog.require('Application.Controls.Examples.ExampleBasicDataControls2');
goog.require('Application.Controls.Examples.ExampleSimpleGridFilterable');
goog.require('Application.Controls.Examples.ExampleTreeDataGrid');
goog.require('Application.Controls.Examples.ExampleTreeDataGrid2');
goog.require('Application.Controls.Examples.ExampleTreeDataGrid3');
goog.require('Application.Controls.Examples.ExampleTreeDataGridDynamic');
goog.require('Application.Controls.Examples.ExampleTileSimple');
goog.require('Application.Controls.Examples.ExampleTileSimple2');
goog.require('Application.Controls.Examples.SimpleGridEmptyTemplate');
goog.require('Application.Controls.Examples.ExampleValidatorControls');
goog.require('Application.Controls.Examples.ExampleGridCustomItemRender');
goog.require('Application.Controls.Examples.ExampleTileCustomItemRender');
goog.require('Application.Controls.Examples.ExampleTileMultipleItemRender');


goog.require('Application.Controls.Examples.CodeModal');

goog.require('Application.Controls.Examples.DemoPage');


namespace('Application.Pages').Examples = Application.Controls.Examples.DemoPage.extend( {

    /**
     * @inheritDoc
     */
    init: function() {
    	
		this._super();
		
		this.content = [
	  			{'title':'Basic Controls',
	  			 "urlEntry":"BasicControls",
	  			 "examples":[
	  			             {"title":"Basic controls","example":"BasicDataControls"},
	  			             {"title":"Basic controls","example":"BasicDataControls2"}
	  			            ]
			    },
			    {'title':'Table Datagrid',
		  			 "urlEntry":"TableListControls",
		  			 "examples":[
		  			             {"title":"Table datagrid simple","example":"SimpleGrid"},
		  			             {"title":"Table datagrid with control panel","example":"SimpleGridFilterable"},
		  			             {"title":"Table datagrid custom itemrender","example":"ExampleGridCustomItemRender"},
		  			             {"title":"Table datagrid dynamic data","example":"SimpleGridEmptyTemplate"}
		  			             ]
				},
			    {'title':'Tile Datagrid',
		  			 "urlEntry":"TileListControls",
		  			 "examples":[
		  			             
		  			             {"title":"Tile datagrid simple","example":"ExampleTileSimple"},
		  			             {"title":"Tile datagrid custom itemrender selectable","example":"ExampleTileSimple2"},
		  			             {"title":"Tile datagrid custom itemrender 2","example":"ExampleTileCustomItemRender"},
		  			             {"title":"Tile datagrid multiple custom itemrenders","example":"ExampleTileMultipleItemRender"}
		  			            ]
				},
			    {'title':'Tree Datagrid', 
		  			 "urlEntry":"TreeListControls",
		  			 "examples":[ 
		  			             {"title":"Tree datagrid","example":"ExampleTreeDataGrid"},
		  			             {"title":"Tree datagrid auto sorted/custom itemrender","example":"ExampleTreeDataGrid3"},
		  			             {"title":"Tree datagrid dynamic data","example":"TreeDataGridDynamic"},
		  			             {"title":"Tree datagrid checkbox","example":"ExampleTreeDataGrid2"}
		  			            ]
				}
			];
		
		
		
		this.content2 = [
			  			{'title':'Validators',
			  			 "urlEntry":"ValidatorsControls",
			  			 "examples":[
			  			             {"title":"Validation examples","example":"ExampleValidatorControls"}
			  			            ]
					    }
					];
    	
	},

	createComponents: function()
	{	
		this.top= new Banana.Controls.Panel();
		this.left = new Banana.Controls.Panel();
		this.right = new Banana.Controls.Panel();
		
		this.top.addCssClass("toppanel");
		this.left.addCssClass("leftPanelExamples");
		this.right.addCssClass("rightpanelExamples");
		
		this.addControl(this.top);
		this.addControl(this.left);
		this.addControl(this.right);
	
		this.createTitle();
		this.createControlTiles();
		this.createControl2Tiles();
		//this.createControl3Tiles(); 
		
		this.createControlOverview();
	},
	
	createTitle : function()
	{
		var title = new Banana.Controls.Label();
		title.setData("Examples of Banana components");
		title.addCssClass("frameworktitle")
		
		this.top.addControl(title);
	},
	
	createControlTiles : function()
	{	
		grid = new Banana.Controls.DataGrid();
		grid.addCssClass("borderPanel");
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setPlaceHolderWidth("100%");
		listRender.setItemRender(function(){return new Application.Controls.Examples.DataGridTileItemRender()});
		
		grid.setListRender(listRender);
		
		//invoked after clicking on a item. this is triggered by the itemrender itself
		listRender.bind('onItemClick',this.getProxy(function(e,data){
			
			this.createControlOverview(data.examples);
		}));
		
		grid.setDataSource(this.content);	

		this.left.addControl(grid);		
	},
	
	createControl2Tiles : function()
	{	
		grid = new Banana.Controls.DataGrid();
		grid.addCssClass("borderPanel");
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setPlaceHolderWidth("100%");
		listRender.setItemRender(function(){return new Application.Controls.Examples.DataGridTileItemRender()});
		
		grid.setListRender(listRender);
		
		//invoked after clicking on a item. this is triggered by the itemrender itself
		listRender.bind('onItemClick',this.getProxy(function(e,data){
			
			this.createControlOverview(data.examples);
		}));
		
		grid.setDataSource(this.content2);	

		this.left.addControl(grid);		
	},
	
	createControl3Tiles : function()
	{	
		grid = new Banana.Controls.DataGrid();
		grid.addCssClass("borderPanel");
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setPlaceHolderWidth("100%");
		listRender.setItemRender(function(){return new Application.Controls.Examples.DataGridTileItemRender()});
		
		grid.setListRender(listRender);
		
		var content = [
			{'title':'Dynamic rendering',"type":"Validation"}
			];
		
		
		//invoked after clicking on a item. this is triggered by the itemrender itself
		listRender.bind('onItemClick',this.getProxy(function(e,type){
			
			this.createControlOverview(type);
		}));
		
		grid.setDataSource(content);	

		this.left.addControl(grid);		
	},
	
	/**
	 * @param {String} type of the controloverview
	 */
	createControlOverview : function(data)
	{	
		var examples = null;
		
		if (data)
		{
			examples = data.examples;
			Banana.Util.UrlManager.registerModule("urlEntry");
			Banana.Util.UrlManager.setModule("urlEntry",data.urlEntry);
		}
		
		if (!examples)
		{
			if (Banana.Util.UrlManager.getModule("urlEntry"))
			{			
				var urlEntry = Banana.Util.UrlManager.getModule("urlEntry");
				
				var i;
				
				for (i=0; i<this.content.length;i++)
				{
					if (urlEntry == this.content[i].urlEntry)
					{
						console.log(this.content[i].urlEntry)
						examples = this.content[i].examples;
						continue;
					}
				}
				
				for (i=0; i<this.content2.length;i++)
				{
					if (urlEntry == this.content2[i].urlEntry)
					{
						console.log(this.content2[i].urlEntry)
						examples = this.content2[i].examples;
						continue;
					}
				}
				
				if (!examples)
				{
					alert("Not found!");
					return;
				}
			}
			else
			{
				return;
			}
		}
		
		
		this.right.clear();
		
		if (window.aap)
		{
			return;
		}
		
		
		var i;
		for (i=0;i<examples.length;i++)
		{
				var example = examples[i].example;
			
				var container = new Banana.Controls.Panel();
				var titleContainer = new Banana.Controls.Panel().addCssClass("controlOverviewtitleContainer");
				///var showCodeLinkContainer = new Banana.Controls.Panel().addCssClass("controlOverviewShowcodeLink");
				
				var title = new Banana.Controls.Panel();
				title.addCssClass('controlOverviewtitle');
				title.addControl(examples[i].title);
				titleContainer.addControl(title);
				
				container.addControl(titleContainer);
			
				var objectname = "Application.Controls.Examples"+'.'+example;
				var c = Banana.Util.NamespaceToFunction(objectname);
				var inst = new c();
				
				if (inst.getCode)
				{
					var code = inst.getCode();
				}
				
				if (code != false)
				{
					var showCode = new Banana.Controls.Button();
					showCode.bind('click',this.getProxy(function(){
						this.showCode(code);
					}));
					showCode.setText("Show code");
					showCode.addCssClass('controlOverViewShowCodeButton')
					//showCodeLinkContainer.addControl(showCode);
					titleContainer.addControl(showCode);
					//this.showCode(code);
				}
				
				titleContainer.addControl('<div style="clear:both;"></div>');
			
				container.addControl(inst);
				container.addCssClass("borderPanel");
				container.addCssClass("controlOverviewPanel");
				
				this.right.addControl(container);
		}
		
		this.right.invalidateDisplay();
	},
	
	showCode : function(code)
	{
		if (!this.showCodeModal)
		{
			this.showCodeModal = new Application.Controls.Examples.CodeModal();
			this.addControl(this.showCodeModal,true);
			this.showCodeModal.setTitle("Code");
			
		}
		
		this.showCodeModal.setCode(code);
		this.showCodeModal.show();
		//this.showCodeModal.
	}
});