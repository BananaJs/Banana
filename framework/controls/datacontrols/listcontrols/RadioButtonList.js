/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Radiobutton list  
 */

goog.provide('Banana.Controls.DataControls.ListControls.RadioButtonList');

goog.require('Banana.Controls.DataControls.ListControls.CustomListControl');
goog.require('Banana.Controls.DataControls.RadioButton');

/** @namespace Banana.Controls.RadioButtonList */
namespace('Banana.Controls').RadioButtonList = Banana.Controls.CustomListControl.extend(
/** @lends Banana.Controls.RadioButtonList.prototype */	
{
	/**
	 * Creates a Radiobutton list.
	 * 
	 * use setDataSource() to create a group of radiobuttons
	 * use setData() to select radiobuttons
	 * use SetGroupName() to make a group of radiobuttons (only 1 of a group can be selected)
	 * 
	 * Example:
	 
	 var rbl = new Banana.Controls.RadioButtonList();
	 
	 this.addControl(rbl);
	 
	 rbl.setDataSource([1,2,3,4,5,6,7,8,9]);
	 rbl.setData([5,6,2]);
	 
	 
	 * @constructs
	 * @extends Banana.Controls.CustomListControl
	 */	
	init : function()
	{
		this._super();
		this.addCssClass('BRadioButtonList');
	}
	
});

/**
 * Invoked after calling setData or setDataSource
 * @ignore
 */
Banana.Controls.RadioButtonList.prototype.createControls = function()
{
	this.panel = new Banana.Controls.Panel();
	this.panel.addCssClass('BRadioButtonListItemContainer');

	for(var prop in this.datasource)
	{
		if (typeof(this.datasource[prop]) == 'function') continue;
		
		var radio = new Banana.Controls.RadioButton();
		radio.setId(prop);
		radio.setValue(prop);

		if (this.getGroupName())
		{
			radio.setName(this.getGroupName());
		}

		radio.bind('change',this.getProxy(function(sender)
		{
			this.onCheckBoxChanged(sender.data);
			this.triggerEvent('dataChanged',this.getData());

		}),radio);

		if (this.data)
		{
			if (prop == this.data)
			{
				radio.setData(true);
			}
		}

		var control = new Banana.Controls.Decorators.LabelDecoratorRight(radio).setData(this.datasource[prop]);

		this.panel.addControl(control);
	}

	this.addControl(this.panel);
	//prevent parent auto height issue
	this.addControl('<div style="clear:both;"></div>');
};

/**
 * A groupname ensures that only 1 radio button can be selected from a list of radio's
 *
 * @param {String} name of the group, must be unique
 * @return {this}
 */
Banana.Controls.RadioButtonList.prototype.setGroupName = function(name)
{
	this.groupName = name;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.RadioButtonList.prototype.getGroupName = function()
{
	return this.groupName;
};

/**
 * callback invoked after chaning a radiobutton.
 *
 * @param {event} sender
 * @ignore
 */
Banana.Controls.RadioButtonList.prototype.onCheckBoxChanged = function(sender)
{
	this.data = sender.getValue();

	this.isChanged = true;
};