export const weiToAmount = (bigInt: bigint | string, decimals: number) =>
  Number(bigInt) / 10 ** decimals;

export const round = (value: string | number, decimals = 2) =>
  Number(Number(value).toFixed(decimals));

export function ceil(n: number, scale: number): number {
  const divider = Math.pow(10, scale);
  return Math.ceil((n + Number.EPSILON) * divider) / divider;
}

export function floor(n: number, scale: number): number {
  const divider = Math.pow(10, scale);
  return Math.floor((n + Number.EPSILON) * divider) / divider;
}

export function minmax(data: number[]): [min: number, max: number] {
  let [min, max] = [Number.MAX_VALUE, Number.MIN_VALUE];

  for (const i in data) {
    if (data[i] < min) min = data[i];
    if (data[i] > max) max = data[i];
  }
  return [min, max];
}

export function truncateTrailingZeroes(n: number) {
  while (n % 10 === 0 && n !== 0) n /= 10;
  return n;
}

export function getDigits(n: number, fast = false): number {
  return fast ? fastGetDigits(n) : getScale(getMagnitude(n));
}

export function fastGetDigits(x: number): number {
  return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
}

export function getTrailingZeros(s: string): number {
  let n = 0;
  while (s.charAt(s.length - n - 1) == "0") n++;
  return n;
}

export function getScale(n: number, precision = 16): number {
  const digits = Math.round(n).toString().length;
  // const s = n.toPrecision(digits-precision);
  const roundingScale = Math.max(precision - digits, 1);
  const s = round(n, roundingScale).toFixed(roundingScale);
  const floatIndex = s.indexOf(".") + 1;
  return floatIndex > 0 ? s.length - floatIndex - getTrailingZeros(s) : 0;
}

// this function helps determine automatically a rounding point for charts and all purposes
// eg:
// 0.xxx > 0.1
// 0.0xx > 0.01
// 0.00xx > 0.001
// x.xxx > 1
// xx.xxx > 10
// TODO: simplify
export function getMagnitude(n: number): number {
  n = Math.abs(n);
  if (n > 1) {
    return Math.pow(
      10,
      Math.round(n).toLocaleString("fullwide", { useGrouping: false }).length -
        1
    );
  } else {
    return (
      1 /
      Math.pow(
        10,
        (n.toFixed(16).split(".")?.[1]?.match(/^0*/)?.[0].length || 3) + 1
      )
    );
  }
}

export const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

const rndCache: { [key: string]: number } = {};

export function deterministicRandom(min: number, max: number, seed: string) {
  if (rndCache[seed]) return rndCache[seed];

  // Hash the input string
  const hash = simpleHash(seed);

  // Convert the hash to a positive integer
  const positiveHash = hash < 0 ? -hash : hash;

  // Scale the integer to the range [min, max]
  const range = max - min + 1;
  const rnd = (positiveHash % range) + min;

  return rnd;
}
