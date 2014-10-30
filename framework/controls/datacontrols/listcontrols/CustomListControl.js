/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Custom list control  
 */

goog.provide('Banana.Controls.DataControls.ListControls.CustomListControl');

goog.require('Banana.Controls.DataControls.ListControls.ListControl');

/** @namespace Banana.Controls.CustomListControl */
namespace('Banana.Controls').CustomListControl = Banana.Controls.ListControl.extend(
/** @lends Banana.Controls.CustomListControl.prototype */
{		
		/**
		 * Creates a base custom list control. Use this class as a wrapper arround your custom
		 * list controls which are using datasource and or data.
		 * if setDatasource of setData is called we call createControls method in which
		 * the creation of controls should be defined
		 *
		 * basicly this control rerenders the whole control + child collection when calling either data or datasource
		 * It handles all the clearing and re-rendering. 
		 * 
		 *  Example:
		 *  
		 
		 	//define the class
		 	var myList = Banana.Controls.CustomListControl.extend({
		 	
	 		createControls : function()
	 		{
	 			var i,len;
	 			for (var i=0,len=this.datasource.length;i<len;i++)
	 			{
	 				var label = new Banana.Controls.Label();
	 				label.setData(this.datasource[i]);
	 				this.addControl(label);
	 				
	 				//if this datasource item is in our data make background red
	 				if (this.data.indexOf(this.datasource[i] != -1))
	 				{
	 					label.setStyle("background-color:red");
	 				}
	 			}
	 		}
		 	
		 	});
		 	
		 	//populate the list with datasource
		 	myList.setDataSource(['first','second','third');
		 	myList.setData(["third"]);
		 * 
		 * @constructs
		 * @extends Banana.Controls.ListControl
		 */
		init : function()
		{
			this._super();
		}
});


/**
 * @override to make sure this function is doing nothing, since we do it in our custom way (createControls)
 *
 */
Banana.Controls.CustomListControl.prototype.setDomData = function(){};

/**
 *  
 * this function is called when set data or set datasource is called
 * overwrite this function to create your own logic
 * 
 * @abstract
 */
Banana.Controls.CustomListControl.prototype.createControls = function(){};

/**
 *	sets data on control.
 *	when this function is called we also clear the control and invalidate
 *	the display to rerender the control
 *
 *	@param {mixed} data for control
 *	@param {bool} ignoreEvent when true we dont trigger
 *	@param {bool} ignoreDom when true we dont update dom
 *	@return {this}
 */
Banana.Controls.CustomListControl.prototype.setData = function(data, ignoreEvent, ignoreDom)
{
	if (typeof(data) != 'string')
	{
		if (data)
		{
			//banana.util.clone doesnt work well with cloning arrays. remove index from cloned array doesnt work. index is still there. weird bug!
			//we break the reference
			this.data = newObject = JSON.parse(JSON.stringify(data));
		}
		else
		{
			this.data = data;
		}
	}
	else
	{
		this.data = data;
	}

	if (!ignoreDom)
	{		
		this.clear();
		this.createControls();
		this.invalidateDisplay();		
	}

	return this;
};

/**
 *	Sets datasource on control.
 *	when this function is called we also clear the control and invalidate
 *	the display to rerender the control
 *
 *	@param {mixed} ds datasource for the control
 *	@return {this}
 */
Banana.Controls.CustomListControl.prototype.setDataSource = function(ds)
{
	this.datasource = ds; //we dont need to clone this, cause do we change and save the datasource?
	this.clear();
	this.createControls();
	this.invalidateDisplay();
	this.triggerEvent('onSetDataSource');
	return this;
};
