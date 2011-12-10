/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary Dom Helper. dom writer for various banana actions
 */

/** @namespace Banana.Util.DomHelper */
goog.provide('Banana.Util.DomHelper');

/**
 * responsible for writing dom elements
 */
/** 
 * @class 
 * @name Banana.Util.DomHelper
 * @constructor
 */
namespace('Banana.Util').DomHelper = 
/** @lends Banana.Util.DomHelper.prototype */
{	
	/**
	 * renders control to target
	 * 
	 * @param {String} data
	 * @param {mixed} target Banana.Control or dom id
	 * 
	 */
	render : function(data,target)
	{
		if (typeof(target) === 'string')
		{		
			jQuery('#'+target).append(data);			
		}
		else
		{				
			jQuery('#'+target.getClientId()).append(data);				
		}	
	},
	
	/**
	 * replaces content with another
	 * 
	 * @param {String} data
	 * @param {mixed} target Banana.Control or dom id
	 */
	replace : function(data,target)
	{
		if (typeof(target) === 'string')
		{		
			jQuery(target).replaceWith(data);			
		}
		else
		{
			jQuery('#'+target.getClientId()).replaceWith(data);				
		}
	},
	
	/**
	 * renders plain html to target
	 * 
	 * @param {String} data
	 * @param {mixed} target Banana.Control or dom id
	 * @param {boolean} dontAppend If true we replace existing data. Otherwise append
	 */
	renderHtml : function(html,target,dontAppend)
	{
		if (target.getClientId() === 'body')
		{
			if (dontAppend)
			{
				jQuery('body').html(html);
			}
			else
			{
				jQuery('body').append(html);	
			}
		}
		else
		{
			if (dontAppend)
			{
				jQuery('#'+target.getClientId()).html(html);
			}
			else
			{
				jQuery('#'+target.getClientId()).append(html);
			}
		}	
	},
	
	/**
	 * removes all child elements from control
	 * 
	 * @param {Banana.Control} control
	 */
	clear : function(control)
	{
		jQuery('#'+control.getClientId()).empty();
	},
	
	/**
	 * removes control from dom. removing also removes all child dom elements
	 * 
	 * @param {Banana.Control} control
	 */
	remove : function(control)
	{
		if (typeof(control) === 'string')
		{
			jQuery('#'+control).remove();
		}
		else
		{
			//seems that first clearing it and then removing it is a lot faster see http://api.jquery.com/remove/#expr but doesnt work somehow find out why
			//jQuery('#'+control.getClientId()).clear().remove();
			jQuery('#'+control.getClientId()).remove();
		}
	},
	
	/** 
	 * sets data on dom element. 
	 * 
	 * @param {String} value
	 * @param {Banana.Control} control
	 */
	setData : function(value, control )
	{	
		jQuery('#'+control.getClientId()).val(value);	
	},
	
	/** 
	 * Dedicated function to set text data on labels 
	 * 
	 * @param {String} value
	 * @param {Banana.Controls.Label} control
	 */
	setTextData : function(value,control)
	{
		jQuery('#'+control.getClientId()).text(value);
	},
	
	/** 
	 * Dedictated function to set data on checkboxes
	 * 
	 * @param {String} value
	 * @param {Banana.Controls.Checkbox} control
	 */
	setCheckBoxData : function(value,control)
	{
		if (value)
		{
			jQuery('#'+control.getClientId()).prop({'checked':true});
		}
		else
		{
			jQuery('#'+control.getClientId()).prop('checked',false);
		}		
	},
	
	/**
	 * gets data from dom data control
	 * @param {Banana.Control} control
	 * @return {String}
	 */
	getData : function(control)
	{		
		return jQuery('#'+control.getClientId()).val();		
	},
	
	/**
	 * dedicated function to retreive data from checkboxes
	 * @param {Banana.Controls.Checkbox} control
	 * @return {String}
	 */
	getCheckBoxData : function(control)
	{
		return jQuery('#'+control.getClientId()).prop("checked");
	},

	/**
	 * Mark all controls as cleared.
	 * Method is used during page transitions where new pages are rendered first, before the old one
	 * is removed.
	 * TODO: potentialy dangerous if user already used 'cleared' id somewhere. I suggest different id
	 * @param {String} id used to mark dom elements
	 */
	clearIdsFrom : function(id)
	{
		jQuery('#'+id + ' *').attr({'id':'cleared'});
		jQuery('#'+id).attr({'id':'cleared'});
	}
	
};