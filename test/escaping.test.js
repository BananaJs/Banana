import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {Panel} from '../src/controls/Panel.js';
import {Label} from '../src/controls/Label.js';

describe('escaping: attribute values', () => {
    test('a quote in an attribute cannot break out', () => {
        const p = new Panel();
        p.setAttribute('title', '" onerror="alert(1)');
        const html = p.getHtml(false);
        assert.ok(html.includes('&quot;'), 'quote should be encoded');
        assert.ok(!/title="" onerror=/.test(html), 'must not break out of the attribute');
    });
    test('angle brackets in an attribute are encoded', () => {
        const p = new Panel();
        p.setAttribute('data-x', '<script>');
        assert.ok(p.getHtml(false).includes('&lt;script&gt;'));
    });
    test('ordinary attribute values survive unchanged', () => {
        const p = new Panel();
        p.setAttribute('data-match', 'match-123');
        assert.ok(p.getHtml(false).includes('data-match="match-123"'));
    });
    test('id is framework-managed and cannot be set via setAttribute', () => {
        // getAttributes() always overwrites id with getClientId().
        const p = new Panel();
        p.setAttribute('id', 'mine');
        assert.ok(!p.getHtml(false).includes('id="mine"'));
    });
});

describe('escaping: Label data', () => {
    test('markup passed as DATA is escaped', () => {
        const l = new Label();
        l.setData('<img src=x onerror=alert(1)>');
        const html = l.getHtml(false);
        assert.ok(html.includes('&lt;img'), 'should be escaped');
        assert.ok(!html.includes('<img'), 'raw tag must not reach the DOM');
    });
    test('getData() still returns the original unescaped value', () => {
        const l = new Label();
        l.setData('<b>x</b>');
        assert.equal(l.getData(), '<b>x</b>');
    });
    test('plain text is unaffected', () => {
        const l = new Label();
        l.setData('Ajax - PSV');
        assert.ok(l.getHtml(false).includes('Ajax - PSV'));
    });
});

describe('escaping: addControl stays a raw HTML channel', () => {
    // The application relies on this in ~146 places; escaping here would break
    // it. Markup goes through addControl, data goes through setData.
    test('a raw HTML string child is NOT escaped', () => {
        const p = new Panel();
        p.addControl('<b>bold</b>');
        assert.ok(p.getHtml(false).includes('<b>bold</b>'));
    });
    test('nested controls still compose', () => {
        const outer = new Panel();
        const inner = new Panel();
        inner.addControl('inner-text');
        outer.addControl(inner);
        const html = outer.getHtml(false);
        assert.ok(html.includes('inner-text'));
        assert.equal((html.match(/<div/g) || []).length, 2);
    });
});
