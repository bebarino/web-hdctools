// The element for a single terminal window
import { hterm } from '../../assets/hterm_all.js';
import { connect } from 'pwa-helpers';
import { store } from '../../src/store.js';

import { html, css } from 'lit-element';

import { PageViewElement } from '../page-view-element.js';

import { UsbConsole } from '../../src/device/lib.js';

class HdctoolsConsoleView extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      css`
        #terminal {
          width: 95%;
          height: 90%;
          position: fixed;
        }
      `,
    ];
  }

  render() {
    /* const { _item } = this;
    if (_item) {
      const info = _item.volumeInfo;
      updateMetadata({
        title: `${info.title} - Books`,
        description: info.description,
        image: info.imageLinks.thumbnail.replace("http", "https")
      });
    } */

    return html` <div id="terminal"></div> `;
  }

  static get properties() {
    return {
      device: { type: Object },
      intf: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    const usbBack = (this.usbBack = new UsbConsole(this.device, this.intf));
    usbBack.open();
  }

  firstUpdated() {
    this._terminal = this.shadowRoot.querySelector('#terminal');
    const usbBack = this.usbBack;

    // opt_profileName is the name of the terminal profile to load, or "default" if
    // not specified.  If you're using one of the persistent storage
    // implementations then this will scope all preferences read/writes to this
    // name.
    const term = (this._term = new hterm.Terminal('default'));
    term.onTerminalReady = function () {
      // Create a new terminal IO object and give it the foreground.
      // (The default IO object just prints warning messages about unhandled
      // things to the the JS console.)
      const io = term.io.push();

      io.onVTKeystroke = io.sendString = str => {
        usbBack.sendStr(str);
      };

      /* TODO: Handle this?
      io.onTerminalResize = (columns, rows) => {
        // React to size changes here.
      };
      */
    };

    term.decorate(this._terminal);
    usbBack.readloop(str => {
      term.io.writeUTF8(new Uint8Array(str.buffer));
    });
    term.installKeyboard();
  }
}

window.customElements.define('hdctools-console-view', HdctoolsConsoleView);
