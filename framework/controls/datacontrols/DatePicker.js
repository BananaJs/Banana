/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Date picker. using jquery ui datapicker
 */

goog.provide('Banana.Controls.DataControls.DatePicker');

/** @namespace Banana.Controls.DatePicker */
namespace('Banana.Controls').DatePicker = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.DatePicker.prototype */
{ 
	/**
	 * Creates a Date picker
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
		this.addCssClass('BDatePicker');
		this.textBox = new Banana.Controls.TextBox().addCssClass('BDatePickerTextBox');	
	},
	
	/**
	 * @override
	 */
	createComponents : function()
	{	
		this.addControl(this.textBox);

		this.textBox.bind('dataChanged',this.getProxy(function(){
			
			this.triggerEvent('dataChanged',this.textBox.getData());
		}));
			
	},
	
	/**
	 * Sets data on the datapicker control.
	 * We can set data in timecode format or string format.
	 * i.e setData(1000) //1 sec or setData("24-03-1931")
	 * @param {mixed} data
	 * @param {boolean} a
	 * @param {boolean} b
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
	
		if (data == null)
		{
			this.textBox.setData(null);
			return this;
		}
	
		if (data == undefined) return this;
		
		if (!isNaN(data)) //we have a number
		{
			var tc = new Banana.Util.DateTimecode();
			tc.setTimecode(data);
			this.textBox.setData(tc.getLocalDate('%d-%m-%Y'),ignoreEvent,ignoreDom);
		}
		else
		{
			this.textBox.setData(data,ignoreEvent,ignoreDom);
			
			Banana.Util.DomHelper.setData("",this);
		}
		
		return this;
	},
	
	/**
	 * Set a minimum selectable date via a Banana Date object @see Banana.Util.DateTimecode
	 * @param {Banana.Util.DateTimecode} date
	 * @return {this} 
	 */
	setMinimumDate : function(date)
	{
		//if rendered we instantly apply the new datepicker rule/option
		if (this.isRendered)
		{
			jQuery('#'+this.textBox.clientId).datepicker("option", "minDate", new Date(date.getTimecode()));
		}
		else //otherwise save it in a variable. we will apply it later
		{
			this.minDate = date;
		}
		return this;
	},
	
	/**
	 * @param {String} type timecode or null
	 * @return {this} this
	 */
	setReturnType : function(type)
	{
		this.returnType =type;
		return this;
	},
	
	/**
	 * @return {String} date
	 */
	getData : function()
	{
		var date = this.textBox.getData();
		
		if (this.returnType == 'timecode')
		{
			if (!date) return;
			var tc = new Banana.Util.DateTimecode();
			tc.setLocalDate(date);
			
			return tc.getTimecode().toString();
		}
		else
		{
			return date;
		}
	},
	
	/**
	 * method used by framework
	 * we destroy the datepicker here in case the window is still open
	 */
	unload : function()
	{
		//we cant directly go to this.textBox.getClientId(), cause at this stage
		//the id is changed to "cleared" by the framework
		jQuery('#'+this.textBox.clientId).datepicker("hide");
		jQuery('#'+this.textBox.clientId).datepicker("destroy");

	},

	/**
	 * method used by framework
	 * we create the datepicker element here
	 * @override
	 */
	updateDisplay : function()
	{
		this._super();
		jQuery('#'+this.textBox.getClientId()).datepicker(
		{ 
			dateFormat: 'dd-mm-yy',
			minDate:this.minDate ? new Date(this.minDate.getTimecode()) : new Date(0),
			//jQuery force the '1'  z-index value in the 'style' attribute of the ui-dialog-div
			// so our CSS value in css is overridden and the datepicker is still behind the other elements.
			//A workaround is to add the following lines 
			beforeShow: function(dateText, inst) {
				
				setTimeout(function(){
					jQuery('#ui-datepicker-div').css('z-index', '9999999');
					},200)			
			}
		});
	}	
});