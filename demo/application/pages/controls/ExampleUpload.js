goog.provide('Application.Controls.Examples.ExampleUpload');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');

namespace('Application.Controls.Examples').ExampleUpload = Application.Controls.Examples.ControlOverview.extend	({
	
	init : function()
	{
		this._super();
		
		this.fileIndicators = {};
	},

	
	createComponents : function()
	{
		var upload = new Banana.Controls.ChunkedUpload();
		upload.setMultipleFilesUpload(true);
		upload.setChunkSize(2000000);
		upload.setPostUrl("upload.php");

		upload.bind("filesSelected",this.getProxy(function(e,data){
			this.createFileProgression(data.files);
		}));
		
		upload.bind('fileUploading',this.getProxy(function(e,data){
			this.updateFileIndicator(data.file);
		}));
		
		upload.bind('fileUploaded',this.getProxy(function(e,data){
			this.finishFileIndicator(data.file);
		}));

		upload.bind('fileUploadError',this.getProxy(function(e,data){
			alert('error')
			this.errorFileIndicator(data.file);
		}));

		upload.bind("browserNotSupported",this.getProxy(function(e,data){
		
			this.addControl("Chunk upload not supported by the browser");
		}));
		
		
		this.addControl(upload);
		
		this.uploadPanel = new Banana.Controls.Panel();
		this.addControl(this.uploadPanel);
		
	},
	
	createFileProgression :  function(files)
	{
		this.fileIndicators = {};
		this.uploadPanel.clear();
		
		var i,len;
		for (i=0,len=files.length;i < len; i++)
		{
			var sin = new Banana.Controls.Panel();
			sin.setStyle("width:0%;background-color:blue;height:30px;");
			sin.addControl(files[i].name);
			this.uploadPanel.addControl(sin);
			
			this.fileIndicators[files[i].name] = sin;
		}
		
		this.uploadPanel.invalidateDisplay();
	},
	
	updateFileIndicator : function(file)
	{
		var indicator = this.fileIndicators[file.name];
	
		
		//console.log('p',file.loaded,file.size)
		var perc = Math.round((file.loaded/file.size)*100);
			
		indicator.setCss({"width":file.completion+"%"});
	},
	
	finishFileIndicator : function(file)
	{	
		var indicator = this.fileIndicators[file.name];
		indicator.setCss({"background-color":"green"});
	},

	errorFileIndicator : function(file)
	{
		var indicator = this.fileIndicators[file.name];
		indicator.setCss({"background-color":"red"});
	}
});




















/** @namespace Banana.Controls.Form */
namespace('Banana.Controls').Form = Banana.UiControl.extend({
/** @lends Banana.Controls.Form.prototype */

	/**
	 * Creates form control
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init : function()
	{
		this._super();
	},

	/**
	 * @ignore
	 */
	getTagName : function()
	{
		return 'form';
	}	
});

/** @namespace Banana.Controls.FileInput*/
namespace('Banana.Controls').FileInput = Banana.Controls.InputControl.extend({
/** @lends Banana.Controls.FileInput.prototype */

	/**
	 * Creates file input control
	 * @constructs
	 * @extends Banana.UiControl
	 */
	init : function()
	{
		this._super();
		
		this.setAttribute("type",'file');
	},

	/**
	 * @param {boolean}
	 */
	setMultiple : function(bool)
	{
		this.setAttribute("multiple",bool);
	},

	/**
	 * @return {Array} of files
	 */
	getFiles : function()
	{
		var files = document.getElementById(this.getClientId()).files;
		return files;
	}
});

/** @namespace Banana.Controls.ChunkUpload*/
namespace('Banana.Controls').ChunkedUpload = Banana.Controls.Panel.extend({
/** @lends Banana.Controls.ChunkUpload.prototype */

	/**
	 * creates a chunked upload control
	 * currently only supported by chrome and firefox.
	 * uploads file is small chunks. the upload control ensures that chunks are send to the
	 * server in the correct order. Server is responsible to reconstruct the chunks to one file
	 * first time a file is uploaded we
	 * @constructs
	 * @extends Banana.Controls.Panel
	 */
	init : function()
	{
		this._super();
	
		if (!this.isSupported())
		{
			this.triggerError = true;
			log.error("chunk upload not supported by the browser");
			return;
		}
		
		this.debug = true;
		this.files = [];
		this.previousLoadedChunk = {};
		
		this.chunkSize = 2000000;
		///this.uploadFile = 'http://192.168.250.72/~gillis/upload.php';
		
		var form = new Banana.Controls.Form();
		form.setAttribute('enctype',"multipart/form-data");
		form.setAttribute('method',"post");
		
		var maxInput = new Banana.Controls.InputControl();
		maxInput.setAttribute('name',"MAX_FILE_SIZE");
		maxInput.setAttribute('value',"99999999");
		maxInput.setAttribute('type',"hidden");
		
		var fileInput = new Banana.Controls.FileInput();
		fileInput.bind('change',this.getProxy(function(){
			this.handleFilesSelected(fileInput.getFiles());
		}));
		fileInput.setId('fileInput');
		 
		form.addControl(maxInput);
		form.addControl(fileInput);
		
		this.addControl(form);	
	},

	createComponents : function()
	{
		if (this.triggerError)
		{
			this.triggerEvent("browserNotSupported");
		}
	},

	/**
	 * set the size of a chunk. the lower you set the chunk, the lower memory usuage will be, but also
	 * 
	 * @param {int} chunkSize
	 */
	setChunkSize : function(chunkSize)
	{
		this.chunkSize = chunkSize;
	},

	setMultipleFilesUpload : function(bool)
	{
		var control = this.findControl('fileInput');
		if (!control)
		{
			return;
		}
		control.setMultiple(bool);
	},

	/**
	 * sets the url to post to
	 * @param {String} url
	 */
	setPostUrl : function(url)
	{
		this.uploadFile = url;
		return this; 
	},

	/**
	 * Check whether our upload control is supported by the browser
	 */
	isSupported : function()
	{
		if (!window.File)
		{
			return false;
		}
		
		//check file slice
		if (!File.prototype.webkitSlice && !File.prototype.mozSlice && !File.prototype.slice)
		{
			return false;
		}
		
		//check level 2 xhr
	    var xhr = new XMLHttpRequest();
	    return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
	},
	
	handleFilesSelected : function(files)
	{
		this.triggerEvent("filesSelected",{"files":files});
		this.uploadFiles(files);
	},

	/**
	 * Executes the upload procedure
	 * @param {Array} of files
	 */
	uploadFiles : function(files)
	{
		this.previousLoadedChunk = {};
		
		var i,len;
		for (i=0,len=files.length;i < len; i++)
		{
			var file = files[i];
			file.loaded = 0;
			file.uid = Banana.Util.generateUniqueId();
			file.completion = 0;
			
			this.files[file.name] = file;

			this.processFileChunkFrom(file,0,null);
		}
	},

	/**
	 * Processes a chunk from a file
	 * this method is recalled everytime a chunk is completed.
	 * it stops when all chunks are completed
	 * @param file
	 * @param index part of the file chunk
	 * @param cb called after each upload chunk completion
	 */
	processFileChunkFrom : function(file,index,cb)
	{
		var start = file.loaded;
		var end = file.loaded+this.chunkSize;
		var lastChunk = false;

		//if we have an error in the file. we trigger event and stop processing
		if (file.uploadError)
		{
			this.triggerEvent("fileUploadError",{"file":file});
			return;
		}

		//we always end up here when all chunks are uploaded
		if (start >= file.size)
		{
			this.triggerEvent("fileUploaded",{"file":file});
			return;
		}

		//we end up here at the last chunk
		if (end >= file.size)
		{
			end = file.size;
			lastChunk = true;
		}

		//slice method depending on the browser
		var slice = file.webkitSlice || file.mozSlice || file.slice

		//get a chunk from the file
		var chunk = slice.call(file,start,end);

		chunk.filename = file.name;
		chunk.index = index;

		//below we have a callback function encapsulated in a directly executed function
		//we do this to ensure a closure of where the file resists in.
		//the situation can occur that we upload 2 different files at the same time. we want the
		//callback function access the right file always. without the closure the callback will always access the
		//last set file, which can be wrong
		var $this = this;
		
		this.uploadChunk(chunk,file,lastChunk,function(index,file,cb)
		{
			var func = function(data)
			{
				file = this.getFile(file.name);
				
				file.loaded += data.loaded;
				file.completion = (file.loaded/file.size*100);
				
				this.triggerEvent("fileUploading",{"file":file});
				this.processFileChunkFrom(file,++index,cb);
			}
			
			return jQuery.proxy( func, $this);
			//alert("yes")
		}(index,file,cb));
	},

	/**
	 * @param String filename
	 * @return {Object}
	 */
	getFile : function(filename)
	{
		return this.files[filename];
	},

	/**
	 * Uploads a chunk
	 * if a chunk fails we set uploadError on file object to true
	 * @param {Object} chunk
	 * @param {Object} file
	 * @param cb fired after successfully uploading chunk
	 */
	uploadChunk : function(chunk,file,lastChunk,cb)
	{
		var fd = new FormData();
		
		fd.append("chunk",chunk);
		fd.append("filename",chunk.filename);
		fd.append("uid",file.uid);
		
		if (chunk.index == 0)
		{
			fd.append("firstChunk",1);
		}

		if ((file.loaded +this.chunkSize) >= file.size)
		{
			fd.append("lastChunk",1);
		}

		var xhr = new XMLHttpRequest();
		
		xhr.addEventListener("error",this.getProxy(function(e){}));

		var $this = this;

		xhr.addEventListener("readystatechange",function(file){

			var func = function(e,f)
			{
				if (e.target.readyState == 4)
				{
					if (e.target.status != 200)
					{
						file.uploadError = true;
					}
				}
			}
			return jQuery.proxy( func, $this);

		}(file));

		xhr.upload.addEventListener("progress",function(file){
						
			var func = function(e,f)
			{
				file = this.getFile(file.name);

				var newPerc = ((file.loaded+e.loaded) / file.size) * 100
				file.completion = Math.max(0,Math.min(newPerc,100));

				this.triggerEvent("fileUploading",{"file":file});
			}
			
			return jQuery.proxy( func, $this);
			
			
		}(file));
		
		xhr.upload.addEventListener("load",function(chunk,cb){
			
			var func = function(e)
			{
				var data = {};
				data.loaded = chunk.size;
	
				cb(data);
			}
			
			return jQuery.proxy( func, $this);
			
		}(chunk,cb));
		
		xhr.open("POST",this.uploadFile);
		xhr.send(fd);
	}, 

	showDebug : function(message)
	{
		if (!this.debug)
		{
			return false;
		}
	}
});
