/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Date picker. using jquery ui datapicker
 */

goog.provide('Banana.Controls.DataControls.Image');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.Image */
namespace('Banana.Controls').Image = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.Image.prototype */
{
	/**
	 * Creates a image. use setImage to set the source and setTitle for the title attribute
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * sets image source
 * @param {String} image
 * @return {this}
 */
Banana.Controls.Image.prototype.setImage = function(image)
{
	this.setAttribute('src',image);
	return this;
};

/**
 * sets titlte
 * @param {String} title
 * @return {this}
 */
Banana.Controls.Image.prototype.setTitle = function(title)
{
	this.setAttribute('title', title);
	return this;
};

/**
 * @return {String}
 */
Banana.Controls.Image.prototype.getTagName = function()
{
	return 'img';
};

/**
 * @ignore
 */
Banana.Controls.Image.prototype.setDomData = function(data)
{
	jQuery('#'+this.getClientId()).attr({'src':data});
};