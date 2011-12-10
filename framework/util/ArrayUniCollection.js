/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary ArrayBiCollection
 */

goog.provide('Banana.Util.ArrayUniCollection');

/**
 * Array uni collection is a wrapper class maintaining quick access to data from index and vica versa.
 * Use this class if have arrays with non numeric indices and quick index lookup 
 * 
 * @constructor
 */
Banana.Util.ArrayUniCollection = function()
{
	this.data = {};
	this.indexKey = [];	

	/**
	 * Adds new item to the collection. Key in string or int format.
	 * @param {String} key
	 * @param {mixed} item
	 */
	this.addItem = function(key, value)
	{
		this.data[key] = value;
		this.indexKey[this.indexKey.length] = key;
	}

	/**
	 * Modifies item. Only if key already exists
	 * 
	 * @param {String} key
	 * @param {mixed} value
	 */
	this.alterItem = function(key,value)
	{
		if (!this.data[key])
		{
			return;
		}
		
		this.data[key] = value;
	}

	/**
	 * Gets data by key
	 * @param {String} key
	 * @return {mixed} 
	 */
	this.getItem = function(key)
	{
		return this.data[key];
	}

	/**
	 * gets indexed array with elements containing the data
	 * @return {Array}
	 */
	this.getArray = function()
	{
		var a = [];

		this.each(function(i,d)
		{
			a.push(d);
		});

		return a;
	}
	
	/**
	 * @ignore
	 */
	this.getItems = function()
	{
		return this.data;
	}

	/**
	 * Gets item by index
	 * @param {int} index
	 * @return {mixed} 
	 */
	this.getItemByIndex = function(index)
	{
		return this.getItem(this.indexKey[index]);
	}

	/**
	 * Gets key by index
	 * @param {int} index
	 * @return {String}
	 */
	this.getKeyByIndex = function(index)
	{
		return this.indexKey[index];
	}

	/**
	 * gets length of the collection
	 * @return {int}
	 */
	this.getLength = function()
	{
		return this.indexKey.length;
	}

	/**
	 * Removes item by index
	 * @param {int} index
	 */
	this.removeByIndex = function(index)
	{
		removeByKey(this.indexKey[index],this);
		this.indexKey.splice(index,1);

	}
	
	/**
	 * checks if given key exists in the collection
	 * @param {String} key
	 * @return {boolean} true if found
	 */
	this.isset = function(key)
	{
		return (this.data[key] != undefined);
	}

	/**
	 * Clones the collection
	 * @return {Banana.Util.ArrayBiCollection}
	 */
	this.clone = function()
	{
		c = new MFArrayUniCollection();
		c.data = eval(uneval(this.data)); // Objectclone
		c.indexKey = this.indexKey.slice(); // Arrayclone
		return c;
	}

	this.sortedKeys = function(fn)
	{
		fn = fn || function (a, b) {return parseInt(a) > parseInt(b);};
		var copiedIndex = this.indexKey.slice(); // clone
		copiedIndex.sort(fn);
		return copiedIndex;
	}
	
	/**
	 * Walks over the collection
	 * @param {Function} f
	 * @param {mixed} userdata
	 */
	this.each = function(f,userdata)
	{
		var len = this.getLength();
		for (var i = 0; i < len; i++)
		{
			f(i,this.getItemByIndex(i),userdata);
		}
	}

	/**
	 * @ignore
	 */
	this.remove = function(key)
	{
		//TODO
	}

	/**
	 * @ignore
	 * @param {String} key
	 * @param {mixed} obj
	 */
	function removeByKey(key,obj)
	{
		delete obj.data[key];
	}
}