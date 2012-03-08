goog.provide('Application.Controls.Datagrids.TilegridCustomItemRender');

goog.require('Banana.Controls.YoutubeIFramePlayer');


namespace('Application.Controls.Datagrids').TilegridCustomItemRender = Banana.Controls.Panel.extend	({

	createComponents : function()
	{
	
		var datasource = [
		                  "C0DPdy98e4c","C0DPdy98e4c","C0DPdy98e4c","C0DPdy98e4c",
		                  "C0DPdy98e4c","C0DPdy98e4c","C0DPdy98e4c","C0DPdy98e4c" 
			                 //"6-eehn-ydKM","HEheh1BH34Q","uGcDed4xVD4","YPjXxKpM4DM","RzHyeMaHm2s"
			                 
			                 
			                  ]; 
			
		grid = new Banana.Controls.DataGrid();
		//grid.setStyle("margin:15px;")
		
		var listRender = new Banana.Controls.DataGridTileListRender();
		
		listRender.setItemRender(function(){
			return new Application.Controls.Datagrids.YoutubeItemRender();
		})
		
		listRender.addCssClass("playergrid");
		listRender.setPlaceHolderWidth("25%;");
		
		grid.setListRender(listRender);
				
		grid.setDataSource(datasource);	 

		this.addControl(grid);
	}
});

namespace('Application.Controls.Datagrids').YoutubeItemRender = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("youtubetile")
		
			
		//this.panel.addControl(this.data);
		
		this.addControl(this.panel);
	},
	
	updateDisplay : function(){
		
		
		var dem = this.panel.getDimensions();
		
		var height = dem.width / 1.6;
				
		this.panel.setCss({'height':height+'px'});
			
		console.log(dem.width,height)
		var player = new Banana.Controls.YoutubeIFramePlayer(dem.width,height);
		player.addCssClass("player");
		
		
		player.bind('onPlayerReady',this.getProxy(function(){
			//console.log('play ',this.data)
			//console.log(player);
			player.loadVideoById(this.data);
		}));
		
		
		this.panel.addControl(player);
	
		this.panel.invalidateDisplay();
		
	},
	
	select : function()
	{
		this.panel.addCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	deselect : function()
	{
		this.panel.removeCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	mouseOver : function()
	{
		this.panel.addCssClass("ExampleTileSimple2ItemRenderMouseover")
	},
	
	mouseOut : function()
	{
		this.panel.removeCssClass("ExampleTileSimple2ItemRenderMouseover")
	},
	
	getIsSelectable : function()
	{
		return false;
	}
	
});