const template = document.createElement('template');
template.innerHTML = `
<style>
.keybind_icon {
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.25em;
}

.keybind_prompt {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<p class="keybind_prompt">
  <img id="icon" class="keybind_icon" />
  <slot></slot>
</p>
`;

// TODO listen for events outside the current iframe (should work as long as it's same-origin)
export default class HotkeyPrompt extends HTMLElement {
  static readonly observedAttributes = ['img-src', 'code'];
  private readonly icon: HTMLImageElement;
  private listener: ((event: KeyboardEvent) => void) | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.appendChild(template.content.cloneNode(true));
    this.icon = shadow.getElementById('icon') as HTMLImageElement;
  }

  attributeChangedCallback(
    attr: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (attr === 'img-src') {
      if (newValue === null) {
        this.icon.removeAttribute('src');
      } else {
        this.icon.setAttribute('src', newValue);
      }
    }
  }

  private connectedCallback() {
    this.listener = (event: KeyboardEvent) => {
      if (event.code === this.code && this.isEnabled) {
        this.emitEvent();
      }
    };
    document.addEventListener('keydown', this.listener);
  }

  private disconnectedCallback() {
    if (this.listener !== null) {
      document.removeEventListener('keydown', this.listener);
    }
    this.listener = null;
  }

  private get code() {
    return this.getAttribute('code');
  }

  private get isEnabled() {
    return this.getAttribute('disabled') === null;
  }

  private emitEvent() {
    const e = new Event('hotkey-pressed');
    this.dispatchEvent(e);
  }
}

customElements.define('hotkey-prompt', HotkeyPrompt);
