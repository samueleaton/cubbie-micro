import * as _ from './utils';
import EventEmitter from './eventEmitter';

/*
*/
const createStore = () => (() => {
  let state = null;
  let previousState = null;
  const eventEmitter = new EventEmitter();
  const views = {};

  /* Store
  */
  const storeMethods = {
    modifyState(stateModifier) {
      previousState = state;
      const tempState = Object.assign({}, state);
      stateModifier(tempState);
      state = tempState;
      eventEmitter.emit('STATE_MODIFIED');
      return state;
    },
    setInitialState(initialState) {
      if (!_.isPlainObject(initialState))
        return console.error('Cubbie Error: Must assign plain object to initialState.');
      previousState = null;
      state = initialState;
      eventEmitter.emit('STATE_SET');
      return state;
    },
    createView(viewName, viewFunction) {
      if (views[viewName])
        throw Error(`view "${viewName}" already exists`);
      if (!_.isFunction(viewFunction))
        throw Error(`createView takes a function`);
      views[viewName] = viewFunction;
    },
    view(viewName, ...args) {
      if (!views[viewName])
        throw Error(`view "${viewName}" doesn't exist`);
      return views[viewName](state, ...args);
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
    eventLogging: {
      enable: storeName => {
        eventEmitter.enableEventLogging();
      }
    }
  };

  Object.defineProperty(storeMethods, 'state', {
    get: () => state
  });

  Object.defineProperty(storeMethods, 'previousState', {
    get: () => previousState
  });

  Object.defineProperty(storeMethods, 'cubbieEvents', {
    get: () => eventEmitter.cubbieEvents
  });

  return storeMethods;
})();

const lib = { createStore };
module.exports = lib;
