import {DataControl} from "./DataControl.js";

export class Image extends DataControl {
    init() {
        super.init();
    }

    setImage(image) {
        this.setAttribute('src', image);
        return this;
    }
    setTitle(title) {
        this.setAttribute('title', title);
        return this;
    }
    getTagName() {
        return 'img';
    }
    setDomData(data) {
        jQuery('#' + this.getClientId()).attr({'src': data});
    }
}
