/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Datagrid  
 */

goog.provide('Banana.Controls.DataGridTreeListHolder');

/** @namespace Banana.Controls.DataGridTreeListHolder */
namespace('Banana.Controls').DataGridTreeListHolder = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.DataGridTreeListHolder.prototype */
{
	/**
	 * Holder for Datagrid tree itemrenders
	 * The listrender automatically creates a holder where a itemrender is rendered in
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
		
		//when true we maximize the width size of a node
		//call setMaximizeAutoWidth(true) on the listRender to apply 
		this.maximizeAutoWidth = false;
		
		this.toggleHolder = new Banana.Controls.Panel().setStyle('float:left;clear:both;height:20px;width:20px;');
		this.itemRenderHolder = new Banana.Controls.Panel().setStyle('float:left;');
		this.childsHolder = new Banana.Controls.Panel().setStyle('float:left;clear:both;');
		this.buttonHolder = new Banana.Controls.Panel().setStyle('float:left;clear:both;');
		
		this.addControl(this.toggleHolder);
		this.addControl(this.itemRenderHolder);
		this.addControl(this.childsHolder);
		this.addControl(this.buttonHolder);
	},	
	
	/**
	 * returns the holder where item render is rendered in
	 * @return {Banana.Controls.Panel}
	 */
	getItemRenderHolder : function()
	{
		return this.itemRenderHolder;
	},
	
	/**
	 * returns the holder where toggle button is rendered in
	 * @return {Banana.Controls.Panel}
	 */	
	getToggleHolder : function()
	{
		return this.toggleHolder;
	},
	
	/**
	 * returns the holder where childs are rendered in
	 * @return {Banana.Controls.Panel}
	 */	
	getChildHolder : function()
	{
		return this.childsHolder;
	},
	
	/**
	 * returns the holder where buttons are rendered in
	 * @return {Banana.Controls.Panel}
	 */	
	getButtonHolder : function()
	{
		return this.buttonHolder;
	},
	
	/**
	 * @ignore
	 */
	updateDisplay : function()
	{		
		if (!this.maximizeAutoWidth) return;
		
		var dem = this.listRender.getDimensions();
		if (!dem.offset) return;
		var listRenderOffset = dem.offset.left; //add this
		var totalWidth = dem.width;
	
		var renderOffset = this.itemRenderHolder.getDimensions().offset.left-listRenderOffset;
		
		var maxWidth = totalWidth-renderOffset;
		
		this.itemRenderHolder.setCss({width:maxWidth-20+'px'});
	},

	/**
	 * @return {Banana.Controls.DataGridTreeItemRender}
	 */
	getItemRender : function()
	{
		if (!this.itemRenderHolder)
		{
			return null;
		}
		
		return this.itemRenderHolder.controls[0];
	},
	
	/**
	 * @return {Banana.Controls.DataGridTreeListNodeToggle}
	 */
	getToggle : function()
	{
		return this.toggleHolder.controls[0];
	}
});

/** @namespace Banana.Controls.DataGridTreeListRootHolder */
namespace('Banana.Controls').DataGridTreeListRootHolder = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.DataGridTreeListRootHolder.prototype */
{
	/**
	 * Holder for Datagrid tree itemrenders
	 * The listrender automatically creates a holder for root item render
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
	
		this.childsHolder = new Banana.Controls.Panel().setStyle('float:left;clear:both;');
		this.buttonHolder = new Banana.Controls.Panel().setStyle('float:left;clear:both;');
		
		this.addControl(this.itemRenderHolder);
		this.addControl(this.childsHolder);
		this.addControl(this.buttonHolder);
	},	
	
	/**
	 * @return {Banana.Controls.DataGridTreeItemRender}
	 */
	getItemRender : function()
	{
		return null;
	}
});