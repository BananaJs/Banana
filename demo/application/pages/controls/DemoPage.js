goog.provide('Application.Controls.Examples.DemoPage');

namespace('Application.Controls.Examples').DemoPage = Banana.Page.extend( {
	
	init : function()
	{
		this._super();
		this.addCssClass("BDemoHome");
	},
	
	showLoader : function(text)
	{
		this.getPageTemplate().showLoader(text);
	},
	
	hideLoader : function()
	{
		this.getPageTemplate().hideLoader();
	}
	
});