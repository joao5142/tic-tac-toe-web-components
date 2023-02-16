import style from "./Button.module.scss";

type StyleProps = {
  blue?: boolean;
  yellow?: boolean;
  gray?: boolean;
  noEffect?: boolean;
  disabled?: boolean;
};

type stringProps = "yellow" | "blue" | "gray" | "noEffect" | "disabled";

export class Button extends HTMLElement {
  private props: StyleProps = {};
  constructor() {
    super();
  }

  connectedCallback() {
    let attributes = this.getAttributeNames();
    this.props = attributes.reduce((acc, currentValue) => {
      let obj: any = { ...acc };

      if (currentValue == "no-effect") {
        obj["noEffect"] = true;
      } else {
        let key = currentValue;

        obj[key] = true;
      }

      return obj;
    }, {});

    this.classList.add(style.button);

    this.getClassStyle();
  }
  attributeChangedCallback(name: stringProps) {
    if (!(name in this.props)) {
      this.props[name] = true;
      this.getClassStyle();
    }
  }
  static get observedAttributes() {
    return ["yellow", "blue"];
  }

  getClassStyle() {
    let props = this.props;
    if (props.blue) {
      this.classList.add(style["button--blue"]);
    }
    if (props.yellow) {
      this.classList.add(style["button--yellow"]);
    }
    if (props.gray) {
      this.classList.add(style["button--gray"]);
    }
    if (props.noEffect) {
      this.classList.add(style["button--no-effect"]);
    }
    if (props.disabled) {
      this.classList.add(style["button--disabled"]);
    }
  }
}

customElements.define("button-component", Button);
