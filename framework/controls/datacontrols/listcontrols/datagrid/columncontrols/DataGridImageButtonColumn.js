/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary DataGridImageButtonColumn 
 */

goog.provide('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridImageButtonColumn');

goog.require('Banana.Controls.DataControls.ListControls.DataGrid.ColumnControls.DataGridColumn');

/** @namespace Banana.Controls.DataGridImageButtonColumn */
namespace('Banana.Controls').DataGridImageButtonColumn = Banana.Controls.DataGridColumn.extend(
/** @lends Banana.Controls.DataGridImageButtonColumn.prototype */		
{
	/** 
	 * Create datagrid header image button for usage in table list renders.
	 * Use set image url to define a image
	 * @constructs 
	 * @extends Banana.Controls.DataGridColumn 
	 */
	init : function()
	{
		this._super();
	}
});

/**
 * @ignore
 * @return {Banana.UiControl}
 */
Banana.Controls.DataGridImageButtonColumn.prototype.getControl = function()
{
	var b = new Banana.Controls.Image();
	b.setCss({'cursor':'pointer'});
	b.setImage(this.imageUrl);
	
	b.bind('click',this.getProxy(function(e)
	{
		function getItemRender(c)
		{
			if (c instanceof Banana.Controls.DataGridTableItemRender)
			{
				return c;
			}
			
			return getItemRender(c.getParent());
		}
		
		var ir = getItemRender(b);
		
		var index = this.listRender.getIndexByItemRender(ir);
		
		e.stopPropagation();

		var params = {'commandName':this.commandName,
				'index':index,
				'data':this.listRender.datasource[index]
		};

		this.listRender.triggerEvent('onCommand',params);
	}));

	return b;
};

/**
 * sets image url.
 *
 * @param {String} url
 * @return {this}
 */
Banana.Controls.DataGridImageButtonColumn.prototype.setImageUrl = function(url)
{
	this.imageUrl = url;
	return this;
};

/**
 * Sets command name which can be retreived in the onCommand event of the datagrid
 * @param {String} name
 * @return {this}
 */
Banana.Controls.DataGridImageButtonColumn.prototype.setCommandName = function(name)
{
	this.commandName = name;
	return this;
};
