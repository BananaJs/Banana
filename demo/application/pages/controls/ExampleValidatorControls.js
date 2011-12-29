goog.provide('Application.Controls.Examples.ExampleValidatorControls');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');


namespace('Application.Controls.Examples').ExampleValidatorControls = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		this.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
							new Banana.Controls.Decorators.RequiredFieldValidator(
								new Banana.Controls.TextBox()
							)
					).setData('Required field')
		);
		
		this.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
							new Banana.Controls.Decorators.RequiredFieldValidator(
								new Banana.Controls.TextBox()
							).setValidateOnEventType("focusout")
					).setData('Required field validate on focusout')
		);
		
		this.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
							new Banana.Controls.Decorators.CharLimitFieldValidator(
								new Banana.Controls.TextBox()
							).setMaxChars(10)
					).setData('max 10 chars')
		);
		
		var ctrl = new Banana.Controls.TextBox();
		
		this.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
							new Banana.Controls.Decorators.EqualValidator(
								ctrl
							)
					).setData('repeat')
		);
		
		this.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
							new Banana.Controls.Decorators.EqualValidator(
								new Banana.Controls.TextBox()
							)
							.setControlToMatch(ctrl)
							.setValidateOnEventType("focusout")
							.setInfoText("Field A and B should be the same")
					).setData('repeat')
		);
		
		this.addControl(
				new Banana.Controls.Decorators.LabelDecorator(
							new Banana.Controls.Decorators.RegExValidator(
								new Banana.Controls.TextBox()
							).setRegExString(/^[1-9]{4}$/)
							.setInfoText("Should match /^[1-9]{4}$/")
					).setData('Regex validator')
		);
	}
	
});
