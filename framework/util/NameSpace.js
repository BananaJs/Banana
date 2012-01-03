/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Datagrid Filter Manager  
 */

goog.provide('Banana.Util.NameSpace');


/**
 * Utility to use namespaces in functions
 * 
 * example usage : namespace("com.MyPackage").myClass = function(){};
 * var myclass = new com.MyPackage.myClass(); 
 * 
 * @param {String} name
 * @param {String} separator
 * @param {String} container
 * @return {String}
 * @constructor
 */
var namespace = function(name, separator, container)
{
	var ns = name.split(separator || '.'), o = container || window, i, len;
	for (i = 0, len = ns.length; i < len; i++) {
		o = o[ns[i]] = o[ns[i]] || {};
	}
	return o;
};