/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Base validator class
 */

goog.provide('Banana.Controls.Decorators.Validator');

/** @namespace Banana.Controls.Decorators.Validator  */
namespace('Banana.Controls.Decorators').Validator = Banana.Controls.Decorators.Decorator.extend(
/** @lends Banana.Controls.Decorators.Validator.prototype */
{
	/**
	 * Creates base control to validate a control
	 * Any Banana.Controls.DataControl can be validated. If you need to change the eventtype where
	 * the validator is triggered on, use setValidateOnEventType. By default the validator
	 * will be triggered when the validated control fires a dataChanged or focusout event
	 * 
	 * @param {Banana.Controls.DataControl} controlToValidate
	 * @constructs
	 * @extends Banana.Controls.Decorators.Decorator
	 */
	init : function(controlToValidate)
	{
		this._super(controlToValidate);

		this.showIndicator = true; //little dot in front visible
		
		this.validationGroup = 'default';

		var iconPlaceHolder = new Banana.Controls.Panel().addCssClass('BValidatorIconPlaceHolder').setId('validator icon placeholder');;
		this.addControl(iconPlaceHolder)

		controlToValidate.addCssClass('BValidatorDecorated');
		this.controlToValidate = controlToValidate;
		this.addControl(controlToValidate);

		this.infoPlaceHolder = new Banana.Controls.Panel().addCssClass('BValidatorInfoPlaceHolder');
		this.addControl(this.infoPlaceHolder)

		this.star = new Banana.Controls.Panel().setId('validator star');;
		this.star.addCssClass('BValidatorStar');
		if (this.getInfoText())
		{
			this.star.setAttribute('title', this.getInfoText());
		}
		iconPlaceHolder.addControl(this.star);

		this.arrow = new Banana.Controls.Panel().setId('validator arrow');
		this.arrow.addCssClass('BValidatorArrow');
		this.infoPlaceHolder.addControl(this.arrow);

		this.info = new Banana.Controls.Panel().addCssClass('BValidatorInfo').setId('validator info placeholder');;
		this.infoPlaceHolder.addControl(this.info);

		Banana.Util.ValidationManager.addValidator(this);
		
		return this;
	},

	/**
	 * @override
	 */
	createComponents : function()
	{
		this.info.setVisible(false);
		this.arrow.setVisible(false);
		
		this.createLabelText();

		this.star.setVisible(this.showIndicator);

		//if user explicity gave type of event to validate on
		if (this.validateOnEventType)
		{
			this.controls[1].bind(this.validateOnEventType,this.getProxy(this.isValid));	
		}
		//otherwise just use default
		else
		{
			this.controls[1].bind('dataChanged',this.getProxy(this.isValid));
			//TODO this cannot count for all type of controls
			this.controls[1].bind('focusout',this.getProxy(function(){}))
		}
	},
	
	/**
	 * When control is removed, we also remove it from the validation manager.
	 * TODO: is this really needed here?
	 * @override
	 */
	unload : function()
	{
		this._super();
		Banana.Util.ValidationManager.removeValidator(this);
	},
	
	/**
	 * @ignore
	 */
	createLabelText : function()
	{
		if (!this.labelText)
		{
			this.labelText = new Banana.Controls.Label();
			this.labelText.addCssClass('BValidatorLabel');
			this.info.addControl(this.labelText);
		}
		
		this.labelText.setData(this.getInfoText());
	},
	
	/**
	 * shows indicator
	 */
	showIndicators : function()
	{
		this.info.setVisible(true);
		this.arrow.setVisible(true);		
	},
	
	/**
	 * hides indicator
	 */
	hideIndicators : function()
	{
		this.info.setVisible(false);
		this.arrow.setVisible(false);		
	},
	
	/**
	 * @param {boolean} value if true when show a little dot in front of the control
	 */
	setShowIndicator: function(value)
	{
		this.showIndicator = value;
		return this;
	},
		
	/**
	 * default = dataChanged
	 * all dom events are supported, depending on the control type
	 * @param {String} event type to validate on
	 * @return {this}
	 */
	setValidateOnEventType : function(event)
	{
		this.validateOnEventType = event;
		return this;
	},

	/**
	 * @return {Banana.Controls.DataControl}
	 */
	getValidatedControl : function()
	{
		return this.controlToValidate;
	},

	/**
	 * @override
	 * we need to know the original border color
	 */
	updateDisplay : function()
	{
		this.orgBorder = this.controls[1].getStyleProperty('border');
	},
	
	/**
	 * Manual way to invalidate the control
	 * @return {this}
	 */
	markInvalid : function(customText)
	{
		this.markedInvalid = true;
		
		if (customText)
		{
			this.oldInfoText = this.infoText;
			this.infoText = customText;
		}
		
		this.isValid();
		return this;
	},
	
	/**
	 * Removes manual mark as invalid flag
	 */
	removeMarkInvalid : function()
	{
		this.markedInvalid = undefined;
		
		if (this.oldInfoText)
		{
			this.infoText = this.oldInfoText;
		}
		
		this.isValid()
	},

	/**
	 * @return bool true when validator is considered as valid
	 */
	isValid : function()
	{
		if (!this.controls)
		{
			//prevent situation that this method is called while child controls are being removed
			return false;
		}
		var c = this.controls[1];
		
		//disabled controls no need to validate
		if (!c.enabled)
		{
			return true;
		}
		
		var result;
		
		//when user manually marked this validator invalid we wont look
		//if this control is really invalid. We follow users wish
		if (this.markedInvalid)
		{
			result = false;
		}
		else
		{
			result = this.validateData(c.getData(true));
		}
		
		if (result==false)
		{
			this.createLabelText();
			c.addCssClass('BValidatorControlInvalidated');
			this.showIndicators();
			return false;
		}
		else if (result==true)
		{
			c.removeCssClass('BValidatorControlInvalidated');
			this.hideIndicators();
			return true;
		}
	},

	/**
	 * abstract override this method to implement your own validate data 
	 * @param mixed 
	 */
	validateData : function(data)
	{
		return true;
	},

	/**
	 * @return {String}
	 */
	getInfoText : function()
	{
		return this.infoText || '';
	},

	/**
	 * @param {String} text shown when control is invalid
	 * @return {this}
	 */
	setInfoText : function(text)
	{
		this.infoText = text;
		return this;
	},

	/**
	 * Use this method to put validators in a group
	 * @param {String} group
	 * @return {this}
	 */
	setValidationGroup : function(group)
	{
		this.validationGroup = group;
		return this;
	},
	
	/**
	 * @return {String}
	 */
	getValidationGroup : function()
	{
		return this.validationGroup;
	},

	/**
	 * @return {mixed}
	 */
	getData : function()
	{
		return this.controls[1].getData();
	},

	/**
	 * @override
	 * @param {mixed} data
	 * @param {boolean} ignoreEvent
	 * @param {boolean} ignoreDom
	 * @return {this}
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		this.controls[1].setData(data,ignoreEvent,ignoreDom);
		return this;
	},
	
	/**
	 * @override
	 */
	getHtml : function()
	{
		var html = [];

		var childs = this.getControls();

		for (var i =0, len = childs.length; i < len; i++)
		{
			if (childs[i] instanceof Banana.Control)
			{
				html.push(childs[i].getHtml());
			}

			else if (typeof(childs[i]) == 'string')
			{
				html.push(childs[i]);
			}
		}

		return html.join('');
	}
});