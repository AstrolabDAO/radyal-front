import { Serializable } from "./serializable";

export interface NetworkInterface {
  id: number;
  name: string;
  httpRpcs: string[];
  wsRpcs: string[];
  explorers: string[];
  explorerApi: string;
  gasToken: string;
  slug: string;
  icon?: string;
  color1: string;
  color2: string;
}

export class Network extends Serializable implements NetworkInterface {
  id: number;
  name: string;
  httpRpcs: string[];
  wsRpcs: string[];
  explorers: string[];
  explorerApi: string;
  gasToken: string;
  slug: string;
  icon?: string;
  color1: string;
  color2: string;

  static bySlug: { [slug: string]: Network } = {};
  static byChainId: { [chainId: number]: Network } = {};
  constructor(network: NetworkInterface) {
    super();
    this.id = network.id;
    this.name = network.name;
    this.httpRpcs = network.httpRpcs;
    this.wsRpcs = network.wsRpcs;
    this.explorers = network.explorers;
    this.explorerApi = network.explorerApi;
    this.gasToken = network.gasToken;
    this.slug = network.slug;
    this.icon = network.icon;
    this.color1 = network.color1;
    this.color2 = network.color2;
  }
}
