
goog.provide('Application.Pages.PageTemplates.PageTemplate');

namespace('Application.Pages.PageTemplates').PageTemplate = Banana.PageTemplate.extend({
	
	createComponents : function()
	{	
		var con = new Banana.Controls.Panel().addCssClass('MainContainer')
		
		this.addControl(con);
		
		var menuBar = new Banana.Controls.Panel().addCssClass("Header");
		menuBar.addControl("")
		con.addControl(menuBar);
		
		con.addControl(this.content);
		
		var footer = new Banana.Controls.Panel().addCssClass("footer");
		footer.addControl("Banana Framework 2011");
		con.addControl(footer);
		
		con.addControl('<div style="clear:both;"></div>');
		return;
		
		var menuBar = new Banana.Controls.Panel().addCssClass("Header");
		//menuBar.addControl('Banana')
		
		var image = new Banana.Controls.Image().setStyle('float:left;cursor:pointer;');
		image.setImage(Banana.Application.settings.imagedir+'/banana.png');
		image.bind('click',this.getProxy(function(){
			
			Banana.Application.loadPage('Welcome');
		}));
		
		var label = new Banana.Controls.Label().addCssClass("HeaderText");
		
		
		label.setData("Banana - Component framework for javascript");
		
		var iets = new Banana.Controls.Panel();
		iets.setStyle('width:100%; height:5px;background-color:gold;clear:both;')
		
		//menuBar.addControl(image);
		menuBar.addControl(label);
		menuBar.addControl(iets);
		
		var buttonCon = new Banana.Controls.Panel().addCssClass("TopButtonContainer");
		var button1 = new Banana.Controls.Button().setText("Introduction");
		var button2 = new Banana.Controls.Button().setText("Installation");
		var button3 = new Banana.Controls.Button().setText("Tutorial");
		var button4 = new Banana.Controls.Button().setText("Demos");
		var button5 = new Banana.Controls.Button().setText("Documentation");

		buttonCon.addControl(button1);
		buttonCon.addControl(button5);
		buttonCon.addControl(button2);
		buttonCon.addControl(button3);
		buttonCon.addControl(button4);

		button1.bind('click',this.getProxy(function(){

			Banana.Application.loadPage("Introduction");
		}));

		button2.bind('click',this.getProxy(function(){

			Banana.Application.loadPage("Installation");
		}));

		button3.bind('click',this.getProxy(function(){

			Banana.Application.loadPage("Tutorials");
		}));

		button4.bind('click',this.getProxy(function(){
			Banana.Application.loadPage("Demos");
		}));
		
		button5.bind('click',this.getProxy(function(){
			Banana.Application.loadPage("Documentation");
		}));


		
		con.addControl(menuBar);
		con.addControl(buttonCon);
		con.addControl(this.content);
		con.addControl(footer);
		this.addControl(con);
	},

	/**
	 * @return Banana.Control
	 */
	getMessageBar : function()
	{
		return this.messagebar;
	}	
});
