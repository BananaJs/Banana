import {UiControl} from "./UiControl.js";

export class Panel extends UiControl {
    init() {
        super.init();
        this.tagName = 'div';
    }

    getTagName() {
        return this.tagName;
    }
}
