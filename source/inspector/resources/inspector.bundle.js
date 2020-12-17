/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function getSpec(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield google.colab.kernel.invokeFunction('inspect.create_specification_for_js', [[path.toString()]], {});
        if (result.status !== 'ok') {
            throw new Error(result.ename);
        }
        const specJson = result.data['application/json'];
        return specJson[0];
    });
}
exports.getSpec = getSpec;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AccessorType;
(function (AccessorType) {
    AccessorType[AccessorType["IDENTIFIER"] = 0] = "IDENTIFIER";
    AccessorType[AccessorType["INDEXER"] = 1] = "INDEXER";
    AccessorType[AccessorType["KEY"] = 2] = "KEY";
})(AccessorType = exports.AccessorType || (exports.AccessorType = {}));
class Key {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
exports.Key = Key;
class Path {
    constructor(keys) {
        this.keys = keys;
    }
    create(key) {
        return new Path([...this.keys, key]);
    }
    get key() {
        return this.keys[this.keys.length - 1];
    }
    toString() {
        let path = '';
        for (let i = 0; i < this.keys.length; ++i) {
            const key = this.keys[i];
            switch (key.type) {
                case AccessorType.IDENTIFIER:
                    if (i > 0) {
                        path = path + '.';
                    }
                    path = path + key.name;
                    break;
                case AccessorType.INDEXER:
                    path = `${path}[${key.name}]`;
                    break;
                case AccessorType.KEY:
                    path = `${path}["${key.name}"]`;
                    break;
                default:
                    throw new Error('Unknown type');
            }
        }
        return path;
    }
}
exports.Path = Path;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class TreeItemConverter {
    createHeader(data) {
        const title = document.createElement('span');
        title.textContent = this.getTitle(data);
        return title;
    }
    getTitle(data) {
        return String(data);
    }
    hasItems(data) {
        return false;
    }
    getChildItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.TreeItemConverter = TreeItemConverter;
class TreeItem extends HTMLElement {
    constructor(data, dataConverter) {
        super();
        this.indent = 0;
        this.expanded_ = false;
        this.showHeader = true;
        this.fetching_ = false;
        this.data = data;
        this.dataConverter = dataConverter;
    }
    static create(data, dataConverter) {
        return new TreeItem(data, dataConverter);
    }
    connectedCallback() {
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
        }
        else {
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
        }
        else {
            this.collapse();
        }
    }
    expand() {
        return __awaiter(this, void 0, void 0, function* () {
            this.classList.add('expanded');
            this.fetching_ = true;
            const children = yield this.dataConverter.getChildItems(this.data);
            this.fetching_ = false;
            this.populateChildren(children);
        });
    }
    populateChildren(children) {
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
    refresh(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.fetching_) {
                return;
            }
            this.data = data;
            if (this.expanded_) {
                const children = yield this.dataConverter.getChildItems(this.data);
                this.collapse();
                this.classList.add('expanded');
                this.populateChildren(children);
            }
        });
    }
}
TreeItem.is = 'inspect-tree-item';
exports.TreeItem = TreeItem;
customElements.define(TreeItem.is, TreeItem);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inspect_1 = __webpack_require__(4);
window.inspect = inspect_1.inspect;
window.refreshInspector = inspect_1.refresh;
window.inspectSpec = inspect_1.inspectSpec;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const service = __webpack_require__(0);
const path_1 = __webpack_require__(1);
const specs_1 = __webpack_require__(5);
const tree_1 = __webpack_require__(2);
const spec_item_converter_1 = __webpack_require__(6);
const inspectors = new Map();
function inspect(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = new path_1.Path([new path_1.Key(id, path_1.AccessorType.IDENTIFIER)]);
        const json = yield service.getSpec(path);
        const spec = specs_1.Spec.create(path, json);
        const tree = tree_1.TreeItem.create(spec, new spec_item_converter_1.SpecItemConverter());
        inspectors.set(id, tree);
        document.querySelector('#output-area').appendChild(tree);
    });
}
exports.inspect = inspect;
function inspectSpec(id, json, showHeader) {
    const path = new path_1.Path([new path_1.Key(id, path_1.AccessorType.IDENTIFIER)]);
    const spec = specs_1.Spec.create(path, json);
    const tree = tree_1.TreeItem.create(spec, new spec_item_converter_1.SpecItemConverter());
    tree.showHeader = showHeader;
    inspectors.set(id, tree);
    document.querySelector('#output-area').appendChild(tree);
}
exports.inspectSpec = inspectSpec;
function refresh(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const tree = inspectors.get(id);
        if (tree) {
            const path = new path_1.Path([new path_1.Key(id, path_1.AccessorType.IDENTIFIER)]);
            const json = yield service.getSpec(path);
            tree.refresh(specs_1.Spec.create(path, json));
        }
    });
}
exports.refresh = refresh;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __webpack_require__(1);
const service = __webpack_require__(0);
function createSpan(text, classes = []) {
    const span = document.createElement('span');
    span.textContent = text;
    for (const cls of classes) {
        span.classList.add(cls);
    }
    return span;
}
class Spec {
    constructor(path, json) {
        this.path = path;
        this.json = json;
    }
    static create(path, json) {
        switch (json.spec_type) {
            case 'list':
                return new ListSpec(path, json);
            case 'tuple':
                return new TupleSpec(path, json);
            case 'module':
            case 'instance':
                return new InstanceSpec(path, json);
            case 'function':
                return new FunctionSpec(path, json);
            case 'dict':
                return new DictSpec(path, json);
            case 'primitive':
                return new PrimitiveSpec(path, json);
            case 'error':
                return new ErrorSpec(path, json);
            default:
                return new Spec(path, json);
        }
    }
    get type() {
        return (this.json.spec_type);
    }
    createHeader() {
        const element = createSpan('', []);
        element.appendChild(createSpan(`${this.path.key.name}`, []));
        element.appendChild(createSpan(`: `, []));
        element.appendChild(createSpan(`${this.type}`, []));
        return element;
    }
    hasItems() {
        return false;
    }
    getChildPaths() {
        return [];
    }
    shortDescription(preview) {
        return createSpan(`${this.type}`);
    }
    getChildSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.Spec = Spec;
class SequenceSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.sequence = json;
    }
    get length() {
        return this.sequence.length;
    }
    hasItems() {
        return !!this.sequence.length;
    }
    shortDescription(preview) {
        const element = createSpan('');
        element.appendChild(createSpan(`(${this.length})${this.openBracket}`));
        if (!preview) {
            const items = [...this.sequence.items];
            items.length = Math.min(items.length, 10);
            const specs = items.map((item, index) => {
                const path = this.path.create(new path_1.Key(String(index), path_1.AccessorType.INDEXER));
                return Spec.create(path, item);
            });
            specs.forEach((spec, index) => {
                element.appendChild(spec.shortDescription(true));
                if (index < specs.length - 1) {
                    element.appendChild(createSpan(', '));
                }
            });
            if (this.sequence.length > specs.length) {
                element.appendChild(createSpan(', \u2026'));
            }
        }
        element.appendChild(createSpan(this.closeBracket, []));
        return element;
    }
    createHeader() {
        const element = createSpan('', []);
        element.appendChild(createSpan(`${this.path.key.name}: `));
        element.appendChild(this.shortDescription(false));
        return element;
    }
    getChildPaths() {
        const length = Math.min(this.sequence.length, 100);
        const paths = [];
        for (let i = 0; i < length; ++i) {
            paths.push(this.path.create(new path_1.Key(i, path_1.AccessorType.INDEXER)));
        }
        return paths;
    }
    getChildSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = this.sequence;
            if (this.sequence.partial) {
                json = (yield service.getSpec(this.path));
            }
            const children = [];
            for (let i = 0; i < json.items.length; ++i) {
                const path = this.path.create(new path_1.Key(i, path_1.AccessorType.INDEXER));
                children.push(Spec.create(path, json.items[i]));
            }
            return children;
        });
    }
}
class ListSpec extends SequenceSpec {
    constructor(path, json) {
        super(path, json);
        this.list = json;
    }
    get openBracket() {
        return '[';
    }
    get closeBracket() {
        return ']';
    }
}
class TupleSpec extends SequenceSpec {
    constructor(path, json) {
        super(path, json);
        this.tuple = json;
    }
    get openBracket() {
        return '(';
    }
    get closeBracket() {
        return ')';
    }
}
class InstanceSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.instance = json;
    }
    createHeader() {
        const key = this.path.key;
        const element = createSpan(``);
        element.appendChild(createSpan(`${this.path.key.name}: `));
        element.appendChild(createSpan(`${this.instance.type}`));
        return element;
    }
    hasItems() {
        return !!this.instance.length;
    }
    getChildPaths() {
        return Object.keys(this.instance.contents)
            .sort(comparePythonIdentifiers)
            .map((identifier) => new path_1.Key(identifier, path_1.AccessorType.IDENTIFIER))
            .map((key) => this.path.create(key));
    }
    getChildSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = this.instance;
            if (json.partial) {
                json = (yield service.getSpec(this.path));
            }
            const children = [];
            const keys = Object.keys(json.contents)
                .sort(comparePythonIdentifiers);
            for (const key of keys) {
                const path = this.path.create(new path_1.Key(key, path_1.AccessorType.IDENTIFIER));
                children.push(Spec.create(path, json.contents[key]));
            }
            return children;
        });
    }
}
class FunctionSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.fn = json;
    }
    createHeader() {
        const key = this.path.key;
        const element = createSpan(``, []);
        element.title = this.fn.docs;
        element.appendChild(createSpan(`${this.path.key.name}(`, []));
        const args = this.fn.arguments;
        args.forEach((arg, index) => {
            element.appendChild(createSpan(arg, ['argument']));
            if (index < args.length - 1) {
                element.appendChild(createSpan(', '));
            }
        });
        element.appendChild(createSpan(')'));
        return element;
    }
}
class DictSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.dict = json;
    }
    createHeader() {
        const key = this.path.key;
        const element = createSpan(``, []);
        element.appendChild(createSpan(`${this.path.key.name}`, []));
        element.appendChild(createSpan(`: `, []));
        element.appendChild(createSpan(`${this.type} {`, []));
        const keys = this.keys;
        keys.length = Math.min(keys.length, 10);
        keys.forEach((key, index) => {
            element.appendChild(createSpan(String(key.name), []));
            if (index < keys.length - 1) {
                element.appendChild(createSpan(', '));
            }
        });
        element.appendChild(createSpan('}'));
        return element;
    }
    hasItems() {
        return this.dict.length > 0;
    }
    getChildSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            let json = this.dict;
            if (this.dict.partial) {
                json = (yield service.getSpec(this.path));
            }
            const children = [];
            const keys = Object.keys(json.contents)
                .sort(comparePythonIdentifiers);
            for (const key of keys) {
                const path = this.path.create(new path_1.Key(key, path_1.AccessorType.KEY));
                children.push(Spec.create(path, json.contents[key]));
            }
            return children;
        });
    }
    get keys() {
        return Object.keys(this.dict.contents)
            .sort(comparePythonIdentifiers)
            .map((identifier) => new path_1.Key(identifier, path_1.AccessorType.KEY));
    }
    getChildPaths() {
        return this.keys.map((key) => this.path.create(key));
    }
}
class PrimitiveSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.primitive = json;
    }
    createHeader() {
        const key = this.path.key;
        const element = createSpan(``, []);
        element.appendChild(createSpan(`${this.path.key.name}: `));
        element.appendChild(this.shortDescription(false));
        return element;
    }
    shortDescription(preview) {
        if (preview) {
            return this.asElement(10);
        }
        else {
            return this.asElement(100);
        }
    }
    asElement(length) {
        const element = createSpan(``);
        if (this.primitive.type === 'str') {
            element.appendChild(createSpan(`"`, ['type-str']));
        }
        let str = this.primitive.description;
        if (str.length > length) {
            str = str.substr(0, length) + '\u2026';
        }
        element.appendChild(createSpan(str, [`type-${this.primitive.type}`]));
        if (this.primitive.type === 'str') {
            element.appendChild(createSpan(`"`, ['type-str']));
        }
        return element;
    }
}
class ErrorSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.error = json;
    }
    createHeader() {
        const key = this.path.key;
        const element = createSpan(``);
        element.appendChild(createSpan(`${this.path.key.name}: `));
        element.appendChild(createSpan(`${this.type} - ${this.error.error}`, []));
        return element;
    }
}
function comparePythonIdentifiers(a, b) {
    a = a.replace(/_/g, '\u2026');
    b = b.replace(/_/g, '\u2026');
    if (a === b)
        return 0;
    if (a < b)
        return -1;
    return 1;
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tree_1 = __webpack_require__(2);
class SpecItemConverter extends tree_1.TreeItemConverter {
    createHeader(data) {
        return data.createHeader();
    }
    hasItems(data) {
        return data.hasItems();
    }
    getChildItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return data.getChildSpecs();
        });
    }
}
exports.SpecItemConverter = SpecItemConverter;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDBmYThhYjkyY2E1ODQ5NzBjZTEiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvcGF0aC50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9tYWluLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvaW5zcGVjdC50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3NwZWNzLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvc3BlY19pdGVtX2NvbnZlcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOztRQUVBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFEQSxpQkFBOEIsSUFBVTs7UUFDdEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQ25ELHFDQUFxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxN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LEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBR0Qsa0NBQWtDLENBQVMsRUFBRSxDQUFTO0lBQ3BELENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNVhELHNDQUF5QztBQUl6Qyx1QkFBK0IsU0FBUSx3QkFBdUI7SUFDNUQsWUFBWSxDQUFDLElBQVU7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVU7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUssYUFBYSxDQUFDLElBQVU7O1lBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDOUIsQ0FBQztLQUFBO0NBQ0Y7QUFaRCw4Q0FZQyIsImZpbGUiOiJpbnNwZWN0b3IuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDBmYThhYjkyY2E1ODQ5NzBjZTEiLCJpbXBvcnQge1BhdGh9IGZyb20gJy4vcGF0aCc7XG5pbXBvcnQgKiBhcyB3aXJlIGZyb20gJy4vd2lyZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTcGVjKHBhdGg6IFBhdGgpOiBQcm9taXNlPHdpcmUuU3BlYz4ge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBnb29nbGUuY29sYWIua2VybmVsLmludm9rZUZ1bmN0aW9uKFxuICAgICAgJ2luc3BlY3QuY3JlYXRlX3NwZWNpZmljYXRpb25fZm9yX2pzJywgW1twYXRoLnRvU3RyaW5nKCldXSwge30pO1xuICBpZiAocmVzdWx0LnN0YXR1cyAhPT0gJ29rJykge1xuICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZW5hbWUpO1xuICB9XG4gIGNvbnN0IHNwZWNKc29uID0gcmVzdWx0LmRhdGFbJ2FwcGxpY2F0aW9uL2pzb24nXSBhcyB3aXJlLlNwZWNbXTtcbiAgcmV0dXJuIHNwZWNKc29uWzBdO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvc2VydmljZS50cyIsImV4cG9ydCBlbnVtIEFjY2Vzc29yVHlwZSB7XG4gIElERU5USUZJRVIsXG4gIElOREVYRVIsXG4gIEtFWSxcbn1cblxuZXhwb3J0IGNsYXNzIEtleSB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IHN0cmluZ3xudW1iZXIsIHJlYWRvbmx5IHR5cGU6IEFjY2Vzc29yVHlwZSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFBhdGgge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBrZXlzOiBLZXlbXSkge31cblxuICBjcmVhdGUoa2V5OiBLZXkpIHtcbiAgICByZXR1cm4gbmV3IFBhdGgoWy4uLnRoaXMua2V5cywga2V5XSk7XG4gIH1cblxuICBnZXQga2V5KCk6IEtleSB7XG4gICAgcmV0dXJuIHRoaXMua2V5c1t0aGlzLmtleXMubGVuZ3RoIC0gMV07XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGxldCBwYXRoID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5c1tpXTtcbiAgICAgIHN3aXRjaCAoa2V5LnR5cGUpIHtcbiAgICAgICAgY2FzZSBBY2Nlc3NvclR5cGUuSURFTlRJRklFUjpcbiAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgIHBhdGggPSBwYXRoICsgJy4nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXRoID0gcGF0aCArIGtleS5uYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5JTkRFWEVSOlxuICAgICAgICAgIHBhdGggPSBgJHtwYXRofVske2tleS5uYW1lfV1gO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5LRVk6XG4gICAgICAgICAgcGF0aCA9IGAke3BhdGh9W1wiJHtrZXkubmFtZX1cIl1gO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biB0eXBlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9wYXRoLnRzIiwiZXhwb3J0IGNsYXNzIFRyZWVJdGVtQ29udmVydGVyPFQ+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmdldFRpdGxlKGRhdGEpO1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIGdldFRpdGxlKGRhdGE6IFQpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmcoZGF0YSk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBUKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRJdGVtcyhkYXRhOiBUKTogUHJvbWlzZTxUW10+IHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHByaXZhdGUgZGF0YTogVDtcbiAgZGF0YUNvbnZlcnRlcjogVHJlZUl0ZW1Db252ZXJ0ZXI8VD47XG4gIGluZGVudCA9IDA7XG4gIGV4cGFuZGVkXyA9IGZhbHNlO1xuICBzaG93SGVhZGVyID0gdHJ1ZTtcbiAgaXRlbXNDb250YWluZXJfOiBFbGVtZW50O1xuICBwcml2YXRlIGZldGNoaW5nXyA9IGZhbHNlO1xuXG4gIHN0YXRpYyBpcyA9ICdpbnNwZWN0LXRyZWUtaXRlbSc7XG5cbiAgY29uc3RydWN0b3IoZGF0YTogVCwgZGF0YUNvbnZlcnRlcjogVHJlZUl0ZW1Db252ZXJ0ZXI8VD4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5kYXRhQ29udmVydGVyID0gZGF0YUNvbnZlcnRlcjtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGU8VD4oZGF0YTogVCwgZGF0YUNvbnZlcnRlcjogVHJlZUl0ZW1Db252ZXJ0ZXI8VD4pOiBUcmVlSXRlbTxUPiB7XG4gICAgcmV0dXJuIG5ldyBUcmVlSXRlbTxUPihkYXRhLCBkYXRhQ29udmVydGVyKTtcbiAgfVxuXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRpdGxlUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKHRoaXMuc2hvd0hlYWRlcikge1xuICAgICAgdGl0bGVSb3cuY2xhc3NMaXN0LmFkZCgndGl0bGUtcm93Jyk7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRpdGxlUm93KTtcblxuICAgICAgdGl0bGVSb3cuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbmRlbnRTcGFjZXJfKCkpO1xuXG4gICAgICB0b2dnbGUuY2xhc3NOYW1lID0gJ3RvZ2dsZSc7XG4gICAgICB0aXRsZVJvdy5hcHBlbmRDaGlsZCh0b2dnbGUpO1xuXG4gICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZGF0YUNvbnZlcnRlci5jcmVhdGVIZWFkZXIodGhpcy5kYXRhKTtcbiAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJyk7XG4gICAgICB0aXRsZVJvdy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmRhdGFDb252ZXJ0ZXIuaGFzSXRlbXModGhpcy5kYXRhKSkge1xuICAgICAgdG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbXNDb250YWluZXJfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuaXRlbXNDb250YWluZXJfKTtcblxuICAgICAgdGl0bGVSb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlRXhwYW5zaW9uXygpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5zaG93SGVhZGVyKSB7XG4gICAgICB0aGlzLnRvZ2dsZUV4cGFuc2lvbl8oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUluZGVudFNwYWNlcl8oKSB7XG4gICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhY2VyJyk7XG4gICAgc3BhY2VyLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICBzcGFjZXIuc3R5bGUud2lkdGggPSBgJHt0aGlzLmluZGVudCAqIDIwfXB4YDtcbiAgICByZXR1cm4gc3BhY2VyO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVFeHBhbnNpb25fKCkge1xuICAgIHRoaXMuZXhwYW5kZWRfID0gIXRoaXMuZXhwYW5kZWRfO1xuXG4gICAgaWYgKHRoaXMuZXhwYW5kZWRfKSB7XG4gICAgICB0aGlzLmV4cGFuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbGxhcHNlKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZXhwYW5kKCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcbiAgICB0aGlzLmZldGNoaW5nXyA9IHRydWU7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBhd2FpdCB0aGlzLmRhdGFDb252ZXJ0ZXIuZ2V0Q2hpbGRJdGVtcyh0aGlzLmRhdGEpO1xuICAgIHRoaXMuZmV0Y2hpbmdfID0gZmFsc2U7XG4gICAgdGhpcy5wb3B1bGF0ZUNoaWxkcmVuKGNoaWxkcmVuKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9wdWxhdGVDaGlsZHJlbihjaGlsZHJlbjogVFtdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgY29uc3QgaXRlbSA9IFRyZWVJdGVtLmNyZWF0ZShjaGlsZCwgdGhpcy5kYXRhQ29udmVydGVyKTtcbiAgICAgIGlmICh0aGlzLnNob3dIZWFkZXIpIHtcbiAgICAgICAgaXRlbS5pbmRlbnQgPSB0aGlzLmluZGVudCArIDE7XG4gICAgICB9XG4gICAgICBpdGVtLmRhdGFDb252ZXJ0ZXIgPSB0aGlzLmRhdGFDb252ZXJ0ZXI7XG4gICAgICB0aGlzLml0ZW1zQ29udGFpbmVyXy5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICB9XG4gIH1cblxuICBjb2xsYXBzZSgpIHtcbiAgICB3aGlsZSAodGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdleHBhbmRlZCcpO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaChkYXRhOiBUKSB7XG4gICAgaWYgKHRoaXMuZmV0Y2hpbmdfKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgaWYgKHRoaXMuZXhwYW5kZWRfKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGF3YWl0IHRoaXMuZGF0YUNvbnZlcnRlci5nZXRDaGlsZEl0ZW1zKHRoaXMuZGF0YSk7XG4gICAgICB0aGlzLmNvbGxhcHNlKCk7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICB0aGlzLnBvcHVsYXRlQ2hpbGRyZW4oY2hpbGRyZW4pO1xuICAgIH1cbiAgfVxufVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoXG4gIFRyZWVJdGVtLmlzLCBUcmVlSXRlbSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiLCJpbXBvcnQge2luc3BlY3QsIGluc3BlY3RTcGVjLCByZWZyZXNofSBmcm9tICcuL2luc3BlY3QnO1xuaW1wb3J0ICogYXMgd2lyZSBmcm9tICcuL3dpcmUnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgICBpbnNwZWN0KHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG4gICAgICBpbnNwZWN0U3BlYyhpZDogc3RyaW5nLCBqc29uOiB3aXJlLlNwZWMsIHNob3dIZWFkZXI6IGJvb2xlYW4pOiB2b2lkO1xuICAgICAgcmVmcmVzaEluc3BlY3RvcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuICAgIH1cbn1cblxud2luZG93Lmluc3BlY3QgPSBpbnNwZWN0O1xud2luZG93LnJlZnJlc2hJbnNwZWN0b3IgPSByZWZyZXNoO1xud2luZG93Lmluc3BlY3RTcGVjID0gaW5zcGVjdFNwZWM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L21haW4udHMiLCJpbXBvcnQgKiBhcyBzZXJ2aWNlIGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQge0FjY2Vzc29yVHlwZSwgS2V5LCBQYXRofSBmcm9tICcuL3BhdGgnO1xuaW1wb3J0IHtTcGVjfSBmcm9tICcuL3NwZWNzJztcbmltcG9ydCB7VHJlZUl0ZW19IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge1NwZWNJdGVtQ29udmVydGVyfSBmcm9tICcuL3NwZWNfaXRlbV9jb252ZXJ0ZXInO1xuaW1wb3J0ICogYXMgd2lyZSBmcm9tICcuL3dpcmUnO1xuXG5jb25zdCBpbnNwZWN0b3JzID0gbmV3IE1hcDxzdHJpbmcsIFRyZWVJdGVtPFNwZWM+PigpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5zcGVjdChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IHBhdGggPSBuZXcgUGF0aChbbmV3IEtleShpZCwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpXSlcblxuICBjb25zdCBqc29uID0gYXdhaXQgc2VydmljZS5nZXRTcGVjKHBhdGgpO1xuICBjb25zdCBzcGVjID0gU3BlYy5jcmVhdGUocGF0aCwganNvbik7XG5cbiAgY29uc3QgdHJlZSA9IFRyZWVJdGVtLmNyZWF0ZShzcGVjLCBuZXcgU3BlY0l0ZW1Db252ZXJ0ZXIoKSk7XG4gIGluc3BlY3RvcnMuc2V0KGlkLCB0cmVlKTtcbiAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQtYXJlYScpIGFzIEVsZW1lbnQpLmFwcGVuZENoaWxkKHRyZWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zcGVjdFNwZWMoaWQ6IHN0cmluZywganNvbjogd2lyZS5TcGVjLCBzaG93SGVhZGVyOiBib29sZWFuKSB7XG4gIGNvbnN0IHBhdGggPSBuZXcgUGF0aChbbmV3IEtleShpZCwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpXSk7XG4gIGNvbnN0IHNwZWMgPSBTcGVjLmNyZWF0ZShwYXRoLCBqc29uKTtcbiAgY29uc3QgdHJlZSA9IFRyZWVJdGVtLmNyZWF0ZShzcGVjLCBuZXcgU3BlY0l0ZW1Db252ZXJ0ZXIoKSk7XG4gIHRyZWUuc2hvd0hlYWRlciA9IHNob3dIZWFkZXI7XG4gIGluc3BlY3RvcnMuc2V0KGlkLCB0cmVlKTtcbiAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQtYXJlYScpIGFzIEVsZW1lbnQpLmFwcGVuZENoaWxkKHRyZWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVmcmVzaChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IHRyZWUgPSBpbnNwZWN0b3JzLmdldChpZCk7XG4gIGlmICh0cmVlKSB7XG4gICAgY29uc3QgcGF0aCA9IG5ldyBQYXRoKFtuZXcgS2V5KGlkLCBBY2Nlc3NvclR5cGUuSURFTlRJRklFUildKTtcbiAgICBjb25zdCBqc29uID0gYXdhaXQgc2VydmljZS5nZXRTcGVjKHBhdGgpO1xuXG4gICAgdHJlZS5yZWZyZXNoKFNwZWMuY3JlYXRlKHBhdGgsIGpzb24pKTtcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvaW5zcGVjdC50cyIsImltcG9ydCAqIGFzIHdpcmUgZnJvbSAnLi93aXJlJztcbmltcG9ydCB7QWNjZXNzb3JUeXBlLCBLZXksIFBhdGh9IGZyb20gJy4vcGF0aCc7XG5pbXBvcnQgKiBhcyBzZXJ2aWNlIGZyb20gJy4vc2VydmljZSc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNwYW4odGV4dDogc3RyaW5nLCBjbGFzc2VzOiBzdHJpbmdbXSA9IFtdKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XG4gIGZvciAoY29uc3QgY2xzIG9mIGNsYXNzZXMpIHtcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuICByZXR1cm4gc3Bhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFNwZWMge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBwYXRoOiBQYXRoLCBwcml2YXRlIHJlYWRvbmx5IGpzb246IHdpcmUuU3BlYykge31cblxuICBzdGF0aWMgY3JlYXRlKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuU3BlYykge1xuICAgIHN3aXRjaCAoanNvbi5zcGVjX3R5cGUpIHtcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICByZXR1cm4gbmV3IExpc3RTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5MaXN0U3BlYyk7XG4gICAgICBjYXNlICd0dXBsZSc6XG4gICAgICAgIHJldHVybiBuZXcgVHVwbGVTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5UdXBsZVNwZWMpO1xuICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgIGNhc2UgJ2luc3RhbmNlJzpcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW5jZVNwZWMocGF0aCwganNvbiBhcyB3aXJlLkluc3RhbmNlU3BlYyk7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25TcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5GdW5jdGlvblNwZWMpO1xuICAgICAgY2FzZSAnZGljdCc6XG4gICAgICAgIHJldHVybiBuZXcgRGljdFNwZWMocGF0aCwganNvbiBhcyB3aXJlLkRpY3RTcGVjKTtcbiAgICAgIGNhc2UgJ3ByaW1pdGl2ZSc6XG4gICAgICAgIHJldHVybiBuZXcgUHJpbWl0aXZlU3BlYyhwYXRoLCBqc29uIGFzIHdpcmUuUHJpbWl0aXZlU3BlYyk7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3JTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5FcnJvclNwZWMpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG5ldyBTcGVjKHBhdGgsIGpzb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0eXBlKCk6IHdpcmUuU3BlY1R5cGUge1xuICAgIHJldHVybiA8d2lyZS5TcGVjVHlwZT4odGhpcy5qc29uLnNwZWNfdHlwZSk7XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX1gLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgOiBgLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnR5cGV9YCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBzaG9ydERlc2NyaXB0aW9uKHByZXZpZXc6IGJvb2xlYW4pOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGNyZWF0ZVNwYW4oYCR7dGhpcy50eXBlfWApO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRTcGVjcygpOiBQcm9taXNlPFNwZWNbXT4ge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5hYnN0cmFjdCBjbGFzcyBTZXF1ZW5jZVNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgc2VxdWVuY2U6IHdpcmUuU2VxdWVuY2VTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuU2VxdWVuY2VTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnNlcXVlbmNlID0ganNvbjtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zZXF1ZW5jZS5sZW5ndGg7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNlcXVlbmNlLmxlbmd0aDtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24ocHJldmlldzogYm9vbGVhbik6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbignJylcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCgke3RoaXMubGVuZ3RofSkke3RoaXMub3BlbkJyYWNrZXR9YCkpO1xuICAgIGlmICghcHJldmlldykge1xuICAgICAgY29uc3QgaXRlbXMgPSBbLi4udGhpcy5zZXF1ZW5jZS5pdGVtc107XG4gICAgICBpdGVtcy5sZW5ndGggPSBNYXRoLm1pbihpdGVtcy5sZW5ndGgsIDEwKTtcblxuICAgICAgY29uc3Qgc3BlY3MgPSBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGggPVxuICAgICAgICAgICAgdGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KFN0cmluZyhpbmRleCksIEFjY2Vzc29yVHlwZS5JTkRFWEVSKSk7XG4gICAgICAgIHJldHVybiBTcGVjLmNyZWF0ZShwYXRoLCBpdGVtKTtcbiAgICAgIH0pO1xuXG4gICAgICBzcGVjcy5mb3JFYWNoKChzcGVjLCBpbmRleCkgPT4ge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHNwZWMuc2hvcnREZXNjcmlwdGlvbih0cnVlKSk7XG4gICAgICAgIGlmIChpbmRleCA8IHNwZWNzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuc2VxdWVuY2UubGVuZ3RoID4gc3BlY3MubGVuZ3RoKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCBcXHUyMDI2JykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3Bhbih0aGlzLmNsb3NlQnJhY2tldCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG5cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX06IGApKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2hvcnREZXNjcmlwdGlvbihmYWxzZSkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIGNvbnN0IGxlbmd0aCA9IE1hdGgubWluKHRoaXMuc2VxdWVuY2UubGVuZ3RoLCAxMDApO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgcGF0aHMucHVzaCh0aGlzLnBhdGguY3JlYXRlKG5ldyBLZXkoaSwgQWNjZXNzb3JUeXBlLklOREVYRVIpKSk7XG4gICAgfVxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkU3BlY3MoKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgICBsZXQganNvbiA9IHRoaXMuc2VxdWVuY2U7XG4gICAgaWYgKHRoaXMuc2VxdWVuY2UucGFydGlhbCkge1xuICAgICAganNvbiA9IDx3aXJlLlNlcXVlbmNlU3BlYz4oYXdhaXQgc2VydmljZS5nZXRTcGVjKHRoaXMucGF0aCkpO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgcGF0aCA9IHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShpLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpO1xuICAgICAgY2hpbGRyZW4ucHVzaChTcGVjLmNyZWF0ZShwYXRoLCBqc29uLml0ZW1zW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIGFic3RyYWN0IGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBjbG9zZUJyYWNrZXQoKTogc3RyaW5nO1xufVxuXG5jbGFzcyBMaXN0U3BlYyBleHRlbmRzIFNlcXVlbmNlU3BlYyB7XG4gIGxpc3Q6IHdpcmUuTGlzdFNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5MaXN0U3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5saXN0ID0ganNvbjtcbiAgfVxuXG4gIGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnWyc7XG4gIH1cbiAgZ2V0IGNsb3NlQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnXSc7XG4gIH1cbn1cblxuY2xhc3MgVHVwbGVTcGVjIGV4dGVuZHMgU2VxdWVuY2VTcGVjIHtcbiAgdHVwbGU6IHdpcmUuVHVwbGVTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuVHVwbGVTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnR1cGxlID0ganNvbjtcbiAgfVxuXG4gIGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnKCc7XG4gIH1cbiAgZ2V0IGNsb3NlQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnKSc7XG4gIH1cbn1cblxuY2xhc3MgSW5zdGFuY2VTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGluc3RhbmNlOiB3aXJlLkluc3RhbmNlU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkluc3RhbmNlU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5pbnN0YW5jZSA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMuaW5zdGFuY2UudHlwZX1gKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmluc3RhbmNlLmxlbmd0aDtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pbnN0YW5jZS5jb250ZW50cylcbiAgICAgICAgLnNvcnQoY29tcGFyZVB5dGhvbklkZW50aWZpZXJzKVxuICAgICAgICAubWFwKChpZGVudGlmaWVyKSA9PiBuZXcgS2V5KGlkZW50aWZpZXIsIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKSlcbiAgICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLnBhdGguY3JlYXRlKGtleSkpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRTcGVjcygpOiBQcm9taXNlPFNwZWNbXT4ge1xuICAgIGxldCBqc29uID0gdGhpcy5pbnN0YW5jZTtcbiAgICBpZiAoanNvbi5wYXJ0aWFsKSB7XG4gICAgICBqc29uID0gPHdpcmUuSW5zdGFuY2VTcGVjPihhd2FpdCBzZXJ2aWNlLmdldFNwZWModGhpcy5wYXRoKSk7XG4gICAgfVxuICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGpzb24uY29udGVudHMpXG4gICAgICAuc29ydChjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnBhdGguY3JlYXRlKG5ldyBLZXkoa2V5LCBBY2Nlc3NvclR5cGUuSURFTlRJRklFUikpO1xuICAgICAgY2hpbGRyZW4ucHVzaChTcGVjLmNyZWF0ZShwYXRoLCBqc29uLmNvbnRlbnRzW2tleV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG59XG5cbmNsYXNzIEZ1bmN0aW9uU3BlYyBleHRlbmRzIFNwZWMge1xuICBmbjogd2lyZS5GdW5jdGlvblNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5GdW5jdGlvblNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZm4gPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgLCBbXSk7XG4gICAgZWxlbWVudC50aXRsZSA9IHRoaXMuZm4uZG9jcztcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfShgLCBbXSkpO1xuXG4gICAgY29uc3QgYXJncyA9IHRoaXMuZm4uYXJndW1lbnRzO1xuXG4gICAgYXJncy5mb3JFYWNoKChhcmcsIGluZGV4KSA9PiB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYXJnLCBbJ2FyZ3VtZW50J10pKTtcbiAgICAgIGlmIChpbmRleCA8IGFyZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignKScpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jbGFzcyBEaWN0U3BlYyBleHRlbmRzIFNwZWMge1xuICBkaWN0OiB3aXJlLkRpY3RTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuRGljdFNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZGljdCA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfWAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX0ge2AsIFtdKSk7XG5cbiAgICBjb25zdCBrZXlzID0gdGhpcy5rZXlzO1xuICAgIGtleXMubGVuZ3RoID0gTWF0aC5taW4oa2V5cy5sZW5ndGgsIDEwKTtcblxuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKFN0cmluZyhrZXkubmFtZSksIFtdKSk7XG4gICAgICBpZiAoaW5kZXggPCBrZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcsICcpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJ30nKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaWN0Lmxlbmd0aCA+IDA7XG4gIH1cblxuICBhc3luYyBnZXRDaGlsZFNwZWNzKCk6IFByb21pc2U8U3BlY1tdPiB7XG4gICAgbGV0IGpzb24gPSB0aGlzLmRpY3Q7XG4gICAgaWYgKHRoaXMuZGljdC5wYXJ0aWFsKSB7XG4gICAgICBqc29uID0gPHdpcmUuRGljdFNwZWM+KGF3YWl0IHNlcnZpY2UuZ2V0U3BlYyh0aGlzLnBhdGgpKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoanNvbi5jb250ZW50cylcbiAgICAgIC5zb3J0KGNvbXBhcmVQeXRob25JZGVudGlmaWVycyk7XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgY29uc3QgcGF0aCA9IHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShrZXksIEFjY2Vzc29yVHlwZS5LRVkpKTtcbiAgICAgIGNoaWxkcmVuLnB1c2goU3BlYy5jcmVhdGUocGF0aCwganNvbi5jb250ZW50c1trZXldKSk7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIGdldCBrZXlzKCk6IEtleVtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5kaWN0LmNvbnRlbnRzKVxuICAgICAgICAuc29ydChjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMpXG4gICAgICAgIC5tYXAoKGlkZW50aWZpZXIpID0+IG5ldyBLZXkoaWRlbnRpZmllciwgQWNjZXNzb3JUeXBlLktFWSkpO1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIHJldHVybiB0aGlzLmtleXMubWFwKChrZXkpID0+IHRoaXMucGF0aC5jcmVhdGUoa2V5KSk7XG4gIH1cbn1cblxuY2xhc3MgUHJpbWl0aXZlU3BlYyBleHRlbmRzIFNwZWMge1xuICBwcmltaXRpdmU6IHdpcmUuUHJpbWl0aXZlU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLlByaW1pdGl2ZVNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMucHJpbWl0aXZlID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCwgW10pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNob3J0RGVzY3JpcHRpb24oZmFsc2UpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24ocHJldmlldzogYm9vbGVhbik6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAocHJldmlldykge1xuICAgICAgcmV0dXJuIHRoaXMuYXNFbGVtZW50KDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuYXNFbGVtZW50KDEwMCk7XG4gICAgfVxuICB9XG5cbiAgYXNFbGVtZW50KGxlbmd0aDogbnVtYmVyKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgKTtcbiAgICBpZiAodGhpcy5wcmltaXRpdmUudHlwZSA9PT0gJ3N0cicpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXCJgLCBbJ3R5cGUtc3RyJ10pKTtcbiAgICB9XG4gICAgbGV0IHN0ciA9IHRoaXMucHJpbWl0aXZlLmRlc2NyaXB0aW9uO1xuICAgIGlmIChzdHIubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIGxlbmd0aCkgKyAnXFx1MjAyNic7XG4gICAgfVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihzdHIsIFtgdHlwZS0ke3RoaXMucHJpbWl0aXZlLnR5cGV9YF0pKTtcbiAgICBpZiAodGhpcy5wcmltaXRpdmUudHlwZSA9PT0gJ3N0cicpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXCJgLCBbJ3R5cGUtc3RyJ10pKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuY2xhc3MgRXJyb3JTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGVycm9yOiB3aXJlLkVycm9yU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkVycm9yU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5lcnJvciA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX0gLSAke3RoaXMuZXJyb3IuZXJyb3J9YCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG4vKiogQ29tcGFyZXMgdHdvIFB5dGhvbiBpZGVudGlmaWVycywgc29ydGluZyBwcml2YXRlIG1lbWJlcnMgbGFzdC4gICovXG5mdW5jdGlvbiBjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBudW1iZXIge1xuICBhID0gYS5yZXBsYWNlKC9fL2csICdcXHUyMDI2Jyk7XG4gIGIgPSBiLnJlcGxhY2UoL18vZywgJ1xcdTIwMjYnKTtcbiAgaWYgKGEgPT09IGIpIHJldHVybiAwO1xuICBpZiAoYSA8IGIpIHJldHVybiAtMTtcbiAgcmV0dXJuIDE7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3NwZWNzLnRzIiwiaW1wb3J0IHtUcmVlSXRlbUNvbnZlcnRlcn0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7U3BlY30gZnJvbSAnLi9zcGVjcyc7XG5pbXBvcnQge2dldFNwZWN9IGZyb20gJy4vc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBTcGVjSXRlbUNvbnZlcnRlciBleHRlbmRzIFRyZWVJdGVtQ29udmVydGVyPFNwZWM+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFNwZWMpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGRhdGEuY3JlYXRlSGVhZGVyKCk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBTcGVjKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRhdGEuaGFzSXRlbXMoKTtcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkSXRlbXMoZGF0YTogU3BlYyk6IFByb21pc2U8U3BlY1tdPiB7XG4gICAgcmV0dXJuIGRhdGEuZ2V0Q2hpbGRTcGVjcygpO1xuICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9zcGVjX2l0ZW1fY29udmVydGVyLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==