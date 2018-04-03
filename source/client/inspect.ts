import * as service from './service';
import {AccessorType, Key, Path} from './path';
import {Spec} from './specs';
import {TreeItem} from './tree';
import {SpecItemConverter} from './spec_item_converter';
import * as wire from './wire';

const inspectors = new Map<string, TreeItem<Spec>>();

export async function inspect(id: string) {
  const path = new Path([new Key(id, AccessorType.IDENTIFIER)])

  const json = await service.getSpec(path);
  const spec = Spec.create(path, json);

  const tree = TreeItem.create(spec, new SpecItemConverter());
  inspectors.set(id, tree);
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

export async function refresh(id: string) {
  const tree = inspectors.get(id);
  if (tree) {
    const path = new Path([new Key(id, AccessorType.IDENTIFIER)]);
    const json = await service.getSpec(path);

    tree.refresh(Spec.create(path, json));
  }
}