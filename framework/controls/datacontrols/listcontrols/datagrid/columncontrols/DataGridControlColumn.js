/**
 * @author Dennis Verhoeven
 * @package Banana.Controls
 * @summary DataGridColumn 
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridControlColumn');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');


/** @namespace Banana.Controls.DataGridControlColumn */
namespace('Banana.Controls').DataGridControlColumn = Banana.Controls.DataGridColumn.extend(
/** @lends Banana.Controls.DataGridControlColumn.prototype */
{
	/** 
	 * Create datagrid custom column control for usage in table list renders.
	 * Put your own control in the constructor to instantiate it for each row
	 * 
	 * @param {Banana.UiControl} control
	 * @constructs 
	 * @extends Banana.Controls.DataGridColumn
	 * */
	init : function(control)
	{
		this.control=control;
	},
	
	/**
	 * @ignore
	 * @return {Banana.UiControl}
	 */
	getControl : function()
	{	
		var ctrl=Banana.Util.Clone(this.control);
	
		ctrl.generateUniqueId();
		
		//this is neccensary to prevent duplicated controls. issue in clone?
		ctrl.customId = false; // flag if page sets id
		ctrl.binds = [];
		ctrl.controls = [];
		return ctrl;
	}
});