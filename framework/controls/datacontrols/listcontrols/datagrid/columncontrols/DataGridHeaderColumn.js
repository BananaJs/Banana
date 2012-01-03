/**
 * @author Dennis Verhoeven
 * @package Banana.Controls
 * @summary DataGridHeaderCol 
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridHeaderColumn');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');

/** @namespace Banana.Controls.DataGridHeaderCol */
namespace('Banana.Controls').DataGridHeaderCol = Banana.Controls.TableHeaderCol.extend(
/** @lends Banana.Controls.DataGridHeaderCol.prototype */
{
	/** 
	 * Create datagrid header column for usage in table list renders.
	 * This control is normaly automaticaly created in the default table list render
	 * @constructs 
	 * @extends Banana.Controls.TableHeaderCol
	 * */
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
		this._super();

		this.bind('click',this.getProxy(function()
		{
			this.triggerEvent('clicked',this);
		}));

		this.bind('mouseover',this.getProxy(function()
		{
			jQuery('#'+this.getClientId()).css({'background-color':'#999999'});

		}));

		this.bind('mouseout',this.getProxy(function(e)
		{

			jQuery('#'+this.getClientId()).css({'background-color':''});
		}));
	}
});