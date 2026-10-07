import './helpers/env.js';
import {test, describe} from 'node:test';
import assert from 'node:assert/strict';
import {DataSet} from '../src/controls/DataSet.js';

describe('DataSet: data', () => {
    test('setData / getData round-trip', () => {
        const ds = new DataSet();
        ds.setData({a: 1});
        assert.deepEqual(ds.getData(), {a: 1});
    });
    test('setData merges rather than replacing the reference', () => {
        const ds = new DataSet();
        ds.setData({a: 1});
        ds.setData({a: 2});
        assert.equal(ds.getData().a, 2);
    });
    test('clear resets the set', () => {
        const ds = new DataSet();
        ds.setData({a: 1});
        assert.doesNotThrow(() => ds.clear());
    });
    test('getIsChanged starts falsy', () => {
        assert.ok(!new DataSet().getIsChanged());
    });
});

describe('DataSet: paths', () => {
    test('getDataByPath resolves a nested value', () => {
        const ds = new DataSet();
        ds.setData({user: {name: 'gillis'}});
        assert.equal(ds.getDataByPath('user.name'), 'gillis');
    });
    test('setDataByPath writes a nested value', () => {
        const ds = new DataSet();
        ds.setData({user: {name: 'x'}});
        ds.setDataByPath('y', 'user.name');
        assert.equal(ds.getDataByPath('user.name'), 'y');
    });
    test('setDataKey / dataKey is retained', () => {
        const ds = new DataSet();
        ds.setDataKey('id');
        assert.equal(ds.dataKey, 'id');
    });
});

describe('DataSet: it no longer depends on dead globals', () => {
    // Before 2026-10-07 setData() called Banana.Util.ObjectsAreEqual and
    // Banana.Util.CopyTo, globals removed in the ES-module rewrite, so any
    // second setData threw ReferenceError. This is the regression guard.
    test('a second setData does not throw', () => {
        const ds = new DataSet();
        ds.setData({a: 1});
        assert.doesNotThrow(() => ds.setData({a: 2}));
    });
});
