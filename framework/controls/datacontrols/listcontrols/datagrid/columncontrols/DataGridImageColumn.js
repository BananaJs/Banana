/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridImageColumn
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridImageColumn');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');

/** @namespace Banana.Controls.DataGridImageColumn */
namespace('Banana.Controls').DataGridImageColumn = Banana.Controls.DataGridColumn.extend(
/** @lends Banana.Controls.DataGridImageColumn.prototype */	
{
	
	/** 
	 * Create datagrid header image  for usage in table list renders.
	 * Use set image url to define a image
	 * @constructs 
	 * @extends Banana.Controls.DataGridColumn 
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * @ignore
 * @return {Banana.UiControl}
 */
Banana.Controls.DataGridImageColumn.prototype.getControl = function()
{
	this.image = new Banana.Controls.Image();
	if (this.imageStyle)
	{
		this.image.setStyle(this.imageStyle);
	}
	return this.image;
};

/**
 * Style the image inside the column
 * 
 * @param {String} style The style to set
 * @return {this}
 */
Banana.Controls.DataGridImageColumn.prototype.setImageStyle = function(style)
{
	this.imageStyle = style;
	
	if (this.image)
	{
		this.image.setStyle(style);
	}
	return this;
};