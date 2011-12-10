/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Confirm modal   
 */

goog.provide('Banana.Controls.ConfirmModal');

goog.require('Banana.Controls.Modal');


/** @namespace Banana.Controls.ConfirmModal */
namespace('Banana.Controls').ConfirmModal = Banana.Controls.Modal.extend(
/** @lends Banana.Controls.ConfirmModal.prototype */
{
	/**
	 *  Creates a modal in which we have confirm to continue. Handy for crucial operations.
	 *  The data passed along defines the texts shown in the modal.
	 *  
	 *  Example:
 		
 		//if we not have the confirm modal already, create it.
	 	if (!this.confirm)
		{
			this.confirm = new Banana.Controls.ConfirmModal();
			this.addControl(this.confirm, true);
		}
		
		this.confirm.setTitle("title")
		this.confirm.setTextTitle("texttitle");
		this.confirm.setText("text")		
		
		this.confirm.bind('onOk', this.getProxy(function(){
		
			//do things here
		}));
		
		//display the confirm modal
		this.confirm.show();
	 * 
	 * @constructs
	 * @extends Banana.Controls.Modal
	 */
	init : function()
	{
		this._super();
		
		this.text = new Banana.Controls.Label();
		this.text.addCssClass('BConfirmModalText');
		
		this.textTitle = new Banana.Controls.Label();
		this.textTitle.addCssClass('BConfirmModalTitle');
	},

	/**
	 * @override
	 * @ignore
	 */
	createComponents : function()
	{
		this._super();
		this.container.addCssClass('BConfirmModal');
			
		var image = new Banana.Controls.Panel();
		image.addCssClass('BConfirmModalImage');
		
		var container = new Banana.Controls.Panel();
		container.addCssClass('BConfirmModalContainer');
		
		container.addControl(this.textTitle);
		container.addControl(this.text);
		
		this.addControl(image);
		this.addControl(container);
		
		var buttons = {'Ok':this.getProxy(function()
		{
			this.triggerEvent('onOk');
			this.hide();
		}),
		'Cancel':this.getProxy(function()
		{
			this.hide();

		})};
		this.setButtons(buttons);
	},
	
	/**
	 * 
	 * @param {String} text
	 * @returns {Banana.Controls.ConfirmModal}
	 */
	setTextTitle : function(text)
	{
		this.textTitle.setData(text);
		return this;		
	},
	
	/**
	 * 
	 * @param {String} text
	 * @returns {Banana.Controls.ConfirmModal}
	 */
	setText : function(text)
	{
		this.text.setData(text);
		return this;
	},
	
	/**
	 * @override
	 */
	show : function()
	{
		this.textTitle.setVisible(this.textTitle.getData());
		this.text.setVisible(this.text.getData());

		this._super();
	}
});