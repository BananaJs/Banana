<?php


class ChunkUpload
{
	private $_target;
	private $_source;
	private $_logHandle;

	public function __construct()
	{
		$this->_logHandle = fopen("log.txt",'a'); 
	}

	public function setSource($source)
	{
		$this->_source = $source;
	}
	
	public function setTarget($target)
	{
		$this->_target = $target;
	}
	
	public function removeTarget()
	{
		unlink($this->_target);
	}
	
	public function appendToFile()
	{
		$target = fopen($this->_target,"a+b");
		
		fwrite($target, file_get_contents($this->_source));
		fclose($target);
	}
	
	public function close()
	{
		fclose($this->_logHandle);
	}
	
	public function log($string)
	{
		fwrite($this->_logHandle, $string);
	}
}



$c = new ChunkUpload();

$c->setSource($_FILES['chunk']['tmp_name']);
$c->setTarget($_POST['filename']);

if (isset($_POST['removeFile']))
{
	$c->removeTarget();
}

$c->appendToFile();
$c->close();

return $_POST['filename'];
?>