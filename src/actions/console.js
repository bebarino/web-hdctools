export const CONSOLE_INTERFACES_FOUND = 'CONSOLE_INTERFACES_FOUND';
export const CONSOLE_OPENED = 'CONSOLE_OPENED';

import { currentDeviceSelector } from './device.js';
import { updateLocationURL } from './app.js';
import { createSelector } from 'reselect';

const consoleInterfacesFound = items => {
  return {
    type: CONSOLE_INTERFACES_FOUND,
    items,
  };
};

export const discoverConsoles = (dispatch, getState) => {
  const device = currentDeviceSelector(getState());

  /* only care about interfaces that are consoles */
  const interfaces = device.configuration.interfaces.filter(intf => {
    for (const alt of intf.alternates) {
      if (alt.interfaceClass == 255 && alt.interfaceSubclass == 80) {
        return true;
      }
    }
    return false;
  });

  dispatch(consoleInterfacesFound(interfaces));
};

export const selectConsole = index => (dispatch, getState) => {
  const state = getState();
  const device = currentDeviceSelector(state);

  dispatch(updateLocationURL(`/consoles/${device.serialNumber}/${index}`));
};

const locationSelector = state => state.app.location;
const consoleSelector = state => state.consoles.items;

export const currentConsoleSelector = createSelector(
  locationSelector,
  consoleSelector,
  (location, interfaces) =>
    interfaces ? interfaces[location.split('/')[3]] : null
);
