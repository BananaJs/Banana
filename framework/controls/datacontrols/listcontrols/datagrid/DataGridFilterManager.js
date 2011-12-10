/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Datagrid Filter Manager  
 */

goog.provide('Banana.Controls.DataGridFilterManager');

/** @namespace Banana.Controls.DataGridFilterManager */
namespace('Banana.Controls').DataGridFilterManager = Banana.Control.extend(
/** @lends Banana.Controls.DataGridFilterManager.prototype */
{
	
	/**
	 * Creates a Filter Manager for usage in a datagrid. It centralize filter functionality of
	 * a datagrid by keeping track of filter changes and history. It saves data from the filters
	 * in the url and cookie.  
	 * 
	 * Filters should be added by calling setFilters([]);
	 * 
	 * Filters should have an interface that at least contains:
	 * 
	 * function getAllKey(): returns the key that should be used when "all" is selected
	 *
	 *  Filters can trigger the following events:
	 *  
	 *  - filterUrlChanged: triggered when url param of the filter is changed
	 *  - filterDataChanged: triggered when the filter data is changed
	 * 
	 * Example 
	 
	 
		var filterManager= new Banana.Controls.DataGridFilterManager();
		filterManager.setUrlPreFix(pageId); 
		
		//everytime a filter changes, we come here. this could be the place to reload/update
		//the data of the datagrid
		filterManager.bind('filtersChanged',this.getProxy(function(e,filterData)
		{	   
				this.populateData(filterData);
		}));
		
		//assign some filters to the filterManager
		filterManager.setFilters([
		                               
		                        new Banana.Controls.DataGridDropDownFilter()
								.setFilterField('type')
								.setAllTitle('All Program types')
								.dataSetSourceBind('programtypes','programtypes'),  
								
		                        new Banana.Controls.DataGridDropDownFilter()
								.setFilterField('country')
								.setAllTitle('All Series')
								.dataSetSourceBind('programSeries','items'),  
	
				                 new Banana.Controls.DataGridCheckboxFilter()
								.setFilterField('archive')
                                .setTitle('Display archived items'),
								
								 new Banana.Controls.DataGridSearchFilter()
								 .setFilterField('search'),

								this.pagerFilter = new Banana.Controls.DataGridPagerFilter()
								.setFilterField('pageIndex')
								.dataSetSourceBind('dataset','pageCount')
								.dataSetBind('dataset','pageIndex')
								]);
	
	
		//this is an array of filter controls. Just add them somewhere on your site.
		//You can also add them in a DatagridControlPanel. It will automatically align them nicely. 
		var filters = filterManager.getFilters();	
	 * 
	 * 
	 * @constructs
	 * @extends Banana.Control
	 */
	init : function()
	{
		this._super();
		this.enableCookie = true;
		this.showBindedFiltersOnly = false;
		this.forcedInvisibleFilters = [];
		this.filters = [];
		this.filterKeys = []; //we save names. during unload we dont have the filters anymore. already removed
		this.urlPreFix = '';
	},
	
	/**
	 * when called we do not auto adjust filter visibility.
	 * Normaly filters are hidden when no datasource is inside the filter.
	 * @return {this}
	 */
	ignoreAutoVisible : function()
	{
		this.ignoreAutoVisible = true;
		return this;
	},
	
	
	/**
	 * when called we only show filters which are binded with data
	 * @return this;
	 */
	showBindedOnly : function()
	{
		this.showBindedFiltersOnly = true;
		return this;
	},
	
	/**
	 * Filters can contain a so called all value. This value is used in cases where
	 * the user wants to unselect the filter. Normally we don't show this value in the url.
	 * This method will make that value visible. Useful when you need to know if a user 
	 * selected the all value after coming from another page.
	 * 
	 * @param {Boolean} bool
	 * @return {this}
	 */
	setKeepAllValueInUrl : function(bool)
	{
		this.keepAllValueVisible = bool;
		return this;
	},
	
	/**
	 * a prefix to save before every url param (cookie included)
	 * we do this if we have 2 datagrids and dont want to let duplicated
	 * filter params interfer with each other.
	 *
	 * @param {String} pf
	 * @return {this}
	 */
	setUrlPreFix : function(pf)
	{
		this.urlPreFix = pf;
		return this;
	},
	
	/**
	 * When invoked we will not try to restore filter states based on history
	 * @return {this}
	 */
	disableHistory : function()
	{
		this.enableCookie = false;
		return this;
	},
	
	/**
	 * Set filters for this filtermanager.
	 * Each filter should extend from Banana.Controls.BaseDataGridFilter
	 * The data inside the filter can be set manually on each filter. If it is not 
	 * manualy set we try to fetch it from the history. That means that if a user already
	 * used the filter or url param name we set that value back into the filter. Handy when user
	 * comes back to a page he already visited. The fiters will be restored to the old state.
	 * This restore operation can be avoided by called
	 *
	 * @param {Array} filters the filters
	 * @return {this}
	 */
	setFilters : function(filters)
	{
		var enableCookie = this.enableCookie;
		var urlPreFix = this.urlPreFix
		
		/**
 		 * Restore filter value from cookie and set in URL
		 */
		function restoreData(filter)
		{
			if (filter.data) return; //already set, we dont overwrite it

			var newValue;		
		
			//only restore when cookie is enabled and page is loaded 
			//with historyparams
			if (enableCookie && Banana.Application.loadingWithHistory)
			{	
				newValue = Banana.Util.StateManager.getState(urlPreFix+filter.filterField);

				Banana.Util.UrlManager.registerModule(urlPreFix+filter.filterField);
				Banana.Util.UrlManager.setModule(urlPreFix+filter.filterField,newValue,true);
			}
			//otherwise we try to fetch the value from the url
			else
			{
				newValue = Banana.Util.UrlManager.getModule(urlPreFix+filter.filterField);
			}
			
			filter.setData(
					newValue 
					|| f.getAllKey() || f.promptText)
		};
				
		for (var i = 0, len = filters.length; i < len; i++)
		{
			var f = filters[i];
	
			restoreData(f);
			
			f.bind('filterDataChanged',this.getProxy(this.filterDataChanged));
			f.bind('filterDataSourceChanged',this.getProxy(this.filterDataSourceChanged));
			f.bind('onSetVisible',this.getProxy(this.filterVisibilityChanged));
			
			//register a url listener to detect changes 
			Banana.Util.UrlManager.listenModule(urlPreFix+f.filterField,this.getProxy(this.filterUrlChanged),f);
			
			this.filterKeys.push(urlPreFix+f.filterField);
			
			if (!this.ignoreAutoVisible && (f instanceof Banana.Controls.ListControl && this.showBindedFiltersOnly && !f.datasource))
			{
				f.setVisible(false);
			}
			
			this.filters.push(filters[i]);
		}
		
		//here we update the url for all filter params.
		//we could also do it for each filter, but then we end up with multiple history points
		Banana.Util.UrlManager.updateUrl();
		
		return this;
	},
	
	/**
	 * @return {Array} of filters
	 */
	getFilters : function()
	{
		return this.filters;
	},
	
	/**
	 * @param {String} filter id of the filter
	 * @return {Filter}
	 */
	getFilterById : function(filter)
	{
		if (typeof(filter) == 'string')
		{			
			for (var i = 0, len = this.filters.length; i < len; i++)
			{
				if (this.filters[i].id == filter)
				{
					return this.filters[i];
				}
			}
		}
		
		return null;
	},
	
	/**
	 * Invoked when a filter is changed.
	 * We trigger a filtersChanged with all filter data
	 * @param {event} e
	 * @param {mixed} data of the filter
	 * @ignore
	 */
	filterUrlChanged : function(e,d)
	{
		//to prevent endless loop
		if (this.ignoreUrlChanges) return;

		var f = e.data;

		f.setData(d);

		//if filter data is the same as the all key (ie %) we remove the url param
		if (!this.keepAllValueVisible && ( 
				f.getData() === null || 
				f.getData() == undefined || 
				f.getData() == f.allKey))
			{
				this.removeFilterValues(f);
			}
			
		if (this.enableCookie)
		{
			Banana.Util.StateManager.setState(this.urlPreFix+f.filterField,f.getData());
		}	
			
		this.triggerEvent('filtersChanged',{'data':this.getFilterData(e),'filter':f});
	},
	
	/**
	 * Invoked when datasource is changed
	 * @param {event} e
	 * @ignore
	 */
	filterDataSourceChanged : function(e)
	{
		if (this.ignoreAutoVisible) return;
		
		if (e.currentTarget.datasource)
		{
			e.currentTarget.setVisible(true);
		}
	},
	
	/**
	 * Invoked when data is changed
	 * @param {event} e
	 * @ignore
	 */
	filterDataChanged : function(e)
	{
		//empty cache. 
		this.clearCache();
		
		//if filter data is the same as the all key (ie %) we remove the url param
		if (!this.keepAllValueVisible && (
		 e.currentTarget.getData() === null || 
		 e.currentTarget.getData() == undefined || 
		 e.currentTarget.getData() == e.currentTarget.allKey))
		{
			this.removeFilterValues(e.currentTarget);
		}
		else
		{
			this.registerFilterValues(e.currentTarget);
		}		
		this.triggerEvent('filtersChanged',{'data':this.getFilterData(e),'filter':e.currentTarget});		
	},
	
	/**
	 * triggered when visibility of a filter is changed
	 * 
	 * @param {event} e
	 * @param {boolean} visible true when filter becomes visible
	 * @ignore
	 */
	filterVisibilityChanged : function(e,visible)
	{
		//if rendered and visibility is changed to false we remove url params
		if (e.currentTarget.isRendered && !visible)
		{
			this.removeFilterValues(e.currentTarget);	
		}
		
	},
	
	/**
	 * removes filter values from url and cookie
	 * 
	 * @param filter
	 */
	removeFilterValues : function(filter)
	{	
		if (typeof(filter) == 'string')
		{			
			filter = this.getFilterById(filter);
		}
		
		Banana.Util.UrlManager.removeModule(this.urlPreFix+filter.filterField);
		
		if (this.enableCookie)
		{
			Banana.Util.StateManager.removeState(this.urlPreFix+filter.filterField);
		}		
	},
	
	/**
	 * @param {mixed} filter Filter itself or an id
	 * @param {String} value
	 */
	setFilterValue : function(filter,value)
	{
		if (typeof(filter) == 'string')
		{	
			filter = this.getFilterById(filter);
		}
		
		//if filter data is the same as the all key (ie %) we remove the url param
		if (value == filter.allKey)
		{
			this.removeFilterValues(filter);
		}
		else
		{
			filter.setData(value);
		}		
	},
	
	/**
	 * Registers the values of the filter in the url and state
	 * @param {Filter} filter
	 * @ignore
	 */
	registerFilterValues : function(filter)
	{
		this.ignoreUrlChanges = true;
		
		Banana.Util.UrlManager.registerModule(this.urlPreFix+filter.filterField);
		Banana.Util.UrlManager.setModule(this.urlPreFix+filter.filterField, filter.getData());

		if (this.enableCookie)
		{
			Banana.Util.StateManager.setState(this.urlPreFix+filter.filterField,filter.getData());
		}
		
		this.ignoreUrlChanges = false;
	},
	
	/**
	 * Clears the cache of the filter
	 */
	clearCache : function()
	{
		this.filtersData = undefined;
	},
	
	/**
	 * Gets the current filter data 
	 * each data part contains an object with 
	 * - filterField name of the filter field
	 * - data the actual data
	 * - dataChanged boolean true when the filter is changed by the user
	 * 
	 * @param {boolean} ignoreCache when true we don't use the cache
	 * @param {boolean} flat when true we return key value array
	 * @param {boolean} ignoreNotVisible when true we don't include the invisble filters in the returned data
	 * 
	 * @return {object} data of the filters
	 */
	getFilterData : function(ignoreCache,flat,ignoreNotVisible)
	{
		if (!this.filters) return null;

		//get the cached filter data. 
		if (!ignoreCache && this.filtersData)
		{
			 return this.filtersData;
		}

		var filterObj = {};

		for (var i =0, len = this.filters.length; i < len; i++)
		{
			var f = this.filters[i];
			
			if (f.getData() && (!f.isRendered || f.visible))
			{
				filterObj[f.name || f.filterField] = ({'filterField':f.filterField,'data':f.getData(),'dataChanged':f.isChanged});
			}
		}

		this.filtersData = filterObj;
		
		if (flat)
		{
			var flatData = {};
			
			for (var i =0, len = this.filters.length; i < len; i++)
			{
				var f = this.filters[i];
								
				if (f.getData() && (!f.isRendered || f.visible))
				{
					flatData[f.filterField] = f.getData();
				}
			}

			return flatData;
		}
		
		return this.filtersData;		
	}
});
	
	
