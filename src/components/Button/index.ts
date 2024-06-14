import style from "./Button.module.scss";

type StyleProps = {
  blue?: boolean;
  yellow?: boolean;
  gray?: boolean;
  noEffect?: boolean;
  disabled?: boolean;
};

const buttonStyleClasses: Record<string, string> = {
  blue: "button--blue",
  yellow: "button--yellow",
  gray: "button--gray",
  noEffect: "button--no-effect",
  disabled: "button--disabled",
};

export class Button extends HTMLElement {
  private props: StyleProps = {};

  constructor() {
    super();
  }

  connectedCallback() {
    this.setPropsValue();

    this.classList.add(style.button);

    this.getClassStyle();
  }

  static get observedAttributes() {
    return ["yellow", "blue"];
  }

  setPropsValue() {
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
  }

  getClassStyle() {
    let props = this.props;

    for (let property in props) {
      const className = buttonStyleClasses[property];
      const propertyValue = style[className];
      this.classList.add(propertyValue);
    }
  }
}

customElements.define("button-component", Button);
