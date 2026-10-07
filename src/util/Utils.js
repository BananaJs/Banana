/**
 * @author Gillis Haasnoot <gillis.haasnoot@gmail.com>
 * @package Banana.Util
 * @summary Various utils
 */

/**
 @class Banana.Util
 @name Banana.Util
 */

// Precompile regexes once
const RE_NUMBER     = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|[0-9]+)/gi;
const RE_TRIM       = /(^\s+|\s+$)/g;
const RE_DATE       = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
const RE_HEX        = /^0x[0-9a-f]+$/i;
const RE_LEADING0   = /^0/;

/**
 * Natural sort comparator
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export const NaturalSort = (a, b) => {
    const normalize = s =>
        NaturalSort.insensitive
            ? String(s).toLowerCase()
            : String(s);

    const x = normalize(a).replace(RE_TRIM, '') || '';
    const y = normalize(b).replace(RE_TRIM, '') || '';

    const splitTokens = str =>
        str
            .replace(RE_NUMBER, '\0$1\0')
            .replace(/^\0|\0$/g, '')
            .split('\0');

    const xN = splitTokens(x);
    const yN = splitTokens(y);

    // detect hex or date
    const xD = RE_HEX.test(x)
        ? parseInt(x, 16)
        : (xN.length > 1 && RE_DATE.test(x) ? Date.parse(x) : null);

    const yD = RE_HEX.test(y)
        ? parseInt(y, 16)
        : (yN.length > 1 && RE_DATE.test(y) ? Date.parse(y) : null);

    if (xD != null || yD != null) {
        if (xD === yD) return 0;
        if (xD == null)   return 1;
        if (yD == null)   return -1;
        return xD < yD ? -1 : 1;
    }

    const maxLen = Math.max(xN.length, yN.length);
    for (let i = 0; i < maxLen; i++) {
        const xi = xN[i] ?? '';
        const yi = yN[i] ?? '';

        const xVal = (!RE_LEADING0.test(xi) && !isNaN(xi)) ? parseFloat(xi) : xi;
        const yVal = (!RE_LEADING0.test(yi) && !isNaN(yi)) ? parseFloat(yi) : yi;

        const xIsNum = typeof xVal === 'number';
        const yIsNum = typeof yVal === 'number';
        if (xIsNum !== yIsNum) return xIsNum ? -1 : 1;

        if (xVal < yVal) return -1;
        if (xVal > yVal) return 1;
    }

    return 0;
};

/** @type {Object<string, Function>} */
const nameSpaceCache = {};

/**
 * Convert namespace string to function reference
 * @param {string} ns
 * @returns {Function|null}
 */
export const NamespaceToFunction = ns => {
    if (nameSpaceCache[ns]) return nameSpaceCache[ns];
    const fn = ns.split('.').reduce((ctx, part) => ctx?.[part], window);
    return nameSpaceCache[ns] = typeof fn === 'function' ? fn : null;
};

/**
 * Get nested data by dot-path
 * @param {object} data
 * @param {string} path
 * @returns {*}
 */
export const getDataByPath = (data, path) =>
    path.split('.').reduce((o, key) => o?.[key] ?? null, data);

/**
 * Clone data via OWL
 * @param {*} data
 * @param {boolean} deep
 * @returns {*}
 */
/**
 * Clones a value.
 *
 * 2026-10-07: this used to call `owl.deepCopy` / `owl.clone` - a third-party
 * library that lived in the old framework/3rdparty folder and was dropped in
 * the ES-module rewrite. Both branches therefore threw
 * "ReferenceError: owl is not defined". Reimplemented natively.
 *
 * @param {*} data
 * @param {boolean} [deep] deep clone instead of a shallow copy
 * @returns {*}
 */
export const Clone = (data, deep) => {
    if (data === null || typeof data !== 'object') return data;
    if (!deep) return Array.isArray(data) ? data.slice() : {...data};
    if (typeof structuredClone === 'function') {
        try { return structuredClone(data); } catch { /* fall through */ }
    }
    return JSON.parse(JSON.stringify(data));
};

/**
 * Find object in array by field
 * @param {Array} data
 * @param {string} field
 * @param {*} value
 * @returns {object|null}
 */
export const FindByField = (data, field, value) =>
    data.find(item => item[field] === value) || null;

/**
 * Group array items by a field
 * @param {Array} arr
 * @param {string} field
 * @returns {Array<Array>}
 */
export const CombineArrayByField = (arr, field) => {
    if (!Array.isArray(arr)) {
        log.error('CombineArrayByField - List should be an Array');
        return arr;
    }
    if (!field) {
        log.error('CombineArrayByField - No field given');
        return arr;
    }
    const grouped = arr.reduce((map, item) => {
        const key = item[field];
        (map.get(key) || map.set(key, []).get(key)).push(item);
        return map;
    }, new Map());
    return Array.from(grouped.values());
};

/**
 * Recursively merge newdata into olddata by identifier
 * @param {*} newdata
 * @param {*} olddata
 * @param {string} identifier
 * @param {{ref: any, prop: string|number}} [refObj]
 * @returns {*}
 */
export const CopyTo = (newdata, olddata, identifier, refObj) => {
    if (Array.isArray(newdata) && Array.isArray(olddata)) {
        const backup = olddata.slice();
        olddata.length = 0;
        newdata.forEach((item, idx) => {
            if (item && typeof item === 'object') {
                const id = item[identifier];
                const match = id != null && backup.find(b => b[identifier] === id);
                if (match) {
                    olddata.push(match);
                    CopyTo(item, match, identifier, { ref: olddata, prop: idx });
                } else {
                    olddata.push(item);
                }
            } else {
                olddata[idx] = item;
            }
        });
    } else if (Array.isArray(newdata)) {
        if (!refObj) throw new Error('Missing reference for array assignment');
        refObj.ref[refObj.prop] = newdata;
    } else if (newdata && typeof newdata === 'object') {
        const toDelete = new Set(Object.keys(olddata));
        for (const key in newdata) {
            if (typeof newdata[key] === 'function') continue;
            toDelete.delete(key);
            if (newdata[key] && typeof newdata[key] === 'object' && olddata[key]) {
                CopyTo(newdata[key], olddata[key], identifier, { ref: olddata, prop: key });
            } else {
                olddata[key] = newdata[key];
            }
        }
        toDelete.forEach(k => delete olddata[k]);
    }
    return olddata;
};

/**
 * Deep equality check (ignoring functions and specified keys)
 * @param {object} a
 * @param {object} b
 * @param {Array<string>} [ignores=[]]
 * @returns {boolean}
 */
export const ObjectsAreEqual = (a, b, ignores = []) =>
    ObjectPropsSameTo(a, b, ignores) && ObjectPropsSameTo(b, a, ignores);

/**
 * Check if all props of a appear in b
 * @param {object} a
 * @param {object} b
 * @param {Array<string>} [ignores=[]]
 * @returns {boolean}
 */
export const ObjectPropsSameTo = (a, b, ignores = []) => {
    if (!a || !b) return false;
    const ignoreSet = new Set(ignores);
    for (const key in a) {
        if (typeof a[key] === 'function' || ignoreSet.has(key)) continue;
        const av = a[key], bv = b[key];
        const bothObj = av && typeof av === 'object' && bv && typeof bv === 'object';
        if (bothObj) {
            if (!ObjectsAreEqual(av, bv, ignores)) return false;
        } else if (av !== bv) {
            return false;
        }
    }
    return true;
};

/**
 * Return a new object whose keys are sorted
 * @param {object} obj
 * @param {Function} [sortFunc]
 * @returns {object}
 */
export const sortObjectKeys = (obj, sortFunc) => {
    const keys = Object.keys(obj).sort(sortFunc);
    return Object.fromEntries(keys.map(k => [k, obj[k]]));
};

/** @returns {string} */
export const generateUniqueId = () =>
    (((1 + Math.random()) * 0x1_0000_0000) | 0).toString(16).substring(1);

/**
 * Flatten a tree depth-first
 * @param {object} node
 * @param {string} childKey
 * @param {Array} [out=[]]
 * @returns {Array}
 */
export const flattenTreeDepthFirst = (node, childKey, out = []) => {
    if (!node) return out;
    (node[childKey] || []).forEach(child =>
        flattenTreeDepthFirst(child, childKey, out)
    );
    out.push(node);
    return out;
};

/**
 * Async array iterator in chunks
 * @param {Array} array
 * @param {Function} cb
 * @param {number} [timeout=0]
 * @param {Function} [completeCb]
 * @param {Function} [completeChunkCb]
 */
export const arrayInteratorAsync = (
    array,
    cb,
    timeout = 0,
    completeCb,
    completeChunkCb
) => {
    if (typeof cb !== 'function') {
        log.error('Async iterator requires a callback');
        return;
    }
    const chunkSize = Math.max(1, Math.floor(array.length / 10));
    let idx = 0;

    const loop = () => {
        if (idx >= array.length) {
            completeCb?.();
            return;
        }
        const end = Math.min(idx + chunkSize, array.length);
        for (; idx < end; idx++) cb(array[idx], idx);
        completeChunkCb?.();
        setTimeout(loop, timeout);
    };

    loop();
};

/**
 * Escapes a value for safe interpolation into HTML text or a double-quoted
 * attribute. Added 2026-10-07: control HTML is assembled by string
 * concatenation in UiControl.getHtml(), which had no escaping, while the
 * post-render update path (DomHelper.setTextData) already used textContent.
 * The same value was therefore unescaped on first render but escaped on
 * re-render. This closes that gap.
 *
 * Note: addControl(string) remains a deliberate RAW HTML channel - the
 * application relies on it for markup. Escaping is applied where *data*
 * enters a control (see DataControl/Label setData) and to attribute values.
 *
 * @param {*} value
 * @returns {string}
 */
export const escapeHtml = value => {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};
