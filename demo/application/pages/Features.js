goog.provide('Application.Pages.Features');

namespace('Application.Pages').Features = Banana.Page.extend({

	createComponents : function()
	{
		this.top= new Banana.Controls.Panel();
		this.addControl(this.top);
		
		this.center= new Banana.Controls.Panel();
		this.addControl(this.center);
		
		this.bottom= new Banana.Controls.Panel();
		this.addControl(this.bottom);
		
		this.top.addCssClass("toppanelExamples");
		this.center.addCssClass("centerPanelExamples");
		
		this.createTitle();
		this.createFeatureList();
	},
	
	createTitle : function()
	{
		var title = new Banana.Controls.Label();
		title.setData("Features");
		title.addCssClass("exampleTitle");
		
		this.top.addControl(title);
	},
	
	createFeatureList : function()
	{		
		var ul = new Banana.Controls.UnorderedList();
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("100% Javascript");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Free");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Component driven");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Desktop and Mobile compatibility");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Dynamic fast render engine");
		ul.addControl(l1);
		
		var l5 = new Banana.Controls.ListItem();
		l5.addControl("Ready to use components");
		ul.addControl(l5);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Event based development");
		ul.addControl(l1);
						
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Page and history management");
		ul.addControl(l1);
				
		var l3 = new Banana.Controls.ListItem();
		l3.addControl("Databinding");
		ul.addControl(l3);
		
		var l4 = new Banana.Controls.ListItem();
		l4.addControl("Validation");
		ul.addControl(l4);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Easy customizable");
		ul.addControl(l1);
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("JQuery powered");
		ul.addControl(l6);
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("Google closure build integration");
		ul.addControl(l6);
			
		this.addControl(ul);		
	}
});
	