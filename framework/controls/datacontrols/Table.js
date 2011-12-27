/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Table
 */

goog.provide('Banana.Controls.DataControls.Table');

goog.require('Banana.Controls.DataControls.DataControl');

/** @namespace Banana.Controls.Table */
namespace('Banana.Controls').Table = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.Table.prototype */
{
	
	/**
	 * Creates a table element
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * @override
 * @return {String}
 */
Banana.Controls.Table.prototype.getTagName = function()
{
		return 'table';
};


/** @namespace Banana.Controls.TableRow */
namespace('Banana.Controls').TableRow = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.TableRow.prototype */	
{
	/**
	 * Creates a table row also known as the tr element
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * @override
 * @return {String}
 */
Banana.Controls.TableRow.prototype.getTagName = function()
{
		return 'tr';
};

/** @namespace Banana.Controls.TableCol */
namespace('Banana.Controls').TableCol = Banana.Controls.DataControl.extend(
/** @lends Banana.Controls.TableCol.prototype */
{
	/**
	 * Creates a table row also known as the td element
	 * @constructs
	 * @extends Banana.Controls.DataControl
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * @override
 * @return {String}
 */
Banana.Controls.TableCol.prototype.getTagName = function()
{
	return 'td';
};


/** @namespace Banana.Controls.TableHeaderCol */
namespace('Banana.Controls').TableHeaderCol = Banana.Controls.TableCol.extend(
/** @lends Banana.Controls.TableHeaderCol.prototype */
{
	/**
	 * Creates a table row also known as the th element
	 * @constructs
	 * @extends Banana.Controls.TableCol
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * @override
 * @return {String}
 */
Banana.Controls.TableHeaderCol.prototype.getTagName = function()
{
	return 'th';
};