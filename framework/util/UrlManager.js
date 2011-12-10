/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary UrlManager
 */

/** @namespace Banana.Util.UrlManager */
goog.provide('Banana.Util.UrlManager');

/**
 * Url Manager. It allows a user to manager url parameters in the achor part of the url.
 * It provides the functionality to set url parameters, listen to changes in the url and 
 * mark and read history points
 * 
 * @constructor
 */
Banana.Util.UrlManager = (function()
{
	var initials = [];
	var listeners = {};
	var paramHistory = {};
	var delim = "&";
	var members = {};
	var started = false;
	var timeout; 
	var timeoutLength = 20;
	var handler = null;
	var urlCheckHandler = null;
	var running = false;
	
	/**
	 * @ignore
	 * @return object
	 */
	getUrlObject = function()
	{
		var url = getBrowserUrl(); 
		var urlObject = {};
		var key; 
		var value; 
		var itemData;
		
		url = url.split(delim);
		
		for (var i = url.length-1; i>=0; i--) {
			itemData = url[i].split("=");
			key = itemData[0];
			urlObject[key] = itemData.slice(1).join("=");
		}
		return urlObject;
	};
	
	
	/**
	 * sets the browser url. for ie we do this in a iframe
	 * @ignore
	 */
	setBrowserUrl = function(newUrl) 
	{
		if (navigator.appName == 'Microsoft Internet Explorer' && document.getElementById("URLFrame")) 
		{
			document.frames["URLFrame"].location.replace(document.frames["URLFrame"].location.pathname + "?" + location.hash.slice(1));
			
			document.getElementById("URLFrame").setAttribute("src", document.frames["URLFrame"].location.pathname + "?" + newUrl);
			location.hash = newUrl;
		}
		else 
		{
			location.hash = newUrl;
		
		}
	},
	
	/**
	 * @return string url of the browser. for ie we use the iframe
	 * @ignore
	 */
	getBrowserUrl = function()
	{
		if (navigator.appName == 'Microsoft Internet Explorer' && document.getElementById("URLFrame")) {
				
			location.hash = document.frames["URLFrame"].location.search.slice(1);
			return document.frames["URLFrame"].location.search.slice(1);
		}
		else 
		{
			return location.hash.slice(1);
		}
	};
	
	
	/**
	 * updates url according to current registered modules
	 * @ignore
	 */
	updateBrowserUrl = function() 
	{
		var newUrl = "";

		//to ensure we have always sorted url params.
		//we do this to prevent situations with 2 equal url params in 2 different sequences
		members = Banana.Util.sortObjectKeys(members);

		for (var key in members)
		{
			if (members[key].bhmValue)
			{
				newUrl = newUrl + (newUrl.length === 0 ? "" : delim);
				newUrl = newUrl + key + "=" + members[key].bhmValue;
			}
		}
		
		//dont register duplicated urls
		if (newUrl ==getBrowserUrl()) return;
		
		setBrowserUrl(newUrl);
	};
	
	/**
	 * Starts checking the url for changes
	 * @ignore
	 */
	startChecking = function()
	{
		stopHandler = false;
		
		if (!running)
		{
			startHandler();
		}
	};
	
	/**
	 * Starts the handler for url change detection.
	 * If a change in the achor part of the url is dedected we trigger a url.{key} event
	 * @ignore
	 */
	startHandler = function()
	{
		running = true;

		if (stopHandler)
		{
			clearTimeout(urlCheckHandler);
			stopHandler = false;
			return;
		}
		
		if (!handler)
		{
			/**
			 * @ignore
			 */
			handler = function()
			{
				var currentURL = getUrlObject();
				var currentURLVal;
				for (var key in members) 
				{		
					currentURLVal = currentURL[key] || "";
					if (!members[key] || !currentURL[key]) continue;
					
					if (members[key].bhmValue != currentURLVal) 
					{
						members[key].bhmValue = currentURLVal;
						jQuery(document).trigger("url." + key, [currentURLVal, key]);
					}
				}
				
				startHandler();
			};
		}
			
		urlCheckHandler = setTimeout(handler, 20);
	}, 
	
	/**
	 * Stops checking
	 * @ignore
	 */
	stopChecking = function() 
	{	
		stopHandler = true;
		clearTimeout(urlCheckHandler);	
		urlCheckHandler = null;
		running = false;
	}
	
	
	/**
	 * public properties
	 */
	return({
		/**
		 * registers module in the url. This doesn't mean that we see it in the url. 
		 * A value needs to be set first.
		 * 
		 * @param {String} name of the url param
		 */
		registerModule : function(name)
		{
			if (!members[name])
			{
				members[name] = {};
			}
			
			if (getUrlObject()[name])
			{
				members[name].bhmValue =  getUrlObject()[name]; //w
			}
			else
			{
				members[name].bhmValue = "";
			}
		},
		
		/**
		 * Auto registers modules by looking at the current url
		 * All parameters in the achor part will be registered as a module
		 */
		autoRegisterModules : function()
		{
			params = getUrlObject();
			
			for(param in params)
			{
				if (param)
				{
					this.registerModule(param);
				}
			}
		},
		
		/**
		 * Stop checking the url for changes
		 */
		stopChecking : function()
		{
			stopChecking();
		},
		
		/**
		 * Start checking the url for changes
		 */
		startChecking : function()
		{
			startChecking();
		},
		
		/**
		 * unregisters all modules. Change in url params pointing to removed modules
		 * will not result in a trigger change event
		 */
		removeModules : function()
		{
			for (var key in members)
			{
				stopChecking();
				this.unlistenModule(key);
			}
			members = {};		
		},
		
		/**
		 * Clears the url by first removing all the modules (no change event can occur) 
		 * and then remove all the external registered listeners.
		 */
		clearUrl : function()
		{
			this.removeModules();
			//remove rest of registered listeners
			this.removeListeners();
		},
		
		/**
		 * removes module from url
		 * 
		 * @param {String} name of the param which should be removed from the url
		 * @param {boolean} when true we only remove the param from the url. It stays registered.
		 */
		removeModule : function(name,hideOnly)
		{
			stopChecking();

			if (!hideOnly)
			{
				this.unlistenModule(name);
				delete members[name];
			}
			else
			{
				members[name]['bhmValue'] = '';
			}
			
			updateBrowserUrl();
			for (var key in members)
			{
				return startChecking();
			}
		},
		
		/**
		 * sets module value in the url.
		 * Calling this method will result in a visible url change. 
		 * 
		 * @param {String} name of the url parameter
		 * @param {String} value 
		 * @param when true we dont update the url itself. so it wont trigger a change event
		 */
		setModule : function(name,value,dontUpdateUrl)
		{
			if (!name )return;
			dontUpdateUrl = dontUpdateUrl || false;

			if (!members[name]) return false;
			
			stopChecking();
		
			members[name].bhmValue = value;
			
			if (!dontUpdateUrl)
			{
				if (members[name] && this.getModule[name] != value)
				{
					updateBrowserUrl();
					jQuery(document).trigger("url." + name, [value, name]);
				}
			}
				
			startChecking();
		},
		
		/**
		 * forces url to be updated
		 * Handy when you register multiple modules without updating url to prevent multiple
		 * browser history moments 
		 */
		updateUrl : function()
		{
			updateBrowserUrl();
		},
		
		/**
		 * gets the value of a registered module.
		 * We always try to fetch the internally registered value first. 
		 * @return {String} param name of in the url
		 */
		getModule : function(param)
		{
			//first we try to fetch a value from members array
			//we could have set an url param without affecting the url itself.
			//this is the array where the value should be in
			if (members[param] && members[param].bhmValue)
			{
				return members[param].bhmValue;
			}
			//otherwise just fetch it from the url
			else if (getUrlObject()[param])
			{
				return getUrlObject()[param];
			}

			return null;
		},
		
		/**
		 * saves module history 
		 */
		saveModuleHistory : function()
		{
			paramHistory[this.getModule('section')] = getUrlObject();	
		},

		/**
		 * @return Object returns module history
		 */
		getModuleHistory : function(name)
		{
			return paramHistory[name];
		},
		
		/**
		 * gets current browser url.
		 * @return {String}
		 */
		getBrowserUrl : function()
		{
			return getBrowserUrl();
		},
	
		/**
		 * gets complete history
		 * @return {Array}
		 */
		getHistory : function()
		{
			return paramHistory;
		},
		
		/**
		 * binds a function to a url change event. when  
		 * 
		 * @param {String} name of the url parameter to listen on
		 * @param {Function} fn callback function when change is detected
		 * @param {mixed} data optional
		 */
		listenModule : function(name, fn, data)
		{
			if (!data) {data = {}}
			stopChecking(name);
			
			jQuery(document).bind("url." + name,data, fn);
			listeners[name] = true;
			startChecking(name);
		},
		
		/**
		 * unbinds all functions from change event
		 * 
		 * @param {String} name of the url parameter
		 */
		unlistenModule : function(name) 
		{
			//TODO: Could be done per function instead of removing all binds
			jQuery(document).unbind("url." + name);
			delete listeners[name];
		},
		
		/**
		 * Removes all listeners
		 */
		removeListeners : function()
		{
			for (l in listeners)
			{
				if (typeof(listeners[l]) == 'function') { continue; }

				this.unlistenModule(l);
			}

			listeners = [];
		},
		
		/**
		 * @return {Object} of url key values
		 */
		getURLObject : function()
		{
			return getUrlObject();
		},
		
		/**
		 * Helper to construct url string from complex object
		 * @param {String} section
		 * @param {Object} params
		 * 
		 * @return {String} url
		 */
		createUrlString : function(section,params)
		{
			if (params)
			{
				//merge section into the params
				params.section = section;		
				
				params = Banana.Util.sortObjectKeys(params);
							
				var url = "";
				for(var j in params)
				{
					url +="&"+j+'='+params[j];
				}
				
				//remove first & and return url
				return url.substr(1,url.length);
			}
			else
			{
				return 'section='+section;
			}
		}	
	});
}());