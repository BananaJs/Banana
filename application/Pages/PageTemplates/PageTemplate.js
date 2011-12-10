goog.provide('Application.Pages.PageTemplates.PageTemplate');

namespace('Application.Pages.PageTemplates').PageTemplate = Banana.PageTemplate.extend({
	
	createComponents : function()
	{	
		this.addControl(this.content);
	}
});