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
	b.setStyle('border: 1px solid #888888;color:white; width:50px;');
	b.setText('edit');
	b.bind('click',this.getProxy(function(e)
	{
		e.stopPropagation();
		var row = b.getParent().getParent();
		var datagrid = row.dataGridOwner;

		//for sake of compatibility -> hack -> in the futre we remove this, 
		if (!datagrid)
		{
			datagrid = this.getListRender();
		}
		
		var data = row.getData(); //TODO find a nicer solution

		datagrid.triggerEvent('onCommand',{'commandName':this.commandName,'data':data});
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