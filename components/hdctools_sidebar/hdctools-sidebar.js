import "https://unpkg.com/@material/mwc-button@0.14.1/mwc-button.js?module";
import "https://unpkg.com/@material/mwc-drawer@0.14.1/mwc-drawer.js?module";
import "https://unpkg.com/@material/mwc-drawer@0.14.1/mwc-drawer-base.js?module";
import "https://unpkg.com/@material/mwc-icon-button@0.14.1/mwc-icon-button.js?module";
import "https://unpkg.com/@material/mwc-list@0.14.1/mwc-list.js?module";
import "https://unpkg.com/@material/mwc-list@0.14.1/mwc-list-item.js?module";
import "https://unpkg.com/@material/mwc-tab-bar@0.14.1/mwc-tab-bar.js?module";

import { connect } from "https://unpkg.com/pwa-helpers@latest/connect-mixin.js?module";
import { store } from "../../src/store.js";
import { selectDevice, requestUSBDevice } from "../../src/actions/device.js";
import { updateLocationURL } from "../../src/actions/app.js";

import { html, LitElement, css } from "https://unpkg.com/lit-element?module";
import { repeat } from "https://unpkg.com/lit-html/directives/repeat.js?module";

/* Represents the consoles for a particular USB device */
class HdctoolsSideBar extends connect(store)(LitElement) {
  /*static get styles() {
    return [];
  }*/

  static get properties() {
    return {
      _devices: { type: Array }
    };
  }

  stateChanged(state) {
    this._devices = state.usb.devices;
  }

  render() {
    const { _devices } = this;

    return html`
      <div>
        <mwc-list
          activatable
          @selected=${e => store.dispatch(selectDevice(e.detail.index))}
        >
          ${_devices &&
            repeat(
              _devices,
              device => html`
                <a
                  style="text-decoration: none"
                  href="/consoles/${device.serialNumber}"
                >
                  <mwc-list-item graphic="avatar" twoline>
                    <span>${device.productName}</span>
                    <span slot="secondary">${device.serialNumber}</span>
                    <mwc-icon slot="graphic">usb</mwc-icon>
                  </mwc-list-item>
                </a>
              `
            )}
          ${_devices.length
            ? html`
                <li divider role="separator"></li>
              `
            : html``}
        </mwc-list>
        <mwc-list>
          <a style="text-decoration: none" href="/flashrom">
            <mwc-list-item graphic="avatar">
              <span>Flashrom</span>
              <mwc-icon slot="graphic">memory</mwc-icon>
            </mwc-list-item>
          </a>
        </mwc-list>
        <mwc-list @selected=${() => store.dispatch(requestUSBDevice)}>
          <mwc-list-item graphic="avatar">
            <span>ADD DEVICE</span>
            <mwc-icon slot="graphic">add</mwc-icon>
          </mwc-list-item>
        </mwc-list>
      </div>
    `;
  }
}

customElements.define("hdctools-sidebar", HdctoolsSideBar);
