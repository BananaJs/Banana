# BananaFramework

A small, component-driven JavaScript UI framework. A control tree composes an
HTML **string**, which is handed to the browser in one native insert. There is
no virtual DOM and no diffing — what a control renders is exactly what you can
read in `getHtml()`.

```
25 source files · ~4,100 lines · no build step · no runtime dependencies except jQuery
```

## Why it is shaped this way

- **Predictable.** One rendering concept: build a string, insert it. No
  reconciler, no hook ordering rules, no effect scheduling.
- **Small enough to hold in your head** (or in a model's context window).
- **Explicit lifecycle.** `init() → createComponents() → updateDisplay()`.
- **Controls map 1:1 to DOM tags.** A `Panel` is a `<div>`, a `TableRow` is a `<tr>`.
- **Fast by construction.** Rendering uses `insertAdjacentHTML` /
  `createContextualFragment`, so the browser parses once.

## Usage

```js
import {Panel} from './src/controls/Panel.js';
import {Label} from './src/controls/Label.js';

const panel = new Panel();
panel.addCssClass('MyPanel');

const label = new Label();
label.setData('Ajax - PSV');          // data: escaped automatically
panel.addControl(label);
panel.addControl('<hr/>');            // markup: inserted raw, by design

panel.getHtml();                      // '<div ...><label ...>Ajax - PSV</label><hr/></div>'
```

## Escaping: data vs markup

Two channels, deliberately different:

| call | treatment | use for |
|---|---|---|
| `control.setData(value)` | **escaped** | anything from a feed, an API or a user |
| `control.addControl('<b>x</b>')` | **raw** | markup you wrote yourself |

Attribute values set via `setAttribute()` are always escaped, so a value
containing `"` cannot break out of the attribute.

## Layout

```
src/
  core/Banana.js            Application: page loading, URL handling, lifecycle
  controls/
    Control.js              base: tree, ids, events
    UiControl.js            base for anything rendered: attributes, css, html
    Panel.js Label.js …     concrete controls
    listcontrols/           ListControl, Dropdown, Datagrid + item renders
  util/
    DomHelper.js            the only place that touches the DOM
    Utils.js                pure helpers (escapeHtml, Clone, sorting, paths …)
    UrlManager.js
```

## Tests

```bash
npm test
```

120 tests across 39 suites, using the Node built-in test runner. They run in
plain Node with no browser and no dependencies — the framework composes
strings, so most of it is testable directly. `test/helpers/env.js` provides a
minimal jQuery/window stub for the few paths that need one.

Covered: utilities, HTML escaping, control-tree composition and lookup,
rendering and attributes, data controls, DataSet, events and lifecycle hooks,
plus regression guards for previously broken behaviour.

## License

MIT
