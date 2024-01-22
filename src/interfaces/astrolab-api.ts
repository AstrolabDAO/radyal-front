export interface ApiResponseStrategy {
  deDotFiInfo: null | any;
  coinGeckoInfo: null | any;
  exponentialInfo: null | any;
  contracts: Record<string, any>;
  _id: string;
  isLastRevision: boolean;
  revision: number;
  createdBy: string;
  updatedBy: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  descriptionSlides: any[];
  color1: string;
  color2: string;
  landing: string;
  docs: string;
  codebase: string;
  app: string;
  twitter: string;
  blog: string;
  discord: string;
  email: string;
  telegram: string;
  contract: string;
  token: string;
  isDummy: boolean;
  blocky: {
    seed: string;
    seedArr: number[];
    theme: {
      name: string;
      primary: string;
      secondary: string;
      bg: string[];
      fg: string[];
      shadow: string[];
      overlay: string[];
      palette: string[];
      primaryPalette: string[];
      success: string;
      warning: string;
      error: string;
      notice: string;
      info: string;
      debug: string;
      bgSuccess: string;
      bgWarning: string;
      bgError: string;
      bgDebug: string;
      bgNotice: string;
      bgInfo: string;
    };
    size: number;
    scale: number;
    color: string;
    bgColor: string;
    spotColor: string;
    canvas: null | any;
    ctx: null | any;
    dataUrl: string;
    rendered: boolean;
  };
  nativeAddress: string;
  shortAddress: string;
  nonNativeAddresses: any[];
  exposureNetworks: string[];
  nativeNetwork: string;
  standards: any[];
  explorer: string;
  status: string;
  symbol: string;
  chainlinkId: string;
  coinGeckoId: string;
  coinMarketCapId: string;
  defiLlamaId: string;
  exponentialId: string;
  defiSafetyId: string;
  solityId: string;
  weiPerUnit: number;
  scale: number;
  addressCount: number;
  issuancePrice: number;
  markPrice: number;
  issuanceSupply: number;
  supply: number;
  maxSupply: number;
  lockedSupply: number;
  circulatingSupply: number;
  marketCap: number;
  dilutedMarketCap: number;
  buyEnabled: boolean;
  sellEnabled: boolean;
  buyTax: number;
  sellTax: number;
  minBuy: number;
  maxBuy: number;
  minSell: number;
  maxSell: number;
  id: number;
  denomination: string;
  rewardTokens: string[];
  valuable: {
    initial: {
      date: string;
      sharePrice: number;
      volume: number;
      ror: number;
      exposureByNetwork: null | any;
      exposureByProtocol: null | any;
      exposureByNetworkByProtocol: null | any;
    };
    last: {
      date: string;
      sharePrice: number;
      volume: number;
      ror: number;
      exposureByNetwork: null | any;
      exposureByProtocol: null | any;
      exposureByNetworkByProtocol: null | any;
    };
    performances: null | any;
    denomination: string;
    dateStart: number;
    dateStop: number;
  };
  protocols: any[];
  types: string[];
  fees: {
    entry: number;
    exit: number;
    mgmt: number;
    perf: number;
  };
  limits: {
    minDeposit: number;
    minWithdrawal: number;
    maxDeposit: number;
    maxSlippage: number;
  };
  scoring: {
    value: number;
    weight: number;
    description: string;
    safety: {
      value: number;
      weight: number;
      description: string;
    };
    profitability: {
      value: number;
      weight: number;
      description: string;
    };
    scalability: {
      value: number;
      weight: number;
      description: string;
      _id: string;
    };
    liquidity: {
      value: number;
      weight: number;
      description: string;
      _id: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface TokenInfo {
  decimalsAmount: string;
  amount: string;
  address: string;
  price: number;
  totalValue: number;
  token: {
    address: string;
    displayName: string;
    decimals: number;
    symbol: string;
    name: string;
    chainId: number;
    icon: string;
    coingeckoId: string;
  };
  tokenPriceUSD: number;
  totalPriceUSD: number;
}

export interface ApiResponseBalance {
  [address: string]: {
    address: string;
    tokens: TokenInfo[];
    totalValue: number;
    errors: any[]; // You can replace 'any[]' with a specific type if needed
    totalUsd: number;
    account: string;
  };
}