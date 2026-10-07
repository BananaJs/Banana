import {DataGridItemRender} from "./DataGridItemRender.js";

/** @namespace Banana.Controls.DataGridTileItemRender */
export class DataGridTileItemRender extends DataGridItemRender
/** @lends Banana.Controls.DataGridTileItemRender.prototype */
{
	
	/**
	 * Base item render class for datagrid table tile renders.
	 * All item renders made for the tile item render should extend from this class
	 * 
	 * example:
	 
	  //define our custom datagrid table item render
        myCustomItemRender = Banana.Controls.DataGridTableContentItemRender.extend({

			createComponents ()
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
		
		var content = [{id:1}{id:2}];
		
		grid.setDataSource(content);	

		this.addControl(grid);	 
		
	 * @constructs
	 * @extends Banana.Controls.DataGridItemRender
	 */
	init (...args)
	{
		super.init(args);
	}
	
	/**
	 * Overwrite this method to implement your own item render
	 */
	createComponents ()
	{
		if (typeof(this.data) == "string")
		{
			var p = new Banana.Controls.Panel();
			p.addControl(this.data);
			this.addControl(p);
		}
	}
	
	
	/**
	 * Called when item is selected
	 */
	select ()
	{
		this.getListRender().getItemRenderPlaceHolderByItemRender(this).addCssClass("BDataGridTileTilePlaceHolderSelected");
	}
	
	/**
	 * Called when item is deselected
	 */
	deselect ()
	{
		this.getListRender().getItemRenderPlaceHolderByItemRender(this).removeCssClass("BDataGridTileTilePlaceHolderSelected");
	}
	
	/**
	 * Called when mouse moves over the item render.
	 */
	mouseOver ()
	{
		
	}
	
	/**
	 * Called when mouse moves out the item render
	 */
	mouseOut ()
	{
		
	}
};