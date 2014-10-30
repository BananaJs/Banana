/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Date picker. using jquery ui datapicker
 */

goog.provide('Banana.Controls.DataControls.DateTimePicker');

/** @namespace Banana.Controls.DateTimePicker */
namespace('Banana.Controls').DateTimePicker = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.DateTimePicker.prototype */
{
	/**
	 * Creates a date and time picker combined in one.
	 * Currently the only supported time format is MM-DD-YYYY HH:MM:SS:FF 
	 * 
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
		this.addCssClass('BDateTimePicker');
		this.dateCtrl = new Banana.Controls.DatePicker().addCssClass('BDateTimePickerDateControl');
		this.timeCtrl = new Banana.Controls.MaskedTextBox().setMask('99:99:99').addCssClass('BDateTimePickerTimeControl');
		
		this.defaultTime = '00:00:00:00';
		
		this.resultFormat = 'date';
	},
	
	/**
	 * @override
	 */
	updateDisplay : function()
	{
		if (!this.timeCtrl.getData() && this.defaultTime)
		{
			this.timeCtrl.setData(this.defaultTime);
		}
	},
	
	/**
	 * Set a minimum selectable date via a Banana Date object
	 * @param {Banana.Util.DateTimecode} date 
	 * @return {this}
	 */
	setMinimumDate : function(date)
	{
		this.dateCtrl.setMinimumDate(date);
		return this;
	},
	
	/**
	 * @return {Banana.Controls.MaskedTextBox}
	 */
	getTimeControl : function()
	{
		return this.timeCtrl;
	},
	
	/**
	 * @return {Banana.Controls.DatePicker}
	 */
	getDateControl : function()
	{
		return this.dateCtrl;
	},
	
	/**
	 * @override
	 */
	createComponents : function()
	{
		this.addControl(this.dateCtrl);
		this.addControl(this.timeCtrl);
		
		// Pass on changed events to enable validation
		//dont trigger event when data is the same as previous
		this.dateCtrl.bind('dataChanged',this.getProxy(function(){
			
			var data = this.getData();
			
			if (data == this.previousData) return;
			
			this.previousData = data;
			
			this.triggerEvent('dataChanged');
		}));
		this.timeCtrl.bind('dataChanged',this.getProxy(function()
		{
			var data = this.getData();
			
			if (data == this.previousData) return;
			
			this.previousData = data;
			
			this.triggerEvent('dataChanged');
		
		}));
	},
	
	/**
	 * @override
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		this._super(data);
		if (data)
		{
			var parts = data.split(' ');
			this.dateCtrl.setData(parts[0],ignoreEvent,ignoreDom);
			this.timeCtrl.setData(parts[1],ignoreEvent,ignoreDom);
		}
		return this;
	},
	
	/**
	 * @param {String} type timecode or null
	 * @return {this} this
	 */
	setReturnType : function(type)
	{
		this.resultFormat =type;
		return this;
	},
	
	/**
	 * @return {String} 
	 */
	getData : function()
	{
		var datePart = this.dateCtrl.getData()
		var timePart = this.timeCtrl.getData();
		
		if (!datePart)
		{
			return false;
		}
		
		//add frame part
		if (timePart)
		{
			//if our time part in invalid we make zero from it
			if (timePart.match(/_/))
			{
				timePart = '00:00:00:00';
			}
			else
			{
				timePart+=':00';
			}
		}
		else
		{
			timePart = '00:00:00:00';
		}
		
		this.data = [datePart, timePart].join(' ');
	
		if (this.resultFormat == 'tc')
		{
			var d = new Banana.Util.DateTimecode();
			d.setLocalDateTime(this._super());
			return d.getTimecode();
		}
		
		return this._super();
	},
	
	/**
	 * @depricated
	 */
	setDateFormat : function(format)
	{
		this.resultFormat = format;
		return this;
	}
});