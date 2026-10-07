/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary Dom Helper. dom writer for various banana actions
 */

/** @lends Banana.Util.DomHelper.prototype */
export const DomHelper = {
	/** @private */
	_getEl(target) {
		if (typeof target === 'string') {
			return document.getElementById(target);
		}
		return document.getElementById(target.getClientId());
	},

	/**
	 * renders control to target
	 * @param {string} data - HTML string
	 * @param {mixed} target - Banana.Control or DOM id
	 */
	render(data, target) {
		const el = this._getEl(target);
		if (el) el.insertAdjacentHTML('beforeend', data);
	},

	/**
	 * renders control before another
	 * @param {string} data - HTML string
	 * @param {mixed} before - Banana.Control or DOM id
	 */
	renderBefore(data, before) {
		const el = this._getEl(before);
		if (el) el.insertAdjacentHTML('beforebegin', data);
	},

	/**
	 * replaces content with another
	 * @param {string} data - HTML string
	 * @param {mixed} target - Banana.Control or DOM id (or any selector string in jQuery code)
	 */
	replace(data, target) {
		let el;
		if (typeof target === 'string' && target.startsWith('#')) {
			// in original code .replaceWith(data) on jQuery(target)
			el = document.querySelector(target);
		} else {
			el = this._getEl(target);
		}
		if (el) {
			// create a fragment from the HTML
			const frag = document.createRange().createContextualFragment(data);
			el.replaceWith(frag);
		}
	},

	/**
	 * renders plain html to target
	 * @param {string} html
	 * @param {mixed} target - Banana.Control or DOM id
	 * @param {boolean} dontAppend - if true, replace existing; else append
	 */
	renderHtml(html, target, dontAppend) {
		let el;
		if (typeof target === 'string' && target === 'body') {
			el = document.body;
		} else {
			el = this._getEl(target);
		}
		if (!el) return;
		if (dontAppend) {
			el.innerHTML = html;
		} else {
			el.insertAdjacentHTML('beforeend', html);
		}
	},

	/**
	 * removes all child elements from control
	 * @param {Banana.Control} control
	 */
	clear(control) {
		const el = this._getEl(control);
		if (el) el.innerHTML = '';
	},

	/**
	 * removes control from DOM
	 * @param {Banana.Control|string} control
	 */
	remove(control) {
		const el = typeof control === 'string'
			? document.getElementById(control)
			: this._getEl(control);
		if (el) el.remove();
	},

	/**
	 * sets data on form element
	 * @param {string} value
	 * @param {Banana.Control} control
	 */
	setData(value, control) {
		const el = this._getEl(control);
		if (el) el.value = value;
	},

	/**
	 * set text data on labels
	 * @param {string} value
	 * @param {Banana.Controls.Label} control
	 */
	setTextData(value, control) {
		const el = this._getEl(control);
		if (el) el.textContent = value;
	},

	/**
	 * set data on checkboxes
	 * @param {boolean} value
	 * @param {Banana.Controls.Checkbox} control
	 */
	setCheckBoxData(value, control) {
		const el = this._getEl(control);
		if (el) el.checked = !!value;
	},

	/**
	 * gets data from form control
	 * @param {Banana.Control} control
	 * @returns {string}
	 */
	getData(control) {
		const el = this._getEl(control);
		return el ? el.value : null;
	},

	/**
	 * retrieve data from checkboxes
	 * @param {Banana.Controls.Checkbox} control
	 * @returns {boolean}
	 */
	getCheckBoxData(control) {
		const el = this._getEl(control);
		return el ? el.checked : false;
	},

	/**
	 * Mark all controls as cleared.
	 * @param {string} id - the root id to clear
	 */
	clearIdsFrom(id) {
		const root = document.getElementById(id);
		if (!root) return;
		// clear all descendants
		root.querySelectorAll('*').forEach(el => { el.id = 'cleared'; });
		// clear the root itself
		root.id = 'cleared';
	}
};
