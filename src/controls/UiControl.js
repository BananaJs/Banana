import { Control, EventTypes } from "./Control.js";
import {escapeHtml} from "../util/Utils.js";

/**
 * Represents a base class for all UI-related controls that are rendered to the DOM.
 * It manages the element's lifecycle, attributes, CSS, and events.
 *
 * This is a modernized version that preserves the original behavior and lifecycle.
 */
export class UiControl extends Control {

    /**
     * @override
     * Properties are initialized here to align with the framework's lifecycle,
     * where methods might be called by subclasses before super.init().
     */
    init(...args) {
        super.init(...args);
        this.css = {};
        this.style = '';
        this.isRendered = false;
        this.visible = true;
        this.enabled = true;
        this.attributes = {}; // Ensure attributes object exists
        this.cssClass = [];   // Ensure cssClass array exists
    }

    //region Lifecycle & Structure

    addControl(c, autoRender) {
        if (this.isInitialized) {
            const page = this.getPage();
            page.initializeControl(c, this, false, this.controls.length);
            if (autoRender) {
                this.render(c);
            }
        }
        return super.addControl(c);
    }

    addControlAt(c, index, autoRender) {
        if (!this.controls[index]) {
            return this.addControl(c, autoRender);
        }
        if (this.isInitialized) {
            const page = this.getPage();
            page.initializeControl(c, this, false, index);
            if (autoRender) {
                this.render(c, index);
            }
        }
        return super.addControlAt(c, index);
    }

    unload() {
        this.cachedElement = undefined;
    }

    remove() {
        this.getPage().removeControl(this);
    }

    clear() {
        const page = this.getPage();
        if (page) {
            page.clearControl(this);
            this.controls = [];
        }
    }

    getFirstUiControl() {
        if (!this.markAsNonRender) {
            return this;
        }
        return this.parent?.getFirstUiControl() || null;
    }
    //endregion

    //region DOM & Element Access

    /**
     * Gets the cached jQuery object for this control's DOM element.
     * @type {jQuery | null}
     */
    get jQueryElement() {
        if (!this.cachedElement) {
            this.cachedElement = window.jQuery(`#${this.getClientId()}`);
        }
        return this.cachedElement;
    }

    /**
     * Gets the HTML tag name for this control. Override to use a different tag.
     * @returns {string} e.g., 'div', 'span', 'input'.
     */
    getTagName() {
        return '';
    }

    /**
     * Computes dimensions and position of the control's element.
     * @returns {{height: number, width: number, offset: object, position: object}}
     */
    getDimensions() {
        const $el = this.jQueryElement;
        return {
            height: $el.height(),
            width: $el.width(),
            offset: $el.offset(),
            position: $el.position()
        };
    }

    /**
     * Sets the client ID used to reference the DOM node.
     * @param {string} cid The client ID.
     */
    setClientId(cid) {
        this.clientId = cid;
    }

    /**
     * Gets the client ID used as the DOM node's ID.
     * @returns {string}
     */
    getClientId() {
        return this.clientId;
    }
    //endregion

    //region Events

    /**
     * Triggers a custom or DOM event on the control.
     * @param {string} eventName The name of the event.
     * @param {any} [data] Optional data to pass with the event.
     */
    triggerEvent(eventName, data) {
        if (this.getDomEventTypes().indexOf(eventName) !== -1) {
            if (this.isRendered) {
                this.jQueryElement.trigger(eventName, data);
            }
        } else {
            window.jQuery(this).trigger(eventName, data);
        }
    }

    /**
     * @override
     */
    registerEvents() {
        if (!this.binds?.length) return;
        this.binds.forEach(({ name, func, data, type }) => {
            if (type === EventTypes.DOM_EVENT) {
                this.jQueryElement.bind(name, data, func);
            } else if (type === EventTypes.CUSTOM_EVENT && this.getPage().isRerendering) {
                window.jQuery(this).bind(name, data, func);
            }
        });
    }

    /**
     * @override
     */
    unregisterEvents() {
        if (!this.binds?.length) return;
        this.jQueryElement.unbind();
        window.jQuery(this).unbind();
    }
    //endregion

    //region Attributes & Styling

    /**
     * Composes attributes for usage in html tags.
     * @return {object} of attributes
     */
    getAttributes() {
        const attributes = this.attributes || {};

        attributes['id'] = this.getClientId();
        attributes['style'] = this.getStyle() || '';

        const currentCss = this.getCss();
        if (currentCss) {
            let css = "";
            for (const prop in currentCss) {
                css += `${prop}:${currentCss[prop]};`;
            }
            attributes['style'] += css;
        }

        if (this.cssClass && this.cssClass.length > 0) {
            attributes['class'] = this.getCssClass().join(' ');
        }

        return attributes;
    }

    setAttribute(key, value) {
        if (this.isRendered) {
            this.jQueryElement.prop(key, value);
        }
        this.attributes = this.attributes || {};
        this.attributes[key] = value;
        return this;
    }

    removeAttribute(key) {
        if (this.isRendered) {
            this.jQueryElement.removeProp(key);
        }
        if (this.attributes?.[key]) {
            delete this.attributes[key];
        }
        return this;
    }

    getAttribute(key) {
        if (!this.attributes) {
            return null;
        }
        return this.attributes[key];
    }

    setStyle(style) {
        if (this.isRendered) {
            console.warn("setting style on rendered control wont immediately apply. Use setCss() instead or invalidate control");
        }
        this.style = style;
        return this;
    }

    getStyle() {
        return this.style;
    }

    addCss(css) {
        this.css = { ...this.css, ...css };
    }

    setCss(css) {
        this.addCss(css);
        if (this.isRendered) {
            this.jQueryElement.css(this.css);
        }
        return this;
    }

    getCss() {
        return this.css;
    }

    getStyleProperty(prop) {
        return this.css[prop] || this.jQueryElement.css(prop);
    }

    getCssClass() {
        if (!this.cssClass) {
            this.cssClass = [];
        }
        return this.cssClass;
    }

    addCssClass(css) {
        // This defensive check is critical and preserved from the original.
        if (!this.cssClass) {
            this.cssClass = [];
        }

        if (!this.hasCssClass(css)) {
            this.cssClass.push(css);
            if (this.isRendered) {
                this.jQueryElement.addClass(css);
            }
        }
        return this;
    }

    removeCssClass(css) {
        if (!this.cssClass) {
            return this;
        }
        const indexOf = this.cssClass.indexOf(css);
        if (indexOf !== -1) {
            this.cssClass.splice(indexOf, 1);
            if (this.isRendered) {
                this.jQueryElement.removeClass(css);
            }
        }
        return this;
    }

    switchCssClass(oldClass, newClass) {
        this.removeCssClass(oldClass);
        this.addCssClass(newClass);
        return this;
    }

    hasCssClass(search) {
        return this.isRendered ? this.jQueryElement.hasClass(search) : this.getCssClass().includes(search);
    }
    //endregion

    //region Visibility & State

    setVisible(v, speed, type, callback) {
        this.triggerEvent('onSetVisible', v);
        this.visible = v;
        let ignoreDirectAction = false;

        if (v) { // SHOW
            if (this.isRendered) {
                const onComplete = () => {
                    this.setCss({'display': ''});
                    if (callback) callback();
                };
                if (type === 'fadeIn') {
                    this.jQueryElement.fadeIn(speed, onComplete);
                    ignoreDirectAction = true;
                } else {
                    this.jQueryElement.show(speed, onComplete);
                }
            }
            if (!ignoreDirectAction) {
                this.setCss({'display': ''});
            }
        } else { // HIDE
            if (this.isRendered) {
                const onComplete = () => {
                    this.setCss({'display': 'none'});
                    if (callback) callback();
                };
                if (type === 'fadeOut') {
                    ignoreDirectAction = true;
                    this.jQueryElement.fadeOut(speed, onComplete);
                } else {
                    this.jQueryElement.hide(speed, onComplete);
                }
            }
            if (!ignoreDirectAction) {
                this.setCss({'display': 'none'});
            }
        }
        return this;
    }

    getVisible() {
        if (this.isRendered) {
            return this.jQueryElement.is(":visible");
        }
        return this.visible;
    }

    setEnabled(e, recursive) {
        this.triggerEvent('onSetEnabled', e);
        this.enabled = e;
        if (this.isRendered) {
            this.jQueryElement.prop('disabled', !e);
        }
        if (recursive) {
            this.controls.forEach(child => child.setEnabled?.(e, true));
        }
        return this;
    }

    getEnabled() {
        return this.enabled;
    }
    //endregion

    //region Rendering

    getHtmlAttributes() {
        const attributes = this.getAttributes();
        return Object.entries(attributes)
            .filter(([_, value]) => value !== undefined && value !== 'undefined')
            // 2026-10-07: values are escaped. Previously a value containing a
            // double quote broke out of the attribute entirely.
            .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
            .join(' ');
    }

    getHtml(markAsRendered) {
        this.cachedElement = undefined; // Always invalidate cache before generating HTML
        const tag = this.getTagName();
        const attrs = this.getHtmlAttributes();
        const controlsHtml = this.controls
            .map(child => (child instanceof Control ? child.getHtml(markAsRendered, true) : child))
            .join('');
        const html = `<${tag} ${attrs}>${controlsHtml}</${tag}>`;
        if (markAsRendered) {
            this.isRendered = true;
        }
        return html;
    }
    //endregion
}