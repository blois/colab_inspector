export type SpecType = 'list'|'module'|'instance'|'method'|'classobj'|'str'|
    'dict'|'function'|'unknown'|'primitive'|'error';

export declare interface AbbreviatedSpecJson {
  type: SpecType;
  description: string;
}

export declare interface SpecJson {
  type: string;
  spec_type: SpecType;
}

export declare interface ListSpecJson extends SpecJson {
  length: number;
  items: SpecJson[];
}

export declare interface InstanceSpecJson extends SpecJson {
  length: number;
  keys: string[];
}

export declare interface FunctionSpecJson extends SpecJson {
  arguments: string[];
  docs: string;
}

export declare interface DictSpecJson extends SpecJson {
  length: number;
  contents: {[key: string]: AbbreviatedSpecJson};
}

export declare interface ErrorSpecJson extends SpecJson {
  error: string;
}

export declare interface PrimitiveSpecJson extends SpecJson { string: string; }
