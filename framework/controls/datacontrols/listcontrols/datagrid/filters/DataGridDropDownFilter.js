/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridDropDownFilter 
 */

goog.provide('Banana.Controls.DataGridDropDownFilter');
 
/** @namespace Banana.Controls.DataGridDropDownFilter */
namespace('Banana.Controls').DataGridDropDownFilter = Banana.Controls.DropDown.extend(
/** @lends Banana.Controls.DataGridDropDownFilter.prototype */
{
	/**
	 * Creates a dropdown filter for usage in a datagrid
	 * @constructs
	 * @extends Banana.Controls.DropDown
	 */
	init : function()
	{
		this._super();
		
		this.allKey = '%';
		this.allTitle = null;
		
		this.addCssClass("BDataGridFilter");

		// Needed for filter interface
		this.bind('dataChanged',this.getProxy(function() {
			this.triggerEvent('filterDataChanged');
		}));
		this.bind('dataSourceChanged',this.getProxy(function() {
			this.triggerEvent('filterDataSourceChanged');
		}));
	},
	
	/**
	 * Sets datasource on the filter
	 * 
	 * @param {Object} datasource
	 * @param {boolean} ignoreEvent
	 */
	setDataSource : function(datasource,ignoreEvent)
	{
		
		if (datasource instanceof Array && typeof(datasource[0]) == 'object')
		{
			var key = this.dataKeyField || 'key';
			var value = this.dataValueField || 'value'
			
			var no = {};
			no[key] = this.allKey;
			no[value] = this.allTitle || 'All '+this.filterField;
			
			datasource.unshift(no);			
		}
		else
		{
			var newds = {};
			newds[this.allKey] = this.allTitle || 'All '+this.filterField;
			for (var prop in datasource)
			{
				if (typeof(datasource[prop]) == 'function') continue;
			
				newds[datasource[prop]] = datasource[prop];
			}
			datasource = newds;
		}	

		this._super(datasource,ignoreEvent);	
		
		return this;
	}	
});

Banana.Controls.DataGridDropDownFilter.prototype.getAllKey = function()
{
	return this.allKey;
};

Banana.Controls.DataGridDropDownFilter.prototype.setAllTitle = function(t,key)
{
	this.allTitle = t;
	
	if (key)
	{
		this.allKey = key;
	}
	
	return this;
};

Banana.Controls.DataGridDropDownFilter.prototype.setFilterField = function(ff)
{
	this.filterField = ff;
	return this;
};

Banana.Controls.DataGridDropDownFilter.prototype.setName = function(n)
{
	this.name = n;
	return this;
};

Banana.Controls.DataGridDropDownFilter.prototype.getFilterfield = function()
{
	return this.filterField;
};

Banana.Controls.DataGridDropDownFilter.prototype.getData = function()
{
	return this.data;
};
