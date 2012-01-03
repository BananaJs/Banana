/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary ArrayBiCollection
 */

goog.provide('Banana.Util.ArrayBiCollection');

goog.require('Banana.Util.ArrayUniCollection');

/**
 * Array bi collection is a wrapper class holding two Banana.Util.ArrayUniCollection
 * In one we keep track of key -> index. In the other key -> data.
 * 
 * @constructor
 */
Banana.Util.ArrayBiCollection = function()
{
	this.keyIndex = new Banana.Util.ArrayUniCollection();
	this.keyData = new Banana.Util.ArrayUniCollection();

	/**
	 * Clones the collection
	 * @return {Banana.Util.ArrayBiCollection}
	 */
	this.clone = function()
	{
		var t = new Banana.Util.ArrayBiCollection();
		t.keyIndex = this.keyIndex.clone();
		t.keyData = this.keyData.clone();
		return t;
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
	 * Adds new item to the collection. Key in string or int format.
	 * @param {String} key
	 * @param {mixed} item
	 */
	this.addItem = function(key, item)
	{
		this.remove(key);
		this.keyIndex.addItem(key,this.keyIndex.getLength())
		this.keyData.addItem(key,item);
	};

	/**
	 * Gets data by key
	 * @param {String} key
	 * @return {mixed} 
	 */
	this.getItem = function(key)
	{
		return this.keyData.getItem(key);
	};

	/**
	 * Gets item by index
	 * @param {int} index
	 * @return {mixed} 
	 */
	this.getItemByIndex = function(index)
	{
		return this.keyData.getItemByIndex(index);
	}

	/**
	 * Gets key by index
	 * @param {int} index
	 * @return {String}
	 */
	this.getKeyByIndex = function(index)
	{
		return this.keyIndex.getKeyByIndex(index);
	}

	/**
	 * TODO: (Duplicated implementation of getItem??)
	 * Gets item by key
	 * @ignore 
	 * @param {String} key
	 * @return {mixed}
	 */
	this.getItemByKey = function(key)
	{
		return this.getItemByIndex(this.getIndex(key));
	}

	/**
	 * gets index by key
	 * @param {String} key
	 * @return {int} 
	 */
	this.getIndex = function(key)
	{
		return this.keyIndex.getItem(key);
	}

	/**
	 * gets length of the collection
	 * @return {int}
	 */
	this.getLength = function()
	{
		return this.keyIndex.getLength();
	}

	/**
	 * checks if given key exists in the collection
	 * @param {String} key
	 * @return {boolean} true if found
	 */
	this.isset = function(key)
	{
		return (this.getItem(key) != undefined);
	}

	/**
	 * Removes item by key
	 * @param {String} key
	 */
	this.remove = function(key)
	{
		if (this.isset(key))
		{

			var index = this.keyIndex.getItem(key);

			this.keyIndex.removeByIndex(index);
			this.keyData.removeByIndex(index);

			///we need to decrement keyindex items after removed item
			var len = this.getLength();
			for (var i = index;  i < len; i++)
			{

				this.keyIndex.alterItem(this.getKeyByIndex(i),i);

			}
		}
	}

	/**
	 * clears the collection
	 */
	this.clear = function()
	{
		this.keyIndex = new Banana.Util.ArrayUniCollection();
		this.keyData = new Banana.Util.ArrayUniCollection();
	}

	/**
	 * sorts the collection
	 * @param {Function} fn
	 */
	this.sort = function(fn)
	{
		var sortedKeys = this.keyIndex.sortedKeys(fn);
		var oldData = this.keyData;
		this.clear();

		for (var i = 0; i < sortedKeys.length; i++)
		{
			this.addItem(sortedKeys[i], oldData.getItem(sortedKeys[i]));
		}

		return this;
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
}