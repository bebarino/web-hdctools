export const UPDATE_TITLE = 'UPDATE_TITLE';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const NAVIGATED_LOCATION = 'NAVIGATED_LOCATION';

const updatePage = page => {
  return {
    type: UPDATE_PAGE,
    page,
  };
};

export const updateTitle = title => {
  return {
    type: UPDATE_TITLE,
    title,
  };
};

const navigatedLocation = location => {
  return {
    type: NAVIGATED_LOCATION,
    location,
  };
};

const loadPage = page => async (dispatch, getState) => {
  let module;
  const state = getState();
  const prevPage = state.app.page;

  switch (prevPage) {
    case 'consoles':
      // close previous consoles
      break;
  }

  switch (page) {
    case 'home':
      module = await import(
        '../../components/hdctools_home_view/hdctools-home-view.js'
      );
      break;
    case 'consoles':
      module = await import(
        '../../components/hdctools_consoles_viewer/hdctools-consoles-viewer.js'
      );
      await dispatch(module.openDevice);
      // if (openFailed) doSomething else
      await dispatch(module.discoverConsoles);
      break;
    case 'flashrom':
      module = await import(
        '../../components/hdctools_flashrom_view/hdctools-flashrom-view.js'
      );
      break;
    default:
      // Nothing matches, set page to '404'.
      page = '404';
  }

  if (page === '404') {
    import('../../components/hdctools_404/hdctools-404.js');
  }

  dispatch(updatePage(page));

  /*const lazyLoadComplete = getState().app.lazyResourcesLoaded;
  // load lazy resources after render and set `lazyLoadComplete` when done.
  if (!lazyLoadComplete) {
    requestAnimationFrame(async () => {
      await import('../components/lazy-resources.js');
      dispatch({
        type: RECEIVE_LAZY_RESOURCES
      });
    });
  }*/
};

export const navigate = location => dispatch => {
  // Extract the page name from path.
  // Any other info you might want to extract from the path (like page type),
  // you can do here.
  const pathname = location.pathname;
  const parts = pathname.slice(1).split('/');
  const page = parts[0] || 'home';
  // id is in the path: /consoles/{devSN}
  const devSN = parts[1];
  // query is extracted from the search string: /explore?q={query}
  //const match = RegExp("[?&]vid=([^&]*)&pid=([^&]*)&sn=([^&]*)").exec(location.search);
  //const query = match && decodeURIComponent(match[1].replace(/\+/g, " "));
  dispatch(navigatedLocation(pathname));
  dispatch(loadPage(page, devSN));
};

export const refreshPage = () => (dispatch, getState) => {
  const state = getState();
  // load page using the current state
  dispatch(loadPage(state.app.page, state.usb && state.usb.cur));
};

export const updateLocationURL = url => dispatch => {
  window.history.pushState({}, '', url);
  dispatch(navigate(window.location));
};
