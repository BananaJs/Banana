goog.provide("Application.Controls.HomeTileItemRender");

namespace('Application.Controls').HomeTile = Banana.Controls.DataControl.extend({
	
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



namespace('Application.Controls').HomeTileItemRender = Banana.Controls.DataGridTileItemRender.extend({
	
	createComponents : function()
	{
		this.panel = new Banana.Controls.Panel();
		this.panel.addCssClass("DemoHomeTile")
		
		var tile = new Application.Controls.HomeTile();
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
				
		this.orgDim = {};
		this.orgDim.position = 'relative';
		this.orgDim.left = placeHolder.getDimensions().position.left;
		this.orgDim.top = placeHolder.getDimensions().position.top;
		this.orgDim.width = placeHolder.getDimensions().width;
		this.orgDim.height = placeHolder.getDimensions().height;
		this.orgDim.panelHeight = this.panel.getDimensions().height;
		
		//first fix the placeholder to original position
//		placeHolder.setCss({'z-index':2,
//			'position':'absolute',
//			'left':placeHolder.getDimensions().position.left+'px',
//			'top':placeHolder.getDimensions().position.top
//		})
		
		var newPlaceHolder = new Banana.Controls.Panel();
		newPlaceHolder.setCss({
			'z-index':999999,
			'position':'absolute',
			'background':'#444444',
			'width':'33.29%',
			'left':placeHolderDim.position.left+'px',
			'top':placeHolderDim.position.top+'px',
			'-webkit-box-sizing': 'border-box'
		});
		
		var sh = 33;
		var eh = (dim.height);
		
		var tile = new Application.Controls.HomeTile();
		//tile.addCssClass("DemoHomeTile")
		//tile.setCss({'position':'absolute',left:'20px','border':'2px solid red','z-index':99999});
		tile.data = this.data;
		//tile.setCss({'width':'33.28%','height':panelDim.height+'px','left':placeHolderDim.position.left+'px','top':placeHolderDim.position.top+'px'});
		tile.setStyle('z-index:999999;left:0;top:0;background-color:#444444;');
		tile.bind('click',this.getProxy(function(){
			
			jQuery('#'+newPlaceHolder.clientId).animate({'width':'33.28%','height':placeHolderDim.height+'px','left':placeHolderDim.position.left+'px','top':placeHolderDim.position.top+'px'},
					{ duration: 300, easing: "swing", complete:this.getProxy(function(){
						
						//placeHolder.setCss({'position':'relative','left':'','top':'','height':''});
						//this.panel.setCss({'height':this.orgDim.panelHeight+'px'})
						//this.expanded = false;
						newPlaceHolder.remove();
					}),step:this.getProxy(function(f,e,g){
						
						if (e.prop == 'height')
						{
							//var h = eh - ((eh-sh) *(f/100))
							
							//tile.setCss({'height':h+'px'});
							console.log("start",sh,"end",eh,"diff",(eh-sh),"perc",f,e,e.now);
						}
					
					})
			});

		}));
		
		newPlaceHolder.addControl(tile);
		this.getListRender().controls[0].addControl(newPlaceHolder,true);
		
	
		jQuery('#'+newPlaceHolder.clientId).animate({'width':'100%','height':'100%','left':0,'top':0},
				{ duration: 300, easing: "swing", complete:this.getProxy(function(){
					
					
				}),step:this.getProxy(function(f,e){
					
					if (e.prop == 'height')
					{
						var h = sh + ((eh-sh) * (f/100));
						
						tile.setCss({'height':h+'px'});
					}
				
				})
				
		});		
	},
	
	shrink : function()  
	{
		var placeHolder = this.getListRender().getItemRenderPlaceHolderByItemRender(this);
		jQuery('#'+placeHolder.clientId).siblings().css({'opacity':'1'});
		
		//placeHolder.setCss({'position':'absolute','left':placeHolder.getDimensions().position.left+'px','top':placeHolder.getDimensions().position.top})
		
		jQuery('#'+placeHolder.clientId).animate({'width':this.orgDim.width+'px','height':this.orgDim.height+'px','left':this.orgDim.left,'top':this.orgDim.top},
				{ duration: 2000, easing: "swing", complete:this.getProxy(function(){
					
					placeHolder.setCss({'position':'relative','left':'','top':'','height':''});
					this.panel.setCss({'height':this.orgDim.panelHeight+'px'})
					this.expanded = false;
				})
		})
		
		console.log(this.orgDim)
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