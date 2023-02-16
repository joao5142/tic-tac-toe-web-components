import style from "./Card.module.scss";

type stringProps = "blue";
export class Card extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.className = style.card;
  }

  attributeChangedCallback(name: stringProps, odlValue: string, newValue: string) {
    console.log(name, odlValue, newValue);
    if (newValue == "true") {
      this.classList.add(style["card--blue"]);
    } else {
      this.classList.remove(style["card--blue"]);
    }
  }
  static get observedAttributes() {
    return ["blue"];
  }
}

customElements.define("card-component", Card);
