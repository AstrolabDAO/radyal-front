export abstract class Serializable {
  toObject(): Partial<this> {
    return Object.assign({}, this);
  }
  toString(): string {
    return JSON.stringify(this.toObject());
  }
}
