import {InputControl} from "./InputControl.js";
import {DomHelper} from "../util/DomHelper.js";

export class Checkbox extends InputControl {

    init() {
        super.init();
        this.bind('change', this.getProxy(this.onChange));
        this.setData(false);
        this.setAttribute('type', 'checkbox');
    }


    /**
     * focus the input control
     * @return {this}
     */
    focus() {
        jQuery('#' + this.clientId).focus();
        return this;
    }

    /**
     * this function is called after user changes something in the dom
     */
    onChange() {
        this.setData(this.getDomData(), false, true);
        this.isChanged = true;
    }

    /**
     * @return {String}
     */
    getTagName() {
        return 'input';
    }

    /**
     * Used to apply the data to the dom
     * @ingore
     */
    setDomData(data) {
        if (this.isRendered) {
            DomHelper.setCheckBoxData(data, this);
        }
    }

    /**
     * @ignore
     */
    getDomData() {
        if (this.isRendered) {
            return DomHelper.getCheckBoxData(this);
        }
    }
}
