goog.provide('Application.Pages.Home');
goog.require('Application.Controls.Examples.DemoPage');

namespace('Application.Pages').Home = Application.Controls.Examples.DemoPage.extend( {

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
		title.setData("Short description of Banana");
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
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("fast render engine");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Free for commercial use");
		ul.addControl(l1);
		
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Desktop and Mobile");
		ul.addControl(l1);
				
		var l1 = new Banana.Controls.ListItem();
		l1.addControl("Customizable");
		ul.addControl(l1);
		
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
		l6.addControl("JQuery powered");
		ul.addControl(l6);
		
		var l6 = new Banana.Controls.ListItem();
		l6.addControl("Google closure build integration");
		ul.addControl(l6);
		
		
		
		ex.addControl(ul);
	},
	
	createSubs : function()
	{
		return;
		var pan = new Banana.Controls.Panel();
		pan.addCssClass("borderPanewl");
		pan.setStyle("background-color:red;height:200px;width:200px;float:left;margin:5px;");
		this.right.addControl(pan);
		
		var pan = new Banana.Controls.Panel();
		pan.addCssClass("borderPanwel");
		pan.setStyle("background-color:blue;height:200px;width:200px;float:left;margin:5px;");
		this.right.addControl(pan);
		
		var from = 0;
		var to = 100;
		
		var colorStopStart = "0.08";
		var colorStopStop = "0.08";
		var rStart = 255;
		var gStart = 0;
		var bStart = 0;
		var rEnd = 219;
		var gEnd = 3;
		var bEnd = 66;
		
		var steps = 30;
		var currentStep = 1;
		var dir = 1;
		
		var currentR = rStart;
		var currentG = gStart;
		var currentB = bStart;
		
		
		
		var s1Start = -14;
		var s2Start = 4;
		
		var s1End = 40;
		var s2End = -33;
			
		currents1 = s1Start;
		currents2 = s2Start;
		
		function a()
		{
			
			if (currentStep > steps)dir = -1
			if (currentStep < 0) dir = 1;
			
			if (dir ==1 ) currentStep++;
			if (dir == -1) currentStep--;
			
			var rStepSize = ((rEnd-rStart)/30) * dir;
			var gStepSize = ((gEnd-gStart)/30) * dir;
			var bStepSize = ((bEnd-bStart)/30) * dir;
			
			var s1StepSize = ((s1End-s1Start)/30) * dir;
			var s2StepSize = ((s2End-s2Start)/30) * dir;
			
			
			currentR+=Math.round(rStepSize);
			currentG+=Math.round(gStepSize);
			currentB+=Math.round(bStepSize);
			
			currents1+=s1StepSize;
			currents2+=s2StepSize;
			console.log(currents1,currents2)

			pan.setCss(
					{
						'background-image':'-webkit-gradient(linear,left bottom,left top, color-stop(0.08, rgb('+currentR+','+currentG+','+currentB+')),color-stop(0.6, rgb(255,0,0)))',
						'-webkit-box-shadow':currents1+'px '+currents2+'px 4px 4px #222222;'
					})

			//color-stop(0.08, rgb(255,0,0)),
			//color-stop(0.6, rgb(219,3,3))
			
			console.log('set')
						
			setTimeout(function(){
				
				a();
			},20);
		}
		
		a();
		
	},
	
	createRands : function()
	{
		var bottom = new Banana.Controls.Panel();
		bottom.addCssClass("bottom");
		this.addControl(bottom);
			
		var summary = new Banana.Controls.Panel();
		summary.addCssClass("summaryText");
		summary.addControl("Banana is an opensource javascript application framework designed to create pure javascript webpages. Banana is designed with the single goal to help developers write fast and efficient websites. Compatible with all major desktop and mobile browsers, Banana gives developers a component driven platform to develop applications just in the same way regular interface toolkits provides.");
		
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
