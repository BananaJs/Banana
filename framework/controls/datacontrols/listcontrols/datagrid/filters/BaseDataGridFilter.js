/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary BaseDataGridFilter 
 */

goog.provide('Banana.Controls.BaseDataGridFilter');

/** @namespace Banana.Controls.BaseDataGridFilter */
namespace('Banana.Controls').BaseDataGridFilter = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.BaseDataGridFilter.prototype */		
{
	
	/**
	 * Base class for datagrid list filters.
	 * Filters are not filtering data inside of Banana. They should be used as reference material
	 * for your own implementations. for more info see {@link Banana.Controls.DataGridFilterManager}
	 * 
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
		
		this.allKey = '%';
		this.allTitle = null;
	},
	
	/**
	 * Sets datasource on the filter
	 * 
	 * @param {Object} datasource
	 * @param {boolean} ignoreEvent
	 */
	setDataSource : function(datasource,ignoreEvent)
	{
		var newds = {};

		newds[this.allKey] = this.allTitle || 'All '+this.filterField;
		for (var prop in datasource)
		{
			if (typeof(datasource[prop]) == 'function') continue;
			
			newds[prop] = datasource[prop];
		}
		
		datasource = newds

		this._super(newds,ignoreEvent)
		return this;
	},	
	
	/**
	 * Sets data on the filter
	 * @param {mixed} data
	 * @return {this}
	 */
	setData : function(data)
	{
		this.data = data;
		return this;
	},

	/**
	 * gets data from the filter
	 * @return {mixed}
	 */
	getData : function()
	{
		return this.data;
	}
});



/**
 * Sets all title on the filter. This all title use most of the time used as a filter value 
 * represending all values inside.
 * 
 * @param {String} title
 * @param {String} key
 */
Banana.Controls.BaseDataGridFilter.prototype.setAllTitle = function(title,key)
{
	this.allTitle = title;
	
	if (key)
	{
		this.allKey = key;
	}
	
	return this;
};

/**
 * Sets field to filter on
 * @param {String} ff
 * @return {this}
 */
Banana.Controls.BaseDataGridFilter.prototype.setFilterField = function(ff)
{
	this.filterField = ff;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.BaseDataGridFilter.prototype.getFilterfield = function()
{
	return this.filterField;
};

/**
 * Sets name of the filter
 * @param {String} n
 * @return {this}
 */
Banana.Controls.BaseDataGridFilter.prototype.setName = function(n)
{
	this.name = n;
	return this;
};