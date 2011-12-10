/**
 * @author Dennis Verhoeven <dennis@vivesta.com>
 * @package Banana.Controls
 * @summary Date span control
 */

goog.provide('Banana.Controls.DataControls.DateSpan');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.DateSpan */
namespace('Banana.Controls').DateSpan = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.DateSpan.prototype */
{
	/**
	 * Creates a datespan control. 
	 * @constructs
	 */
	init : function()
	{
		this._super();
	
		this.addCssClass('BDateSpan');
		
		this.amount = new Banana.Controls.DropDown()
			.setDataSource({
				'1'  :  '1',
				'2'  :  '2',
				'3'  :  '3',
				'4'  :  '4',
				'5'  :  '5',
				'6'  :  '6',
				'7'  :  '7',
				'8'  :  '8',
				'9'  :  '9',
				'10' : '10'
			})
			.setStyle('width:45px;margin-right:4px;')
			.bind('dataChanged',this.getProxy(function(e)
			{
				var suffix = (this.amount.getData()>1 ? 's' : '');
				var source = {
						'days' : 'day'+suffix,
						'weeks' : 'week'+suffix,
						'months' : 'month'+suffix
				};
				this.unit.setDataSource(source);
			}));
			
		this.addControl(this.amount);		
	
		this.unit = new Banana.Controls.DropDown()
			.setStyle('width:80px;');
		this.addControl(this.unit);
		this.setData('1 day');
	},
	
	/**
	 * @override
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		if (!data) return;
		
		var parts=data.split(' ');
		this.amount.setData(parts[0]);
		this.unit.setData(parts[1]);
		
		return this;
	},
	
	/**
	 * @return {String}
	 */
	getData : function()
	{
		return this.amount.getData()+' '+this.unit.getData();
	}
});