goog.provide('Application.Pages.About');

namespace('Application.Pages').About = Banana.Page.extend({
	
	createComponents: function()
	{
		this.top= new Banana.Controls.Panel();
		this.addControl(this.top);
		
		this.center= new Banana.Controls.Panel();
		this.addControl(this.center);
		
		this.createTitle();
	
		this.createAbout();
		

	},
	
	createTitle : function()
	{
		var title = new Banana.Controls.Label();
		title.setData("About");
		title.addCssClass("exampleTitle");
		
		this.top.addControl(title);
	},
	
	createAbout : function()
	{
		var text = new Banana.Controls.Panel();
		text.addControl("Banana is an evolutionary project. Original design started in 2008 by Gillis Haasnoot and Maarten van Schaijk. Currently running various business applications at different companies.<br><br> If you have any questions mail gillis.haasnoot@gmail.com. Code contributions are welcome at <a href='https://github.com/BananaJs/Banana'>github</a>");
		
		text.addCssClass("downloadIntroText");


		this.addControl(text);	
	}
});