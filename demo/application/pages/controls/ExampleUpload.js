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
		var upload = new Banana.Controls.Upload();
		
		upload.bind("filesSelected",this.getProxy(function(e,data){
			this.createFileProgression(data.files);
		}));
		
		upload.bind('fileUploading',this.getProxy(function(e,data){
			this.updateFileIndicator(data.file);
		}));
		
		upload.bind('fileUploaded',this.getProxy(function(e,data){
			this.finishFileIndicator(data.file);
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
	}
});





















namespace('Banana.Controls').Form = Banana.UiControl.extend({
	
	getTagName : function()
	{
		return 'form';
	}	
});

namespace('Banana.Controls').FileInput = Banana.Controls.InputControl.extend({
	
	init : function()
	{
		this._super();
		
		this.setAttribute("type",'file');
		this.setAttribute("multiple",'true');
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

namespace('Banana.Controls').FileInputFile = Banana.Control.extend({
	
	
});

namespace('Banana.Controls').Upload = Banana.Controls.Panel.extend({
	
	init : function()
	{
		this._super();
	
		if (!this.supportAjaxUploadProgressEvents())
		{
			this.addControl("chunk upload not supported by your browser");
			return;
		}
		
		this.debug = true;
		this.files = [];
		this.previousLoadedChunk = {};
		
		this.chunkSize = 2000000;
		this.uploadFile = 'upload/upload.php';
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
		 
		form.addControl(maxInput);
		form.addControl(fileInput);
		
		this.addControl(form);	
	},
	
	supportAjaxUploadProgressEvents : function() 
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
	
	uploadFiles : function(files)
	{
		this.previousLoadedChunk = {};
		
		var i,len;
		for (i=0,len=files.length;i < len; i++)
		{
			var file = files[i];
			file.loaded = 0;
			file.completion = 0;
			
			this.files[file.name] = file;
			
			this.processFileChunkFrom(file,0,null);
		}
	},
	
	processFileChunkFrom : function(file,index,cb)
	{
		var start = file.loaded;
		var end = file.loaded+this.chunkSize;
		
		if (index != 0)
		{
			//start +=1;
			//end+=1;
		}
		if (index == 1)
		{
			
		}
		
		if (start >= file.size)
		{
			//console.log("file ",file.name,"finished ",start);
			this.triggerEvent("fileUploaded",{"file":file});
			return;
		}
		
		if (end >= file.size)
		{
			end = file.size;
		}
		
		
		
		var slice = file.webkitSlice || file.mozSlice || file.slice
		
		var chunk = slice.call(file,start,end);
	
//		var chunk = null;
//		if (file.webkitSlice)
//		{
//			chunk = file.webkitSlice(start,end);
//		}
//		else if (file.mozSlice)
//		{
//			chunk = file.mozSlice(start,end);
//		}  
			
		//console.log("upload",chunk," from ",(start),"to",(end)," filesize  "+file.size," chunksize ",chunk.size);
		
		chunk.filename = file.name;
		chunk.index = index;
	
		var $this = this;
		
		this.uploadChunk(chunk,file,function(index,file,cb)
		{
			var func = function(data)
			{
				
				file = this.getFile(file.name);
				
				file.loaded += data.loaded;
				file.completion = (file.loaded/file.size*100);
				//console.log('file',file,'  for file ',file.name,'finished. file size: ',file.size,'file loaded',file.loaded,'perc',(file.loaded/file.size*100))
				this.previousLoadedChunk[file.name] = 0;
				
				this.triggerEvent("fileUploading",{"file":file});
				this.processFileChunkFrom(file,++index,cb);
			
			}
			
			return jQuery.proxy( func, $this);
			//alert("yes")
		}(index,file,cb));
	},
	
	getFile : function(filename)
	{
		return this.files[filename];
	},
	
	uploadChunk : function(chunk,file,cb)
	{
		var fd = new FormData();
		
		fd.append("chunk",chunk);
		fd.append("filename",chunk.filename);
		
		if (chunk.index == 0)
		{
			fd.append("removeFile",1);
		}
		
		var xhr = new XMLHttpRequest();
		
		xhr.addEventListener("error",this.getProxy(function(e){
			
			alert("error")
		})); 

		var $this = this;
		
		xhr.upload.addEventListener("progress",function(file){
						
			var func = function(e,f)
			{
				file = this.getFile(file.name);
				//console.log(e,f);
				//var file = this.getFile()
				//console.log('chunk for file ',file.name,' progress',"filesize",file.size,"chunkloaded",e.loaded,"chunktotal",e.total);	
				
				if (!this.previousLoadedChunk[file.name])
				{
					this.previousLoadedChunk[file.name] = 0;
				}
				
				var added = e.loaded - this.previousLoadedChunk[file.name];
				//console.log('add ',added);
				var newPerc = ((file.loaded+e.loaded) / file.size) * 100
				file.completion = Math.max(0,Math.min(newPerc,100));
				console.log('new perc ',newPerc);
				//file.loaded += added - file.name.length;
				this.previousLoadedChunk[file.name] +=added;
				
				this.triggerEvent("fileUploading",{"file":file});
				//this.triggerEvent("fileUploading",{"file":file});
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