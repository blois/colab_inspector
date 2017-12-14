import {
  DictSpecJson,
  FunctionSpecJson,
  InstanceSpecJson,
  ListSpecJson,
  PrimitiveSpecJson,
  ErrorSpecJson,
  SpecJson,
  SpecType} from './specs_json';

function createSpan(text: string, classes: string[] = []): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = text;
  for (const cls of classes) {
    span.classList.add(cls);
  }
  return span;
}

export enum AccessorType {
  IDENTIFIER,
  INDEXER,
}

export class Key {
  constructor(readonly name: string, readonly type: AccessorType) {}
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
        default:
          throw new Error('Unknown type');
      }
    }
    return path;
  }
}

export class Spec {
  constructor(readonly path: Path, private readonly json: SpecJson) {}

  static create(path: Path, json: SpecJson) {
    switch (json.spec_type) {
      case 'list':
        return new ListSpec(path, json as ListSpecJson);
      case 'module':
      case 'instance':
        return new InstanceSpec(path, json as InstanceSpecJson);
      case 'function':
        return new FunctionSpec(path, json as FunctionSpecJson);
      case 'dict':
        return new DictSpec(path, json as DictSpecJson);
      case 'primitive':
        return new PrimitiveSpec(path, json as PrimitiveSpecJson);
      case 'error':
        return new ErrorSpec(path, json as ErrorSpecJson);
      default:
        return new Spec(path, json);
    }
  }

  get type(): SpecType {
    return this.json.spec_type;
  }

  createHeader(): HTMLElement {
    const element = createSpan('', []);
    element.appendChild(createSpan(`${this.path.key.name}`, []));
    element.appendChild(createSpan(`: `, []));
    element.appendChild(createSpan(`${this.type}`, []));
    return element;
  }

  hasItems(): boolean {
    return false;
  }

  getChildPaths(): Path[] {
    return [];
  }

  shortDescription(): HTMLElement {
    return createSpan(`${this.type}`);
  }
}

class ListSpec extends Spec {
  listJson: ListSpecJson;

  constructor(path: Path, json: ListSpecJson) {
    super(path, json);

    this.listJson = json;
  }

  get length(): number {
    return this.listJson.length;
  }

  hasItems(): boolean {
    return !!this.listJson.length;
  }

  createHeader(): HTMLElement {
    const element = createSpan('', []);
    element.appendChild(
        createSpan(`${this.path.key.name} (${this.length}) [`, []));
    const items = [...this.listJson.items];
    items.length = Math.min(items.length, 10);

    const specs = items.map((item, index) => {
      const path =
          this.path.create(new Key(String(index), AccessorType.INDEXER));
      return Spec.create(path, item);
    });

    specs.forEach((spec, index) => {
      element.appendChild(spec.shortDescription());
      if (index < specs.length - 1) {
        element.appendChild(createSpan(', '));
      }
    });

    if (this.listJson.length > specs.length) {
      element.appendChild(createSpan(', \u2026'));
    }

    element.appendChild(createSpan(`]`, []));
    return element;
  }

  getChildPaths(): Path[] {
    const length = Math.min(this.listJson.length, 100);
    const paths = [];
    for (let i = 0; i < length; ++i) {
      paths.push(this.path.create(new Key(String(i), AccessorType.INDEXER)));
    }
    return paths;
  }
}

class InstanceSpec extends Spec {
  instanceJson: InstanceSpecJson;

  constructor(path: Path, json: InstanceSpecJson) {
    super(path, json);

    this.instanceJson = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``);
    element.appendChild(createSpan(`${this.path.key.name}`));
    element.appendChild(createSpan(`: `));
    element.appendChild(createSpan(`${this.instanceJson.type}`));
    return element;
  }

  hasItems(): boolean {
    return !!this.instanceJson.length;
  }

  getChildPaths(): Path[] {
    return this.instanceJson.keys.sort(comparePythonIdentifiers)
        .map((key) => this.path.create(new Key(key, AccessorType.IDENTIFIER)));
  }
}

class FunctionSpec extends Spec {
  functionJson: FunctionSpecJson;

  constructor(path: Path, json: FunctionSpecJson) {
    super(path, json);

    this.functionJson = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``, []);
    element.title = this.functionJson.docs;
    element.appendChild(createSpan(`${this.path.key.name}(`, []));

    const args = this.functionJson.arguments;

    args.forEach((arg, index) => {
      element.appendChild(createSpan(arg, ['argument']));
      if (index < args.length - 1) {
        element.appendChild(createSpan(', '));
      }
    });
    element.appendChild(createSpan(')'));
    return element;
  }
}

class DictSpec extends Spec {
  dictJson: DictSpecJson;

  constructor(path: Path, json: DictSpecJson) {
    super(path, json);

    this.dictJson = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``, []);
    element.appendChild(createSpan(`${this.path.key.name}`, []));
    element.appendChild(createSpan(`: `, []));
    element.appendChild(createSpan(`${this.type} {`, []));

    const keys = this.keys;
    keys.length = Math.min(keys.length, 10);

    keys.forEach((key, index) => {
      element.appendChild(createSpan(key.name, []));
      if (index < keys.length - 1) {
        element.appendChild(createSpan(', '));
      }
    });
    element.appendChild(createSpan('}'));
    return element;
  }

  get keys(): Key[] {
    return Object.keys(this.dictJson.contents)
        .sort(comparePythonIdentifiers)
        .map((identifier) => new Key(identifier, AccessorType.INDEXER));
  }
}

class PrimitiveSpec extends Spec {
  primitiveJson: PrimitiveSpecJson;

  constructor(path: Path, json: PrimitiveSpecJson) {
    super(path, json);

    this.primitiveJson = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``, []);
    element.appendChild(createSpan(`${this.path.key.name}: `, []));
    element.appendChild(this.asElement(100));
    return element;
  }

  shortDescription(): HTMLElement {
    return this.asElement(10);
  }

  asElement(length: number): HTMLElement {
    const element = createSpan(``);
    if (this.primitiveJson.type === 'str') {
      element.appendChild(createSpan(`"`, ['type-str']));
    }
    let str = this.primitiveJson.string;
    if (str.length > length) {
      str = str.substr(0, length) + '\u2026';
    }
    element.appendChild(createSpan(str, [`type-${this.primitiveJson.type}`]));
    if (this.primitiveJson.type === 'str') {
      element.appendChild(createSpan(`"`, ['type-str']));
    }
    return element;
  }
}

class ErrorSpec extends Spec {
  errorJson: ErrorSpecJson;

  constructor(path: Path, json: ErrorSpecJson) {
    super(path, json);

    this.errorJson = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``);
    element.appendChild(createSpan(`${this.path.key.name}: `));
    element.appendChild(createSpan(`${this.type} - ${this.errorJson.error}`, []));
    return element;
  }
}

/** Compares two Python identifiers, sorting private members last.  */
function comparePythonIdentifiers(a: string, b: string): number {
  a = a.replace(/_/g, '\u2026');
  b = b.replace(/_/g, '\u2026');
  if (a === b) return 0;
  if (a < b) return -1;
  return 1;
}
