goog.provide('Application.Controls.Examples.ExampleStartPage');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleStartPage = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var panel = new Banana.Controls.Panel().setStyle('line-height:20px;padding:4px;');
		
		panel.addControl("To view examples click on one of the categories left. <br> Note that the pages you are currently viewing are completely made in Banana.");
		
		this.addControl(panel);
	}
});