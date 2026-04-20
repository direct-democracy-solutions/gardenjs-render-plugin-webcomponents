# Web Components Renderer for GardenJS

Plugin for rendering vanilla Web components in [Gardenjs](https://gardenjs.org/).

:heart: :evergreen_tree: Made with love in Portland, Oregon. :evergreen_tree: :heart:

## Development Status

For detailed information on each item, check out [dev-notes.md].

:white_check_mark: Mount standalone custom elements in GardenJS  
:white_check_mark: Edit element attributes with GardenJS input controls  
:white_check_mark: First-class support for TypeScript  
:white_check_mark: ESM-first  
:x: Easily embed components with GardenJS [decorators](https://gardenjs.org/docs/get-started/decorators)  
:x: Mount customized built-in elements in GardenJS  
:x: Easily edit element properties with GardenJS input controls  
:x: Listen to events from custom elements ([On the GardenJS roadmap](https://github.com/gardenjs/gardenjs/issues/32#issuecomment-4256064025); workaround available)  
:x: Inject content into default slot from example ([workaround available](https://gardenjs.org/docs/get-started/examples))  
:x: Inject content into named slot from example ([workaround available](https://gardenjs.org/docs/get-started/examples))  
:x: CJS export
:x: 0% test coverage

## Getting Started

```
npm i -D gardenjs @direct-democracy-solutions/gardenjs-render-plugin-webcomponents
```

Follow the GardenJS [Getting Started](https://gardenjs.org/docs/get-started/install)
guide. Add the Web Component renderer `garden.config.ts`:

```javascript
import WebComponentRendererBuilder from '@direct-democracy-solutions/gardenjs-render-plugin-webcomponents';

export default {
  renderers: {
    "[tj]sx": ReactRendererBuilder,
  },
};
```

Make sure your component is the default export from the component file:
```javascript
const template = document.createElement('template');
template.innerHTML = `<p>Hello World!</p>`;

export default class MyWebComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

// Optional. If omitted, the renderer will generate a unique name:
customElements.define('hotkey-prompt', HotkeyPrompt);
```

Then reference it from your DAS as normal.

## Contributing

This project comes with an example component to exercise the renderer.
It shows an image and a text prompt, and emits a custom event whenever a
keydown event reaches the top of the document tree.

To see the demo:
```
npx garden
```

Be sure to include any new changes in the [CHANGELOG](CHANGELOG.md).