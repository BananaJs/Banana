goog.provide("Application.Controls.HomeTileItemRender");

namespace('Application.Controls').HomeTileLittle = Banana.Controls.DataControl.extend({
	
	createComponents : function()
	{
		var title = new Banana.Controls.Panel();
		title.addCssClass("DemoHomeTileTitle")
		title.addControl(this.data.title);
		
		var contents = new Banana.Controls.Panel();
		contents.addCssClass("DemoHomeTileContents");
		contents.addControl(this.data.contents);
		
		var link = new Banana.Controls.Link();
		link.addControl("View");
		//link.setHref('#section='+this.data.link);
		link.bind('click',this.getProxy(function(){
				
			this.triggerEvent('onView');

		}));
		
		var linkContainer = new Banana.Controls.Panel();
		linkContainer.addCssClass("DemoHomeTileLinkContainer");
		linkContainer.addControl(link);
		
		this.addControl(title);
		this.addControl(contents);
		this.addControl(linkContainer);
	}
	
});

namespace('Application.Controls').HomeTileBig = Banana.Controls.DataControl.extend({
	
	createComponents : function()
	{
		var title = new Banana.Controls.Panel();
		title.addCssClass("DemoHomeTileTitle")
		title.addControl(this.data.title);
		
		var contents = new Banana.Controls.Panel();
		contents.addCssClass("DemoHomeTileContents DemoHomeTileBigContents");
		//contents.addControl(this.data.contents);
		
		var link = new Banana.Controls.Link();
		link.setVisible(false);
		link.addControl("Close");
		//link.setHref('#section='+this.data.link);
		link.bind('click',this.getProxy(function(){
				
			this.triggerEvent('onClose');

		}));
		
		this.link = link;
		this.contents = contents;
		
		var linkContainer = new Banana.Controls.Panel();
		linkContainer.addCssClass("DemoHomeTileLinkContainer");
		linkContainer.addControl(link);
		
		this.addControl(title);
		this.addControl(contents);
		this.addControl(linkContainer);
	},
	
	onGrown : function()
	{
		this.link.setVisible(true,300,"fadeIn");
		
		if (!this.data.control)
		{
			return;
		}
		
		var controlClass = Banana.Util.NamespaceToFunction(this.data.control);
		
		if (!controlClass)
		{
			return;
		}
		
		var inst = new controlClass();
		inst.setVisible(false);
		this.inst = inst;
		
		inst.setCss({'height':this.contents.getDimensions().height+'px','overflow':'auto'});
		
		inst.setVisible(true,300,"fadeIn");
		this.contents.addControl(inst);
		this.contents.invalidateDisplay();
		
		
	},
	
	onShrinkStart : function(cb)
	{
		this.link.setVisible(false,300);
	
		if (!this.inst)
		{
			if (cb)
			{
				cb();
			}
			
			return;
		}
		
		this.inst.setVisible(false,100,"fadeOut",function(){
			if (cb)
			{
				cb();
			}
		});
	}
	
});



namespace('Application.Controls').HomeTileItemRender = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("DemoHomeTile")
		
		var tile = new Application.Controls.HomeTileLittle();
		tile.data = this.data;
		tile.bind('onView',this.getProxy(function(){
			
			if (this.disableClicks)
			{
				return;
			}
			
			this.disableClicks = true;
			
			this.grow();
		}));
		
		this.panel.addControl(tile);

		this.addControl(this.panel);
	},
	
	grow : function()
	{
		var that = this;
		
		var placeHolder = this.getListRender().getItemRenderPlaceHolderByItemRender(this);
		
		var placeHolderDim = placeHolder.getDimensions();
				
		var newPlaceHolder = new Banana.Controls.Panel();
		newPlaceHolder.setCss({
			'z-index':999999,
			'position':'absolute',
			'background':'#444444',
			'width':(100/3)+'%',
			'left':placeHolderDim.position.left+'px',
			'top':placeHolderDim.position.top+'px',
			'-webkit-box-sizing': 'border-box'
		});
				
		var tile = new Application.Controls.HomeTileBig();
		tile.data = this.data;
		tile.addCssClass("BDemoHomeTileeBig");
		tile.bind('onClose',function(){
			
			tile.onShrinkStart(function(){
				jQuery('#'+newPlaceHolder.clientId).animate({'width':(100/3)+'%',
					'height':placeHolderDim.height+'px',
					'left':placeHolderDim.position.left+'px',
					'top':placeHolderDim.position.top+'px'},
					{   duration: 300, 
						easing: "swing",  
						complete:function(){

							jQuery('#'+newPlaceHolder.clientId).siblings().css({'opacity':1});
							newPlaceHolder.remove();
							that.disableClicks = false;
							
							var index = that.listRender.getIndexByItemRender(that);
							that.listRender.triggerEvent("onShrink",{'index':index});
					}
				});
			});
		});
		
		newPlaceHolder.addControl(tile);
		this.getListRender().controls[0].addControl(newPlaceHolder,true);		
	
		jQuery('#'+newPlaceHolder.clientId).siblings().css({'opacity':0.8});
	
		jQuery('#'+newPlaceHolder.clientId).animate({'width':'100%','height':'100%','left':0,'top':0},
				{ duration: 300, easing: "swing", complete:this.getProxy(function(){
					
					tile.onGrown();
					var index = that.listRender.getIndexByItemRender(that);
					that.listRender.triggerEvent("onGrow",{'index':index});
					that.disableClicks = false;
				})
		});		
	},
	
	updateDisplay : function()
	{
		//make sure that our tile got the same height as width.	
		this.panel.setCss({'height':Math.round(this.panel.getDimensions().width * 0.7)});	
	},
	
	select : function()
	{
		this.panel.addCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	deselect : function()
	{
		this.panel.removeCssClass("ExampleTileSimple2ItemRenderSelected")
	},
	
	getIsSelectable : function()
	{
		return false;
	}
	
});