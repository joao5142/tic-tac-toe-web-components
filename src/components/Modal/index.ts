import style from "./Modal.module.scss";

export class Modal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.className = style.modal;

    let element = this.getHTMLElement();

    this.innerHTML = element;

    this.classList.add("d-none");

    this.initClickEvent();
  }

  getHTMLElement() {
    return ` 
        <div class="${style["modal__container"]}">
          <div class="${style["modal__content"]}">
            ${this.innerHTML}
          </div></div>`;
  }

  initClickEvent() {
    this.addEventListener("click", (e) => {
      if (this === e.target && this.dataset.modal !== "win") {
        this.classList.add("d-none");
      }
    });
  }
}

customElements.define("modal-component", Modal);
