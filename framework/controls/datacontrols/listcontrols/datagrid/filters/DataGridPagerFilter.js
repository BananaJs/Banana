/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridPagerFilter 
 */

goog.provide('Banana.Controls.DataGridPagerFilter');

goog.require('Banana.Controls.DataControls.ListControls.ListControl');

/** @namespace Banana.Controls.DataGridPagerFilter */
namespace('Banana.Controls').DataGridPagerFilter = Banana.Controls.ListControl.extend(
/** @lends Banana.Controls.DataGridPagerFilter.prototype */
{	
	/**
	 * Create data grid pager filter
	 * @constructs
	 * @extends Banana.Controls.ListControl
	 */
	init : function()
	{
		this.addCssClass('BDataGridPagerFilter')
		
		this._super();

		this.dropDown = new Banana.Controls.DropDown().setVisible(false);
	
		this.pagerLinks = new Banana.Controls.Panel().addCssClass('BDataGridPagerFilterButtonContainer');

		this.addControl(this.dropDown);
		this.addControl(this.pagerLinks);

		this.dropDown.bind('selectionChanged',this.getProxy(this.pagerDropDownChanged));

		this.bind('dataChanged',this.getProxy(function(){
			
			this.onSetData();
			
			this.dropDown.setData(this.getData());

			this.createDropDownDataSource();

			if (this.datasource  !=null)
			{
				this.createPageLinks();
			}
			
			//true to make sure we dont end up in endless loop
			this.triggerEvent('filterDataChanged',true);
		}));

		this.bind('dataSourceChanged',this.getProxy(function(){
	
			if (this.data !=null)
			{
				this.createPageLinks();
				this.createDropDownDataSource();
			}
			this.triggerEvent('filterDataSourceChanged');
		}));
		
		this.bind('indexChanged', this.getProxy(function()
		{
            		this.createDropDownDataSource();
			this.triggerEvent('filterDataChanged');
		}));
	}
});

/**
 * @return {String}
 */
Banana.Controls.DataGridPagerFilter.prototype.getAllKey = function()
{
	return null;
};

/**
 * sets the field where to filter on
 * @param {String} f
 * @return {this}
 */
Banana.Controls.DataGridPagerFilter.prototype.setFilterField = function(f)
{
	this.filterField = f;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.DataGridPagerFilter.prototype.getFilterField = function()
{
	return this.filterField;
};

Banana.Controls.DataGridPagerFilter.prototype.nextClick = function()
{
	if (this.getDataSource() <= (parseInt(this.getData())+1)) return;

	this.setData((parseInt(this.getData())+1));
	jQuery(this).trigger('indexChanged',this.getData());
};

Banana.Controls.DataGridPagerFilter.prototype.previousClick = function()
{
	if (this.getData() <= 0) return;
	
	this.setData((parseInt(this.getData())-1));
	jQuery(this).trigger('indexChanged',this.getData());
};

Banana.Controls.DataGridPagerFilter.prototype.pagerDropDownChanged = function()
{
	this.setData(parseInt(this.dropDown.getData()));
	jQuery(this).trigger('indexChanged',this.dropDown.getData());
	this.createPageLinks();
};

/**
 * @ignore
 * @param owner of this pager
 */
Banana.Controls.DataGridPagerFilter.prototype.setDataGridOwner = function(datagrid)
{
	this.datagridowner = datagrid;
};

/**
 * invoked after setting data on control. 
 * @ignore
 */
Banana.Controls.DataGridPagerFilter.prototype.onSetData = function(d)
{
	
};

/**
 * Creates pager links
 */
Banana.Controls.DataGridPagerFilter.prototype.createPageLinks = function()
{
	this.pagerLinks.clear();

	if (this.datasource <= 1)
	{
		this.dropDown.setVisible(false);
		return;
	}
	
	this.dropDown.setVisible(true);

	var pages = parseInt(this.datasource);
	var data = parseInt(this.data);
	var startIndex = 1;

	if (data > 2)
	{
		//we are reaching the end
		if (pages - data < 3)
		{
			startIndex = pages - 4;
		}
		else
		{
			startIndex = data -1;
		}
	}

	if (startIndex < 1)
	{
		startIndex = 1;
	}

	var endIndex = startIndex + 5;

	if (endIndex > pages)
	{
		endIndex = pages+1;
	}

//	var start = new Banana.Controls.Button().addCssClass('BDataGridPagerButton').setLabelCssClass('BDataGridPagerButtonLabel');
//	start.setText('<< ');

	var prev = new Banana.Controls.Button().addCssClass('BDataGridPagerFilterButton');
	prev.setText('< ');

	//this.pagerLinks.addControl(start);
	this.pagerLinks.addControl(prev);

	for (i = startIndex; i < endIndex; i++)
	{
		if (i > this.datasource) {break;}

		var b = new Banana.Controls.Button().addCssClass('BDataGridPagerFilterButton');
		b.setText(i);
		if (i-1 == data)
		{
			b.addCssClass('BDataGridPagerFilterButtonSelected');
		}
		this.pagerLinks.addControl(b);

		b.bind('click',this.getProxy(this.onPageNavigate),i);
	}

	var next = new Banana.Controls.Button().addCssClass('BDataGridPagerFilterButton');
	next.setText('>');

//	var end = new Banana.Controls.Button().addCssClass('BDataGridPagerButton').setLabelCssClass('BDataGridPagerButtonLabel');;
//	end.setText('>>');

	next.bind('click',this.getProxy(this.nextClick));

	prev.bind('click',this.getProxy(this.previousClick));
	
	this.pagerLinks.addControl(next);
	//this.pagerLinks.addControl(end);

	this.pagerLinks.invalidateDisplay();

};

Banana.Controls.DataGridPagerFilter.prototype.onPageNavigate = function(e)
{
	this.setData((parseInt(e.data)-1));
	this.dropDown.setData((parseInt(e.data)-1));
	jQuery(this).trigger('indexChanged',this.getData());
};


/**
 * creates datasource content (ported from phpmyadmin pager)
 */
Banana.Controls.DataGridPagerFilter.prototype.createDropDownDataSource = function()
{
    //only proceed when we have data and datasource
    if (!this.getDataSource())
    {
        return;
    }
    var pages = parseInt(this.datasource);

	//Start function with fixed data about the construction of the pager
    	var pageNow = parseInt(this.data); //current page number
    	var nbTotalPage = pages; //number of total pages
	var showAll = 50; //If the number of pages is lower than this variable, no pages will be omitted in pagination
	var sliceStart = 5; //How many rows at the beginning should always be shown?
	var sliceEnd = 5; //How many rows at the end should always be shown?
	var percent = 20; //Percentage of calculation page offsets to hop to a next page
	var range = 10; // Near the current page, how many pages should be considered "nearby" and displayed as well?
    	var prompt = ''; //The prompt to display (sometimes empty)

   	var increment = Math.floor( nbTotalPage /  percent);
   	var pageNowMinusRange = ( pageNow -  range);
   	var pageNowPlusRange = ( pageNow +  range);

   	var pages = [];

   	if (nbTotalPage < showAll)
   	{
		//If the total page are less than how many page i have to show...i create an array with every pages
		for (i = 1; i <= nbTotalPage; i++)
		{
			pages.push(i);
		}
   }
   else
   {
        // Always show first X pages
        var i;
        for (i = 1; i <= sliceStart; i++)
        {
            pages.push(i);
        }

        // Always show last X pages
        var j;
        for (j = nbTotalPage - sliceEnd; j <= nbTotalPage; j++)
        {
            pages.push(j);
        }

        // Based on the number of results we add the specified
        // $percent percentage to each page number,
        // so that we have a representing page number every now and then to
        // immediately jump to specific pages.
        // As soon as we get near our currently chosen page ($pageNow -
        // $range), every page number will be shown.
        var k = sliceStart;
        var x = nbTotalPage - sliceEnd;
        var met_boundary = false;
        while (k <= x)
        {
            if (k >= pageNowMinusRange && k <= pageNowPlusRange)
            {
                // If our pageselector comes near the current page, we use 1
                // counter increments
                k++;
                met_boundary = true;
            }
            else
            {
                // We add the percentage increment to our current page to
                // hop to the next one in range
                k += increment;

                // Make sure that we do not cross our boundaries.
                if (k > pageNowMinusRange && ! met_boundary)
                {
                    k = pageNowMinusRange;
                }
            }

            if (k > 0 && k <= x)
            {
                pages.push(k);
            }
        }
       
        /**
         * @ignore
         */
        sortfunc = function(a,b)
	    {
		    return parseInt(a,10) - parseInt(b,10);
	    };
        //sort the array
	    pages.sort(sortfunc);
    }

    var ds  = new Array(); 
    for (var i in pages)
    {
        if (typeof (pages[i]) == 'function')
        {
            continue;
        }
        
        var ob = {};
        ob.key = pages[i]-1;
        ob.value = pages[i];
        ds.push(ob);
    }
	this.dropDown.setDataSource(ds,true);
};