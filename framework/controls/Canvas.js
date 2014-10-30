/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Html canvas element   
 */
goog.provide('Banana.Controls.Canvas');
goog.require('Banana.UiControl');

/** @namespace Banana.Controls.Canvas */
namespace('Banana.Controls').Canvas = Banana.UiControl.extend(
/** @lends Banana.Controls.Canvas.prototype */	
{
	/**
	 * Creates a Html Canvas element
	 * 
	 * @param {String} type of the canvas.
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init : function(type)
	{	
		this._super();
		this.type = type;
	}	
});

/**
 * Return the context of the canvas
 * 
 * @returns {Object}
 */
Banana.Controls.Canvas.prototype.getContext = function() 
{
	if (!this.context) {
		console.log(this.type)
		this.context = document.getElementById(this.getClientId()).getContext(this.type || "2d");
	}	
	return this.context;
};

/**
 * Clear the Canvas
 * 
 * @returns void
 */
Banana.Controls.Canvas.prototype.clear = function()
{
	var dem = this.getParent().getDemensions();
	var c =this.getContext();
	c.clearRect(0, 0, dem.width, dem.height);
	c.beginPath();	
};

/**
 * @returns String The Tag Name of Canvas
 */
Banana.Controls.Canvas.prototype.getTagName = function()
{
	return 'canvas';
};
