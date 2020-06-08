export const CONSOLE_INTERFACES_FOUND = "CONSOLE_INTERFACES_FOUND";
export const CONSOLE_OPENED = "CONSOLE_OPENED";

import { currentDeviceSelector } from "./device.js";
import { updateLocationURL } from "./app.js";
import { createSelector } from "https://unpkg.com/reselect@4.0.0?module";

export const discoverConsoles = (dispatch, getState) => {
  let device = currentDeviceSelector(getState());

  /* only care about interfaces that are consoles */
  let interfaces = device.configuration.interfaces.filter(intf => {
    for (const alt of intf.alternates) {
      if (alt.interfaceClass == 255 && alt.interfaceSubclass == 80) {
        return true;
      }
    }
    return false;
  });

  dispatch(consoleInterfacesFound(interfaces));
};

const consoleInterfacesFound = items => {
  return {
    type: CONSOLE_INTERFACES_FOUND,
    items
  };
};

export const selectConsole = index => async (dispatch, getState) => {
  const state = getState();
  const device = currentDeviceSelector(state);

  dispatch(updateLocationURL(`/consoles/${device.serialNumber}/${index}`));
};

export const openConsole = async (dispatch, getState) => {
  let index = currentConsoleSelector(getState());
  const intf = state.consoles.items[index];
  const ep = intf.alternates[0].endpoints[0].endpointNumber;
  console.log(ep);

  try {
    await device.claimInterface(intf.interfaceNumber);
  } catch (e) {
    console.log(`Can't claim ${device} interface ${index}`);
  }
};

const consoleOpened = (ep, intf) => {
  return {
    type: CONSOLE_OPENED,
    endpoint: ep,
    intf: intf
  };
};

const locationSelector = state => state.app.location;
const consoleSelector = state => state.consoles.items;

export const currentConsoleSelector = createSelector(
  locationSelector,
  consoleSelector,
  (location, interfaces) =>
    interfaces ? interfaces[location.split("/")[3]] : null
);

/*
  let claims = interfaces.map(intf =>
    this.device.claimInterface(intf.interfaceNumber)
  );

  Promise.all(claims)
    .then((this.consoles = interfaces))
    .catch(error => console.log("Can't claim interfaces ${error}}"));

  console.log("hello");
};*/
