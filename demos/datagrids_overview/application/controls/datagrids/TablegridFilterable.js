goog.provide('Application.Controls.Datagrids.TablegridFilterable');

namespace('Application.Controls.Datagrids').TablegridFilterable = Banana.Controls.Panel.extend	({

	createComponents : function()
	{	
		this.createFilterManager();
		
		var datagrid = new Banana.Controls.DataGrid();
		var controlPanel = new Banana.Controls.DataGridControlPanel();
		datagrid.setControlPanel(controlPanel);

		controlPanel.setFilters(this.filterManager.getFilters());	

		controlPanel.setButtons([
		                         new Banana.Controls.Button().setText('foo')
		                         .bind('click',function(){
		                        	 console.log('click');
		                         })
		                         ,
		                         new Banana.Controls.Button().setText('bar')
		                         ]);

		var listRender = datagrid.getListRender();
		listRender.setColumns(this.getColumns());
			
		this.addControl(datagrid);
		
		this.datagrid = datagrid;
		this.populateGrid();
	},
	
	unload : function()
	{
		this._super();
		
		//we need to explicity remove filter manager. why? because this manager
		//is not part of a control collection and thus not automatically removed 
		this.filterManager.remove();
	},
	
	populateGrid : function()
	{
		this.datagrid.setDataSource(this.getDataSource());	
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
	
	
	createFilterManager : function()
	{
		this.filterManager= new Banana.Controls.DataGridFilterManager();
		this.filterManager.setUrlPreFix('datagrid2_'); 
		this.filterManager.showBindedOnly(true);
		this.filterManager.bind('filtersChanged',this.getProxy(function(e,filterData){
			
			this.populateGrid();
		}));
		
		this.filterManager.setFilters([
								 new Banana.Controls.DataGridDropDownFilter()
								.setFilterField('country')
								.setAllTitle('All countries')
								.setId("piet")
								.setDataSource(['Spain','Peru']),
								
								 new Banana.Controls.DataGridDropDownFilter()
								 .setFilterField('color')
								.setAllTitle('All colors')
								.setDataKeyField('key')
								.setDataValueField('value')
								.setDataSource([{key:1,value:'Red'},{key:2,value:'Yellow'}]),														
									 				 
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
	},
	
	getDataSource : function()
	{
		var orgsource = [
		 {id:1,'name':'Orange','description':'Mare neque','country':'Peru','color':1},
         {id:2,'name':'Apple','description':'Diam a nulla placerat ru','country':'Spain','color':1},
         {id:3,'name':'Banana','description':'Llis eros eget mauri','country':'Spain','color':1},
         {id:4,'name':'Orange','description':'Morbi sollicitudin','country':'Peru','color':2},
         {id:5,'name':'Bolwara','description':'Er in adipiscing turpis.','country':'Peru','color':1},
         {id:6,'name':'Guava','description':'Odio auctor enim','country':'Peru','color':1}
        ]
		
		var filterData = this.filterManager.getFilterData();
		
		newSource = this.filterDataSource("country",filterData,orgsource);
		newSource = this.filterDataSource("color",filterData,newSource);
		
		return newSource;
	},
	
	filterDataSource : function(field,filterData,source)
	{
		var newSource = [];
		
		//filter countries
		if (filterData[field].data != '%')
		{
			for (var i = 0; i < source.length; i++)
			{
				if (source[i][field] == filterData[field].data)
				{
					newSource.push(source[i]);
				}
				
			}
		}
		else
		{
			return source;
		}
		
		return newSource;	
	},
	
	searchDataSource : function()
	{
		
	}
	
});
