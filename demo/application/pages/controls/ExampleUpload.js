goog.provide('Application.Controls.Examples.ExampleUpload');

goog.require('Application.Controls.Examples.ExampleControlOverviewBase');
goog.require('Banana.Controls.ChunkedUpload');

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
			sin.setStyle("width:100%;height:45px;position:relative;border-bottom:1px solid #888888;");

			completion =new Banana.Controls.Panel().setStyle('position:absolute;height:45px;background-color:blue;');
			title =new Banana.Controls.Panel().setStyle('position:absolute;height:30px;');
			eta =new Banana.Controls.Label().setStyle('position:absolute;height:30px;right:0;');
			bps =new Banana.Controls.Label().setStyle('position:absolute;height:30px;left:0;bottom:0;font-size:12px;');
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