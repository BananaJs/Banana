/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Checkbox list control  
 */

goog.provide('Banana.Controls.DataControls.ListControls.CheckBoxList');

goog.require('Banana.Controls.DataControls.ListControls.CustomListControl');

/** @namespace Banana.Controls.CheckboxList */
namespace('Banana.Controls').CheckboxList = Banana.Controls.CustomListControl.extend(
/** @lends Banana.Controls.CheckboxList.prototype */
{
	/**
	 * Creates a Checkbox list control
	 * use set datasource to populate the list and data to determine which checkbox is selected
	 * @constructs
	 * @extends Banana.Controls.CustomListControl
	 */
	init : function()
	{
		this._super();
		this.addCssClass('BCheckBoxList');
	}
});

/**
 * Invoked when data is datasource is changed
 * @override
 */
Banana.Controls.CheckboxList.prototype.createControls = function()
{
	this.panel = new Banana.Controls.Panel();
	this.panel.addCssClass('BCheckBoxListItemContainer');
	
	//When we call for data we loop over all created checkboxes
	this.checkboxReferences = [];

	for(var prop in this.datasource)
	{
		if (typeof(this.datasource[prop]) == 'function') continue;
		
		var checkbox = new Banana.Controls.CheckBox();
		checkbox.setEnabled(this.enabled)
		
		this.checkboxReferences.push(checkbox);
		
		if (this.datasource[prop][this.dataKeyField])
		{
			checkbox.setValue(this.datasource[prop][this.dataKeyField]);
		}
		else
		{
			checkbox.setValue(prop);
		}

		checkbox.setId(prop);

		checkbox.bind('change',this.getProxy(function(sender)
		{
			this.isChanged = true;
			
			this.data = this.getData();
			
			this.triggerEvent('dataChanged',this.data);

		}),checkbox);

		if (this.data)
		{
			for (var i = 0, len = this.data.length; i < len; i++)
			{
				if (this.datasource[prop][this.dataKeyField])
				{
					if (this.datasource[prop][this.dataKeyField] == this.data[i][this.dataKeyField])
					{
						checkbox.setData(true);
						break;
					}
					else if (this.datasource[prop][this.dataKeyField] == this.data[i])
					{
						checkbox.setData(true);
						break;
					}
				}
				else if(prop == this.data[i])
				{
					checkbox.setData(true);
					break;
				}
			}
		}

		var control = new Banana.Controls.Decorators.LabelDecoratorRight(checkbox);
		if (this.datasource[prop][this.dataValueField])
			control.setData(this.datasource[prop][this.dataValueField]);
		else
			control.setData(this.datasource[prop]);
		
		this.panel.addControl(control);
	}

	this.addControl(this.panel);
	
	this.addControl('<div style="clear:both;"></div>');
};

/**
 * @return {Array} of selected keys
 */
Banana.Controls.CheckboxList.prototype.getData = function()
{
	var data =[];
	
	for (var i=0,len=this.checkboxReferences.length;i<len;i++)
	{
		if (this.checkboxReferences[i].data)
		{
			data.push(this.checkboxReferences[i].getValue());
		}
	}
	
	return data;	
}