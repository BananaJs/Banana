/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Status bar 
 */

goog.provide('Banana.Controls.StatusBar');

/** @namespace Banana.Controls.StatusBar */
namespace('Banana.Controls').StatusBar = Banana.Controls.Panel.extend(
/** @lends Banana.Controls.StatusBar.prototype */
{
	/**
	 * Creates a status bar. It can display 4 types. Ok, Info, Warning or Error
	 * Call setMessage({text:'some info',type:'info'}) to show info text.
	 * you can also call shortcut method showInfo('some info');
	 * Optionally you can specify the timeout. This determines how long the message
	 * will be visible on the screen. By default it will stay 10 seconds.
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
		this.addCssClass('BStatusBar');
		
		this.defaultTimeout = 10000;
	},

	/**
	 * @override
	 */
	updateDisplay : function()
	{
		var el = jQuery('#'+this.getClientId()).detach();
		jQuery('body').append(el);
	},

	/**
	 * @param {String} message
	 * @return {this}
	 */
	setSuccesMessage : function(message,timeout)
	{
		var m = {};
		m.type = 'ok';
		m.timeout = timeout;
		m.message = message;
		this.setMessage(m);
		return this;
	},
	
	/**
	 * Shows error message. Optionally you can specify a list of errors which will be shown on the screen
	 * @param {String} message
	 * @param {int} timeout
	 * @param {Array} errors
	 * @return {this}
	 */
	setErrorMessage : function(message, timeout, errors)
	{
		var m = {};
		m.type = 'error';
		m.message = message;
		m.timeout = timeout;	
		m.errors = errors;
		this.setMessage(m);
		return this;
	},

	/**
	 * @param {String} message
	 * @param {int} timeout
	 * @return {this}
	 */
	setWarningMessage : function(message,timeout)
	{
		var m = {};
		m.type = 'warning';
		m.message = message;
		m.timeout = timeout;		
		
		this.setMessage(m);
		return this;
	},

	/**
	 * @param {String} message
	 * @param {int} timeout 
	 * @return {this}
	 */
	setInfoMessage : function(message,timeout)
	{
		var m = {};
		m.type = 'info';
		m.message = message;
		m.timeout = timeout;
		
		this.setMessage(m);
		return this;
	},
	/**
	 *
	 * @param {Object} message structure like {type:'warning/ok/error/info',message:'a message',timeout:undefined||1000,errors:[]}
	 * @return {this}
	 */
	setMessage : function(message)
	{
		if (this.timeout)
		{
			clearTimeout(this.timeout);
		}
		this.setCss({'display':'block'});
		this.clear();
		
		// remove possible css classes
		this.removeCssClass('BStatusBarError');
		this.removeCssClass('BStatusBarSuccess');
		this.removeCssClass('BStatusBarWarning');
		this.removeCssClass('BStatusBarInfo');		
		
		this.messageBar = new Banana.Controls.Panel();

		switch (message.type)
		{
			case 'ok':
				this.addCssClass('BStatusBarSuccess');
			break;
			
			case 'warning':
				this.addCssClass('BStatusBarWarning');
			break;
			
			case 'error':
				this.addCssClass('BStatusBarError');
			break;
			
			case 'info':
				this.addCssClass('BStatusBarInfo');
			break;
		}

		var l = new Banana.Controls.Label();
		l.addCssClass('title');
		l.setData(message.message);
		this.messageBar.addControl(l);
		
		this.addControl(this.messageBar);
		
		var messages = new Banana.Controls.Panel();
		messages.addCssClass('messages');
		if (message.errors && message.errors.length)
		{
			for (var x = 0; x < message.errors.length; x++)
			{
				if (message.errors[x].message)
					messages.addControl("<li>" + message.errors[x].message + " </li>");
			}
		}
		
		this.messageBar.addControl(messages);
		this.invalidateDisplay();

		if (message.timeout !== 0 && message.timeout !== undefined)
		{
			this.timeout = setTimeout(this.getProxy(this.hide),
					message.timeout || this.defaultTimeout);
		}
		
		return this;
	},
	
	/**
	 * @return {this}
	 */
	hide : function()
	{
		this.setCss({'display':'none'});
		if (this.messageBar) this.messageBar.setVisible(false);
		
		return this;
	}
});
