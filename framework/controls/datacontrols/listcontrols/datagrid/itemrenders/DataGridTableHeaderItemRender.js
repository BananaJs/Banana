/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridTableHeaderItemRender
 */

goog.require('Banana.Controls.DataGridTableItemRender');

goog.provide('Banana.Controls.DataGridTableHeaderItemRender');

/** @namespace Banana.Controls.DataGridTableHeaderItemRender */
namespace('Banana.Controls').DataGridTableHeaderItemRender = Banana.Controls.DataGridTableItemRender.extend(
/** @lends Banana.Controls.DataGridTableHeaderItemRender.prototype */
{
	/**
	 * Creates a datagrid table header item render.
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
		var columns = this.listRender.columns;
		
		for (var i =0, len = columns.length; i < len; i++)
		{
			var col = new Banana.Controls.DataGridHeaderCol();
			
			if (columns[i].visible == false) continue;
			
			col.sortField = columns[i].sortField;
			
			col.setStyle('text-align:left;'+columns[i].getStyle());
		
			if (columns[i].sortField)
			{
				col.setStyle('cursor:pointer;text-align:left;'+columns[i].getHeaderStyle());

				col.bind('click',this.getProxy(function(e,f){
		
					this.listRender.triggerEvent('sort',e.data)
	
				}),columns[i].sortField);
			}

			col.addControl(columns[i].getHeaderText());
			this.addControl(col);
		}		
	}
});