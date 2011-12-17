goog.provide('Application.Pages.Examples');

goog.require('Application.Controls.Examples.DataGridTileItemRender');

namespace('Application.Pages').Examples = Banana.Page.extend( {

    /**
     * @inheritDoc
     */
    init: function() {
    	
		this._super();
    	
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
		this.createTiles();
		
		this.createControlOverview();
	},
	
	createTitle : function()
	{
		var title = new Banana.Controls.Label();
		title.setData("Control examples");
		title.addCssClass("frameworktitle")
		
		this.top.addControl(title);
	},
	
	createTiles : function()
	{	
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setPlaceHolderWidth("100%");
		listRender.setItemRender(function(){return new Application.Controls.Examples.DataGridTileItemRender()});
		
		grid.setListRender(listRender);
		
		var content = [
			{'title':'Basic Data Controls',"type":"BasicDataControls"},
			{'title':'Table Datagrid',"type":"SimpleGrid"},
			{'title':'Table Datagrid extended',"type":"SimpleGridControllable"}
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
	createControlOverview : function(type)
	{
		if (!type && Banana.Util.UrlManager.getModule("type"))
		{
			type = Banana.Util.UrlManager.getModule("type");
		}
		else if (type)
		{
			Banana.Util.UrlManager.registerModule("type");
			Banana.Util.UrlManager.setModule("type",type);	
		}
		else
		{
			return;
		}	
		
		this.right.clear();
		var objectname = "Application.Controls.Examples"+'.'+type;
		var c = Banana.Util.NamespaceToFunction(objectname);
		var inst = new c();
		
		this.right.addControl(inst);
		this.right.invalidateDisplay();
	}
});


namespace('Application.Controls.Examples').ControlOverview = Banana.Controls.Panel.extend	({

	init : function()
	{
		this._super();
		this.addCssClass("controlOverviewPanel");
	}
});

namespace('Application.Controls.Examples').BasicDataControls = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var datasource = ['test','test2','test3'];
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.TextBox()
		).setData('Textbox'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.TextBox().setStyle('width:100px;')
		).setData('Textbox fixed width'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.DropDown()
				.setDataSource(datasource)
		).setData('DropDown'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.MultiSelect()
				.setDataSource(datasource)
		).setData('MultiSelect'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.MultiSelect()
				.setEnabled(false)
				.setDataSource(datasource)
		).setData('MultiSelect disabled'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.CheckBox()
		).setData('Checkbox'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.RadioButton()
		).setData('Radiobutton'));	
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.CheckboxList()
				.setDataSource(datasource)
		).setData('Checkbox list'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.RadioButtonList()
				.setDataSource(datasource)
		).setData('RadioButton list'));
	}
	
});






namespace('Application.Controls.Examples').SimpleGrid = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var datasource = [
		                  {id:1,'name':'Orange','description':'Mare neque'},
		                  {id:2,'name':'Apple','description':'Diam a nulla placerat ru'},
		                  {id:3,'name':'Banana','description':'Llis eros eget mauri'},
		                  {id:4,'name':'Orange','description':'Morbi sollicitudin'},
		                  {id:5,'name':'Bolwara','description':'Er in adipiscing turpis.'},
		                  {id:6,'name':'Guava','description':'Odio auctor enim'},
		                  {id:7,'name':'Grapes','description':'Quisque fermentum'},
		                  {id:88,'name':'Papayas','description':'Mperdiet vel, dignissim eget diam'},
		                  {id:89,'name':'Pears','description':'Egestas eu risus'},
		                  {id:90,'name':'Cherries','description':'Ut pharetra sapien'},
		                  {id:92,'name':'Persimmons','description':'Laoreet, nunc massa'},
		                  {id:93,'name':'Blackberries','description':'Dignissim eget diam'}
		                  ];
		
		var columns = [
		               new Banana.Controls.DataGridColumn().setHeaderText('Id').setDataField('id'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Description').setDataField('description')
		               ]
		
		var datagrid = new Banana.Controls.DataGrid();
		datagrid.setDataSource(datasource);
		
		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);
			
		this.addControl(datagrid);
	}
	
});







namespace('Application.Controls.Examples').SimpleGridControllable = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var datasource = [
		                  {id:1,'name':'Orange','description':'Mare neque'},
		                  {id:2,'name':'Apple','description':'Diam a nulla placerat ru'},
		                  {id:3,'name':'Banana','description':'Llis eros eget mauri'},
		                  {id:4,'name':'Orange','description':'Morbi sollicitudin'},
		                  {id:5,'name':'Bolwara','description':'Er in adipiscing turpis.'},
		                  {id:6,'name':'Guava','description':'Odio auctor enim'},
		                  {id:7,'name':'Grapes','description':'Quisque fermentum'},
		                  {id:88,'name':'Papayas','description':'Mperdiet vel, dignissim eget diam'},
		                  {id:89,'name':'Pears','description':'Egestas eu risus'},
		                  {id:90,'name':'Cherries','description':'Ut pharetra sapien'},
		                  {id:92,'name':'Persimmons','description':'Laoreet, nunc massa'},
		                  {id:93,'name':'Blackberries','description':'Dignissim eget diam'}
		                  ];

		var columns = [
		               new Banana.Controls.DataGridColumn().setHeaderText('Id').setDataField('id'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('Description').setDataField('description')
		               ]

		var datagrid = new Banana.Controls.DataGrid();
		var controlPanel = new Banana.Controls.DataGridControlPanel();
		datagrid.setControlPanel(controlPanel);

		this.createDataGrid2FilterManager();
		controlPanel.setFilters(this.filterManager.getFilters());	

		controlPanel.setButtons([
		                         new Banana.Controls.Button().setText('click here'),
		                         new Banana.Controls.Button().setText('or here')
		                         ]);

		datagrid.setDataSource(datasource);

		var listRender = datagrid.getListRender();
			
		listRender.bind('onCommand',this.getProxy(function(e,params){
			
			if(params.commandName == 'edit')
			{
				Banana.Application.loadPage('Home');
			}
		}));

		listRender.setColumns(columns);
			
		this.addControl(datagrid);
		},

		createDataGrid3 : function()
		{
		var window = new Banana.Controls.Window().setTitle('Datagrid with custom item render');
		this.addControl(window);


		var datasource = [
		                  {'name':'a name 1','description':'a description 1'},
		                  {'name':'a name 2','description':'a description 2'},
		                  {'name':'a name 3','description':'a description 3'}
		                  ];

		var columns = [
		               new Banana.Controls.DataGridImageButtonColumn().setHeaderText('Info').setCommandName('expand').setImageUrl(Banana.Application.settings.imagedir+'/arrowopen.png').setStyle('cursor:pointer;width:20px;'),
		               new Banana.Controls.DataGridColumn().setHeaderText('name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('description').setDataField('description')
		               ]

		var datagrid = new Banana.Controls.DataGrid();
		var controlPanel = new Banana.Controls.DataGridControlPanel();
		datagrid.setControlPanel(controlPanel);

		controlPanel.setButtons([
		                         new Banana.Controls.Button().setText('click here'),
		                         new Banana.Controls.Button().setText('or here')
		                         ]);
		controlPanel.setTopButtons([
		                         new Banana.Controls.Button().setText('click here2'),
		                         new Banana.Controls.Button().setText('or here2')
		                         ]);

		datagrid.setDataSource(datasource);

		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);

		listRender.bind('onCommand',this.getProxy(function(e,params){
			
			var index = params.index;
			var commandName = params.commandName;
			
			//check if at index is already custom item render.
			if (listRender.hasItemRenderAt(index,Application.Controls.CustomItemRender))
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
					return new Application.Controls.CustomItemRender();
				};
			}

			listRender.setItemRenderByIndex(index,irOpened);
			
		}))
			
		this.addControl(datagrid);		
	},
	
	createDataGrid2FilterManager : function()
	{
		this.filterManager= new Banana.Controls.DataGridFilterManager();
		this.filterManager.setUrlPreFix('datagrid2_'); 
		this.filterManager.showBindedOnly(true);
		this.filterManager.bind('filtersChanged',this.getProxy(function(e,filterData){
			
			console.log('filters changed',filterData)
		}));
		
		this.filterManager.setFilters([
								 new Banana.Controls.DataGridDropDownFilter()
								.setFilterField('filter1')
								.setAllTitle('Filter 1')
								.setDataSource(['waarde1','waarde2'])
								.dataSetSourceBind('data','filter1'),
								
								 new Banana.Controls.DataGridDropDownFilter()
								.setFilterField('filter2')
								.setAllTitle('Filter 2')
								.setDataSource([{'key':'key','value':'value'}])
								.dataSetSourceBind('data','filter2'),							
								
								new Banana.Controls.DataGridDropDownFilter()
								.setFilterField('productType')
								.setAllTitle('All Product types')
								.dataSetSourceBind('bulkdata','productTypes'),								
									 				
								 new Banana.Controls.DataGridSearchFilter()
								 .setFilterField('search'),
								  
								this.pagerFilter = new Banana.Controls.DataGridPagerFilter()
								.setDataSource(10)
								.setData(2)
								.dataSetBind('data','pageIndex') 
								.dataSetSourceBind('data','pageCount')
								.bind('dataChanged',this.getProxy(function(){
									
									//if user changed page index we clear the itemrender index mapping
									if (this.restoringFinished)
									{
										this.grid.listRender.indexItemRenderFactory =[]; 
									}
								}))
								.setFilterField('pageIndex')
								]);
	}	
	
});








