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
		contents.addCssClass("DemoHomeTileContents");
		//contents.addControl(this.data.contents);
		
		var link = new Banana.Controls.Link();
		link.setVisible(false);
		link.addControl("Close");
		//link.setHref('#section='+this.data.link);
		link.bind('click',this.getProxy(function(){
				
			this.triggerEvent('onView');

		}));
		
		this.link = link;
		
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
	},
	
	onShrinkStart : function(cb)
	{
		this.link.setVisible(false,300);
		
		if (cb)
		{
			cb();
		}
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
			
			this.grow();
		}));
		
		this.panel.addControl(tile);

		this.addControl(this.panel);
	},
	
	grow : function()
	{
		this.panel.setCss({'z-index':'99'});
		
		var placeHolder = this.getListRender().getItemRenderPlaceHolderByItemRender(this);
		
		var dim = this.getListRender().getDimensions();
		var panelDim = this.panel.getDimensions();
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
		tile.bind('click',function(){
			
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
					}
				});
			});
		});
		
		newPlaceHolder.addControl(tile);
		this.getListRender().controls[0].addControl(newPlaceHolder,true);		
	
		jQuery('#'+newPlaceHolder.clientId).siblings().css({'opacity':0.8});
	
		jQuery('#'+newPlaceHolder.clientId).animate({'width':'100%','height':'100%','left':0,'top':0},
				{ duration: 300, easing: "swing", complete:this.getProxy(function(){
					
					//jQuery('#'+newPlaceHolder.clientId).siblings().css({'opacity':1});
					tile.onGrown();
					
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