<?php


class ChunkUpload
{
	private $_targetPath;
	private $_tempName;
	private $_tempPath;
	private $_target;
	private $_source;

	/**
	 * The source chunk file
	 * @param $source
	 * @return void
	 */
	public function setSource($source)
	{
		$this->_source = $source;
	}

	/**
	 * Path where the chunk file should be constructed from other chunks
	 * @param $path
	 * @return void
	 */
	public function setTempPath($path)
	{
		$this->_tempPath = $path;
	}

	/**
	 * Path where the file will be copied when all chunks are complete
	 * @param $path
	 * @return void
	 */
	public function setTargetPath($path)
	{
		$this->_targetPath = $path;
	}

	/**
	 * The name of the temporary file used to construct the file from chunks
	 * @param $name
	 * @return void
	 */
	public function setTempName($name)
	{
		$this->_tempName = $name;
	}

	/**
	 * Name of the final file.
	 * @param $target
	 * @return void
	 */
	public function setTarget($target)
	{
		$this->_target = $target;
	}


	/**
	 * build to file in Temp
	 * @return void
	 */
	public function build()
	{
		$target = fopen($this->_tempPath."/".$this->_tempName,"a+b");

		$btw = filesize($this->_source);

		$wb = fwrite($target, file_get_contents($this->_source));

		fclose($target);

		if ($btw != $wb)
		{
			header('HTTP/1.1 500 Internal Server Error');
		}

		echo $wb;
	}

	/**
	 * Removes the target file. Use this at the beginning
	 * @return void
	 */
	public function destroyTarget()
	{
		if (file_exists($this->_targetPath.$this->_target))
		{
			unlink($this->_targetPath.$this->_target);
		}
	}

	/**
	 * Creates a file from the constructed temp file.
	 * usually this method should be called after the last chunk is build
	 * @return void
	 */
	public function buildTarget()
	{
		rename($this->_tempPath.$this->_tempName,$this->_targetPath.$this->_target);
	}
}

 

$c = new ChunkUpload();
$c->setTargetPath("upload/");
$c->setTempPath("/tmp/");
$c->setTempName("CHUNKUP_".$_POST['uid']);
$c->setSource($_FILES['chunk']['tmp_name']);
$c->setTarget($_POST['filename']);


//if we have the first chunk, we remove the file (if exists)
if (isset($_POST['firstChunk']))
{
	$c->destroyTarget();
}

//append chunks to target
$c->build();

if (isset($_POST['lastChunk']))
{
	$c->buildTarget();
}

return $_POST['filename'];
?>
