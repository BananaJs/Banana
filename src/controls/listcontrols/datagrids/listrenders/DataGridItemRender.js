import {Control} from "../../../Control.js";

export class DataGridItemRender extends Control
{

	/**
	 * Base class for itemrenders are used in various list renders of datagrids
	 * Itemrenders are the visible items in a datagrid.
	 * By extending from this base item render class you can build your own custom item render
	 * @constructs
	 * @extends Banana.Control
	 */
	init ()
	{
		super.init();
		
		this.listRender = null;
	}
	
	/**
	 * Sets reference to the list render
	 * @param {Banana.Controls.DataGridBaseListRender} lr
	 */
	setListRender (lr)
	{
		this.listRender = lr;
	}
	
	/**
	 * @return {Banana.Controls.DataGridBaseListRender}
	 */
	getListRender ()
	{
		return this.listRender;
	}
	
	/**
	 * @param {int} i row index
	 */
	setRowIndex (i)
	{
		this.rowIndex = i;	
	}
	
	/**
	 * @return {int} index of the itemrender in the listrender
	 */
	getRowIndex ()
	{
		return this.listRender.getIndexByRow(this.parent);
	}
	
	/**
	 * @return {boolean} true when item can be selected
	 */
	getIsSelectable ()
	{
		return false;
	}
	
	/**
	 * @param {mixed} data
	 * @param {boolean} ignoreEvent
	 * @param {boolean} ignoreDom 
	 */
	setData (data,ignoreEvent,ignoreDom)
	{
		this.data = data;

		if (!ignoreEvent)
		{
			this.triggerEvent('dataChanged',data);
		}

		return this;
	}
	
	/**
	 * @return {mixed} data
	 */
	getData ()
	{
		return this.data;
	}
};