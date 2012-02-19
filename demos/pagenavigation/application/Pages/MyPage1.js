goog.provide('Application.Pages.MyPage1');

namespace('Application.Pages').MyPage1 = Banana.Page.extend( {

	createComponents: function()
	{
		this.setCss({'background-color':'blue'});
		
		var button = new Banana.Controls.Button();
		button.setText("Go to page 2");
		button.bind('click',function(){
			
			Banana.Application.loadPage("MyPage2")
		});
		
		this.addControl(button);
	}
});