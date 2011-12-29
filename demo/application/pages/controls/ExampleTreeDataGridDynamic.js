goog.provide('Application.Controls.Examples.ExampleTreeDataGridDynamic');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');
	

namespace('Application.Controls.Examples').TreeDataGridDynamic = Application.Controls.Examples.ControlOverview.extend	({
	

	init : function()
	{
		this._super();
		this.childRequestSize =1;
	},
	
	createComponents : function()
	{
		var items = [];
		//put first nodes in it.
		var s1 = {'name':'1','children':[]};
		var s2 = {'name':'2','children':[]};
		var s3 = {'name':'3','children':[]};		
		var s4 = {'name':'4','children':[]};
		
		var s5 = {'name':'5','children':[]};
		
		var s6 = {'name':'6','children':[]};

		s1.children.push(s4);
		s4.children.push(s5);
		s2.children.push(s6);
		
		items.push(s1);
		items.push(s2);
		items.push(s3)

		var list = new Banana.Controls.DataGrid();

		var listRender = new Banana.Controls.DataGridTreeListRender();
		listRender.setChildProperty("children");
		//listRender.setDefaultOpen(false);
		listRender.setItemIndexKey("name");
		listRender.setChildRequestSizeLimit(this.childRequestSize);

		///we explicity want to have s1 node open. for that we set node data. Note we do that before setting the actual datasource
		listRender.setNodeDataByData({'childCount':4,'open':true},s1);
		listRender.setNodeDataByData({'childCount':12,'open':true})
		
		
		listRender.bind('onSelectIndex',this.getProxy(function(e,index){
			
			//listRender.selectAllFromIndex(index)
			
		}));
		listRender.setSortfunction(function(a,b)
		{ 
			return a.name.toString().toLowerCase().localeCompare(b.name.toString().toLowerCase())
		});
		
		list.setListRender(listRender);		
	
		
		this.getPage().showLoader("loading data. please wait");
		
		//simulate server loading
		//setTimeout(this.getProxy(function(){
			
			//set the node data in root
			listRender.setNodeData({'childCount':7,'open':true})
			//listRender.setNodeDataByData({'childCount':10});
			//listRender.setNodeDataByData({'childCount':22,'open':false,'needsChilds':true,'hasChilds':true},s1);
			//console.log(items);
		
			list.setDataSource(items);
			
			
			
			this.getPage().hideLoader();
		//}),1000);
		//listRender.setData(this.data.data);
		listRender.bind('dataSourceChanged',this.getProxy(function(){
			
			this.dataChanged = true;
		}));
		
		listRender.bind('dataChanged',this.getProxy(function(e){
			console.log(e)
		}));
		
		listRender.bind('onItemSelect',this.getProxy(function(e){
			
			//console.log(e.currentTarget.getSelectedItems())
			console.log(e.currentTarget.getSelectedKeys())
			
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
			
			console.log(customData)
			listRender.showLoaderInNode(customData.targetIndex);
			var params = {};
			params.offset = customData.offset;
			params.limit = customData.limit;
			
			//setTimeout(this.getProxy(function(){
				
				for (var i=0;i<customData.limit;i++)
				{
				
				if (!this.tempId) this.tempId = 100;
				this.tempId++; 
				
				var s1 = {'name':'Dynamic loaded'+this.tempId,'children':[]};
				
				//listRender.getNodeData().childCount = 30;

				listRender.setNodeDataByData({'needsChilds':true,'childCount':8},s1);
				
				//needed to make sure we dont reload items after closing and opening it
				listRender.getNodeDataByData(customData.datasource).needsChilds = false;
				
								
				listRender.addDataSource(customData.datasource,[s1],true);
				}
				
			//}),500);
		}));
		
		listHolder = new Banana.Controls.Panel();
		listHolder.addControl(list);
		
		result = new Banana.Controls.Panel().setStyle('width:48%;font-size:12px; float:left;');
		
		this.addControl(listHolder);
		//this.addControl(result);
			
	}
});