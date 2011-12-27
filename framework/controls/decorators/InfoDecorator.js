/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Info decorator
 */

goog.provide('Banana.Controls.Decorators.InfoDecorator');

/** @namespace Banana.Controls.Decorators.InfoDecorator */
namespace('Banana.Controls.Decorators').InfoDecorator = Banana.Controls.Decorators.Decorator.extend(
/** @lends Banana.Controls.Decorators.InfoDecorator.prototype */
{
	/**
	 * Creates a info decorator which decorates a custom control with a info image with a text tag
	 * 
	 * @param {Banana.UiControl} customControl
	 * @constructs
	 * @extends Banana.Controls.Decorators.Decorator
	 */
	init : function(customControl)
	{
		this._super(customControl);
		
		this.addCssClass('BInfoDecorator');
		
		this.infoImage = new Banana.Controls.Image().addCssClass('BInfoDecoratorInfoImage');
		this.infoImage.setImage("banana/images/infodot.png");
		
		this.addControl(this.infoImage);
		this.addControl(customControl);

		//when custom control becomes visible or invisible so does this control
		customControl.bind('onSetVisible',this.getProxy(this.onSetVisible));
	},
	
	/**
	 * Invoked when setVisible is called
	 * @param {Event} event
	 * @param {Mixed} data
	 */
	onSetVisible : function(event,data)
	{
		this.setVisible(data);
	},

	/**
	 * @param {String} t text to show as info
	 */
	setText : function(text)
	{
		this.infoImage.setAttribute('title',text);
		return this;
	}
});