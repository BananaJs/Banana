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
		
		
		this.codePanel = new Banana.Controls.Panel().setStyle('font-size:10px;width:100%;height:100%;');
		this.codePanel.addCssClass("codeModalText");
		this.addControl(this.codePanel);	
		this.setKeepFixed(false);
	},

	setCode : function(code)
	{
		this.codePanel.clear();
		
		var str = js_beautify(code,{
			brace_style : 'end-expand',
			indent_char : '&nbsp;'
		});
			
			
		str = str.replace(/\n/g, "<br>");
		
		//Banana.Util.DomHelper.setData(js_beautify(code),this.codePanel,true);
		this.codePanel.addControl(str);
		this.codePanel.invalidateDisplay();
	}
});