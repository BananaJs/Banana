/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Base Control component
 */


/** @namespace Banana.Control */
goog.provide('Banana.Control');

goog.require('Banana.Util.Base');


/**
 * @ignore
@namespace Banana.Controls
*/

/**
@class Class
@name Class
*/

/**
@class Banana
@name Banana
*/

/**
@class
@name Banana.Controls
*/

/** @namespace Banana.Control */
namespace('Banana').Control = Class.extend(
/** @lends Banana.Control.prototype */
{
	/**
	 *  Base control class for component controls in Banana. Provides needed methods to function well in the Banana Hierarchy.
	 *  This control is suitable to use in your render hierarchy. Note that this control won't be
	 *  rendered. Possible child controls can have visually different parent controls 
	 *  than the internal control collection would suggest.
	 *    
	 *  @constructs
	 *  @extends Class
	 */
	init : function()
	{
		//generate a unique id (note a internal id representation)
		this.generateUniqueId();
		this.customId = false; // flag if page sets id
		this.binds = [];
		this.controls = [];
		this.debug = false;
	},

	/**
	 * This method is called by the page during creation of the control.
	 * This is the place to define your control hierarchy. 
	 * Unlike the constructor (init) you have also access to properties 
	 *  
	 * 1. this.page - Reference to the page control
	 * 2. this.parent - Reference to the parent control
	 * 3. this.id - internal id
	 * 4. this.clientId - client id of the dom node
	 * 
	 * Except for these properties there is no difference. It doesn't really matters 
	 * if you create child controls in the init or in the createComponents methods.
	 * Only if you need access to the parent or page control. 
	 * Or when you need to know what the id or client is. 
	 * You will find out that in most cases createComponents is the right place to do things.
	 * Note: that createComponents is called only once. Rerendering doesn't result into a call
	 * to createComponents 
	 * Another important note is that both init and createComponents methods are executed before 
	 * even one thing is rendered on your screen.The clientId is already known, 
	 * but you cannot access the dom node. To get access to the dom you need the updateDisplay() method.
	 */
	createComponents : function(){},

	/**
	 * The method is called by the page after the dom element is rendered.
	 * If you want to add controls to the collection don't forget to invalidate by calling
	 * invalidateDisplay()
	 */
	updateDisplay : function(){},

	/**
	 * called after invalidating control with invalidateDisplay method
	 */
	onPreInvalidateContents : function(){},

	/**
	 * called just before destroying object
	 * Use this method to manualy destroy other objects i.e to prevent memory leaks
	 */
	unload : function(){},

	/**
	 * called on every display size change
	 */
	onWindowResize : function(){}

});

/**
 * @param {Function} fn function to apply to all children in control collection
 */
Banana.Control.prototype.applyToChildren = function(fn)
{
	var args = this.applyToChildren.arguments;
	args.shift();
	var i;
	for (i = 0, len = this.controls.length; i < len; i++)
	{
		fn.apply(this,args);
	}
};
/**
 * sets internal id
 * @param {String} id of control
 * @return {this}
 */
Banana.Control.prototype.setId = function(id)
{
	this.id = id;
	this.customId = true;
	return this;
};

/**
 * @return {String} id of control
 */
Banana.Control.prototype.getId = function()
{
	return this.id;
};

/**
 * sets client id used for reference to dom node
 * @param string
 */
Banana.Control.prototype.setClientId = function(cid)
{
	this.clientId = cid;
};

/**
 * @return {String}
 */
Banana.Control.prototype.getClientId = function()
{
	return this.clientId;
};

/**
 * generated unique id used for dom elements
 */
Banana.Control.prototype.generateUniqueId = function()
{
	this.id = Banana.Util.generateUniqueId();
};

/**
 * forces control to be rendered. Only this function to bypass the page logic
 * i.e you want to render a control which is not part of a control hierarchy
 *
 * @param {Banana.Control} control
 */
Banana.Control.prototype.render = function(control)
{
	this.getPage().initRender(control,this,null,null,false);
};

/**
 * sets reference to the page control
 * @param {Banana.Page} page
 */
Banana.Control.prototype.setPage = function(page)
{
	this.page = page;
};

/**
 * @return {Banana.Page} 
 */
Banana.Control.prototype.getPage = function()
{
	return this.page;
};

/**
 * This method is most useful for attaching event handlers to an element
 * where the context is pointing back to a different object.
 * @return {Function} fn
 */
Banana.Control.prototype.getProxy = function(fn)
{
	return jQuery.proxy(fn,this);
};

/**
 * Sets reference to parent control. This method is automatically invoked during page construction
 * @param {Banana.Control} parent 
 */
Banana.Control.prototype.setParent = function(parent)
{
	this.parent = parent;
};

/**
 * @return {Banana.Control} parent control
 */
Banana.Control.prototype.getParent = function()
{
	return this.parent;
};

Banana.Control.prototype.getEnabled = function(){};

/**
 * Adds a plaintext or a control to the control hierargy.
 * Adding control after render requires call to invalidateDisplay in order to get
 * the new control rendered visible
 * @param {mixed} String or Banana.Control
 */
Banana.Control.prototype.addControl = function(c)
{
	this.controls.push(c);
	return this;
};

/**
 * @return {Array} of collection of mixed types
 */
Banana.Control.prototype.getControls = function()
{
	return this.controls;
};

/**
 * Recursively finds control 
 *
 * @param {String} id of the control
 * @return Banana.Control
 */
Banana.Control.prototype.findControl = function(id)
{
	if (id === this.getId())
	{
		return this;
	}
	else
	{
		var childs = this.getControls();

		if (!childs) { return null;}
		
		var i,len;
		for (i = 0, len = childs.length; i < len; i++)
		{
			if (childs[i] instanceof Banana.Control)
			{
				var foundcontrol = childs[i].findControl(id);

				if (foundcontrol)
				{
					return foundcontrol;
				}
			}
		}
	}
	return null;
};

/**
 * removes this control with all its children
 */
Banana.Control.prototype.remove = function()
{
	if (this.getPage() instanceof Banana.UiControl)
	{
		this.getPage().removeControl(this);
	}
};

/**
 * removes all child controls in this control
 */
Banana.Control.prototype.clear = function()
{
	if (this.getPage() instanceof Banana.UiControl)
	{
		this.getPage().clearControl(this);
	}
	this.controls = [];
};

/**
 * invalidates display. triggers the page to re-render node tree beginning from this control.
 */
Banana.Control.prototype.invalidateDisplay = function()
{
	var page = this.getPage();
	if (page && page.isRendered)
	{
		page.rerender(this.getFirstUiControl());
	}
};

/**
 * Triggers an event so all listeners are getting notified.
 *
 * To start listening use the bind method. example:
 * 
 * someControl.bind('test',function(){});
 *  
 * To Trigger an event. example
 *  
 * someControl.triggerEvent('test',{data:'foo'});
 *
 * @param {String} name of the event
 * @mixed {mixed} params of any type
 */
Banana.Control.prototype.triggerEvent = function(name,params)
{
	jQuery(this).trigger(name,params);
};

/**
 * @return {Array} of dom event types compatible with jquery
 */
Banana.Control.prototype.getDomEventTypes = function()
{
	return ['mousedown',
	        'mousemove',
	        'resize',
			'mouseup',
			'ready',
			'click',
			'dblclick',
			'error',
			'ready',
			'select',
			'submit',
			'focusin',
			'focusout',
			'focus',
			'change',
			'mouseover',
			'mouseleave',
			'mouseenter',
			'mouseout',
			'keypress',
			'keyup',
			'keydown'
	        ];
	
};

/**
 * Binds an eventname to a method
 * There are 2 types of events:
 * Dom events: Events mostly fired from user actions like mouse click, keyup etc.
 * Custom events: These events are manually triggered by Banana components. 
 * 
 * Important is that dom events are available after the control is rendered. 
 * Custom events are registered instantly and available at all time.
 * 
 * @param {String} name of the event
 * @param {Function} func callback function
 * @param {mixed} data userdata
 * 
 * @return {this};
 */
Banana.Control.prototype.bind = function(name, func, data)
{
	if (!this.binds)
	{
		this.binds = [];
	}

	//dont bind duplicate name and functions
	if (this.hasBind(name,func))
	{
		return false;
	}

	if (this.getDomEventTypes().indexOf(name) !== -1)
	{
		//collect the dom events. which can only be registered after rendering
		this.binds.push({'name':name,'func':func,'data':data,'type':Banana.Controls.EventTypes.DOM_EVENT});

		this.debugEvent(Banana.Controls.EventTypes.DOM_EVENT, name, "Bind normal");
		
		if (this.isRendered)
		{
			jQuery('#'+this.getClientId()).bind(name,data,func);
		}
	}
	//custom events can be binded directly. no need to put these in an array for later bind
	//since we also call unbind on all objects, 
	else
	{
		this.debugEvent(Banana.Controls.EventTypes.CUSTOM_EVENT, name, "Bind directly");
		
		this.binds.push({'name':name,'func':func,'data':data,'type':Banana.Controls.EventTypes.CUSTOM_EVENT});
		jQuery(this).bind(name, data, func);
	}

	return this;
};

/**
 * Check wether a bind to a specific function in a control exists
 *
 * @param {String} name of event
 * @param {Function} func
 * @return {boolean} 
 */
Banana.Control.prototype.hasBind = function(name,func)
{
	if (!this.binds)
	{
		this.binds = [];
	}

	var i,len;
	for (i = 0, len = this.binds.length; i < len; i++)
	{
		var b = this.binds[i];

		if (func)
		{
			//dont bind duplicate name and functions
			if (b.name === name && (func.guid === b.func.guid || b.func === func))
			{
				return true;
			}
		}
		else
		{
			if (b.name === name)
			{
				return true;
			}
		}
	}
	return false;
};

/**
 * Unbinds an eventname
 * If funcion is given we unbind only when the bind matches the given function.
 * Otherwise we unbind all binds with the specified name regardless how many.
 * 
 * @param {String} name of event
 * @param {Function} func optionaly 
 */
Banana.Control.prototype.unbind = function(name,func)
{
	var i,len;
	for (i = 0, len = this.binds.length; i < len; i++)
	{
		var b = this.binds[i];
		
		this.debugEvent(3, name, "Unbind");
		
		if (!func)
		{
			if (this.getDomEventTypes().indexOf(name) !== -1)
			{
				jQuery('#'+this.getClientId()).unbind(name);
			}
			else
			{
				jQuery(this).unbind(name);
			}

			this.binds.splice(i,1);
		}
		else if (b.name === name && (func.guid === b.func.guid || b.func === func))
		{
			if (this.getDomEventTypes().indexOf(name) !== -1)
			{
				jQuery('#'+this.getClientId()).unbind(name, func);
			}
			else
			{
				jQuery(this).unbind(name, func);
			}
			
			jQuery(this).unbind(name, func);
			this.binds.splice(i,1);
		}
	}
};

/**
 * register all binded events
 * used by framework.
 * @ignore
 */
Banana.Control.prototype.registerEvents = function()
{
	if (!this.binds)
	{
		return;
	}

	var i,len;
	for (i = 0, len = this.binds.length; i < len; i++)
	{
		var name = this.binds[i].name;
		var func = this.binds[i].func;
		var data = this.binds[i].data;
		var type = this.binds[i].type;
		
		//there is a difference between dom and data events. dom events can be registered only
		//when the dom elements are rendered. data events can be registered right when object are instantiated
		//if we bind an custom event during construction (before dom render, no rerender has occured) we want it instant to be registered
		//because this function is called after rendering and rerendering we only need to bind the custom events
		//after a RE-rerender, cause rerendering always starts with unbinding ALL events.
		if (type === Banana.Controls.EventTypes.CUSTOM_EVENT && this.getPage().isRerendering)
		{		
			this.debugEvent(type, name, "Register event");
			
			if (data)
			{
				jQuery(this).bind(name,data,func);
			}
			else
			{
				jQuery(this).bind(name,func);
			}
		}
		else
		{
			this.debugEvent(type, name, "Ignore register event");
			//no need to bind this event,
		}
	}
};

/**
 * Unregisters all binded events.
 * note we dont touch the bind array, cause we might rebind it at a later moment. 
 * @ignore
 */
Banana.Control.prototype.unregisterEvents = function()
{
	if (!this.binds)
	{
		return;
	}

	this.debugEvent(3, "", "Unregister all events CONTROL");

	jQuery(this).unbind(); //and all custom events
};

/**
 * returns html string of all child controls
 * Note that Banana.Control type classes on it self won't get rendered.
 * 
 * note Banana.control itself wont be rendered, but it chould contain child controls
 * which are from Banana.UiControl type
 *
 * @param {boolean} markAsRendered 
 * @return {String}
 */
Banana.Control.prototype.getHtml = function(markAsRendered)
{
	var html = [];

	var childs = this.getControls();

	var i,len;
	for (i =0, len = childs.length; i < len; i++)
	{
		if (childs[i] instanceof Banana.Control)
		{
			html.push(childs[i].getHtml(markAsRendered));
		}

		else if (typeof(childs[i]) === 'string')
		{
			html.push(childs[i]);
		}
	}

	return html.join('');
};

Banana.Control.prototype.debugEvent = function(type,eventname,message)
{
	if (!this.debug) return;
	
	if (this.id !== 'debugme')
	{
		return;
	}
	if (type === Banana.Controls.EventTypes.DOM_EVENT)
	{
		console.log(message,'dom',eventname,this.id);
	}
	else if (type === Banana.Controls.EventTypes.CUSTOM_EVENT)
	{
		console.log(message,'customevent',eventname,this.id);
	}
	else if (type === 3)
	{
		console.log(message,'all events',eventname,this.id);
	}
};

/**
 * fetches the first parent control which is an instance of Banana.UiControl
 * @return {Banana.Control}
 */
Banana.Control.prototype.getFirstUiControl = function()
{
	if (this instanceof(Banana.UiControl) && !this.markAsNonRender)
	{
		return this;
	}
	else
	{
		if (this.parent)
		{
			return this.parent.getFirstUiControl();
		}
	}

	return null;
};