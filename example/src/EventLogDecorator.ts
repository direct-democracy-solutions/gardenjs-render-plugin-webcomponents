import AppendLog from './append-log';

const template = document.createElement('template');
template.innerHTML = '<slot id="decoratee-slot"></slot><append-log></append-log>';

// TODO not working -- how to load properly?
export default class EventLogDecorator extends HTMLElement {
  eventLog: AppendLog;
  private shadow: ShadowRoot;
  private slotElement: HTMLSlotElement;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'closed' });
    this.shadow.appendChild(template.content.cloneNode(true));
    this.slotElement = this.shadow.getElementById('decoratee-slot') as HTMLSlotElement;
  }

  connectedCallback() {
    this.watchEvent('hotkey-pressed');
  }

  watchEvent(eventName: string) {
    if (this.eventLog === undefined) {
      const p = document.createElement('p');
      p.innerText = 'Event log from this component (decorator):';
      this.shadow.appendChild(p);
      this.eventLog = document.createElement('append-log') as AppendLog;
      this.shadow.appendChild(this.eventLog);
    }
    this.eventLog.appendMsg(`watching event ${eventName}`);
    this.addEventListener(eventName, (e) => {
      this.eventLog.appendMsg(`got event ${eventName}`);
      this.dispatchEvent(e);
    });
  }
}
