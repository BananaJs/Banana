/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Window control with collapsing functionality
 */

goog.provide('Banana.Controls.Window');

goog.require('Banana.Controls.Panel');
goog.require('Banana.Controls.SwitchButton');

/** @namespace Banana.Controls.Window */
namespace('Banana.Controls').Window = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.Window.prototype */
{
	/**
	 * Creates a basic window control. A window have a title and can be collapsed. 
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{	
		this._super();
		
		this.collapsed = false;
		
		var headerPanel = new Banana.Controls.Panel();
		headerPanel.addCssClass('BWindowHeader');
		this.addControl(headerPanel,true);
		
		this.switchButton = new Banana.Controls.SwitchButton();
		this.switchButton.addCssClass('BWindowSwitch');
		this.switchButton.on();
		
		this.switchButton.bind('switched',this.getProxy(this.switchCollapseState));
		
		headerPanel.addControl(this.switchButton);
		
		this.headerTitle = new Banana.Controls.Label();
		this.headerTitle.addCssClass('BWindowTitle');
		headerPanel.addControl(this.headerTitle);

		this.content = new Banana.Controls.Panel();
		this.content.addCssClass('BWindowContent');
		this.addControl(this.content, true);
		
		this.addControl('<div style="height:4px;clear:both;font-size:1px;">&nbsp;</div>', true);
	},

	/**
	 * Clears the window from all added controls
	 * @return {this}
	 */
	clear : function()
	{
		this.content.clear();
		return this;
	},
	
	/**
	 * Switches to an opened state or closed state
	 * @ignore
	 */
	switchCollapseState : function(e,status)
	{
		this.setState('collapsed',status);

		if (status)
		{
			this.setState('collapsed',true);
			this.close();			
		}
		else
		{
			this.setState('collapsed',false);
			this.open();
		}
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
	addControl : function(control,normal)
	{
		if (normal)
		{
			this._super(control);
		}
		else
		{
			this.content.addControl(control);
		}
		return this;
	},
	
	/**
	 * Sets the title of the window. Displayed on top.
	 * @param {String} title
	 */
	setTitle : function(title)
	{
		this.title = title;
		return this;
	},
	
	/**
	 * @return {String}
	 */
	getTitle : function()
	{
		return this.title;
	},
	
	/**
	 * @override
	 */
	createComponents : function()
	{
		this.headerTitle.setData(this.getTitle());	
		
		this.switchButton.setOnImage(Banana.Application.getSettings().imagedir + '/arrowclose.png');
		this.switchButton.setOffImage(Banana.Application.getSettings().imagedir + '/arrowopen.png');

		var open = false;
		var collapseState = this.getState('collapsed');
		
		if (collapseState === null)
		{
			if (this.collapsed)
				open = false;
			else
				open = true;
		}
		else if (!collapseState)
		{
			open = true;
		}
		else
		{
			open = false;
		}
		if (open)
		{
			this.collapsed = true;
			this.switchButton.off();
		}
		else
		{
			this.content.setCss({'display': 'none'});
			this.collapsed = false;
			this.switchButton.on();
		}

		this.addCssClass('BWindow');		
	},
	
	/**
	 * Opens the window
	 * @return {this}
	 */
	open : function()
	{
		this.collapsed = false;
		jQuery('#'+this.content.getClientId()).show();
		return this;
	},
	
	/**
	 * Closes the window
	 * @return {this}
	 */
	close : function()
	{
		this.collapsed = true;
		jQuery('#'+this.content.getClientId()).hide();
		return this;
	}
});