goog.provide('Banana.Controls.DataGridTreeListNodeToggle');

/**
 * @author    Gillis Haasnoot <gillis[at]vivesta[dot]com>
 * @link 	  www.vivesta.com
 * @copyright Copyright &copy; 2011
 * @license   xxx
 * @version   0.0.1
 * @package   Banana
 *
 * Node toggle used in advanced datagrid tree list
 * 
 */
namespace('Banana.Controls').DataGridTreeListNodeToggle = Banana.Controls.Panel.extend({
	
	createComponents : function()
	{
		this.createImage();
		
		this.bind('click',this.getProxy(function(){
			
			this.on = this.on ? false : true;
			
			this.triggerEvent('toggle',this.on);
			
			this.createImage();
		}));
	},
	
	createImage :function()
	{
		if (this.on)
		{
			this.removeCssClass("BDataGridTreeNodeClosed");
			this.addCssClass("BDataGridTreeNodeOpen");
		}
		else
		{
			this.removeCssClass("BDataGridTreeNodeOpen");
			this.addCssClass("BDataGridTreeNodeClosed");
		}
	},
	
	/**
	 * passive function (need to be set prior to render)
	 * 
	 * @param {Boolean} bool
	 */
	setOn : function(bool)
	{
		this.on = bool;
			
		return this;
	}
});