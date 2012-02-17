goog.provide('Application.Pages.MyPage');

namespace('Application.Pages').MyPage = Banana.Page.extend( {

	/**
	 * @constructor
	 */
    init: function() {
    	
		this._super();    	
	},

	/**
	 * Called by the framework prior to render phase
	 */
	createComponents: function()
	{
		this.addControl('hello world');
	},
	
	/**
	 * Called by the framework after render phase
	 */
	updateDisplay : function()
	{
		
	}
});