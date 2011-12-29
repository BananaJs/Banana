goog.provide('Banana.Controls.DataGridTreeItemRender');

goog.require('Banana.Controls.ItemRender');

/** @namespace Banana.Controls.DataGridTreeItemRender */
namespace('Banana.Controls').DataGridTreeItemRender = Banana.Controls.DataGridItemRender.extend(
/** @lends Banana.Controls.DataGridTreeItemRender.prototype */
{
	 /**
	 * Base class for datagrid tree item render
	 * Overwrite this class to implement your own tree item render
	 * 
	 * 
	 * 
	 * @constructs
	 * @extends Banana.Controls.DataGridItemRender
	 */
	init : function()
	{
		this._super();
	},

	/**
	 * overwrite to implement your own logic
	 */
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel().setStyle('float:left;');
		this.panel.addCssClass('BDataGridTreeItemRender');
		
		this.label = new Banana.Controls.Label().setStyle('float:left;');
		this.panel.addControl(this.label);
		
		this.addControl(this.panel);
	},
	
	/**
	 * By default we extract data.name to show in the item render.
	 * 
	 * overwrite to implement your own logic
	 */
	updateDisplay : function()
	{
		var index = this.listRender.getNodeDataByData(this.data);
		{
			if (this.data && this.data.name)
			{
				this.label.setData(this.data.name);
			}
		}		
	},
	
	/**
	 * Invoked when user clicks on the item
	 */
	select : function()
	{
		this.panel.addCssClass('BDataGridTreeItemRenderSelected');
	},
	
	/**
	 * Invoked when the user selects/deselects another item
	 */
	deselect : function()
	{
		this.panel.removeCssClass('BDataGridTreeItemRenderSelected');
	},
	
	/**
	 * by default we return true here.
	 * @return {boolean}
	 */
	getIsSelectable : function()
	{
		return true;
	}
});