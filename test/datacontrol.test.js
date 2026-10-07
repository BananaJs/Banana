import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {DataControl} from '../src/controls/DataControl.js';
import {Label} from '../src/controls/Label.js';
import {Checkbox} from '../src/controls/Checkbox.js';
import {TextBox} from '../src/controls/TextBox.js';
import {InputControl} from '../src/controls/InputControl.js';

describe('DataControl: data round-trip', () => {
    test('setData then getData returns the value', () => {
        const d = new DataControl();
        d.setData('hello');
        assert.equal(d.getData(), 'hello');
    });
    test('objects are stored by reference', () => {
        const d = new DataControl();
        const obj = {a: 1};
        d.setData(obj);
        assert.equal(d.getData(), obj);
    });
    test('falsy values are preserved', () => {
        const d = new DataControl();
        d.setData(0);
        assert.equal(d.getData(), 0);
        d.setData('');
        assert.equal(d.getData(), '');
        d.setData(false);
        assert.equal(d.getData(), false);
    });
    test('isChanged starts false', () => {
        assert.equal(new DataControl().isChanged, false);
    });
});

describe('DataControl: dataChanged event', () => {
    test('setData triggers without throwing when nothing is bound', () => {
        const d = new DataControl();
        assert.doesNotThrow(() => d.setData('x'));
    });
    test('ignoreEvent suppresses the event', () => {
        const d = new DataControl();
        let fired = false;
        d.bind('dataChanged', () => { fired = true; });
        d.setData('x', true);
        assert.equal(fired, false);
    });
});

describe('Label', () => {
    test('renders its data as text content', () => {
        const l = new Label();
        l.setData('Eredivisie');
        assert.ok(l.getHtml(false).includes('Eredivisie'));
    });
    test('numeric data renders', () => {
        const l = new Label();
        l.setData(42);
        assert.ok(l.getHtml(false).includes('42'));
    });
    test('null data renders empty, not the string "null"', () => {
        const l = new Label();
        l.setData(null);
        assert.ok(!l.getHtml(false).includes('null'));
    });
    test('setForControl sets the for attribute', () => {
        const l = new Label(), target = new Label();
        target.clientId = 'cid1';
        l.setForControl(target);
        assert.equal(l.getAttributes()['for'], 'cid1');
    });
});

describe('Checkbox', () => {
    test('renders an input element', () => {
        assert.equal(new Checkbox().getTagName(), 'input');
    });
    test('has type=checkbox', () => {
        assert.equal(new Checkbox().getAttributes()['type'], 'checkbox');
    });
    test('defaults to false', () => {
        assert.equal(new Checkbox().getData(), false);
    });
    test('accepts a boolean', () => {
        const c = new Checkbox();
        c.setData(true);
        assert.equal(c.getData(), true);
    });
});

describe('InputControl / TextBox', () => {
    test('TextBox renders an input', () => {
        assert.equal(new TextBox().getTagName(), 'input');
    });
    test('setName / getName round-trip', () => {
        const i = new InputControl();
        i.setName('field');
        assert.equal(i.getName(), 'field');
    });
    test('setValue / getValue round-trip', () => {
        const i = new InputControl();
        i.setValue('v');
        assert.equal(i.getValue(), 'v');
    });
    test('setName does NOT emit a name attribute', () => {
        // setName only sets this.name; the rendered <input> therefore carries
        // no name attribute. Fine for this framework (it never relies on native
        // form submission) but worth knowing if a real <form> post is ever used.
        const i = new InputControl();
        i.setName('myfield');
        assert.equal(i.getAttributes()['name'], undefined);
        assert.ok(!i.getHtml(false).includes('name="myfield"'));
    });
});
