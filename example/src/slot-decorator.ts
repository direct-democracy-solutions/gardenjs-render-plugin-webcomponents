const slotContent = 'It works!' as HTMLTemplateElement | string;
const template = document.createElement('template');
template.innerHTML = '<slot id="decoratee-slot"></slot>';

export default class SlotDecorator extends HTMLElement {

  readonly shadow: ShadowRoot;
  readonly outerSlot: HTMLSlotElement;

  constructor() {
    super();
    console.log("constructing slot decorator");
    this.shadow = this.attachShadow({mode: 'closed'});
    this.shadow.appendChild(template.content.cloneNode(true));
    this.outerSlot = this.shadow.getElementById('decoratee-slot') as HTMLSlotElement;
  }

  connectedCallback() {
    console.log("listening for slot changes");
    this.outerSlot.addEventListener('slotchange', (e) => {
      console.log(`slotchange: ${JSON.stringify(e)}`);
      const innerSlot = findDefaultSlot(this.outerSlot);
      if (innerSlot !== null) {
        this.injectContent(innerSlot);
      }
      console.log(`SlotDecorator: didn't find a default slot in the decorated component; skipping`);
    });
  }

  injectContent(node: HTMLElement) {
    if (slotContent instanceof HTMLTemplateElement) {
      node.appendChild(slotContent.content.cloneNode(true));
    } else {
      node.innerHTML = slotContent;
    }
  }
}

function findDefaultSlot(container: HTMLElement) {
  for (const innerSlot of container.querySelectorAll('slot')) {
    if (innerSlot.name === null) {
      return innerSlot;
    }
  }
  return null;
}
