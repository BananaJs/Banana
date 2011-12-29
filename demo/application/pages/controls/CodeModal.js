goog.provide('Application.Controls.Examples.CodeModal');


namespace('Application.Controls.Examples').CodeModal = Banana.Controls.Modal.extend( {
	
	init : function(code)
	{
		this._super();
		
		this.setButtons([new Banana.Controls.Button()
						.setText("Close")
						.bind('click',this.getProxy(function(){
							this.hide();
						}))
		            
		                 ]);
		
		
		this.codePanel = new Banana.Controls.Panel();
		this.addControl(this.codePanel);
	},
	
	setCode : function(code)
	{
		this.codePanel.clear();
		this.codePanel.addControl(code);
		this.codePanel.invalidateDisplay();
	}
});