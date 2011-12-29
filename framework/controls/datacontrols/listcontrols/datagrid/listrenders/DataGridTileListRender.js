/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridDataTreeListRender  
 */

goog.require('Banana.Controls.DataGridBaseListRender');
goog.require('Banana.Controls.DataGridTileItemRender');

goog.provide('Banana.Controls.DataGridTileListRender');

/** @namespace Banana.Controls.DataGridTileListRender */
namespace('Banana.Controls').DataGridTileListRender = Banana.Controls.DataGridBaseListRender.extend(
/** @lends Banana.Controls.DataGridTileListRender.prototype */
{
	
	/**
	 * 
	 * Creates a datagrid tile list render. Each item in the datasource is a tile.
	 * Use setPlaceHolderWidth to have multiple tiles after each other. You can also define this in css
	 * By default each tile is rendered by a Banana.Controls.DataGridTileItemRender instance
	 * implement your own instance to construct more advanced item renders
	 *  
	 * example:
	 
	  //define our custom datagrid table item render
        myCustomItemRender = Banana.Controls.DataGridTableContentItemRender.extend({

			createComponents : function()
			{
				var label = new Banana.Controls.Panel();
				label.setData(this.getData().id);
				this.addControl(new Banana.Controls.Panel());
			}
		});
	 	
		grid = new Banana.Controls.DataGrid();
		
		var listRender = new Banana.Controls.DataGridTileListRender()
		listRender.setHItemCount(4);
		listRender.setTilePadding(6);
		
		//note that this method required you to pass a function providing the itemrender.
		listRender.setItemRender(function(){return new myCustomItemRender()});
		
		grid.setListRender(listRender);
		
		var content = [{id:1},{id:2}];	
		
		grid.setDataSource(content);	

		this.addControl(grid);	 
	 * 
	 * @constructs
	 * @extends Banana.Controls.DataGridBaseListRender
	 */
	init : function()
	{
		this._super();
		
		this.addCssClass("BDataGridTileListRender")
		
		this.indexKey = null; //specifies the indexkey used to indentify items
		
		this.indexTilePlaceHolderMap = [];
		this.indexItemRenderFactory = []; //this array consists out of factory's or strings
		this.dataItemRenderMap = new Banana.Util.ArrayBiCollection(); //mapping of item renders to data
		
		this.defaultContentItemRender = Banana.Controls.DataGridTileItemRender;
		
		this.contentItemRender = null;
	},
	
	/**
	 * Adds item
	 * 
	 * @param {mixed} data
	 * @param {Boolean} when true we instantly renders it
	 */
	addItem : function(data,render)
	{
		this.applyUid(data);
		
		var il = this._super(data);
		
		if (render)
		{
			this.indexItemRenderFactory[il] = render; 
		}
		
		this.clearSelectedIndices();
		
		this.createDivPlaceHolder(this.datasource.length-1,true); // -1 cause index start with 0
		this.createItemRenderByIndex(this.datasource.length-1,true);
			
		return il;
	},
	
	/**
	 * Adds item to the datasource. Results in rerender of the list
	 * 
	 * TODO: now every add results into instant render. we could optimize this
	 * by rendering everything at once.
	 * 
	 * @param {Array} items
	 */
	addItems : function(items)
	{
		var i;
		for (i=0, len= items.length; i < len; i++)
		{
			this.addItem(items[i]);
		}
	},
	
	/**
	 * At item at specific index. Results in rerender of the list
	 * 
	 * @param {Object} item
	 * @param {int} index
	 * @param {Banana.Controls.DataGridTileItemRender} render
	 * @param {Boolean} preventRender when true we wont render. useful whne adding multiple items at once
	 */
	addItemAt : function(item,index,render,preventRender)
	{
		this.applyUid(item);
				
		this.clearSelectedIndices();
		
		this.datasource.splice(index,0,item);
		this.indexDataMap.splice(index,0,item);
		
		if (render)
		{
			this.indexItemRenderFactory.splice(index,0,item);
		}
		
		//modify index helpers
		this.indexTilePlaceHolderMap.splice(index,0,null);
		this.indexItemRenderFactory.splice(index,0,null);
		this.indexRenderedItemRenderMap.splice(index,0,null);
		
		if (!preventRender)
		{
			this.setDataSource(this.datasource);
			this.triggerEvent('dataSourceChanged');
		}
	},
	
	/**
	 * At items at specific index. Results in rerender of the list
	 * 
	 * @param {Object} item
	 * @param {int} index
	 * @param {Banana.Controls.DataGridTileItemRender} render
	 */
	addItemsAt : function(items,index,render)
	{
		var i;
		for (i=0, len= items.length; i < len; i++)
		{
			this.addItemAt(items[i],index,render,true);
		}
		
		this.setDataSource(this.datasource); //force rerender
	},
	
	/**
	 * removes item if found in datasource
	 * @param {mixed} data
	 */
	removeItem : function(data)
	{
		var index = this.datasource.indexOf(data);
		
		if (index != -1)
		{
			this.removeItemRenderPlaceHolderByIndex(index);
		}
		this.removeItemRenderPlaceHolderByIndex(index);
	},
	
	/**
	 * removes item from datagrid based on itemrender instance.
	 * @param {Banana.Controls.DataGridTileItemRender} itemRender
	 */
	removeItemByItemRender : function(itemRender)
	{
		var index = this.indexRenderedItemRenderMap.indexOf(itemRender);
		
		this.removeItemRenderPlaceHolderByIndex(index);
	},
	
	/**
	 * FIXME
	 * @ignore
	 */
	removeAllItems : function()
	{
		this._super();
	},
	
	/**
	 * @return {Banana.Controls.DataGridTileItemRender}
	 */
	getDefaultItemRender : function()
	{
		return this.defaultContentItemRender;
	},
	
	/**
	 * Use this to change item render on a specific index.
	 * By default the list render will rerender the new item render
	 * 
	 * @param {int} index
	 * @param {String} render
	 * @param {Boolean} dontCreate
	 * @param {Boolean} ignoreDataItemRenderMap
	 */
	setItemRenderByIndex : function(index,render,dontCreate,ignoreDataItemRenderMap)
	{
		this.indexItemRenderFactory[index] = render;
		
		//also save the item render data map relation
		//could be handy when we set an item render and later change the datasource
		//the item location could be changed then. itemrender - index relation is 
		//in that situation not enough
		if (!ignoreDataItemRenderMap && this.datasource && this.datasource[index])
		{
			//TODO this is the only place a mapping between data and render is set.
			//this should also be possible at a later moment.
			if (this.datasource[index][this.indexKey])
			{
				this.dataItemRenderMap.addItem(this.datasource[index][this.indexKey],render);
			}
		}
		
		if (!dontCreate)
		{
			this.clearItemRenderPlaceHolderByIndex(index);
			this.createItemRenderByIndex(index,true);
			//TODO only trigger when changed
			this.triggerEvent('itemRenderChanged');
		}		
	},
	
	/**
	 * Sets item renders on multi indices at once.
	 * 
	 * @param {Array} indices
	 * @param {Function} renderFactory of Banana.Controls.DataGridTileItemRender
	 */
	setItemRenderByIndices : function(indices,renderFactory)
	{
		if (!indices.length)
		{
			return;
		}
		
		//if we set more than 4 item renders we rerender whole list once. otherwise per item
		//TODO could be smarter. like somekind of percentage of total list count
		var dontRenderPerItem = (indices.length > 4);

		var i;
		for (i = 0; i < indices.length; i++)
		{
			this.setItemRenderByIndex(indices[i],renderFactory,dontRenderPerItem);
		}
	
		if (dontRenderPerItem)
		{
			this.triggerEvent('itemRenderChanged');
			this.rerender();
		}
	},	
	
	/**
	 * Set the global item render for this list render.
	 * @param {Banana.Controls.DataGridTileItemRender} itemRender
	 */
	setItemRender : function(render)
	{
		//we set in general the item render. so we need to get rid of 
		//the data item render map.
		this.dataItemRenderMap.clear(); 

		var j;
		for (j =0, clen = this.indexRenderedItemRenderMap.length; j < clen; j++)
		{	
			this.setItemRenderByIndex(j,render,true);
		}
		
		if (this.mainContainer)
		{
			this.mainContainer.clear();
			this.createItems();
			
			if (this.isRendered)
			{
				this.mainContainer.invalidateDisplay();
			}
		}
		else
		{
			this.defaultContentItemRender = render;
		}
	
		this.triggerEvent('itemRenderChanged');
	},	
	
	/**
	 * Rerenders item render by index. 
	 * @param {int} index
	 */
	rerenderIndex : function(index)
	{
		this.previousSelectedItems = this.getSelectedItems();
		this.indexTilePlaceHolderMap[index].clear();
		this.createItemRenderByIndex(index,true);
		this.setSelectedItems(this.previousSelectedItems);
	},
	
	/**
	 * gets rendered item render by data
	 * @param {Object} data
	 * @return {Banana.Controls.ItemRender}
	 * 
	 * @ignore
	 */
	getRenderedItemRenderByData : function(data)
	{
		//TODO we have no effective index from data to index.
	},
	
	/**
	 * @param {int} int
	 * @param {Banana.Controls.ItemRender} itemRender
	 * @return {boolean} 
	 */
	hasItemRenderAt : function(index,itemRender)
	{
		if (this.indexRenderedItemRenderMap[index] instanceof itemRender)
		{
			return true;
		}
		
		return false;
	},
	
	/**
	 * removes a placeholder by index
	 * 
	 * @param {int} index
	 */
	removeItemRenderPlaceHolderByIndex : function(index)
	{
		this.datasource.splice(index,1);
		
		this.indexTilePlaceHolderMap[index].remove();
		
		this.selectedIndices.remove(i);
		this.indexTilePlaceHolderMap.splice(index,1);
		this.indexItemRenderFactory.splice(index,1);
		this.indexRenderedItemRenderMap.splice(index,1);
		
		this.triggerEvent('dataSourceChanged');
	},

	/**
	 * Empties placeholder by index
	 */
	clearItemRenderPlaceHolderByIndex : function(index)
	{
		this.indexTilePlaceHolderMap[index].clear();
	},
	
	/**
	 * @return {int}
	 */
	getIndexByItemRenderPlaceHolder : function(row)
	{
		return this.indexTilePlaceHolderMap.indexOf(row);
	},
	
	/**
	 * @param {int}
	 * @return {Banana.UiControl}
	 */
	getItemRenderPlaceHolderByIndex : function(index)
	{
		return this.indexTilePlaceHolderMap[index];
	},

	/**
	 * @param {Banana.Controls.ItemRender}
	 * @return {Banana.UiControl}
	 */
	getItemRenderPlaceHolderByItemRender : function(ir)
	{
		return this.indexTilePlaceHolderMap[this.indexRenderedItemRenderMap.indexOf(ir)];
	},
	
	/**
	 * @return {int}
	 */
	getIndexByItemRender : function(ir)
	{
		return this.indexTilePlaceHolderMap.indexOf(ir.parent);
	},
	
	/**
	 * Invoked after changing datasource or invalidating 
	 * @ignore
	 */
	createControls : function()
	{
		this.setupIndexing();
		
		this.previousSelectedItems = this.getSelectedItems();
		
		this.selectedIndices.clear();
		this._super();
		
		this.mainContainer = new Banana.Controls.Panel();
	
		this.mainContainer.bind('mousedown',this.getProxy(function(e){
			// TODO: This is catching every event in the scope of the table
			// This should first check if user is clicking inside a input box
			// otherwise multiselects etc don't work
			if (e.originalEvent.shiftKey || e.originalEvent.ctrlKey)
			{
				e.preventDefault();
			}
		}));
		
		//FIXME this is not needed anymore?
		
		//if we gave a horizontal item count. only render when already rendered
		this.createItemsLater = false;
		
		if (this.horizontalItemCount && this.isRendered)
		{
			this.createItems();
		}
		else if (this.horizontalItemCount && !this.isRendered)
		{
			this.createItemsLater = true;
		}
		else
		{
			this.createItems();
		}
		
		this.addControl(this.mainContainer);	
		
		this.setSelectedItems(this.previousSelectedItems);
		
	},
	
	/**
	 * @ignore
	 */
	updateDisplay : function()
	{
		if (this.createItemsLater && this.getDemensions().width)
		{
			this.createItemsLater = false;
			this.createItems();
			
			this.mainContainer.invalidateDisplay();
		}
	},
	
	/**
	 * @ignore
	 */
	createItems : function()
	{
		if (this.datasource.length)
		{
			var i;
			for (i =0, len = this.datasource.length; i < len; i++)
			{
				this.applyUid(this.datasource[i]);
				
				this.createDivPlaceHolder(i);
				this.triggerEvent('onPreCreateItemRender',{'index':i,'data':this.datasource[i]});
				this.createItemRenderByIndex(i);
			}
			
			this.mainContainer.addControl("<div style='clear:both'></div>");
			this.cachedDemensions = null; //clear cache
		}	
	},
	
	/**
	 * @depricated
	 */
	setHorizontalTileCount : function(count)
	{
		log.warning("set horizontalTileCount datagridTileListRender is depricated. use setPlaceHolderWidth instead");	
		return this;
	},
	
	/**
	 * @depricated
	 */
	setTilePadding : function(padding)
	{
		log.warning("set tile padding in datagridTileListRender is depricated. apply style manualy in css");
		return this;
	},
	
	/**
	 * Creates a placeholder where itemrenders are rendered in
	 * 
	 * @param {int} int
	 * @param {Boolean} instantRender
	 * @ignore
	 */
	createDivPlaceHolder : function(index,instantRender)
	{	
		var tileplaceholder = new Banana.Controls.Panel();
		tileplaceholder.addCssClass("BDataGridTilePlaceHolder");
		
		if (this.placeHolderWidth)
		{
			tileplaceholder.setCss({width:this.placeHolderWidth});
		}

		tileplaceholder.bind('mouseenter',this.getProxy(function(e){this.onRowMouseOver(e); return true;}),tileplaceholder);
		tileplaceholder.bind('mouseleave',this.getProxy(function(e){this.onRowMouseOut(e);return true;}),tileplaceholder);
		tileplaceholder.bind('click',this.getProxy(function(e){this.onRowMouseClick(e);return true;}),tileplaceholder);
			
		this.mainContainer.addControl(tileplaceholder,instantRender);
		
		if (instantRender)
		{
			this.mainContainer.invalidateDisplay();
		}	
		this.indexTilePlaceHolderMap[index] = tileplaceholder;	
	},

	/**
	 * sets width of the placeholder. example "25%" or "50px" 
	 * @param {String} width
	 */
	setPlaceHolderWidth : function(width)
	{
		this.placeHolderWidth = width;
	},
	
	/**
	 * creates item render by index
	 * 
	 * Item render will be either from 
	 *  - data to item render map
	 *  - index to item render map
	 *  - or default one
	 *  
	 *  dont directly use this method. The item render is rendered into a 
	 *  placeholder which doesnt gets cleared here. 
	 *  to recreate a itemrender use rerenderIndex()
	 *  
	 *  @param {int} index
	 *  @param {boolean} instantRerender when true we directly render it
	 *  @ignore
	 */
	createItemRenderByIndex : function(index,instantRerender)
	{
		// Optionally can be accessed by e.g. invalidateDisplay to peek
		// at which index it is created
		this.currentIndexCreation = index;
		
		var itemRenderFactory = null;
		
		var key = this.datasource[index][this.indexKey];
		
		if (key  && this.dataItemRenderMap.getItem(key))
		{
			itemRenderFactory = this.dataItemRenderMap.getItem(key); 
		}
		else if (this.indexItemRenderFactory[index])
		{
			itemRenderFactory = this.indexItemRenderFactory[index];
		}
		else
		{
			itemRenderFactory = this.defaultContentItemRender;
		}
		
		var itemRender = this.getObject(itemRenderFactory);

		itemRender.setData(this.datasource[index]);

		itemRender.bind('dataChanged',this.getProxy(function(e,f){
			
			this.getDataSource()[parseInt(e.data, 10)] = e.currentTarget.getData();
			this.triggerEvent('dataSourceChanged');
			
		}),index.toString());
		
		//save mapping between itemRender and data
		this.dataItemRenderMap.addItem(this.datasource[index][this.indexKey],itemRenderFactory);
		
		this.indexRenderedItemRenderMap[index] = itemRender;
		itemRender.setListRender(this);
		var tilePlaceHolder = this.indexTilePlaceHolderMap[index];
		tilePlaceHolder.addControl(itemRender);
		
		if (instantRerender)
		{
			tilePlaceHolder.invalidateDisplay();
		}
		
		this.currentIndexCreation = undefined;
	},
	
	/**
	 * invoked after hovering over a tile
	 * @ignore
	 */
	onRowMouseOver : function(e)
	{
		var index = this.indexTilePlaceHolderMap.indexOf(e.data);

		var itemRender = this.indexRenderedItemRenderMap[index];
		
		itemRender.mouseOver();
	},
	
	/**
	 * invoked after mouse moves out of a tile
	 * @ignore
	 */
	onRowMouseOut : function(e)
	{
		var index = this.indexTilePlaceHolderMap.indexOf(e.data);
		
		var itemRender = this.indexRenderedItemRenderMap[index];
		
		itemRender.mouseOut();
	},
	
	/**
	 * invoked after clicking on a row/tile
	 * @ignore
	 */
	onRowMouseClick : function(e)
	{
		var index = this.indexTilePlaceHolderMap.indexOf(e.data);

		var itemRender = this.indexRenderedItemRenderMap[index];
		
		if (!itemRender.getIsSelectable())
		{
			return;
		}

		if (index<0)
		{
			return;
		}

		var ctrlKey = e.ctrlKey;
		var shiftKey = e.shiftKey;

		if (this.getIndexIsSelected(index))
		{
			if (!ctrlKey && !shiftKey)
			{
				this.clearSelectedIndices();
			}
			else
			{
				this.clearSelectedIndex(index);
			}
		}
		else
		{
			if (this.selectionType === 'single')
			{
				this.clearSelectedIndices();
				this.addSelectedIndex(index);
			}
			else
			{
				if (!ctrlKey && !shiftKey)
				{
					this.clearSelectedIndices();
					this.addSelectedIndex(index);
				}
				if (ctrlKey)
				{
					this.addSelectedIndex(index);
				}
				if (shiftKey)
				{

					var firstItem = parseInt(this.selectedIndices.getKeyByIndex(0), 10);

					if (!firstItem)
					{
						firstItem = 0;
					}

					var start;
					var end;
					if (index > firstItem)
					{
						start = firstItem;
						end = index;
					}
					else
					{
						start = index;
						end = parseInt(this.selectedIndices.getKeyByIndex([this.selectedIndices.getLength()-1]), 10);
					}

					this.clearSelectedIndices();

					var i;
					for (i = parseInt(start, 10); i <= parseInt(end, 10); i++)
					{
						this.addSelectedIndex(i);
					}
				}

			}
		}	
		
		this.triggerEvent('onItemSelect');
	},
	
	/**
	 * Selects the index.  
	 * 
	 * @param {int} index
	 */
	selectIndex : function(index)
	{
		var ir = this.getRenderedItemRenderByIndex(index);

		if (ir && typeof(ir.select) == 'function' && ir.getIsSelectable())
		{
			ir.select();
		}
	},

	/**
	 * Selects the index.
	 * 
	 * @param {int} index
	 */
	deSelectIndex : function(index)
	{
		var ir = this.getRenderedItemRenderByIndex(index);

		if (ir && typeof(ir.deselect) == 'function')
		{
			ir.deselect();
		}
	}
	
}); 