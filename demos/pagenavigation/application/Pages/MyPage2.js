goog.provide('Application.Pages.MyPage2'); 

namespace('Application.Pages').MyPage2 = Banana.Page.extend( {

	createComponents: function()
	{
		this.setCss({'background-color':'red'});
		
		var button = new Banana.Controls.Button();
		button.setText("Go to page 1");
		button.bind('click',function(){
			
			Banana.Application.loadPage("MyPage1")
		});
		
		this.addControl(button);
	}
});