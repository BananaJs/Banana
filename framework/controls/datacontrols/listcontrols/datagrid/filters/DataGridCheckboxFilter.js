/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridCheckboxFilter 
 */

goog.provide('Banana.Controls.DataGridCheckboxFilter');

goog.require('Banana.Controls.BaseDataGridFilter');

/** @namespace Banana.Controls.DataGridCheckboxFilter */
namespace('Banana.Controls').DataGridCheckboxFilter = Banana.Controls.BaseDataGridFilter.extend(
/** @lends Banana.Controls.DataGridCheckboxFilter.prototype */
{
	/**
	 * Creates a datagrid checkbox filter.
	 * 
	 * @constructs
	 * @extends Banana.Controls.BaseDataGridFilter
	 */
	init : function()
	{
		this._super();
		
		this.checkbox = new Banana.Controls.CheckBox();
		
		this.addCssClass('BDataGridPagerFilter')
		
		this.checkbox.bind('change', this.getProxy(function() { 
			this.triggerEvent('filterDataChanged'); 
		}));
		// Needed for filter interface
		this.checkbox.bind('dataChanged',this.getProxy(function() {
			this.triggerEvent('filterDataChanged');
		}));
		this.label = new Banana.Controls.Label();
	},
	
	/**
	 * @ignore
	 */
	createComponents: function()
	{
		this.addControl(this.checkbox);
		this.addControl(this.label);
	},
	
	updateDisplay : function(){
		this.label.setForControl(this.checkbox);
	},
	
	/**
	 * @override to apply on checkbox
	 * @ignore
	 */
	setData: function(data,ignoreEvent,ignoreDom)
	{
		this.checkbox.setData(data, ignoreEvent, ignoreDom);
	},
	
	/**
	 * @ignore
	 */
	getData: function()
	{
		return this.checkbox.getData();
	},

	/**
	 * Set title on label before checkbox
	 * @param {String} text
	 * @return {this}
	 */
	setTitle : function(text)
	{
		this.label.setData(text);
		return this;
	},
	
	/**
	 * @return {String}
	 */
	getTitle : function()
	{
		return this.label.getData();
	},
	
	/**
	 * This filter doesnt have a all key. its a checkbox with just 2 states
	 * @return {null}
	 */
	getAllKey : function()
	{
		return null;
	}
});