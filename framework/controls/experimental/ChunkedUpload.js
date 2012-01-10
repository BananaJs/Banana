/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary ChunkedUpload experimental control.
 */

goog.provide('Banana.Controls.ChunkedUpload');

/** @namespace Banana.Controls.ChunkUpload*/
namespace('Banana.Controls').ChunkedUpload = Banana.Controls.Panel.extend({
/** @lends Banana.Controls.ChunkUpload.prototype */

	/**
	 * creates a chunked upload control
	 * currently only supported by limited amount of browsers: chrome and firefox.
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
	 * @return {this}
	 */
	setChunkSize : function(chunkSize)
	{
		this.chunkSize = chunkSize;
		return this;
	},

	/**
	 * max upload at the same time
	 * @param {int} maxSimultaneousUpload
	 * @return {this}
	 */
	setMaxSimultaneousUpload : function(maxSimultaneousUpload)
	{
		this.maxSimultaneousUpload = maxSimultaneousUpload;
		return this;
	},

	/**
	 *
	 * @param {boolean} bool when true filedialog supports multiple file selection
	 * @return {this}
	 */
	setMultipleFilesUpload : function(bool)
	{
		var control = this.findControl('fileInput');
		if (!control)
		{
			return;
		}
		control.setMultiple(bool);

		return this;
	},

	/**
	 * sets the url to post to
	 * @param {String} url
	 * @return {this}
	 */
	setPostUrl : function(url)
	{
		this.uploadFile = url;
		return this;
	},

	/**
	 * Check whether our upload control is supported by the browser
	 * @return {boolean}
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
	 * @param {Array} files
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
	 * @param {int} from
	 * @param {to} to
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
	 * @param {Object} file
	 * @param {int} index part of the file chunk
	 * @param {function} cb called after each upload chunk completion
	 */
	processFileChunkFrom : function(file,index,cb)
	{
		var start = file.loaded;
		var end = file.loaded+this.chunkSize;

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

		this.uploadChunk(chunk,file,function(index,file,cb)
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
	 * @param {String} filename
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
	uploadChunk : function(chunk,file,cb)
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