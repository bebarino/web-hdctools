import '@material/mwc-icon-button';
import '@material/mwc-linear-progress';

import { html, css } from 'lit-element';
import { PageViewElement } from '../page-view-element.js';
import { connect } from 'pwa-helpers';

import { store } from '../../src/store.js';
import { readFlash, writeFlash } from '../../src/actions/flashrom.js';
import { flashrom } from '../../src/reducers/flashrom.js';

store.addReducers({ flashrom });

class HdctoolsFlashromView extends connect(store)(PageViewElement) {
  static get styles() {
    return [
      css`
        .controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .spaced {
          padding-right: 16px;
          padding-left: 16px;
        }
        .fname,
        .fsize {
          display: flex;
          justify-content: center;
          padding: 16px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      _flashName: String,
      _fileSelector: Object,
      _size: Number,
      _reading: Boolean,
      _writing: Boolean,
      _serialNumber: String,
    };
  }

  stateChanged(state) {
    this._flashName = state.flashrom.flashName;
    this._size = state.flashrom.size;
    this._writing = state.flashrom.writing;
    this._reading = state.flashrom.reading;
    this._serialNumber = state.usb.devices[0].serialNumber; // TODO: Pick a device better for multiple devices
  }

  render() {
    const {
      _serialNumber,
      _flashName,
      _size,
      _reading,
      _writing,
      _fileSelector,
    } = this;

    const _loading = _reading || _writing;

    return html`
      <div class="flashrom">
        <div class="fname">
          ${_flashName ? html` Found ${_flashName} flash chip ` : ``}
        </div>
        <div class="fsize">
          ${_size >= 0 ? html` Size is ${_size} ` : ``}
        </div>
        ${_loading
          ? html` <mwc-linear-progress indeterminate></mwc-linear-progress> `
          : html``}
        <div class="controls">
          <mwc-button
            class="spaced"
            raised
            label="Read AP Flash"
            icon="cloud_download"
            ?disabled="${_loading == true}"
            @click=${() => store.dispatch(readFlash(_serialNumber))}
          ></mwc-button>
          <mwc-button
            class="spaced"
            raised
            label="Write AP Flash"
            icon="cloud_upload"
            ?disabled="${_loading == true}"
            @click=${() =>
              store.dispatch(writeFlash(_serialNumber, _fileSelector))}
          ></mwc-button>
        </div>
      </div>
      <input type="file" id="file-selector" style="display:none" />
    `;
  }

  firstUpdated() {
    this._fileSelector = this.shadowRoot.querySelector('#file-selector');
  }
}

customElements.define('hdctools-flashrom-view', HdctoolsFlashromView);
