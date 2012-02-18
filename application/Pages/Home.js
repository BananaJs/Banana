goog.provide('Application.Pages.Home');

namespace('Application.Pages').Home = Banana.Page.extend( {

    /**
     * @constructs
     */
    init: function() 
    {
		this._super();
		//User code here
	},

	createComponents: function()
	{
		//User code here
		this.addControl("Banana works");
	},
	
	updateDisplay : function()
	{
		//User code here
	}
	
});
