/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Datagrid  
 */

goog.provide('Banana.Controls.DataGridBaseListRender');

/** @namespace Banana.Controls.DataGridBaseListRender */
namespace('Banana.Controls').DataGridBaseListRender = Banana.Controls.CustomListControl.extend(
/** @lends Banana.Controls.DataGridBaseListRender.prototype */
{
	
	/**
	 * Creates Bases list render.
	 * 
	 * base class for list renders. a list render is responsible for rendering item renders.
	 * a listrender instance should be inserted into a datagrid.
	 * 
	 * @constructs
	 * @extends Banana.Controls.CustomListControl
	 */
	init : function()
	{
		this._super();
		
		this.addCssClass("BDataGridListRender");
		
		this.indexItemRenderFactory = []; //this array consists out of factory's or strings
		
		this.indexKey = 'id';
		this.useAutoIndexing = false;
		this.autoIndexKey = '__uid__';
		this.selectedIndices = new Banana.Util.ArrayBiCollection();
		this.indexDataMap = [];
		this.indexRenderedItemRenderMap = []; //these are the real ui item renders
	},
	
	/**
	 * @param {int} index
	 * @return {Banana.Controls.ItemRender}
	 */
	getRenderedItemRenderByIndex : function(index)
	{
		return this.indexRenderedItemRenderMap[index];
	},

	/**
	* @return {Array} 
	*/
	getRenderedItemRenders : function()
	{
		return this.indexRenderedItemRenderMap;
	},
	
	/**
	 * @ignore
	 */
	createComponents : function()
	{
		this.setupIndexing();
		this._super();
	},
	
	/**
	 * Items in a list needs to be indentified. You can specify a indexkey. 
	 * or you can let the listrender generate one. Calling this method
	 * will change the indexKey to autoIndexKey value
	 * 
	 * @return {boolean} true when index 
	 * @ignore
	 */
	setupIndexing : function()
	{
		if (!this.indexKey)
		{
			this.useAutoIndexing = true;
			this.indexKey = this.autoIndexKey;
			return true;
		}
		
		return false;
	},
	
	/**
	 * @return {String} almost unique
	 * @ignore
	 */
	getUid : function()
	{
		return (((1+Math.random())*0x1000000000)|0).toString(16).substring(1);
	},
	
	/**
	 * applies a unique identifier to an object
	 * not that we wont overwrite an existing identifier. this would result into inconsistency  problems.
	 * 
	 * @param {Object} data
	 */
	applyUid : function(data)
	{
		if (this.useAutoIndexing && !data[this.indexKey])
		{
			data[this.indexKey] = this.getUid();
		}
	},
	
	/**
	 * Rerenders the list render.
	 */
	rerender : function()
	{
		this.clear();
		this.createControls();
		this.invalidateDisplay();
	},
	
	/**
	 * called by framework when control is removed
	 * @ignore
	 */
	unload : function()
	{
		this._super();
		
		this.selectedIndices.clear();
		this.selectedIndices = undefined;
		this.indexDataMap = undefined;
	},
	
	/**
	 * @param {String} key
	 */
	setItemIndexKey : function(key)
	{
		this.indexKey = key;
		return this;
	},
	
	/**
	 * @param {int} i
	 */
	addSelectedIndex : function(i)
	{
		this.selectIndex(i);

		this.selectedIndices.addItem(i,true);
	},
	
	/**
	 * clears selected indices
	 */
	clearSelectedIndices : function()
	{		
		this.selectedIndices.each(this.getProxy(function(index,d)
		{
			var keyIndex = this.selectedIndices.getKeyByIndex(index);
			this.deSelectIndex(keyIndex);
		}));

		this.selectedIndices.clear();
	},
	
	/**
	 * @param {int} index
	 */
	clearSelectedIndex : function(index)
	{
		this.deSelectIndex(index);

		this.selectedIndices.remove(index);
	},
	
	/** 
	 * Retreives the selected indices. 
	 * @param {boolean} flat true returns array of selected indices
	 * @return {mixed} 
	 */
	getSelectedIndices : function(flat)
	{
		if (flat)
		{
			var result = [];
			this.selectedIndices.each(this.getProxy(function(index,d)
			{
				var keyIndex = this.selectedIndices.getKeyByIndex(index);
				result.push(keyIndex);
			}));
			
			return result;
		}
		
		return this.selectedIndices;
	},
	
	/**
	 * @param {int} index
	 * @return {Boolean} true when selected
	 */
	getIndexIsSelected : function(index)
	{
		if (this.selectedIndices.getItemByKey(index))
		{
			return true;
		}

		return false;
	},
	
	/**
	 * Sets selected indices by items. 
	 * @param {Array} items
	 */
	setSelectedItems : function(items)
	{
		for (i = 0, len = items.length; i < len; i++)
		{
			var rowIndex = 0;
			var dataIndex;
			for (dataIndex in this.datasource)
			{
				if (typeof(this.datasource[dataIndex]) === 'function' ) {continue;}

				if (items[i] && (this.datasource[dataIndex][this.indexKey] === items[i][this.indexKey]))
				{
					 this.addSelectedIndex(rowIndex);
				}

				rowIndex++;
			}
		}
	},
	
	/**
	 * moves selected items up
	 * 
	 * @return {this}
	 */
	moveSelectedItemsUp : function()
	{
		var si = [];
		
		this.selectedIndices.each(this.getProxy(function(index,d)
		{
			si.push(this.selectedIndices.getKeyByIndex(index));
		}));
		
		//no items selected
		if (!si.length)
		{
			return;
		}
		
		//sort for extraction
		si.sort();
		
		var amountToExtract = si.length;
		
		//determine index for extraction
		var indexToExtract = si[0]-1;
		
		//no items above selected
		if (indexToExtract < 0)
		{
			return;
		}
		
		//save item we are going to remove
		var itemToExtract = this.datasource[indexToExtract];
		
		//remove item from index
		this.datasource.splice(indexToExtract,1);
		
		//reinsert item
		this.datasource.splice(indexToExtract+amountToExtract,0,itemToExtract);
		
		//force rerender
		this.setDataSource(this.datasource);
		
		return this;
	},
	
	/**
	 * moves selected items down
	 * 
	 * @return {this}
	 */
	moveSelectedItemsDown : function()
	{
		var si = [];
		
		this.selectedIndices.each(this.getProxy(function(index,d)
		{
			si.push(this.selectedIndices.getKeyByIndex(index));
		}));
		
		//no items selected
		if (!si.length)
		{
			return;
		}
		
		//sort for extraction
		si.sort();
		
		var amountToExtract = si.length;
		
		//determine index for extraction
		var indexToExtract = si[si.length-1]+1;
			
		//no items above selected
		if (indexToExtract+1 > this.datasource.length)
		{
			return;
		}
		
		//save item we are going to remove
		var itemToExtract = this.datasource[indexToExtract];
		
		//remove item from index
		this.datasource.splice(indexToExtract,1);
		
		//reinsert item
		this.datasource.splice(si[0],0,itemToExtract);
		
		//force rerender
		this.setDataSource(this.datasource);
		
		return this;
	},

	/**
	 * Selects previous from list
	 * @return {this}
	 */
	selectPreviousFromList : function()
	{
		var selected = this.listRender.getSelectedIndices(true);

		this.listRender.clearSelectedIndices();

		if (selected.length)
		{
			var toSelect = Math.max(0,selected[0]-1);
			this.listRender.addSelectedIndex(toSelect);
		}
		else
		{
			this.listRender.addSelectedIndex(selected.length-1);
		}
		return this;
	},

	/**
	 * Selects next item from list
	 * @return {this}
	 */
	selectNextFromList : function()
	{
		var selected = this.listRender.getSelectedIndices(true);

		this.listRender.clearSelectedIndices();

		if (selected.length)
		{
			var toSelect = Math.min(this.listRender.datasource.length-1,selected[0]+1);
			this.listRender.addSelectedIndex(toSelect);
		}
		else
		{
			this.listRender.addSelectedIndex(0);
		}
		return this;
	},
	
	/**
	 * @return {Array} of selected keys 
	 */
	getSelectedKeys : function()
	{
		var keys = [];

		this.selectedIndices.each(this.getProxy(function(index,d)
		{
			var keyIndex = this.selectedIndices.getKeyByIndex(index);
			keys.push(this.indexDataMap[keyIndex][this.indexKey]);
		}));
	
		return keys;		
	},
	
	/**
	 * removes selected items
	 */
	removeSelectedItems : function()
	{
		var si = this.getSelectedItems();
		
		this.clearSelectedIndices();
		
		var i,len;
		for (i = 0, len = si.length; i < len; i++ )
		{
			var index = this.indexDataMap.indexOf(si[i]);
			this.indexDataMap.splice(index,1);
			this.removeItem(si[i],index);
		}
	},	
	
	/**
	 * @return {Array} of selected items
	 */
	getSelectedItems : function()
	{
		var items = [];

		this.selectedIndices.each(this.getProxy(function(index,d)
		{
			var keyIndex = this.selectedIndices.getKeyByIndex(index);
			items.push(this.indexDataMap[keyIndex]);
		}));
	
		return items;
	},
	
	/**
	 * adds an item to the datasource.
	 * if there is no datasource, we will set an empty datasource on the grid
	 * to make sure our items will get rendered
	 * @param {mixed} data
	 * @return {int} position of added item
	 */
	addItem : function(data)
	{
		var addedAt = 0;
			
		var gridRerender = false;
		
		if (!this.datasource)
		{
			//force the datagrid to rerender
			this.datagrid.setDataSource([]);		
		}
		else
		{
			addedAt = this.datasource.length;
		}
		
		this.datasource[addedAt] = data;
		this.indexDataMap[addedAt] = data;
		this.triggerEvent('dataSourceChanged');
		
		return addedAt;
	},
	
	/**
	 * @param {Object} data
	 */
	removeItem : function(data)
	{
		var match = null;
		
		var k,len;
		for (k =0, len = this.datasource.length; k < len; k++)
		{
			if(data[this.indexKey] === this.datasource[k][this.indexKey])
			{
				this.selectedIndices.remove(k);
				match = k;
			}
		}
		
		if (match !== null)
		{
			this.datasource.splice(match,1);
				
			this.triggerEvent('dataSourceChanged');
		}
		
		return match;
	},
	
	/**
	 * @param {Object} data
	 * @return {boolean} 
	 */
	hasItem : function(data)
	{
		for (k =0, len = this.datasource.length; k < len; k++)
		{
			if(data[this.indexKey] === this.datasource[k][this.indexKey])
			{
				return true;
			}
		}
		
		return false;
	},
	
	/**
	 * Removes all items from the list and clears selected indices
	 */
	removeAllItems : function()
	{
		this.datasource = [];
		this.selectedIndices.clear();
	},
	
	/**
	 * @abstract
	 * @ignore
	 */
	selectIndex : function(i){},

	/**
	 * @abstract
	 * @ignore
	 */
	deSelectIndex : function(i){},
	
	/**
	 * invoked after setting datasource
	 * @ignore
	 */
	createControls : function()
	{
		this.setupIndexing();
		
		var i,len;
		for (i =0, len = this.datasource.length; i < len; i++)
		{
			this.indexDataMap[i] = this.datasource[i];
		}
	},
	
	/**
	 * ensures item render from factory
	 * @return Banana.Controls.DatagridItemRender
	 */
	getObject : function(itemRender)
	{
		if (typeof(itemRender) === 'function')
		{
			itemRender = new itemRender();
		}

		return itemRender;
	}
});
