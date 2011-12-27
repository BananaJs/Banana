/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary Various utils
 */

/**
@class Banana.Util
@name Banana.Util
*/

goog.provide('Banana.Util.Utils');

/**
 * serializes a mixed object
 * 
 * @param {object} data
 */
Banana.Util.serialize = function(data)
{
	return JSON._stringify(data);
};

/**
 * unserializes a serialized string
 * 
 * @param {object} data
 */
Banana.Util.unserialize = function(data)
{
	return JSON.parse(data);
};

/**
 * @returns Function based on namespace
 */
Banana.Util.NamespaceToFunction = function(ns)
{
	var s = ns.split('.');

	var fn = window;

	for (var i = 0, len = s.length; i < len; i++)
	{
		fn = fn[s[i]];
		if (!fn)
		{
			//s.splice(i+1);
			//alert("Namespace \""+s[i]+"\" does not exist in \""+s.join('.')+"\"");
			return null;
		}
	}
	return fn;
};

/**
 *	@returns data by path name
 *
 */
Banana.Util.getDataByPath = function(data,path)
{
	var path = path.split('.');

	var d = data;

	for(var i=0,len = path.length; i < len; i++)
	{
		d = d[path[i]];
		if (d == undefined)
		{
			return null;
		}
	}

	return d;
};

// Use the OWL library for the cloning
goog.require('Banana.thirdParty.OWLClone');
/**
 * Clone an object. Standard it wil do a shallow copy, when a deep clone is requested
 * it will copy everything by value
 * 
 * @param {mixed} data The data to clone
 * @param {Boolean} deep Perform a deep clone
 * 
 * @return {mixed} The cloned data
 * @constructor
 */
Banana.Util.Clone = function(data, deep) {

	if (deep)
	{
		return owl.deepCopy(data);
	}
	return owl.clone(data);
};

/**
 * Find an object by a field value
 *
 * @param {Array} data  Dataset to search
 * @param {mixed} field Field to search
 * @param {mixed} value Value to find
 *
 * @return Object|null Object found
 * @constructor
 */
Banana.Util.FindByField = function(data, field, value)
{
	for (var x = 0, dataSize = data.length; x < dataSize; x++) {
        if (data[x][field] == value) {
        	return data[x];
        }
    }
    return null;
};

/**
 * Combine an array collection by a field
 *
 * @param Array  arr   Array to combine
 * @param String field Field to combine on
 *
 * @returns Array containing arrays with the items
 * @constructor
 */
Banana.Util.CombineArrayByField = function(arr, field)
{
	if (!(arr instanceof Array))
	{
		log.error('Banana.Util.CombineArrayByField - List should be of type Array');
		return arr;
	}
	else if (!field)
	{
		log.error('Banana.Util.CombineArrayByField - No field given');
		return arr;
	}

	var list = {};

	for (var x = 0; x < arr.length; x++)
	{
		if (!list[arr[x][field]])
		{
			list[arr[x][field]] = [];
		}
		list[arr[x][field]].push(arr[x]);
	}

	var result = [];
	for (var i in list)
		result.push(list[i]);

	return result;
};

/**
 * Copies all new properties from newdata to olddata
 * All references in olddata stay intact
 * 
 * NOTE: arrays should contain objects with an identifier, or objects
 * identified by their position in the array. Mixing them will lead to 
 * problems.
 * 
 * NOTE2: olddata will be identical to newdata in the end. Properties
 * of olddata that are not in newdata will be removed.
 * 
 * example  
 * old [a,b,c]
 * new [a,x,d] with x having identifier
 * result [a,b,d] cause x is overwritten by d
 * 
 * 
 * @param {Object} newdata
 * @param {Object} olddata
 * @param {String} identifier
 * @param {Object} reference to parent object. used by framework. usefull to keep references intact
 * @return {Object} instance of olddata with newdata recursively copied inside
 * 
 * @constructor
 */
Banana.Util.CopyTo = function(newdata,olddata,identifier,refObj)
{
  	if (newdata instanceof Array && olddata instanceof Array)
	{
  		// Empty existing items and back them up
  		var backup = olddata.splice(0, olddata.length);
  		
		for (var i = 0, len = newdata.length; i < len; i++)
		{
			var valueA = newdata[i];
			if (typeof(valueA) == 'object') //arrays and objects
			{
				var objectAIdentifier = valueA[identifier];
				
				//if our object A has an identifier
				if (objectAIdentifier)
				{
					//check if we can find objectt with same id in the backup of B 
					var match = false;
					for (var j = 0, olen = backup.length; j < olen; j++)
					{
						var valueB = backup[j];
						
						var objectBIdentifier = valueB[identifier];
    					if (objectBIdentifier && objectBIdentifier == objectAIdentifier)
    					{
							match = true;
							// Let's restore from backup
							olddata.push(valueB);
							
							Banana.Util.CopyTo(valueA,valueB,identifier,{ref:olddata,prop:i});
							break;
    					}
					}

					if (!match)
					{
						// Item not found in backup, we'll use new one
						olddata.push(valueA);
					}
				}
				else
				{
					// Items is doesn't have and ID, we'll use new one
					olddata.push(valueA);
				}
			}
			else // not array/object: primitive value
			{
				olddata[i] = valueA; 
			}
		}
	}
	
	// seems that only new data contains the array. we just copy the array to b. 
	else if (newdata instanceof Array)
	{
		if (refObj)
		{	
			refObj.ref[refObj.prop] = newdata;
		}
		else
		{
			throw "Unable to assign property to object (missing reference)";
		}
	}
	
	// if its an object we also loop over it. now keys are our matches
	else if (typeof(newdata)== 'object')
	{
		var deadkeys = [];
		
		for(var prop in olddata)
		{
			if (typeof(olddata[prop]) == 'function') continue;
			
			deadkeys.push(prop);	
		}	
		
		for(var prop in newdata)
		{
			var valueA = newdata[prop];

			if (typeof(valueA) == 'function') continue;

			// Remove from dead keys array
			var index = deadkeys.indexOf(prop);
			if (index >= 0)
			{
				deadkeys.splice(index,1);
			}

			if (typeof(newdata[prop]) == 'object' && olddata[prop])
			{
				Banana.Util.CopyTo(newdata[prop],olddata[prop],identifier,{ref:olddata,prop:prop})
			}
			else
			{
				olddata[prop] = valueA;
			}			
		}	
		
		for (var i=0;i<deadkeys.length;i++)
		{
			delete olddata[deadkeys[i]];
		}
	} 

	return olddata;
}

/**
 * Compares 2 objects. returns true when equal.
 * Compares recursively 
 *
 * @param {Object} A
 * @param {Object} B
 * @param {Array} list of property names which should not be compared. i.e timestamps
 * 
 * @return {boolean} true when equal
 * @constructor
 */
Banana.Util.ObjectsAreEqual = function(a,b,ignores)
{
	return Banana.Util.ObjectPropsSameTo(a,b,ignores) && Banana.Util.ObjectPropsSameTo(b,a,ignores);
}

/**
 * checks if A's properties are the same on B
 *
 * @param {object} a
 * @param {object} b
 * @param {Array} list of property names which should not be compared. i.e timestamps
 * @return {boolean} true when equal
 * @constructor
 */
Banana.Util.ObjectPropsSameTo = function(a,b,ignores)
{
	//i we dont give either a a or b then not equal
	if (!b || !a)
	{
		return false;
	}

	if (!ignores)
	{
		ignores = [];
	}

	//we are going to check all property in A
	for (var prop in a)
	{
		if (typeof(a[prop]) == 'function') continue;
		
		if (typeof(a[prop]) == 'object' && b[prop] !== null)
		{
			if (typeof b[prop] == 'object')
			{
				//both A and B have an object assigned to their property. we need to check if those objects are the same
				//if not objects not the same
				if (!Banana.Util.ObjectsAreEqual(a[prop],b[prop],ignores))
				{
					return false;
				}
			}
			else
			{
				///b doesnt have an object in this property
				return false;
			}
		}

		//compare string, number and bools
		//dont compare when prop is in the ignore list, for example datestamps
		else if (typeof(a[prop]) == 'string' || typeof(a[prop]) == 'number' || typeof(a[prop]) == 'boolean')
		{
			if (ignores.indexOf(prop) == -1 && b[prop] != a[prop])
			{
				return false;
			}
		}
	}
	return true;
};

/**
 * Sorts objects by key
 * 
 * @param {Object} obj members
 * @param {Function} sortFunc custom sort 
 * @return {Object} newObj members
 * @constructor
 */
Banana.Util.sortObjectKeys = function(obj,sortFunc)
{
	var formArray =[];

	for (var key in obj)
	{
		formArray.push(key);
	}

	if (sortFunc)
	{
		formArray.sort(sortFunc);
	}
	else
	{
		formArray.sort();	
	}
	
	var newObj = {};

	for (var i = 0; i < formArray.length; i++)
	{
		var key = formArray[i];
		newObj[key] = obj[key];
	}

	return newObj;		
};

/**
 * Gives a random string. Useful for UIDs
 * @return {String}
 * @constructor
 */
Banana.Util.generateUniqueId = function()
{
	return  (((1+Math.random())*0x1000000000)|0).toString(16).substring(1);
}


/**
 * Flattens tree structure
 * @Param {Array} array
 * @param {String} childkey the key holding the children
 * @constructor
 */
Banana.Util.flattenTreeDepthFirst = function(object,childKey,reversed)
{
	if (!reversed)
	{
		reversed = [];
	}
	
	if (!object)
	{
		return reversed;
	}
	
	if (object[childKey])
	{
		var i,len
		for (i =0,len=object[childKey].length; i < len; i++)
	    {
			Banana.Util.flattenTreeDepthFirst(object[childKey][i],childKey,reversed);
	    }
	}
	
	reversed.push(object);
	return reversed;	
};

/**
 * Iterates over array asynchronized
 * iteration is devided into chunks where after each chunk the cpu gets time to do other tasks
 * 
 * TODO: let the user specify the chunksize
 * @param {Array} array to iterate over
 * @param {Function} cb callback called every iteration
 * @param {int} timeout between chunks, default 0
 * @param {Function} completeCb callback. Invoked when iteration is complete
 * @param {Function} complete chunk callback. Invoked after each chunk completion
 * @constructor
 */
Banana.Util.arrayInteratorAsync = function(array,cb,timeout,completeCb,completeChunkCb)
{	
	if (typeof(cb) != 'function')
	{
		return log.error("No callback specified for async iterator");
	}

	timeout = timeout || 0;
	var chunkSize = array.length > 10 ? array.length/10  : 1;
	
	function executeWait(loop)
	{
		setTimeout(function(){
			
			loop();
			
		},timeout)
	}	
	
	var i = -1;
	var alength = array.length;
	
	function loop()
	{
		i++;
		
		if (alength > i)
		{
			for (var j =0; j <= chunkSize;j++)
			{
				i++;
				
				if (i > alength)
				{
					return completeCb();
				}
				
				cb(array[i],i);
			}
			
			if (completeChunkCb)
			{
				completeChunkCb();
			}
			
			executeWait(loop)
		}
		else if (completeCb)
		{
			return completeCb();
		}
	};
	
	loop();
};