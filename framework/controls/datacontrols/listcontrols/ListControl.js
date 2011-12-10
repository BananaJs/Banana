/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary list control  
 */

goog.provide('Banana.Controls.DataControls.ListControls.ListControl');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.ListControl */
namespace('Banana.Controls').ListControl = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.ListControl.prototype */
{
	
	/**
	 * Create a base list control.
	 * Providing functionality to bind the datasource of this control to datasets.
	 * This control should only used as an extension class for more specific controls.
	 * 
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init: function()
	{
		this._super();
		
		this.dataKeyField = 'key';
		this.dataValueField = 'value';
		this.dataDepthField = 'depth';
	}

});

/**
 *	sets datasource on control.
 *	when this method is called we invalidate the control to let the page
 *  rerender the control. We also trigger a dataSourceChanged event
 *	
 *	@param {mixed} data for control
 *	@param {boolean} when true no dataSourCechanged event is triggered
 *	@return {this}
 */
Banana.Controls.ListControl.prototype.setDataSource = function(datasource,ignoreEvent)
{
	this.datasource  = datasource;

	this.invalidateDisplay();

	if (!ignoreEvent)
	{
		this.triggerEvent('dataSourceChanged',datasource);
	}
	return this;
},

/**
 * @return {mixed}
 */
Banana.Controls.ListControl.prototype.getDataSource = function()
{
	return this.datasource;
};

/**
 * binds a value from datasource from dataset to datasource in this control
 *
 * @param {mixed} Banana.Data.DataSet || name of the dataset
 * @param {string} bind property of the data. can be like value.subvalue.subsubvalue
 * @return {this}
 */
Banana.Controls.ListControl.prototype.dataSetSourceBind = function(set,bind)
{
	this.bindedDataSource = [set,bind];
	
	if (set instanceof Banana.Data.DataSet)
	{
		set.bindControlToDataSource(this);
	}
	
	return this;
};

/**
 * @param {String} key of the field where the key resists in.
 * Only use this when your datasource contains complex objects
 * @return this;
 */
Banana.Controls.ListControl.prototype.setDataKeyField = function(key)
{
	this.dataKeyField = key;
	return this;
};

/**
 * @param {String} key of the field where the value resists in.
 * Only use this when your datasource contains complex objects
 * @return this;
 */
Banana.Controls.ListControl.prototype.setDataValueField = function(value)
{
	this.dataValueField = value;
	return this;
};

/**
 * @ignore
 * TODO: I think it should be moved to the Banana.Controls.DropDown class
 */
Banana.Controls.ListControl.prototype.setDataDepthField = function(value)
{
	this.dataDepthField = value;
	return this;
};