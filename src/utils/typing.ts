export type Callable<Out = any, In = any> = (...args: In[]) => Out;
export type Optional<T> = T | undefined;
export type Stringifiable = { toString: () => string };
export const OBJECT_REGEX: RegExp = /^(?:\[|\{).*?(?:\]|\})$/;
export const NUMERIC_REGEX: RegExp = /^[-+]?[\d.]+(?:e-?\d+)?$/;
export const FALSY_LIST: string[] = ["f", "false", "n", "no", "0"];
export const TRUTHY_LIST: string[] = ["t", "true", "y", "yes", "1"];

export function objectMetaMatch(o: any, re = /dummy/i): boolean {
  let s: string;
  if (isObject(o)) {
    s = o.constructor.name + (o?.slug ?? o?.name ?? "");
  } else if (typeof o === "string") {
    s = o;
  } else {
    s = o?.toString() ?? "";
  }
  return s.match(re) != null;
}

export const isDummy = (o: any): boolean => o?.isDummy;
export const isLocal = (o: any): boolean =>
  objectMetaMatch(o, /local/i) || o?.isLocal;
export const isTestnet = (o: any): boolean =>
  objectMetaMatch(o, /testnet/i) || o?.isTestnet;

export const isStringObjectLike = (s: string): boolean => OBJECT_REGEX.test(s);
export const isObject = (o: any): boolean =>
  !!o && typeof o === "object" && !Array.isArray(o);
export const isInternal = (o: any): boolean =>
  isObject(o) && ["RefImpl", "Ref"].includes(o.constructor.name);
export const isSeries = (o: any): boolean =>
  isObject(o) && o.constructor.name.includes("Series");
export const isDate = (o: any): boolean => o instanceof Date;
export const isMongoId = (o: any): boolean =>
  !!o && /^[0-9a-fA-F]{24}$/.test(o?.toString()); // use isValidObjectId() from mongoose in back-end
export const isMongoDoc = (o: any): boolean =>
  isObject(o) && "_doc" in o && "$__" in o && "$isNew" in o;
export const isArray = (o: any): boolean => !!o && Array.isArray(o);
export const isFunction = (o: any) => !!o && o instanceof Function; // typeof o == "function"
export const isAsyncFunction = (o: any) =>
  isFunction(o) &&
  (o.constructor.name === "AsyncFunction" || typeof o?.then === "function");
export const isAwaitable = (o: any): boolean => typeof o?.then === "function";
export const isClass = (o: any) =>
  isFunction(o) && !o.hasOwnProperty("arguments");
export const isStr = (s: any): boolean =>
  typeof s === "string" || s instanceof String;
export const isAsciiAlpha = (c: number): boolean =>
  (c >= 65 && c < 91) || (c >= 97 && c < 123);
export const isNumeric = (s: string): boolean => NUMERIC_REGEX.test(s);
export const isNumber = (v: any): boolean =>
  Number.isFinite(v) || (typeof v == "string" && isNumeric(v));
export const isPrimitive = (v: any): boolean =>
  ["string", "number", "boolean"].includes(typeof v) || isDate(v); // <-- NB: date is considered primitive
export const isBoxed = (v: any): boolean =>
  v instanceof String || v instanceof Number || v instanceof Boolean;
export const isPrimitiveOrBoxed = (v: any): boolean =>
  isPrimitive(v) || isBoxed(v);
export const hasValues = (o: any) =>
  Object.values(o).every(
    (v) => !!v && (!isArray(v) || (v as Array<any>).length > 0)
  );

export function stringToBool(s: string): boolean {
  return TRUTHY_LIST.includes(s.toLowerCase());
}

export function isTrue(o: any): boolean {
  if (typeof o === "boolean") {
    return o;
  }
  return isStr(o) && TRUTHY_LIST.includes(o.toLowerCase());
}

export function isFalse(o: any): boolean {
  if (typeof o === "boolean") {
    return o;
  }
  return isStr(o) && FALSY_LIST.includes(o.toLowerCase());
}

export function isBool(value: any): boolean {
  if (typeof value == "boolean") return true;
  else if (typeof value == "string")
    return (
      FALSY_LIST.includes(value.toLowerCase()) ||
      TRUTHY_LIST.includes(value.toLowerCase())
    );
  return false;
}

export function isFunctionImplemented(fn: any): boolean {
  const fnString = fn?.toString?.().replace(/[\s\n]+/g, "");
  return (
    !!fnString && !/^(function\([\w\s,]*\)\{\})|(.*=>\{\})$/.test(fnString)
  );
}
