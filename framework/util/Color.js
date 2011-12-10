/**
 * @author Dennis Verhoeven
 * @package Banana.Util
 * @summary Color helper
 */

/** @namespace Banana.Util.Color */
goog.provide('Banana.Util.Color');


/** 
 * Helper class for working with colors.
 * Easy shift from rgb to hsv and modify parameters.
 * 
 * two ways to create a color class instance
 * 
   var c1 = new Banana.Util.Color("#444444");
   
   var c2 = new Banana.Util.Color(255,255,56);
   
 * 
 * @param {mixed} p1 hex representation or int red part 
 * @param {int} p2 
 * @param {int} p3  
 * 
 * @constructor 
 * 
 */
Banana.Util.Color = function(p1, p2, p3)
{
	var		r;		// Red, Green and Blue represent color in RGB space
	var		g;		// Values are integers in range of 0..255
	var		b;

	var		h;		// Hue, Saturation and Value represent color in HSV space
	var		s;		// Values are floats in range of 0..1
	var		v;

	/**
	 * 
	 * @constructs
	 * @ignore
	 */
	var _init = function(obj)
	{
		if (typeof(p1)=='string')
		{
			obj.setValue(p1);
		}
		else if (typeof(p1)=='number')
		{
			obj.r=p1;
			obj.g=p2;
			obj.b=p3;
			obj.computeHSV();
		}
		else
		{
			obj.r=0;
			obj.g=0;
			obj.b=0;
			obj.computeHSV();
		}
	}	
	
	/**
	 * red part
	 * @return {int}
	 */
	this.getR = function()
	{
		return this.r;
	}

	/**
	 * red part
	 * @param {int} value
	 */
	this.setR = function(value)
	{
		this.r=value;
		this.computeHSV();
	}
	
	/**
	 * green part
	 * @return {int}
	 */
	this.getG = function ()
	{
		return this.g;
	}

	/**
	 * green part
	 * @param {int} value
	 */
	this.setG = function(value)
	{
		this.g=value;
		this.computeHSV();
	}

	/**
	 * blue part
	 * @return {int}
	 */
	this.getB = function()
	{
		return this.b;
	}
	
	/**
	 * blue part
	 * @param {int} value
	 */
	this.setB = function(value)
	{
		this.b=value;
		this.computeHSV();
	}

	/**
	 * hue part
	 * @return {int}
	 */
	this.getH = function ()
	{
		return this.h;
	}

	/**
	 * hue part
	 * @param {int} value
	 */
	this.setH = function(value)
	{
		this.h=value;
		this.computeRGB();
	}

	/**
	 * saturation part
	 * @return {int}
	 */
	this.getS = function()
	{
		return this.s;
	}

	/**
	 * saturation part
	 * @param {int} value
	 */
	this.setS = function(value)
	{
		this.s=value;
		this.computeRGB();
	}

	/**
	 * value part
	 * @return {int}
	 */
	this.getV = function()
	{
		return this.v;
	}

	/**
	 * value part
	 * @param {int} value
	 */
	this.setV = function(value)
	{
		this.v=value;
		this.computeRGB();
	}
	
	/**
	 * @ignore
	 * @param {int} value
	 * @returns {int}
	 */
	var dec2hex = function(value)
	{
		return (value<16 ? '0' : '') + value.toString(16);
	}
	
	/**
	 * @ignore
	 * @param {int} value
	 * @returns {int}
	 */
	var hex2dec = function(value)
	{
		return parseInt(value, 16);
	}

	/**
	 * changes the current colorspace value
	 * @param {mixed} either #xxxxxx or xxx,xxx,xxx format
	 */
	this.setValue = function(value)
	{
		if (value.substr(0, 1)==='#')
		{
			this.r=hex2dec(value.substr(1, 2));
			this.g=hex2dec(value.substr(3, 2));
			this.b=hex2dec(value.substr(5, 2));
		}
		else
		{
		 	var digits = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.exec(value);
		 	this.r=parseInt(digits[1]);
    	this.g=parseInt(digits[2]);
    	this.b=parseInt(digits[3]);
		}

		this.computeHSV();
	}
	
	/**
	 * @return {String} in #xxxxxx format
	 */
	this.getValue = function()
	{
		return '#'+dec2hex(this.r)+dec2hex(this.g)+dec2hex(this.b);
	}

	/**
	 * Computes the hsv values according the current r,g,b values
	 */
	this.computeHSV = function()
	{
		var	r = this.r / 255;
		var g = this.g / 255;
		var b = this.b / 255;

		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var delta = max - min;

		var h = 0;
		var s = 0;
		var v = max;

		if (max != 0)
		{
			s = delta / max;
		} 
		else 
		{
			s = 0;
			h = -1;
			
			this.h=h;
			this.s=s;
			this.v=v;
			
			return;
		}

		if (delta)
		{
			if (r == max) 
			{
				h = (g - b) / delta;
			} 
			else if (g == max) 
			{
				h = 2 + (b - r) / delta;
			} 
			else 
			{
				h = 4 + (r - g) / delta;
			}
		} 
		else
		{
			h = 0;
		}

		h *= 60;

		if (h < 0) 
		{
			h += 360;
		}

		this.h=h;
		this.s=s;
		this.v=v;
	}

	/**
	 * Computes rgb values according the current h,s,v values
	 */
	this.computeRGB = function()
	{
		var h = this.h;
		var s = this.s;
		var v = this.v;

		var i = 0;
		var f = 0;
		var p = 0;
		var q = 0;
		var t = 0;
		var b = 0;
		var g = 0;

		if (s == 0)
		{
			r = g = b = v;
			
			this.r=Math.round(r * 255);
			this.g=Math.round(g * 255);
			this.b=Math.round(b * 255);
			
			return;
		}

		h %= 360;
		h /= 60;
		i = Math.floor(h);
		f = h - i;
		p = v * (1 - s);
		q = v * (1 - s * f);
		t = v * (1 - s * (1 - f));

		switch(i)
		{
			case 0:  r = v;  g = t;  b = p; break;
			case 1:  r = q;  g = v;  b = p; break;
			case 2:  r = p;  g = v;  b = t; break;
			case 3:  r = p;  g = q;  b = v; break;
			case 4:  r = t;  g = p;  b = v; break;
			default: r = v;  g = p;  b = q; break;
		}

		this.r=Math.round(r * 255);
		this.g=Math.round(g * 255);
		this.b=Math.round(b * 255);
	}
		
	_init(this);
}