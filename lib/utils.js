/* eslint-disable id-blacklist */
/* eslint-disable id-length */
/* eslint-disable no-param-reassign */

export function compact(list) {
  if (!list || !list.length)
    return [];
  const arr = [];
  for (let i = 0, ii = list.length; i < ii; i++) {
    if (list[i])
      arr.push(list[i]);
  }
  return arr;
}

export function forEach(list, func) {
  if (!list || !list.length)
    return null;
  if (typeof func !== 'function')
    return console.error('2nd param to forEach must be function');
  for (let i = 0, ii = list.length; i < ii; i++)
    func(list[i], i);
}

/* depends on: isFunction */
export function forOwn(arg, func) {
  for (const key in arg) {
    if (arg.hasOwnProperty(key)) {
      if (isFunction(func))
        func(arg[key], key);
    }
  }
}

/* depends on: isArray, split */
export function get(obj, path) {
  if (typeof obj === 'undefined' || obj === null)
    return null;
  if (typeof path === 'undefined' || path === null || path === '')
    return obj;
  const pathArr = isArray(path) ? path : split(path, '.');
  if (!pathArr.length)
    return obj;
  if (obj[pathArr[0]]) {
    const sliced = pathArr.slice(1);
    if (sliced.length === 0)
      return obj[pathArr[0]];
    return get(obj[pathArr[0]], sliced);
  }
  return null;
}

export function getProto(arg) {
  return Object.getPrototypeOf(Object(arg));
}

export function includes(arg, elm) {
  if (!arg || !arg.indexOf)
    return false;
  else if (arg.indexOf(elm) > -1)
    return true;
  else
    return false;
}

export function isArray(obj) {
  if (!obj)
    return false;
  return (
    typeof obj === 'object' &&
    (
      (Array.isArray && Array.isArray(obj)) ||
      obj.constructor === Array ||
      obj instanceof Array
    )
  );
}

export function isFunction(func) {
  return typeof func === 'function';
}

/* depends on: isArray, getProto */
export function isPlainObject(obj) {
  if (!obj)
    return false;
  if (typeof obj !== 'object')
    return false;
  if (isArray(obj))
    return false;
  const proto = getProto(obj);
  if (proto === null)
    return true;
  const cnstcr = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  const funcToString = Function.prototype.toString;
  return (
    typeof cnstcr === 'function' &&
    cnstcr instanceof cnstcr &&
    funcToString.call(cnstcr) === funcToString.call(Object));
}

export function isString(arg) {
  return typeof arg === 'string';
}

/* depends on: isFunction */
export function pickBy(obj, func) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isFunction(func)) {
        if (func(obj[key], key))
          result[key] = obj[key];
      }
      else if (obj[key])
        result[key] = obj[key];
    }
  }
  return result;
}

export function split(string, dilimiter) {
  if (string && string.split)
    return string.split(dilimiter);
  else
    return [];
}

export default {
  compact,
  forEach,
  forOwn,
  get,
  getProto,
  includes,
  isArray,
  isFunction,
  isPlainObject,
  isString,
  pickBy,
  split
};
