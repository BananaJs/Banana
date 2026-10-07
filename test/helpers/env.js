/**
 * Minimal test environment for BananaFramework.
 *
 * The framework builds its HTML as strings, so most of it runs in plain Node
 * with no DOM at all. Only two things need stubbing:
 *   - jQuery, used by Control for custom (non-DOM) events and by UiControl
 *     for post-render DOM operations.
 *   - window/document, touched by id generation and DomHelper.
 *
 * This deliberately stays tiny: enough to exercise the framework's own logic,
 * not a browser emulation. Tests that need real DOM behaviour should assert on
 * generated HTML instead.
 */

const handlers = new WeakMap();

function shim(target) {
    return {
        bind(name, dataOrFn, maybeFn) {
            const fn = typeof dataOrFn === 'function' ? dataOrFn : maybeFn;
            const data = typeof dataOrFn === 'function' ? undefined : dataOrFn;
            if (!handlers.has(target)) handlers.set(target, new Map());
            const m = handlers.get(target);
            if (!m.has(name)) m.set(name, []);
            m.get(name).push({fn, data});
            return this;
        },
        unbind(name) {
            if (!handlers.has(target)) return this;
            if (name) handlers.get(target).delete(name);
            else handlers.set(target, new Map());
            return this;
        },
        trigger(name, params) {
            const m = handlers.get(target);
            if (!m || !m.has(name)) return this;
            for (const {fn, data} of m.get(name)) fn.call(target, {type: name, data}, params);
            return this;
        },
        // DOM-ish no-ops so rendered-path code does not explode in tests
        prop() { return this; },
        attr() { return this; },
        addClass() { return this; },
        removeClass() { return this; },
        focus() { return this; },
        empty() { return this; },
        remove() { return this; },
        length: 0,
    };
}

export function installEnv() {
    const jq = target => shim(target);
    jq.proxy = (fn, ctx) => fn.bind(ctx);
    globalThis.jQuery = jq;
    globalThis.$ = jq;
    if (!globalThis.window) globalThis.window = globalThis;
    // Page registers resize/visibility/online listeners in its constructor.
    for (const t of ['addEventListener', 'removeEventListener', 'dispatchEvent']) {
        if (typeof globalThis.window[t] !== 'function') globalThis.window[t] = () => {};
    }
    globalThis.window.jQuery = jq;
    globalThis.window.domuuid = globalThis.window.domuuid || 0;
    if (!globalThis.document) {
        globalThis.document = {
            getElementById: () => null,
            createRange: () => ({createContextualFragment: h => h}),
            addEventListener: () => {},
            removeEventListener: () => {},
            body: {appendChild: () => {}},
        };
    }
    return jq;
}

/** Fires all handlers bound to a control for a given event name. */
export function emit(control, name, params) {
    shim(control).trigger(name, params);
}

installEnv();
