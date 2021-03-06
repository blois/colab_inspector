import {TreeItemConverter} from './tree';
import {Spec} from './specs';
import {getSpec} from './service';

export class SpecItemConverter extends TreeItemConverter<Spec> {
  createHeader(data: Spec): HTMLElement {
    return data.createHeader();
  }

  hasItems(data: Spec): boolean {
    return data.hasItems();
  }

  async getChildItems(data: Spec): Promise<Spec[]> {
    return data.getChildSpecs();
  }
}