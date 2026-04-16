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
  const mountPoint = document.getElementById('garden_app') as HTMLElement;
  if (mountPoint === null) {
    throw new Error('Expected mount point with id=garden_app')
  }

  const shadowRoot = ensureShadowRoot();

  function ensureShadowRoot() {
    return mountPoint.shadowRoot ?? attachShadow(mountPoint, {
      mode: 'open',
      customElementRegistry: getCustomElementRegistry(),
    });
  }

  function setUpComponent(component: CustomElementConstructor, decorators: CustomElementConstructor[]) {
    const elementName = ensureRegistered(customElements, component);
    const node = document.createElement(elementName);
    return decorate(node, decorators);
  }

  function updateComponent({
                             component,
                             selectedExample,
                             decorators,
                             afterRenderHook,
                           }: UpdateComponentParams) {
    const shadowRoot = ensureShadowRoot();
    const node = setUpComponent(component, decorators)
    for (const [k, v] of Object.entries(selectedExample.input)) {
      if (v === null) {
        node.removeAttribute(k);
      } else {
        node.setAttribute(k, v);
      }
    }
    shadowRoot.appendChild(node);
    afterRenderHook();
  }

  return {
    updateComponent,
    destroy: () => {
      shadowRoot.innerHTML = '';
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
      {cause: e},
    );
  }

  return name;
}

function decorate(node: HTMLElement, decorators: CustomElementConstructor[]) {
  let decoratedNode = node;
  for (const decorator of decorators) {
    console.log('appending a decorator');
    decoratedNode = initDecorator(decorator, decoratedNode);
  }
  return decoratedNode;
}

function initDecorator(decorator: CustomElementConstructor, slotContent: HTMLElement) {
  const customElements = getCustomElementRegistry();
  const tagName = ensureRegistered(customElements, decorator);
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
      mode: options?.mode ?? 'open',
    });
  } else {
    return renderContainer.attachShadow({
      mode: options?.mode ?? 'open',
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
  return hexPolyfill(a);
}


/** Hex polyfill (BSD 3-clause)
 * Copyright 2020 Michael Fabian 'Xaymar' Dirks <info@xaymar.com>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 * OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * */
function hexPolyfill(buffer: Uint8Array) {
  return Array.prototype.map.call(buffer, (x =>
    ('00' + x.toString(16)).slice(-2))
  ).join('');
}