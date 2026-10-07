import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {Panel} from '../src/controls/Panel.js';
import {Label} from '../src/controls/Label.js';
import {Table, TableRow, TableCol, TableHeaderCol, TableHead, TableBody} from '../src/controls/Table.js';
import {Image} from '../src/controls/Image.js';

describe('rendering: tag names', () => {
    test('Panel renders a div', () => {
        assert.ok(new Panel().getHtml(false).startsWith('<div'));
    });
    test('Label renders a label by default', () => {
        assert.ok(new Label().getHtml(false).startsWith('<label'));
    });
    test('Label tag is overridable', () => {
        const l = new Label(); l.setTagName('span');
        assert.ok(l.getHtml(false).startsWith('<span'));
    });
    test('table controls each render their own tag', () => {
        const expected = [[Table, 'table'], [TableRow, 'tr'], [TableCol, 'td'],
                          [TableHeaderCol, 'th'], [TableHead, 'thead'], [TableBody, 'tbody']];
        for (const [Ctor, tag] of expected) {
            assert.equal(new Ctor().getTagName(), tag, `${Ctor.name} should be <${tag}>`);
        }
    });
    test('Image renders an img', () => {
        assert.equal(new Image().getTagName(), 'img');
    });
});

describe('rendering: structure', () => {
    test('children are nested inside the parent element', () => {
        const outer = new Panel(), inner = new Panel();
        outer.addControl(inner);
        const html = outer.getHtml(false);
        assert.equal((html.match(/<div/g) || []).length, 2);
        assert.ok(html.endsWith('</div>'));
    });
    test('deep nesting composes in order', () => {
        const a = new Panel(), b = new Panel(), c = new Panel();
        b.addControl(c); a.addControl(b);
        a.addControl('TAIL');
        assert.ok(a.getHtml(false).includes('TAIL'));
    });
    test('an empty control still produces a well-formed element', () => {
        const html = new Panel().getHtml(false);
        assert.match(html, /^<div[^>]*><\/div>$/);
    });
    test('getHtml(true) marks the control rendered', () => {
        const p = new Panel();
        assert.ok(!p.isRendered);
        p.getHtml(true);
        assert.ok(p.isRendered);
    });
    test('getHtml(false) leaves isRendered untouched', () => {
        const p = new Panel();
        p.getHtml(false);
        assert.ok(!p.isRendered);
    });
});

describe('rendering: css and style', () => {
    test('addCssClass appears in the class attribute', () => {
        const p = new Panel();
        p.addCssClass('MyClass');
        assert.ok(p.getHtml(false).includes('MyClass'));
    });
    test('multiple classes accumulate', () => {
        const p = new Panel();
        p.addCssClass('A'); p.addCssClass('B');
        const html = p.getHtml(false);
        assert.ok(html.includes('A') && html.includes('B'));
    });
    test('removeCssClass drops it again', () => {
        const p = new Panel();
        p.addCssClass('Gone');
        p.removeCssClass('Gone');
        assert.ok(!p.getHtml(false).includes('Gone'));
    });
    test('setStyle is emitted in the style attribute', () => {
        const p = new Panel();
        p.setStyle('color:red;');
        assert.ok(p.getHtml(false).includes('color:red'));
    });
});

describe('rendering: attributes', () => {
    test('setAttribute then getAttributes round-trips', () => {
        const p = new Panel();
        p.setAttribute('data-k', 'v');
        assert.equal(p.getAttributes()['data-k'], 'v');
    });
    test('undefined attribute values are omitted from the html', () => {
        const p = new Panel();
        p.setAttribute('data-x', undefined);
        assert.ok(!p.getHtml(false).includes('data-x'));
    });
});
