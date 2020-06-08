import "https://unpkg.com/@material/mwc-button@latest/mwc-button.js?module";
import "https://unpkg.com/@material/mwc-dialog@latest/mwc-dialog.js?module";
import "https://unpkg.com/@material/mwc-drawer@latest/mwc-drawer.js?module";
import "https://unpkg.com/@material/mwc-drawer@latest/mwc-drawer-base.js?module";
import "https://unpkg.com/@material/mwc-icon-button@latest/mwc-icon-button.js?module";
import "https://unpkg.com/@material/mwc-list@latest/mwc-list.js?module";
import "https://unpkg.com/@material/mwc-list@latest/mwc-list-item.js?module";
import "https://unpkg.com/@material/mwc-tab-bar@latest/mwc-tab-bar.js?module";

import { html, LitElement, css } from "https://unpkg.com/lit-element?module";

import { connect } from "https://unpkg.com/pwa-helpers@latest/connect-mixin.js?module";
import { store } from "../../src/store.js";
import { selectConsole } from "../../src/actions/console.js";
import { updateLocationURL } from "../../src/actions/app.js";
import { currentDeviceSelector } from "../../src/actions/device.js";

import { repeat } from "https://unpkg.com/lit-html/directives/repeat.js?module";

/* Represents the consoles for a particular USB device */
class HdctoolsConsoleTabBar extends LitElement {
  static get properties() {
    return {
      consoles: { type: Array },
    };
  }

  render() {
    const { consoles } = this;

    return html`

    `;
  }

  updated(changedProps) {
    if (changedProps.has("_device") && this._device) {
    }
  }

}

customElements.define("hdctools-console-tab-bar", HdctoolsConsoleTabBar);
