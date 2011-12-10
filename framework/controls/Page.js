/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Page 
 */

goog.provide('Banana.Page');

goog.require('Banana.Controls.Panel');
goog.require('Banana.Loader');

/** @namespace Banana.Page */
namespace('Banana').Page = Banana.Controls.Panel.extend(
/** @lends Banana.Page.prototype */
{
	/**
	 * Creates a page component.
	 *
	 * Page is responsible for
	 *
	 *  rendering its control collection,
	 *  register events on controls, 
	 *  unregister events on controls, 
	 *  apply databinding on controls, 
	 *  removing controls from data/dom, 
	 *
	 * page should not be manually instantiated. Application is responsible for this.
	 *
	 * example of a page: 
	 
	   var mypage = Banana.Page.extend({});
	 *
	 * point your url to &section=mypage
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this.triggerEvent('onInit');
		
		this.addCssClass('BPage');
	
		this._super();

		this.uniqueId = 0;
		this.validators = [];
		this.dataSets = [];

		if (!this.resizefunc)
		{
			this.resizefunc = this.getProxy(function()
			{
				this.onWindowResize(this);
			});
		}
		jQuery(window).bind('resize',this.resizefunc);
	}
	
});

/**
 * reference to application Default = Banana.Application
 * @param {Banana.Application} app
 */
Banana.Page.prototype.setApplication = function(app)
{
	this.application = app;
};

/**
 * @return {Banana.Application}
 */
Banana.Page.prototype.getApplication = function()
{
	return this.application;
};


/**
 * Starting point to initialize new page render.
 * The application is responsible for calling this method
 *
 * @param {mixed} target could be a string or object. in case of string we assume we have a dom id.
 */
Banana.Page.prototype.run = function(target)
{
	this.validationControls = {};
	
	this.initRender(this, target || this.getApplication().settings.renderTarget);
};


/**
 * initialize rendering process
 *
 * @param {Banana.Control} control
 * @param {Banana.UiControl} target
 * @param {Banana.UiControl} place optional replace control
 * @param {boolean} wasRendering true if this control is already in a rerender phase
 * @param {boolean} parentRerendering true when parent control is currently rerendering
 */
Banana.Page.prototype.initRender = function(control,target,place,wasRerendering,parentRendering)
{ 
	this.rendering = true;
	
	if (wasRerendering)
	{
		//if the page was already rerendering we dont need to render this action again
		//we still need to rerender and register events on the control.
		this.renderControl(control,target,place);
		this.rendering = false;
		this.recursiveRegisterEvents(control);
		return; 
	}
	
	this.isRendered = false;

	this.initializeControl(control,target);

	this.renderControl(control,target,place);

	this.isRendered = true;
	this.setVisible(true);

	//some controls are not Banana.Controls but plain text
	if (control && control.triggerEvent)
	{
		control.triggerEvent('renderComplete',this);
	}
	
	
	//if parent is already rendering we dont have to register events
	//parent control will do that for us
	if (!parentRendering)
	{
		this.recursiveRegisterEvents(control);
		
		//only set this boolean to false when parent is not rerendering. then the parent will eventualy make sure that
		//this bool will be false
		this.rendering = false;
		
		this.parentFirstTimeRendering = false;
	}
	
	this.recursiveUpdateDisplay(control);
};

/**
 * rerenders control
 *
 * @param {Banana.Control} control
 */
Banana.Page.prototype.rerender = function(control)
{
	///this bool is needed in the following situation:
	// call method updatedisplay on child controls from current method updatedisplay 
	// creates a situation that the the isRerendering bool is set to false in the first updatedisplay
	// updatedisplay A -> isRerendering = true 
	// updateDisplay B -> isRerendering = true
	// updateDisplay B is finished we set isRerendering to false
	// updateDisplay A is not finished yet and still needs to register events. but isRerendering is false
	// to prevent this situation we added this bool
	var parentRerendering = this.isRerendering;
	var parentRendering = this.rendering;
	 
	//exception case
	if (parentRendering && !parentRerendering)
	{
		this.parentFirstTimeRendering = true;
	}
	
	this.isRerendering = true;
	
	if (!parentRendering)
	{
		this.recursiveUnRegisterEvents(control);
	}
	
	var orig = control.getFirstUiControl();
	var parentControl = orig.getParent();

	this.initRender(control, parentControl, orig,parentRerendering,parentRendering);
	
	// Restore this.isRerendering
	this.isRerendering = parentRerendering;
};

/**
 * sets content placeholder page
 *
 * @param {Banana.PageTemplate} ph
 */
Banana.Page.prototype.setContentPlaceHolder = function(ph)
{
	this.contentPlaceHolder = ph;
};

/**
 * gets content placeholder
 *
 * @return  {Banana.PageTemplate}
 */
Banana.Page.prototype.getContentPlaceHolder = function()
{
	return this.contentPlaceHolder;
};


/**
 * Hides loader
 */
Banana.Page.prototype.hideLoader = function()
{
	if (!this.loader) {return;}
	this.loader.hide();
};

/**
 * Datasets are to centralize data storage of your controls
 * You can either use stand alone datasets and manually assign them to your controls or 
 * add datasets to the page and let the page automatically handle the data.
 *
 * @param {String} id for the dataset
 * @param {Banana.Data.DataSet} the dataset
 */
Banana.Page.prototype.addDataSet = function(id,d)
{
	if (this.dataSets[id])
	{
		log.warning('Dataset id "'+id+'" already exists');
		return;
	}
	d.id = id;

	this.dataSets[id] = d;
};

/**
 * @return Banana.Data.DataSet
 *
 * @param string id of the dataset
 */
Banana.Page.prototype.getDataSet = function(id)
{
	return this.dataSets[id];
};

/**
 *	removes all datasets from page
 */
Banana.Page.prototype.removeDataSets = function()
{
	var index;
	for (index in this.dataSets)
	{
		if (typeof(this.dataSets[index]) === 'function') { continue;}

		this.dataSets[index].clear();
	}
	
	this.dataSets = [];
};

/**
 * validates all controls 
 *
 */
Banana.Page.prototype.isValid = function()
{
	return Banana.Util.ValidationManager.validateAll();
};

/**
 * initialize controls
 * this method walks through all controls and sets the following things
 *
 * clientId -> for all Banana.Controls
 * parent -> parent control holding this control
 * page -> reference to the page
 *
 * Page also automatically binds controls to their datasets
 *
 * @param {Banana.Control} control
 * @param {Banana.Control} target control used to determine parent
 */
Banana.Page.prototype.initializeControl = function(control,target)
{
	//only handle banana controls
	if (!(control instanceof Banana.Control))
	{
		return;
	}

	//if the target is not a ui control we fetch the first anchester which is a ui control
	if (target instanceof Banana.Control)
	{
		if (!control.clientId)
		{
			control.setClientId(target.getClientId()+'-'+this.uniqueId++);
		}
	}
	//if the target is just a string then we assume it the first element
	else
	{
		var sn = this.getApplication().settings.applicationName;
		
		if (sn)
		{
			control.setClientId(sn+this.uniqueId++);
		}
		else
		{
			control.setClientId(this.uniqueId++);
		}
	}

	control.setParent(target);
	control.setPage(this);
	
	if (!control.isInitialized)
	{
		/*
		@createComponents Method is applied on all controls during creation of the page. 
		In this state thi
		*/
		control.createComponents();
		control.isInitialized = true;
		
		//bs/bd[0] = dataset name
		//bs/bd[1] = dataset property name
		var bs = control.bindedDataSource;
		if (bs)
		{
			if (this.getDataSet(bs[0]))
			{
				this.getDataSet(bs[0]).bindControlToDataSource(control);
			}
		}
	
		var bd = control.bindedData;
		if (bd)
		{
			if (this.getDataSet(bd[0]))
			{
				this.getDataSet(bd[0]).bindControlToData(control);
			}
		}
	}
	
	// Because in the create components other controls can be added, we
	// call this function after the createComponents
	var childs = control.getControls(); 

	var i, len;
	for (i = 0, len = childs.length; i < len; i++)
	{
		this.initializeControl(childs[i],control);
	}
};

/**
 * We render the control by fetching all html data from the control.
 *
 * @param {Banana.Control|String} control Control which should be rendered.
 * @param {Banana.Control} target The target where the control should be rendered in.
 * @param {Banana.Control} place (optional) If given we replace the old control html data with new data
 */
Banana.Page.prototype.renderControl = function(control,target,place)
{
	if (control instanceof Banana.Control)
	{
		var data = control.getHtml(true); 
	}
	else
	{
		data = control;
	}

	if (place)
	{
		Banana.Util.DomHelper.replace(data,place);
	}
	else
	{
		Banana.Util.DomHelper.render(data,target);
	}
};


/**
 * Call updateDisplay on all controls in the hierarchy
 *
 * Controls can perform post-render actions in this function. These
 * will also be called on rerender.
 *
 * As a side-effect, the isRendered-property of all controls will be set.
 * This should happen in the {@link #renderControl}-function, but we don't
 * have a recursive pass there.
 *
 * Events are not registered yet in updateDisplay!
 *
 * @param {Banana.Control|string} control Control which is rendered
 */
Banana.Page.prototype.recursiveUpdateDisplay = function(control)
{
	if (control instanceof Banana.Control)
	{
		// TODO: a parent control asking a child control to be rendered returns false.
		// but in reality it is rendered. This flag should be moved to earlier phase
		control.isRendered = true;

		control.updateDisplay();

		var childs = control.getControls();

		var i, len;

		for (i = 0, len = childs.length; i < len; i++)
		{
			this.recursiveUpdateDisplay(childs[i]);
		}
	}
};


/**
 * Register all binded events to control
 *
 * @param {Banana.Control|string} control
 */
Banana.Page.prototype.recursiveRegisterEvents = function(control)
{
	if (control instanceof Banana.Control)
	{
		control.registerEvents();
		var childs = control.getControls();

		var i, len;
		for (i = 0, len = childs.length; i < len; i++)
		{
			this.recursiveRegisterEvents(childs[i]);
		}
	}
};

/**
 * unregister events from control
 *
 * @param {Banana.Control} control
 */
Banana.Page.prototype.recursiveUnRegisterEvents = function(control)
{
	if (control instanceof Banana.Control)
	{
		control.onPreInvalidateContents();
		control.unregisterEvents();

		if (control instanceof Banana.Control)
		{
			var childs = control.getControls();

			var i, len;
			for (i = 0, len = childs.length; i < len; i++)
			{
				this.recursiveUnRegisterEvents(childs[i]);
			}

		}
	}
};

/**
 * completely removes a control from dom and data model
 *
 * @param Banana.Control
 * @param bool dont remove dom when true. this is an optimalisation.
 * from the controls which are getting removed, the root items (the one user want to remove) should
 * be treated differently.
 *
 * <Root item>                               -  <ChildItems>
 * parent control collection altered            parent control collection stays
 * call dom remove                              dont call dom remove (done in root)
 *
 */
Banana.Page.prototype.removeControl = function(control,dontRemoveDom)
{
	if (!(control instanceof Banana.Control))
	{
		return;
	}

	var childs =  control.controls.slice(); //slice to clone

	var i;
	for (i = childs.length-1; i >= 0; i--)
	{
		this.removeControl(childs[i],true);
		childs.pop();
	}

	control.unregisterEvents();
	
	control.unload();

	//if our control got a parent, then we also need to remove it from the parent array controls
	//we only do this is we directly call remove on this control, otherwise we remove the controls array anywayy
	var parent = control.parent;

	if (parent)
	{
		var indexInParent = parent.controls.indexOf(control);

		parent.controls.splice(indexInParent,1);
	}

	//delete all props to prevent memory leaks ---> Does it really helps????
//	var prop;
//	for (prop in control)
//	{
//		if (prop !== 'parent')
//		{
//			delete control[prop];
//		}
//	}

	control = undefined;	
};


/**
 * clears a control by removing all children
 *
 * @param {Banana.Control} control
 */
Banana.Page.prototype.clearControl = function(control)
{
	var childs = control.getControls().slice();

	var totalCleared = 0;

	var i, len;
	for (i = 0, len = childs.length; i < len; i++)
	{
		totalCleared++;
		this.removeControl(childs[i],true);
	}

	control.controls = null;

	childs = null;

	//TODO added this to also remove non object controls ie strings.
	//move this to domhelper.js
	jQuery('#'+control.getClientId()).empty();
};

/**
 * removes complete page plus all its controls/events/binds and dom data
 * We traverse through child controls in a async operation. This is needed
 * to prevent slow script running detects by various browsers
 *
 * @param {boolean} keepDom when true we dont remove the dom
 */
Banana.Page.prototype.remove = function(keepPageDom,cb)
{
	//get flatten depth first collection of control hierargie 
	var flat = Banana.Util.flattenTreeDepthFirst(this,'controls');
	
	flat.pop(); //remove the last page which is {this} we handle {this} is the complete event
	
	Banana.Util.arrayInteratorAsync(flat,this.getProxy(function(control,i){
		
		if (!(control instanceof Banana.Control))
		{
			return;
		}
			
		control.unregisterEvents();
		control.unload();
						
		var parent = control.parent;
		
		if (parent && parent.controls)
		{
			parent.controls.splice(parent.controls.indexOf(control),1);
		}
		control = undefined;	
	}),
	0, //timeout for each chuck
	this.getProxy(function(){ //callback called after completion
		
		this.unload();
		
		//remove all validators
		Banana.Util.ValidationManager.removeValidators();

		this.clearIds();
		
		//if we clear the page we also need to unregister the resize event. otherwise the callback will always
		//be called after screensize changes.
		jQuery(window).unbind();

		this.unbind();
		this.removeDataSets();
		
		clearTimeout(this.timer);

		if (!keepPageDom)
		{
			Banana.Util.DomHelper.remove(this);
		}
		
		jQuery('#debug').remove();
		clearTimeout(this.debugTimer);
		
		if (cb){
			cb();
		}	
	})
	,this.getProxy(function(){
		
		//not implemented here
	}));
};

/**
 * used internally -> should move to another location
 * @ignore
 */
Banana.Page.prototype.removeDom = function()
{
	jQuery('#cleared').remove();
};

/**
 * @ignore
 */
Banana.Page.prototype.clearProps = function()
{
//	var prop;
//	for (prop in this)
//	{
//		//this[prop] = undefined;
//	}
};

/**
 *
 * @param Banana.UiControl
 */
Banana.Page.prototype.onWindowResize = function(control)
{
	if (control instanceof Banana.UiControl)
	{
		control.onWindowResize();

		var childs = control.getControls();

		var i, len;
		for (i = 0, len = childs.length; i < len; i++)
		{
			this.onWindowResize(childs[i]);
		}
	}
};

/**
 * Clears all ids in the page.
 * Used by application during page transition.
 */
Banana.Page.prototype.clearIds = function(control)
{
	if (!control)
	{
		control = this;
	}
	Banana.Util.DomHelper.clearIdsFrom(control.getClientId());
};