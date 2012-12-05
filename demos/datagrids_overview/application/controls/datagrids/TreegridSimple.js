goog.provide('Application.Controls.Datagrids.TreegridSimple');

namespace('Application.Controls.Datagrids').TreegridSimple = Banana.Controls.Panel.extend	({
	
	createComponents : function()
	{
		//make some datasource
	 	var datasource =[]; 
		
		var s1 = {'name':'s1','children':[]};
		var s2 = {'name':'s2','children':[]};
		var s3 = {'name':'s3','children':[]};
		var s4 = {'name':'s4','children':[]};
		var s5 = {'name':'s5','children':[]};
		var s6 = {'name':'s6','children':[]};
		
		datasource.push(s1);
		datasource.push(s2);
		datasource.push(s3);
		
		s1.children.push(s4);
		s1.children.push(s5);		
		s4.children.push(s6);

		var list = new Banana.Controls.DataGrid();

		var listRender = new Banana.Controls.DataGridDataTreeListRender();
		listRender.setChildProperty("children");
		listRender.setDefaultOpen(true);
		
		listRender.bind('selectIndex',this.getProxy(function(e,index){
			listRender.selectAllFromIndex(index)
		}));
		
		listRender.setSortfunction(function(a,b)
		{ 
			return a.name.toString().toLowerCase().localeCompare(b.name.toString().toLowerCase())
		});
		
		list.setListRender(listRender);		
	
		list.setDataSource(datasource);
	
		listRender.bind('dataSourceChanged',this.getProxy(function(){
			
			this.dataChanged = true;
		}));
		
		listRender.bind('dataChanged',this.getProxy(function(){
			
		}));
	
		this.addControl(list);		
	}
});