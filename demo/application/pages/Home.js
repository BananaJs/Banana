goog.provide('Application.Pages.Home');
goog.require('Application.Controls.Examples.DemoPage');

namespace('Application.Pages').Home = Application.Controls.Examples.DemoPage.extend( {

    /**
     * @inheritDoc
     */
    init: function() {
    	
		this._super();    	
	},

	createComponents: function()
	{
		this.setStyle('background-color:red;');
		
		this.top= new Banana.Controls.Panel();
		this.addControl(this.top);
		
		this.center= new Banana.Controls.Panel();
		this.addControl(this.center);
		
		this.bottom= new Banana.Controls.Panel();
		this.addControl(this.bottom);
		
		this.createTitle();
		this.createMenu();
		this.createSubText();
		
		
		
		return;
		this.top= new Banana.Controls.Panel();
		this.left = new Banana.Controls.Panel();
		this.right = new Banana.Controls.Panel();
		
		this.top.addCssClass("toppanel");
		this.left.addCssClass("leftpanel");
		this.right.addCssClass("rightpanel");
		
		this.addControl(this.top);
		this.addControl(this.center);
		this.addControl(this.left);
		this.addControl(this.right);
		
		this.createTitle();
		
		this.createSubs();
		
		this.createRands();
	},
	
	createTitle : function()
	{
		var title = new Banana.Controls.Panel();
		title.addControl("Banana JS Framework");
		title.addCssClass("title")
		this.top.addControl(title);
		
		var title = new Banana.Controls.Label();
		title.setData("An opensource component based user interface toolkit");
		title.addCssClass("subTitle")
		
		this.top.addControl(title);
		
		return;
		var ex = new Banana.Controls.Panel();
		ex.addCssClass("frameworkexpl");

		this.left.addControl(ex);
		
		
		var ul = new Banana.Controls.UnorderedList();
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("100% Javascript");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Component driven");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("fast render engine");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Free for commercial use");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Desktop and Mobile");
		ul.addControl(l1);
				
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Customizable");
		ul.addControl(l1);
		
		var l3 = new Banana.Controls.ListItem();
		l3.addControl("Databinding ");
		ul.addControl(l3);
		
		var l4 = new Banana.Controls.ListItem();
		l4.addControl("Validation");
		ul.addControl(l4);
		
		var l5 = new Banana.Controls.ListItem();
		l5.addControl("Large control collection");
		ul.addControl(l5);
		
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("JQuery powered");
		ul.addControl(l6);
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("Google closure build integration");
		ul.addControl(l6);
			
		
		ex.addControl(ul);
	},
	
	createMenu : function()
	{
		var datasource = [
			                 {'iconcss':'menuExample'},{'iconcss':'menuDownload'},{'iconcss':'menuDocumentation'}
			                  ];
			
		grid = new Banana.Controls.DataGrid();
		grid.addCssClass("menugrid");
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setItemRender(function(){
			return new Application.Controls.Demo.MenuItemRender();
		})
		
		listRender.addCssClass("HomeTiles");
		listRender.setPlaceHolderWidth("");
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);	

		this.center.addControl(grid);	
		
		this.grid = grid;
	},
	
	createSubText : function()
	{
		var summary = new Banana.Controls.Panel();
		summary.addCssClass("summaryText");
		summary.addControl("Banana is an opensource javascript application framework designed to create pure desktop and mobile applications. Banana is designed with the single goal to help developers write dynamic fast website applications. Compatible with all major desktop and mobile browsers, Banana gives developers a component driven platform to develop applications just in the same way regular interface toolkits provides.");
		
		this.bottom.addControl(summary);
				
	},
	
	updateDisplay : function()
	{
		//center the grid
		var centerWidth = this.center.getDimensions().width;
		var gridWidth = this.grid.getDimensions().width;
		
		var diff = centerWidth - gridWidth;
		
		if (diff < 0)
		{
			return;
		}
		
		this.grid.setCss({'margin-left':diff/2+'px'});
	}

});


namespace('Application.Controls.Demo').MenuItemRender =  Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		var cube = new Banana.Controls.Panel();
		this.addControl(cube);
		cube.addCssClass("menuitem");
		
		cube.addCssClass(this.data.iconcss);
		this.cube = cube;
	},
	
	mouseOver : function()
	{
		this.cube.addCssClass("menuitemHover");
	},
	
	mouseOut : function()
	{
		this.cube.removeCssClass("menuitemHover");
	}
	
	
});