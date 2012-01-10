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
		upload.setMaxSimultaneousUpload(2);
		upload.setChunkSize(1500000);
		upload.setPostUrl("upload.php");

		upload.bind("filesSelected",this.getProxy(function(e,data){
			upload.uploadFiles(data.files);
			this.createFileProgression(data.files);
		}));
		
		upload.bind('fileUploading',this.getProxy(function(e,data){
			this.updateFileIndicator(data.file);
		}));
		
		upload.bind('fileUploaded',this.getProxy(function(e,data){
			this.finishFileIndicator(data.file);
		}));

		upload.bind('filesUploaded',this.getProxy(function(e,data){
			this.updateFilesCompletion(data.files);
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
			sin.setStyle("width:100%;height:50px;position:relative;");

			completion =new Banana.Controls.Panel().setStyle('position:absolute;height:30px;background-color:blue;');
			title =new Banana.Controls.Panel().setStyle('position:absolute;height:30px;');
			eta =new Banana.Controls.Label().setStyle('position:absolute;height:30px;right:0;');
			bps =new Banana.Controls.Label().setStyle('position:absolute;height:30px;left:0;bottom:0');
			sin.addControl(completion)
			sin.addControl(title);
			sin.addControl(eta);
			sin.addControl(bps);

			title.addControl(files[i].name);
			this.uploadPanel.addControl(sin);
			
			this.fileIndicators[files[i].name] = sin;
		}
		
		this.uploadPanel.invalidateDisplay();
	},

	updateFilesCompletion : function(files)
	{
		for (i=0,len=files.length;i < len; i++)
		{
			var indicator =  this.fileIndicators[files[i].name];
			indicator.controls[0].setCss({"background-color":"green"});
		}
	},
	
	updateFileIndicator : function(file)
	{
		var indicator = this.fileIndicators[file.name];

		var perc = Math.round((file.loaded/file.size)*100);
			
		indicator.controls[0].setCss({"width":file.completion+"%"});
		indicator.controls[2].setData("eta: "+new Banana.Util.DateTimecode(file.eta).getTime('%H:%M:%S'));
		indicator.controls[3].setData(file.speed+'/s');
	},
	
	finishFileIndicator : function(file)
	{	
		var indicator = this.fileIndicators[file.name];
		indicator.controls[0].setCss({"background-color":"lime"});
		indicator.controls[2].setData("");
	},

	errorFileIndicator : function(file)
	{
		var indicator = this.fileIndicators[file.name];
		indicator.controls[0].setCss({"background-color":"red"});
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
	 * during file upload the first time a chunk is uploaded we append "firstChunk" to the post params
	 * last time a chunk is uploaded we append "lastChunk" to the post params.
	 * a "uid" param is appended to identify the file serverside
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

		this.files = [];
		this.chunkSize = 2000000;
		this.maxSimultaneousUpload = 2;

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

		this.registerCustomEvents();
	},

	/**
	 * @ignore
	 */
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

	/**
	 * max upload at the same time
	 * @param {int} maxSimultaneousUpload
	 */
	setMaxSimultaneousUpload : function(maxSimultaneousUpload)
	{
		this.maxSimultaneousUpload = maxSimultaneousUpload;
	},

	/**
	 *
	 * @param {boolean} bool when true filedialog supports multiple file selection
	 */
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

	/**
	 * Handle file selected
	 * @param files
	 */
	handleFilesSelected : function(files)
	{
		this.currentUploading = 0;
		this.currentUploaded = 0;
		this.currentFileCount = files.length;
		this.formFiles = files;
		this.files = [];
		this.startTime = new Date().getTime();
		
		this.triggerEvent("filesSelected",{"files":files});
	},

	/**
	 * Here we listen to the fileupload event.
	 * we create a construction here to use maxSimultaneousUpload and
	 * ensure completion of all files
	 */
	registerCustomEvents : function()
	{
		this.bind('fileUploadedInternal',this.getProxy(function(e,data){

			this.currentUploaded++;
			this.currentUploading--;

			///console.log('finished file '+data.file.name+' uploaded. currentUploaded',this.currentUploaded, 'currentUploading',this.currentUploading);
			//all files are uploaded
			if (this.currentUploaded == this.currentFileCount)
			{
				this.triggerEvent('filesUploaded',{files:this.formFiles});
				return;
			}

			//all files are at least busy
			if (this.currentUploading+this.currentUploaded == this.currentFileCount)
			{
				return;
			}

			//all files beeing uploaded are uploaded. do we have more files to upload?
			if (this.currentUploading < this.maxSimultaneousUpload)
			{
				this.uploadFiles(this.formFiles,this.currentUploaded+this.currentUploading,this.currentUploaded+this.currentUploading+this.maxSimultaneousUpload-this.currentUploading);
			}
		}));
	},

	/**
	 * Executes the upload procedure
	 * @param {Array} of files
	 */
	uploadFiles : function(files,from,to)
	{
		//from and to are used to maximize simultaneous uploads
		if (!from)
		{
			from = 0;
		}
		if (!to)
		{
			to	= this.maxSimultaneousUpload > files.length ? files.length : this.maxSimultaneousUpload;
		}

		this.currentUploading+=to-from;

		var i,len;
		for (i=from,len=to;i < len; i++)
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
			//trigger this event to make sure we always received a fileUploading event prior to fileUploaded
			//specialy with small files the progress event is sometimes not fired by the browser
			this.triggerEvent("fileUploading",{"file":file});

			this.triggerEvent("fileUploaded",{"file":file});
			this.triggerEvent("fileUploadedInternal",{"file":file});
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

				//we overwrite the loaded property here, because the ammount of loaded data
				//set in the progress event is chunkdata + header data from the xhr request.
				//the real amount of loaded bytes is index * chunksize
				//file.loaded += (index+2)*this.chunkSize;
				file.loaded += data.loaded;

				file.completion = (file.loaded/file.size*100);

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
		
		xhr.addEventListener("error",this.getProxy(function(e)
		{
			file.uploadError = true;
		}));

		var $this = this;

		//triggered every file state change
		xhr.addEventListener("readystatechange",function(file){

			var func = function(e,f)
			{
				if (e.target.readyState == 4)
				{
					if (e.target.status == 200 || e.target.status == 0 )
					{
					}
					else
					{
						file.uploadError = true;
					}
				}
			}
			return jQuery.proxy( func, $this);

		}(file));

		var startTime = this.startTime;

		//triggered every few ms
		xhr.upload.addEventListener("progress",function(file){
						
			var func = function(e,f)
			{
				file = this.getFile(file.name);

				//note that this is an indicative size. loaded bytes is complete xhr request
				//the actual chunk size is smaller. Bacause of that we set the actual correct size after each chunk completion
				//this happends in the callback in the load event
				var bytesLoaded = file.loaded+e.loaded;

				var newPerc = (bytesLoaded / file.size) * 100;
				file.completion = Math.max(0,Math.min(newPerc,100));

				//calculates bytes/s	//calculate eta
				var now =new Date().getTime();

				file.Bps = bytesLoaded/ ((now-this.startTime)/1000);

				file.speed = this.getReadablizeBytes(file.Bps);

				var eta = now - this.startTime;
				eta = eta/file.completion * (100-file.completion);

				//filter
				if (file.eta)
				{
					var alpha=0.1;
					eta =  eta * alpha + file.eta*(1-alpha);
				}

				file.eta = eta;

				this.triggerEvent("fileUploading",{"file":file});
			}
			
			return jQuery.proxy( func, $this);
			
			
		}(file));

		//triggered when chunk is complete uploading. here we call the complete callback
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

	/**
	 * get a more readable string by given string of bytes
	 * @param {String} bytes
	 * @return {String}
	 */
	getReadablizeBytes : function(bytes)
	{
		var s = ['bytes', 'kb', 'Mb', 'Gb', 'Tb', 'Pb'];
		var e = Math.floor(Math.log(bytes)/Math.log(1024));
		return (bytes/Math.pow(1024, Math.floor(e))).toFixed(1)+' '+s[e];
	}
});
