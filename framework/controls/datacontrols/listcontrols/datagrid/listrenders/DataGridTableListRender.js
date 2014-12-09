/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridDataTreeListRender  
 */

goog.require('Banana.Controls.DataGridBaseListRender');

goog.require('Banana.Controls.DataGridTableHeaderItemRender');
goog.require('Banana.Controls.DataGridTableContentItemRender');
goog.require('Banana.Controls.DataGridTableFooterItemRender');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridControlColumn');
goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridCharLimitColumn');
goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridImageButtonColumn');
goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridLinkColumn');
goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridImageColumn');
goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridStatusColumn');
goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridHeaderColumn');
goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridButtonColumn');

goog.provide('Banana.Controls.DataGridTableListRender');

/** @namespace Banana.Controls.DataGridTableListRender */
namespace('Banana.Controls').DataGridTableListRender = Banana.Controls.DataGridBaseListRender.extend(
/** @lends Banana.Controls.DataGridTableListRender.prototype */
{
	/**
	 * Creates a datagrid table list render. This is the most standard grid.
	 * Columns can be inserted 
	 * 
	 * bindable events
	 * 
	 *  - onRowCreated 
	 *  - onInitColumn //triggered during creation of the column
	 *  - datagridmouseover
	 *  - dataSourceChanged
	 *  - onItemSelect
	 *  - itemRenderChanged
	 * 
	 * Example:
	 * 
	 * 
		//specify the datasource we put inside the grid
		var datasource = [
		                  {'name':'a name','description':'a description'},
		                  {'name':'a name','description':'a description'},
		                  {'name':'a name','description':'a description'}
		                  ];
		
		//specify the columns
		var columns = [
		               new Banana.Controls.DataGridColumn().setHeaderText('name').setDataField('name'),
		               new Banana.Controls.DataGridColumn().setHeaderText('description').setDataField('description')
		               ]
		
		var datagrid = new Banana.Controls.DataGrid();
		datagrid.setDataSource(datasource);
		
		//by default we have a Banana.Controls.DataGridTableListRender inside the datagrid.
		var listRender = datagrid.getListRender();
		listRender.setColumns(columns);
			
		this.addControl(datagrid);	
	 * 
	 * By default the table list render contains a headerItemRender, itemRender and footerItemRender
	 * 
	 * @constructs
	 * @extends Banana.Controls.DataGridBaseListRender
	 */
	init : function()
	{
		this._super();
		
		this.addCssClass("BDataGridTableListRender")
		
		this.columns = [];
		this.indexRowMap = [];
		this.dataItemRenderMap = new Banana.Util.ArrayBiCollection(); //mapping of item renders to data
		
		this.defaultHeaderItemRender = Banana.Controls.DataGridTableHeaderItemRender;
		this.defaultContentItemRender = Banana.Controls.DataGridTableContentItemRender;
		this.defaultFooterItemRender = Banana.Controls.DataGridTableFooterItemRender;
		
		this.headerItemRender = null;
		this.contentItemRender = null;
		this.headerItemRender = null;
	},
	
	/**
	 * @param {mixed} data
	 * @param {Banana.Controls.DataGridTableItemRender} render
	 * 
	 * @return {int} position where item is inserted
	 */
	addItem : function(data,render)
	{	
		var il = this._super(data);
		
		if (render)
		{
			this.indexItemRenderFactory[il] = render; 
		}

		this.createRowByIndex(il,true);
		this.createItemRenderByIndex(il,true);
		
		return il;
	},
	
	/**
	 * removes item from list.
	 * @param {mixed} data
	 */
	removeItem : function(data)
	{
		var index = this._super(data);
		
		if (index >=0)
		{
			this.removeRowByIndex(index);
		}
	},
	
	/**
	 * clears complete list
	 */
	removeAllItems : function()
	{
		this._super();
		
		this.indexRowMap = [];
		this.indexItemRenderFactory = [];
		this.tableBody.clear();		
	},
	
	/**
	 * @return Banana.Controls.DataGridTableContentItemRender
	 */
	getDefaultItemRender : function()
	{
		return this.defaultContentItemRender;
	},
	
	/**
	 * @param {Banana.Controls.DataGridTableHeaderItemRender} r 
	 */
	setHeaderItemRender : function(r)
	{
		this.headerItemRender = r;
	},
	
	/**
	 * @return {Banana.Controls.DataGridTableHeaderItemRender}
	 */
	getHeaderItemRender : function(r)
	{
		return this.headerItemRender || this.defaultHeaderItemRender;
	},		
	
	/**
	 * sets item render on index
	 * 
	 * @param {int} index
	 * @param {String} render
	 * @param {boolean} dontCreate when true we do NOT instantly create the itemrender. use this when list is in prerender phase
	 * @param {boolean} ignoreDataItemRenderMap 
	 */
	setItemRenderByIndex : function(index,render,dontCreate,ignoreDataItemRenderMap)
	{
		this.indexItemRenderFactory[index] = render;
		
		//also save the item render data map relation
		//could be handy when we set an item render and later change the datasource
		//the item location could be changed then. itemrender - index relation is 
		//in that situation not enough
		if (!ignoreDataItemRenderMap && this.datasource[index])
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
			this.clearRowByIndex(index);
			this.createItemRenderByIndex(index,true);
			this.triggerEvent('itemRenderChanged');
		}		
	},
	
	/**
	 * sets an itemrender on given indices. 
	 * 
	 * @param {Array} indices
	 * @param {method} renderFactory
	 */
	setItemRenderByIndices : function(indices,renderFactory)
	{
		if (!indices)
		{
			return;
		}
		
		if (!indices instanceof Array)
		{
			log.error("Calling setItemRenderByIndices without indices specified in listrender "+this.id);
			return;
		}
		
		//if we set more than 4 item renders we rerender whole list once. otherwise per item
		//TODO could be smarter. like somekind of percentage of total list count
		var dontRenderPerItem = (indices.length > 4);
		
		for (var i = 0; i < indices.length; i++)
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
	 * sets an itemrender. Render will use for all indices the given itemrender
	 * 
	 * @param {Banana.Controls.DataGridTableItemRender} render
	 * @return {this}
	 */
	setItemRender : function(render)
	{
		//grid is not yet initialized. set itemrender as default
		if (!this.isInitialized)
		{
			this.defaultContentItemRender = render;
			return this;
		}
		
		this.dataItemRenderMap.clear(); 
		
		for (var j =0, clen = this.indexRenderedItemRenderMap.length; j < clen; j++)
		{	
			this.setItemRenderByIndex(j,render,true)
		}
			
		this.tableBody.clear();
		this.createTableParts();

		if (this.isRendered)
		{
			this.tableBody.invalidateDisplay();
		}
		this.triggerEvent('itemRenderChanged');
		
		return this;
	},	
	
	/**
	 * @return {boolean} true when given index and itemrender exists
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
	 * @param {Banana.Controls.DataGridTableFooterItemRender} r 
	 */
	setFooterItemRender : function(r)
	{
		this.footerItemRender = r;
	},	
	
	/**
	 * @return {Banana.Controls.DataGridTableFooterItemRender}
	 */
	getFooterItemRender : function()
	{
		return this.footerItemRender;
	},
	
	/**
	 * @param {Banana.Controls.ItemRender}
	 * @return {Banana.UiControl}
	 */
	getRowByItemRender : function(ir)
	{
		return this.getRowByIndex([this.indexRenderedItemRenderMap.indexOf(ir)]);
	},
	
	/**
	 * @param {int} index
	 * @return {Banana.Control.Panel}
	 */
	getRowByIndex : function(index)
	{
		return this.indexRowMap[index];
	},

	/**
	 * Removes complete row. New indices will be calculated for remaining rows
	 * 
	 * @param {int} index 
	 */
	removeRowByIndex : function(index)
	{
		this.indexRowMap[index].remove();
		
		this.selectedIndices.remove(i);
		this.indexRowMap.splice(index,1);
		this.indexItemRenderFactory.splice(index,1);
		this.indexRenderedItemRenderMap.splice(index,1);
	},

	/**
	 * @param {int} index of row to be cleared. all gui data inside will be removed
	 */
	clearRowByIndex : function(index)
	{
		this.indexRowMap[index].clear();
	},
	
	/**
	 * @return {int} index in list by given row
	 */
	getIndexByRow : function(row)
	{
		return this.indexRowMap.indexOf(row);
	},
	
	/**
	 * @return {int} index in list by given itemrender
	 */
	getIndexByItemRender : function(ir)
	{
		return this.indexRowMap.indexOf(ir.parent);
	},
	
	/**
	 * TODO:
	 * @ignore
	 */
	getItemRenderByData : function(data)
	{
		// TODO
	},
	
	/**
	 * Use this method to supply columns
	 * @param {Array} of new Banana.Controls.DataGridColumn
	 */
	setColumns : function(cols)
	{
		this.columns = cols;
	},
	
	/**
	 * start creation of controls here
	 * we also give the user possibility to to something with the columns by looping over it
	 * and trigger 'onInitColumn' even
	 * Previous selected items will be reselected
	 * @ignore
	 */
	createControls : function()
	{
		if (!this.columns || !this.columns.length)
		{
			log.warning("Unable to render grid "+this.id+". No columns specified");
		}
		
		for (var i=0; i<this.columns.length;i++)
		{
			this.triggerEvent('onInitColumn',this.columns[i]);
		}
			
		this.previousSelectedItems = this.getSelectedItems();

		this.selectedIndices.clear();
		this._super();
		
		this.table  = new Banana.Controls.Table();
		this.table.setAttribute('cellspacing','0');
		
		this.tableHead = new Banana.Controls.TableHead();
		this.tableHead.addCssClass("BDataGridTableListHead");
		this.table.addControl(this.tableHead);
		
		this.tableBody = new Banana.Controls.TableBody();
		this.tableBody.addCssClass("BDataGridTableListBody");
		this.table.addControl(this.tableBody);
		
		this.table.bind('mousedown',this.getProxy(function(e){
			// TODO: This is catching every event in the scope of the table
			// This should first check if user is clicking inside a input box
			// otherwise multiselects etc don't work
			if (e.originalEvent.shiftKey || e.originalEvent.ctrlKey)
			{
				e.preventDefault();
			}
		}))
		
		for (var j =0, clen = this.columns.length; j < clen; j++)
		{
			this.columns[j].setListRender(this);
		}
		
		this.createTableParts();
		
		this.addControl(this.table);	
		
		this.setSelectedItems(this.previousSelectedItems);
	},
	
	/**
	 * create the parts of the table here
	 * @ignore
	 */
	createTableParts : function()
	{	
		if (this.datasource.length)
		{
			this.createHeader();
			this.createRows();
			this.createFooter();
		}	
	},
	
	/**
	 * create header
	 * @ignore
	 */
	createHeader : function()
	{
		var row = new Banana.Controls.TableRow();

		var itemRender = this.getObject(this.getHeaderItemRender());
		itemRender.setListRender(this);
		
		row.addControl(itemRender);
		
		this.tableHead.addControl(row);		
	},
	
	/**
	 * create rows
	 * @ignore
	 */
	createRows : function()
	{
		//loop through the datasource to create the rows
		for (var i =0, len = this.datasource.length; i < len; i++)
		{
			this.createRowByIndex(i);
			this.createItemRenderByIndex(i)
		}		
	},
	
	/**
	 * create footer
	 * @ignore
	 */
	createFooter : function()
	{
		if (!this.getFooterItemRender()) return;
		
		var row = new Banana.Controls.TableRow();
		
		var itemRender = this.getObject(this.getFooterItemRender());
		itemRender.setListRender(this);	
		row.addControl(itemRender);
		
		this.tableBody.addControl(row);
	},
	
	/**
	 * 
	 * @param {int} index
	 * @param {boolean} instantRender when true we instantly render the row
	 * 
	 * @ignore
	 */
	createRowByIndex : function(index,instantRender)
	{
		var row = new Banana.Controls.TableRow();
		row.addCssClass((index % 2) ? 'BDataGridTableListRenderRow' : 'BDataGridTableListRenderRowAlt');			
		
		row.bind('mouseover',this.getProxy(function(e){this.onRowMouseOver(e)}),row);
		row.bind('mouseout',this.getProxy(function(e){this.onRowMouseOut(e)}),row);
		row.bind('click',this.getProxy(function(e){
			this.triggerEvent("onRowClicked",{"data":this.datasource[index],'index':index});
			this.onRowMouseClick(e)
		}),row);
			
		this.tableBody.addControl(row,instantRender);
		
		if (instantRender)
		{
			this.tableBody.invalidateDisplay();
		}	
		
		this.indexRowMap[index] = row;

		this.triggerEvent('onRowCreated', {'index':index,'row': row, 'data': this.datasource[index]});
	},
	
	/**
	 * creates item render by index
	 * 
	 * Item render will be either from 
	 *  - data to item render map
	 *  - index to item render map
	 *  - or default one
	 *  
	 *  used internally. don't call this manually.
	 *  
	 *  @param {int} index
	 *  @param {boolean} instantRerender when true we instantly rerender the item 
	 *  
	 *  @ignore
	 */
	createItemRenderByIndex : function(index,instantRerender)
	{
		// Optionally can be accessed by e.g. invalidateDisplay to peek
		// at which index it is created
		this.currentIndexCreation = index;
		var itemRenderFactory = null;
		
		if (this.datasource[index][this.indexKey] && this.dataItemRenderMap.getItem(this.datasource[index][this.indexKey]))
		{
			itemRenderFactory = this.dataItemRenderMap.getItem(this.datasource[index][this.indexKey]); 
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
			
			this.getDataSource()[parseInt(e.data)] = e.currentTarget.getData();
			this.triggerEvent('dataSourceChanged');
			
		}),index.toString())
		
		//save mapping between itemRender and data
		this.dataItemRenderMap.addItem(this.datasource[index][this.indexKey],itemRenderFactory);
		
		this.indexRenderedItemRenderMap[index] = itemRender;
		itemRender.setListRender(this);
		var row = this.indexRowMap[index];
		row.addControl(itemRender);
		
		if (instantRerender)
		{
			row.invalidateDisplay();
		}
		
		this.currentIndexCreation = undefined;
	},
	
	/**
	 * triggered when use moves over. we hightlight a row here
	 * 
	 * @param {event} e
	 * @ignore
	 */
	onRowMouseOver : function(e)
	{
		var index = this.indexRowMap.indexOf(e.data);

		var itemRender = this.indexRenderedItemRenderMap[index];
		
		if (!itemRender.getIsSelectable()) return;
		
		itemRender.mouseOver();
	},
	
	/**
	 * triggered when use moves outside
	 * 
	 * @param {event} e
	 * @ignore
	 */
	onRowMouseOut : function(e)
	{
		var index = this.indexRowMap.indexOf(e.data);
		
		var itemRender = this.indexRenderedItemRenderMap[index];
		
		if (!itemRender.getIsSelectable()) return;
		
		itemRender.mouseOut();
	},
	
	/**
	 * triggered when use moves outside
	 * if row is unselected we trigger event 'onItemSelect'
	 * 
	 * @param {event} e
	 * @ignore
	 */
	onRowMouseClick : function(e)
	{
		var index = this.indexRowMap.indexOf(e.data);

		var itemRender = this.indexRenderedItemRenderMap[index];
		
		if (!itemRender.getIsSelectable()) return;

		if (index<0) {return}

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
			if (this.selectionType == 'single')
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

					var firstItem = parseInt(this.selectedIndices.getKeyByIndex(0));

					if (!firstItem) firstItem = 0;

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
						end = parseInt(this.selectedIndices.getKeyByIndex([this.selectedIndices.getLength()-1]));
					}

					this.clearSelectedIndices();

					for (var i = parseInt(start); i <= parseInt(end); i++)
					{
						this.addSelectedIndex(i);
					}
				}

			}
		}	
		
		this.triggerEvent('onItemSelect');
	},
	
	/**
	 * Selects the index. also adds BDataGridRowSelected css class to the item render 
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
	 * Selects the index. also removes BDataGridRowSelected css class from the item render
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
