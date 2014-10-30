/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridDateFilter 
 */

goog.provide('Banana.Controls.DataGridDateFilter');

/** @namespace Banana.Controls.DataGridDateFilter */
namespace('Banana.Controls').DataGridDateFilter = Banana.Controls.DatePicker.extend(
/** @lends Banana.Controls.DataGridDateFilter.prototype */
{
	/**
	 * Creates a datagrid date filter.
	 *
	 * @constructs
	 * @extends Banana.Controls.DatePicker
	 */
	init : function()
	{
		this._super();
		
		this.addCssClass('BDataGridPagerFilter')
		
		this.bind('dataChanged',this.getProxy(this.triggerEvent('filterDataChanged')));
	},
	
	setTitle : function(t)
	{
		this.title = t;
		return this;
	},
	
	getTitle : function()
	{
		return this.title;
	},
	
	getAllKey : function()
	{
		return null;
	}
});

/**
 * Sets field to filter on
 * @param {String} ff
 * @return {this}
 */
Banana.Controls.DataGridDateFilter.prototype.setFilterField = function(ff)
{
	this.filterField = ff;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.DataGridDateFilter.prototype.getFilterfield = function()
{
	return this.filterField;
};

/**
 * Sets name of the filter
 * @param {String} n
 * @return {this}
 */
Banana.Controls.DataGridDateFilter.prototype.setName = function(n)
{
	this.name = n;
	return this;
};