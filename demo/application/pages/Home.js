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
		this.top= new Banana.Controls.Panel();
		this.addControl(this.top);
		
		this.center= new Banana.Controls.Panel();
		this.addControl(this.center);
		
		this.bottom= new Banana.Controls.Panel();
		this.addControl(this.bottom);
		
		this.createTitle();
		this.createMenu();
		this.createSubText();
	},
	
	createTitle : function()
	{
		var title = new Banana.Controls.Panel();
		title.addControl("Banana JS Framework");
		title.addCssClass("title")
		this.top.addControl(title);
		
		var title = new Banana.Controls.Label();
		title.setData("Free opensource component based user interface toolkit");
		title.addCssClass("subTitle")
		
		this.top.addControl(title);
	},
	
	createMenu : function()
	{
		var datasource = [
			                 {'iconcss':'menuExample',"section":"Examples"},{'iconcss':'menuDownload',"section":'Download'},{'iconcss':'menuDocumentation',"section":"Documentation"}
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
		var cube = new Banana.Controls.Link();
		cube.setHref("#section="+this.data.section);
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