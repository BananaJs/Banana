goog.provide('Application.Controls.Examples.ExampleTreeDataGrid2');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');
	

namespace('Application.Controls.Examples').ExampleTreeDataGrid2 = Application.Controls.Examples.ControlOverview.extend	({
	

	createComponents : function()
	{
	
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
			
			listHolder = new Banana.Controls.Panel();
			listHolder.addControl(list);
			
			this.addControl(listHolder);	
			
	}
});