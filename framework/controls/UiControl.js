/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Usi Control component is the base class for all renderable controls.
 */

goog.provide('Banana.UiControl');

goog.require('Banana.Control');

/** @namespace Banana.UiControl */
namespace('Banana').UiControl = Banana.Control.extend(
/** @lends Banana.UiControl.prototype */
{
	/**
	 * @constructs
	 * @extends Banana.Control
	 */
	init: function()
	{
		this._super();
		this.css = {};
		this.style = '';
		this.isRendered = false;
		this.visible = true; //default is visible
		this.enabled = true;
	},

	/**
	 * Adds control to collection
	 * Normally you would add control prior to the render phase. If this is not the case
	 * and you need to instantly render the control. autoRender should be true
	 * 
	 * @param {mixed} Banana.Control or plain text
	 * @param {boolean} true when render should occur instantly
	 */
	addControl : function(c,autoRender)
	{
		//when a control is added on a already initialized control, we recall the initialization
		//otherwise the control wont have a proper client id/databind and references to various objects
		//TODO is this a performance hit, cause sometimes it is not needed
		if (this.isInitialized)
		{
			if (autoRender)
			{
				//the render function also contains initializeControls, but we dont know if our item got sibblings, if so the client id should be amount of sibblings+1
				this.getPage().initializeControl(c,this,false,this.controls.length+1);
				this.render(c);
			}
			else
			{
				this.getPage().initializeControl(c,this,false,this.controls.length+1);
			}
		}

		return this._super(c);
	}
});

/*
 * @return object jquery dom writer
 */
Banana.UiControl.prototype.getDomWriter = function()
{
	return jQuery('#'+this.getClientId());
};

/**
 * @return string tag name of control
 * overwrite this function to use your own tags. ie <div> <a> <p> <input> <label>
 */
Banana.UiControl.prototype.getTagName = function(){return '';};

/**
 *@deprecated Use the getDimensions() call
 */
Banana.UiControl.prototype.getDemensions = function()
{
	return this.getDimensions();
};

/**
 * Computes widht,height and left right offsets
 * 
 * @return {Object} of dimensions
 */
Banana.UiControl.prototype.getDimensions = function()
{
	var params = {};

	params.height = jQuery('#'+this.getClientId()).height();
	params.width = jQuery('#'+this.getClientId()).width();
	params.offset = jQuery('#'+this.getClientId()).offset();

	return params;
};

/**
 * sets client id used to reference dom node. This method is auto called by the page 
 * @param {String} cid
 */
Banana.UiControl.prototype.setClientId = function(cid)
{
	this.clientId = cid;
};

/**
 * @return {String} reference to the dom node id
 */
Banana.UiControl.prototype.getClientId = function()
{
	return this.clientId;
};

/**
 * Triggers an event which will notify all listeners
 * Optionally data can be send along.
 * 
 * @param {String} name of the event to be triggered
 * @param {mixed} data
 */
Banana.UiControl.prototype.triggerEvent = function(name,data)
{
	if (this.getDomEventTypes().indexOf(name) !== -1)
	{
		if (this.isRendered)
		{
			jQuery('#'+this.clientId).trigger(name,data);
		}
	}
	else
	{
		jQuery(this).trigger(name,data);
	}
};

/**
 * Saves key value in a cookie
 * Note that saved states are always unique for a page.
 *
 * @param {String} name of the state
 * @param {String} value
 * 
 * @return {this}
 */
Banana.UiControl.prototype.setState = function(name,value)
{
	// We want the state to be unique for every page and control id
	var page = Banana.Util.UrlManager.getModule('section');
	// check if control id is set
	var id = this.getClientId();
	if (this.customId)
	{
		id = this.getId();
	}
	Banana.Util.StateManager.setState(page + '-' + id + '-' + name, value);
	
	return this;
};

/**
 * Retreives a saved state
 *
 * @param {String} name of state
 * @return {String}
 */
Banana.UiControl.prototype.getState = function(name)
{
	var page = Banana.Util.UrlManager.getModule('section');
	// check if control id is set
	var id = this.getClientId();
	if (this.customId)
	{
		id = this.getId();
	}
	
	return Banana.Util.StateManager.getState(page + '-' + id + '-' + name);
};

/**
 * Removes a saved state
 *
 * @param {String} name of state
 * @return {String}
 */
Banana.UiControl.prototype.removeState = function(name)
{
	var page = Banana.Util.UrlManager.getModule('section');
	// check if control id is set
	var id = this.getClientId();
	if (this.customId)
	{
		id = this.getId();
	}
	
	return Banana.Util.StateManager.removeState(page + '-' + id + '-' + name);
};

/**
 * Composes attributes for usuage in html tags.
 * @return {Object} of attributes
 */
Banana.UiControl.prototype.getAttributes = function()
{
	var attributes = {};

	if (this.attributes)
	{
		attributes = this.attributes;
	}

	attributes['id'] = this.getClientId();
	attributes['style'] = this.getStyle();

	if (this.getCss())
	{
		var css = [];
		for (prop in this.getCss())
		{
			cssPart = prop + ':' + this.getCss()[prop] + ';';
			css.push(cssPart);
		}

		attributes['style'] += css.join('');
	}

	if (this.getCssClass().length > 0)
	{
		attributes['class'] = this.getCssClass().join(' ');
	}

	return attributes;
};

/**
 * sets attribute
 * depending on the type of key we set prop or attr
 * 
 * see http://blog.jquery.com/ for more information
 * @param {String} key
 * @param {String} value
 * @return {this}
 */
Banana.UiControl.prototype.setAttribute = function(key,value)
{
	if (this.isRendered)
	{
		switch(key)
		{
			case 'async':	
			case 'autofocus':
			case 'checked':
			case 'location':
			case 'multiple':
			case 'readOnly':
			case 'selected':
			case 'autoplay':
			case 'controls':
			case 'defer':
			case 'disabled':
			case 'hidden':
			case 'loop':
			case 'open':
			case 'scoped':	
			
			jQuery('#'+this.getClientId()).prop(key,value);	
				
			break;	
		
			default:
			jQuery('#'+this.getClientId()).attr(key,value);	
		}
	}
	var attr = this.getAttributes();
	attr[key] = value;
	this.attributes = attr;
	return this;
};

/**
 * @String key of the attribute which should be removed
 */
Banana.UiControl.prototype.removeAttribute = function(key)
{
	if (this.isRendered)
	{
		switch(key)
		{
			case 'async':	
			case 'autofocus':
			case 'checked':
			case 'location':
			case 'multiple':
			case 'readOnly':
			case 'selected':
			case 'autoplay':
			case 'controls':
			case 'defer':
			case 'disabled':
			case 'hidden':
			case 'loop':
			case 'open':
			case 'scoped':	
			
			jQuery('#'+this.getClientId()).removeProp(key);	
				
			break;	
		
			default:
			jQuery('#'+this.getClientId()).attr(key,"");	
		}
	}
	
	if (this.attributes && this.attributes[key])
	{
		delete this.attributes[key];
	}
	
	return this;	
};

/**
 * @param {String} key of the attribute
 * @return {String} attribute by key
 */
Banana.UiControl.prototype.getAttribute = function(key)
{
	if (!this.attributes)
	{
		return null;
	}
	return this.attributes[key];
};

/**
 * NOTE: use setCss() instead to directly apply it to dom
 * @param {String} style of this control. by css definitions
 * @return {this}
 */
Banana.UiControl.prototype.setStyle = function(style)
{
	this.style = style;
	return this;
};

/**
 * @return {String}
 */
Banana.UiControl.prototype.getStyle = function()
{
	return this.style;
};

/**
 * adds css style in object key value style. 
 * @param {Object} css example {width:'100px',left:0};
 */
Banana.UiControl.prototype.addCss = function(css)
{
	var nc = {};
	for (prop in this.getCss())
	{
		nc[prop] = this.getCss()[prop];
	}
	for (prop in css)
	{
		nc[prop] = css[prop];
	}
	this.css = nc;
};

/**
 * adds css style and instantly apply it to dom if rendered
 *
 * @param {Object} css
 */
Banana.UiControl.prototype.setCss = function(css)
{
	this.addCss(css);

	if (this.isRendered)
	{
		jQuery('#'+this.getClientId()).css(this.css);
	}
	
	return this;
};

/**
 * @return {Object} of css properties in key value format
 */
Banana.UiControl.prototype.getCss = function()
{
	return this.css;
};

/**
 * @return {String} value of css property
 */
Banana.UiControl.prototype.getStyleProperty = function(prop)
{
	return this.css[prop] || jQuery('#'+this.getClientId()).css(prop);
};

/**
* @return {Array} of currently added css classes
*/
Banana.UiControl.prototype.getCssClass = function()
{
	if (!this.cssClass) 
	{
		this.cssClass = [];
	}
	return this.cssClass;
};

/**
 * Adds css class. this will be instantly applied to dom if rendered
 *
 * @param {String} css name of css class
 */
Banana.UiControl.prototype.addCssClass = function(css)
{
	if (!this.cssClass) 
	{
		this.cssClass = [];
	}
	
	if (!this.hasCssClass(css)) {
		this.cssClass.push(css);
	
		if (this.isRendered)
		{
			jQuery('#'+this.getClientId()).addClass(css);
		}
	}

	return this;
};

/**
 * removes css class. this will be instantly applied to dom
 *
 * @param {String} css name of css class
 */
Banana.UiControl.prototype.removeCssClass = function(css)
{
	if (!this.cssClass) 
	{
		return this;
	}
	
	var indexOf = this.cssClass.indexOf(css);
	
	if (indexOf != -1)
	{
		this.cssClass.splice(indexOf,1);
		
		if (this.isRendered)
		{
			jQuery('#'+this.getClientId()).removeClass(css);
		}
	}

	return this;
};

/**
 * Switch the old Css class with a new one
 * 
 * @param {String} oldClass Old CSS class to replace
 * @param {String} newClass New CSS class to add
 */
Banana.UiControl.prototype.switchCssClass = function(oldClass, newClass)
{
	this.removeCssClass(oldClass);
	this.addCssClass(newClass);	
	return this;	
};

/**
 * @return {boolean}
 */
Banana.UiControl.prototype.hasCssClass = function(search)
{
	if (this.isRendered) {
		return jQuery('#'+this.getClientId()).hasClass(search);
	}
	
	if (jQuery.inArray(search, this.getCssClass()) >= 0)
	{
		return true;
	}
	return false;
};

/**
 * return string representation of html attributes. used by renderer
 *
 * @return {String}
 */
Banana.UiControl.prototype.getHtmlAttributes = function()
{
		var attributes =this.getAttributes();
		var data = [];
		var attr;
		for (attr in attributes)
		{
			if (attributes[attr])
			{
				if (attributes[attr] != 'undefined')
				{
					data.push(attr+'="'+attributes[attr]+'" ');
				}
			}
		}
		data = data.join('');

		return data;
};

/**
 * makes control visible or invisible.
 *
 * @param {boolean} v true when visible
 * @param {String} speed animation speed of hiding/ showing
 * @param {String} type of animation
 * @param {Function} callback when finished
 */
Banana.UiControl.prototype.setVisible = function(v,speed,type,callback)
{
	this.triggerEvent('onSetVisible',v); //trigger this first to prevent flickering
	this.visible = v;
	var ignoreDirectAction = false;
	if (v)
	{
		if (this.isRendered)
		{
			if (type === 'fadeIn')
			{
				this.getDomWriter().fadeIn(speed,this.getProxy(function(){
					this.setCss({'display':''});
					if(callback) 
					{
						callback();
					}
				}));
				ignoreDirectAction = true;
			}
			else
			{
				this.getDomWriter().show(speed,this.getProxy(function(){
					this.setCss({'display':''});
					if(callback) 
					{
						callback();	
					}
				}));
			}
		}
		
		if (!ignoreDirectAction)
		{
			this.setCss({'display':''});
		}
	}
	else
	{
		if (this.isRendered)
		{
			if (type === 'fadeOut')
			{
				ignoreDirectAction = true;
				this.getDomWriter().fadeOut(speed,this.getProxy(function(){
					this.setCss({'display':'none'});
					if(callback) 
					{
						callback();	
					}
				}));
			}
			else
			{
				this.getDomWriter().hide(speed,this.getProxy(function(){
					this.setCss({'display':'none'});
					if(callback) 
					{
						callback();	
					}
				}));
			}
		}
		if (!ignoreDirectAction)
		{
			this.setCss({'display':'none'});
		}
		
	}

	return this;
};

/*
 * @return bool true when visible
 */
Banana.UiControl.prototype.getVisible = function()
{
	if (this.isRendered)
	{
		return jQuery('#'+this.getClientId()).is(":visible");
	}
	else
	{
		return this.visible; //note this only works on controls which are directly made invisble not for their childs
	}
};

/**
 * register all binded events
 */
Banana.UiControl.prototype.registerEvents = function()
{
	if (!this.binds && !this.binds.length) 
	{
		return;
	}
	var i, len;
	for (i = 0, len = this.binds.length; i < len; i++)
	{
		var name = this.binds[i].name;
		var func = this.binds[i].func;
		var data = this.binds[i].data;
		var type = this.binds[i].type;

		if (type === Banana.Controls.EventTypes.DOM_EVENT)
		{
			this.debugEvent(type, name, "Register event");

			if (data)
			{
				jQuery('#'+this.getClientId()).bind(name,data,func);
			}
			else
			{
				jQuery('#'+this.getClientId()).bind(name,func);
			}
		}
	//there is a difference between dom and data events. dom events can be registered only
	//when the dom elements are rendered. data events can be registered right when object are instantiated
	//if we bind an custom event during construction (before dom render, no rerender has occured) we want it instant to be registered
	//because this function is called after rendering and rerendering we only need to bind the custom events
	//after a RE-rerender, cause rerendering always starts with unbinding ALL events.
		else if (type === Banana.Controls.EventTypes.CUSTOM_EVENT && this.getPage().isRerendering)
		{
			///	console.log('register '+name + ' on '+this.getId())
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
		//console.log('IGNORE register '+name + ' on '+this.getId())
		//no need to bind this event,
		}
	}
};

/**
 * unregister all binded events.
 * note we dont touch the bind array, cause we might rebind it at a later moment. ie rerender
 * used by framework
 */
Banana.UiControl.prototype.unregisterEvents = function()
{
	if (!this.binds || !this.binds.length) 
	{
		return;
	}

	this.debugEvent(3, name, "Unregister all event");

	jQuery('#'+this.getClientId()).unbind(); //unbind all dom events
	jQuery(this).unbind(); //and all custom events

};

/**
 * sets control enabled /disabled
 * we basicly add a css class. so, make sure your css file contains this css classes
 * TODO this is not nice, can it be done otherwise?
 *
 * @param {boolean} e         True when enabled
 * @param {boolean} recursive Also enable/disable child controls
 */
Banana.UiControl.prototype.setEnabled = function(e, recursive)
{
	this.triggerEvent('onSetEnabled',e);

	if (e)
	{
		this.enabled = true;

		if (this.isRendered)
		{
			jQuery('#'+this.getClientId()+' div').removeClass('disabledDivs');
			jQuery('#'+this.getClientId()+' :input').removeClass('disabledInputs');
			jQuery('#'+this.getClientId()+' :input').removeProp('disabled');
			jQuery('#'+this.getClientId()).removeProp('disabled');
		}
		
		this.removeAttribute('disabled');
		this.removeCssClass('disabledDivs');
		
	}
	else
	{
		this.enabled = false;

		if (this.isRendered)
		{
			jQuery('#'+this.getClientId()+' div').addClass('disabledDivs');
			jQuery('#'+this.getClientId()+' :input').addClass('disabledInputs');
			jQuery('#'+this.getClientId()+' :input').prop('disabled',true);
			this.getDomWriter().show();
		}
		
		this.setAttribute('disabled',true);
		this.addCssClass('disabledDivs');		
	}
	
	if (recursive) {
		var controls = this.getControls();
		var x, len;
		for (x = 0, len = controls.length; x < len; x++) 
		{
			if (controls[x].setEnabled) 
			{
				controls[x].setEnabled(e, recursive);
			}
		}
	}

	return this;
};

Banana.UiControl.prototype.getEnabled = function()
{
	//todo lets jquery figure this out??
	return this.enabled;
};

/**
 * returns html markup string of control + all child controls
 *
 * @return {String}
 */
Banana.UiControl.prototype.getHtml = function(markAsRendered)
{
	var html = [];

	html.push('<'+this.getTagName()+' ');
	html.push(this.getHtmlAttributes());
	html.push('>');
	
	var childs = this.getControls();
	var i, len;
	for (i=0, len = childs.length; i < len; i++)
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

	if (this instanceof Banana.UiControl)
	{
		html.push('</'+this.getTagName()+'>');
	}
	
	//In the update display all the controls + their children should be marked as rendered
	//if we mark controls in the update display as rendered instead of here. we
	//wont know if a child is rendered or not.
	if (markAsRendered)
	{
		this.isRendered = true;
	}

	return html.join('');
};