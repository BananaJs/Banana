/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Label control with character limit support
 */

goog.provide('Banana.Controls.DataControls.LimitCharLabel');

goog.require('Banana.Controls.DataControls.Label');

/** @namespace Banana.Controls.LimitCharLabel */
namespace('Banana.Controls').LimitCharLabel = Banana.Controls.Label.extend(
/** @lends Banana.Controls.LimitCharLabel.prototype */
{

	/**
	 * Creates a label with character limit support.
	 * if the supplied data exceeds the character limit we show only the character limit part of the data.
	 * @constructs
	 * @extends Banana.Controls.Label
	 */
	init : function()
	{
		this._super();
	},
	
	/**
	 * Sets character limit
	 * @param {int} limit
	 * @return {this}
	 */
	setCharLimit : function(limit)
	{
		this.charLimit = limit;
		return this;
	},

	/**
	 *  @override
	 * 
	 * 	@param {mixed} data for the label
	 *	@param {boolean} ignoreEvent when true no datachanged is triggered. This is useful when you are running in a circle or performance issues
	 *	@param {boolean} ignoreDom when true setDomData function is not called. Useful in cases of optimizing performance
	 *  @return {this}
	 */
	setData : function(data,ignoreEvent,ignoreDom)
	{
		if (this.charLimit && data && data.length > this.charLimit)
		{
			this.setAttribute('title',data);
			data = data.substr(0,this.charLimit) + '...';
		}

		return this._super(data,ignoreEvent,ignoreDom);
	}
});