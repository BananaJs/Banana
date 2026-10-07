import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {Control} from '../src/controls/Control.js';
import {Panel} from '../src/controls/Panel.js';

describe('control tree: composition', () => {
    test('addControl appends in order', () => {
        const p = new Panel();
        const a = new Panel(), b = new Panel();
        p.addControl(a); p.addControl(b);
        assert.deepEqual(p.getControls(), [a, b]);
    });
    test('addControlAt inserts at an index', () => {
        const p = new Panel();
        const a = new Panel(), b = new Panel(), c = new Panel();
        p.addControl(a); p.addControl(b);
        p.addControlAt(c, 1);
        assert.equal(p.getControls()[1], c);
    });
    test('addControlAt past the end appends', () => {
        const p = new Panel();
        const a = new Panel(), b = new Panel();
        p.addControl(a);
        p.addControlAt(b, 99);
        assert.ok(p.getControls().includes(b));
    });
    test('Control.clear() empties the children', () => {
        const c = new Control();
        c.addControl(new Control());
        c.clear();
        assert.equal(c.getControls().length, 0);
    });
    test('UiControl.clear() is a NO-OP when the control has no page', () => {
        // UiControl overrides clear() and only empties when getPage() returns a
        // page, so calling it on a detached control silently does nothing.
        // Documented here so the behaviour is not mistaken for a bug.
        const p = new Panel();
        p.addControl(new Panel());
        p.clear();
        assert.equal(p.getControls().length, 1);
    });
    test('plain strings may be children alongside controls', () => {
        const p = new Panel();
        p.addControl('text');
        p.addControl(new Panel());
        assert.equal(p.getControls().length, 2);
    });
});

describe('control tree: identity and lookup', () => {
    test('setId / getId round-trip', () => {
        const c = new Control();
        c.setId('myid');
        assert.equal(c.getId(), 'myid');
    });
    test('findControl finds itself', () => {
        const c = new Control();
        c.setId('root');
        assert.equal(c.findControl('root'), c);
    });
    test('findControl finds a nested descendant', () => {
        const root = new Panel(), mid = new Panel(), leaf = new Panel();
        leaf.setId('leaf');
        mid.addControl(leaf); root.addControl(mid);
        assert.equal(root.findControl('leaf'), leaf);
    });
    test('findControl returns nothing for an unknown id', () => {
        const root = new Panel();
        assert.ok(!root.findControl('nope'));
    });
    test('every control gets a unique generated id', () => {
        const a = new Panel(), b = new Panel();
        assert.ok(a.getId() && b.getId());
        assert.notEqual(a.getId(), b.getId());
    });
    test('clientId is only assigned once a page initialises the control', () => {
        // getClientId() is undefined until Page.initializeControl runs.
        assert.equal(new Panel().getClientId(), undefined);
    });
});

describe('control tree: traversal', () => {
    test('applyToChildren visits direct children', () => {
        const p = new Panel();
        p.addControl(new Panel()); p.addControl(new Panel());
        let n = 0;
        p.applyToChildren(() => n++);
        assert.equal(n, 2);
    });
    test('setParent / getParent round-trip', () => {
        const parent = new Panel(), child = new Panel();
        child.setParent(parent);
        assert.equal(child.getParent(), parent);
    });
});
