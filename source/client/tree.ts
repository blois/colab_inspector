export class TreeItemConverter<T> {
  createHeader(data: T): HTMLElement {
    const title = document.createElement('span');
    title.textContent = this.getTitle(data);
    return title;
  }

  getTitle(data: T): string {
    return String(data);
  }

  hasItems(data: T): boolean {
    return false;
  }

  async getChildItems(data: T): Promise<T[]> {
    return [];
  }
}


export class TreeItem<T> extends HTMLElement {
  private data: T;
  dataConverter: TreeItemConverter<T>;
  indent = 0;
  expanded_ = false;
  showHeader = true;
  itemsContainer_: Element;
  private fetching_ = false;

  static is = 'inspect-tree-item';

  static create<T>(data: T, dataConverter: TreeItemConverter<T>): TreeItem<T> {
    const item = document.createElement(TreeItem.is) as TreeItem<T>;
    item.data = data;
    item.dataConverter = dataConverter;
    return item;
  }

  createdCallback() {
    this.indent = 0;
    this.showHeader = true;
    this.fetching_ = false;
  }

  attachedCallback() {
    const toggle = document.createElement('div');
    const titleRow = document.createElement('div');
    if (this.showHeader) {
      titleRow.classList.add('title-row');
      this.appendChild(titleRow);

      titleRow.appendChild(this.createIndentSpacer_());

      toggle.className = 'toggle';
      titleRow.appendChild(toggle);

      const title = this.dataConverter.createHeader(this.data);
      title.classList.add('title');
      titleRow.appendChild(title);
    }

    if (!this.dataConverter.hasItems(this.data)) {
      toggle.classList.add('empty');
    } else {
      this.itemsContainer_ = document.createElement('div');
      this.appendChild(this.itemsContainer_);

      titleRow.addEventListener('click', () => {
        this.toggleExpansion_();
      });
    }
    if (!this.showHeader) {
      this.toggleExpansion_();
    }
  }

  private createIndentSpacer_() {
    const spacer = document.createElement('spacer');
    spacer.style.display = 'inline-block';
    spacer.style.width = `${this.indent * 20}px`;
    return spacer;
  }

  private toggleExpansion_() {
    this.expanded_ = !this.expanded_;

    if (this.expanded_) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  async expand() {
    this.classList.add('expanded');
    this.fetching_ = true;
    const children = await this.dataConverter.getChildItems(this.data);
    this.fetching_ = false;
    this.populateChildren(children);
  }

  private populateChildren(children: T[]) {
    for (const child of children) {
      const item = TreeItem.create(child, this.dataConverter);
      if (this.showHeader) {
        item.indent = this.indent + 1;
      }
      item.dataConverter = this.dataConverter;
      this.itemsContainer_.appendChild(item);
    }
  }

  collapse() {
    while (this.itemsContainer_.lastElementChild) {
      this.itemsContainer_.lastElementChild.remove();
    }
    this.classList.remove('expanded');
  }

  async refresh(data: T) {
    if (this.fetching_) {
      return;
    }
    this.data = data;
    if (this.expanded_) {
      const children = await this.dataConverter.getChildItems(this.data);
      this.collapse();
      this.classList.add('expanded');
      this.populateChildren(children);
    }
  }
}

document.registerElement('inspect-tree-item', TreeItem);
