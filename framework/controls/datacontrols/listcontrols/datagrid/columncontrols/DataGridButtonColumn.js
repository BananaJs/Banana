/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridButtonColumn 
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridButtonColumn');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');

/** @namespace Banana.Controls.DataGridButtonColumn */
namespace('Banana.Controls').DataGridButtonColumn = Banana.Controls.DataGridColumn.extend(
/** @lends Banana.Controls.DataGridButtonColumn.prototype */
{
	/**
	 * Creates Datagrid button column for usage in table list render
	 * @constructs
	 * @extends Banana.Controls.DataGridColumn
	 */
	init : function()
	{
		this._super();
		this.buttonText = "";
	},
	
	/**
	 * @param {String} text
	 */
	setButtonText : function(text)
	{
		this.buttonText = text;
		return this;
	}
});

/**
 * Create the control to use in this column. In this case, a button.
 * @ignore
 * @return {Banana.Controls.Button}
 */	
Banana.Controls.DataGridButtonColumn.prototype.getControl = function()
{
	var b = new Banana.Controls.Button();
	b.setText(this.buttonText);
	b.bind('click',this.getProxy(function(e)
	{
		function getItemRender(c)
		{
			if (c instanceof Banana.Controls.DataGridTableItemRender)
			{
				return c;
			}
			
			return getItemRender(c.getParent());
		}
		
		var ir = getItemRender(b);
		
		var index = this.listRender.getIndexByItemRender(ir);
		
		e.stopPropagation();

		var params = {'commandName':this.commandName,
				'index':index,
				'data':this.listRender.datasource[index]
		};

		this.listRender.triggerEvent('onCommand',params);
	}));

	return b;
};

/**
 * sets command name. this name will be available on the grid oncommand event
 *
 * @param {String}
 * @return {this}
 */
Banana.Controls.DataGridButtonColumn.prototype.setCommandName = function(name)
{
	this.commandName = name;
	return this;
};
