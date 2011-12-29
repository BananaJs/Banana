goog.provide('Application.Controls.Examples.DemoPage');


namespace('Application.Controls.Examples').DemoPage = Banana.Page.extend( {
	
	showLoader : function(text)
	{
		this.getPageTemplate().showLoader(text);
	},
	
	hideLoader : function()
	{
		this.getPageTemplate().hideLoader();
	}
	
});