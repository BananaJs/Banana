/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana
 * @summary Base Control component
 */


import {generateUniqueId} from "../util/Utils.js";

/**
 * Eventtypes used in Banana
 */
export const EventTypes = {
    'DOM_EVENT':1,
    'CUSTOM_EVENT':2
}


/** @namespace Banana.Control */
export class Control {

    constructor(...args) {
        this.init.apply(this, args);
    }

    init () {
        this.generateUniqueId();
        this.customId = false; // flag if page sets id
        this.binds = [];
        this.controls = [];
    }

    createComponents () {
    }
    updateDisplay () {
    }
    onPreInvalidateContents () {
    }
    unload () {
    }
    onWindowResize () {
    }
    onVisibilityChange () {
    }
    onOffline () {
    }
    onOnline () {
    }

    applyToChildren (fn) {
        const args = Array.from(arguments).slice(1);
        this.controls.forEach(child => fn.apply(this, args));
    };

    setId (id) {
        this.id = id;
        this.customId = true;
        return this;
    }

    getId () {
        return this.id;
    }

    setClientId (cid) {
        this.clientId = cid;
    };

    getClientId () {
        return this.clientId;
    };

    generateUniqueId () {
        this.id = generateUniqueId();
    }

    render (control, index) {
        this.getPage().initRender(control, this, null, null, false, index);
    }

    setPage (page) {
        this.page = page;
    }

    getPage () {
        return this.page;
    }

    getProxy (fn) {
        return jQuery.proxy(fn, this);
    }

    setParent (parent) {
        this.parent = parent;
    }

    getParent () {
        return this.parent;
    }

    getEnabled () {
    };

    addControl (c) {
        this.controls.push(c);
        return this;
    }

    addControlAt (c, at) {
        this.controls.splice(at, 0, c);
        return this;
    }

    getControls () {
        return this.controls;
    }

    findControl (id) {
        if (this.id === id) return this;
        for (const child of this.controls) {
            if (child instanceof Control) {
                const found = child.findControl(id);
                if (found) return found;
            }
        }
        return null;
    }

    remove () {
        console.error("Remove method is not fully implemented");
        this.unregisterEvents();
    };

    clear () {
        this.controls = [];
    };

    invalidateDisplay () {
        var page = this.getPage();
        if (page && page.isRendered) {
            page.rerender(this.getFirstUiControl());
        }
    }

    triggerEvent (name, params) {
        jQuery(this).trigger(name, params);
    }

    getDomEventTypes () {
        return ['mousedown',
            'mousemove',
            'touchstart',
            'touchend',
            'touchmove',
            'drag',
            'dragstart',
            'dragenter',
            'dragover',
            'dragleave',
            'dragend',
            'drop',
            'resize',
            'mouseup',
            'ready',
            'click',
            'dblclick',
            'error',
            'ready',
            'select',
            'submit',
            'focusin',
            'focusout',
            'blur',
            'focus',
            'change',
            'mouseover',
            'mouseleave',
            'mouseenter',
            'mouseout',
            'keypress',
            'keyup',
            'keydown'
        ];
    };

    bind (name, func, data) {
        if (this.hasBind(name, func)) return false;

        const type = this.getDomEventTypes().includes(name) ? EventTypes.DOM_EVENT : EventTypes.CUSTOM_EVENT;
        this.binds.push({ name, func, data, type });

        if (type === EventTypes.CUSTOM_EVENT || this.isRendered) {
            jQuery(this.isRendered && type === EventTypes.DOM_EVENT ? `#${this.getClientId()}` : this)
                .bind(name, data, func);
        }
        return this;
    };

    hasBind (name, func) {
        this.binds = this.binds || [];

        return this.binds.some(b =>
            b.name === name && (!func || func.guid === b.func.guid || b.func === func)
        );
    };

    unbind (name, func) {
        this.binds = this.binds.filter(b => {
            if (b.name === name && (!func || b.func === func)) {
                const $target = b.type === EventTypes.DOM_EVENT ? jQuery(`#${this.getClientId()}`) : jQuery(this);
                $target.unbind(name, func);
                return false;
            }
            return true;
        });
    }

    registerEvents () {
        if (!this.binds) {
            return;
        }

        var i, len;
        for (i = 0, len = this.binds.length; i < len; i++) {
            var name = this.binds[i].name;
            var func = this.binds[i].func;
            var data = this.binds[i].data;
            var type = this.binds[i].type;

            //there is a difference between dom and data events. dom events can be registered only
            //when the dom elements are rendered. data events can be registered right when object are instantiated
            //if we bind an custom event during construction (before dom render, no rerender has occured) we want it instant to be registered
            //because this function is called after rendering and rerendering we only need to bind the custom events
            //after a RE-rerender, cause rerendering always starts with unbinding ALL events.
            if (type === EventTypes.CUSTOM_EVENT && this.getPage().isRerendering) {
                if (data) {
                    jQuery(this).bind(name, data, func);
                } else {
                    jQuery(this).bind(name, func);
                }
            } else {
                //no need to bind this event,
            }
        }
    };

    unregisterEvents () {
        if (!this.binds) {
            return;
        }

        jQuery(this).unbind(); //and all custom events
    };

    getHtml (markAsRendered) {
        return this.controls.map(child =>
            child instanceof Control ? child.getHtml(markAsRendered) : child
        ).join('');
    };

    getFirstUiControl () {
        if (this.parent) {
            return this.parent.getFirstUiControl();
        }
        return null;
    };
}