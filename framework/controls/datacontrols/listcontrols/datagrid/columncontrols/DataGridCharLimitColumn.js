/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridCharLimitColumn 
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridCharLimitColumn');

/** @namespace Banana.Controls.DataGridCharLimitColumn */
namespace('Banana.Controls').DataGridCharLimitColumn = Banana.Controls.DataGridColumn.extend(
/** @lends Banana.Controls.DataGridCharLimitColumn.prototype */
{
	
	/**
	 * Creates char limit column for usage in table list renders. 
	 * With set charlimit your can specify the max amount of characters the column should display
	 * @constructs
	 * @extends Banana.Controls.DataGridColumn
	 */
	init : function()
	{
		this._super();
	},
	
	/**
	 * @ignore
	 * @return Banana.DataControl
	 */
	getControl : function()
	{
		return new Banana.Controls.LimitCharLabel().setCharLimit(this.charLimit);
	}
});

/**
 * @param {int} limit 
 * @return {this}
 */
Banana.Controls.DataGridCharLimitColumn.prototype.setCharLimit = function(limit)
{
	this.charLimit = limit;
	return this;
};
