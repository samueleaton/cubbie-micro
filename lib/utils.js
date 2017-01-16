/* eslint-disable id-blacklist */
/* eslint-disable id-length */
/* eslint-disable no-param-reassign */

export function toArray(obj) {
  const arr = [];
  for (let i = 0, ii = obj.length; i < ii; i++)
    arr.push(obj[i]);
  return arr;
}

export function toUpper(str) {
  if (str && typeof str.toUpperCase === 'function')
    return str.toUpperCase();
  else
    return str;
}

export function toLower(str) {
  if (str && typeof str.toLowerCase === 'function')
    return str.toLowerCase();
  else
    return str;
}

export function split(string, dilimiter) {
  if (string && string.split)
    return string.split(dilimiter);
  else
    return [];
}

export function replace(arg, regex, string) {
  if (arg && arg.replace)
    return arg.replace(regex, string);
  else
    return string;
}

export function trim(string) {
  if (string && string.trim)
    return string.trim();
  else
    return string;
}

export function isUndefined(arg) {
  return typeof arg === 'undefined';
}

export function isString(arg) {
  return typeof arg === 'string';
}

export function isBoolean(arg) {
  return typeof arg === 'boolean' || arg === true || arg === false || false;
}

export function isFunction(func) {
  return typeof func === 'function';
}

export function includes(arg, elm) {
  if (!arg || !arg.indexOf)
    return false;
  else if (arg.indexOf(elm) > -1)
    return true;
  else
    return false;
}

export function getProto(arg) {
  return Object.getPrototypeOf(Object(arg));
}

/* depends on: forEach, isArray */
export function flatten(arr) {
  const result = [];
  forEach(arr, elm => {
    if (isArray(elm))
      forEach(elm, elm2 => result.push(elm2));
    else
      result.push(elm);
  });
  return result;
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

/* depends on: isArray, isFunction, forEach */
export function keyBy(arr, func) {
  if (!isArray(arr))
    return console.error('keyBy takes an array');
  if (!isFunction(func))
    return {};
  const result = {};
  forEach(arr, elm => {
    result[func(elm)] = elm;
  });
  return result;
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

export function keys(obj) {
  const arr = [];
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key) && key !== 'constructor')
      arr.push(key);
  }
  return arr;
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

export function forEach(list, func) {
  if (!list || !list.length)
    return null;
  if (typeof func !== 'function')
    return console.error('2nd param to forEach must be function');
  for (let i = 0, ii = list.length; i < ii; i++)
    func(list[i], i);
}

export function find(list, func) {
  if (!list || !list.length || typeof func !== 'function')
    return null;
  for (let i = 0, ii = list.length; i < ii; i++) {
    if (func(list[i], i))
      return list[i];
  }
  return null;
}

export function some(arr, func) {
  if (!arr || !arr.length || typeof func !== 'function')
    return false;
  for (let i = 0, ii = arr.length; i < ii; i++) {
    if (func(arr[i], i))
      return true;
  }
  return false;
}

export function map(list, func) {
  if (!list || !list.length)
    return [];
  if (typeof func !== 'function')
    func = () => null;
  const arr = [];
  for (let i = 0, ii = list.length; i < ii; i++)
    arr.push(func(list[i]));
  return arr;
}

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

/* depends on: isArray, split */
export function has(obj, path) {
  if (typeof obj === 'undefined' || obj === null)
    return false;
  if (typeof path === 'undefined' || path === null || path === '')
    return true;
  const pathArr = isArray(path) ? path : split(path, '.');
  if (!pathArr.length)
    return true;
  if (obj[pathArr[0]]) {
    const sliced = pathArr.slice(1);
    if (sliced.length === 0)
      return true;
    return has(obj[pathArr[0]], sliced);
  }
  return false;
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

/* depends on: includes */
export function removeDuplicates(arr) {
  const newArr = [];
  for (let i = 0, ii = arr.length; i < ii; i++) {
    if (!includes(newArr, arr[i]))
      newArr.push(arr[i]);
  }
  return newArr;
}

/* depends on: isArray */
export function chunk(arr, size, chunks = []) {
  if (!isArray(arr) || !arr.length)
    return chunks;
  const chunked = arr.splice(0, size);
  chunks.push(chunked);
  return chunk(arr, size, chunks);
}

/* depends on: isArray */
export function chunkRight(arr, size, chunks = []) {
  if (!isArray(arr) || !arr.length)
    return chunks;
  const chunked = arr.splice(0 - size);
  chunks.unshift(chunked);
  return chunkRight(arr, size, chunks);
}

/* delimits a string from the left side */
function delimit(obj, count, delimiter = "") {
  return map(chunk(obj.split(""), count), arr => arr.join("")).join(delimiter);
}

/* delimits a string from the right side */
function delimitRight(obj, count, delimiter = "") {
  return map(chunkRight(obj.split(""), count), arr => arr.join("")).join(delimiter);
}

export default {
  toArray,
  toUpper,
  toLower,
  split,
  replace,
  trim,
  isUndefined,
  isString,
  isBoolean,
  isFunction,
  includes,
  getProto,
  forOwn,
  pickBy,
  keyBy,
  isPlainObject,
  keys,
  isArray,
  forEach,
  find,
  some,
  map,
  compact,
  has,
  get,
  removeDuplicates,
  chunk,
  chunkRight,
  delimit,
  delimitRight,
  flatten
};
