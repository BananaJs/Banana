/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Youtube iframe player experimental control.
 */

goog.provide('Banana.Controls.YoutubeIFramePlayer');

/** @namespace Banana.Controls.YoutubeIFramePlayer*/
namespace('Banana.Controls').YoutubeIFramePlayer = Banana.Controls.Panel.extend({
/** @lends Banana.Controls.YoutubeIFramePlayer.prototype */
	
	/**
	 * Creates highly experimental youtube iframe player
	 * 
	 * Example:
	 
		var player = new YoutubeIFramePlayer(400,300);
    	player.bind('onPlayerReady',this.getProxy(function(){
    	
    		p.setVolume(0);
    		p.loadVideoById("Hyw7OYU0_mE");
    		 		
    	}));
    	
    	//event triggered when duration of the videoitem is known
    	player.bind('onDurationKnown',this.getProxy(function(e,time){
 
    		console.log(time.getTime());
    	}))
	 
	 
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function(width,height)
	{
		this._super();
		
		this.height = height;
		this.width = width;
		
		this.createRequiredApiStructures();
	},
	
	createRequiredApiStructures : function()
	{
		//load required script files. we do this only once
		//other player instances wont load these scripts again
		if (!window.youtubeApiScripsLoaded)
		{
			var tag = document.createElement('script');
			tag.src = "http://www.youtube.com/player_api?wmode=transparent";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
			window.youtubeApiScripsLoaded = true;
		}
		
		//make player globally available to get access from onYouTubePlayerReadyevent	
		if (!window.queuedBananaYouTubePlayers)
		{
			window.queuedBananaYouTubePlayers = [];
		}
		
		if (!window.youtubeApiReadyCallback)
		{
			//after api is ready we create the queued players
			window.onYouTubePlayerAPIReady= function(id) 
			{
				for (var i =0; i < window.queuedBananaYouTubePlayers.length; i++)
				{
					window.queuedBananaYouTubePlayers[i]();
				}
				
				window.youtubeApiReady = true;
			}
		}
	},
	
	isApiReady : function()
	{
		return window.youtubeApiReady == true;
	},
	
	unload : function()
	{
		//these are not automatically cleaned by banana
		window.queuedBananaYouTubePlayers = undefined;
	},
	
	createComponents : function()
	{
		this.placeHolder = new Banana.Controls.Panel();
		this.buttonHolder = new Banana.Controls.Panel();
		
		this.addControl(this.placeHolder);
		this.addControl(this.buttonHolder);
	},
	
	/**
	 * We create the player when everything is fully rendered
	 */
	updateDisplay : function()
	{
		this.createPlayer();
	},
	
	createPlayer : function()
	{
		this.placeHolder.clear();
		
		var dim = this.getDimensions();
		
		if (!this.height)
		{
			this.height = dim.height;	
		}
		
		if (!this.width)
		{
			this.width = dim.width;
		}
		
		//dont add the player again after i.e rerender
        if (this.added)
        {
        	return;
        }
        this.added = true;
        
        //if player api not available we put them in a que
        window.queuedBananaYouTubePlayers.push(this.getProxy(function(data){
			
			return this.getProxy(function(){
					
				 this.player = new YT.Player(data.id, {
					    height: data.height,
					    width: data.width,
					    playerVars:{'wmode':'transparent',
					    			'cc_load_policy':0,
					    			'iv_load_policy':3,
					    			'showinfo':0,
					    			'rel':0,
					    			 'modestbranding':1,
					    			 'controls':0,
					    			 'showsearch':0
					    			 
					    },
					   // videoId: data.data,
					    events: {
					      'onReady': this.getProxy(function(e){ this.playerIsReady(e);}),
					      'onStateChange': this.getProxy(function(e){ this.playerStateChanged(e);})
					    }
					  });
			})	
		})({'id':this.placeHolder.getClientId(),'data':this.data,'width':this.width,'height':this.height}));
        
        //create directly when api is ready
        if (this.isApiReady())
        {
        	console.log(this.id,'directly create')
        	window.queuedBananaYouTubePlayers[window.queuedBananaYouTubePlayers.length-1]();
        }
	},
	
	/**
	 * Loads video by id. 
	 * this can only be done after the videoplayer is available
	 * 
	 * @param {int} id
	 */
	loadVideoById : function(id)
	{
		if (!this.getPlayer())
		{
			console.log(this.id,'no player');
			return;
		}
		
		//reset duration
		this.duration = null;
		
		this.getPlayer().loadVideoById(id);	
	},
	
	/**
	 * Loads video by id. 
	 * this can only be done after the videoplayer is available
	 * 
	 * @param {int} id
	 */
	cueVideoById : function(id)
	{
		if (!this.getPlayer())
		{
			console.log(this.id,'no player');
			return;
		}
		
		//reset duration
		this.duration = null;
		
		this.getPlayer().cueVideoById(id);	
	},
	
	/**
	 * @param {int}
	 */
	setVolume : function(v)
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		this.getPlayer().setVolume(v);
	},
	
	mute : function()
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		this.getPlayer().mute();
	},
	
	/**
	 * @return {int}
	 */
	getDuration : function()
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		return this.getPlayer().getDuration();
	},
	
	/**
	 * @return {int}
	 */
	getCurrentTime : function()
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		return new Banana.Util.DateTimecode(this.getPlayer().getCurrentTime()*1000);
	},
	
	/**
	 * @return {int};
	 */
	getPlayerState: function()
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		return this.getPlayer().getPlayerState();
	},
	
	/**
	 * @param {int} seekTo
	 * @param {boolean} allowSeekAhead
	 */
	seekTo : function(seekTo,allowSeekAhead)
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		return this.getPlayer().seekTo(seekTo,allowSeekAhead);		
	},
	
	pauseVideo : function()
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		return this.getPlayer().pauseVideo();		
	},
	
	
	stopVideo : function()
	{
		if (!this.getPlayer())
		{
			log.error("no player");
			return;
		}
		
		return this.getPlayer().stopVideo();		
	},
	
	/**
	 * @return {Object}
	 */
	getPlayer : function()
	{
		if (!this.playerReady)
		{
			log.error("no player");
			return;
		}
		
		return this.player;
	},
	
	playerStateChanged : function(e)
	{
		///logic to determine media duration
		//duration is known some time after media is playin
		if (this.duration != this.getDuration())
		{
			this.duration = this.getDuration();
			this.triggerEvent("onDurationKnown",new Banana.Util.DateTimecode(this.duration*1000));
		}
		
		this.triggerEvent('onPlayerStateChanged',e);
	},
	
	/**
	 * Fired when player is ready
	 */
	playerIsReady : function()
	{
		this.playerReady = true;
		
		try
		{
			this.triggerEvent('onPlayerReady');
		}
		catch(e)
		{
			console.log(e)
		}
	}
});