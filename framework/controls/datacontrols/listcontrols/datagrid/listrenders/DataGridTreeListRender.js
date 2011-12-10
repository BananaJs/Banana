/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridDataTreeListRender  
 */

goog.provide('Banana.Controls.DataGridTreeListRender');

goog.require('Banana.Controls.DataGridTreeListHolder');
goog.require('Banana.Controls.DataGridTreeListNodeToggle');
goog.require('Banana.Controls.DataGridTreeItemRender');

/** @namespace Banana.Controls.DataGridTreeListRender */
namespace('Banana.Controls').DataGridTreeListRender = Banana.Controls.DataGridBaseListRender.extend(
/** @lends Banana.Controls.DataGridTreeListRender.prototype */
{	
	/**
	 * Create a datagrid tree list render. a tree is a consists out of nodes with optional child nodes
	 * For each node the list creates a node info object with various node state parameters.
	 * 
	 * bindable events
	 * 
	 * - dataSourceChanged
	 * - onRequestChilds
     * - onItemOpened
	 * - onItemClosed
	 * - onPreCreateItem
	 * - onPostCreateIndex
	 * - onItemMouseClick
	 * - onItemMouseOut
	 * - onItemMouseEnter
	 * - onSelectIndex
	 * - onDeselectIndex
	 * - onItemSelect
	 * 
	 * example

	 	//make some datasource
	 	var datasource =[]; 
		
		var s1 = {'name':'s1','children':[]};
		var s2 = {'name':'s2','children':[]};
		var s3 = {'name':'s3','children':[]};
		var s4 = {'name':'s4','children':[]};
		var s5 = {'name':'s5','children':[]};
		var s6 = {'name':'s6','children':[]};
		
		root.push(s1);
		root.push(s2);
		root.push(s3);
		
		s1.children.push(s4);
		s1.children.push(s5);		
		s4.children.push(s6);

		var list = new Banana.Controls.DataGrid();

		var listRender = new Banana.Controls.DataGridDataTreeListRender();
		listRender.setChildProperty("children");
		listRender.setDefaultOpen(true);
		
		listRender.bind('selectIndex',this.getProxy(function(e,index){
			listRender.selectAllFromIndex(index)
		}));
		
		listRender.setSortfunction(function(a,b)
		{ 
			return a.name.toString().toLowerCase().localeCompare(b.name.toString().toLowerCase())
		});
		
		list.setListRender(listRender);		
	
		list.setDataSource(datasource);
	
		listRender.bind('dataSourceChanged',this.getProxy(function(){
			
			this.dataChanged = true;
		}));
		
		listRender.bind('dataChanged',this.getProxy(function(){
			
		}));
	
		this.addControl(list);			
	 
	 * @constructs
	 * @extends Banana.Controls.DataGridBaseListRender
	 */
	init : function()
	{
		this._super();
		
		this.indexKey = null;
		this.nodeData = []; //mapping between index key and nodeinfo
		//this.debug = true;
		
		this.columns = [];
		this.indexItemRenderFactory = []; //this array consists out of factory's or strings
		this.dataItemRenderMap = new Banana.Util.ArrayBiCollection(); //mapping of item renders to data
		this.keyDataIndex = []; //mapping between key and datasource
		this.dataKeyIndex = []; //mapping between data key and index
		this.indexHolderMap = [];
		this.indexOrder = [];
		
		//default sort function
		this.sortFunc = this.getProxy(function(a,b)
		{
			return a[this.indexKey].toString().toLowerCase().localeCompare(b[this.indexKey].toString().toLowerCase());
		});
		
		this.childRequestSizeLimit = 20;
		this.childKey = 'children';
		this.rootNodeVisible = true;
		this.defaultContentItemRender = Banana.Controls.DataGridTreeItemRender;		
	},
	
	/**
	 * @param {Banana.Controls.TreeItemRender} render
	 */
	setDefaultItemRender : function(render)
	{
		this.defaultContentItemRender = render;
	},
	
	/**
	 * sets item render on index
	 * @param {int} index
	 * @param {Banana.Controls.TreeItemRender} ir
	 * @return {this}
	 */
	setIndexItemRender : function(index,ir)
	{
		if (!(typeof(ir) === 'function'))
		{
			throw "Item render should be a factory";
		}
		this.indexItemRenderFactory[index] = ir;
		
		return this;
	},
	
	/**
	 * By default only the root nodes are opened.
	 * if you want to have all nodes opened by default, call this method
	 * 
	 * @Param {boolean} bool
	 * @return {this}
	 */
	setDefaultOpen : function(bool)
	{
		this.defaultOpen = bool;
		return this;
	},
		
	/**
	 * @param {String} messsage
	 */
	toLogger : function()
	{
		if (!this.debug)
		{
			return;
		}
		console.log(arguments);
	},
	
	/**
	 * sort function which is used to order nodes per node level
	 * @param {Object} sf
	 * @return {this}
	 */
	setSortfunction : function(sf)
	{
		this.sortFunc = sf;
		return this;
	},
	
	/**
	 * use this method to determine if a node should have auto width (fits the content inside the node)
	 * or maximum width (fits the grid container) 
	 * We compute the width of each node and thus a small performance loss. 
	 * @param {boolean} bool
	 * @return {this}
	 */
	setMaximizeNodeWidth : function(bool)
	{
		this.maximizeNodeWidth = bool;
		return this;
	},
	
	/**
	 * Specify which property contain the childs
	 * @param {String} ck
	 * @return {this}
	 */
	setChildProperty : function(ck)
	{
		this.childKey = ck;
		return this;
	},
	
	/**
	 * sets child size request limit
	 * use this when loading from external resources is needed
	 * 
	 * @param {int} limit
	 * @return {this}
	 */
	setChildRequestSizeLimit : function(limit)
	{
		this.childRequestSizeLimit = limit;
		return this;
	},
	
	/**
	 * gives true when item is found by given index key
	 * use this function to ensure uniquality
	 * @param key
	 * @return {Boolean}
	 */
	hasItemIndexKey : function(key)
	{
		return this.keyDataIndex[key] ? true : false;
	},

	/**
	 * always returns a source, when invalid key is given we return the root one
	 * 
	 * @return {Object}
	 */
	getDataSourceByKey : function(key)
	{
		var source = this.keyDataIndex[key];
		
		if (!source) //we are adding to root
		{
			source = this.getDataSourceByIndex(0);
		}
		
		return source;
	},

	/**
	 * @param {Object} ds
	 * @return {Data}
	 */
	getNodeDataByData : function(data)
	{
		return this.nodeData[data[this.indexKey]];
	},
	
	/**
	 * Ensures data. Needed if items are added to an empty datasource
	 * 
	 * @ignore
	 */
	ensureRootData : function()
	{
		if (!this.rootData)
		{
			this.setupIndexing();
			
			var root = {};
			root[this.indexKey] = this.getUid();
			root[this.childKey] = this.datasource;
			this.rootData = root;
			
			var nodeData = {};
			nodeData.addedChildren = [];
			nodeData.isRoot = true;
			nodeData.open = true;
			
			this.setNodeDataByData(nodeData,root);
		}
	},
	
	/**
	 * Sets node data
	 * @param {Object} nodeData
	 */
	setNodeData : function(nodeData)
	{	
		this.ensureRootData();
		
		this.setNodeDataByData(nodeData,this.rootData);
	},
	
	/**
	 * gets node data from root
	 * @return {Object}
	 */
	getNodeData : function()
	{
		return this.getNodeDataByData(this.rootData);
	},

	/**
	 * @param {Object} data
	 * @param {Object} source
	 */
	setNodeDataByData : function(data,source)
	{
		if(!source)
		{
			key = '__root__';
		}
		else
		{
			this.applyUid(source);
			var key = source[this.indexKey];
		}
		
		this.nodeData[key] = data;
	},

	/**
	 * return {Banana.Controls.UiControl)
	 */
	getRenderedItemRenderByData : function(data)
	{
		var nodeData = this.getNodeDataByData(data);

		if (!nodeData)
		{
			return null;
		}
		return this.getRenderedItemRenderByIndex(nodeData.index);
	},

	/**
	 * We assume we can reach the data. this assumtion is made already
	 * in the create controls method
	 * 
	 * TODO: we are using this method a lot and it is slow. make is quicker by caching
	 * but watch out. the index datasource mapping relation is changed a lot also
	 * 
	 * @param {int} i
	 * @return {Object} 
	 */
	getDataSourceByIndex : function(i)
	{
		i = i.toString();
		var split = i.split("-");
		var result = null;
		var datasource = this.datasource;

		var x;
		for (x = 0; x< split.length; x++)
		{
			result = datasource[split[x]];
			var key = result[this.indexKey];

			//if no node info available then break out. we dont have childs
			if (!result || !this.nodeData[key])
			{
				break;
			}
			
			datasource = result[this.childKey];
			
			if (!datasource)
			{
				break;
			}
		}

		return result;
	},
	
	/**
	 * @param {Array} datasource
	 * @return {int} index
	 */
	getIndexByDataSource : function(datasource)
	{
		return this.dataKeyIndex[datasource[this.indexKey]];		
	},
	
	/**
	 * @param {int} i 
	 * @return {String} parent index
	 * 
	 * TODO: we are using this method a lot and it is slow. make it quicker by caching
	 */
	getParentIndex :function(i)
	{
		var split = i.toString().split("-");
		split.pop();
		
		if (split.length)
		{
			return split.join('-');
		}
		
		return null;
	},
	
	/**
	 * @param {String} i index
	 * 
	 * @return {Banana.Controls.DataGridTreeListHolder}
	 */
	getHolder : function(i)
	{
		return this.indexHolderMap[i];
	},
	
	/**
	 * @param {String} i index
	 * @return {Banana.Controls.DataGridTreeListHolder}
	 * 
	 * @ignore
	 */
	getParentHolder: function(i)
	{
		var parentIndex = this.getParentIndex(i);
		
		if (parentIndex)
		{
			return this.indexHolderMap[parentIndex];
		}
		
		return null;
	},

	/**
	 * called by constructor. creation of controls is starting here
	 * @ignore
	 */
	createControls : function()
	{
		try
		{
			this.setupIndexing();
			
			this.ensureRootData();
			
			var nodeData = this.getNodeDataByData(this.nodeData);
			
			this.rootData[this.childKey] = this.datasource;
			
			this.datasource = [this.rootData];
			
			this.toLogger("create Controls",this.datasource);

			this.toLogger("determined key index as",this.indexKey);

			this.bind('mousedown',this.getProxy(function(e){
				// TODO: This is catching every event in the scope of the table
				// This should first check if user is clicking inside a input box
				// otherwise multiselects etc don't work
				if (e.originalEvent.shiftKey || e.originalEvent.ctrlKey)
				{
					e.preventDefault();
				}
				else
				{
					//this.clearSelectedIndices();
				}
			}));

		this.createNodeInfo(this.datasource,null,this.getProxy(function(item){

				if (this.defaultOpen)
				{
					this.nodeData[item[this.indexKey]].open = true;
				}
			}));

			this.createNodes();

			this.restoreSelectedIndices();
			this.addControl('<div style="clear:both"></div>');
		}
		catch(e)
		{
			console.log(e)
		}
	},

	/**
	 * TODO selected indices should be saved in nodedata
	 * now its seperated
	 */
	restoreSelectedIndices : function()
	{
		var i=0;
		var len;
		var indices = this.getSelectedIndices(true);

		for (i = 0,len = indices.length; i < len; i++)
		{
			var ir = this.getRenderedItemRenderByIndex(indices[i]);

			if (!ir)
			{
				continue;
			}

			ir.select();
		}
	},

	/**
	 * inserts recursively info to datasource items.
	 * this method should always be called after node modification(s)
	 * 
	 * @param {object} datasource
	 * @param {int} parentIndex
	 * @param {Object} func function which get applied on every item
	 * 
	 */
	createNodeInfo : function(datasource,parentIndex,func)
	{
		//sort first if sort method is supplied
		if (this.sortFunc)
		{
			datasource.sort(this.sortFunc);
		}
				 
		var i, len;
		for (i = 0, len = datasource.length; i < len; i++)
		{
			var part = datasource[i];
						
			this.applyUid(part);

			var key = part[this.indexKey];

			this.toLogger("create nodeinfo for key ",key,this.indexKey);
			if (!this.nodeData[key])
			{
				this.nodeData[key] = [];
			}
			
			//if function is supplied
			if (typeof(func) === 'function')
			{
				func(part);
			}
			
			if (!this.nodeData[key].addedChildren)
			{
				this.nodeData[key].addedChildren = [];
			}
			
			if (parentIndex !== null && parentIndex !== undefined)
			{
				currentIndex = parentIndex+"-"+i;
				this.nodeData[key].hasParent = true;

				if (parentIndex.toString().split('-').length === 1)
				{
					this.nodeData[key].parentIsRoot = true;
				}
			}
			else
			{
				currentIndex = i;
				this.nodeData[key].hasParent = false;
			}
								
			this.keyDataIndex[part[this.indexKey]] = part;
			
			//this temp var is set when we have deleted an item
			//we need to reindex the index holder mapping. thats why we saved the old
			//scenario to keep a reference 
			if (this.tempIndexHolderMap)
			{
				var oldHolderIndex = this.tempIndexHolderMap[this.nodeData[key].index];

				if (oldHolderIndex)
				{
					this.indexHolderMap[currentIndex] = oldHolderIndex;
				}
			}
			
			this.indexOrder.push(currentIndex);
			this.indexDataMap[currentIndex] = part;
					
			this.dataKeyIndex[part[this.indexKey]] = currentIndex;

			this.nodeData[key].index = currentIndex; 
			
			if (part[this.childKey] && part[this.childKey].length)
			{
				this.toLogger(key,"has childs on",this.childKey," default open = ",this.defaultOpen);
				this.nodeData[key].hasChilds = true;
				this.nodeData[key].childProperty = this.childKey;
				
				if (!this.nodeData[key].hasParent || (this.nodeData[key].open || (this.nodeData[key].open == undefined && this.defaultOpen)))
				{
					this.createNodeInfo(part[this.childKey],currentIndex,func);
				}
			}
			else
			{
				delete this.nodeData[key].childProperty;
				this.nodeData[key].hasChilds = false;
			}
		}
	},
		
	/**
	 * create nodes and child nodes if they exist.
	 * 
	 * @param {Array} datasource nodes
	 * @param {String} parentIndex
	 * 
	 * @ignore
	 */
	createNodes : function(datasource,parentIndex)
	{
		///we are starting at root
		if (!datasource)
		{	
			datasource = this.datasource;
			parentIndex = null;
		}

		var i, len;
		for (i =0, len = datasource.length; i < len; i++)
		{
			var ds = datasource[i];
			var key = ds[this.indexKey];
			var nodeData = this.nodeData[key];
			
			this.toLogger("create node from ",key,ds,"with child property ",nodeData);
			if (typeof(ds) === 'function')
			{
				continue;
			}
			
			this.createItemRenderByIndex(nodeData.index);

			if (nodeData && typeof(ds[nodeData.childProperty]) === 'object' && ds[nodeData.childProperty].length)
			{
				if (nodeData.open)
				{
					this.createNodes(ds[nodeData.childProperty],currentIndex);
				}	
			}
			this.determineLoadNextButton(nodeData.index);		
		}

		this.toLogger("create node complete");
	},

	/**
	 * @param {Object} item
	 */
	addItem : function(item)
	{
		//if no datasource exist we create a dummy where we insert the item
		if (!this.datasource || !this.datasource.length)
		{
			this.setupIndexing();
			this.toLogger("add item as dummy ",this.indexKey,item,this.datasource);
			var dummynode = {};
			dummynode[this.childKey] = [item];
			dummynode.nodeinfo = {};
			dummynode.nodeinfo.childProperty = this.childKey;
			dummynode.nodeinfo.open = true;
			dummynode.hide = false;
			dummynode[this.indexKey] = "root";

			this.datagrid.setDataSource([dummynode]);
		}
		else 
		{
			source = this.datasource[this.datasource.length-1];
			this.addDataSource(source,item,true);
		}
	},

	/**
	 * 
	 */
	removeSelectedItems : function()
	{
		this._super();
		if (!this.datasource
		|| !this.datasource.length
		|| !this.datasource[0][this.childKey]
		|| !this.datasource[0][this.childKey].length)
		{
			this.datagrid.setDataSource([]);
		}
	},
	
	/**
	 * 
	 * How are we adding new data?
	 * Every node in our tree got a nodeinfo object with params. The following params are
	 * important for this function
	 * 
	 * nodeinfo.addedChildren -> children added which are not in the regular child collection
	 * nodeinfo.childCount -> the initial child collection child. this is without the nodeinfo.addedChildren
	 * 
	 * If we add new data with the instant boolean to false we add the children 
	 * to the nodeinfo.addedChildren array. When we receive new data later we check if 
	 * children exists in the addedChildren array. If yes we remove it from addedChildren 
	 * and increment the nodeinfo.childcount. This is useful to determine paging/loadnext buttons
	 * If the instant boolean is true we just add the children to the regular children
	 * 
	 * Note: children are always compared to children in nodeinfo.addedChildren. 
	 * 
	 * use the instant boolean when you know for sure that the addedDatasource consists out of new items
	 * use false if there might be children which are already in the list
	 * 
	 * @param {mixed} source to add items on
	 * @param {Array} targetItems
	 * @param {boolean} instant when true we instantly render the new items
	 */
	addDataSource : function(source,targetItems,instant)
	{
		try
		{
		if (!source && (!this.datasource || !this.datasource.length))
		{
			this.createRootNode();
			return this.addDataSource(null,targetItems,instant);
		}
		else if (!source)
		{
			source = this.datasource[0];
			this.toLogger("addDatasource no source, pick",source)
		}
		
		if (!source[this.childKey])
		{
			source[this.childKey] = [];
		}
		
		if (!(targetItems instanceof Array))
		{
			targetItems = [targetItems];
		}

		var nodeData = this.getNodeDataByData(source);
		var childsToAdd = 0;
		var offset= source[this.childKey].length-nodeData.addedChildren.length-1;

		
		var i, len;
		for (i = 0, len = targetItems.length; i< len;i++)
		{
			var target = targetItems[i];

			this.toLogger("addDataSource",target,this.indexKey);
			
			var index = this.keyDataIndex[target[this.indexKey]];
			
			this.toLogger("addDataSource",'use index',index); 
					
			if (index !== undefined)
			{
				this.toLogger('found existing remove from added, and add childcount');
				var childFoundIndex = nodeData.addedChildren.indexOf(index);
				
				if (childFoundIndex >=0)
				{
					nodeData.addedChildren.splice(nodeData.addedChildren.indexOf(childFoundIndex,1));
					childsToAdd++; 
					continue;
				}
			}
		
			if (!instant)
			{ 
				nodeData.addedChildren.push(target);
			}
			
			if (this.sortFunc && source[this.childKey][offset])
			{
				var sortResult = this.sortFunc(target,source[this.childKey][offset]);
				this.toLogger('sort result of '+target.name+' and '+source[this.childKey][offset].name+' ',sortResult);
				if (sortResult < 0)
				{
					this.toLogger('remove '+target.name+' from addedChildren, we are before the last one');
					nodeData.addedChildren.splice(nodeData.addedChildren.indexOf(target),1);
					childsToAdd++;
				}
			}
			
			source[this.childKey].push(target);
		}
		
		this.toLogger('add ',childsToAdd);
		nodeData.childCount+=childsToAdd;
		
		this.prepareSourceToRender(source);
		}
		catch(e)
		{
			console.log(e)
		}
	},
	
	/**
	 * Creates a root node
	 * @param {mixed} source
	 * @ignore
	 */
	createRootNode : function(source)
	{
		var root = {};
		root[this.childKey]= [];
		root.nodeinfo = [];
		root.open = true;

		if (!this.datasource)
		{
			this.datasource = [];
		}
		
		this.datasource.push(root);

		this.triggerEvent('dataSourceChanged');
		this.setDataSource(this.datasource);
	},
	
	/**
	 * @param {Object} source
	 * @ignore
	 */
	prepareSourceToRender : function(source)
	{
		this.toLogger("PrepareSourceToRender",source);
		this.indexOrder = [];
		this.keyDataIndex = [];
		var nodeData = this.getNodeDataByData(source);

		//set new info on datasource, mainly to reindex the tree TODO not neccessarly needed from root
		this.createNodeInfo(this.datasource,null,this.getProxy(function(item){

			var itemNodeData = this.getNodeDataByData(item);
			this.toLogger("PrepareSourceToRender callback",item);
			if (this.defaultOpen && itemNodeData.open === undefined)
			{
				itemNodeData.open = true;
			}	
		}));
			
		this.indexHolderMap[nodeData.index].childsHolder.clear();
		
		if (nodeData.index != 0)
		{
			this.createToggleControl(nodeData.index);
		}
		
		//create the new nodes for the children
		//note that this.createNodeInfo() automaticly index the new nodes
		this.createNodes(source[this.childKey],nodeData.index);
		
		//remove the loader if there is one
		this.hideLoaderInNode(nodeData.index);
		
		//remove holder button. we might add it later again
		this.indexHolderMap[nodeData.index].buttonHolder.clear();
		
		//add loader button
		this.determineLoadNextButton(nodeData.index);

		//rerender source with new nodes	
		this.indexHolderMap[nodeData.index].invalidateDisplay();
	},
	
	/**
	 * removes all data from item and children recursivly
	 * note this function does not modify gui objects
	 * 
	 * @param {Array} item
	 */
	removeChildDataRecursivly : function(item)
	{
		if (!item)
		{
			return; //this could happen if root and sub node are both selected. root already deleted sub
		}

		var nodeData = this.getNodeDataByData(item);

		if (!nodeData.removedItems)
		{
			nodeData.removedItems = [];
		}
			
		if (item[this.childKey] && item[this.childKey].length)
		{
			var i, len;
			for (i=0, len = item[this.childKey].length; i< len; i++)
			{
				var child = item[this.childKey][i];
			
				nodeData.removedItems.push(child);
				
				this.removeChildDataRecursivly(child);
				item[this.childKey]= [];
			}
		}
		
		item[this.childKey]= [];
	},
	
	/**
	 * removes node by key
	 * key is the {object}[this.indexKey];
	 * 
	 * @param {String} key
	 */
	removeNodeByKey : function(key)
	{
		var item = this.keyDataIndex[key];
		
		if (item)
		{
			this.removeItem(item);
		}
	},
	
	/**
	 * 
	 * @param {Object} item
	 */
	removeItem : function(item)
	{
		this._super(item);

		var nodeData= this.getNodeDataByData(item);
		//remove all children
		this.removeChildDataRecursivly(item);
		
		//remove node from parent
		var parentIndex = this.getParentIndex(nodeData.index);
		
		var parentData = this.getDataSourceByIndex(parentIndex);
		
		if (parentData && parentData[this.childKey])
		{
			var childIndex = parentData[this.childKey].indexOf(item) ;
			
			if (childIndex !== -1)
			{	
				parentData[this.childKey].splice(childIndex,1);

				var parentNodeData= this.getNodeDataByData(parentData);

				var addedChildIndex = parentNodeData.addedChildren.indexOf(item);
				if (addedChildIndex >= 0)
				{
					parentNodeData.addedChildren.splice(addedChildIndex,1);
				}
					
				parentNodeData.childCount--;
			}
		}
		
		//remove gui node
		this.indexHolderMap[nodeData.index].remove();
		
		//reset some mappings
		this.indexOrder = [];
		this.keyDataIndex = [];
		
		//our generate nodeinfo should reindex the indexholder map.
		this.tempIndexHolderMap = Banana.Util.Clone(this.indexHolderMap);
		this.createNodeInfo(this.datasource);
		this.tempIndexHolderMap = null;
		
		if(parentData && !parentData[this.childKey].length)
		{
			this.removeToggleControl(parentNodeData.index,true);
			this.indexHolderMap[parentNodeData.index].invalidateDisplay();
		}	
	},
		
	/**
	 * shows a loader inside a node
	 * 
	 * @param {int} index 
	 */
	showLoaderInNode : function(index)
	{
		this.showingLoader = true;
		var loader = new Banana.Controls.Panel().setStyle('width:16px; height:16px;margin-left:20px;float:left;');
		loader.setId("loader-"+index);
		loader.addCssClass("BTreeListNodeLoader");
		this.indexHolderMap[index].addControl(loader);
		this.indexHolderMap[index].invalidateDisplay();
	},
	
	/**
	 * hides the loader
	 * also sets this.showingLoader to false;
	 * 
	 * @param {int} index
	 */
	hideLoaderInNode : function(index)
	{
		this.showingLoader = false;
		var loaderControl = this.indexHolderMap[index].findControl('loader-'+index);
		if (loaderControl)
		{
			loaderControl.remove();
		}		
	},
	
	/**
	 * @param {int} index
	 * @param {Object} datasource
	 */
	openNode : function(index,datasource)
	{
		var nodeData = this.nodeData[datasource[this.indexKey]];

		//set new info on datasource, mainly to reindex the tree TODO not neccessarly needed from root
		this.createNodeInfo(this.datasource);

		if (this.showingLoader)
		{
			return;
		}
		
		if (nodeData.needsChilds)
		{
			var params = {};
			params.targetIndex = index;
			params.datasource = datasource;
			params.limit = this.childRequestSizeLimit;
			params.offset = 0;
						
			this.triggerEvent("onRequestChilds",params);
		}
		else
		{
			this.createNodes(datasource[this.childKey],index);
			this.determineLoadNextButton(index);
			this.indexHolderMap[index].invalidateDisplay();
		}				
		
		//clear the indexorder
		this.indexOrder = [];
		this.keyDataIndex = [];
		
		this.triggerEvent("onItemOpened");
	},
	
	/**
	 * @param {int} index
	 * @param {Object} datasource
	 */
	closeNode : function(index,datasource)
	{
		this.indexHolderMap[index].childsHolder.clear();
		this.indexHolderMap[index].buttonHolder.clear();
		
		//clear the indexorder
		this.indexOrder = [];
		this.keyDataIndex = [];
		
		//set new info on datasource, mainly to reindex the tree TODO not neccessarly needed from root
		this.createNodeInfo(this.datasource);
		
		this.triggerEvent("onItemClosed");
	},
	
	/**
	 * invoked when node is clicked
	 * we open the node or close it
	 * if in nodeinfo the property needschilds is true we trigger an event to let
	 * the user load another childs
	 * 
	 * @param {index} int
	 * @param {boolean} true when node is opened
	 */
	nodeClicked : function(index,open)
	{
		if (this.showingLoader)
		{
			return;
		}
		
		var datasource = this.getDataSourceByIndex(index);
		var nodeData = this.nodeData[datasource[this.indexKey]];

		nodeData.open = open ? true : false;
		
		if (nodeData.open)
		{
			this.openNode(index,datasource);
		}
		else
		{
			this.closeNode(index,datasource);
		}
	},
	
	/**
	 * determines if a load next button is needed
	 * we also keep in count of deleted items. 
	 * 
	 * @ignore
	 */
	determineLoadNextButton : function(index)
	{
		var source = this.getDataSourceByIndex(index);
		var nodeData = this.getNodeDataByData(source);

		this.toLogger("determine load next button ",this.indexKey);

		if (!nodeData)
		{
			return;
		}
		
		if (source[this.childKey] && nodeData.open)
		{
			var serverChildCount = nodeData.childCount;
			var clientChildCount = source[this.childKey].length;
			var addedChildCount = nodeData.addedChildren.length;
			
			this.toLogger('server',serverChildCount,'client',clientChildCount,'added',addedChildCount);
			
			var offset = clientChildCount - addedChildCount;
		
			if (offset < serverChildCount)
			{
				var limit = serverChildCount - offset;
				
				if (limit > this.childRequestSizeLimit)
				{
					limit = this.childRequestSizeLimit;
				}
		
				nodeData.loadnext = true;
				
			//	var debug = "serverCount "+serverChildCount + " clientChilds"+clientChildCount+ " addedChildCount"+addedChildCount+ "===>"+offset+","+limit;
								
				return this.createLoadMoreButton(index,limit,"");
			}
		}
			
		nodeData.loadnext = false;
	},
	
	/**
	 * creates item render by index
	 * 
	 * Item render will be either from 
	 *  - data to item render map
	 *  - index to item render map
	 *  - or default one
	 *  
	 *  @ignore
	 */
	createItemRenderByIndex : function(index,instantRerender)
	{
		var datasource = this.getDataSourceByIndex(index);
		var nodeData = this.nodeData[datasource[this.indexKey]];

		this.toLogger("create item render by index ",index,datasource);

		this.triggerEvent('onPreCreateItem',{index:index,data:datasource});
				
		//this situation is only possible when user quickly closes and opens a node while loading server data
		if (!nodeData)
		{
			this.toLogger("no nodeinfo. dont render");
			return;
		}
		
		// Optionally can be accessed by e.g. invalidateDisplay to peek
		// at which index it is created
		this.currentIndexCreation = index;
		
		var itemRenderFactory = null;
		
		var key = datasource[this.indexKey];
				
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
		
		itemRender.setData(datasource);

		itemRender.bind('dataChanged',this.getProxy(function(e,f){
			
			this.getDataSource()[parseInt(e.data, 10)] = e.currentTarget.getData();
			this.triggerEvent('dataSourceChanged');
			
		}),index.toString());
		
		//save mapping between itemRender and data
		this.dataItemRenderMap.addItem(key,itemRenderFactory);

		itemRender.setListRender(this);

		var parentHolder = this.getParentHolder(index);
		
		if (!parentHolder)
		{	
			this.rootHolder = new Banana.Controls.DataGridTreeListRootHolder();;
			this.addControl(this.rootHolder);
			holder = this.rootHolder;
		}
		else
		{
			//create a holder to put our itemrender in
			var holder = new Banana.Controls.DataGridTreeListHolder();
		}
		
		//give a reference of this to the holder
		holder.listRender = this;
		holder.maximizeAutoWidth = this.maximizeNodeWidth;
		//set an unique id for which we later check if index map is correct
		holder.setId(key);
		//save mapping between index and holder
		this.indexHolderMap[index] = holder;
		
		//look for a parent holder. 
		var parentHolder = this.getParentHolder(index);
 
		if (parentHolder)
		{
			if (!nodeData.parentIsRoot)
			{
				holder.setStyle('margin-left:20px;');
			}
			
			parentHolder.childsHolder.addControl(holder);
			holder.itemRenderHolder.addControl(itemRender);
			
			if (nodeData.childProperty || nodeData.needsChilds)
			{
				this.createToggleControl(index);
			}
			else if (parentHolder)
			{
				this.removeToggleControl(index);
			}	
			
			if (this.selectedIndices.getItem(index))
			{
				this.selectIndex(index);
			}

			this.bindMouseHandler(holder, datasource);
			this.triggerEvent('onPostCreateIndex',{index:index,data:datasource,holder:holder});
		}
		
		this.currentIndexCreation = undefined;
	},	
	
	/**
	 * binds a click handler overwrite this function to use your own logic for binding click
	 * 
	 * @param {Banana.Controls.DataGridTreeListHolder} holder
	 * @param {Object} datasource item
	 * 
	 * @ignore
	 */
	bindMouseHandler : function(holder,datasource)
	{
		holder.itemRenderHolder.bind('click',this.getProxy(function(e){
			
			this.onRowMouseClick(e);
			this.triggerEvent('onItemMouseClick',e);

		}),datasource);
		
		holder.itemRenderHolder.bind('mouseenter',this.getProxy(function(e){
			
			this.triggerEvent('onItemMouseEnter',e);

		}),datasource);	
		
		holder.itemRenderHolder.bind('mouseleave',this.getProxy(function(e){
			
			this.triggerEvent('onItemMouseOut',e);

		}),datasource);	
	},
	
	/**
	 * @param {int} index
	 * @param {Boolean} rerender
	 * 
	 * @ignore
	 */
	createToggleControl : function(index,rerender)
	{		
		var datasource = this.getDataSourceByIndex(index);
		var nodeData = this.nodeData[datasource[this.indexKey]];
		
		//dont add when root and root should not be visible
//		if (!this.rootNodeVisible && !nodeData.hasParent)
//		{
//		//	return;
//		}
		
		var holder =this.indexHolderMap[index];
		
		holder.toggleHolder.clear();
		
		var toggle = new Banana.Controls.DataGridTreeListNodeToggle().setStyle('float:left;width:20px;height:20px;');
		toggle.index = index;
		
		toggle.setOn(nodeData.open);
	
		toggle.bind('toggle',this.getProxy(function(e,d){
			
			var index = this.getIndexByDataSource(e.data);

			this.nodeClicked(index,d);
			
		}),datasource);
		holder.toggleHolder.addControl(toggle);		
		
		if (rerender)
		{
			holder.toggleHolder.invalidateDisplay();
		}
	},
	
	/**
	 * @param {int} index
	 * @param {Boolean} rerender
	 * 
	 */
	removeToggleControl : function(index,rerender)
	{
		var holder =this.indexHolderMap[index];
		var datasource = this.getDataSourceByIndex(index);
		var nodeData = this.getNodeDataByData(datasource);
		
		holder.toggleHolder.clear();
		
		//dont add dummy when root and root should not be visible
		if (!this.rootNodeVisible && !nodeData.hasParent)
		{
			return;
		}
		
		var dummy = new Banana.Controls.Panel().addCssClass('BTreeListNodeEmpty');
		holder.toggleHolder.addControl(dummy);	
		
		if (rerender)
		{
			holder.toggleHolder.invalidateDisplay();
		}
	},
	
	/**
	 * creates a load more button
	 * 
	 * @param {String} index
	 * @param {int} limit
	 */
	createLoadMoreButton : function(index,limit,debug)
	{
		var holder =this.indexHolderMap[index];
		
		var button = new Banana.Controls.LinkButton();
		button.setStyle('margin-left:20px;float:left;');
			
		var datasource = this.getDataSourceByIndex(index);
		var nodeData = this.getNodeDataByData(datasource);
		
		button.setText('Load next '+limit);
		
		if (this.debug)
		{
			button.setText('..load next '+limit + ' debug: ' +debug);
		}
		
		button.bind('click',this.getProxy(function(){
		
			if (this.showingLoader)
			{
				return;
			}
			
			var datasource = this.getDataSourceByIndex(index);
			
			var offset = 0;

			var info = datasource[this.childKey].length - nodeData.addedChildren.length;

			if (info)
			{
				offset =info;
			}
			
			var params = {};
			params.targetIndex = index;
			params.datasource = datasource;
			params.limit = limit;
			params.offset = offset;
	
			this.triggerEvent("onRequestChilds",params);
			
		}));	
		
		holder.buttonHolder.addControl(button);
		holder.buttonHolder.addControl('<div style="clear:both"></div>');
	},
	
	/**
	 * calls the select method in the item render
	 * 
	 * @param {int} index
	 */
	selectIndex : function(index,preventEvent)
	{
		var ir = this.getRenderedItemRenderByIndex(index);
		
		if (!ir)
		{
			return;
		}
		
		ir.select();
	
		if (!preventEvent)
		{
			this.triggerEvent('onSelectIndex',index);
		}
	},

	/**
	 * calls the deselect method in the item render
	 * 
	 * @param {int} index
	 */
	deSelectIndex : function(index)
	{
		var ir = this.getRenderedItemRenderByIndex(index);
		
		if (!ir)
		{
			return;
		}
		
		ir.deselect();
		
		this.triggerEvent('onDeselectIndex',index);
	},
	
	/**
	 * Selects all indices from given index.
	 * @param {String} index
	 * @param {mixed} datasource for internal use only
	 */
	selectAllFromIndex : function(index,datasource)
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
		
		if (!nodeData)
		{
			return;
		}
		var i, len;
		for (i =0, len = datasource[this.childKey].length; i < len; i++)
		{
			var item = datasource[this.childKey][i];
			index = nodeData.index;
			
			var ir = this.getRenderedItemRenderByIndex(i);
			
			if (ir && !ir.getIsSelectable())
			{
				
			}
			else
			{
				this.selectedIndices.addItem(index,true);
				
				this.selectIndex(index,true);
				
				if (item[this.childKey])
				{
					this.selectAllFromIndex(index,item);
				}
			}
		}
	},
	
	/**
	 * @return {Boolean}
	 * @ignore
	 */
	indexBeforeIndex : function(indexA,indexB)
	{
		var i;
		for (i = 0; i < this.indexOrder.length;i++)
		{
			if (this.indexOrder[i] === indexA)
			{
				return true;
			}
			
			if (this.indexOrder[i]===indexB)
			{
				return false;
			}
		}
		
		return false;
	},
	
	/**
	 * Gets the rendered item render instance by index
	 * @return {Object}
	 */
	getRenderedItemRenderByIndex : function(index)
	{
		var holder = this.indexHolderMap[index];

		if (!holder)
		{
			return null;
		}
		
		return holder.getItemRender();
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
		var index = this.getNodeDataByData(e.data).index;

		var itemRender = this.getRenderedItemRenderByIndex(index);
		
		if (!itemRender.getIsSelectable())
		{
			return;
		}

		var ctrlKey = e.ctrlKey;
		var shiftKey = e.shiftKey;

		if (this.getIndexIsSelected(index))
		{
			if (!ctrlKey && !shiftKey)
			{
				this.previousShiftFirstItem = null;
				this.clearSelectedIndices();
			}
			else
			{
				this.previousShiftFirstItem = null;
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
					this.previousShiftFirstItem = null;
					this.clearSelectedIndices();
					this.addSelectedIndex(index);
				}
				if (ctrlKey)
				{
					this.previousShiftFirstItem = null;
					this.addSelectedIndex(index);
				}
				if (shiftKey)
				{
					//use our previous shift item
					if (!this.previousShiftFirstItem)
					{
						this.previousShiftFirstItem = this.selectedIndices.getKeyByIndex(0);
					}
						
					var firstItem = this.previousShiftFirstItem;
					
					if (this.indexOrder.indexOf(firstItem) === -1)
					{
						firstItem = this.indexOrder[0];
					}
					
					if (!firstItem)
					{
						return;
					}
					
					//reverse it when selected is above first
					if (this.indexBeforeIndex(index,firstItem))
					{
						var temp = index;
						index = firstItem;
						firstItem = temp;
					}
					
					var go = false;
					
					this.clearSelectedIndices();
					
					var x, len;
					for (x = 0, len = this.indexOrder.length; x < len; x++)
					{
						if (typeof(this.indexOrder[x]) === 'function')
						{
							continue;
						}
						
						if (this.indexOrder[x] === firstItem)
						{
							go = true;
						}
							
						if (!go)
						{
							continue;
						}
						
						if (this.indexOrder[x]===index)
						{
							go = false;
						}
						
						var ir = this.getRenderedItemRenderByIndex(this.indexOrder[x]);
						
						if (ir && !ir.getIsSelectable())
						{
							
						}
						else
						{
							this.addSelectedIndex(this.indexOrder[x]);
						}
					}
				}

			}
		}		
		this.triggerEvent('onItemSelect');
	}
});