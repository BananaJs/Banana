/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridControlPanel
 */

goog.provide('Banana.Controls.DataGridControlPanel');

goog.require('Banana.Controls.DataGridFilterManager');

/** @namespace Banana.Controls.DataGridControlPanel */
namespace('Banana.Controls').DataGridControlPanel = Banana.Control.extend(
/** @lends Banana.Controls.DataGridControlPanel.prototype */
{
	
	/**
	 * Creates control panel for datagrid. 
	 * A control panel holds filters, pagers and search controls. It places them automatically
	 * at predefined places.
	 * @constructs
	 * @extends Banana.Control
	 */
	init : function()
	{
		this._super();
		this.addCssClass("BDataGridControlPanel");
		this.createLayout();
		this.buttons = [];
		this.topButtons = [];
	},
	
	/**
	 * @ignore
	 */
	updateDisplay : function()
	{
		this.top.setVisible(this.top.controls.length);
		this.middle.setVisible(this.middle.controls.length);
		this.bottom.setVisible(this.bottom.controls.length-1); //-1 to compensate the arrow
	},
	
	/**
	 * Sets array of filters
	 * @param {Array} filters
	 */
	setFilters : function(filters)
	{
		for (var i=0,len = filters.length; i < len; i++)
		{
			if (filters[i] instanceof Banana.Controls.DataGridPagerFilter)
			{
				this.setPagerFilter(filters[i]);	
			}
			else if (filters[i] instanceof Banana.Controls.DataGridDropDownFilter)
			{
				this.setDropDownFilter(filters[i]);
			}
			else if (filters[i] instanceof Banana.Controls.DataGridSearchFilter)
			{
				this.setSearchFilter(filters[i]);
			}
			else if (filters[i] instanceof Banana.Controls.DataGridDateFilter)
			{
				this.setDateFilter(filters[i]);
			}			
			else
			{
				log.error('Filter ' + filters[i] + ' not supported by datagrid control panel!');
			}	
		}
	},
	
	/**
	 * sets the search filter
	 * @param {Banana.Controls.DataGridSearchFilter} filter
	 */
	setSearchFilter : function(filter)
	{
		this.middle.addControl(filter);
	},
		
	/**
	 * sets the pager filter
	 * @param {Banana.Controls.DataGridPagerFilter} filter
	 */
	setPagerFilter : function(pager)
	{
		this.bottom.addControl(pager);
	},
	
	/**
	 * sets the date filter
	 * @param {Banana.Controls.DataGridDateFilter} filter
	 */
	setDateFilter : function(filter)
	{
		this.top.addControl(filter);
	},

	/**
	 * sets a dropdown filter
	 * @param {Banana.Controls.DataGridDropDownFilter} filter
	 */
	setDropDownFilter : function(filter)
	{
		filter.setStyle('float:left;');
		this.middle.addControl(filter);
	},
	
	/**
	 * set top buttons
	 * by default they are aligned from the right
	 * @param {Array} buttons
	 */
	setTopButtons : function(buttons)
	{
		this.topButtons = buttons;
		
		var i,len;
		for (i=0,len = buttons.length; i < len; i++)
		{
			this.top.addControl(buttons[i]);
			buttons[i].setStyle('float:right;margin-right:2px;');
		}
	},
		
	/**
	 * set buttons
	 * by default the are aligned from the left
	 * @param {Array} buttons
	 */
	setButtons : function(buttons)
	{
		this.buttons = buttons;
	
		buttondownadded = false;
		
		for (var i=0,len = buttons.length; i < len; i++)
		{
			buttondownadded = true;
			this.bottom.addControl(buttons[i]);			
		}
		
		//if a dropdown is added we show the arrow indicator
		if (buttondownadded)
		{
			this.arrow.setVisible(true);
		}
	},
	
	/**
	 * create layout
	 * @ignore
	 */
	createLayout : function()
	{
		this.top = new Banana.Controls.Panel().addCssClass('BDataGridControlPanelTop');
		this.middle = new Banana.Controls.Panel().addCssClass('BDataGridControlPanelCenter');
		this.bottom = new Banana.Controls.Panel().addCssClass('BDataGridControlPanelBottom');
		
		this.addControl(this.top);
		this.addControl(this.middle);
		this.addControl(this.bottom);
		
		this.arrow = new Banana.Controls.Panel().addCssClass('BDataGridControlArrow');
		//default is invisible. later when we add filters we make it visible
		this.arrow.setVisible(false);
		this.bottom.addControl(this.arrow);		
	}
});
