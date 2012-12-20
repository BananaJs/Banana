/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary TabSlider   
 */

goog.provide('Banana.Controls.TabSlider');

/** @namespace Banana.Controls.TabSlider */
namespace('Banana.Controls').TabSlider = Banana.Controls.Panel.extend({
/** @lends Banana.Controls.TabSlider.prototype */	
	
	/**
	 * Creates a Tab Slider. A Tabslider is a horizontaly sliding component. 
	 * Content can be added by using the addContent(content,tabname) method. 
	 * Optionally setUseUrlHistory can be used to have tabslides available in browser history
	 *  
	 * Example:
	 
	var slider = new Banana.Controls.TabSlider();
	slider.setStyle("height:300px; width:800px; border:1px solid black;border:1px solid #666666;");
	slider.setUseUrlHistory(true);
	slider.setSlideSpeed(1000);
	slider.addContent(new Banana.Controls.DropDown(),"dropdown");
	slider.addContent(new Banana.Controls.CheckBox(),"checkbox");

	 * 
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
		this.addCssClass("BTabSlider")
		
		this.content = [];
		
		this.activatedTab = 0;
		this.slideSpeed = 400;	
		this.easing = 'swing';
		this.useAutoHeight = false;
		this.useLeftRightNav = true;
		this.useUrlHistory = false;
		
		this.linkNextText = "&nbsp;";
		this.linkPreviousText = "&nbsp;";
	},
	
	onWindowResize : function()
	{
		this.repositionPanels();
	},
	
	
	/**
	 * Adds content which is accessible through a tab link
	 * Content can be a control or just plain text. A tabname is required and will appear as a link on top of the control
	 * @param {mixed} content can be a control or plain text
	 * @param {String} tabname
	 * @return {this}
	 */
	addContent : function(content,tabname)
	{
		if (!tabname || typeof(tabname) != "string")
		{
			return log.error("cannot add content without tabname");
		}
		this.content.push({content:content,tabname:tabname});
		
		return this;
	},
	
	/**
	 * Set transition speed during slide
	 * @param {int} speed in ms
	 * @return {this}
	 */
	setSlideSpeed : function(speed)
	{
		this.slideSpeed = speed;
		return this;
	},
	
	/**
	 * When true we set the height of the tabslider based on the current active tab.
	 * Note that css properties margin and padding are ignored. This is due the fact that the tabslider uses absolute
	 * positioned divs. height should be set manually or calculated with javascript.
	 * 
	 * @param {boolean}
	 * @return {this}
	 */
	setUseAutoHeight : function(bool)
	{
		this.useAutoHeight = bool
		return this;
	},
	
	/**
	 * Set easing type "swing" || "linear"
	 * See JQuery animate() method for more information
	 * 
	 * @param {String} easing
	 * @return {this}
	 */
	setEasing : function(easing)
	{
		this.easing = easing;
		return this;
	},
	
	
	/**
	 * if true we save the active tab in the url. Using browser history will affect current active tab 
	 * @param {boolean}
	 * @return {this} 
	 */
	setUseUrlHistory : function(use)
	{
		this.useUrlHistory = use;
		return this;
	},
	
	/**
	 * sets the text of the next link. clicking on it will advance to the next link
	 * @param {String} text
	 * @return {this}
	 */
	setLinkNextText : function(text)
	{
		this.linkNextText = text;
		return this;
	},
	
	/**
	 * sets the text of the previous link. clicking on it will advance to the previous link
	 * @param {String} text
	 * @return {this}
	 */
	setLinkPreviousText : function()
	{
		this.linkPreviousText = text;
		return this;
	},
	
	/**
	 * @ignore
	 */
	createComponents : function()
	{
		this.buttonContainer = new Banana.Controls.Panel().addCssClass("BTabSliderButtonContainer");

		var contentWrapper = new Banana.Controls.Panel().addCssClass("BTabSliderContentWrapper");
		
		this.contentContainer = new Banana.Controls.Panel().addCssClass("BTabSliderContentContainer");
		contentWrapper.addControl(this.contentContainer);

		this.addControl(this.buttonContainer);
		this.addControl(contentWrapper);
		
		if (this.useUrlHistory)
		{
			this.urlKey = "tabSlidePos"+this.getClientId().replace(/-/g,'');
			
			this.registerUrlHistory();
			
			var key = Banana.Util.UrlManager.getModule(this.urlKey);
			if (key)
			{
				this.activatedTab = key;
			}
		}
	},
	
	/**
	 * @ignore
	 */
	updateDisplay : function()
	{		
		//clear first. ie after refresh
		this.buttonContainer.clear();
		this.contentContainer.clear();
		
		var dim = this.getDimensions();

		//make sure the content container got the width of all contents together
		var containerWidth = dim.width * this.content.length;
		this.contentContainer.setCss({"width":containerWidth+"px"});
	
		//sizes for link place holders. we want them to equally spread out 
		var edgeContainerSize = 40;
		var centerContainersSize = (dim.width - (edgeContainerSize*2)) / this.content.length; 
		
		var widthToPerc = function(w)
		{
			return (w/dim.width) * 100 
		}
		
		
		if (this.useLeftRightNav)
		{
			var firstLinkWrapper = new Banana.Controls.Panel().setCss({'width':widthToPerc(edgeContainerSize)+'%'}).addCssClass("BTabSliderlinkWrapper");
			this.buttonContainer.addControl(firstLinkWrapper);
			
			var buttonPrev = new Banana.Controls.Link().addCssClass("BTabSliderLink BTabSliderLinkPrevious");
			buttonPrev.addControl(this.linkPreviousText);
			buttonPrev.setHref("#previous tab");
			firstLinkWrapper.addControl(buttonPrev);
			
			buttonPrev.bind('click',this.getProxy(function(e){
				
				this.activatedTab = this.ensureValidTab(--this.activatedTab);
				this.repositionPanels(this.slideSpeed);
				return false;
			}));
		}
		
		var i,len;
		for (i=0, len=this.content.length; i< len; i++)
		{
			var linkWrapper = new Banana.Controls.Panel().addCssClass("BTabSliderlinkWrapper");
			
			if (this.useLeftRightNav)
			{
				linkWrapper.setCss({'width':widthToPerc(centerContainersSize)+'%'})
			}
						
			this.buttonContainer.addControl(linkWrapper);
			
			var button = new Banana.Controls.Link().addCssClass("BTabSliderLink");
			button.addControl(this.content[i].tabname);
			button.setHref("#"+this.content[i].tabname);
			linkWrapper.addControl(button);

			button.bind('click',this.getProxy(function(e){
				this.activatedTab = parseInt(e.data,10);
				this.repositionPanels(this.slideSpeed);
				return false;
			}),i.toString());
				
			//create a placeHolder where inside the content will be placed
			var panelHolder = new Banana.Controls.Panel().addCssClass("BTabSliderContentItemContainer");

			panelHolder.setCss({'width':dim.width+'px'});
			
			panelHolder.addControl(this.content[i].content);
			this.contentContainer.addControl(panelHolder);
		}
		
		if (this.useLeftRightNav)
		{
			var lastLinkWrapper = new Banana.Controls.Panel().setCss({'width':widthToPerc(edgeContainerSize)+'%'}).addCssClass("BTabSliderlinkWrapper");
			this.buttonContainer.addControl(lastLinkWrapper);
			
			var buttonNext = new Banana.Controls.Link().addCssClass("BTabSliderLink BTabSliderLinkNext");
			buttonNext.addControl(this.linkNextText);
			buttonNext.setHref("#previous tab");
			lastLinkWrapper.addControl(buttonNext);
			
			buttonNext.bind('click',this.getProxy(function(e){
				
				this.activatedTab = this.ensureValidTab(++this.activatedTab);
				this.repositionPanels(this.slideSpeed);
				return false;
			}));
		}
		
		this.buttonContainer.invalidateDisplay();
		this.contentContainer.invalidateDisplay();
		
		this.repositionPanels(0);
	},
	
	/**
	 * @ignore
	 * Ensures valid tab range
	 */
	ensureValidTab : function(n)
	{
		if (n < 0)
		{
			n = this.content.length-1;
		}		
		else if (n > this.content.length-1)
		{
			n = 0;
		}
		
		return n;
	},
	
	/**
	 * Auto sets height. Because the tabslider uses absolute positioned divs, we have to set the height
	 * manually. this function calculates and sets the height based on the current active tab
	 */
	applyAutoHeight : function()
	{
		var height = this.content[this.activatedTab].content.getDimensions().height;
		
		this.setCss({'height':height+this.buttonContainer.getDimensions().height});		
	},
	
	/**
	 * @ignore
	 * Registers url change listener to make sure that when the user changes the url we reposition the panels
	 */
	registerUrlHistory : function()
	{
		Banana.Util.UrlManager.registerModule(this.urlKey);
		Banana.Util.UrlManager.listenModule(this.urlKey,this.getProxy(function(e,param){

			this.activatedTab = param;
			this.repositionPanels(this.slideSpeed);
			
		}));
	},
	
	/**
	 * ensures the correct position of the current active tab
	 */
	repositionPanels : function(speed)
	{
		this.triggerEvent('onSlide');
		var dim = this.getDimensions();
		
		//make sure the content container got the width of all contents together
		var containerWidth = dim.width * this.content.length;
		this.contentContainer.setCss({"width":containerWidth+"px"});
		
		for (i=0, len=this.contentContainer.controls.length; i< len; i++)
		{
			this.contentContainer.controls[i].setCss({'width':dim.width+'px'});
		}
	
		if (this.useAutoHeight)
		{
			this.applyAutoHeight();
		}
		
		var contentWidth = this.getDimensions().width;
		var left = this.activatedTab * contentWidth * -1;
		
		var addt = 0;
		if (this.useLeftRightNav)
		{
			addt = 1;
		}
		
		jQuery('#'+this.buttonContainer.getClientId()+' .BTabSliderLink').removeClass("BTabSliderLinkActive");
		jQuery('#'+this.buttonContainer.getClientId()+' .BTabSliderLink:eq('+(parseInt(this.activatedTab)+addt)+')').addClass("BTabSliderLinkActive");
		
		jQuery("#"+this.contentContainer.getClientId()).animate({'left':left+"px"},{ duration: speed, easing: this.easing, complete:this.getProxy(function(){
			
			if (this.useUrlHistory)
			{
				//unregister module to prevent endless event loop
				Banana.Util.UrlManager.unlistenModule(this.urlKey);
				Banana.Util.UrlManager.setModule(this.urlKey,this.activatedTab.toString());
				this.registerUrlHistory();
			}

			this.triggerEvent('onSlideFinished');
		})});
	}
});