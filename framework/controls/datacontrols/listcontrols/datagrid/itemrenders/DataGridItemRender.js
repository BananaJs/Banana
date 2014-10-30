/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridItemRender  
 */

goog.provide('Banana.Controls.ItemRender');

/** @namespace Banana.Controls.DataGridItemRender */
namespace('Banana.Controls').DataGridItemRender = Banana.Control.extend(
/** @lends Banana.Controls.DataGridItemRender.prototype */
{

	/**
	 * Base class for itemrenders are used in various list renders of datagrids
	 * Itemrenders are the visible items in a datagrid.
	 * By extending from this base item render class you can build your own custom item render
	 * @constructs
	 * @extends Banana.Control
	 */
	init : function()
	{
		this._super();
		
		this.listRender = null;
	},
	
	/**
	 * Sets reference to the list render
	 * @param {Banana.Controls.DataGridBaseListRender} lr
	 */
	setListRender : function(lr)
	{
		this.listRender = lr;
	},
	
	/**
	 * @return {Banana.Controls.DataGridBaseListRender}
	 */
	getListRender : function()
	{
		return this.listRender;
	},
	
	/**
	 * @param {int} i row index
	 */
	setRowIndex : function(i)
	{
		this.rowIndex = i;	
	},
	
	/**
	 * @return {int} index of the itemrender in the listrender
	 */
	getRowIndex : function()
	{
		return this.listRender.getIndexByRow(this.parent);
	},
	
	/**
	 * @return {boolean} true when item can be selected
	 */
	getIsSelectable : function()
	{
		return false;
	},
	
	/**
	 * @param {mixed} data
	 * @param {boolean} ignoreEvent
	 * @param {boolean} ignoreDom 
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		this.data = data;

		if (!ignoreEvent)
		{
			this.triggerEvent('dataChanged',data);
		}

		return this;
	},
	
	/**
	 * @return {mixed} data
	 */
	getData : function()
	{
		return this.data;
	}
});