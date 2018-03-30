import * as main from '../../source/client/main';
import * as wire from '../../source/client/specs_json';
import {AccessorType, Key, Path, Spec} from '../../source/client/specs';
import {expect} from 'chai';
import {inspect, inspectSpec} from '../../source/client/inspect';

describe('main', () => {
  const mockedSpecs = new Map<string, wire.Spec>();
  (window as any)['google'] = {
    colab: {
      kernel : {},
    }
  };
  google.colab.kernel.invokeFunction = async function(method: string, args: {}[]) {
    const paths = args[0] as string[];
    const specs = paths.map(path => mockedSpecs.get(path as string));
    return {
      data: {
        'application/json': specs,
      },
      status: 'ok',
    } as EvaluateResult;
  }

  it('should define window.inspect', () => {
    expect(window.inspect).to.not.be.null;
  });

  // it('handles dict requests', () => {
  //   const spec = <wire.Spec>dictSpec[0];
  //   mockedSpecs.set('dict', spec);
  //   mockedSpecs.set('dict["child1"]', spec);
  //   mockedSpecs.set('dict["child1"]["child1"]', spec);
  //   mockedSpecs.set('dict["child1"]["child2"]', spec);
  //   mockedSpecs.set('dict["child2"]', spec);
  //   const outputArea = document.createElement('div');
  //   outputArea.id = 'output-area';
  //   document.body.appendChild(outputArea);
  //   inspect('dict');
  // });

  it('handles top-level collections', () => {
    const spec = <wire.Spec>dictSpec[0];
    mockedSpecs.set('dict', spec);
    mockedSpecs.set('dict["child1"]', spec);
    mockedSpecs.set('dict["child1"]["child1"]', spec);
    mockedSpecs.set('dict["child1"]["child2"]', spec);
    mockedSpecs.set('dict["child2"]', spec);
    const outputArea = document.createElement('div');
    outputArea.id = 'output-area';
    document.body.appendChild(outputArea);
    inspectSpec('dict', spec, false);
  });

  // it('handles list requests', () => {
  //   const spec = <wire.Spec>dictSpec[0];
  //   mockedSpecs.set('dict', spec);
  //   const outputArea = document.createElement('div');
  //   outputArea.id = 'output-area';
  //   document.body.appendChild(outputArea);
  //   inspect('dict');
  // });
});

const dictSpec = [
  {
    "length": 77,
    "type": "dict",
    "spec_type": "dict",
    "contents": {
      "child1": {
        "type": "dict",
        "spec_type": "abbreviated",
        "description": "dict{1}"
      },
      "child2": {
        "type": "dict",
        "spec_type": "abbreviated",
        "description": "dict{1}"
      },
    }
  }
];