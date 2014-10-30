/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridTableFooterItemRender 
 */

goog.require('Banana.Controls.DataGridTableItemRender');

goog.provide('Banana.Controls.DataGridTableFooterItemRender');

/** @namespace Banana.Controls.DataGridTableContentItemRender */
namespace('Banana.Controls').DataGridTableFooterItemRender = Banana.Controls.DataGridTableItemRender.extend(
/** @lends Banana.Controls.DataGridTableFooterItemRender.prototype */
{
	/**
	 * Creates a datagrid table footer item render. footer is rendered below content item render
	 * by default we don't render anything here. Extend from this class and implement your own
	 * createComponents to make a custom footer item render. 
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
		
	}
});