import { html, LitElement } from "lit-element";
import { PageViewElement } from "../page-view-element.js";

class HdctoolsHomeView extends PageViewElement {
  render() {
    return html`
      <div>
        <p>
          There's nothing here right now.... Add a device via the left hamburger
          menu!!!
        </p>
      </div>
    `;
  }
}

customElements.define("hdctools-home-view", HdctoolsHomeView);
