goog.provide('Banana.Util.ValidationManager');

/**
 * Validation manager. Helper to centralize validators
 * 
 * @constructor
 */
Banana.Util.ValidationManager = function()
{
	var validators = [];

	function hasValidator(validator)
	{
		for (i = 0,len = validators.length; i < len; i++)
		{
			if (validators[i].id == validator.id)
			{
				return true;
			}
		}

		return false;
	}

	return( {

		/**
		 * adds a validator to the manager
		 * 
		 * @param {Banana.Controls.Decorators.Validator} validator
		 */
		addValidator : function(validator)
		{
			if (!hasValidator(validator))
			{
				validators.push(validator);
			}
		},
		
		/**
		 * @return {boolean} true when validator exists in manager
		 * 
		 * @param {Banana.Controls.Decorators.Validator} validator
		 */
		hasValidator : function(validator)
		{
			if (validators.indexOf(validator) == -1) return false;
			
			return true;
		},

		/**
		 * removes validator
		 * 
		 * @param {Banana.Controls.Decorators.Validator} validator
		 */
		removeValidator : function(validator)
		{
			var iOfV = validators.indexOf(validator);

			validators.splice(iOfV,i);
		},

		/**
		 * removes all validators
		 */
		removeValidators : function()
		{
			validators = [];
		},
		
		/**
		 * validates specific validator
		 * 
		 * @param {Banana.Controls.Decorators.Validator} validator
		 */
		validate : function(validator)
		{
			return validator.isValid();
		},

		/**
		 * validates all added validators
		 */
		validateAll : function()
		{
			var ok = true;

			for (i = 0,len = validators.length; i < len; i++)
			{
				if (!validators[i] || !validators[i].id)
				{
					continue;
				}
	
				if (!validators[i].isValid())
				{
					ok = false;
				}
			}
			return ok;
		}
	});
}()