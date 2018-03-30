import {getSpecs} from './service';
import {AccessorType, Key, Path, Spec} from './specs';
import {TreeItem} from './tree';
import {SpecItemConverter} from './spec_item_converter';
import * as wire from './specs_json';

const inspectors = new Map<string, TreeItem<Spec>>();

export async function inspect(path: string) {
  const key = new Key(path, AccessorType.IDENTIFIER);

  const specs = await getSpecs([new Path([key])]);
  const spec = specs[0];

  const tree = TreeItem.create(spec, new SpecItemConverter());
  inspectors.set(path, tree);
  (document.querySelector('#output-area') as Element).appendChild(tree);
}

export function inspectSpec(id: string, json: wire.Spec, showHeader: boolean) {
  const path = new Path([new Key(id, AccessorType.IDENTIFIER)]);
  const spec = Spec.create(path, json);
  const tree = TreeItem.create(spec, new SpecItemConverter());
  tree.showHeader = showHeader;
  inspectors.set(id, tree);
  (document.querySelector('#output-area') as Element).appendChild(tree);
}

export async function refresh(path: string) {
  const tree = inspectors.get(path);
  if (tree) {
    const key = new Key(path, AccessorType.IDENTIFIER);
    const specs = await getSpecs([new Path([key])]);
    const spec = specs[0];

    tree.refresh(spec);
  }
}