/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary Dom Helper. dom writer for various banana actions
 */

/** @namespace Banana.Util.StateManager */
goog.provide('Banana.Util.StateManager');

/**
 * Creates a statemanager. It allows to store values in a cookie.
 * 
 * @constructor
 */
Banana.Util.StateManager = (function()
{
	/**
	 * @ignore
	 */
	function setCookie (name, value, expires, path, domain, secure) {
		  var curCookie = name + "=" + escape(value) +
		      ((expires) ? "; expires=" + expires.toGMTString() : "") +
		      ((path) ? "; path=" + path : "") +
		      ((domain) ? "; domain=" + domain : "") +
		      ((secure) ? "; secure" : "");
		  document.cookie = curCookie;
		}

	/**
	 * @ignore
	 */
	function getCookie(name) {
		var results = document.cookie.match ( '(^|;) ?' + name + '=([^;]*)(;|$)' );

		  if ( results )
		    return ( unescape ( results[2] ) );
		  else
		    return null;
		}
		
	return({
	
		/**
		 * @param {String} name
		 * @param {String} value
		 */
		setState : function(name,value)
		{
			//TODO improve speed by not overwriting same values COOKie writing is slow!!!
			setCookie(name,value);
		},
		
		/**
		 * @param {String} name
		 * @return {String}
		 */
		getState : function(name)
		{
			var c = getCookie(name);
			if (c == 'false') {return false;}
			else if ( c=='true'){return true;}
			return c;
		},
		
		/**
		 * @param {String} name
		 */
		removeState : function(name)
		{
			setCookie(name,"");
		}

	});
}());