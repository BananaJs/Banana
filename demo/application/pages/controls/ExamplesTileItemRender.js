goog.provide('Application.Controls.Examples.DataGridTileItemRender');

namespace('Application.Controls.Examples').DataGridTileItemRender = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		var panel = new Banana.Controls.Panel();
		
		var tile = new Banana.Controls.Panel().addCssClass("exampleTile");
			
		tile.addControl(this.data.title);
		
		this.addControl(tile);
		
		this.tile = tile;
		
		this.tile.bind('click',this.getProxy(function(){
		
			this.getListRender().triggerEvent('onItemClick',this.data.type);
			
		}));
	},
	
	select : function()
	{
		this.tile.addCssClass("exampleTileSelected");
	},
	
	deselect : function()
	{
		this.tile.removeCssClass("exampleTileSelected");
	},
	
	getIsSelectable : function()
	{
		return false;
	}
	
});
