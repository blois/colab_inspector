export enum AccessorType {
  IDENTIFIER,
  INDEXER,
  KEY,
}

export class Key {
  constructor(readonly name: string|number, readonly type: AccessorType) {}
}

export class Path {
  constructor(readonly keys: Key[]) {}

  create(key: Key) {
    return new Path([...this.keys, key]);
  }

  get key(): Key {
    return this.keys[this.keys.length - 1];
  }

  toString(): string {
    let path = '';
    for (let i = 0; i < this.keys.length; ++i) {
      const key = this.keys[i];
      switch (key.type) {
        case AccessorType.IDENTIFIER:
          if (i > 0) {
            path = path + '.';
          }
          path = path + key.name;
          break;
        case AccessorType.INDEXER:
          path = `${path}[${key.name}]`;
          break;
        case AccessorType.KEY:
          path = `${path}["${key.name}"]`;
          break;
        default:
          throw new Error('Unknown type');
      }
    }
    return path;
  }
}