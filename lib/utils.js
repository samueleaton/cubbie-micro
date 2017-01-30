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
  if (!obj || !path)
    return null;
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
  return arg.indexOf(elm) >= 0;
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
  if (!obj || typeof obj !== 'object' || isArray(obj))
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
  includes,
  isArray,
  isFunction,
  isPlainObject,
  split
};
