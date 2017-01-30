/* eslint-disable id-length */
/* EVENT EMITTER
*/
import _ from './utils';

class CubbieEventEmitter {
  constructor() {
    this.events = {
      STATE_SET: [],
      STATE_RESET: [],
      STATE_REVERTED: [],
      STATE_MODIFIED: [],
      namespaces: {}
    };
    this.cubbieEvents = [
      'STATE_SET',
      'STATE_RESET',
      'STATE_REVERTED',
      'STATE_MODIFIED'
    ];
    this.eventLogging = this.eventLoggingName = false;
  }
  buildEventNamespaceTree(treeInProgress, namespaceObj) {
    _.forOwn(namespaceObj, (val, key) => {
      if (_.isPlainObject(val)) {
        treeInProgress[key] = {};
        this.buildEventNamespaceTree(treeInProgress[key], namespaceObj[key]);
      }
      else if (_.isFunction(val)) {
        if (!_.isArray(treeInProgress[key]))
          treeInProgress[key] = [];
        treeInProgress[key].push(val);
      }
      else
        throw Error(`Namespace (${key}): invalid value (${val})`);
    });
  }
  on(arg, evtCb) {
    if (arg === 'namespaces' || (_.isArray(arg) && _.includes(arg, 'namespaces')))
      return console.error('Cubbie Error: reserved event `namespaces`');
    const args = _.isArray(arg) ? arg : [ arg ];
    if (typeof evtCb !== 'function')
      throw Error('Cubbie Error: Last param to "on" must be of type "function".');
    _.forEach(args, evt => {
      if (!_.isArray(this.events[evt]))
        this.events[evt] = [];
      this.events[evt].push(evtCb);
    });
  }
  setEventNamespace(namespace, namespaceObj) {
    if (this.events.namespaces[namespace])
      throw Error(`Cubbie: namespace (${namespace}) already exists`);
    if (!_.isPlainObject(namespaceObj))
      throw Error(`Cubbie: setEventNamespace takes an object`);
    this.events.namespaces[namespace] = {};
    this.buildEventNamespaceTree(this.events.namespaces[namespace], namespaceObj);
  }
  doesEventHaveListensers(evt) {
    return (
      // top level event
      (
        _.isArray(this.events[evt]) &&
        _.compact(this.events[evt]).length
      ) ||
      // namespaced event
      (
        _.isArray(_.get(this.events.namespaces, evt)) &&
        _.get(this.events.namespaces, evt).length
      ) ||
      // globally namespaced event
      (
        _.isArray(_.get(this.events.namespaces.global, evt)) &&
        _.get(this.events.namespaces.global, evt).length
      )
    );
  }
  logEvent(evt) {
    const labelBaseStyles = `font-weight:200;font-size:8px;`;
    const eventBaseStyles = `font-weight:400;font-size:11px;padding:2px 3px;`;
    const bgc = ';background-color:';

    function log(color1, color2, color3) {
      console.log(
        `%cEvent: %c${evt}`,
        `${labelBaseStyles}color:${color1};`,
        `${eventBaseStyles}color:${color2}${bgc}${color3};`
      );
    }
    // if state event
    if (_.includes(this.cubbieEvents, evt))
      log('#753FD3', '#DED0F6', '#6326CC');
    // if listener(s)
    else if (this.doesEventHaveListensers(evt))
      log('#21AE83', '#B8F1E0', '#1C9470');
    // if NO listener(s)
    else
      log('#D57739', '#F7E3D5', '#CC6B26');
  }
  emit(evt, ...args) {
    if (this.eventLogging)
      this.logEvent(evt);

    /* ~~~ Return if no listeners ~~~ */
    if (
      !_.isArray(this.events[evt]) &&
      !_.isArray(_.get(this.events.namespaces, evt)) &&
      !_.isArray(_.get(this.events.namespaces.global, evt))
    )
      return;

    /* ~~~ Emit any relevant listeners ~~~ */
    if (this.events[evt]) {
      _.forEach(this.events[evt], evtCb => {
        if (evtCb)
          return evtCb(...args);
      });
    }
    if (_.get(this.events.namespaces, evt)) {
      _.forEach(_.get(this.events.namespaces, evt), evtCb => {
        if (evtCb)
          return evtCb(...args);
      });
    }
    if (_.get(this.events.namespaces.global, evt)) {
      _.forEach(_.get(this.events.namespaces.global, evt), evtCb => {
        if (evtCb)
          return evtCb(...args);
      });
    }
  }
  enableEventLogging(str) {
    this.eventLogging = true;
    this.eventLoggingName = str;
  }
}

export default CubbieEventEmitter;
