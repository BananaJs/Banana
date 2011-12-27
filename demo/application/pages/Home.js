goog.provide('Application.Pages.Home');

namespace('Application.Pages').Home = Banana.Page.extend( {

    /**
     * @inheritDoc
     */
    init: function() {
    	
		this._super();
    	
	},


	createComponents: function()
	{
		this.top= new Banana.Controls.Panel();
		this.left = new Banana.Controls.Panel();
		this.right = new Banana.Controls.Panel();
		
		this.top.addCssClass("toppanel");
		this.left.addCssClass("leftpanel");
		this.right.addCssClass("rightpanel");
		
		this.addControl(this.top);
		this.addControl(this.left);
		this.addControl(this.right);
		
		this.createTitle();
		
		this.createSubs();
		
		this.createRands();
	},
	
	createTitle : function()
	{
		var title = new Banana.Controls.Label();
		title.setData("Banana Javascript Framework");
		title.addCssClass("frameworktitle")
		
		this.top.addControl(title);
		
		var ex = new Banana.Controls.Panel();
		ex.addCssClass("frameworkexpl");

		this.left.addControl(ex);
		
		
		var ul = new Banana.Controls.UnorderedList();
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("100% Javascript");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Component driven");
		ul.addControl(l1);
		
		var l2 = new Banana.Controls.ListItem();
		l2.addControl("Efficient fast render");
		ul.addControl(l2);
		
		var l2 = new Banana.Controls.ListItem();
		l2.addControl("Super dynamic");
		ul.addControl(l2);
		
		var l3 = new Banana.Controls.ListItem();
		l3.addControl("Databinding ");
		ul.addControl(l3);
		
		var l4 = new Banana.Controls.ListItem();
		l4.addControl("Validation");
		ul.addControl(l4);
		
		var l5 = new Banana.Controls.ListItem();
		l5.addControl("Large control collection");
		ul.addControl(l5);
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("Custom control support");
		ul.addControl(l6);
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("JQuery powered");
		ul.addControl(l6);
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("Google closure build integration");
		ul.addControl(l6);
		
		
		
		ex.addControl(ul);
	},
	
	createSubs : function()
	{
		var p = new Banana.Controls.Panel();
		p.addCssClass("buttonPanel")
		
		var sub = new Banana.Controls.Panel().addCssClass("menusub");
		p.addControl(sub);
		var link = new Banana.Controls.Link();
		link.addCssClass("menusublink");
		link.addControl("Examples");
		link.bind('click',this.getProxy(function(e){
			
			Banana.Application.loadPage("Examples");
			e.preventDefault();
		}));
		link.setHref("#section=Examples");
		sub.addControl(link);
		
		var sub = new Banana.Controls.Panel().addCssClass("menusub").addCssClass("menusub2");
		p.addControl(sub);
		var link = new Banana.Controls.Link();
		link.addCssClass("menusublink");
		link.addControl("Download")
		sub.addControl(link);
		
		var sub = new Banana.Controls.Panel().addCssClass("menusub").addCssClass("menusub3");
		p.addControl(sub);
		var link = new Banana.Controls.Link();
		link.addCssClass("menusublink");
		link.addControl("Documentation")
		sub.addControl(link);
		
		this.right.addControl(p)
		
	},
	
	createRands : function()
	{
		var bottom = new Banana.Controls.Panel();
		bottom.addCssClass("bottom");
		this.addControl(bottom);
			
		var summary = new Banana.Controls.Panel();
		summary.addCssClass("summaryText");
		summary.addControl("Banana is an opensource javascript application framework designed to create pure javascript webpages. Banana is designed with the single goal to help developers write fast and efficient websites.Compatible with all major browsers, Banana gives developers a component driven platform to develop applications just in the same way regular interface toolkits provides.");
		
		bottom.addControl(summary);
		
		var cube = new Banana.Controls.Panel();
		cube.addControl('.');
		cube.addCssClass("cube")
		//bottom.addControl(cube);
		
		var cube = new Banana.Controls.Panel();
		cube.addControl('.');
		cube.addCssClass("cube")
		//bottom.addControl(cube);
		
		var cube = new Banana.Controls.Panel();
		cube.addControl('.');
		cube.addCssClass("cube")
		//bottom.addControl(cube);
		
	},
	
	
	updateDisplay : function()
	{
		
		
	}

});
