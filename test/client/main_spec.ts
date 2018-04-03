import * as main from '../../source/client/main';
import * as wire from '../../source/client/wire';
import {AccessorType, Key, Path} from '../../source/client/path';
import {Spec} from '../../source/client/specs';
import {expect} from 'chai';
import {inspect, inspectSpec} from '../../source/client/inspect';

async function sleep(time = 0) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

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

  beforeEach(() => {
    const element = document.querySelector('#output-area');
    if (element) {
      element.remove();
    }
  });

  it('should define window.inspect', () => {
    expect(window.inspect).to.not.be.null;
  });

  it('handles dict requests', () => {
    const spec = <wire.Spec>dictSpec[0];
    mockedSpecs.set('dict', spec);
    mockedSpecs.set('dict["child1"]', spec);
    mockedSpecs.set('dict["child1"]["child1"]', spec);
    mockedSpecs.set('dict["child1"]["child2"]', spec);
    mockedSpecs.set('dict["child2"]', spec);
    const outputArea = document.createElement('div');
    outputArea.id = 'output-area';
    document.body.appendChild(outputArea);
    inspect('dict');
  });

  it('handles top-level collections', async () => {
    const spec = <wire.Spec>dictSpec[0];
    mockedSpecs.set('dict["child1"]', spec);
    mockedSpecs.set('dict["child1"]["child1"]', spec);
    mockedSpecs.set('dict["child1"]["child2"]', spec);
    mockedSpecs.set('dict["child2"]', spec);
    const outputArea = document.createElement('div');
    outputArea.id = 'output-area';
    document.body.appendChild(outputArea);
    inspectSpec('dict', spec, false);

    const tree = outputArea.querySelector('inspect-tree-item') as Element;
    expect(tree).to.not.be.null;
    await sleep(0);
    const items = tree.querySelectorAll('inspect-tree-item');
    expect(items.length).to.equal(2);

    const first = items[0];
    expect(first.querySelector('.toggle.empty')).to.be.null;
    expect(items[1].querySelector('.toggle.empty')).to.not.be.null;
    (first.querySelector('.title-row') as HTMLElement).click();
    await sleep(0);

    const childTree = first.querySelectorAll('inspect-tree-item');
    expect(childTree.length).to.equal(2);
  });

  it('handles list requests', async () => {
    const spec = <wire.Spec>listSpec[0];
    mockedSpecs.set('list[0]', spec);
    mockedSpecs.set('list[0][0]', spec);
    mockedSpecs.set('list[0][1]', spec);
    mockedSpecs.set('list[1]', spec);
    const outputArea = document.createElement('div');
    outputArea.id = 'output-area';
    document.body.appendChild(outputArea);
    inspectSpec('list', spec, true);

    const tree = outputArea.querySelector('inspect-tree-item') as HTMLElement;
    expect(tree).to.not.be.null;
    await sleep(0);
    let childTree = tree.querySelectorAll('inspect-tree-item');
    expect(childTree.length).to.equal(0);

    (tree.querySelector('.title-row') as HTMLElement).click();
    await sleep(0);

    childTree = tree.querySelectorAll('inspect-tree-item');
    expect(childTree.length).to.equal(2);
    expect(childTree[0].querySelector('.toggle.empty')).to.be.null;
    expect(childTree[1].querySelector('.toggle.empty')).to.not.be.null;
  });
});

const dictSpec = [
  {
    "length": 77,
    "type": "dict",
    "spec_type": "dict",
    "partial": false,
    "contents": {
      "child1": {
        "type": "dict",
        "spec_type": "dict",
        "partial": true,
        "length": 1,
        "contents": {},
        "description": "dict{1}"
      },
      "child2": {
        "type": "dict",
        "spec_type": "dict",
        "description": "dict{0}",
        "partial": true,
        "length": 0,
        "contents": {},
      },
    }
  }
];

const listSpec = [
  {
    "length": 2,
    "type": "list",
    "spec_type": "list",
    "partial": false,
    "items": [
      {
        "type": "list",
        "spec_type": "list",
        "partial": true,
        "length": 2,
        "items": [
          {
            "type": "number",
            "spec_type": "primitive",
            "description": "1",
          },
          {
            "type": "number",
            "spec_type": "primitive",
            "description": "2",
          },
        ],
      },
      {
        "type": "list",
        "spec_type": "list",
        "items": [
          {
            "type": "str",
            "spec_type": "primitive",
            "description": "a",
          },
          {
            "type": "str",
            "spec_type": "primitive",
            "description": "b",
          },
        ],
        "partial": true,
        "length": 0,
      },
    ],
  }
];