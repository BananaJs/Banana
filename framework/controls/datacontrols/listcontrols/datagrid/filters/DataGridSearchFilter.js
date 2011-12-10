/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridPagerFilter  
 */

goog.provide('Banana.Controls.DataGridSearchFilter');

/** @namespace Banana.Controls.DataGridSearchFilter */
namespace('Banana.Controls').DataGridSearchFilter = Banana.Controls.TextBox.extend(
/** @lends Banana.Controls.DataGridSearchFilter.prototype */
{	
	/**
	 * Creates a search box for usage in a datagrid. 
	 * @constructs
	 * @extends Banana.Controls.TextBox
	 */
	init : function()
	{
		this.untouched = true; //first time we have an untouched searchbox
		this._super();
		this.addCssClass('BDataGridSearch');
		this.promptText = 'Enter search term';
		this.allKey = '%';

		this.bind('dataChanged',this.getProxy(this.handleChange));
	},
	
	getData : function()
	{
		if(this.data == this.promptText)
		{
			return this.allKey;
		}
		
		return this.data || this.allKey;
	},
	
	/**
	 * when user types something in the search input this function is called.
	 * only after 400ms the control will trigger an event. When user presses a key before 400ms
	 * seconds passed will reset the timer to 0; so fast typing will not result in many search calls.
	 */
	handleChange : function(e)
	{
		if (this.getData() == this.previousSearch) {return;}

		if (this.timer)
		{
			clearTimeout(this.timer);
		}

		this.timer = setTimeout(this.getProxy(function(){
			
			if (!this.preventEvent && !this.untouched)
			{
				this.previousSearch = this.getData();
				this.triggerEvent('filterDataChanged',this.getData())

				clearTimeout(this.timer);
			}

			this.preventEvent = false;

		}),400);
	},
	
	setFilterField : function(f)
	{
		this.filterField = f;
		return this;
	},
	
	getFilterField : function()
	{
		return this.filterField;
	}
});

Banana.Controls.DataGridSearchFilter.prototype.getAllKey = function()
{
	return null;
};

Banana.Controls.DataGridSearchFilter.prototype.createComponents = function()
{
	//we bind a click event. when the control is untouched we remove the contents of the control
	this.bind('click',this.getProxy(this.searchClicked));

	if (this.getData())
	{
		return;
	}
	var search = Banana.Util.UrlManager.getModule('search'); //we get the search string

	if (search) //if we have one we make it visible on the control
	{
		this.setData(search);
	}
	else
	{
		this.setData(this.promptText);
	}

};

Banana.Controls.DataGridSearchFilter.prototype.searchClicked = function()
{
	if (this.untouched)
	{
		this.preventEvent = true;
		this.setData('');
	}

	this.untouched = false;
};