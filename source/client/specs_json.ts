export type SpecType = 'list'|'module'|'instance'|'method'|'classobj'|'str'|
    'dict'|'function'|'unknown'|'primitive'|'error'|'tuple';

export declare interface AbbreviatedSpec {
  type: SpecType;
  description: string;
}

export declare interface Spec {
  type: string;
  spec_type: SpecType;
}

export declare interface SequenceSpec extends Spec {
  length: number;
  items: Spec[];
}

export declare interface ListSpec extends SequenceSpec {
}

export declare interface TupleSpec extends SequenceSpec {
}

export declare interface InstanceSpec extends Spec {
  length: number;
  keys: string[];
}

export declare interface FunctionSpec extends Spec {
  arguments: string[];
  docs: string;
}

export declare interface DictSpec extends Spec {
  length: number;
  contents: {[key: string]: AbbreviatedSpec};
}

export declare interface ErrorSpec extends Spec {
  error: string;
}

export declare interface PrimitiveSpec extends Spec { string: string; }
