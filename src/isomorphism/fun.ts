export const isNull = value => {
  const isEmpty = typeof value === "string" && value === "";
  const isNaN = typeof value === "number" && Number.isNaN(value);
  return value === null || value === undefined || isEmpty || isNaN;
};

export const isNotNull = value => !isNull(value);

export const isPlainObject = value =>
  isNotNull(value) && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;

export const isArray = value =>
  isNotNull(value) && typeof value === "object" && Object.getPrototypeOf(value) === Array.prototype;

export const isNumber = value => isNotNull(value) && typeof value === "number";

export const isFunction = func => isNotNull(func) && typeof func === "function";

export const isEmptyObj = value => {
  if (typeof value === "undefined" || value === null || typeof value !== "object") {
    return true;
  }
  let name;
  for (name in value) {
    if (value.hasOwnProperty(name)) {
      return false;
    }
  }
  return true;
};

export const isNotEmptyObj = value => !isEmptyObj(value);

export const find = <T = any>(array: T[], callback: (item: T) => boolean): T => {
  let val = null;
  if (isNull(array)) {
    return val;
  }
  for (const item of array) {
    if (callback(item)) {
      val = item;
      return val;
    }
  }
  return val;
};

export const findIndex = (array, callback) => {
  let val = -1;
  if (isNull(array)) {
    return val;
  }
  for (let i = 0; i < array.length; i += 1) {
    if (callback(array[i])) {
      val = i;
      return val;
    }
  }
  return val;
};

export const objectShallowEqual = (objA, objB, compare = null, compareContext = null) => {
  let ret = compare ? compare.call(compareContext, objA, objB) : void 0;
  if (ret !== void 0) {
    return !!ret;
  }
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  // Test for A's keys different from B.
  for (const key of keysA) {
    if (!bHasOwnProperty(key)) {
      return false;
    }
    const valueA = objA[key];
    const valueB = objB[key];
    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false;
    }
  }
  return true;
};

/**
 * 随机生成指定长度字符串
 * @param len
 * @return {string}
 */
export const random = (len: number = 32) => {
  const $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const maxPos = $chars.length;
  let val = "";
  for (let i = 0; i < len; i++) {
    val += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return val;
};

export const fixedZero = val => {
  return val * 1 < 10 ? `0${val}` : val;
};

export function toThousands(num) {
  if (isNull(num)) {
    return null;
  }
  if (typeof num !== "string") {
    num = String(num);
  }
  const index = num.indexOf(".");
  if (index === -1) {
    const reg = /(-?\d+)(\d{3})/;
    while (reg.test(num)) {
      num = num.replace(reg, "$1,$2");
    }
  } else {
    let intPart = num.substring(0, index);
    const pointPart = num.substring(index + 1, num.length);
    const reg = /(-?\d+)(\d{3})/;
    while (reg.test(intPart)) {
      intPart = intPart.replace(reg, "$1,$2");
    }
    num = intPart + "." + pointPart;
  }
  return num;
}

export function getIn(data: any, paths: Array<string | number>, noSetValue: any = null) {
  if (isNull(data) || isEmptyObj(paths)) {
    return noSetValue;
  }
  let result = data;
  try {
    while (paths.length > 0) {
      result = result[paths.shift()];
    }
  } catch (e) {
    result = noSetValue;
  }
  return typeof result === "undefined" ? noSetValue : result;
}

export const hexToRGBA = (hex, opacity) => {
  hex = hex.replace("#", "");
  return (
    "rgba(" +
    hex
      .match(new RegExp("(.{" + hex.length / 3 + "})", "g"))
      .map(l => parseInt(hex.length % 2 ? l + l : l, 16))
      .concat(opacity || 1)
      .join(",") +
    ")"
  );
};

export const pick = (obj, keys) => {
  const resObj = {};
  for (const key of keys) {
    if (key in obj) {
      resObj[key] = obj[key];
    }
  }
  return resObj;
};

export const notUsed = () => null;

export const concatSets = (set, ...iterables) => {
  for (const iterable of iterables) {
    for (const item of iterable) {
      set.add(item);
    }
  }
};

/**
 * 返回一个延迟time毫秒的Promise，用户测试异步代码
 * @param result
 * @param time
 */
export const delay = (result = null, time = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(result);
    }, time);
  });
};
