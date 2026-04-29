/** Displays messages in a list as they are appended */
export default class AppendLog extends HTMLElement {
  private readonly ul: HTMLUListElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    this.ul = document.createElement('ul');
    shadow.appendChild(this.ul);
  }

  appendMsg(msg: string) {
    const li = document.createElement('li');
    li.innerText = msg;
    this.ul.appendChild(li);
  }
}

customElements.define('append-log', AppendLog);
