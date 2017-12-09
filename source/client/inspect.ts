import {getSpecs} from './service';
import {AccessorType, Key, Path, Spec} from './specs';
import {TreeItem, TreeItemConverter} from './tree';


export async function inspect(path: string) {
  const key = new Key(path, AccessorType.IDENTIFIER);

  const specs = await getSpecs([new Path([key])]);
  const spec = specs[0];

  const tree = TreeItem.create(spec, new SpecItemConverter());
  (document.querySelector('#output-area') as Element).appendChild(tree);
  // window.resizeOutput();
}

class SpecItemConverter extends TreeItemConverter<Spec> {
  createHeader(data: Spec): HTMLElement {
    return data.createHeader();
  }

  hasItems(data: Spec): boolean {
    return data.hasItems();
  }

  async getChildItems(data: Spec): Promise<Spec[]> {
    const paths = data.getChildPaths();
    return getSpecs(paths);
  }
}
