import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {Control} from '../src/controls/Control.js';
import {Panel} from '../src/controls/Panel.js';

describe('events: bind bookkeeping', () => {
    test('bind records the handler', () => {
        const c = new Control();
        c.bind('custom', () => {});
        assert.ok(Array.isArray(c.binds));
        assert.equal(c.binds.length, 1);
        assert.equal(c.binds[0].name, 'custom');
    });
    test('multiple binds accumulate', () => {
        const c = new Control();
        c.bind('a', () => {});
        c.bind('b', () => {});
        assert.equal(c.binds.length, 2);
    });
    test('bind returns the control for chaining', () => {
        const c = new Control();
        assert.equal(c.bind('x', () => {}), c);
    });
    test('bind accepts an optional data argument', () => {
        const c = new Control();
        c.bind('x', {k: 1}, () => {});
        assert.ok(c.binds[0]);
    });
});

describe('events: triggerEvent', () => {
    test('triggerEvent reaches a handler bound through jQuery', () => {
        const c = new Control();
        let seen = null;
        jQuery(c).bind('ping', (e, v) => { seen = v; });
        c.triggerEvent('ping', 'payload');
        assert.equal(seen, 'payload');
    });
    test('triggering an unbound event is harmless', () => {
        const c = new Control();
        assert.doesNotThrow(() => c.triggerEvent('nothing-here'));
    });
    test('unregisterEvents removes handlers', () => {
        const c = new Control();
        let n = 0;
        jQuery(c).bind('ping', () => n++);
        c.binds = [{name: 'ping'}];
        c.unregisterEvents();
        c.triggerEvent('ping');
        assert.equal(n, 0);
    });
});

describe('events: proxy', () => {
    test('getProxy binds the callback to the control', () => {
        const c = new Control();
        c.marker = 'me';
        const fn = c.getProxy(function () { return this.marker; });
        assert.equal(fn(), 'me');
    });
});

describe('events: dom event types', () => {
    test('getDomEventTypes returns a non-empty list', () => {
        const types = new Control().getDomEventTypes();
        assert.ok(Array.isArray(types) && types.length > 0);
    });
    test('click is a known dom event', () => {
        assert.ok(new Control().getDomEventTypes().includes('click'));
    });
});

describe('events: lifecycle hooks exist and are safe to call', () => {
    for (const hook of ['init', 'createComponents', 'updateDisplay',
                        'onPreInvalidateContents', 'onWindowResize',
                        'onVisibilityChange', 'onOffline', 'onOnline']) {
        test(`${hook}() is callable on a bare control`, () => {
            const p = new Panel();
            assert.doesNotThrow(() => p[hook]());
        });
    }
});
