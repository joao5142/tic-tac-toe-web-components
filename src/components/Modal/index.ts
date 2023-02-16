import style from "./Modal.module.scss";

export class Modal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.className = style.modal;
    let element = ` 
        <div class="${style["modal__container"]}">
          <div class="${style["modal__content"]}">
            ${this.innerHTML}
          </div></div>`;

    this.innerHTML = element;
    this.classList.add("d-none");
    this.handleClick();
  }

  handleClick() {
    this.addEventListener("click", (e) => {
      if (this === e.target) {
        this.classList.add("d-none");
      }
    });
  }
}

customElements.define("modal-component", Modal);
