import "https://unpkg.com/@material/mwc-button@0.14.1/mwc-button.js?module";
import "https://unpkg.com/@material/mwc-dialog@0.14.1/mwc-dialog.js?module";
import "https://unpkg.com/@material/mwc-drawer@0.14.1/mwc-drawer.js?module";
import "https://unpkg.com/@material/mwc-drawer@0.14.1/mwc-drawer-base.js?module";
import "https://unpkg.com/@material/mwc-icon-button@0.14.1/mwc-icon-button.js?module";
import "https://unpkg.com/@material/mwc-tab-bar@0.14.1/mwc-tab-bar.js?module";
import "https://unpkg.com/@material/mwc-top-app-bar@0.14.1/mwc-top-app-bar.js?module";

import { connect } from "https://unpkg.com/pwa-helpers@latest/connect-mixin.js?module";
import { installRouter } from "https://unpkg.com/pwa-helpers@latest/router.js?module";
import { html, LitElement, css } from "https://unpkg.com/lit-element?module";

import { store } from "../../src/store.js";
import { navigate } from "../../src/actions/app.js";
import {
  probeUSBDevices,
  setupUSBListeners
} from "../../src/actions/device.js";
import { usbReducer } from "../../src/reducers/device.js";
import { app } from "../../src/reducers/app.js";

import "../hdctools_sidebar/hdctools-sidebar.js";

store.addReducers({ app });

class HdctoolsApp extends connect(store)(LitElement) {
  static get styles() {
    return [
      css`
        ._page {
          display: none;
        }
        ._page[active] {
          display: block;
        }
      `
    ];
  }

  static get properties() {
    return {
      _title: { type: String },
      _page: { type: String }
    };
  }

  stateChanged(state) {
    this._title = state.app.title;
    this._page = state.app.page;
  }

  constructor() {
    super();

    this.has_usb = "usb" in navigator;
    if (this.has_usb) {
      store.addReducers({
        usb: usbReducer
      });
    }
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.has_usb) {
      setupUSBListeners();
      store.dispatch(probeUSBDevices);
    }
  }

  firstUpdated() {
    installRouter(location => store.dispatch(navigate(location)));
    lib.init(() => {
      console.log("hello");
    });
  }

  render() {
    const { has_usb, _title, _page } = this;
    console.log(_page);

    if (!has_usb) {
      return html`
        <mwc-dialog heading="Oops" open raised>
          <div>
            Please use a browser with webUSB support
          </div>
          <mwc-button slot="primaryAction" dialogAction="close">
            OK
          </mwc-button>
        </mwc-dialog>
      `;
    }

    return html`
      <mwc-drawer
        hasHeader
        type="modal"
        @MDCTopAppBar:nav=${this._toggleAppBar}
      >
        <span slot="title">ChromeOS hdctools</span>
        <hdctools-sidebar></hdctools-sidebar>

        <div slot="appContent">
          <mwc-top-app-bar dense>
            <mwc-icon-button
              slot="navigationIcon"
              icon="menu"
            ></mwc-icon-button>
            <div slot="title">
              <a style="text-decoration: none;color: currentColor" href="/"
                >${_title}</a
              >
            </div>
          </mwc-top-app-bar>
          <hdctools-home-view
            class="_page"
            ?active="${_page === "home"}"
          ></hdctools-home-view>
          <hdctools-consoles-viewer
            class="_page"
            ?active="${_page === "consoles"}"
          ></hdctools-consoles-viewer>
          <hdctools-flashrom-view
            class="_page"
            ?active="${_page === "flashrom"}"
          ></hdctools-flashrom-view>
          <hdctools-404
            class="_page"
            ?active="${_page === "404"}"
          ></hdctools-404>
        </div>
      </mwc-drawer>
    `;
  }

  _toggleAppBar(e) {
    let drawer = e.currentTarget;

    drawer.open = !drawer.open;
  }
}

customElements.define("hdctools-app", HdctoolsApp);
