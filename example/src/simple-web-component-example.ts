import AppendLog from './append-log';

let appendLogTagName = customElements.getName(AppendLog);
if (appendLogTagName === null) {
  customElements.define('append-log', AppendLog);
  appendLogTagName = 'append-log';
}

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

    eventLog: AppendLog | null = null;

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
      if (this.eventLog === null) {
        this.eventLog = this.initLog();
      }
      this.eventLog.appendMsg(`watching event ${eventName}`);
      this.element.addEventListener(eventName, (e) => {
        this.eventLog!.appendMsg(`got event ${eventName}`);
        // TODO the event doesn't bubble on its own, but this solution
        //  gives an error for reusing the event.
        this.dispatchEvent(e);
      });
    }

    initLog() {
      const p = document.createElement('p');
      p.innerText = 'Event log from this component:';
      this.shadow.appendChild(p);
      this.eventLog = document.createElement('append-log') as AppendLog;
      this.shadow.appendChild(this.eventLog);
      return this.eventLog;
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
