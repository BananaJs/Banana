/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Dropdown control  
 */

goog.provide('Banana.Controls.DataControls.ListControls.DropDown');

goog.require('Banana.Controls.DataControls.ListControls.ListControl');
/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @link www.vivesta.com
 * @copyright Copyright &copy; 2010
 * @license  xxx
 * @version 0.0.1
 * @package Banana.Controls
 *
 * Dropdown component
 *
 * use setDataSource() to create a a list
 * use setData() to select indices
 *
 */

/** @namespace Banana.Controls.DropDown */
namespace('Banana.Controls').DropDown = Banana.Controls.ListControl.extend(
/** @lends Banana.Controls.DropDown.prototype */
{	
	/**
	 * Creates a Dropdown
	 * 
	 * Example:
	 
	 var dropdown = new Banana.Controls.DropDown();
	 
	 this.addControl(dropdown);
	 
	 dropdown.setDataSource([1,2,3,4,5,6,7,8,9]);
	 dropdown.setData(4);
	 
	 ///another way top populate datasource is with complex objects.
	 //by default complex objects should have a dataKeyField and dataValueField.
	 //where dataKeyField = key and dataValueField = value;
	 //To change this use setDataKeyField and setDataValueField.
	 
	 dropdown.setDataSource([{key:1,value:'one'},{key:2,value:'two'}]);
	 dropdown.setData(2);
	 
	 * @constructs
	 * @extends Banana.Controls.ListControl
	 */
	init : function()
	{
		this._super();

		this.addCssClass('BDropDown');
		
		this.optGroupField = "group";

		this.bind('change',this.getProxy(function(e)
		{
			this.setData(Banana.Util.DomHelper.getData(this) || []);
			this.isChanged = true;
			this.triggerEvent('selectionChanged');
		}));
		
		// Prevent propagation of event, because parent controls, e.g.
		// a datagrid row, can capture this event in Chrome and prevent
		// it from functioning.
		this.bind('mousedown', function(e) {
			e.stopPropagation();
		});
	},
	
	/**
	 * @override
	 * @ignore
	 */
	updateDisplay: function()
	{
		this._super();
		
		// This is a Chrome Fix
		// Chrome can set the DropDown selected index to -1 showing an empty
		// option in the browser. When found reset the index to 0. only when prompt text is set
		if (!this.getPromptText()) return;
		
		if (this.isRendered) {
			var obj = jQuery('#' + this.getClientId())[0];
			if (obj && obj.selectedIndex == -1)
				obj.selectedIndex = 0;
		}
	},

	/**
	 * @return {mixed}
	 */
	getData : function()
	{
		return (this._super() == '__prompt__' ? undefined : this._super())
	},
	
	/**
	 * Set the data of the Control
	 * 
	 * @param {mixed} data Data to set
	 * @return {this}
	 */
	setData: function(data)
	{
		// When data is not available and prompttext is set select
		// the prompttext in the dropdown
		if ((data === null || data === undefined) && this.getPromptText()) {
			data = '__prompt__';
		}
		return this._super(data);
	},
	
	/**
	 * Sets the data by index.
	 * If your datasource is ["foo","apple","me"] you can use setDataByIndex(1) to
	 * set apple as the data.
	 * 
	 * @param {int} index
	 * @return {this}
	 */
	setDataByIndex : function(index)
	{
		var i = 0;
		for(var prop in this.datasource)
		{
			if (typeof(this.datasource[prop]) == 'function') continue;
			
			if (i==index)
			{
				if (this.datasource[prop][this.dataKeyField])
				{
					this.setData(this.datasource[prop][this.dataKeyField]);
				}
				else
				{
					this.setData(prop);
				}
				break;
			}
			i++;
		}
		
		return this;
	}
});

/**
 * @return {String}
 */
Banana.Controls.DropDown.prototype.getTagName = function()
{
	return 'select';
};

/**
 * we override the get html function to manualy render the <option> tags
 * instead of this method we can create an <option> class, but it will  cause some
 * overhead in very large lists. So for optimal result we handle this way
 * 
 * @ignore
 */
Banana.Controls.DropDown.prototype.getHtml = function()
{
	var html = [];

	html.push('<'+this.getTagName()+' ');
	html.push(this.getHtmlAttributes());
	html.push('>')

	var datasource = this.datasource;

	if (this.getPromptText())
	{
		html.push(this.getOption('__prompt__',this.getPromptText()));
	}

	var prevOptGroup = null;
	var add = false;

	for(var prop in datasource)
	{
		//stupid prototype adds functions to array prototype
		if (typeof(datasource[prop]) == 'function') continue;
		
		if (typeof(datasource[prop]) == 'object')
		{
			if (!datasource[prop]) {continue;}

			var optGroup = datasource[prop]['group'];
			var key = datasource[prop][this.dataKeyField];
			var value = datasource[prop][this.dataValueField];
			
			for (var x = 0; x < datasource[prop][this.dataDepthField]; x++) {
				value = "&nbsp;&nbsp;&nbsp;&nbsp;" + value;
			}
			
			if (optGroup != prevOptGroup)
			{
				html.push('<optgroup label="'+optGroup+'">');
				add = true;
			}

			html.push(this.getOption(key,value));

			if (!add && optGroup != prevOptGroup)
			{
				html.push('</optgroup>');
				add = false;
			}

			prevOptGroup = optGroup;
		}
		else
		{				
			var value = prop;

			if (datasource instanceof Array)
			{
				value = datasource[prop];
			}

			html.push(this.getOption(value,datasource[prop]));
		}
		
	}

	html.push('</'+this.getTagName()+'>');
	return html.join('');
};

/**
 * Sets the prompt text. This text is visible as first option in the dropdown.
 * Note that a prompt text doesnt have a value. calling getData() while prompttext is selected
 * results in undefined
 * 
 * @param {String} text 
 * @return {this}
 */
Banana.Controls.DropDown.prototype.setPromptText = function(text)
{
	this.promptText = text;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.DropDown.prototype.getPromptText = function()
{
	return this.promptText;
};

/**
 * Sets the optgroup
 * @param {String} value
 * @return {this}
 */
Banana.Controls.DropDown.prototype.setOptGroupField = function(value)
{
	this.optGroupField = value;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.DropDown.prototype.getOptGroupField = function()
{
	return this.optGroupField;
};

/**
 * When called we use opt grouping. By default the optgroup field is "group"
 * @return {this}
 */
Banana.Controls.DropDown.useOptGrouping = function()
{
	this.optGrouping = true;
	return this;
},

/**
 * used to render a option line
 * 
 * @param {String} value
 * @param {String} key
 * @ignore
 * @return {String}
 */
Banana.Controls.DropDown.prototype.getOption = function(value,key)
{
	var selected = '';

	if (this.data == value || (value == '__prompt__' && this.data == undefined))
	{
		selected = 'selected=selected';
	}
	return '<option '+selected+' class="BDropDownOption" value="'+value+'">'+key+'</option>';
};

/**
 * used to render a option line with optgrouping enabled
 * @param {String} value
 * @param {String} key
 * @ignore
 * @return {this}
 */
Banana.Controls.DropDown.prototype.getOptGroup = function(value,key)
{
	var selected = '';

	if (this.getData() == value)
	{
		selected = 'selected=selected';
	}
	return '<option '+selected+' class="BDropDownOption" value="'+value+'">'+key+'</option>';
};