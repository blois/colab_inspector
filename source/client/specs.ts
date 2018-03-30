import * as wire from './specs_json';

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

export class Spec {
  constructor(readonly path: Path, private readonly json: wire.Spec) {}

  static create(path: Path, json: wire.Spec) {
    switch (json.spec_type) {
      case 'list':
        return new ListSpec(path, json as wire.ListSpec);
      case 'tuple':
        return new TupleSpec(path, json as wire.TupleSpec);
      case 'module':
      case 'instance':
        return new InstanceSpec(path, json as wire.InstanceSpec);
      case 'function':
        return new FunctionSpec(path, json as wire.FunctionSpec);
      case 'dict':
        return new DictSpec(path, json as wire.DictSpec);
      case 'primitive':
        return new PrimitiveSpec(path, json as wire.PrimitiveSpec);
      case 'error':
        return new ErrorSpec(path, json as wire.ErrorSpec);
      default:
        return new Spec(path, json);
    }
  }

  get type(): wire.SpecType {
    return <wire.SpecType>(this.json.spec_type);
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

abstract class SequenceSpec extends Spec {
  sequence: wire.SequenceSpec;

  constructor(path: Path, json: wire.SequenceSpec) {
    super(path, json);

    this.sequence = json;
  }

  get length(): number {
    return this.sequence.length;
  }

  hasItems(): boolean {
    return !!this.sequence.length;
  }

  createHeader(): HTMLElement {
    const element = createSpan('', []);
    element.appendChild(
        createSpan(`${this.path.key.name} (${this.length}) ${this.openBracket}`, []));
    const items = [...this.sequence.items];
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

    if (this.sequence.length > specs.length) {
      element.appendChild(createSpan(', \u2026'));
    }

    element.appendChild(createSpan(this.closeBracket, []));
    return element;
  }

  getChildPaths(): Path[] {
    const length = Math.min(this.sequence.length, 100);
    const paths = [];
    for (let i = 0; i < length; ++i) {
      paths.push(this.path.create(new Key(i, AccessorType.INDEXER)));
    }
    return paths;
  }

  abstract get openBracket(): string;
  abstract get closeBracket(): string;
}

class ListSpec extends SequenceSpec {
  list: wire.ListSpec;

  constructor(path: Path, json: wire.ListSpec) {
    super(path, json);

    this.list = json;
  }

  get openBracket(): string {
    return '[';
  }
  get closeBracket(): string {
    return ']';
  }
}

class TupleSpec extends SequenceSpec {
  tuple: wire.TupleSpec;

  constructor(path: Path, json: wire.TupleSpec) {
    super(path, json);

    this.tuple = json;
  }

  get openBracket(): string {
    return '(';
  }
  get closeBracket(): string {
    return ')';
  }
}

class InstanceSpec extends Spec {
  instance: wire.InstanceSpec;

  constructor(path: Path, json: wire.InstanceSpec) {
    super(path, json);

    this.instance = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``);
    element.appendChild(createSpan(`${this.path.key.name}`));
    element.appendChild(createSpan(`: `));
    element.appendChild(createSpan(`${this.instance.type}`));
    return element;
  }

  hasItems(): boolean {
    return !!this.instance.length;
  }

  getChildPaths(): Path[] {
    return this.instance.keys.sort(comparePythonIdentifiers)
        .map((key) => this.path.create(new Key(key, AccessorType.IDENTIFIER)));
  }
}

class FunctionSpec extends Spec {
  fn: wire.FunctionSpec;

  constructor(path: Path, json: wire.FunctionSpec) {
    super(path, json);

    this.fn = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``, []);
    element.title = this.fn.docs;
    element.appendChild(createSpan(`${this.path.key.name}(`, []));

    const args = this.fn.arguments;

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
  dict: wire.DictSpec;

  constructor(path: Path, json: wire.DictSpec) {
    super(path, json);

    this.dict = json;
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
      element.appendChild(createSpan(String(key.name), []));
      if (index < keys.length - 1) {
        element.appendChild(createSpan(', '));
      }
    });
    element.appendChild(createSpan('}'));
    return element;
  }

  hasItems(): boolean {
    return !!Object.keys(this.dict.contents).length;
  }

  get keys(): Key[] {
    return Object.keys(this.dict.contents)
        .sort(comparePythonIdentifiers)
        .map((identifier) => new Key(identifier, AccessorType.KEY));
  }

  getChildPaths(): Path[] {
    return this.keys.map((key) => this.path.create(key));
  }
}

class PrimitiveSpec extends Spec {
  primitive: wire.PrimitiveSpec;

  constructor(path: Path, json: wire.PrimitiveSpec) {
    super(path, json);

    this.primitive = json;
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
    if (this.primitive.type === 'str') {
      element.appendChild(createSpan(`"`, ['type-str']));
    }
    let str = this.primitive.string;
    if (str.length > length) {
      str = str.substr(0, length) + '\u2026';
    }
    element.appendChild(createSpan(str, [`type-${this.primitive.type}`]));
    if (this.primitive.type === 'str') {
      element.appendChild(createSpan(`"`, ['type-str']));
    }
    return element;
  }
}

class ErrorSpec extends Spec {
  error: wire.ErrorSpec;

  constructor(path: Path, json: wire.ErrorSpec) {
    super(path, json);

    this.error = json;
  }

  createHeader(): HTMLElement {
    const key = this.path.key;
    const element = createSpan(``);
    element.appendChild(createSpan(`${this.path.key.name}: `));
    element.appendChild(createSpan(`${this.type} - ${this.error.error}`, []));
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
