/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Base data control. Provides functionality to act as a data control 
 */

import {Panel} from "./Panel.js";
import {DomHelper} from "../util/DomHelper.js";
import {DataSet} from "./DataSet.js";

/** @namespace DataControl */
export class DataControl extends Panel
/** @lends DataControl.prototype */
{
	/**
	 * Creates a base data control. Most Data controls in Banana are derived from this base data control.
	 * It adds set/get data support. And as well support to bind to datasets. @see Banana.Data.DataSet
	 * Changes made in controls are automatically redirected to the data property to ensure always up to date data.
	 * Still you can as a user bind on the 'dataChanged' event to listen to data changes.
	 * Depending on the type of the control you can also use dom events to detect changes.  
	 * 
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init()
	{
		super.init();
		this.addCssClass('BDataControl')
		this.isChanged = false;
	}

	/**
	 * @override
	 */
	updateDisplay()
	{
		super.updateDisplay();
		this.setDomData(this.data);
	}


    /**
     *	Sets data on control.
     *	when this function is called we also trigger a datachanged event and update the dom.
     *
     *	@param {mixed} data for control
     *	@param {boolean} ignoreEvent when true no datachanged is triggered. This is useful when you are running in a circle or performance issues.
     *	@param {boolean} ignoreDom when true setDomData function is not called. Useful in cases of optimizing performance.
     *  @return {this}
     *
     */
    setData(data,ignoreEvent,ignoreDom) {
    	this.data = data;

    	if (!ignoreEvent)
    	{
    		this.triggerEvent('dataChanged',data);
    	}

    	if (!ignoreDom)
    	{
    		this.setDomData(data);
    	}

    	return this;
    }

    /**
     * returns the most up to date data from the control
     *
     * @return {mixed} data
     */
    getData() {
    	return this.data;
    }

    /**
     * binds data to the Dom element
     * 
     * @ignore
     * @param {mixed} data
     *
     */
    setDomData(data) {
    	if (this.isRendered && this.data !== undefined)
    	{
    		DomHelper.setData(data, this);
    	}
    }

    /**
     * @ignore
     * @return data from dom element
     */
    getDomData() {
    	if (this.isRendered)
    	{
    		return DomHelper.getData(this);
    	}
    }

    /**
     * binds a value from data from dataset to data in this control
     *
     * @param {mixed} Banana.Data.DataSet || name of the dataset
     * @param {string} bind property of the data. can be like value.subvalue.subsubvalue
     * @return {this}
     */
    dataSetBind(set,bind) {	
    	this.bindedData = [set,bind];
	
    	if (set instanceof DataSet)
    	{
    		set.bindControlToData(this);
    	}
    	else if (this.isRendered)
    	{	
    		if (this.getPage().getDataSet(bd[0]))
    		{
    				this.getPage().getDataSet(bd[0]).bindControlToData(this);
    		}
    	}
    	return this;
    }

    /**
     * Unbinds this control from dataset
     * @param {mixed} Banana.Data.DataSet || name of the dataset
     *
     */
    unDataSetBind(set) {
    	this.bindedData = null;

    	if (set instanceof DataSet)
    	{
    		set.bindControlToData(this);
    		set.unBindControl(this);
    	}
    	else
    	{
    		set = this.getPage().getDataSet(set);
    		set.unBindControl(this);
    	}
    	return this;
    }
}
