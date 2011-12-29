goog.provide('Application.Controls.Examples.ExampleControlOverviewBase');


namespace('Application.Controls.Examples').ControlOverview = Banana.Controls.Panel.extend({

	init : function()
	{
		this._super();
		this.addCssClass("controlOverview");
	},
	
	getCode : function()
	{
		return false;
	}
});