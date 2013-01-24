/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Dataset
 */

goog.provide('Banana.Data.DataSet');

/**
@class Banana.Data
@name Banana.Data
*/

/** @namespace Banana.Data.DataSet.Validator  */
namespace('Banana.Data').DataSet = Banana.Control.extend(
/** @lends Banana.Data.DataSet.prototype */
{
	/**
	 * Datasets are local storages to maintain data in one central place and provide all or parts of the data to controls.
	 * All DataControls within banana have bindDataSet and bindDataSourceSet methods available to bind on a specific dataset.
	 * 
	 * it looks like this
	 * 
	 * Control.bindDataSet("datasetName","optionalProperty");  
	 * 
	 * the optionalProperty is used when you supply a complex object as data in your dataset.
	 * For example
	 * 
	 * var data = {"value1":"foo","value2":"foo2"}
	 * Control.bindDataSet("datasetName",value1);
	 * 
	 * Data can be of any type. Strings, Arrays or Deep nested arrays/objects.
	 * 
	 * Changing data in controls propagates back to the dataset to maintain consistent data.
	 * There are 3 ways of getting data from the dataset
	 * 1. getData() retreives the original data. changes in controls will not affect this data, unless commitControlData is used
	 * 2. getControlData() retreives only data which have registered controls on it
	 * 3. getChangedDataSet() retreives all data with the latest by controls modified data
	 * 
	 * When new data is inserted in the dataset all controls are getting updated with new data.
	 * Sometimes you are using complex data like 
	 * var data = {"value1":{'id':12,'name':'foo'}}
	 * When you update the dataset with new data like
	 * var data = {"value1":{'id':12,'name':'foo foo foo foo foo foo'}}
	 * You want to keep the references pointing to the same origin. Dataset handles this for you by suppling a key with setDataKey() on the dataset
	 * 
	 * If new data is inserted only data which is changed will affect controls. This increases performance.
	 * 
	 * use dataset.clientUpdate to make data visible into the controls
	 * @constructs
	 * @extends Banana.Control
	 */
	init : function()
	{
		this.dataKey = 'id';
		this.isChanged = false;
		this.controlRegisterModified = false
	},
	
	/**
	 * @param {String} id sets the datakey which is used to maintain key value pointer references
	 */
	setDataKey : function(id)
	{
		this.dataKey = id;
	},
	
	/**
	 * Clears the dataset by removing internal data and unregisters all controls
	 */
	clear : function()
	{
		this.unregisterEvents();
		this.registeredDataSourceControls = undefined;
		this.registeredDataControls = undefined;
		this.data = undefined;
		this.oldData = undefined;
	},

	/**
	 * we overwrite the bind function to detect if a user listens to controldatachaged events
	 * if so, we register on every control attached to this dataset a listener.
	 */
	bind : function(name,func)
	{
		if (name == 'controlDataChanged')
		{
			this.enableControlChangeEvent = true;
		}

		return this._super(name,func);
	},

	/**
	 * clears the data in all controls
	 */
	clearControlData : function()
	{
		for (id in this.registeredDataSourceControls)
		{
			var c = this.registeredDataSourceControls[id];

			if (c.bindedDataSource)
			{
				if (c.bindedDataSource[1])
				{
					c.setDataSource(null,true);
				}
			}
		}
		for (id in this.registeredDataControls)
		{
			var c = this.registeredDataControls[id];

			if (c.bindedData)
			{
				if (c.bindedData[1])
				{
					c.setData(null,true);
				}
			}
		}

		this.oldData = undefined;
		jQuery(this).trigger('dataChanged',this.data); //is this a good place????
	},
		
	/**
	 * sets data in dataset
	 * We check if previous data is changed compared to new data.
	 * if so we copy all new properties to the old data, to make sure our object references stay intact.
	 * this is specialy usefull to prevent changes between items
	 *
	 * so that only changed controls are getting updated
	 * @param {mixed} d data
	 * @param {boolean} ignoreEqualCheck when true we dont check if new data is equal to old.
	 * @return {this} 
	 */
	setData : function(d,ignoreEqualCheck)
	{
		this.allowControlUpdate = true;

		//when new controls are added to this dataset we always update
		//if this.data and new data are the same, we just trigger change event
		if (this.data != d && this.data && !this.controlRegisterModified)
		{
			//if the datas are not the same we copy references, otherwise we do nothing
			if (ignoreEqualCheck || !Banana.Util.ObjectsAreEqual(d,this.data))
			{
				Banana.Util.CopyTo(d,this.data,this.dataKey);
				
				this.triggerEvent('dataChanged');
			}
			else
			{
				this.allowControlUpdate = false;
				this.triggerEvent('dataUnchanged');
			}
		}
		else
		{
			this.data = d;
			this.triggerEvent('dataChanged');
		}
		return this;
	},

	/**
	 * resets control to original data
	 */
	resetControls : function()
	{
		if (!this.getData())
		{
			return;
		}
		
		this.allowControlUpdate =true;
		this.clientUpdate();
	},
	
	/**
	 * returns data in dataset
	 * always returns most up to date data
	 * 
	 * @return {mixed} data
	 */
	getData : function()
	{
		return this.data;
	},
	
	/**
	 * @return {boolean} true when data is changed. 
	 */
	getIsChanged : function()
	{
		return this.isChanged;
	},
	
	/**
	 * updates all registered controls with the current dataset data
	 */
	clientUpdate : function()
	{
		if (!this.allowControlUpdate)
		{
			return false;
		}

		for (id in this.registeredDataSourceControls)
		{
			var c = this.registeredDataSourceControls[id];
			
			if (c.bindedDataSource)
			{
				this.setControlDataSource(c);
			}	
		}

		for (id in this.registeredDataControls)
		{
			var c = this.registeredDataControls[id];

			if (c.bindedData)
			{
				if (c.bindedData[1])
				{
					this.setControlData(c);
				}
			}
		}
		this.controlRegisterModified = false;
		this.isChanged = false;
	},

	/**
	 * Retreives the data from all registered data controls.
	 * Besides the data we also have the original data and isDataChanged boolean
	 * @param {flattened} when true we just return a key value object 
	 * @return {object} 
	 */
	getControlData : function(flattened)
	{
		var d = {};

		for (var id in this.registeredDataControls)
		{
			var c = this.registeredDataControls[id];
			var data = c.getData();
			if (!(c instanceof Banana.Controls.DataControl)) continue;

			if (flattened)
			{
				if (data === undefined)
				{
					cd = null
				}
				else
				{
					cd = data;
				}
			}
			else
			{
				var cd = {};

				cd['originalData'] = null;
				cd['isDataChanged'] = true;

				if (this.getData())
				{
					 cd['originalData'] = this.getDataByPath(c.bindedData[1]) || null;
					 cd['isDataChanged']= this.getDataByPath(c.bindedData[1]) != data;
				}

				if (data === undefined)
				{
					cd['data'] = null;
				}
				else
				{
					cd['data'] = data;
				}
			}
			//we want to ensure datastructures
			this.ensureObjectFromPath(d,c.bindedData[1],cd);

		}
		return d;
	},

	/**
	 * Get the dataset with changed values from input fields
	 *
	 * @return {mixed} The dataset
	 */
	getChangedDataSet: function()
	{
		var d = this.getData() || {};

		for (var id in this.registeredDataControls)
		{
			var c = this.registeredDataControls[id];
			if (!(c instanceof Banana.Controls.DataControl)) continue;
	
			//if bindedfield is like xxx.yyy.zzz we make sure that the data is in same path
			var field = c.bindedData[1];
			var sfield = field.split('.');
			
			this.ensureObjectFromPath(d,field);
			
			this.setDataByPath(c.getData(),field);
		}
		
		return d;
	},

	/**
	 * Persist the data from the controls to the dataset.
	 * This function should be used after a successful save to
	 * reset the dataChanged flags.
	 */
	commitControlData : function()
	{
		var d = {};
		for (var id in this.registeredDataControls)
		{
			var c = this.registeredDataControls[id];
			if (!(c instanceof Banana.Controls.DataControl)) continue;

			d = this.ensureObjectFromPath(d,c.bindedData[1],c.getData());
		}

		this.setData(d);
		return this;
	},

	/**
	 * ensures an object contains properties acording to dot limited path
	 * additionaly possible to insert data at last property
	 *
	 * @param {object} obj
	 * @param {string} path i.e test.sub.subsu
	 * @param {object} props to insert at last property
	 * @param {string} refpath used by function
	 * @param {object} refObj used by function
	 *
	 */
	ensureObjectFromPath : function(obj,path,props,refpath,refObj)
	{
		if (!path)
		{
			refObj[refpath] = props;
			return;
		}

		var split = path.split('.');

		refObj = obj;

		if (!obj[split[0]])
		{
			obj[split[0]] = {};
		}

		var s = split[0];
		split.splice(0,1)
		refpath = path;
		var path = split.join('.');

		this.ensureObjectFromPath(obj[s],path,props,refpath,refObj)

		return obj;
	},

	/**
	 * sets data on control from dataset data
	 *
	 * @param {Banana.Controls.DataControl} c
	 * @param {mixed} d
	 */
	setControlData : function(c,d)
	{
		var data = (this.getData() === null) ? null : this.getDataByPath(c.bindedData[1]);

		c.setData(data );
		c.triggerEvent('controlDataBinded',data);
	},

	/**
	 * sets datasource data on control from dataset data
	 *
	 * @param {Banana.Controls.DataControl} c
	 */
	setControlDataSource : function(c)
	{
		if (c.bindedDataSource[1])
		{
			var d = this.getDataByPath(c.bindedDataSource[1]);

			c.setDataSource(d);
		}
		else
		{
			c.setDataSource(this.getData());
		}
		c.triggerEvent('controlDataSourceBinded');
	},

	/**
	 * @param {String} path
	 * @returns {mixed} 
	 */
	getDataByPath : function(path)
	{
		path = path.split('.');

		var d = this.getData();

		if (!d) return d;
		
		for(var i=0,len = path.length; i < len; i++)
		{
			d = d[path[i]];
			if (d == undefined)
			{
				return null;
			}
		}

		return d;
	},
	
	/**
	 * sets data by path
	 * 
	 * @param {mixed} data
	 * @param {String} path
	 */
	setDataByPath : function(data,path)
	{
		path = path.split('.');
		var d = this.getData();	
		var refPath = null;
		
		if (path.length == 1)
		{
			refPath = path;
		}
		//we have a path like xxx.yyy.zzz with data assigned to zzz
		//we fetch the zzz part out of it and assign the data to it
		else
		{		
			var d = this.getData();	
			var refPath = null;
			
			for(var i=0,len = path.length; i < len-1; i++)
			{
				d = d[path[i]];
			}
			
			//our reference path is the last one in given path
			refPath = path[path.length-1];
		}
		
		d[refPath] = data;

		return d;
	},
	
	/**
	 * binds data from dataset to datasource in control
	 *
	 * @param {Banana.Controls.DataControl} c
	 */
	bindControlToDataSource : function(c)
	{
		this.controlRegisterModified =true;

		if (!this.registeredDataSourceControls)
		{
			this.registeredDataSourceControls = {};
		}

		if (!this.registeredDataSourceControls[c.getId()])
		{
			if (this.getData())
			{
				this.setControlDataSource(c);
			}

			this.registeredDataSourceControls[c.getId()] = c;
		}

	},

	/**
	 * binds data from dataset to data in control
	 *
	 * @param {Banana.Controls.DataControl} c
	 */
	bindControlToData : function(c)
	{
		this.controlRegisterModified =true;

		if (!this.registeredDataControls)
		{
			this.registeredDataControls = {};
		}

		if (!this.registeredDataControls[c.getId()])
		{
			if (this.getData())
			{
				this.setControlData(c);
			}

			if (this.enableControlChangeEvent)
			{

				c.bind('dataChanged',this.getProxy(this.controlChangedHandler))

			}

			this.registeredDataControls[c.getId()] = c;
		}

	},

	/**
	 * handler for change events.
	 * checks current changed control and store changed status in an array
	 * this is needed to track changes of controls.
	 * only when all checked controls are equal to original data we fire a restoreevent. unaffected controls are playing no
	 * role in the descision of firing the change or restore event
	 *
	 * TODO needs to be improved. Could slow down things a bit
	 *
	 * @param Event e
	 */
	controlChangedHandler : function(e)
	{
		if (!this.controlChecks) {this.controlChecks ={};}

		var c = e.currentTarget;
		var orgData = (this.getData() === null) ? '' : this.getDataByPath(c.bindedData[1]);
		orgData = orgData || '';

		if (orgData != e.currentTarget.data)
		{
			this.controlChecks[e.currentTarget.id] = false;
		}
		else
		{
			this.controlChecks[e.currentTarget.id] = true;
		}

		for (index in this.controlChecks)
		{
			if (this.controlChecks[index] == false)
			{
				this.triggerEvent('controlDataChanged');
				return;
			}
		}

		this.triggerEvent('controlDataRestored');
		return;
	},


	/**
	 * unbinds controls from this dataset
	 *
	 * @param {Banana.Controls.DataControl} c
	 */
	unBindControl : function(c)
	{
		this.controlRegisterModified =true;

		delete this.registeredDataControls[c.getId()];
	},

	/**
	 * unbinds control from this dataset
	 *
	 * @param {Banana.Controls.DataControl} c
	 */
	unBindDataSourceControl : function(c)
	{
		if (!this.registeredDataSourceControls)
		{
			return;
		}

		this.controlRegisterModified =true;
		delete this.registeredDataSourceControls[c.getId()];
	}
});