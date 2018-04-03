export type SpecType = 'abbreviated'|'list'|'module'|'instance'|'method'|
    'classobj'|'str'|'dict'|'function'|'unknown'|'primitive'|'error'|'tuple';



export declare interface Spec {
  type: string;
  spec_type: string;
}

export declare interface AbbreviatedSpec extends Spec {
  description: string;
}

export declare interface SequenceSpec extends Spec {
  length: number;
  items: Spec[];
  partial: boolean;
}

export declare interface ListSpec extends SequenceSpec {
}

export declare interface TupleSpec extends SequenceSpec {
}

export declare interface InstanceSpec extends Spec {
  length: number;
  contents: {[key: string]: Spec};
  partial: boolean;
}

export declare interface FunctionSpec extends Spec {
  arguments: string[];
  docs: string;
}

export declare interface DictSpec extends Spec {
  length: number;
  contents: {[key: string]: Spec};
  partial: boolean;
}

export declare interface ErrorSpec extends Spec {
  error: string;
}

export declare interface PrimitiveSpec extends Spec { description: string; }
