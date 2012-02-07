/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Datagrid  
 */

goog.provide('Banana.Controls.DataGrid');

goog.require('Banana.Controls.DataGridTableListRender');
goog.require('Banana.Controls.DataGridTileListRender');
goog.require('Banana.Controls.DataGridTreeListRender');
goog.require('Banana.Controls.DataGridDataTreeListRender');
goog.require('Banana.Controls.DataGridControlPanel');

goog.require('Banana.Controls.DataGridCheckboxFilter');
goog.require('Banana.Controls.DataGridDropDownFilter');
goog.require('Banana.Controls.DataGridSearchFilter');
goog.require('Banana.Controls.DataGridPagerFilter');
goog.require('Banana.Controls.DataGridDateFilter');

/** @namespace Banana.Controls.DataGrid */
namespace('Banana.Controls').DataGrid = Banana.Controls.ListControl.extend(
/** @lends Banana.Controls.DataGrid.prototype */
{
	/**
	 * Creates a datagrid 
	 * A datagrid is a more advanced list control with functionality to have its own listrender. 
	 * A listrender is responsible for rendering the list and is completely independent from the datagrid itself.
	 * By default a datagrid is having a table list render .
	 * A different listrender can replace the current listrender if desired at anytime.
	 * Empty template can be assigned to a datagrid which is shown when there is no data inside the
	 * datagrid.
	 *  
	 Example:
	 
	var datagrid = new Banana.Controls.DataGrid();

	var columns = [
		          	new Banana.Controls.DataGridColumn().setHeaderText('name').setDataField('name'),
		          	new Banana.Controls.DataGridColumn().setHeaderText('description').setDataField('description')
		          ];
		          
	datagrid.getListRender().setColumns(colums);
	
	var datasource = [
	                 	{'name':'a name1','description':'a description1'},
	                 	{'name':'a name2','description':'a description2'},
	                 	{'name':'a name3','description':'a description3'}
	                 ];
	                 
	datagrid.setDataSource(datasource);   
	
	this.addControl(datagrid);
	 
	 * 
	 * @constructs
	 * @extends Banana.Controls.ListControl
	 */
	init : function()
	{
		this._super();
	
		this.addCssClass('BDataGrid');
		
		this.datasource = [];
		
		this.listRender = null;
		this.listRenderCreated = false;
		
		this.createBasicControls();
	},
	
	/**
	 * Internaly used
	 * @ignore
	 */
	createComponents : function()
	{
		this.triggerEvent('datagridReady');
	},
	
	/**
	 * @ignore
	 */
	updateDisplay : function()
	{
		if (!this.listRenderCreated)
		{
			this.createEmptyTemplate();
		}
	},
	
	/**
	 * @param {mixed} datasource to fill the datagrid with
	 * @return {this}
	 */
	setDataSource : function(datasource)
	{
		this.datasource = datasource;

		this.triggerEvent('onSetDataSource',datasource);
		return this;
	},
	
	/**
	 * setData method is equal to the setDataSource method. This method is used
	 * when datagrid is binded to data in a dataset.
	 * @param {mixed} data
	 * @return {this}
	 */
	setData : function(data)
	{
		this.setDataSource(data);
		return this;
	},
	
	/**
	 * equal to getDataSource
	 * @return {mixed}
	 */
	getData : function()
	{
		return this.datasource;
	},
	
	/**
	 * add a control panal above the datagrid.
	 * A control panel is used as a container for filters and other controls interacting
	 * with the datagrid.
	 * 
	 * @param {Banana.Controls.DataGridControlPanel} c 
	 * @return {this}
	 */
	setControlPanel : function(c)
	{
		if (!(c instanceof(Banana.Controls.DataGridControlPanel)))
		{
			return this;
		}
		
		this.controlPanelHolder.addControl(c);
		return this;
	},
	
	/**
	 * @return {Banana.Controls.DataGridControlPanel}
	 */
	getControlPanel : function()
	{
		return this.controlPanelHolder.controls[0];
	},
	
	/**
	 * An empty template is shown when no datasource or empty datasource is inside the datagrid.
	 * @param {Banana.Controls.UiControl} c
	 * @return {this} 
	 */
	setEmptyTemplate : function(c)
	{
		this.emptyTemplate = c;
		
		this.clearEmptyTemplate(); 
		this.createEmptyTemplate();
				
		return this;
	},
	
	/**
	 * Create building blocks which are needed to visualize our datagrid.
	 * From top to bottom we create a control panel holder, the list holder, info holder for the empty template
	 * and loader holder to show a loader.
	 * 
	 * @ignore
	 */
	createBasicControls : function()
	{
		this.controlPanelHolder = new Banana.Control();
		this.listHolder = new Banana.Controls.Panel();
		this.infoHolder = new Banana.Controls.Panel().addCssClass('BDataGridInfoHolder');
		this.loaderHolder = new Banana.Controls.Panel();
		
		this.addControl(this.loaderHolder);
		this.addControl(this.controlPanelHolder);
		this.addControl(this.listHolder);
		this.addControl(this.infoHolder);
	},
	
	/**
	 * Sets the list render responsible for rendering content.
	 * If changed during runtime we rerender the complete datagrid.
	 * 
	 * @param {Banana.Controls.Banana.Controls.DataGridBaseListRender} lr
	 * @return {this}
	 */
	setListRender : function(lr)
	{
		this.clearListRender();
				
		this.listRender = lr;
		this.listRender.datagrid = this;
		//force rerender if datasource is available
		if (this.datasource && this.datasource.length)
		{
			this.setDataSource(this.datasource);
		}
		
		return this;
	},
	
	/**
	 * returns current active list render. If none is active we return a default table list render
	 * @return {Banana.Controls.DataGridBaseListRender} listRender
	 */
	getListRender : function()
	{
		if (!this.listRender)
		{
			this.listRender = new Banana.Controls.DataGridTableListRender();
		}
		
		return this.listRender;
	},
	
	/**
	 * Clears the list render.
	 * @return {this} 
	 */
	clearListRender : function()
	{
		this.listHolder.clear();
		return this;
	},
	
	/**
	 * Create the listRender
	 * @ignore
	 */
	createListRender : function()
	{
		if (!this.listRender || !this.listRender.id)
		{
			this.listRender = this.getListRender();
		}
		
		//if list holder is not already added to its placeholder 
		if (this.listHolder.controls.indexOf(this.listRender) === -1)
		{
			this.listHolder.addControl(this.listRender);
			this.listRender.datagrid = this;
			this.listRenderCreated = true;
					
			//bind event. if source is 0 we create empty template, otherwise remove it
			this.listRender.bind('dataSourceChanged',this.getProxy(function(e,f){

				this.datasource = this.listRender.datasource; //synchronize datasources

				///if already cleared and datasource is bigger than zero
				if (this.emptyTemplateCleared && this.datasource.length)
				{
					return;
				}
				
				this.emptyTemplateCleared = false;
				
				if (this.datasource.length)
				{
					this.clearEmptyTemplate();
					this.emptyTemplateCleared = true;
				}
				else
				{
					this.createEmptyTemplate();
				}
			}));
		}
	},
	
	/**
	 * Invoked when datasource is set
	 * we start the creation of controls here
	 * @ignore
	 */
	onSetDataSource : function()
	{
		if (!this.datasource)
		{
			this.datasource = [];
		}
		//datasource needs to be a indexed array
		if (!this.datasource.length)
		{	
			this.createEmptyTemplate();
		}
		else
		{
			this.infoHolder.setVisible(false);
		}

		if (this.listRender)
		{
			this.listRender.clear();	
		}

		this.createListRender();
		
		this.listRender.setDataSource(this.datasource);
		
		if (this.isRendered) 
		{
			this.listHolder.invalidateDisplay();
		}
	},

	/**
	 * @abstract
	 * @ignore
	 */
	showInitLoader : function(){},
	
	/**
	 * @abstract
	 * @ignore
	 */
	renderList : function(){},
	
	/**
	 * @abstract
	 * @ignore
	 */
	showLoader : function(){},
	
	/**
	 * creates an empty template. 
	 * 
	 * @ignore
	 */
	createEmptyTemplate : function()
	{
		this.infoHolder.clear();
		
		if (this.emptyTemplate)
		{
			this.infoHolder.addControl(this.emptyTemplate(),true).setVisible(true);
		}
		else
		{
			this.infoHolder.addControl('No data found',true).setVisible(true);
		}
	},
	
	/**
	 * clears the empty template.
	 * @return {this}
	 */
	clearEmptyTemplate : function()
	{
		this.infoHolder.clear();
		return this;
	}
});