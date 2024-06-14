import style from "./Modal.module.scss";

export class Modal extends HTMLElement {
  constructor() {
    super();
  }

  private clickEventHandle: any;

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
        </div>
      </div>
    `;
  }

  initClickEvent() {
    this.clickEventHandle = (event: MouseEvent) => {
      if (this === event.target && this.dataset.modal !== "win") {
        this.classList.add("d-none");
      }
    };

    this.addEventListener("click", this.clickEventHandle);
  }
  //avoid memory leak
  disconectedCallback() {
    this.removeEventListener("click", this.clickEventHandle);
  }
}

customElements.define("modal-component", Modal);
