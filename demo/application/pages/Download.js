goog.provide('Application.Pages.Download');

namespace('Application.Pages').Download = Banana.Page.extend({
	
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
		title.setData("Download Banana JS");
		title.addCssClass("exampleTitle");
		
		this.top.addControl(title);
	},
	
	createAbout : function()
	{
		var text = new Banana.Controls.Panel();
		text.addControl("Developing applications in Banana JS can differ in size and complexity. <br> For large complex projects with multiple pages you most likely want to build your own project. <br> For an explanation how to start building your own project, take a look at <a href='https://github.com/BananaJs/Banana'>Banana JS github repository</a>.<Br>" +
				"<br> If you need a more simple application or even just a feature of Banana, you can better download and include the <a href='../Application.min.js'>minified</a> version Banana JS. <br> for more information of how to use Banana, see the documentation.");
		
		text.addCssClass("downloadIntroText");

		
		this.addControl(text);
		
		
	},
	
	createSALink : function()
	{
		this.addControl('<h3>Standalone application</h3>');
		var text = new Banana.Controls.Panel();
		text.addControl("DevelopAs a standalone application you need to pull the repository from github.<br> Right After that you can start building your own application with google build tools.");
		text.addCssClass("downloadIntroText");
		
		this.addControl(text);
	},
	
	createMinLink : function()
	{
		this.addControl('<h3>Addon for existing webpage</h3>');
		var text = new Banana.Controls.Panel();
		text.addControl("It is possible to use parts of Banana JS in your existing project. In that case the minified version of Banana JS most likely suits best.");
		text.addCssClass("downloadIntroText");
		
		this.addControl(text);
	}
	
	
});
