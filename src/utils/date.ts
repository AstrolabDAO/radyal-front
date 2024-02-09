import { Callable } from "./typing";

export const getLocale = (): string => navigator?.language ?? "en-US"; // BCP 47
const LOCALE = getLocale();

const localDateOptions: any = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
};
const localHHMMOptions: any = { hour: "2-digit", minute: "2-digit" }; // hour12: true };
const localHHMMSSOptions: any = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
}; // hour12: true;

export const getDeadline = (minutes = 30) => {
  const now = new Date();
  return now.setMinutes(now.getMinutes() + minutes);
};

export enum TimeFrameSec {
  S1 = 1,
  S2 = 2,
  S5 = 5,
  S10 = 10,
  S15 = 15,
  S30 = 30,
  M1 = 60,
  M2 = 120,
  M5 = 300,
  M10 = 600,
  M15 = 900,
  M30 = 1800,
  H1 = 3600,
  H2 = 7200,
  H3 = 10800,
  H4 = 14400,
  H6 = 21600,
  H8 = 28800,
  H12 = 43200,
  d1 = 86400,
  d2 = 172800,
  d3 = 259200,
  w1 = 604800,
  w2 = 1209600,
  m1 = 2635200,
  m2 = 5270400,
  m3 = 7905600,
  m6 = 15811200,
  y1 = 31556925,
  y2 = 63113850,
  y3 = 94670776,
  y5 = 157784626,
  y10 = 315569252,
}

export function getMsToTimeFrameEnd(tf: TimeFrameSec): number {
  const tfMs = tf * 1000;
  return tfMs - (new Date().getTime() % tfMs);
}

export const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function sleepToNextTimeFrame(tf: TimeFrameSec) {
  await sleep(getMsToTimeFrameEnd(tf));
}

export async function setTimeFrameInterval(
  job: Callable,
  tf: TimeFrameSec,
  execNow = true
): Promise<NodeJS.Timer> {
  if (execNow) await job();
  await sleepToNextTimeFrame(tf);
  return setInterval(async () => await job(), tf * 1000);
}

// date only
export function dateToDateString(date: Date, locale = LOCALE): string {
  // return date.toISOString().slice(0, 10);
  return date.toLocaleDateString(locale, localDateOptions);
}

// time only
export function dateToTimeString(date: Date, locale = LOCALE) {
  return date.toLocaleTimeString(locale); // localTimeOptions
}

// date + time
export function dateToString(date: Date, locale = LOCALE) {
  return date.toLocaleString(locale);
}

export function dateToHHMM(date: Date, locale = LOCALE) {
  return date.toLocaleTimeString(locale, localHHMMOptions).replace(/\s/g, "");
}

export function dateToHHMMSS(date: Date, locale = LOCALE) {
  return date.toLocaleDateString(locale, localHHMMSSOptions).replace(/\s/g, "");
}

export function dateToDDMM(date: Date, locale = "en-UK"): string {
  // return date.toISOString().slice(0, 10);
  return date.toLocaleDateString(locale).slice(0, 5);
}

export function dateToYYYYMMDD(date: Date, locale = "en-UK"): string {
  // return date.toISOString().slice(0, 10).replace(/-/g, "");
  return date.toLocaleDateString(locale).split("/").reverse().join("-");
}

export function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

export function isToday(date: Date): boolean {
  return (
    new Date(date.getTime()).setHours(0, 0, 0, 0) ===
    new Date().setHours(0, 0, 0, 0)
  );
}
