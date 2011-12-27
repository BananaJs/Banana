/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridDataTreeListRender  
 */

goog.require('Banana.Controls.DataGridTreeListRender');
goog.require('Banana.Controls.DataGridTreeDataItemRender');

goog.provide('Banana.Controls.DataGridDataTreeListRender');

/** @namespace Banana.Controls.DataGridDataTreeListRender */
namespace('Banana.Controls').DataGridDataTreeListRender = Banana.Controls.DataGridTreeListRender.extend(
/** @lends Banana.Controls.DataGridDataTreeListRender.prototype */
{
		
		/**
		 * Data tree is extends from a Banana.Controls.DataGridTreeListRender with added functionality in the nodes
		 * containing checkboxes. Selecting a checkbox will also selects checkboxes inside the child nodes
		 * 
		 * bind on "dataChanged" event to receive changes when checkboxes are checked.
		 * Call getData() to receive selected keys
		 * 
		 * example: 
		 *     
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
		 * @extends Banana.Controls.DataGridTreeListRender
		 */
		init : function()
		{
			this._super();
			this.data = [];
			this.defaultContentItemRender = Banana.Controls.DataGridTreeDataItemRender;
			
			this.bind('onPostCreateIndex',this.getProxy(function(e,data){
			
	
				this.bindClickHandler(data.holder,data.data);

			}))
		},
		
		/**
		 * @ignore
		 */
		onRowMouseClick : function(){},
		
		/**
		 * overwrite this function to create our own logic for the bind click handler
		 * when user checks or unchecks a checkbox, we also want their children being affected
		 * 
		 * @param {Object} holder
		 * @param {Object} datasource
		 * 
		 * @ignore
		 */
		bindClickHandler : function(holder,datasource)
		{
			var itemRender = holder.getItemRender();
			
			itemRender.bind('userChecked',this.getProxy(function(e){
				
				this.alterData(e.currentTarget.data[this.indexKey]);
				
				var nodeData = this.getNodeDataByData(e.currentTarget.data);
				nodeData.checked = true;
				
				var data = e.currentTarget.getData();
				
				this.toggleCheckStateFrom(nodeData.index,null,true);
				
				this.determineCheckboxState();
			}));
			
			itemRender.bind('userUnchecked',this.getProxy(function(e){
				
				this.alterData(e.currentTarget.data[this.indexKey]);
				
				var nodeData = this.getNodeDataByData(e.currentTarget.data);
				
				nodeData.checked = false;
				
				var data = e.currentTarget.getData();
			
				this.toggleCheckStateFrom(nodeData.index,null,false);
				
				this.determineCheckboxState();
			}));
		},
		
		/**
		 * Alters data by given key and state
		 * @param {mixed} key
		 * @param {state} Boolean when true we add key to data, false removes it
		 */
		alterData : function(key,state)
		{
			if (!this.data)
			{
				this.data = [];
			}
			
			var index = this.data.indexOf(key);
			
			if (state)
			{
				if (index >-1)
				{
					return; 
				}
				this.data.push(key);
				
			}
			else
			{
				if (index<0)
				{
					return;
				}
				this.data.splice(index,1);
			}
			
			this.triggerEvent('dataChanged');
		},
		
		/**
		 * Checks or unchecks all nodes from a specific node point
		 *
		 * @param {String} index to start
		 * @param {Object} datasource
		 * @param {Boolean} checkbox state true for checked, false for unchecked
		 */
		toggleCheckStateFrom : function(index,datasource,state)
		{
			if (!datasource)
			{
				datasource = this.getDataSourceByIndex(index);
			}
			
			if (!datasource)
			{
				return;
			}
			var nodeData = this.getNodeDataByData(datasource);
			nodeData.checked = state;
			
			this.alterData(datasource[this.indexKey],state);
			
			var holder = this.getHolder(nodeData.index);
			
			//if we have the visual control (we dont have it when node is closed)
			if (holder)
			{	
				var ir = holder.getItemRender();
			
				if (ir)
				{
					ir.setChecked(state);
				}
			}
						
			if (!datasource.children || !datasource.children.length)
			{
				return;
			}
			
			var i, len;
			for (i = 0, len = datasource.children.length; i < len; i++)
			{
				var item = datasource.children[i];
				
				this.toggleCheckStateFrom(null,item,state);
			}			
		},
		
		/**
		 * @overwrite
		 * 
		 * @param {String} index
		 * @param {Object} datasource
		 */
		openNode : function(index,datasource)
		{
			this._super(index,datasource);
			
			this.determineCheckboxData();
			this.determineCheckboxState();
		},
		
		/**
		 * @overwrite
		 * 
		 * @param {String} index
		 * @param {Object} datasource
		 */
		closeNode : function(index,datasource)
		{
			this._super(index,datasource);
			
			this.determineCheckboxData();
			this.determineCheckboxState();
		},
		
		/**
		 * @param {Array} data
		 * @return {this}
		 */
		setData : function(data)
		{
			this.data = data;
			this.determineCheckboxData();
			this.determineCheckboxState();
			return this;
		},
		
		/**
		 * @ignore
		 */
		updateDisplay : function()
		{
			this._super();
		
			//TODO: we need to do this in case the data is set before the tree is
			//rendered. its a bit of overhead. a better implementation should be created
			//for now it works with some performance decrease. 
			this.determineCheckboxData();
			this.determineCheckboxState();
		},
		
		/**
		 * whats are we doing here?
		 * We are walking recursively though all nodes and determine if a checkbox
		 * should be checked or not. 
		 * 
		 * @ignore
		 */
		determineCheckboxData : function(datasource)
		{
			if (!this.isRendered || !this.data || !this.data.length)
			{
				return;
			}
			
			if (!datasource)
			{
				datasource = this.datasource;
			}
			
			var i, len;
			for (i =0, len = datasource.length; i < len; i++)	
			{
				var item = datasource[i];
				var nodeData = this.getNodeDataByData(item);

				if (!item.children || !item.children.length)
				{
					if (this.data.indexOf(item[this.indexKey]) !== -1)
					{	
						var holder = this.getHolder(nodeData.index);
						
						if (!holder){continue;}	
						
						var ir = holder.getItemRender();
						
						if (!ir){continue;}	

						ir.setChecked(true);
						nodeData.checked = true;
					}
				}
				else
				{	
					var c, clen;
					for (c =0, clen = item.children.length; c < clen; c++)	
					{
						var child = item.children[c];
					
						this.determineCheckboxData([child]);
					}
				}
			}			
		},
	
		/**
		 * we are walking recursively though all nodes and 
		 * do the following things
		 * 
		 *  if all children of a node are checked, we check the node and enable
		 *  if none of the children are checked, we uncheck the node en enable the node
		 *  if some of the children are checked we check the node and disable the node
		 *  
		 *  we do this in a depth first style. 
		 *  
		 *  @param {Object} datasource
		 *  @ignore
		 */
		determineCheckboxState: function(datasource)
		{			
			if (!this.isRendered || !this.data || !this.data.length)
			{
				return;
			}
			
			if (!datasource)
			{
				datasource = this.datasource;
			}
			
			var allChecked = true;
			var noneChecked = true;
			
			var i, len;
			for (i = 0, len = datasource.length; i < len; i++)	
			{
				var item = datasource[i];
					
				allChecked = true;
				noneChecked = true;
				var indeterminate = false;
				
				if (!item.children || !item.children.length)
				{
					continue;
				}
				
				var c, clen;
				for (c = 0, clen = item.children.length; c < clen; c++)	
				{
					var child = item.children[c];
			
					var nodeData = this.getNodeDataByData(child);
					this.determineCheckboxState([child]);
					
					if (!nodeData.checked)
					{
						allChecked = false;
					}
					else
					{
						noneChecked = false;
					}
					
					if (nodeData.indeterminate)
					{
						noneChecked = allChecked = false;
					}
				}
				
				itemNodeData = this.getNodeDataByData(item);				

				var holder = this.getHolder(itemNodeData.index);
				var ir = null;
				
				if (holder)
				{
					ir = holder.getItemRender();
				}	
				
				if (allChecked)
				{
					if (ir)
					{
						ir.setChecked(true);
						ir.setEnabled(true);
					}
					
					itemNodeData.checked = true;
					itemNodeData.indeterminate = false;
				}
				else if (noneChecked)
				{
					if (ir)
					{
						ir.setChecked(false);
					}
					 
					itemNodeData.checked = false;
					itemNodeData.indeterminate = false;
				}
				else
				{
					if (ir)
					{
						ir.setChecked(true);
						ir.setEnabled(false);
					}
					
					itemNodeData.checked = true;
					itemNodeData.indeterminate = true;
				}
			}
				
		}
});