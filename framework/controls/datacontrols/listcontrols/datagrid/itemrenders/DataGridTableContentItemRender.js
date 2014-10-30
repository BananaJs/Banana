/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridTableContentItemRender  
 */

goog.require('Banana.Controls.DataGridTableItemRender');

goog.provide('Banana.Controls.DataGridTableContentItemRender');

/** @namespace Banana.Controls.DataGridTableContentItemRender */
namespace('Banana.Controls').DataGridTableContentItemRender = Banana.Controls.DataGridTableItemRender.extend(
/** @lends Banana.Controls.DataGridTableContentItemRender.prototype */
{
	/**
	 * creates Datagrid Table content item render.   
	 * @constructs
	 * @extends  Banana.Controls.DataGridTableItemRender
	 */
	init : function()
	{
		this._super();
	},

	/**
	 * Overwrite this method to implement your own custom logic.
	 * In this method you have access to this.data
	 */
	createComponents : function()
	{
		this.createColumns(this);		
	},
	
	/**
	 * @param {Banana.UiControl} target control where column will be rendered in 
	 */
	createColumns : function(target)
	{
		var columns = this.listRender.columns;
		
		for (var j =0, clen = columns.length; j < clen; j++)
		{
			var columnController = columns[j] //column defined by user
		
			if (columnController.visible == false) continue;
			
			var control = columnController.getControl();
			
			if (columnController.getDataField())
			{		
				control.setData(Banana.Util.getDataByPath(this.getData(),columnController.getDataField()));
			}
			
			columnController.listRender = this.listRender; 
			
			var column = new Banana.Controls.TableCol();
			column.setStyle(columnController.getStyle());
			column.attributes = columnController.attributes;
			column.addControl(control);
			
			target.addControl(column);
			
			columnController.triggerEvent('onItemCreated',{'control':control,'data':this.getData()});
		}				
	},
	
	/**
	 * Called when item is selected
	 */
	select : function()
	{
		this.getListRender().getRowByItemRender(this).addCssClass("BDataGridTableListRenderSelected");
	},
	
	/**
	 * Called when item is deselected
	 */
	deselect : function()
	{
		this.getListRender().getRowByItemRender(this).removeCssClass("BDataGridTableListRenderSelected");
	},
	
	/**
	 * Called when mouse moves over the item render.
	 */
	mouseOver : function()
	{
		this.getListRender().getRowByItemRender(this).addCssClass("BDataGridTableListRenderMouseover");
	},
	
	/**
	 * Called when mouse moves out the item render
	 */
	mouseOut : function()
	{
		this.getListRender().getRowByItemRender(this).removeCssClass("BDataGridTableListRenderMouseover");
	},
	
	/**
	 * @return {boolean}
	 */
	getIsSelectable : function()
	{
		return true;
	}	
});