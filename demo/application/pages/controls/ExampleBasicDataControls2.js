goog.provide('Application.Controls.Examples.ExampleBasicDataControls2');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');


namespace('Application.Controls.Examples').BasicDataControls2 = Application.Controls.Examples.ControlOverview.extend	({
	
	createComponents : function()
	{
		var datasource = ['foo','bar','bar2'];
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Link()
				.addControl("A link")
				.setHref("none")
		).setData('Link'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Button()
				.setText("Button")
		).setData('Button'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.MaskedTextBox()
				.setMask("9999-99")
		).setData('MaskedTextBox'));
		 
		
		var fieldset = new Banana.Controls.Fieldset();
		var legend = new Banana.Controls.Legend();
		legend.addControl("Title");
		fieldset.addControl(legend);
		fieldset.addControl("some text here");
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				fieldset
		).setData('Fieldset'));
		
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.DatePicker()
		).setData('Datepicker'));
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				new Banana.Controls.Slider()
				.setStyle("width:200px;")
				.setData(5)
		).setData('Slider'));
		
		
		var window = new Banana.Controls.Window();
		window.setTitle("a window");
		window.addControl("Controls or text here");
			
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				window
		).setData('window'));
		
		var html = '<div style="background-color:lightblue;width:200px;color:red;"><h3>title</h3><h2>title</h2></div>';
		var panel = new Banana.Controls.Panel();
		panel.addControl(html);
		
		this.addControl(new Banana.Controls.Decorators.LabelDecorator(
				panel
		).setData('html'));

		
	}
	
});
