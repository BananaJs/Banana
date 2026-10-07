import {ListControl} from "../ListControl.js";
import {Control} from "../../Control.js";
import {Panel} from "../../Panel.js";

/** @namespace DataGrid */
export class DataGrid extends ListControl
/** @lends DataGrid.prototype */
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
	 
	var datagrid = new DataGrid();

	var columns = [
		          	new DataGridColumn().setHeaderText('name').setDataField('name'),
		          	new DataGridColumn().setHeaderText('description').setDataField('description')
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
	 * @extends ListControl
	 */
	init ()
	{
		super.init();
	
		this.addCssClass('BDataGrid');
		
		this.datasource = [];
		
		this.listRender = null;
		this.listRenderCreated = false;
		
		this.createBasicControls();
	}
	
	/**
	 * Internaly used
	 * @ignore
	 */
	createComponents ()
	{
		this.triggerEvent('datagridReady');
	}
	
	/**
	 * @ignore
	 */
	updateDisplay ()
	{
		if (!this.listRenderCreated)
		{
			this.createEmptyTemplate();
		}
	}
	
	/**
	 * @param {mixed} datasource to fill the datagrid with
	 * @return {this}
	 */
	setDataSource (datasource)
	{
		this.datasource = datasource;
		this.triggerEvent('onSetDataSource',datasource);
		return this;
	}
	
	/**
	 * setData method is equal to the setDataSource method. This method is used
	 * when datagrid is binded to data in a dataset.
	 * @param {mixed} data
	 * @return {this}
	 */
	setData (data)
	{
		this.setDataSource(data);
		return this;
	}
	
	/**
	 * equal to getDataSource
	 * @return {mixed}
	 */
	getData ()
	{
		return this.datasource;
	}

	/**
	 * An empty template is shown when no datasource or empty datasource is inside the datagrid.
	 * @param {UiControl} c
	 * @return {this} 
	 */
	setEmptyTemplate (c)
	{
		this.emptyTemplate = c;
		
		this.clearEmptyTemplate(); 
		this.createEmptyTemplate();
				
		return this;
	}
	
	/**
	 * Create building blocks which are needed to visualize our datagrid.
	 * From top to bottom we create a control panel holder, the list holder, info holder for the empty template
	 * and loader holder to show a loader.
	 * 
	 * @ignore
	 */
	createBasicControls ()
	{
		this.controlPanelHolder = new Control();
		this.listHolder = new Panel();
		this.infoHolder = new Panel().addCssClass('BDataGridInfoHolder');
		this.loaderHolder = new Panel();
		
		this.addControl(this.loaderHolder);
		this.addControl(this.controlPanelHolder);
		this.addControl(this.listHolder);
		this.addControl(this.infoHolder);
	}
	
	/**
	 * Sets the list render responsible for rendering content.
	 * If changed during runtime we rerender the complete datagrid.
	 * 
	 * @param {DataGridBaseListRender} lr
	 * @return {this}
	 */
	setListRender (lr)
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
	}
	
	/**
	 * returns current active list render. If none is active we return a default table list render
	 * @return {DataGridBaseListRender} listRender
	 */
	getListRender ()
	{
		if (!this.listRender)
		{
			this.listRender = new DataGridTableListRender();
		}
		
		return this.listRender;
	}
	
	/**
	 * Clears the list render.
	 * @return {this} 
	 */
	clearListRender ()
	{
		this.listHolder.clear();
		return this;
	}
	
	/**
	 * Create the listRender
	 * @ignore
	 */
	createListRender ()
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
	}
	
	/**
	 * Invoked when datasource is set
	 * we start the creation of controls here
	 * @ignore
	 */
	onSetDataSource ()
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
	}

	/**
	 * @abstract
	 * @ignore
	 */
	showInitLoader (){}
	
	/**
	 * @abstract
	 * @ignore
	 */
	renderList (){}
	
	/**
	 * @abstract
	 * @ignore
	 */
	showLoader (){}
	
	/**
	 * creates an empty template. 
	 * 
	 * @ignore
	 */
	createEmptyTemplate ()
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
	}
	
	/**
	 * clears the empty template.
	 * @return {this}
	 */
	clearEmptyTemplate ()
	{
		this.infoHolder.clear();
		return this;
	}
};