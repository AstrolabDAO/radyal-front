export interface Network {
  id: number;
  name: string;
  httpRpcs: string[];
  wsRpcs: string[];
  explorers: string[];
  explorerApi: string;
  gasToken: string;
  slug: string;
}

export interface Token {
  symbol: string;
  defiLlamaId: string;
  slug: string;
}
