/*
Copyright (c) <2011>, <Gillis Haasnoot, Maarten van Schaik>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Main Application object
 */

/**
 *  this is needed for internet explorer which doesnt have a native indexOf method
 */
if (!Array.prototype.indexOf) 
{
	/**
	 * @ignore
	 */
	Array.prototype.indexOf = function(obj, start) 
	{
		var i,j;
	     for (i = (start || 0), j = this.length; i < j; i++) {
	         if (this[i] === obj) { return i; }
	     }
	     return -1;
	};
}

goog.provide('Banana');

goog.require('Banana.Util.NameSpace');
goog.require('Banana.Util.Base');
goog.require('Banana.Control');

goog.require('Banana.Util.ArrayBiCollection');
goog.require('Banana.Util.Utils');
goog.require('Banana.Util.ValidationManager');
goog.require('Banana.Util.UrlManager');
goog.require('Banana.Util.StateManager');
goog.require('Banana.Util.DomHelper');
goog.require('Banana.Util.DateTimecode');
goog.require('Banana.Util.Color');
goog.require('Banana.Util.LogManager');


goog.require('Banana.Data.DataSet');

goog.require('Banana.Page');
goog.require('Banana.PageTemplate');

goog.require('Banana.Controls.StatusBar');
goog.require('Banana.Controls.DataControls.TextBox');
goog.require('Banana.Controls.DataControls.Password');
goog.require('Banana.Controls.DataControls.TextArea');
goog.require('Banana.Controls.DataControls.CheckBox');
goog.require('Banana.Controls.DataControls.Table');
goog.require('Banana.Controls.DataControls.Label');
goog.require('Banana.Controls.DataControls.LimitCharLabel');
goog.require('Banana.Controls.DataControls.DatePicker');
goog.require('Banana.Controls.DataControls.DateTimePicker');
goog.require('Banana.Controls.DataControls.DateSpan');
goog.require('Banana.Controls.DataControls.Image');
goog.require('Banana.Controls.DataControls.RadioButton');
goog.require('Banana.Controls.DataControls.ProgressBar');
goog.require('Banana.Controls.DataControls.Timecode');
goog.require('Banana.Controls.DataControls.ListControls.RadioButtonList');
goog.require('Banana.Controls.DataControls.ListControls.CheckBoxList');
goog.require('Banana.Controls.DataControls.ListControls.DropDown');
goog.require('Banana.Controls.DataControls.ListControls.MultiSelect');
goog.require('Banana.Controls.DataControls.Slider');
goog.require('Banana.Controls.DataControls.UnorderedList');

goog.require('Banana.Controls.DataGrid');

goog.require('Banana.Controls.Window');
goog.require('Banana.Controls.Button');
goog.require('Banana.Controls.Link');
goog.require('Banana.Controls.LinkButton');
goog.require('Banana.Controls.Canvas');
goog.require('Banana.Controls.Modal');
goog.require('Banana.Controls.ConfirmModal');
goog.require('Banana.Controls.Fieldset');
goog.require('Banana.Controls.Legend');
goog.require('Banana.Controls.Title');
goog.require('Banana.Controls.Loader');
goog.require('Banana.Controls.Form');
goog.require('Banana.Controls.FileInput');
goog.require('Banana.Controls.TabSlider');

goog.require('Banana.Controls.Decorators.Decorator');
goog.require('Banana.Controls.Decorators.TimecodeFieldValidator');
goog.require('Banana.Controls.Decorators.RequiredFieldValidator');
goog.require('Banana.Controls.Decorators.RegExValidator');
goog.require('Banana.Controls.Decorators.CharLimitFieldValidator');
goog.require('Banana.Controls.Decorators.LabelDecorator');
goog.require('Banana.Controls.Decorators.LabelDecoratorRight');
goog.require('Banana.Controls.Decorators.InfoDecorator');
goog.require('Banana.Controls.Decorators.EqualValidator');

goog.require('Banana.Controls.HBox');
goog.require('Banana.Controls.VBox');


/**
 * Eventtypes used in Banana
 */
namespace('Banana.Controls').EventTypes = {
	'DOM_EVENT':1,
	'CUSTOM_EVENT':2
}


/**
@namespace Banana
*/
namespace('Banana').Application = Banana.Control.extend(
/** @lends Banana.Application.prototype */
{
	/**
	 * Main Banana Application components.
	 * This object is responsible for loading and running pages.
	 * By default the application is accessible through Banana.Application.
	 * if you need multiple instances, an application name is required.
	 *
	 * typicaly an instance of banana is started with
		
		<div id="target"></div>
		
		<script>
		
			var applicationParameters = {};
			applicationParameters.renderTarget = 'target'; 
			applicationParameters.imagedir ='images';
			applicationParameters.defaultSection="Home";
			applicationParameters.pageTemplate="PageTemplate";
			applicationParameters.paths = {}
			applicationParameters.applicationName = "foo" //needed if you want to run multiple instances of banana
			applicationParameters.paths.pages = "Application.Pages";
			applicationParameters.paths.pageTemplates = "Application.Pages.PageTemplates";
			var app = new Banana.Application(applicationParameters);
			app.run();
		
		</script>
	
	 *
	 * It is also possible to launch multiple instances of banana. 
	 * Make sure the applicationName is unique
	 * 
            var applicationParameters = {};
            applicationParameters.renderTarget = 'target'; //id of the target div
            applicationParameters.imagedir ='images';
            applicationParameters.paths = {};
            applicationParameters.applicationName = "myUniqueApp";
            applicationParameters.paths.pages = "Application.Pages";
            applicationParameters.paths.pageTemplates = "Application.Pages.PageTemplates";


            var pageClass = Banana.Page.extend({

          		createComponents : function()
          		{
          			//do something here
          		}
            });

            var page = new pageClass();

            var app = new Banana.Application(applicationParameters);
            app.run(page);
       
	 * 
	 * 
	 * Following parameters are available for creating a new application
	 * 
	 * - renderTarget 			Id of the dom element where the application is rendered in.
	 * - imagedir				relative path of various images Banana uses
	 * - paths.pages      		namespace of Banana Pages (by default "Application.Pages") 
	 * - paths.pageTemplates	namespace of Banana Template Pages (by default "Application.Pages.PageTemplates") 		   
	 * 
	 * A new page can be loaded by calling loadPage(String page). The current page will be removed
	 * and replaced by the new page. Url history params are restored in case an already visited page is loaded.
	 * 
	 * 
	 * @constructs
	 * @param {Object} settings
	 */
	init : function(settings)
	{
		// Add the logger
		log = new Banana.Util.LogManager();
		log.addLogger(new Banana.Util.Logger.Console());
		log.setLevel("error", true);
		log.setLevel("warning", true);
				
		try
		{
			jQuery();
		}
		catch(e)
		{
			log.error("JQuery is not found. JQuery required.");
		}

		if (!settings)
		{
			settings = {};
		}
		
		this.settings = settings;
		
		//to remember the vertical scroll position of a page
		this.sectionVerticalScrollPosition ={};
		this.id = 0; // Will increment on each page load
		
		if (settings.applicationName)
		{
			namespace('Banana')[settings.applicationName] = this;
		}
		else
		{
			namespace('Banana').Application = this;
		}
		
		if (!settings.pageTemplate)
		{
			settings.pageTemplate = "PageTemplate";
		}
		
		if (!settings.paths)
		{
			settings.paths = {};
		}
		
		if (!settings.paths.pages)
		{
			settings.paths.pages = "Application.Pages";
		}
			
		this.prepareUnload();
	},
	
	/**
	 * When a user closes/refresh the browser tab/window, 
	 * the current page will be removed + all registered event
	 * @ignore
	 */
	prepareUnload : function()
	{
		jQuery(window).unload( this.getProxy(function()
		{
			jQuery('*').unbind();
			if (this.activePage)
			{
				this.activePage.remove();
			}
			if (this.pageTemplate)
			{
				this.pageTemplate.remove();
			}
			delete Banana;
		}) );		
	},
	
	/**
	 * Automatically called by Banana
	 * The page template is specified in application settings with the "pageTemplate" property. 
	 * If no Page template is given, we use default Banana.PageTemplate
	 * @ignore
	 */
	loadPageTemplate : function()
	{
		if (!this.settings.paths.pageTemplates)
		{
			pageTemplateClass = Banana.PageTemplate;
		}
		else
		{
			var path = this.settings.paths.pageTemplates;

			var objectname = path+'.'+this.settings.pageTemplate;
	
			var pageTemplateClass = Banana.Util.NamespaceToFunction(objectname);
		}

		if (!pageTemplateClass)
		{
			log.error("Error: could not find Template: "+objectname);

			return;
		}

		try
		{
			this.pageTemplate = new pageTemplateClass();
		}
		catch(e)
		{
			log.error("Error: could not instantiate template: "+objectname);
		}

	},

	/**
	 * @returns {Array} of settings
	 */
	getSettings : function()
	{
		return this.settings;
	},

	/**
	 * @param {String} section
	 */
	setSectionVerticalScrollPosition : function(section)
	{
		this.sectionVerticalScrollPosition[section] = window.scrollY;  
	},
	
	/**
	 * 
	 * @param {String} section
	 * @returns {String}
	 */
	getSectionVerticalScrollPosition : function(section)
	{
		return this.sectionVerticalScrollPosition[section];
	},
	
	
	/**
	 * Loads a page.
	 *
	 * Loads a page by specifying the full namespace name of the page. 
	 * Additional parameters can be send along. Parameters should be in key => value format
	 * stored in an Object. All parameters will be written in the hash section of the url.
	 * Loading a page also results in saving the url parameters of the current page. This means
	 * that we when we have a url like http://mysite?page=foo#section=Home&id=12
	 * we save the id parameter only. Unless specified we restore the original parameters when the
	 * page is reloaded.
	 *
	 * @param {string} page to be loaded. This is the full namespace name
	 * @param {object} key value format 
	 * @param {bool} ignoreHistoryParams if true we ignore previous url params. 
	 */
	loadPage : function(page,urlParams,ignoreHistoryParams)
	{
		//we save the current url params to use them later on when we return to this page
		Banana.Util.UrlManager.saveModuleHistory('section');

		//we also save the current vertical scroll position. so when we return we also return to scroll position
		this.setSectionVerticalScrollPosition(this.section);
		
		//clean the url
		Banana.Util.UrlManager.clearUrl();

		//Here we assign the history property to a global class property. 
		//We need to do this because below code which is registering url parameters in the urlmanager one by one.
	    //If every Url Manager action results into a url change, we would get loads of history points
		//in our browser. This is something we don't want. To prevent this situation we register them
		//but without modifing the url. Later in the Run() method we modify the url at once.
		this.loadingWithHistory = !ignoreHistoryParams;
		
		if (this.loadingWithHistory)
		{
			var history = Banana.Util.UrlManager.getModuleHistory(page);

			var his;
			for (his in history)
			{
				if (history.hasOwnProperty(his)) 
				{
					Banana.Util.UrlManager.registerModule(his);
					Banana.Util.UrlManager.setModule(his,history[his], true);
				}
			}
		}

		if (urlParams)
		{
			var prop;
			
			for (prop in urlParams)
			{
				if (urlParams.hasOwnProperty(prop)) 
				{
					Banana.Util.UrlManager.registerModule(prop);
					Banana.Util.UrlManager.setModule(prop,urlParams[prop], true);
				}
			}
		}
			
		this.run(page);


        
        //restore vertical scroll position
        if (!ignoreHistoryParams)
        {
        	window.scrollTo(0,this.getSectionVerticalScrollPosition(page) || 0);
        }        
	},
	
	/**
	 * This method is used when only one single page instance is attached to the application.
	 * 
	 * @ignore
	 */
	instantiateSinglePage : function()
	{
		if (!this.pageTemplate)
		{
			this.loadPageTemplate();
		}
				
		this.page.bind('renderComplete',this.getProxy(function(){

			if (this.activePage)
			{
				this.activePage.removeDom();
				this.activePage.clearProps();
				this.activePage = undefined;
			}
  
			this.activePage = this.page;
			this.activePage.setVisible(true);
		}));

		//our new page will be not visible
		this.page.setVisible(false);
		
		//now we add it to the pagetemplate
		this.pageTemplate.addPageControl(this.page);
		
		this.pageTemplate.setApplication(this);
		
		//load the whole page
		this.pageTemplate.run(this);		
	},
	
	/**
	 * Run a page
	 *
	 * This function should only be initially called to bootstrap the
	 * framework. Consecutive pages should be loaded by using {@link #loadPage}.
	 *
	 * @param {string} page
	 */
	run : function(page)
	{	
		// Save the parameter
		if (page)
		{
			this.page = page;
		}
		
		if (page instanceof Banana.Page)
		{
			return this.instantiateSinglePage();
		}
		
		this.triggerEvent('onPreLoadPage');
	
		// If this is the first page we run, we register all the url parameters
		if (!this.activePage)
		{
			Banana.Util.UrlManager.autoRegisterModules();
		}

		//if we have no pagetemplate loaded, usually the first time, we load it
		if (!this.pageTemplate)
		{
			this.loadPageTemplate();
		}
	
		// Determine page (section) to load
		var section = this.page || Banana.Util.UrlManager.getModule('section') || this.settings.defaultSection;
		this.section = section;
		
		// Unset saved parameter for next calls
		this.page = undefined;

		//the register url section registers the section without modifing the url.
		//we receive a change event 
		this.registerUrlSection(section);
		//apply url change in the Url Manager
		if (!this.loadingWithHistory)
		{
			Banana.Util.UrlManager.updateUrl();
		}
		
		var load = this.getProxy(function(){

			var objectname = this.settings.paths.pages+'.'+section;
			var pageClass = Banana.Util.NamespaceToFunction(objectname);
		
			//if the pageclass cannot be find use the default one
			if (!pageClass)
			{
				if (this.settings.defaultSection === section)
				{
					log.error("Error default page "+this.settings.defaultSection+" cannot be loaded");
					return;
				}
				else
				{
					log.error("Page "+section+" not found. Load default page "+this.settings.defaultSection);
				}
				return this.loadPage(this.settings.defaultSection);
			}
			
			//id of the application which thus increments every page load
			this.id++;
			
			var newPage = new pageClass();

			//when a page is rendered we remove the old page.
			//We already removed its events and timers. now its time for the visible items as well
			//We also remove its properties. This is too prevent memory leaks
			newPage.bind('renderComplete',this.getProxy(function(){

				if (this.activePage)
				{
					this.activePage.removeDom();
					this.activePage.clearProps();
					this.activePage = undefined;
				}
	  
				this.activePage = newPage;
				this.activePage.setVisible(true); 

			}));

			//our new page will be not visible yet
			newPage.setVisible(false);
			
			//now we add it to the pagetemplate
			this.pageTemplate.addPageControl(newPage);

			this.pageTemplate.setApplication(this);
			
			//run the page. if everything is ok we will receive a renderComplete event
			this.pageTemplate.run();
			
			//update the url to its final state
			Banana.Util.UrlManager.updateUrl();
		});
						
		//if we have an active page we want it to be removed
		//but only its internal data. like (events, timers and more)
		//the dom needs to stay to prevent an ugly flickering between page transitions
		if (this.activePage)
		{
			//this is extremely important. Our remove function below is asynchronous
			// it might happen that the section change which is also asnchronous (statement above) results into 
			//a url change during removing of the controls. I have to admit that
			//Oh yeah is a hacky solution. and very difficult to debug or to even understand.
			Banana.Util.UrlManager.stopChecking(); 
			
			this.activePage.remove(true,this.getProxy(function(){
				Banana.Util.UrlManager.startChecking(); 
				load();
				Banana.Util.UrlManager.listenModule('section',this.getProxy(function()
				{
					this.loadPage(Banana.Util.UrlManager.getModule('section'));
				}));
				
			}));
		}
		else
		{
			load();
			Banana.Util.UrlManager.listenModule('section',this.getProxy(function()
			{
				this.loadPage(Banana.Util.UrlManager.getModule('section'));
			}));
			
		}
	},
	
	/**
	 * Registers section url and binds a change event to it 
	 * which determines which page should be loaded
	 * @param {String} section
	 * @ignore
	 */
	registerUrlSection : function(section)
	{
		Banana.Util.UrlManager.registerModule('section',section);

		Banana.Util.UrlManager.setModule('section',section,true);
	}
});

Banana.App = Banana.Application;
