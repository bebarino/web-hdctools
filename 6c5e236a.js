let e,t,s,n,i,c,a,r=e=>e;import{objectSpread2 as l}from"./5522257c.js";import{c as d,a as f,u as h,b as p,s as u,d as m,h as _,e as b,r as v}from"./f3c7e09d.js";export{o as openDevice}from"./f3c7e09d.js";import{P as w}from"./d0598922.js";const y=(e,t)=>{const s=d(t()).configuration.interfaces.filter(e=>{for(const t of e.alternates)if(255==t.interfaceClass&&80==t.interfaceSubclass)return!0;return!1});e({type:"CONSOLE_INTERFACES_FOUND",items:s})},g=f(e=>e.app.location,e=>e.consoles.items,(e,t)=>t?t[e.split("/")[3]]:null),N={};class O{constructor(e,t){this._device=e,this._intf=t}async open(){const e=this._intf.interfaceNumber,t=this._device;try{this.opening=t.claimInterface(e)}catch(s){console.log(`Can't claim ${t} interface ${e}`)}}async readloop(e){const t=new TextDecoder,s=this._device;null===this._intf.alternate&&await this.opening;const n=this._intf.alternate.endpoints.find(e=>"in"==e.direction);for(;;){const{status:i,data:o}=await s.transferIn(n.endpointNumber,n.packetSize);if(o&&e(t.decode(o)),"stall"==i)break;"babble"==i&&console.log("USB is babbling... that's bad")}}async sendStr(e){const t=this._device,s=this._intf.alternate.endpoints.find(e=>"out"==e.direction),n=(new TextEncoder).encode(e);await t.transferOut(s.endpointNumber,n)}async close(){const e=this._intf,t=this._device;try{await t.releaseInterface(e.interfaceNumber)}catch(s){console.log(`Can't release ${t} interface ${e.interfaceNumber}`)}}}class S extends(p(u)(w)){static get styles(){return[m(e||(e=r`#terminal{width:95%;height:90%;position:fixed}`))]}render(){return _(t||(t=r` <div id="terminal"></div> `))}static get properties(){return{device:{type:Object},intf:{type:Object}}}connectedCallback(){super.connectedCallback();(this.usbBack=new O(this.device,this.intf)).open()}firstUpdated(){this._terminal=this.shadowRoot.querySelector("#terminal");const e=this.usbBack,t=this._term=new b.Terminal("default");t.onTerminalReady=function(){const s=t.io.push();s.onVTKeystroke=s.sendString=t=>{e.sendStr(t)}},t.decorate(this._terminal),e.readloop(e=>{t.io.print(e)}),t.installKeyboard()}}window.customElements.define("hdctools-console-view",S),u.addReducers({consoles:(e=N,t)=>{switch(t.type){case"CONSOLE_OPENED":return l(l({},e),{},{endpoint:t.endpoint,intf:t.interface});case"CONSOLE_INTERFACES_FOUND":return l(l({},e),{},{items:[...t.items]});default:return e}}});class $ extends(p(u)(w)){constructor(){super()}static get styles(){return[m(s||(s=r`._console{display:none}._console[active]{display:block}`))]}static get properties(){return{_consoles:{type:Array},_device:{type:Object},_intf:{type:Object}}}render(){const{_consoles:e,_device:t,_intf:s}=this;return _(n||(n=r` <mwc-tab-bar @MDCTabBar:activated="${0}"> ${0} </mwc-tab-bar> <div id="consoles"> ${0} </div> `),e=>{const t=e.detail.index;u.dispatch((e=>async(t,s)=>{const n=s(),i=d(n);t(h(`/consoles/${i.serialNumber}/${e}`))})(t))},v(e,_(i||(i=r`<mwc-tab label="Console" icon="computer"></mwc-tab>`))),e.map(e=>_(c||(c=r` <hdctools-console-view class="_console" .device="${0}" .intf="${0}" ?active="${0}"></hdctools-console-view> `),t,e,t==t&&e===s)))}firstUpdated(){this.terminals=this.shadowRoot.querySelector("#consoles")}stateChanged(e){this._consoles=e.consoles.items,this._device=d(e),this._intf=g(e)}createTerminalElement(e){return _(a||(a=r` <hdctools-console-view .device="${0}" .intf="${0}"></hdctools-console-view> `),this.device,e)}}customElements.define("hdctools-consoles-viewer",$);export{y as discoverConsoles};
