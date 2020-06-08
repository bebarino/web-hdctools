import "https://unpkg.com/@material/mwc-button@0.14.1/mwc-button.js?module";
import "https://unpkg.com/@material/mwc-dialog@0.14.1/mwc-dialog.js?module";
import "https://unpkg.com/@material/mwc-drawer@0.14.1/mwc-drawer.js?module";
import "https://unpkg.com/@material/mwc-drawer@0.14.1/mwc-drawer-base.js?module";
import "https://unpkg.com/@material/mwc-icon-button@0.14.1/mwc-icon-button.js?module";
import "https://unpkg.com/@material/mwc-list@0.14.1/mwc-list.js?module";
import "https://unpkg.com/@material/mwc-list@0.14.1/mwc-list-item.js?module";
import "https://unpkg.com/@material/mwc-tab-bar@0.14.1/mwc-tab-bar.js?module";

import { html, LitElement, css } from "https://unpkg.com/lit-element?module";
import { render } from "https://unpkg.com/lit-html?module";
import { PageViewElement } from "../page-view-element.js";
import { connect } from "https://unpkg.com/pwa-helpers@latest/connect-mixin.js?module";
import { repeat } from "https://unpkg.com/lit-html/directives/repeat.js?module";

import { store } from "../../src/store.js";

import { openDevice, currentDeviceSelector } from "../../src/actions/device.js";
import {
  discoverConsoles,
  selectConsole,
  currentConsoleSelector
} from "../../src/actions/console.js";
import { consoles } from "../../src/reducers/console.js";
import { updateLocationURL } from "../../src/actions/app.js";
//import "../hdctools_console_tab/hdctools-console-tab.js";
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
