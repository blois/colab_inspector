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
  itemsContainer_: Element;

  static is = 'inspect-tree-item';

  static create<T>(data: T, dataConverter: TreeItemConverter<T>): TreeItem<T> {
    const item = document.createElement(TreeItem.is) as TreeItem<T>;
    item.data = data;
    item.dataConverter = dataConverter;
    return item;
  }

  createdCallback() {
    this.indent = 0;
  }

  attachedCallback() {
    const titleRow = document.createElement('div');
    this.appendChild(titleRow);

    titleRow.appendChild(this.createIndentSpacer_());

    const toggle = document.createElement('div');
    toggle.className = 'toggle';
    titleRow.appendChild(toggle);

    const title = this.dataConverter.createHeader(this.data);
    title.classList.add('title');
    titleRow.appendChild(title);

    if (!this.dataConverter.hasItems(this.data)) {
      toggle.classList.add('empty');
    } else {
      this.itemsContainer_ = document.createElement('div');
      this.appendChild(this.itemsContainer_);

      titleRow.addEventListener('click', () => {
        this.toggleExpansion_();
      });
    }
  }

  createIndentSpacer_() {
    const spacer = document.createElement('spacer');
    spacer.style.display = 'inline-block';
    spacer.style.width = `${this.indent * 20}px`;
    return spacer;
  }

  toggleExpansion_() {
    this.expanded_ = !this.expanded_;

    if (this.expanded_) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  async expand() {
    this.classList.add('expanded');
    const children = await this.dataConverter.getChildItems(this.data);
    for (const child of children) {
      const item = TreeItem.create(child, this.dataConverter);
      item.indent = this.indent + 1;
      item.dataConverter = this.dataConverter;
      this.itemsContainer_.appendChild(item);
    }
    // window.resizeOutput();
  }

  collapse() {
    while (this.itemsContainer_.lastElementChild) {
      this.itemsContainer_.lastElementChild.remove();
    }
    this.classList.remove('expanded');
    // window.resizeOutput();
  }
}

// document.registerElement('inspect-tree-item', TreeItem);
