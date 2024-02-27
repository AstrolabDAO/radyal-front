import { stripSlug } from "~/utils/format";
import { Serializable } from "./serializable";

export interface ProtocolInterface {
  app: string;
  name: string;
  landing: string;
  slug: string;
  icon: string;
}

export class Protocol extends Serializable implements Protocol {
  app: string;
  name: string;
  landing: string;
  slug: string;
  icon: string;

  static bySlug: { [slug: string]: Protocol } = {};
  static byStrippedSlug: { [slug: string]: Protocol } = {};
  static byThirdPartyId: { [id: string]: Protocol } = {};
  constructor(data: ProtocolInterface) {
    super();
    this.app = data.app;
    this.name = data.name;
    this.landing = data.landing;
    this.slug = data.slug;
    this.icon = data.icon;

    Protocol.bySlug[this.slug] = this;
    Protocol.byStrippedSlug[stripSlug(this.slug)] = this;
  }
}
