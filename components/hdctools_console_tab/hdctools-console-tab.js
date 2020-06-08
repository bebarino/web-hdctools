import { html, LitElement } from 'https://unpkg.com/lit-element?module';

/* Represents the consoles for a particular USB device */
class HdctoolsConsoleTabBar extends LitElement {
  static get properties() {
    return {
      consoles: { type: Array },
    };
  }

  render() {
    return html``;
  }
}

customElements.define('hdctools-console-tab-bar', HdctoolsConsoleTabBar);
