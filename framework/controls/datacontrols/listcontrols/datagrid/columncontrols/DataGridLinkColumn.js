/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridLinkColumn
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridLinkColumn');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');

/** @namespace Banana.Controls.DataGridLinkColumn */
namespace('Banana.Controls').DataGridLinkColumn = Banana.Controls.DataGridColumn.extend(
/** @lends Banana.Controls.DataGridLinkColumn.prototype */	
{
	/** 
	 * Create datagrid link for usage in table list renders.
	 * Use sethref to define the link
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
Banana.Controls.DataGridLinkColumn.prototype.getControl = function()
{
	this.link = new Banana.Controls.Link();
	return this.link;
};

/**
 * @param {String} href
 * @return {this}
 */
Banana.Controls.DataGridLinkColumn.prototype.setHref = function(href)
{
	this.href = href;
	if (this.link)
	{
		this.link.setHref(href);
	}
	return this;
};