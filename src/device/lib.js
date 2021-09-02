export class UsbConsole {
  constructor(device, intf) {
    this._device = device;
    this._intf = intf;
  }

  async open() {
    const intfNumber = this._intf.interfaceNumber;
    const device = this._device;

    try {
      this.opening = device.claimInterface(intfNumber);
    } catch (e) {
      console.log(`Can't claim ${device} interface ${intfNumber}`);
    }
  }

  async readloop(onRx) {
    const device = this._device;
    /* Seems that sometimes the Promise hasn't completed yet */
    if (this._intf.alternate === null) {
      await this.opening;
    }
    const ep = this._intf.alternate.endpoints.find(e => e.direction == 'in');

    /* TODO: Replace with webworker and a message to stop */
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    while (true) {
      const { status, data } = await device.transferIn(
        ep.endpointNumber,
        ep.packetSize
      );

      if (status == 'ok' && data) {
        onRx(data);
      }

      if (status == 'stall') break;
      if (status == 'babble') console.log("USB is babbling... that's bad");
    }
  }

  async sendStr(str) {
    const device = this._device;
    const ep = this._intf.alternate.endpoints.find(e => e.direction == 'out');
    const encoded = new TextEncoder().encode(str);

    await device.transferOut(ep.endpointNumber, encoded);
  }

  async close() {
    const intf = this._intf;
    const device = this._device;

    try {
      await device.releaseInterface(intf.interfaceNumber);
    } catch (e) {
      console.log(`Can't release ${device} interface ${intf.interfaceNumber}`);
    }
  }
}

export class ServoUSBDevice {
  constructor(device) {
    this.device = device;
  }

  probeConsoles() {
    const device = this.device;

    this.consoles = device.configuration.interfaces
      .filter(intf => {
        for (const alt of intf.alternates) {
          if (alt.interfaceClass == 255 && alt.interfaceSubclass == 80) {
            return true;
          }
        }
        return false;
      })
      .map(intf => new UsbConsole(device, intf));
  }

  async open() {
    const device = this.device;

    await device.open();
    if (device.configuration === null) {
      device.selectConfiguration(1);
    }
  }

  async close() {
    const device = this.device;
    await device.close();
  }
}

/* Override this to send data receieved from console to the UI 
usbConsole.prototype.onRx = str => {
  console.log(`RX: ${str}`);
};*/
