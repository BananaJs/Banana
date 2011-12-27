goog.provide('Banana.Controls.DataGridTileItemRender');

goog.require('Banana.Controls.ItemRender');

/** @namespace Banana.Controls.DataGridTileItemRender */
namespace('Banana.Controls').DataGridTileItemRender = Banana.Controls.DataGridItemRender.extend(
/** @lends Banana.Controls.DataGridTileItemRender.prototype */
{
	
	/**
	 * Base item render class for datagrid table tile renders.
	 * All item renders made for the tile item render should extend from this class
	 * 
	 * example:
	 
	  //define our custom datagrid table item render
        myCustomItemRender = Banana.Controls.DataGridTableContentItemRender.extend({

			createComponents : function()
			{
				var label = new Banana.Controls.Panel();
				label.setData(this.getData().id);
				this.addControl(new Banana.Controls.Panel());
			}
		});
	 	
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		
		//note that this method required you to pass a function providing the itemrender.
		listRender.setItemRender(function(){return new myCustomItemRender()});
		
		grid.setListRender(listRender);
		
		var content = [{id:1},{id:2}];	
		
		grid.setDataSource(content);	

		this.addControl(grid);	 
		
	 * @constructs
	 * @extends Banana.Controls.DataGridItemRender
	 */
	init : function()
	{
		this._super();
	},
	
	/**
	 * Called when item is selected
	 */
	select : function()
	{
		this.getListRender().getRowByItemRender(this).addCssClass("BDataGridTileTilePlaceHolderSelected");
	},
	
	/**
	 * Called when item is deselected
	 */
	deselect : function()
	{
		this.getListRender().getRowByItemRender(this).removeCssClass("BDataGridTileTilePlaceHolderSelected");
	},
	
	/**
	 * Called when mouse moves over the item render.
	 */
	mouseOver : function()
	{
		
	},
	
	/**
	 * Called when mouse moves out the item render
	 */
	mouseOut : function()
	{
		
	}
});