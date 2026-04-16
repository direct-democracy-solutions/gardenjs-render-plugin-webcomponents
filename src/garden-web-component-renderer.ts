interface UpdateComponentParams {
  component: CustomElementConstructor;
  decorators: CustomElementConstructor[];
  selectedExample: GardenExample;
  afterRenderHook: () => void;
}

interface GardenExample {
  title: string;
  input: Record<string, string | null>;
}

export function create() {
  const mountPoint = document.getElementById('garden_app');

  function updateComponent({
    component,
    selectedExample,
    decorators,
    afterRenderHook,
  }: UpdateComponentParams) {
    const renderContainer = document.createElement('div');
    const customElements = getCustomElementRegistry();
    const shadowRoot = ensureShadowRoot();
    const node = setUpComponent(component, decorators)
    for (const [k, v] of Object.entries(selectedExample.input)) {
      node.setAttribute(k, v);
    }
    shadowRoot.appendChild(node);
    afterRenderHook();
  }

  function ensureShadowRoot() {
    if (mountPoint.shadowRoot === null) {
      attachShadow(mountPoint, {
        mode: 'open',
        customElementRegistry: customElements,
      });
    }
    return mountPoint.shadowRoot;
  }

  return {
    updateComponent,
    destroy: () => {
      mountPoint.shadowRoot.innerHTML = '';
    },
  };
}

function findDefaultSlot(element: HTMLElement) {
  const slots = element.querySelectorAll('slot');
  for (const slot of slots) {
    if (slot.getAttribute('name') === null) {
      return slot;
    }
  }
  return null;
}

function getCustomElementRegistry() {
  try {
    return new CustomElementRegistry();
  } catch {
    return window.customElements;
  }
}

function setUpComponent(component: HTMLElement, decorators: CustomElementConstructor[]) {
  const elementName = ensureRegistered(customElements, component);
  const node = document.createElement(elementName);
  return decorate(node, decorators);
}

/** See if the component is registered and register it if not */
function ensureRegistered(
  customElements: CustomElementRegistry,
  component: CustomElementConstructor,
) {
  let name: string | null;

  if (typeof customElements.getName === 'function') {
    // All except Safari
    name = customElements.getName(component);
    if (typeof name === 'string') {
      return name;
    }
  }

  // Safari
  name = `garden-example-${randomUUID()}`;
  try {
    customElements.define(name, component);
  } catch (e) {
    throw new TypeError(
      // TODO this is completely unintelligible even to its author
      `The component is registered but I couldn't determine the
      appropriate tag name because your browser does not support
      CustomElementRegistry.getName(). You can try testing in a better
      browser, register the component in a scoped namespace, or do not
      register it inside your component code at all (the Gardenjs web
      component rendering plugin will register it for you in Garden, and
      you would have to register it in your app with
      window.customElements.define).`,
      { cause: e },
    );
  }

  return name;
}

function decorate(node: HTMLComponent, decorators: CustomElementConstructor[]) {
  let decoratedNode = node;
  for (const decorator of decorators) {
    console.log('appending a decorator');
    decoratedNode = initDecorator(decorator, decoratedNode);
  }
  return decoratedNode;
}

function initDecorator(decorator: CustomElementConstructor, slotContent: HTMLElement) {
  const tagName = customElements.getName(decorator); // TODO make it work in Safari
  const decNode = document.createElement(tagName);
  // TODO default slot, or enforce just one slot and allow to have name?
  const defaultSlot = findDefaultSlot(decNode);
  if (defaultSlot === null) {
    throw new Error(`Decorator ${tagName} has no default slot`);
  }
  defaultSlot.appendChild(slotContent);
  return decNode;
}

// Indirect wrapper for HTMLElement.prototype.attachShadow, so we
// can pass the customElementRegistry parameter even though it's not
// supported in Firefox.
function attachShadow(renderContainer: HTMLElement, options?: ShadowRootInit) {
  const customElements =
    options?.customElementRegistry ?? window.customElements;
  if (customElements === window.customElements) {
    return renderContainer.attachShadow({
      mode: options?.mode,
    });
  } else {
    return renderContainer.attachShadow({
      mode: options?.mode,
      customElementRegistry: new CustomElementRegistry(),
    });
  }
}

function randomUUID(): string {
  if (typeof crypto?.randomUUID === 'function') {
    // Widely supported since March 2022
    return crypto.randomUUID();
  }

  // Fall back to manual construction
  const b: Uint8Array = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant bits
  return `${hex(b.slice(0, 4))}-${hex(b.slice(4, 5))}-${hex(b.slice(6, 7))}-${hex(b.slice(8, 9))}-${hex(b.slice(9, 15))}`;
}

declare global {
  // New functions shipped in 2025, type definitions landing in TS 6.0
  // fromHex and fromBase64 also exist as static functions on
  // Uint8Array, but are not needed here
  interface Uint8Array {
    toHex?: () => string;
    toBase64?: () => string;
  }
}

function hex(a: Uint8Array): string {
  if (typeof a.toHex === 'function') {
    // Widely supported since September 2025
    return a.toHex();
  }
  return Buffer.from(a).toString('hex');
}

