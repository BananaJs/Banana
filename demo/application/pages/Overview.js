goog.provide('Application.Pages.ControlOverview');

namespace('Application.Pages').ControlOverview = Banana.Page.extend({

	createComponents : function()
	{
		this.createBasicControls();
		//this.createCustomControls();
		//this.createButtons();
		
		
		//this.createDataGrid1();
		//this.createDataGrid2();
		//this.createDataGrid3();
		this.createDataGrid4();
		//this.createDataGrid5();
		//this.createDataGrid6();
		
	},
	
	createBasicControls : function()
	{
		var datasource = ['test','test2','test3'];
		
		var window = new Banana.Controls.Window().setTitle('Basic controls');
		this.addControl(window);
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.TextBox()
		).setData('Textbox'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.TextBox().setStyle('width:100px;')
		).setData('Textbox fixed width'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.DropDown()
				.setDataSource(datasource)
		).setData('DropDown'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.MultiSelect()
				.setDataSource(datasource)
		).setData('MultiSelect'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.MultiSelect()
				.setEnabled(false)
				.setDataSource(datasource)
		).setData('MultiSelect disabled'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.CheckBox()
		).setData('Checkbox'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.RadioButton()
		).setData('Radiobutton'));	
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.CheckboxList()
				.setDataSource(datasource)
		).setData('Checkbox list'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.RadioButtonList()
				.setDataSource(datasource)
		).setData('RadioButton list'));
		
	},
	
	createCustomControls : function()
	{		
		var window = new Banana.Controls.Window().setTitle('CustomControls');
		this.addControl(window);	
	
//		window.addControl(
//				new Banana.Controls.Decorators.LabelDecorator(
//					new Banana.Controls.Decorators.InfoDecorator(
//					new Banana.Controls.Decorators.DefaultData(
//						new Banana.Controls.DropDown()
//							.setDataSource([1,2,3,4,5,6])
//						).setData([1])
//					).setText('info')
//				)
//				.setData('Dropdown + info + defaultData'));
//		
//		window.addControl(
//				new Banana.Controls.Decorators.LabelDecorator(
//					new Banana.Controls.Decorators.InfoDecorator(
//					new Banana.Controls.Decorators.DefaultData(
//						new Banana.Controls.MultiSelect()
//							.setData(['value1'])
//							.setDataSource(['value1','value2','value3'])
//						).setData(['value2'])
//					).setText('some info')
//				)
//				.setData('Multiselect + info + defaultdata'));
//		
//		window.addControl(
//				new Banana.Controls.Decorators.LabelDecorator(
//					new Banana.Controls.Decorators.InfoDecorator(
//						new Banana.Controls.Decorators.DefaultData(
//							new Banana.Controls.Decorators.CharLimitFieldValidator(
//								new Banana.Controls.TextArea()
//								).setMaxChars(10)
//								).setData('some default data')
//						).setText('Max 10 characters')
//					).setData('Multiselect + info + max char validator + defaultdata')
//				);
//		
//		window.addControl(
//				new Banana.Controls.Decorators.LabelDecorator(
//					new Banana.Controls.Decorators.InfoDecorator(
//						new Banana.Controls.Decorators.DefaultData(
//							new Banana.Controls.Decorators.RequiredFieldValidator(
//								new Banana.Controls.TextArea()
//								)
//								).setData('some default data')
//						).setText('Required field')
//					).setData('Multiselect + info + required field + defaultdata')
//				);
//		
//		window.addControl(
//				new Banana.Controls.Decorators.LabelDecorator(
//					new Banana.Controls.Decorators.InfoDecorator(
//						new Banana.Controls.Decorators.DefaultData(
//							new Banana.Controls.Decorators.CharLimitFieldValidator(
//								new Banana.Controls.TextBox()
//								).setMaxChars(10)
//							).setData('some default data')
//						).setText('Max 10 characters')
//					).setData('Textbox + info + max char validator + defaultdata')
//				);
//		
//		window.addControl(
//				new Banana.Controls.Decorators.LabelDecorator(
//					new Banana.Controls.Decorators.InfoDecorator(
//						new Banana.Controls.Decorators.DefaultData(
//							new Banana.Controls.Decorators.DateTimeFieldValidator(
//								new Banana.Controls.TextBox().setStyle('width:60px;')
//									.dataSetBind('program','productionyear')
//								)
//							)
//							.setData('1920')
//							
//						).setText('a nice year')
//					).setData('Year + validator + default data')
//				);
		
		window.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
					new Banana.Controls.Decorators.InfoDecorator(
						new Banana.Controls.Decorators.CharLimitFieldValidator(
								new Banana.Controls.TextBox()
							).setMaxChars(10)
						).setText('Max 10 characters')
					).setData('Textbox + info + max char validator')
				);
		
		window.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
					new Banana.Controls.Decorators.InfoDecorator(
						new Banana.Controls.Decorators.RequiredFieldValidator(						
								new Banana.Controls.TextBox()
								)
						).setText('Max 10 characters')
					).setData('Textbox + info + required validator')
				);
		
		window.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
					new Banana.Controls.Decorators.InfoDecorator(
						new Banana.Controls.Decorators.RequiredFieldValidator(						
								new Banana.Controls.CheckboxList()
								.setDataSource(['test','test2','test3'])
								)
						).setText('Max 10 characters')
					).setData('Checkbox list + info + required validator')
				);
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.DateTimePicker()
		).setData('Date time picker'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.DatePicker()
		).setData('Date picker'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.MaskedTextBox().setStyle('width:200px;').setMask('99_99_9999_99_XX_XX_9999')
		).setData('Masked textbox'));
		
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Slider().setStyle('width:200px;margin-bottom:10px; height:10px;-moz-box-sizing:border-box;')
		).setData('Slider'));
		
			
	},
	
	createButtons : function()
	{
		var window = new Banana.Controls.Window().setTitle('Buttons');
		this.addControl(window);
		
		var button = new Banana.Controls.Button().setText('Clickhere');	
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				button
		).setData('Button'));
		
		var button = new Banana.Controls.Button().setText('Click here and alert');	
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				button.bind('click',this.getProxy(function(){
					alert('clicked');
				}))  
		).setData('Button + click event'));
		
		var button = new Banana.Controls.Button().setText('Click here and add');	
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				button.bind('click',this.getProxy(function(){
					
					for (var i = 0; i < 20; i++)
					{
						var control = new Banana.Controls.Panel().setStyle('background-color:red; margin-left:5px;display:inline-block;width:40px; height:40px; margin-top:5px;');
						control.addControl(i);
						container.addControl(control);
					}
					container.invalidateDisplay();
				}))  
		).setData('Button + click event + add control'));
		
		var button = new Banana.Controls.Button().setText('Click here and remove');	
		window.addControl(new Banana.Controls.Decorators.LabelDecorator(
				button.bind('click',this.getProxy(function(){
					
					container.clear();
				}))  
		).setData('Button + click event + remove controls'));
		
		
		var container = new Banana.Controls.Panel().setStyle('width:100%;');
		window.addControl(container);
		
	},
	
	createDataGrid1 : function()
	{
		var window = new Banana.Controls.Window().setTitle('Datagrid Basic');
		this.addControl(window);
		
		var datasource = [
		                  {'name':'a name','description':'a description'},
		                  {'name':'a name','description':'a description'},
		                  {'name':'a name','description':'a description'}
		                  ];
		
		var columns = [
		               new Banana.Controls.DataGridColumn().setHeaderText('name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('description').setDataField('description')
		               ]
		
		var datagrid = new Banana.Controls.DataGrid();
		datagrid.setDataSource(datasource);
		
		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);
			
		window.addControl(datagrid);	
		
	},
	
	createDataGrid2 : function()
	{
		var window = new Banana.Controls.Window().setTitle('Datagrid with filters and action buttons');
		this.addControl(window);
		
		
		var datasource = [
		                  {'name':'a name','description':'a description'},
		                  {'name':'a name','description':'a description'},
		                  {'name':'a name','description':'a description'}
		                  ];
		
		var columns = [
		               new Banana.Controls.DataGridImageButtonColumn().setHeaderText('Edit').setCommandName('edit').setImageUrl('images/editbutton.png').setStyle('cursor:pointer;width:20px;'),
		               new Banana.Controls.DataGridColumn().setHeaderText('name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('description').setDataField('description')
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
			
		window.addControl(datagrid);
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
			
		window.addControl(datagrid);		
		
	},
	

	createDataGrid4 : function()
	{
		var window = new Banana.Controls.Window().setTitle('Datagrid custom tile items');
		this.addControl(window);		
		
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setHorizontalTileCount(4);
		listRender.setTilePadding(6);
		listRender.setPlaceHolderWidth('25%');
		
		listRender.setItemRender(function(){return new Application.Controls.DataGridTileItemRender()});
		
		grid.setListRender(listRender);
		
		var content = [
			{'title':'Item 1',
			'links':[
			         {'url':'Demo',
			          'title':'sub item 1'
			         },
			         {'url':'Demo',
				          'title':'sub item 2'
				     },
			         {'url':'Demo',
				          'title':'sub item 3'
				     }
			         ],
			'image':'urlnaar image'},
			
			{'title':'Item 2',
				'links':[
				         {'url':'Demo',
				          'title':'sub item 1'
				         },
				         {'url':'Demo',
					          'title':'sub item 2'
					     }
				         ],
				'image':'urlnaar image'},
				
			{'title':'Item 3',
				'links':[
				         {'url':'Demo',
				          'title':'sub item 1'
				         }
				         ],
				'image':'urlnaar image'},

			{'title':'Item 4',
				'links':[
				         {'url':'Demo',
				          'title':'sub item 1'
				         },
				         {'url':'Demo',
					          'title':'sub item 2'
					     },
				         {'url':'Demo',
					          'title':'sub item 3'
					     }
				         ],
				'image':'urlnaar image'},

			{'title':'Item 5',
				'links':[
				         {'url':'Demo',
				          'title':'sub item 1'
				         },
				         {'url':'Demo',
					          'title':'sub item 2'
					     },
				         {'url':'Demo',
					          'title':'sub item 3'
					     }
				         ],
				'image':'urlnaar image'},
	
			{'title':'Item 6',
				'links':[
				         {'url':'Demo',
				          'title':'sub item 1'
				         },
				         {'url':'Demo',
					          'title':'sub item 2'
					     },
				         {'url':'Demo',
					          'title':'sub item 3'
					     }
				         ],
				'image':'urlnaar image'}
			
			];
		
		
		grid.setDataSource(content);	

		window.addControl(grid);	
		
	},
	
	createDataGrid5 : function()
	{
		var window = new Banana.Controls.Window().setTitle('Tree Datagrid checkbox');
		this.addControl(window);		
		

		var root =[]; 
		
		var s1 = {'name':'s1','children':[]};
		var s2 = {'name':'s2','children':[]};
		var s3 = {'name':'s3','children':[]};
		var s4 = {'name':'s4','children':[]};
		var s5 = {'name':'s5','children':[]};
		var s6 = {'name':'s6','children':[]};
		
		root.push(s1);
		root.push(s2);
		root.push(s3);
		
		s1.children.push(s4);
		s1.children.push(s5);		
		s4.children.push(s6);
		
		var datasource = root;

		var list = new Banana.Controls.DataGrid().setStyle('');

		var listRender = new Banana.Controls.DataGridDataTreeListRender();
		listRender.setChildProperty("children");
		//listRender.setItemIndexKey('name'); ///this is the unique identifier
		listRender.setDefaultOpen(true);
		
		listRender.bind('selectIndex',this.getProxy(function(e,index){
			
			console.log('click');
			listRender.selectAllFromIndex(index)
			
		}));
		listRender.setSortfunction(function(a,b)
		{ 
			return a.name.toString().toLowerCase().localeCompare(b.name.toString().toLowerCase())
		});
		
		list.setListRender(listRender);		
	
		list.setDataSource(datasource);
		//listRender.setData(this.data.data);
		listRender.bind('dataSourceChanged',this.getProxy(function(){
			
			this.dataChanged = true;
		}));
		
		listRender.bind('dataChanged',this.getProxy(function(){
			
		}));
		
		listHolder = new Banana.Controls.Panel().setStyle('width:500px;')
		listHolder.addControl(list);
		
		window.addControl(listHolder);			
	},
	


	createDataGrid6 : function()
	{
		var window = new Banana.Controls.Window().setTitle('Tree Datagrid dynamic data');
		this.addControl(window);		
		
		//create some dummy data
		
		var items = [];
		//put first nodes in it.
		var s1 = {'name':'s1','children':[]};
		var s2 = {'name':'s2','children':[]};
		var s3 = {'name':'s3','children':[]};		
		var s4 = {'name':'s4','children':[]};
		
		var s5 = {'name':'s5','children':[]};
		
		var s6 = {'name':'s6','children':[]};

		s1.children.push(s4);
		s4.children.push(s5);
		s2.children.push(s6);
		
		items.push(s1);
		items.push(s2);
		items.push(s3)

		var list = new Banana.Controls.DataGrid().setStyle('width:auto;background-color:transparent;');

		var listRender = new Banana.Controls.DataGridTreeListRender();
		listRender.setChildProperty("children");
		listRender.setDefaultOpen(false);
		listRender.setItemIndexKey("name");
		listRender.setChildRequestSizeLimit(4);
		
		//var root = listRender.convertToSingleRoot(items);

		listRender.bind('onSelectIndex',this.getProxy(function(e,index){
			
			listRender.selectAllFromIndex(index)
			
		}));
		listRender.setSortfunction(function(a,b)
		{ 
			return a.name.toString().toLowerCase().localeCompare(b.name.toString().toLowerCase())
		});
		
		list.setListRender(listRender);		
	
		//console.log(root);
		setTimeout(this.getProxy(function(){
			listRender.setNodeData({'childCount':19,'open':true})
			//listRender.setNodeDataByData({'childCount':10});
			//listRender.setNodeDataByData({'childCount':22,'open':false,'needsChilds':true,'hasChilds':true},s1);
			console.log(items);
			list.setDataSource(items);
		}),1000);
		//listRender.setData(this.data.data);
		listRender.bind('dataSourceChanged',this.getProxy(function(){
			
			this.dataChanged = true;
		}));
		
		listRender.bind('dataChanged',this.getProxy(function(e){
			console.log(e)
		}));
		
		listRender.bind('onItemSelect',this.getProxy(function(e){
			
			//console.log(e.currentTarget.getSelectedItems())
			//console.log(e.currentTarget.getSelectedKeys())
			
			result.clear();
			result.addControl('selected keys: '+e.currentTarget.getSelectedKeys().join(' '));
			
			result.invalidateDisplay();
			
		}));
		
		listRender.bind('onItemUnselect',this.getProxy(function(e){
		
			result.clear();
		}));
		
		
		//when this event is triggered we load new metadata items.
		//after loading them we insert them in the tree
		listRender.bind('onRequestChilds',this.getProxy(function(e,customData){
			
			listRender.showLoaderInNode(customData.targetIndex);
console.log(customData)
			var params = {};
			params.offset = customData.offset;
			params.limit = customData.limit;
			
			setTimeout(this.getProxy(function(){
				
				if (!this.tempId) this.tempId = 100;
				this.tempId++; 
				
				var nodeinfo = {'needsChilds':true,'childCount':2};		
				var s1 = {'name':'s'+this.tempId,'children':[]};
				
				listRender.getNodeData().childCount = 30;

				listRender.setNodeDataByData({'needsChilds':true,'childCount':20},s1);
				listRender.getNodeDataByData(customData.datasource).needsChilds = false;
				//needed to make sure we dont reload items after closing and opening it
								
				listRender.addDataSource(customData.datasource,[s1],true);
				
			}),500);
		}));
		
		listHolder = new Banana.Controls.Panel().setStyle('width:50%;float:left;');
		listHolder.addControl(list);
		
		result = new Banana.Controls.Panel().setStyle('width:48%;font-size:12px; float:left;');
		
		window.addControl(listHolder);
		window.addControl(result);
		
		window.addControl('<div style="clear:both;"></div>');
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















/////////////// Controls used in tHIis page ///////////////////////


namespace('Application.Controls').CustomItemRender = Banana.Controls.DataGridTableContentItemRender.extend({
	
	createComponents : function()
	{
		this.mainColumn = new Banana.Controls.TableCol();
		this.mainColumn.setAttribute('colSpan',this.listRender.columns.length);
		this.mainColumn.setStyle('padding-left:0;padding-top:0;');
		this.mainColumn.addCssClass('BPublicationItemRender');
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
		                  {'name':'a na543543543543me','description':'a description'},
		                  {'name':'a na5435435435435me','description':'a description'},
		                  {'name':'a na435435435434353me','description':'a description'}
		                  ];
		
		var columns = [
		               new Banana.Controls.DataGridColumn().setHeaderText('name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('description').setDataField('description')
		               ]
		
		var datagrid = new Banana.Controls.DataGrid();
			
		datagrid.setDataSource(datasource);
		
		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);
			
		target.addControl(datagrid);		
	},

	getIsSelectable : function()
	{
		return false;
	}	
});

namespace('Application.Controls').DataGridTileItemRender = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		var panel = new Banana.Controls.Panel().setStyle('float:left; margin:4px; width:100%; height:100px;padding-top:5px;');
		
		var imageContainer = new Banana.Controls.Panel().setStyle('margin-top:4px;margin-left:4px;height:64px;width:64px;float:left;border:1px solid #666666;');
		var restContainer = new Banana.Controls.Panel().setStyle('float:left;margin-left:4px;');
		var title = new Banana.Controls.Panel().setStyle('font-size:14px;font-weight:bold;');
		var linkContainer = new Banana.Controls.Panel();
		restContainer.addControl(title);
		restContainer.addControl(linkContainer);
		
		panel.addControl(imageContainer);
		panel.addControl(restContainer);
		
		
		var tit = new Banana.Controls.Label();
		tit.setData(this.data.title);
		title.addControl(tit);
		
		this.addControl(panel);
		
		for (var i= 0; i < this.data.links.length; i++)
		{
			var linkCon = new Banana.Controls.Panel();
			
			var link = this.data.links[i];
			
			var l = new Banana.Controls.Link();
			l.setHref('#section='+link.url);
			l.addControl(link.title);
			l.setAttribute('target',null);
			l.setStyle('float:none;color:#333333;')
			
			linkCon.addControl(l)
			linkContainer.addControl(linkCon);
		}
		

	}
	
});

