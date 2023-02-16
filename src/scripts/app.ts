import "@/styles/app.scss";
import "@/components/Card";
import "@/components/Button";
import "@/components/Modal";

import GameChoice from "./game/gameChoice";

GameChoice.init();

function mounted() {
  let externalScript = document.createElement("script");
  externalScript.setAttribute("src", "/src/scripts/svgInject.js");
  document.head.appendChild(externalScript);
}

mounted;
