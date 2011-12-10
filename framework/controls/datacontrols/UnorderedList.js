/**
 * @author Nick de Groot
 * @package Banana.Controls
 * @summary UnorderedList
 */

goog.provide('Banana.Controls.DataControls.UnorderedList');


/** @namespace Banana.Controls.UnorderedList */
namespace('Banana.Controls').UnorderedList = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.UnorderedList.prototype */
{
	/**
	 * Creates a unorderedlist also known as ul
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function(mask)
	{
		this._super();
	}
});

/**
 * @return {String}
 */
Banana.Controls.UnorderedList.prototype.getTagName = function()
{
		return 'ul';
};

/** @namespace Banana.Controls.ListItem */
namespace('Banana.Controls').ListItem = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.ListItem.prototype */
{
	/**
	 * Creates a listitem used in a unorderedlist. this element is known as li
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function(mask)
	{
		this._super();
	}	
});

/**
 * @return {String}
 */
Banana.Controls.ListItem.prototype.getTagName = function()
{
	return 'li';
}