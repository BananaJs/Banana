import {DataControl} from "./DataControl.js";
import {Panel} from "./Panel.js";

export class Table extends DataControl {
    init() {
        super.init();
        this.addCssClass("table");
    }

    getTagName() {
        return 'table';
    }
}
export class TableRow extends DataControl {
    init() {
        super.init();
    }

    getTagName() {
        return 'tr';
    }
}
export class TableCol extends DataControl {
    init() {
        super.init();
    }

    getTagName() {
        return 'td';
    }
}
export class TableHeaderCol extends TableCol {
    init() {
        super.init();
    }

    getTagName() {
        return 'th';
    }
}
export class TableHead extends Panel {
    init() {
        super.init();
    }

    getTagName() {
        return 'thead';
    }
}
export class TableBody extends Panel {
    init() {
        super.init();
    }

    getTagName() {
        return 'tbody';
    }
}
