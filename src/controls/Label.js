/**
 * @package Banana.Controls
 * @summary Label control. Renders a piece of data as text.
 */

import {DataControl} from "./DataControl.js";
import {DomHelper} from "../util/DomHelper.js";
import {escapeHtml} from "../util/Utils.js";

export class Label extends DataControl {

    init() {
        super.init();
        this.addCssClass('BLabel');
        this.tagName = 'label';
    }

    /**
     * Sets the label data.
     *
     * The raw value is kept on this.data (so getData() is unchanged), but the
     * value rendered into the initial HTML is escaped. This matches
     * setDomData() below, which has always used textContent on re-render -
     * previously the same value was raw on first render and escaped on update.
     *
     * @param {*} data
     * @param {boolean} [ignoreEvent]
     * @param {boolean} [ignoreDom]
     * @returns {this}
     */
    setData(data, ignoreEvent, ignoreDom) {
        super.setData(data, true, ignoreDom);
        this.addControl(escapeHtml(data));
        return this;
    }

    setTagName(tag) {
        this.tagName = tag;
        return this;
    }

    getTagName() {
        return this.tagName;
    }

    setForControl(control) {
        this.setAttribute('for', control.clientId);
        return this;
    }

    setDomData(data) {
        if (this.isRendered) {
            DomHelper.setTextData(data ?? '', this);
        }
    }
}
