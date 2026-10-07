import {DataControl} from "./DataControl.js";
import {DomHelper} from "../util/DomHelper.js";


export class Link extends DataControl {

    init() {
        super.init();
        this.addCssClass('BLink');
    }

    updateDisplay() {
        if (!this.text) return;
        DomHelper.renderHtml(this.text, this);
    }

    setTarget(target) {
        this.setAttribute('target', target);
    }

    setHref(href) {
        this.setAttribute('href', href);
        return this;
    }

    setText(text) {
        this.text = text;

        if (this.isRendered) {
            DomHelper.renderHtml(this.text, this, true);
        }
        return this;
    }

    getTagName() {
        return 'a';
    }
};