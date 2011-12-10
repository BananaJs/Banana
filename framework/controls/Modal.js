/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Modal control
 */

goog.provide('Banana.Controls.Modal');

goog.require('Banana.Controls.Panel');

/** @namespace Banana.Controls.Modal */
namespace('Banana.Controls').Modal = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.Modal.prototype */
{	
	/**
	 * Creates a modal. A modal is a control which shows itself on top of other visible controls.
	 * Inside of the modal you can add your own control collection. Additional action buttons
	 * can be configured which will be visible at the bottom of the modal
	 * 
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this.keepFixed = true;
		this._super();
		this.antiPaddingBug = new Banana.Controls.Panel();
		this.antiPaddingBug.addCssClass('BModalAntiPadding')
		this.contentContainer = new Banana.Controls.Panel().setStyle('float:left;width:100%;');
		this.contentContainer.addCssClass('BModalContentContainer')
		this.contentContainer.setId('content');
		this.titleLabel = new Banana.Controls.Label().setStyle('float:left;padding-left:5px;');
		this.buttonContainer = new Banana.Controls.Panel().addCssClass('BModalButtonContainer')
	},

	/**
	 * Let's the modal stay fixed in the screen. Scrolling down in your page will keep the
	 * modal at its position. Not handy when your modal is higher than the height size of your screen.
	 * 
	 * @param boolean
	 * @return {this}
	 */
	setKeepFixed : function(bool)
	{
		this.keepFixed = bool;
		return this;
	},

	/**
	 * @override
	 */
	updateDisplay : function()
	{
		this.center();

		if (this.keepFixed)
		{
			this.container.setCss({'position':'fixed','top':this.getPage().getDemensions().offset.top + 20});
		}		
	},

	/**
	 *@param bool enabled or disables buttons
	 *@return {this}
	 */
	setButtonsEnabled : function(bool)
	{
		var buttons = this.buttonContainer.getControls();

		for (var i = 0;i < buttons.length; i++)
		{
			buttons[i].setEnabled(bool);
		}

		return this;
	},

	/**
	 * Set the buttons which we show at the bottom of the modal
	 * @param {Array} of Banana.Controls.Buttons 
	 */
	setButtons : function(buttons)
	{
		if (this.isRendered)
		{
			this.buttonContainer.clear();
		}

		if (buttons.length)//we have an array
		{
			for (i = 0, len = buttons.length; i < len; i++)
			{
				if (buttons[i] instanceof Banana.Controls.Button)
				{
					this.buttonContainer.addControl(buttons[i]);
				}
				else
				{
					var b = new Banana.Controls.Button();
					b.addCssClass('BButtonGray');
					b.setStyle('margin-left:5px;float:left;');
					b.bind('click',buttons[i][1]);
					b.setText(buttons[i][0]);
					this.buttonContainer.addControl(b);
				}

			}
		}
		else
		{
			for (var buttonname in buttons)
			{
				if (buttons[i] instanceof Banana.Controls.Button)
				{
					this.buttonContainer.addControl(buttons[buttonname]);
				}
				else
				{		
					var b = new Banana.Controls.Button();
					b.addCssClass('BButtonGray');
					b.setStyle('margin-left:5px;float:left;');
					b.bind('click',buttons[buttonname]);
					b.setText(buttonname);
					this.buttonContainer.addControl(b);
				}
			}
		}

		if (this.isRendered)
		{
			this.buttonContainer.invalidateDisplay(); //todo not nice now use controlbar instead of this
		}
		
		return this;
	},

	/**
	 * @override
	 */
	createComponents : function()
	{
		this.cover = new Banana.Controls.Panel();

		this.cover.addCssClass('BModalCover');
	
		this.container = new Banana.Controls.Panel();
		this.container.addCssClass('BModal');
		this.container.setStyle(this.style);

		var controlbar = new Banana.Controls.Panel().setStyle('font-weight:bold; height:20px; width:100%;');
		var close = new Banana.Controls.Panel().addCssClass('BModalCloseButton');

		controlbar.addControl(this.titleLabel);

		this.antiPaddingBug.addControl(this.contentContainer)
		this.antiPaddingBug.addControl(this.buttonContainer)
			
		this.container
			.addControl(controlbar)
			.addControl(this.antiPaddingBug)
		
		this.addControl(this.cover,true)
		this.addControl(this.container,true);

		this.bind('renderComplete',this.getProxy(this.center));
		
		close.bind('click',this.getProxy(function(){
			
			this.hide();
		}));
	},

	/**
	 * Centers the modal 
	 */
	center : function()
	{
		if (this.isRendered)
		{
			var pageDem = this.getPage().getDemensions();
			this.container.setCss({'margin-left':((pageDem.width/2)-this.container.getDemensions().width/2)+'px','margin-top':40+'px'});
		}
		return this;
	},

	/**
	 * Hides the modal
	 * @return {this}
	 */
	hide : function()
	{
		this.setVisible(false);
		this.triggerEvent('close');
		return this;
	},

	/**
	 * Shows the modal
	 * @return {this}
	 */
	show : function()
	{
		this.titleLabel.setVisible(this.titleLabel.getData());
		this.setVisible(true,50,'fadeIn');
		this.center();
		this.triggerEvent('onShow');
		return this;
	},

	/**
	 * title of the modal
	 * @param {String} title
	 * @return {this}
	 */
	setTitle : function(title)
	{
		this.titleLabel.setData(title);
		return this;
	},

	/**
	 * We override this method to make sure added controls are added not in the normal collection
	 * But in another specially created control.
	 * 
	 * @param {mixed} Banana.Control or plaintext
	 * @param {boolean} normal if we still want to add it to regular collection
	 * @return {this}
	 * @override
	 */
	addControl : function(c,normal)
	{
		if (normal)
		{
			this._super(c);
		}
		else
		{
			this.contentContainer.addControl(c);
		}
		return this;
	}
});