/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Progressbar.
 */

goog.provide('Banana.Controls.DataControls.ProgressBar');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.ProgressBar */
namespace('Banana.Controls').ProgressBar = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.ProgressBar.prototype */
{
	/**
	 * Creates a progressbar. Can show linear color gradient.
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
		this.addCssClass('BProgressBar');
		this.data = 0;
		this.bar = new Banana.Controls.Panel();
		this.bar.addCssClass('BProgressBarBar');
		this.addControl(this.bar);
		
		this.colorBlend=new Banana.Util.Color();
		
		if (!this.color1)
			this.setBeginColor('#88ff88');
		if (!this.color2)
			this.setEndColor('#ff8888');
	},
	
	/**
	 * sets begin color
	 * @param {String} value hex format
	 * @return {this}
	 */
	setBeginColor : function(value)
	{
		this.color1=new Banana.Util.Color(value);
		return this;
	},

	/**
	 * sets end color
	 * @param {String} value hex format
	 * @return {this}
	 */
	setEndColor : function(value)
	{
		this.color2=new Banana.Util.Color(value);
		return this;
	},
	
	/**
	 * @override
	 */
	updateDisplay : function()
	{
		var alpha=this.data/100;
		this.colorBlend.setH( alpha*this.color2.getH() + (1-alpha)*this.color1.getH() );
		this.colorBlend.setS( alpha*this.color2.getS() + (1-alpha)*this.color1.getS() );
		this.colorBlend.setV( alpha*this.color2.getV() + (1-alpha)*this.color1.getV() );
			
		this.bar.setCss({
			'width' : this.data+'%',
			'background-color' : this.colorBlend.getValue()
		});
	},
	
	/**
	 * @param {int} data range 0 to 100. 100 is full progressbar.
	 * @param {boolean} ignoreEvent
	 * @param {boolean} ignoreDom
	 * @override
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		data = Math.min(100, Math.max(0, Math.round(data)));
		this._super(data,ignoreEvent,ignoreDom);

		this.updateDisplay();
	}
});