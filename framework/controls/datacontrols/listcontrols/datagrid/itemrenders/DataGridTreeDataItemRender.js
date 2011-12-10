/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridTreeDataItemRender
 */

goog.provide('Banana.Controls.DataGridTreeDataItemRender');

/** @namespace Banana.Controls.DataGridTreeDataItemRender */
namespace('Banana.Controls').DataGridTreeDataItemRender = Banana.Controls.DataGridTreeItemRender.extend(
/** @lends Banana.Controls.DataGridTreeDataItemRender.prototype */
{
	/**
	 * Creates datagrid tree data item render.
	 * Looks similar to a regular tree item render. except we added a checkbox inside the item render
	 * This item render should be used inside Banana.Controls.DataGridDataTreeListRender
	 *
	 * example: 
    
	        var list = new Banana.Controls.DataGrid()
	       
	        //create list render
	  		var listRender = new Application.Controls.DataGridDataTreeListRender();
			listRender.setChildProperty("children");
			listRender.setItemIndexKey('id'); 
			listRender.setDefaultOpen(true);
			
			listRender.bind('selectIndex',this.getProxy(function(e,index){		
				listRender.selectAllFromIndex(index);		
			}));
			
		    list.setDataSource(datasource); 
			listRender.setData(data);
			
			listRender.bind('dataSourceChanged',this.getProxy(function(){
				
			}));
			
			listRender.bind('dataChanged',this.getProxy(function(){
				var selectedKeys = listRender.getData();
			}));
	 *
	 * @constructs
	 * @extends Banana.Controls.DataGridTreeItemRender
	 */
	init : function()
	{
		this._super();
	},
	
	/**
	 * Overwrite this method to implement your own custom logic.
	 * In this method you have access to this.data
	 */
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		
		this.wrapper = new Banana.Controls.Panel()
		.setStyle('position:relative;float:left;width:20px;heigth:20px;display:inline-block;');		
		
		this.clickable = new Banana.Controls.Panel()
		.setStyle('z-index:12;width:20px; height:20px;position:absolute;top:0;');
		
		this.cb = new Banana.Controls.CheckBox().setStyle('z-index:1;position:absolute;top:0;');
		this.wrapper.addControl('<div style="clear:both;height:20px;width:20px;"></div>');
		
		this.clickable.bind('click',this.getProxy(function(){
			if (this.isChecked())
			{
				this.setChecked(false);
				this.triggerEvent('userUnchecked');
			}
			else
			{
			
				this.setChecked(true);
				this.triggerEvent('userChecked');
			}
		}));
		
		this.wrapper.addControl(this.cb);
		this.wrapper.addControl(this.clickable);
			
		this.label = new Banana.Controls.Label().setStyle('float:left;');
		
		this.panel.addControl(this.wrapper);
		this.panel.addControl(this.label);
		
		this.addControl(this.panel);
	},
	
	/**
	 * By default we extract data.name to show in the item render.
	 * 
	 * overwrite to implement your own logic
	 */
	updateDisplay : function()
	{
		if (this.data && this.data.name)
		{
			this.label.setData(this.data.name);
		}
	},
		
	/**
	 * this method is automaticaly called by the listrender.
	 * @param {mixed} data
	 * @return {this} 
	 */
	setData : function(data)
	{
		this._super(data);
		return this;
	},
	
	/**
	 * @param {boolean} checked true to check the checkbox
	 * @param {boolean} ignoreEvent when true we dont fire a change event
	 */
	setChecked : function(checked,ignoreEvent)
	{
		this.cb.setData(checked);
	},
	
	/**
	 * @return {boolean} true when checked
	 */
	isChecked : function()
	{
		return this.cb.getData();
	},
	
	/**
	 * @return {boolean} true when enabled
	 */
	isEnabled : function()
	{
		return this.enabled;
	},

	/**
	 * @param {boolean} enabled
	 */
	setEnabled : function(enabled)
	{
		this.disabled = enabled;
		
		if (enabled)
		{
			this.cb.setEnabled(true);
			
			//bug in jquery ??? the set enabled doesnt work. it make use of the prop method which is not working here
			jQuery('#'+this.cb.clientId).attr('disabled',false);
			//this.clickable.setCss({'border':'1px solid green'});
		}
		else
		{
			this.cb.setEnabled(false);
			
			//bug in jquery ??? the set enabled doesnt work. it make use of the prop method which is not working here
			jQuery('#'+this.cb.clientId).attr('disabled','disabled');
			//this.clickable.setCss({'border':'1px solid red'});
		}
	},
	
	/**
	 * by default we return false here.
	 * @return {boolean} 
	 */
	isSelectable : function()
	{
		return false;
	}
});