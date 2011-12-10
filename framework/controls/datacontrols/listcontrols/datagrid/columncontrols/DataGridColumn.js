/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridColumn 
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');

/** @namespace Banana.Controls.DataGridColumn */
namespace('Banana.Controls').DataGridColumn = Banana.Control.extend(
/** @lends Banana.Controls.DataGridColumn.prototype */
{
	/**
	 * Creates datagrid column for usage in table list renders
	 * @constructs
	 * @extends Banana.Control
	 */
	init : function()
	{
		this._super();
		
		this.attributes = {};
	},
	
	/**
	 * @ignore
	 * @return {Banana.DataControl}
	 */
	getControl : function()
	{
		return new Banana.Controls.Label();
	},
	
	/**
	 * sets the current idex where the column is created in
	 * @ignore
	 * @param {int} index
	 */
	setCurrentIndexCreation : function(index)
	{
		this.currentIndexCreation = index;
	}	

});

/**
 * Sets data on the column.
 * Automaticaly called by the list render.
 *
 * @param {mixed} data
 * @return {this}
 */
Banana.Controls.DataGridColumn.prototype.setData = function(data)
{
	this.data = data;
	return this;
};

/**
 * @return {mixed}
 */
Banana.Controls.DataGridColumn.prototype.getData = function()
{
	return this.data;
};

/**
 * sets sortfield 
 * Note: for reference material only. we dont do realy anything with it.
 *
 * @param {String} field
 * @return {this}
 */
Banana.Controls.DataGridColumn.prototype.setSortField = function(field)
{
	this.sortField = field;
	return this;
};

/**
 * Sets the header text visible in grid on top of each column
 *
 * @param {String} text
 * @return {this}
 */
Banana.Controls.DataGridColumn.prototype.setHeaderText = function(text)
{
	this.headerText = text;
	return this;
};

/**
 * returns the header text visible in grid on top of each column
 *
 * @return {String}
 */
Banana.Controls.DataGridColumn.prototype.getHeaderText = function()
{
	return this.headerText;
};

/**
 * use property of data object which should be applied to the column control
 * If your data looks like {name:"foo",id:12} 
 * you can use either setDataField("name") or setDataField("id")
 *
 * @param {String} fields
 * @return {this}
 */
Banana.Controls.DataGridColumn.prototype.setDataField = function(field)
{
	this.dataField = field;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.DataGridColumn.prototype.getDataField = function()
{
	return this.dataField;
};

/**
 * Sets reference to list render
 * @ignore
 * @param {Banana.Controls.DataGridTableListRender} lr
 */
Banana.Controls.DataGridColumn.prototype.setListRender = function(lr)
{
	this.listRender = lr;
	return this;
};

/**
 * gets reference to the underlying list render.
 * @return {Banana.Controls.DataGridTableListRender}
 */
Banana.Controls.DataGridColumn.prototype.getListRender = function()
{
	return this.listRender;
};

/**
 * Sets reference to wrapper row control arround each column
 * @ignore
 * @param {Banana.Controls.TableRow} r
 * @return {this}
 */
Banana.Controls.DataGridColumn.prototype.setOwnerRow = function(r)
{
	this.ownerRow = r;
	return this;
};

/**
 * @ignore
 * @return {Banana.Controls.TableRow}
 */
Banana.Controls.DataGridColumn.prototype.getOwnerRow = function()
{
	return this.ownerRow;
};

/**
 * Sets style applied in the header on top of each row
 * @param {String} css
 * @return {this}
 */
Banana.Controls.DataGridColumn.prototype.setHeaderStyle = function(css)
{
	this.headerStyle = css;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.DataGridColumn.prototype.getHeaderStyle = function(css)
{
	return this.headerStyle;
};

/**
 * Sets style in this column
 * @param {String} css
 * @return {this} 
 */
Banana.Controls.DataGridColumn.prototype.setStyle = function(css)
{
	this.style = css;
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.DataGridColumn.prototype.getStyle = function(css)
{
	return this.style;
};

/**
 * @param {boolean} visible
 */
Banana.Controls.DataGridColumn.prototype.setVisible = function(visible)
{
	this.visible = visible;
	return this;
};

/**
 * @return {boolean}
 */
Banana.Controls.DataGridColumn.prototype.getVisible = function(v)
{
	return this.visible;
};

/**
 * Sets attribute
 *  
 * @param {String} attribute 
 * @param {String} value
 * @return {this}
 */
Banana.Controls.DataGridColumn.prototype.setAttribute = function(attribute,value)
{
	this.attributes[attribute ] = value;
	return this;
};