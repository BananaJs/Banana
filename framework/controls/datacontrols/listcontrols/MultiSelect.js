/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Multi select  
 */

goog.provide('Banana.Controls.DataControls.ListControls.MultiSelect');

goog.require('Banana.Controls.DataControls.ListControls.DropDown');

/** @namespace Banana.Controls.MultiSelect */
namespace('Banana.Controls').MultiSelect = Banana.Controls.DropDown.extend(
/** @lends Banana.Controls.MultiSelect.prototype */		
{
		
	/**
	 * Creates a Multiselect.
	 * 
	 * Example:
	 
	 var multiselect = new Banana.Controls.MultiSelect();
	 
	 this.addControl(multiselect);
	 
	 multiselect.setDataSource([1,2,3,4,5,6,7,8,9]);
	 multiselect.setData([5,6,2]);
	 
	 ///another way top populate datasource is with complex objects.
	 //by default complex objects should have a dataKeyField and dataValueField.
	 //where dataKeyField = key and dataValueField = value;
	 //To change this use setDataKeyField and setDataValueField.
	 
	 multiselect.setDataSource([{key:1,value:'one'},{key:2,value:'two'}]);
	 multiselect.setData([2,4,6]);
	 
	 * @constructs
	 * @extends Banana.Controls.DropDown
	 */
	init : function()
	{
		this._super();

		this.addCssClass('BMultiSelect');
		
		this.optGroupField = "group";
	},	
	
	/**
	 * @override to enable multiselect
	 * @ignore
	 */
	getAttributes : function()
	{
		var attr = this._super();
		attr['multiple'] = 'multiple';
		return attr;
	}
});