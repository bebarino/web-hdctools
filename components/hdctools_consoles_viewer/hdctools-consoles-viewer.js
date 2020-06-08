import "@material/mwc-button";
import "@material/mwc-dialog";
import "@material/mwc-drawer";
import "@material/mwc-icon-button";
import "@material/mwc-list";
import "@material/mwc-tab-bar";

import { html, LitElement, css } from "lit-element";
import { render } from "lit-html";
import { PageViewElement } from "../page-view-element.js";
import { connect } from "pwa-helpers";
import { repeat } from "lit-html/directives/repeat.js";

import { store } from "../../src/store.js";

import { openDevice, currentDeviceSelector } from "../../src/actions/device.js";
import {
  discoverConsoles,
  selectConsole,
  currentConsoleSelector
} from "../../src/actions/console.js";
import { consoles } from "../../src/reducers/console.js";
import { updateLocationURL } from "../../src/actions/app.js";
import "../hdctools_console_view/hdctools-console-view.js";

store.addReducers({ consoles });

class HdctoolsConsolesViewer extends connect(store)(PageViewElement) {
  constructor() {
    super();
  }

  static get styles() {
    return [
      css`
        ._console {
          display: none;
        }
        ._console[active] {
          display: block;
        }
      `
    ];
  }

  static get properties() {
    return {
      _consoles: { type: Array },
      _device: { type: Object },
      _intf: { type: Object },
      _terminals: { type: Array }
    };
  }

  render() {
    const { _consoles, _terminals, _device, _intf } = this;

    return html`
      <mwc-tab-bar
        @MDCTabBar:activated="${e => {
          const index = e.detail.index;
          store.dispatch(selectConsole(index));
        }}"
      >
        ${repeat(
          _consoles,
          console => html`
            <mwc-tab label="Console" icon="computer"></mwc-tab>
          `
        )}
      </mwc-tab-bar>
      <div id="consoles">
        ${_consoles.map(
          intf =>
            html`
              <hdctools-console-view
                class="_console"
                .device=${_device}
                .intf=${intf}
                ?active="${_device === _device && intf === _intf}"
              ></hdctools-console-view>
            `
        )}
      </div>
    `;
  }

  firstUpdated() {
    this.terminals = this.shadowRoot.querySelector("#consoles");
  }

  stateChanged(state) {
    this._consoles = state.consoles.items;
    this._device = currentDeviceSelector(state);
    this._intf = currentConsoleSelector(state);
  }

  createTerminalElement(intf) {
    // opt_profileName is the name of the terminal profile to load, or "default" if
    // not specified.  If you're using one of the persistent storage
    // implementations then this will scope all preferences read/writes to this
    // name.

    //const fragment = new DocumentFragment();
    const template = html`
      <hdctools-console-view
        .device=${this.device}
        .intf=${intf}
      ></hdctools-console-view>
    `;
    //render(template, fragment);

    return template;

    //return this.terminals.appendChild(fragment);
  }
}

customElements.define("hdctools-consoles-viewer", HdctoolsConsolesViewer);

export { openDevice, discoverConsoles };
