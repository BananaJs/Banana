/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Loader control
 */

goog.provide('Banana.Controls.Loader');

/** @namespace Banana.Loader */
namespace('Banana.Controls').Loader = Banana.Control.extend(
/** @lends Banana.Loader.prototype */
{
	/**
	 * Creates a loader. It displays itself on top of all other visible components with
	 * a dark shade underneath it.
	 * To use it. Add it to your control and call show(text);
	 * @constructs
	 * @extends Banana.Control
	 */
	init : function()
	{
		this._super();
		
		this.text = new Banana.Controls.Label()
		.addCssClass('BLoaderTextLabel');
		
		this.loader = new Banana.Controls.Panel()
		.addCssClass('BLoader')
		.addCssClass('BLoaderContainer')
		.setVisible(false);
		
		this.loaderTrans = new Banana.Controls.Panel()
		.addCssClass('BLoader')
		.addCssClass('BLoaderTransparantContainer')
		.setVisible(false);
		
		this.cover = new Banana.Controls.Panel()
		.addCssClass('BLoaderCover')
		.setVisible(false);
	},

	/**
	 * @override
	 */
	createComponents : function()
	{	
		var iconLoader = new Banana.Controls.Panel()
		.addCssClass("BLoaderImage");

		this.addControl(this.loaderTrans);
		this.addControl(this.loader);
		this.loader.addControl(iconLoader);
		this.loader.addControl(this.text);
		this.addControl(this.cover);
	},

	/**
	 * @override
	 */
	updateDisplay : function()
	{
		//vertical center align in css sucks bigg ass. we do it in javascript
		
		var dem = this.getFirstUiControl().getDimensions();
		
		var docHeight = jQuery(document).height();
		
		var loaderHeight = this.loader.getDimensions().height;
		
		var offset = docHeight/3 - loaderHeight;
		
		this.loaderTrans.setCss({'margin-top':offset});
		this.loader.setCss({'margin-top':offset});

		if (this.setVisibleLater)
		{
			this.setVisibleControls();		
		}
	},
	
	/**
	 * Makes loader visible
	 * @ignore
	 */
	setVisibleControls : function()
	{
		//hack our loader is often used during page transitions
		//sometimes situation occurs when loader is removed from dom 
		if (!this.cover) return;
		
		this.cover.setVisible(true);
		
		this.loaderTrans.setVisible(true);
		
		this.loader.setVisible(true);			
	},
	
	/**
	 * Makes the loader visible with given text.
	 * if we call this method before rendered we only set the data.
	 * We want to align the loader exactly in the center of the screen. For this we need
	 * to know dimensions. Thats why we set data first and later on apply correct positions.
	 * 
	 * @param {String} text
	 * @param {int} px of horizontal offset
	 * @return {this}
	 */
	show : function(text,hoffset)
	{
		this.text.setData(text);
		
		if (this.isRendered)
		{
			this.setVisibleControls();	
	
		}
		else
		{
			this.setVisibleLater = true;
		}
		
		return this;
	},
	
	/**
	 * hides loader
	 */
	hide : function()
	{
		//hack our loader is often used during page transitions
		//sometimes situation occurs when loader is removed from dom 
		if (!this.cover) return;
		
		this.setVisibleLater = false;
		this.cover.setVisible(false);
		this.loaderTrans.setVisible(false);
		this.loader.setVisible(false);
		
		return this;
	}
	
});
