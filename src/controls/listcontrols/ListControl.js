/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Controls
 * @summary Base list control for binding datasources to datasets
 */

import { DataControl } from "../DataControl.js";

/** @namespace ListControl */
export class ListControl extends DataControl {
	/**
	 * Creates a base list control for binding datasources to datasets.
	 * This control should be extended for specific list implementations.
	 *
	 * @constructs
	 * @extends {Banana.Controls.DataControl}
	 */
	constructor(...args) {
		super(...args);
		this.dataKeyField = "key";
		this.dataValueField = "value";
		this.dataDepthField = "depth";
		this.datasource = null;
		this.bindedDataSource = null;
	}

	/**
	 * Sets the datasource for the control and triggers a rerender.
	 * Optionally suppresses the dataSourceChanged event.
	 *
	 * @param {any} datasource - The datasource to set.
	 * @param {boolean} [ignoreEvent=false] - If true, no event is triggered.
	 * @returns {this}
	 */
	setDataSource(datasource, ignoreEvent = false) {
		this.datasource = datasource;
		this.invalidateDisplay();
		if (!ignoreEvent) {
			this.triggerEvent("dataSourceChanged", datasource);
		}
		return this;
	}

	/**
	 * Retrieves the current datasource.
	 *
	 * @returns {any} The current datasource.
	 */
	getDataSource() {
		return this.datasource;
	}

	/**
	 * Binds the control's datasource to a dataset.
	 *
	 * @param {Banana.Data.DataSet|string} set - The dataset or its name.
	 * @param {string} bind - The property path to bind (e.g., "value.subvalue").
	 * @returns {this}
	 */
	dataSetSourceBind(set, bind) {
		this.bindedDataSource = [set, bind];
		if (set instanceof Banana.Data.DataSet) {
			set.bindControlToDataSource(this);
		}
		return this;
	}

	/**
	 * Sets the field name for the key in the datasource.
	 * Use this when the datasource contains complex objects.
	 *
	 * @param {string} key - The field name.
	 * @returns {this}
	 */
	setDataKeyField(key) {
		this.dataKeyField = key;
		return this;
	}

	/**
	 * Sets the field name for the value in the datasource.
	 * Use this when the datasource contains complex objects.
	 *
	 * @param {string} value - The field name.
	 * @returns {this}
	 */
	setDataValueField(value) {
		this.dataValueField = value;
		return this;
	}

	/**
	 * Sets the field name for the depth in the datasource.
	 *
	 * @param {string} value - The field name.
	 * @returns {this}
	 */
	setDataDepthField(value) {
		this.dataDepthField = value;
		return this;
	}
}