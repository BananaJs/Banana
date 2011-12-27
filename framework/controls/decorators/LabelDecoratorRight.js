/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Label decorator TODO merge this or extend this from regular label decorator
 */

goog.provide('Banana.Controls.Decorators.LabelDecoratorRight');

/** @namespace Banana.Controls.Decorators.LabelDecoratorRight  */
namespace('Banana.Controls.Decorators').LabelDecoratorRight = Banana.Controls.Decorators.Decorator.extend(
/** @lends Banana.Controls.Decorators.LabelDecoratorRight.prototype */
{
	/**
	 * decorates a custom control with a label positioned at the rightside
	 * 
	 * @param {Banana.UiControl} customControl
	 * @constructs
	 * @extends Banana.Controls.Decorators.Decorator
	 */
	init : function(customControl)
	{
		this._super(customControl);

		this.addCssClass('BLabelDecoratorRight');
		
		this.customControl = customControl;
		
		this.label = new Banana.Controls.Label();
		this.position = 'left';
		this.label.addCssClass('BLabelDecoratorRightLabel');
		this.addControl(customControl);
		this.addControl(this.label);
		
		//when custom control becomes visible or invisible so does this control
		customControl.bind('onSetVisible',this.getProxy(this.onSetVisible));
	},

	/**
	 * Invoked when setVisible is called
	 * @param {Event} event 
	 * @param {Mixed} data
	 * @ignore
	 */
	onSetVisible : function(event,data)
	{
		this.setVisible(data);
	},
	
	/**
	 * @override
	 */
	updateDisplay : function()
	{
		this._super();
		this.label.setForControl(this.customControl);
	},
	
	/**
	 * Sets style on label
	 * @param {Object} css
	 */
	setLabelCss : function(css)
	{
		this.label.setCss(css);
		return this;
	},

	/**
	 * sets data which will be set on the label
	 *
	 * @param {String} d
	 * @return {this} 
	 */
	setData : function(d)
	{
		this.label.setData(d);
		return this;
	},

	/**
	 * returns data text of label;
	 *
	 * @return {String}
	 */
	getData : function()
	{
		return this.label.getData();
	}
});