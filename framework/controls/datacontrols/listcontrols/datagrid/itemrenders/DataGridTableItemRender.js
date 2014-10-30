/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridTableItemRender 
 */

goog.provide('Banana.Controls.DataGridTableItemRender');

goog.require('Banana.Controls.ItemRender');

/** @namespace Banana.Controls.DataGridTableItemRender */
namespace('Banana.Controls').DataGridTableItemRender = Banana.Controls.DataGridItemRender.extend(
/** @lends Banana.Controls.DataGridTableItemRender.prototype */
{

	/**
	 * Base item render class for datagrid table item renders
	 * All item renders made for the table item render should extend from this class
	 * @constructs
	 * @extends Banana.Controls.DataGridItemRender
	 */
	init : function()
	{
		this._super();
	}
});