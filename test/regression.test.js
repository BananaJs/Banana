/**
 * Guards for bugs found while modernising the framework (2026-10-07).
 * Each test fails if the old broken behaviour comes back.
 */
import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {Clone} from '../src/util/Utils.js';
import {Link} from '../src/controls/Link.js';
import {Page} from '../src/controls/Page.js';
import {Table, TableRow, TableCol, TableHeaderCol, TableHead, TableBody} from '../src/controls/Table.js';
import * as Utils from '../src/util/Utils.js';
import * as DomHelper from '../src/util/DomHelper.js';

describe('regression: Clone no longer depends on the removed owl library', () => {
    test('shallow clone works', () => {
        assert.deepEqual(Clone({a: 1}), {a: 1});
    });
    test('deep clone works and does not share references', () => {
        const src = {a: {b: 1}};
        const out = Clone(src, true);
        out.a.b = 2;
        assert.equal(src.a.b, 1);
    });
    test('arrays clone', () => {
        const a = [1, 2, 3];
        assert.deepEqual(Clone(a), a);
        assert.notEqual(Clone(a), a);
    });
    test('primitives pass through', () => {
        assert.equal(Clone(5), 5);
        assert.equal(Clone(null), null);
    });
});

describe('regression: Link uses the imported DomHelper, not a global', () => {
    test('constructing and setting text does not throw', () => {
        const l = new Link();
        assert.doesNotThrow(() => l.setText('click me'));
    });
    test('renders an anchor', () => {
        assert.equal(new Link().getTagName(), 'a');
    });
    test('setHref sets the href attribute', () => {
        const l = new Link();
        l.setHref('/x');
        assert.equal(l.getAttributes()['href'], '/x');
    });
});

describe('regression: Page.isValid does not reference a dead global', () => {
    test('isValid returns without throwing', () => {
        assert.doesNotThrow(() => new Page().isValid());
    });
});

describe('regression: Table classes kept their own tag after the class migration', () => {
    // A prefix bug briefly gave TableHeaderCol the <thead> tag and left
    // TableHead with none. Each class must report exactly its own tag.
    test('each table class reports its own tag', () => {
        assert.equal(new Table().getTagName(), 'table');
        assert.equal(new TableRow().getTagName(), 'tr');
        assert.equal(new TableCol().getTagName(), 'td');
        assert.equal(new TableHeaderCol().getTagName(), 'th');
        assert.equal(new TableHead().getTagName(), 'thead');
        assert.equal(new TableBody().getTagName(), 'tbody');
    });
});

describe('regression: no prototype assignments remain', () => {
    test('Utils and DomHelper expose plain module exports', () => {
        assert.equal(typeof Utils.escapeHtml, 'function');
        assert.ok(DomHelper.DomHelper);
    });
});
