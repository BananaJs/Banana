/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Base input data control. Provides functionality to act as a input data control 
 */


import {DataControl} from "./DataControl.js";

/** @namespace InputControl */
export class InputControl extends DataControl
/** @lends InputControl.prototype */
{
	/**
 	 * Abstract basic input control. will be rendered as <input></input>
 	 * Checkbox/radiobutton/text etc extends from this control
 	 *
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init()
	{
		super.init();
		this.bind('change',this.getProxy(this.onChange));
	}


    /**
     * focus the input control
     * @return {this}
     */
    focus() {
    	jQuery('#'+this.clientId).focus();
    	return this;
    }

    /**
     * this function is called after user changes something in the dom
     */
    onChange() {
    	this.setData(this.getDomData(),false,true);
    	this.isChanged = true;
    }

    /**
     * @return {String}
     */
    getTagName() {
    	return 'input';
    }

    /**
     * @param {String} v value of the control
     * @return {this}
     */
    setValue(v) {
    	this.value = v;
    	return this;
    }

    /**
     * @return {String} value of the control
     */
    getValue() {
    	return this.value;
    }

    /**
     * sets name of the input control. Not required!
     * @param {String} n
     * @return {this}
     */
    setName(n) {
    	this.name = n;
    	return this;
    }

    /**
     * gets name of the input control
     * @return {String} 
     */
    getName() {
    	return this.name;
    }
}
