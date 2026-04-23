const slotContent = 'It works!' as HTMLTemplateElement | string;
const template = document.createElement('template');
template.innerHTML = '<slot id="decoratee-slot"></slot>';

export default class SlotDecorator extends HTMLElement {

  readonly shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({mode: 'closed'});
    this.shadow.appendChild(template.content.cloneNode(true));
    if (this.childNodes.length > 0) {
      this.render();
    }
    this.shadow.addEventListener('slotchange', () => this.render());
  }

  private render() {
    const decoratee = this.childNodes[0] as HTMLElement;
    if (decoratee === null) {
      throw new Error(`Expected to have child nodes after a slot change`);
    }
    injectContent(decoratee);
  }
}

function injectContent(node: HTMLElement) {
  if (slotContent instanceof HTMLTemplateElement) {
    node.appendChild(slotContent.content.cloneNode(true));
  } else {
    node.innerHTML = slotContent;
  }
}

customElements.define('slot-decorator', SlotDecorator)
