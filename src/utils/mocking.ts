import { deterministicRandom } from "./maths";

export const getRandomAPY = (seed: string): number =>
  deterministicRandom(6_000, 18_000, seed + ":apy") / 100_000;

export const getRandomTVL = (seed: string): number =>
  deterministicRandom(5_000, 5_000_000, seed + ":tvl") / 1_000;
