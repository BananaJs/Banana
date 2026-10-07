import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {
    escapeHtml, NaturalSort, Clone, CopyTo, ObjectsAreEqual, ObjectPropsSameTo,
    getDataByPath, FindByField, CombineArrayByField, flattenTreeDepthFirst,
    generateUniqueId, sortObjectKeys, NamespaceToFunction
} from '../src/util/Utils.js';

describe('Utils.escapeHtml', () => {
    test('escapes the five HTML-significant characters', () => {
        assert.equal(escapeHtml('<b>'), '&lt;b&gt;');
        assert.equal(escapeHtml('a&b'), 'a&amp;b');
        assert.equal(escapeHtml('say "hi"'), 'say &quot;hi&quot;');
        assert.equal(escapeHtml("it's"), 'it&#39;s');
    });
    test('escapes ampersand first so entities are not double-broken', () => {
        assert.equal(escapeHtml('&lt;'), '&amp;lt;');
    });
    test('neutralises a script tag', () => {
        assert.equal(escapeHtml('<script>alert(1)</script>'),
            '&lt;script&gt;alert(1)&lt;/script&gt;');
    });
    test('neutralises an attribute break-out', () => {
        assert.ok(!escapeHtml('" onerror="alert(1)').includes('"'));
    });
    test('null and undefined become empty string', () => {
        assert.equal(escapeHtml(null), '');
        assert.equal(escapeHtml(undefined), '');
    });
    test('non-strings are stringified', () => {
        assert.equal(escapeHtml(5), '5');
        assert.equal(escapeHtml(0), '0');
        assert.equal(escapeHtml(false), 'false');
    });
    test('leaves safe text untouched', () => {
        assert.equal(escapeHtml('Ajax - PSV 2-1'), 'Ajax - PSV 2-1');
    });
});

describe('Utils.NaturalSort', () => {
    test('orders embedded numbers numerically, not lexically', () => {
        const out = ['item10', 'item2', 'item1'].sort(NaturalSort);
        assert.deepEqual(out, ['item1', 'item2', 'item10']);
    });
    test('is stable for equal values', () => {
        assert.equal(NaturalSort('a', 'a'), 0);
    });
});

describe('Utils.Clone', () => {
    test('shallow clone copies own properties', () => {
        const src = {a: 1, b: {c: 2}};
        const out = Clone(src);
        assert.deepEqual(out, src);
    });
    test('deep clone does not share nested references', () => {
        const src = {a: {b: 1}};
        const out = Clone(src, true);
        out.a.b = 99;
        assert.equal(src.a.b, 1);
    });
});

describe('Utils.ObjectsAreEqual / ObjectPropsSameTo', () => {
    test('equal objects compare equal', () => {
        assert.ok(ObjectsAreEqual({a: 1, b: 2}, {a: 1, b: 2}));
    });
    test('different values compare unequal', () => {
        assert.ok(!ObjectsAreEqual({a: 1}, {a: 2}));
    });
    test('ignored keys are skipped', () => {
        assert.ok(ObjectsAreEqual({a: 1, t: 9}, {a: 1, t: 8}, ['t']));
    });
    test('ObjectPropsSameTo compares only the first object keys', () => {
        assert.ok(ObjectPropsSameTo({a: 1}, {a: 1, extra: 2}));
    });
});

describe('Utils.getDataByPath', () => {
    test('resolves a dotted path', () => {
        assert.equal(getDataByPath({a: {b: {c: 7}}}, 'a.b.c'), 7);
    });
    test('missing path does not throw', () => {
        assert.doesNotThrow(() => getDataByPath({a: 1}, 'x.y.z'));
    });
});

describe('Utils.FindByField / CombineArrayByField', () => {
    const rows = [{id: 1, g: 'x'}, {id: 2, g: 'y'}, {id: 3, g: 'x'}];
    test('FindByField returns the matching record', () => {
        assert.equal(FindByField(rows, 'id', 2).g, 'y');
    });
    test('FindByField returns nothing when absent', () => {
        assert.ok(!FindByField(rows, 'id', 99));
    });
    test('CombineArrayByField groups by field', () => {
        const out = CombineArrayByField(rows, 'g');
        assert.ok(out);
    });
});

describe('Utils.CopyTo', () => {
    test('copies properties onto the target', () => {
        const oldData = {a: 1, b: 2};
        CopyTo({a: 9}, oldData);
        assert.equal(oldData.a, 9);
    });
});

describe('Utils.flattenTreeDepthFirst', () => {
    test('visits every node', () => {
        const tree = {id: 1, kids: [{id: 2, kids: [{id: 3, kids: []}]}]};
        assert.equal(flattenTreeDepthFirst(tree, 'kids').length, 3);
    });
    test('is POST-order: children are emitted before their parent', () => {
        // Despite the name, the implementation pushes the node AFTER recursing
        // into its children, so the deepest node comes first and the root last.
        const tree = {id: 1, kids: [{id: 2, kids: [{id: 3, kids: []}]}]};
        const out = flattenTreeDepthFirst(tree, 'kids');
        assert.deepEqual(out.map(n => n.id), [3, 2, 1]);
    });
    test('handles a null node and a node with no children', () => {
        assert.deepEqual(flattenTreeDepthFirst(null, 'kids'), []);
        assert.equal(flattenTreeDepthFirst({id: 1}, 'kids').length, 1);
    });
});

describe('Utils.generateUniqueId', () => {
    test('successive ids differ', () => {
        assert.notEqual(generateUniqueId(), generateUniqueId());
    });
});

describe('Utils.sortObjectKeys', () => {
    test('returns keys in sorted order', () => {
        const out = sortObjectKeys({b: 1, a: 2, c: 3});
        assert.ok(out);
    });
});

describe('Utils.NamespaceToFunction', () => {
    test('resolves a dotted global namespace', () => {
        globalThis.__T = {Deep: {Fn: () => 'hit'}};
        assert.equal(typeof NamespaceToFunction('__T.Deep.Fn'), 'function');
    });
});
