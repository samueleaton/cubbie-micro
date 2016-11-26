import _ from './utils';
import EventEmitter from './eventEmitter';

/*
*/
const createStore = (configObj = {}) => (() => {
  let state = null;
  const eventEmitter = new EventEmitter();
  const views = {};

  /*
  */
  function modifyState(stateModifier) {
    const tempState = Object.assign({}, state);
    console.log('tempState: ', tempState);
    stateModifier(tempState);
    setNewState(tempState);
    eventEmitter.emit('STATE_MODIFIED');
    return state;
  }

  /*
  */
  function setInitialState(initialState) {
    if (!_.isPlainObject(initialState))
      return console.error('Cubbie Error: Must assign plain object to initialState.');

    state = initialState;
    eventEmitter.emit('STATE_SET');
  }

  /*
  */
  function setNewState(newState) {
    state = newState;
  }

  /*
  */
  function probe() {
    eventEmitter.emit('STORE_PROBED');
  }

  /*
  */
  function createView(viewName, viewFunction) {
    if (views[viewName])
      return console.error(`view "${viewName}" already exists`);
    if (!_.isFunction(viewFunction))
      return console.error(`second parameter to createView must be a function`);
    views[viewName] = viewFunction;
  }

  /*
  */
  function view(viewName, ...args) {
    if (!views[viewName])
      return console.error(`view "${viewName}" does not exist`);
    return views[viewName](state, ...args);
  }

  /* Store
  */
  const storeMethods = {
    modifyState(...args) {
      modifyState(...args);
      return state;
    },
    setInitialState(...args) {
      setInitialState(...args);
      return this;
    },
    probe(...args) {
      probe(...args);
      return this;
    },
    on(...args) {
      eventEmitter.on(...args);
      return this;
    },
    setEventNamespace(...args) {
      eventEmitter.setEventNamespace(...args);
      return this;
    },
    once(...args) {
      eventEmitter.once(...args);
      return this;
    },
    off(...args) {
      eventEmitter.off(...args);
      return this;
    },
    emit(...args) {
      eventEmitter.emit(...args);
      return this;
    },
    createView(...args) {
      createView(...args);
      return this;
    },
    view(...args) {
      return view(...args);
    },
    eventLogging: {
      enable: storeName => {
        if (storeName && !_.isString(storeName))
          return console.error('Cubbie Error: invalid param passed to eventLogging.enable');
        eventEmitter.enableEventLogging(storeName);
      },
      disable: () => {
        eventEmitter.disableEventLogging();
      }
    }
  };

  Object.defineProperty(storeMethods, 'state', {
    get: () => state
  });

  Object.defineProperty(storeMethods, 'cubbieEvents', {
    get: () => eventEmitter.cubbieEvents
  });

  return storeMethods;
})();

const lib = { createStore };
// if (window) window.cubbie = lib;
module.exports = lib;
