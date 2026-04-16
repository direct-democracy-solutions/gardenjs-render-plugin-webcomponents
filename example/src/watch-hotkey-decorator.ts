import AppendLog from './appendLog';
customElements.define('append-log', AppendLog);

const template = document.createElement('template');
template.innerHTML = '<slot id="decoratee-slot"></slot>';

// TODO not working -- how to load properly?
export default function watchHotkeyDecorator() {
  eventLog: AppendLog;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'closed' });
    this.shadow.appendChild(elementTemplate.content.cloneNode(true));
    this.slot = this.shadow.getElementById('decoratee-slot');
  }

  connectedCallback() {
    this.watchSlot();
    this.slot.addEventListener('slotchange', (e) => {
      // TODO generalize to any list of events
      this.slot.watchEvent('hotkey-pressed');
      const slotContent = this.slot.childNodes.item(0);
      this.watchEvent(slotContent, 'hotkey-pressed');
    });
  }

  watchEvent(source: HTMLElement, eventName: string) {
    if (this.eventLog === undefined) {
      const p = document.createElement('p');
      p.innerText = 'Event log from this component:';
      this.shadow.appendChild(p);
      this.eventLog = document.createElement('append-log') as AppendLog;
      this.shadow.appendChild(this.eventLog);
    }
    this.eventLog.appendMsg(`watching event ${eventName}`);
    this.element.addEventListener(eventName, (e) => {
      this.eventLog.appendMsg(`got event ${eventName}`);
      this.dispatchEvent(e);
    });
  }
}
