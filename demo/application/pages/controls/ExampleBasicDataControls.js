goog.provide('Application.Controls.Examples.ExampleBasicDataControls');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');


namespace('Application.Controls.Examples').BasicDataControls = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var datasource = ['foo','bar','bar2'];
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.TextBox()
		).setData('Textbox'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.TextArea()
		).setData('TextArea'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.DropDown()
				.setDataSource(datasource)
		).setData('DropDown'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.MultiSelect()
				.setDataSource(datasource)
		).setData('MultiSelect'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.CheckBox()
		).setData('Checkbox'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.RadioButton()
		).setData('Radiobutton'));	
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.CheckboxList()
				.setDataSource(datasource)
		).setData('Checkbox list'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.RadioButtonList()
				.setDataSource(datasource)
		).setData('RadioButton list'));
	},
	
	getCode : function()
	{
		return "aap";
	}
	
});
