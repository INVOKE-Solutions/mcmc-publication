import { isString, isArray, isNullOrUndefined, isObject, isUndefined, } from './unit';
import { IS_CLIENT } from './support';
/**
 * Attempt to parse json into a POJO.
 */
export function tryParseJSON(json) {
  if (!isString(json))
    return undefined;
  try {
    return JSON.parse(json);
  }
  catch (e) {
    return undefined;
  }
}
/**
 * Check if the given input is json or a plain object.
 */
export const isObjOrJSON = (input) => !isNullOrUndefined(input)
  && (isObject(input) || (isString(input) && input.startsWith('{')));
/**
 * If an object return otherwise try to parse it as json.
 */
export const objOrParseJSON = (input) => (isObject(input)
  ? input
  : tryParseJSON(input));
/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 */
export const loadImage = (src, minWidth = 1) => new Promise((resolve, reject) => {
  const image = new Image();
  const handler = () => {
    // @ts-ignore
    delete image.onload;
    // @ts-ignore
    delete image.onerror;
    image.naturalWidth >= minWidth ? resolve(image) : reject(image);
  };
  Object.assign(image, { onload: handler, onerror: handler, src });
});
export const loadScript = (src, onLoad, onError = (() => { })) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onLoad;
  script.onerror = onError;
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
};
/**
 * Tries to parse json and return a object.
 */
export const decodeJSON = (data) => {
  if (!isObjOrJSON(data))
    return undefined;
  return objOrParseJSON(data);
};
/**
 * Attempts to safely decode a URI component, on failure it returns the given fallback.
 */
export const tryDecodeURIComponent = (component, fallback = '') => {
  if (!IS_CLIENT)
    return fallback;
  try {
    return window.decodeURIComponent(component);
  }
  catch (e) {
    return fallback;
  }
};
/**
 * Returns a simple key/value map and duplicate keys are merged into an array.
 *
 * @see https://github.com/ampproject/amphtml/blob/c7c46cec71bac92f5c5da31dcc6366c18577f566/src/url-parse-query-string.js#L31
 */
const QUERY_STRING_REGEX = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;
export const parseQueryString = (qs) => {
  const params = Object.create(null);
  if (isUndefined(qs))
    return params;
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = QUERY_STRING_REGEX.exec(qs))) {
    const name = tryDecodeURIComponent(match[1], match[1]).replace('[]', '');
    const value = isString(match[2])
      ? tryDecodeURIComponent(match[2].replace(/\+/g, ' '), match[2])
      : '';
    const currValue = params[name];
    if (currValue && !isArray(currValue))
      params[name] = [currValue];
    currValue ? params[name].push(value) : (params[name] = value);
  }
  return params;
};
/**
 * Serializes the given params into a query string.
 */
export const serializeQueryString = (params) => {
  const qs = [];
  const appendQueryParam = (param, v) => {
    qs.push(`${encodeURIComponent(param)}=${encodeURIComponent(v)}`);
  };
  Object.keys(params).forEach((param) => {
    const value = params[param];
    if (isNullOrUndefined(value))
      return;
    if (isArray(value)) {
      value.forEach((v) => appendQueryParam(param, v));
    }
    else {
      appendQueryParam(param, value);
    }
  });
  return qs.join('&');
};
/**
 * Notifies the browser to start establishing a connection with the given URL.
 */
export const preconnect = (url, rel = 'preconnect', as) => {
  if (!IS_CLIENT)
    return false;
  const link = document.createElement('link');
  link.rel = rel;
  link.href = url;
  if (!isUndefined(as))
    link.as = as;
  link.crossOrigin = 'true';
  document.head.append(link);
  return true;
};
/**
 * Safely appends the given query string to the given URL.
 */
export const appendQueryStringToURL = (url, qs) => {
  if (isUndefined(qs) || qs.length === 0)
    return url;
  const mainAndQuery = url.split('?', 2);
  return mainAndQuery[0]
    + (!isUndefined(mainAndQuery[1]) ? `?${mainAndQuery[1]}&${qs}` : `?${qs}`);
};
/**
 * Serializes the given params into a query string and appends them to the given URL.
 */
export const appendParamsToURL = (url, params) => appendQueryStringToURL(url, isObject(params) ? serializeQueryString(params) : params);
/**
 * Tries to convert a query string into a object.
 */
export const decodeQueryString = (qs) => {
  if (!isString(qs))
    return undefined;
  return parseQueryString(qs);
};
const pendingSDKRequests = {};
export const loadSDK = (url, sdkGlobalVar, sdkReadyVar, isLoaded = () => true, loadScriptFn = loadScript) => {
  const getGlobal = (key) => {
    if (!isUndefined(window[key]))
      return window[key];
    if (window.exports && window.exports[key])
      return window.exports[key];
    if (window.module && window.module.exports && window.module.exports[key]) {
      return window.module.exports[key];
    }
    return undefined;
  };
  const existingGlobal = getGlobal(sdkGlobalVar);
  if (existingGlobal && isLoaded(existingGlobal)) {
    return Promise.resolve(existingGlobal);
  }
  return new Promise((resolve, reject) => {
    if (!isUndefined(pendingSDKRequests[url])) {
      pendingSDKRequests[url].push({ resolve, reject });
      return;
    }
    pendingSDKRequests[url] = [{ resolve, reject }];
    const onLoaded = (sdk) => {
      pendingSDKRequests[url].forEach((request) => request.resolve(sdk));
    };
    if (!isUndefined(sdkReadyVar)) {
      const previousOnReady = window[sdkReadyVar];
      // eslint-disable-next-line func-names
      window[sdkReadyVar] = function () {
        if (!isUndefined(previousOnReady))
          previousOnReady();
        onLoaded(getGlobal(sdkGlobalVar));
      };
    }
    loadScriptFn(url, () => {
      if (isUndefined(sdkReadyVar))
        onLoaded(getGlobal(sdkGlobalVar));
    }, (e) => {
      pendingSDKRequests[url].forEach((request) => { request.reject(e); });
      delete pendingSDKRequests[url];
    });
  });
};
export const loadSprite = (src, into) => {
  if (!IS_CLIENT)
    return;
  window.fetch(src)
    .then((res) => res.text())
    .then((sprite) => {
    const div = document.createElement('div');
    div.setAttribute('data-sprite', src);
    div.style.display = 'none';
    div.innerHTML = sprite;
    (into !== null && into !== void 0 ? into : document.head).append(div);
  });
};
