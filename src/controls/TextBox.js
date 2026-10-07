import {InputControl} from "./InputControl.js"

export class TextBox extends InputControl
{

	/**
	 * Creates a textbox.
	 * 
	 * Example:
	 * 
	   var textbox = new Banana.Controls.TextBox()
	   this.addControl(textbox); //add to collection
	   
	   textbox.setData("some text");
	   
	   textbox.bind("dataChanged",function(){
	   		//do something here
	   });
	   
	   
	 * @constructs
	 * @extends Banana.Controls.InputControl
	 */
	init()
	{
		this.data = "";
		super.init();
		this.setAttribute('type','text');
		this.addCssClass('BTextbox');

		this.bind('keyup',this.getProxy(this.onChange));
		this.bind('keypress',function(event){return event.keyCode != 13;});
	}
};