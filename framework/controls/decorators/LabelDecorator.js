/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Label decorator
 */

goog.provide('Banana.Controls.Decorators.LabelDecorator');

/** @namespace Banana.Controls.Decorators.LabelDecorator  */
namespace('Banana.Controls.Decorators').LabelDecorator = Banana.Controls.Decorators.Decorator.extend(
/** @lends Banana.Controls.Decorators.LabelDecorator.prototype */
{
	/**
	 * decorates a custom control with a label
	 * 
	 * @param {Banana.UiControl} customControl
	 * @constructs
	 * @extends Banana.Controls.Decorators.Decorator
	 */
	init : function(customControl)
	{
		this._super(customControl);
		
		this.customControl = customControl;
		this.customControl.addCssClass('BLabelDecoratedControl');
		this.addCssClass('BLabelDecorator');
		this.label = new Banana.Controls.Label().addCssClass('BLabelDecoratorLabel'); 
		this.position = 'left';
		this.addControl(this.label);
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