export const USB_DEVICE_ADDED = "USB_DEVICE_ADDED";
export const USB_DEVICES_PROBED = "USB_DEVICES_PROBED";
export const USB_DEVICE_REMOVED = "USB_DEVICE_REMOVED";
export const USB_DEVICE_ADD_FAILED = "USB_DEVICE_ADD_FAILED";

export const USB_DEVICE_OPENED = "USB_DEVICE_OPENED";
export const USB_DEVICE_OPEN_FAILED = "FAIL_DEVICE_OPEN";

import { createSelector } from "reselect";
import { updateTitle, updateLocationURL } from "./app.js";

import { store } from "../store.js";

const googVID = 0x18d1;
const microPID = 0x501a;
const suzyqPID = 0x5014;
const servov4PID = 0x501b;
const suzyq_cr50Intf = 0;
const suzyq_cr50Ep = 1;
const suzyq_ECIntf = 2;
const suzyq_ECEp = 3;
const suzyq_APIntf = 1;
const suzyq_APEp = 2;

function extractUSBDetails(device) {
  //return { productName: device.productName, serialNumber: device.serialNumber };
  return device;
}

export const requestUSBDevice = dispatch => {
  return navigator.usb
    .requestDevice({
      filters: [
        {
          // Servo micro
          vendorId: googVID,
          productId: microPID
        },
        {
          // SuzyQ
          vendorId: googVID,
          productId: suzyqPID
        },
        {
          // ServoV4
          vendorId: googVID,
          productId: servov4PID
        }
      ]
    })
    .then(device => dispatch(usbDeviceAdded(device)))
    .catch(e => dispatch(usbDeviceAddFailed(e)));
};

export const probeUSBDevices = async dispatch => {
  const _devices = await navigator.usb.getDevices();

  store.dispatch(usbDevicesProbed(_devices));
};

export const openDevice = async (dispatch, getState) => {
  let device = currentDeviceSelector(getState());

  try {
    await device.open();
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }
    dispatch(usbDeviceOpened(device));
  } catch (e) {
    dispatch(usbDeviceOpenFailed(device));
  }

  /*
  device
    .open()
    .then(() => {
      if (device.configuration === null) {
        device
          .selectConfiguration(1)
          .catch(e => console.log(`Can't select config ${device} ${e}`));
      }
    })
    .then(device => dispatch(usbDeviceOpened(device)))
    .catch(e => {
      console.log(`error opening USB device ${device} ${e}`);
      dispatch(usbDeviceOpenFailed(device));
    });
    */
};

export const setupUSBListeners = () => {
  navigator.usb.addEventListener("connect", event => {
    store.dispatch(usbDeviceAdded(event.device));
  });

  navigator.usb.addEventListener("disconnect", event => {
    store.dispatch(usbDeviceRemoved(event.device));
  });
};

export const selectDevice = index => (dispatch, getState) => {
  const device = getState().usb.devices[index];

  dispatch(updateLocationURL(`/consoles/${device.serialNumber}`));
};

/* Raw actions */
const usbDeviceOpened = device => {
  return {
    type: USB_DEVICE_OPENED,
    device
  };
};

const usbDeviceOpenFailed = (device, error) => {
  return {
    type: USB_DEVICE_OPEN_FAILED,
    device,
    error
  };
};

const usbDevicesProbed = devices => {
  return {
    type: USB_DEVICES_PROBED,
    devices: devices.map(device => extractUSBDetails(device))
  };
};

export const usbDeviceAdded = device => {
  return {
    type: USB_DEVICE_ADDED,
    device: extractUSBDetails(device)
  };
};

export const usbDeviceRemoved = device => {
  return {
    type: USB_DEVICE_REMOVED,
    device: extractUSBDetails(device)
  };
};

const usbDeviceAddFailed = e => {
  return {
    type: USB_DEVICE_ADD_FAILED,
    e
  };
};

const locationSelector = state => state.app.location;
const devicesSelector = state => state.usb.devices;

export const currentDeviceSelector = createSelector(
  locationSelector,
  devicesSelector,
  (location, devices) => {
    return devices.find(
      device => device.serialNumber == location.split("/")[2]
    );
  }
);
