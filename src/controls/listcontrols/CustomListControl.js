import { ListControl } from "./ListControl.js";

export class CustomListControl extends ListControl {

	/**
	 * Overridden to prevent default DOM data updates, as rendering is handled via `createControls`.
	 */
	setDomData() {
		// Intentionally left empty
	}

	/**
	 * Abstract method to be overridden by subclasses.
	 * Defines the logic for creating controls based on `data` or `datasource`.
	 */
	createControls() {
		// Subclasses should implement this method
	}

	/**
	 * Sets the data for the control.
	 * Clears the control, calls `createControls`, and invalidates the display for rerendering.
	 *
	 * @param {any} data - The data to set.
	 * @param {boolean} [ignoreEvent=false] - If true, no event is triggered.
	 * @param {boolean} [ignoreDom=false] - If true, DOM updates are skipped.
	 * @returns {this}
	 */
	setData(data, ignoreEvent = false, ignoreDom = false) {
		try {
			// Use structuredClone if available, otherwise fall back to JSON method
			this.data = typeof structuredClone === "function"
				? structuredClone(data)
				: JSON.parse(JSON.stringify(data));
		} catch (error) {
			console.error("Failed to clone data:", error);
			this.data = data; // Fallback to shallow assignment
		}

		if (!ignoreDom) {
			this.clear();
			this.createControls();
			this.invalidateDisplay();
		}

		if (!ignoreEvent) {
			this.triggerEvent("onSetData", this.data);
		}

		return this;
	}

	/**
	 * Sets the datasource for the control.
	 * Clears the control, calls `createControls`, and invalidates the display for rerendering.
	 *
	 * @param {any} ds - The datasource to set.
	 * @returns {this}
	 */
	setDataSource(ds) {
		this.datasource = ds; // No cloning needed unless datasource is modified
		this.clear();
		this.createControls();
		this.invalidateDisplay();
		this.triggerEvent("onSetDataSource", this.datasource);
		return this;
	}
}