/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Slider
 */

goog.provide('Banana.Controls.DataControls.Slider');

/**
 * more info at http://docs.jquery.com/UI/Slider
 * 
 * TODO jquery plugin ready for more than 1 handle. banana control not yet
 */

/** @namespace Banana.Controls.Slider */
namespace('Banana.Controls').Slider = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.Slider.prototype */
{

	/**
	 * Creates a slider by using jquery ui slider. 
	 * Note that this control is not ready for multiple handles. The jquery ui plugin actually is.
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
		
		this.addCssClass("BSlider");
		
		this.stepSize = 1;
		this.min = 1;
		this.max = 10;
		this.orientation = 'horizontal';
		
		this.bind('slide',this.getProxy(function(e,v){
			
			this.setData(v.value,false,true);
		}));
	},
	
	/**
	 * @param {int} data range 0 to 100. 100 is full progressbar.
	 * @param {boolean} ignoreEvent
	 * @param {boolean} ignoreDom
	 * @return {this}
	 * @override
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		this._super(data,ignoreEvent,ignoreDom);
		
		if (!ignoreDom)
		{
			this.updateElement();
		}
		
		return this;
	},
	
	/**
	 * @override 
	 * this function to add some jquery events which should be handled as dom event
	 */
	getDomEventTypes : function()
	{
		var events = this._super();
		
		events.push('create');
		events.push('slide');
		events.push('change');
		events.push('slidestop');
		events.push('slidestart');
		
		return events;
	},
	
	/**
	 * creates the element 
	 */
	updateElement : function()
	{
		if (!this.isRendered) return;
		
		var options = {};
		options.step = this.stepSize;
		options.min = this.min;
		options.max = this.max;
		
		if (this.getData())
		{
			options.value = this.getData();
		}
		
		jQuery('#'+this.getClientId()).slider(options);	
	},
	
	/**
	 * @override
	 * Here we create the slider itself
	 */
	updateDisplay : function()
	{
		this.updateElement();
	},

	/**
	 * @param {int} size
	 * @return {this
	 */
	setStepSize : function(size)
	{
		this.stepSize = size;
		return this;
	},
	
	/**
	 * @param {int} size
	 * @return {this}
	 */
	setMin : function(size)
	{
		this.min = size;
		return this;
	},
	
	/**
	 * @param {int} size
	 * @return {this}
	 */
	setMax : function(size)
	{
		this.max = size;
		return this;
	},
	
	/**
	 * @param {string} o horizontal or vert
	 * @return {this}
	 */
	setOrientation : function(or)
	{
		this.orientation = or;
		return this;
	}
});