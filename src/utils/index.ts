import { stripName } from "./format";
import { Strategy, Token } from "./interfaces";

export const tokensIsEqual = (
  tokenA: Token | Strategy,
  tokenB: Token | Strategy
) => {
  const A = "asset" in tokenA ? tokenA.asset : tokenA;
  const B = "asset" in tokenB ? tokenB.asset : tokenB;
  return (
    A?.address.toLocaleLowerCase() === B?.address.toLocaleLowerCase() &&
    A?.network.id === B?.network.id
  );
};

export const getStrategyIcon = (strategy: Strategy) => {
  if (!strategy) return "";
  switch (strategy.aggregationLevel) {
    case 0:
      return strategy?.protocols[0]?.icon;
    case 1:
      return strategy?.network?.icon;
    default:
      return strategy?.asset?.icon;
  }
};

export const getStrategyColors = (strategy: Strategy) => {
  if (!strategy) return "";
  switch (strategy.aggregationLevel) {
    case 0:
      return [strategy?.protocols[0]?.color1, strategy?.protocols[0]?.color2];
    case 1:
      return [strategy?.network?.color1, strategy?.network?.color2];
    default:
      return [strategy?.asset?.color1, strategy?.asset?.color2];
  }
};

export const getStrategyHook = (strategy: Strategy) => {
  if (!strategy) return { color1: "#ffffff", message: "???" };
  switch (strategy.aggregationLevel) {
    case 0: {
      const color1 = strategy?.protocols[0]?.color1;
      return {
        color1,
        message: `Automatically provide liquidity to <span style="color: ${color1};">${stripName(strategy.protocols[0].name)}</span>'s best pools in <span style="color: var(--primary);">one vault</span>`,
      };
    }
    case 1: {
      const color1 = strategy?.network?.color1;
      const token = strategy?.asset.slug.includes("us")
        ? "stable"
        : strategy?.asset.symbol;
      return {
        color1,
        message: `Farm <span style="color: ${color1};">all of ${stripName(strategy.network.name)}</span>'s ${token} DeFi in <span style="color: var(--primary);">one vault</span>`,
      };
    }
    case 2:
    default: {
      const color1 = strategy?.asset?.color1;
      const token = strategy?.asset.slug.includes("us")
        ? "stable"
        : strategy?.asset.symbol;
      return {
        color1,
        message: `Farm <span style="color: ${color1};">the best ${token} opportunities</span> cross-chain in <span style="color: var(--primary);">one vault</span>`,
      };
    }
  }
};

export function jaroWinklerDistance(s1, s2) {
  const jaro = (str1, str2) => {
    const s1Length = str1.length;
    const s2Length = str2.length;
    if (s1Length === 0 && s2Length === 0) return 1.0;

    const matchDistance = Math.floor(Math.max(s1Length, s2Length) / 2) - 1;
    const s1Matches = new Array(s1Length).fill(false);
    const s2Matches = new Array(s2Length).fill(false);

    let matches = 0;
    let transpositions = 0;

    for (let i = 0; i < s1Length; i++) {
      const start = Math.max(0, i - matchDistance);
      const end = Math.min(i + matchDistance + 1, s2Length);

      for (let j = start; j < end; j++) {
        if (s2Matches[j]) continue;
        if (str1[i] !== str2[j]) continue;
        s1Matches[i] = true;
        s2Matches[j] = true;
        matches++;
        break;
      }
    }

    if (matches === 0) return 0;

    let k = 0;
    for (let i = 0; i < s1Length; i++) {
      if (!s1Matches[i]) continue;
      while (!s2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }

    return (
      (matches / s1Length +
        matches / s2Length +
        (matches - transpositions / 2) / matches) /
      3
    );
  };

  const jaroDistance = jaro(s1, s2);
  const prefixLength = Math.min(4, s1.length, s2.length);
  let prefixScore = 0;

  for (let i = 0; i < prefixLength; i++) {
    if (s1[i] === s2[i]) {
      prefixScore++;
    } else {
      break;
    }
  }

  return jaroDistance + 0.1 * prefixScore * (1 - jaroDistance);
}

export function findClosestMatch(
  target: string,
  candidates: string[],
  min: number = 0.7
): string | null {
  let closestMatch: string | null = null;
  let highestScore = 0.0;

  candidates.forEach((candidate) => {
    const score = jaroWinklerDistance(target, candidate);
    if (score > highestScore) {
      highestScore = score;
      closestMatch = candidate;
    }
  });

  if (highestScore < min) {
    return null; // or return "" if you prefer an empty string to indicate no match
  }

  return closestMatch;
}
