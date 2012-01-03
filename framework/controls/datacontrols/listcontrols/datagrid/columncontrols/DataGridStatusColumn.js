/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridStatusColumn
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridStatusColumn');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');

/** @namespace Banana.Controls.DataGridStatusColumn */
namespace('Banana.Controls').DataGridStatusColumn = Banana.Controls.DataGridColumn.extend(
/** @lends Banana.Controls.DataGridStatusColumn.prototype */
{
	/** 
	 * Create datagrid status control for usage in table list renders.
	 * use setStatus() to render a icon + text according the given status 
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
 */
Banana.Controls.DataGridStatusColumn.prototype.getControl = function()
{
	this.c = new Banana.Controls.DataControl();
	return this.c;
};

/**
 * sets status of the column
 *
 * @param {String} level 1 = green, 0 = orange, -1 = red, -2 = black
 * @param {String} text message
 */
Banana.Controls.DataGridStatusColumn.prototype.setStatus = function(level,text)
{
	var im = 'bluedot.png';

	switch(level)
	{
		case 1:
			im = 'greendot.png';
			break;
		case 0:
			im = 'orangedot.png';
			break;
		case -1:
			im = 'reddot.png';
			break;
		case -2:
			im = 'blackdot.png';
			break;
	}
	var image = new Banana.Controls.Image();
	image.setCss({'float':'left','margin-top':'4px','margin-right':'4px'});
	image.setImage(Banana.Application.settings.imagedir+'/'+im);

	var label = new Banana.Controls.Label();
	label.addCssClass('BDataGridStatusColumnText');
	label.setCss({'float':'left'});
	label.setData(text || '');

	this.c.addControl(image);
	this.c.addControl(label);
};