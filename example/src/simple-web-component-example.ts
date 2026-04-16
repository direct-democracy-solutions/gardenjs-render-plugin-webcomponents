import AppendLog from './append-log';
customElements.define('append-log', AppendLog);

export default function simpleWebComponentExample(
  component: CustomElementConstructor,
  slotContent?: HTMLTemplateElement | string,
) {
  // TODO custom element name, getName not available, component registered
  // not planned?: alternate custom element passed as registry (pass the registry to this element's containing shadow DOM instead)
  const name = customElements.getName(component);
  const elementTemplate = buildElementTemplate(name!, slotContent);

  return class extends HTMLElement {
    static readonly observedAttributes = component['observedAttributes'] as
      | readonly string[]
      | undefined;
    readonly shadow: ShadowRoot;
    readonly element: HTMLElement;

    eventLog: AppendLog;

    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'closed' });
      this.shadow.appendChild(elementTemplate.content.cloneNode(true));
      this.element = this.shadow.getElementById('element')!;
      // TODO use watch-hotkey-decorator.ts instead
      this.watchEvent('hotkey-pressed');
    }

    attributeChangedCallback(attr: string, _, newValue: string | null) {
      this.element.setAttribute(attr, newValue);
    }

    watchEvent(eventName: string) {
      if (this.eventLog === undefined) {
        const p = document.createElement('p');
        p.innerText = 'Event log from this component:';
        this.shadow.appendChild(p);
        this.eventLog = document.createElement('append-log') as AppendLog;
        this.shadow.appendChild(this.eventLog);
      }
      this.eventLog.appendMsg(`watching event ${eventName}`);
      this.element.addEventListener(eventName, () => {
        this.eventLog.appendMsg(`got event ${eventName}`);
      });
    }
  };
}

function buildElementTemplate(
  name: string,
  slotContent?: HTMLTemplateElement | string,
) {
  const template = document.createElement('template');
  const elementNode = document.createElement(name);
  elementNode.id = 'element';
  if (slotContent !== undefined) {
    const slotTemplate = buildSlotTemplate(slotContent);
    elementNode.appendChild(slotTemplate.content);
  }
  template.content.appendChild(elementNode);
  return template;
}

function buildSlotTemplate(content: HTMLTemplateElement | string) {
  if (content instanceof HTMLTemplateElement) {
    return content;
  } else {
    const slotNode = document.createElement('template');
    slotNode.innerHTML = content;
    return slotNode;
  }
}
