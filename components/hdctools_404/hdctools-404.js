import { html, css } from "lit-element";
import { PageViewElement } from "../page-view-element.js";

class Hdctools404 extends PageViewElement {
  static get styles() {
    return [
      css`
        .center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          --mdc-icon-size: 64px;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="center">
        <mwc-icon>error_outline</mwc-icon>
        <h2>Oops that page doesn't exist</h2>
      </div>
    `;
  }
}

customElements.define("hdctools-404", Hdctools404);
