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
    constructor() {
        super(...arguments);
        this.indent = 0;
        this.expanded_ = false;
        this.showHeader = true;
        this.fetching_ = false;
    }
    static create(data, dataConverter) {
        const item = document.createElement(TreeItem.is);
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
document.registerElement('inspect-tree-item', TreeItem);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTBjZmI4Zjg4MGM3NmZlNTIyOGEiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvcGF0aC50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9tYWluLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvaW5zcGVjdC50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3NwZWNzLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvc3BlY19pdGVtX2NvbnZlcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFEQSxpQkFBOEIsSUFBVTs7UUFDdEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQ25ELHFDQUFxQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxN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LENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNELE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0NBQ0Y7QUFHRCxrQ0FBa0MsQ0FBUyxFQUFFLENBQVM7SUFDcEQsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1WEQsc0NBQXlDO0FBSXpDLHVCQUErQixTQUFRLHdCQUF1QjtJQUM1RCxZQUFZLENBQUMsSUFBVTtRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBVTtRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFSyxhQUFhLENBQUMsSUFBVTs7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM5QixDQUFDO0tBQUE7Q0FDRjtBQVpELDhDQVlDIiwiZmlsZSI6Imluc3BlY3Rvci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhMGNmYjhmODgwYzc2ZmU1MjI4YSIsImltcG9ydCB7UGF0aH0gZnJvbSAnLi9wYXRoJztcbmltcG9ydCAqIGFzIHdpcmUgZnJvbSAnLi93aXJlJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNwZWMocGF0aDogUGF0aCk6IFByb21pc2U8d2lyZS5TcGVjPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdvb2dsZS5jb2xhYi5rZXJuZWwuaW52b2tlRnVuY3Rpb24oXG4gICAgICAnaW5zcGVjdC5jcmVhdGVfc3BlY2lmaWNhdGlvbl9mb3JfanMnLCBbW3BhdGgudG9TdHJpbmcoKV1dLCB7fSk7XG4gIGlmIChyZXN1bHQuc3RhdHVzICE9PSAnb2snKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lbmFtZSk7XG4gIH1cbiAgY29uc3Qgc3BlY0pzb24gPSByZXN1bHQuZGF0YVsnYXBwbGljYXRpb24vanNvbiddIGFzIHdpcmUuU3BlY1tdO1xuICByZXR1cm4gc3BlY0pzb25bMF07XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9zZXJ2aWNlLnRzIiwiZXhwb3J0IGVudW0gQWNjZXNzb3JUeXBlIHtcbiAgSURFTlRJRklFUixcbiAgSU5ERVhFUixcbiAgS0VZLFxufVxuXG5leHBvcnQgY2xhc3MgS2V5IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogc3RyaW5nfG51bWJlciwgcmVhZG9ubHkgdHlwZTogQWNjZXNzb3JUeXBlKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUGF0aCB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGtleXM6IEtleVtdKSB7fVxuXG4gIGNyZWF0ZShrZXk6IEtleSkge1xuICAgIHJldHVybiBuZXcgUGF0aChbLi4udGhpcy5rZXlzLCBrZXldKTtcbiAgfVxuXG4gIGdldCBrZXkoKTogS2V5IHtcbiAgICByZXR1cm4gdGhpcy5rZXlzW3RoaXMua2V5cy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgbGV0IHBhdGggPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMua2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5rZXlzW2ldO1xuICAgICAgc3dpdGNoIChrZXkudHlwZSkge1xuICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSOlxuICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgcGF0aCA9IHBhdGggKyAnLic7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhdGggPSBwYXRoICsga2V5Lm5hbWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLklOREVYRVI6XG4gICAgICAgICAgcGF0aCA9IGAke3BhdGh9WyR7a2V5Lm5hbWV9XWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLktFWTpcbiAgICAgICAgICBwYXRoID0gYCR7cGF0aH1bXCIke2tleS5uYW1lfVwiXWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3BhdGgudHMiLCJleHBvcnQgY2xhc3MgVHJlZUl0ZW1Db252ZXJ0ZXI8VD4ge1xuICBjcmVhdGVIZWFkZXIoZGF0YTogVCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0VGl0bGUoZGF0YSk7XG4gICAgcmV0dXJuIHRpdGxlO1xuICB9XG5cbiAgZ2V0VGl0bGUoZGF0YTogVCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0cmluZyhkYXRhKTtcbiAgfVxuXG4gIGhhc0l0ZW1zKGRhdGE6IFQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyBnZXRDaGlsZEl0ZW1zKGRhdGE6IFQpOiBQcm9taXNlPFRbXT4ge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBUcmVlSXRlbTxUPiBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgcHJpdmF0ZSBkYXRhOiBUO1xuICBkYXRhQ29udmVydGVyOiBUcmVlSXRlbUNvbnZlcnRlcjxUPjtcbiAgaW5kZW50ID0gMDtcbiAgZXhwYW5kZWRfID0gZmFsc2U7XG4gIHNob3dIZWFkZXIgPSB0cnVlO1xuICBpdGVtc0NvbnRhaW5lcl86IEVsZW1lbnQ7XG4gIHByaXZhdGUgZmV0Y2hpbmdfID0gZmFsc2U7XG5cbiAgc3RhdGljIGlzID0gJ2luc3BlY3QtdHJlZS1pdGVtJztcblxuICBzdGF0aWMgY3JlYXRlPFQ+KGRhdGE6IFQsIGRhdGFDb252ZXJ0ZXI6IFRyZWVJdGVtQ29udmVydGVyPFQ+KTogVHJlZUl0ZW08VD4ge1xuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFRyZWVJdGVtLmlzKSBhcyBUcmVlSXRlbTxUPjtcbiAgICBpdGVtLmRhdGEgPSBkYXRhO1xuICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IGRhdGFDb252ZXJ0ZXI7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgIHRoaXMuc2hvd0hlYWRlciA9IHRydWU7XG4gICAgdGhpcy5mZXRjaGluZ18gPSBmYWxzZTtcbiAgfVxuXG4gIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgdGl0bGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpZiAodGhpcy5zaG93SGVhZGVyKSB7XG4gICAgICB0aXRsZVJvdy5jbGFzc0xpc3QuYWRkKCd0aXRsZS1yb3cnKTtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGl0bGVSb3cpO1xuXG4gICAgICB0aXRsZVJvdy5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUluZGVudFNwYWNlcl8oKSk7XG5cbiAgICAgIHRvZ2dsZS5jbGFzc05hbWUgPSAndG9nZ2xlJztcbiAgICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRvZ2dsZSk7XG5cbiAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5kYXRhQ29udmVydGVyLmNyZWF0ZUhlYWRlcih0aGlzLmRhdGEpO1xuICAgICAgdGl0bGUuY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGF0YUNvbnZlcnRlci5oYXNJdGVtcyh0aGlzLmRhdGEpKSB7XG4gICAgICB0b2dnbGUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lcl8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5pdGVtc0NvbnRhaW5lcl8pO1xuXG4gICAgICB0aXRsZVJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVFeHBhbnNpb25fKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnNob3dIZWFkZXIpIHtcbiAgICAgIHRoaXMudG9nZ2xlRXhwYW5zaW9uXygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSW5kZW50U3BhY2VyXygpIHtcbiAgICBjb25zdCBzcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFjZXInKTtcbiAgICBzcGFjZXIuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgIHNwYWNlci5zdHlsZS53aWR0aCA9IGAke3RoaXMuaW5kZW50ICogMjB9cHhgO1xuICAgIHJldHVybiBzcGFjZXI7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUV4cGFuc2lvbl8oKSB7XG4gICAgdGhpcy5leHBhbmRlZF8gPSAhdGhpcy5leHBhbmRlZF87XG5cbiAgICBpZiAodGhpcy5leHBhbmRlZF8pIHtcbiAgICAgIHRoaXMuZXhwYW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29sbGFwc2UoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBleHBhbmQoKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcpO1xuICAgIHRoaXMuZmV0Y2hpbmdfID0gdHJ1ZTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IGF3YWl0IHRoaXMuZGF0YUNvbnZlcnRlci5nZXRDaGlsZEl0ZW1zKHRoaXMuZGF0YSk7XG4gICAgdGhpcy5mZXRjaGluZ18gPSBmYWxzZTtcbiAgICB0aGlzLnBvcHVsYXRlQ2hpbGRyZW4oY2hpbGRyZW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBwb3B1bGF0ZUNoaWxkcmVuKGNoaWxkcmVuOiBUW10pIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBpdGVtID0gVHJlZUl0ZW0uY3JlYXRlKGNoaWxkLCB0aGlzLmRhdGFDb252ZXJ0ZXIpO1xuICAgICAgaWYgKHRoaXMuc2hvd0hlYWRlcikge1xuICAgICAgICBpdGVtLmluZGVudCA9IHRoaXMuaW5kZW50ICsgMTtcbiAgICAgIH1cbiAgICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IHRoaXMuZGF0YUNvbnZlcnRlcjtcbiAgICAgIHRoaXMuaXRlbXNDb250YWluZXJfLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbGxhcHNlKCkge1xuICAgIHdoaWxlICh0aGlzLml0ZW1zQ29udGFpbmVyXy5sYXN0RWxlbWVudENoaWxkKSB7XG4gICAgICB0aGlzLml0ZW1zQ29udGFpbmVyXy5sYXN0RWxlbWVudENoaWxkLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2V4cGFuZGVkJyk7XG4gIH1cblxuICBhc3luYyByZWZyZXNoKGRhdGE6IFQpIHtcbiAgICBpZiAodGhpcy5mZXRjaGluZ18pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICBpZiAodGhpcy5leHBhbmRlZF8pIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gYXdhaXQgdGhpcy5kYXRhQ29udmVydGVyLmdldENoaWxkSXRlbXModGhpcy5kYXRhKTtcbiAgICAgIHRoaXMuY29sbGFwc2UoKTtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcbiAgICAgIHRoaXMucG9wdWxhdGVDaGlsZHJlbihjaGlsZHJlbik7XG4gICAgfVxuICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnaW5zcGVjdC10cmVlLWl0ZW0nLCBUcmVlSXRlbSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiLCJpbXBvcnQge2luc3BlY3QsIGluc3BlY3RTcGVjLCByZWZyZXNofSBmcm9tICcuL2luc3BlY3QnO1xuaW1wb3J0ICogYXMgd2lyZSBmcm9tICcuL3dpcmUnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgICBpbnNwZWN0KHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG4gICAgICBpbnNwZWN0U3BlYyhpZDogc3RyaW5nLCBqc29uOiB3aXJlLlNwZWMsIHNob3dIZWFkZXI6IGJvb2xlYW4pOiB2b2lkO1xuICAgICAgcmVmcmVzaEluc3BlY3RvcihwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuICAgIH1cbn1cblxud2luZG93Lmluc3BlY3QgPSBpbnNwZWN0O1xud2luZG93LnJlZnJlc2hJbnNwZWN0b3IgPSByZWZyZXNoO1xud2luZG93Lmluc3BlY3RTcGVjID0gaW5zcGVjdFNwZWM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L21haW4udHMiLCJpbXBvcnQgKiBhcyBzZXJ2aWNlIGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQge0FjY2Vzc29yVHlwZSwgS2V5LCBQYXRofSBmcm9tICcuL3BhdGgnO1xuaW1wb3J0IHtTcGVjfSBmcm9tICcuL3NwZWNzJztcbmltcG9ydCB7VHJlZUl0ZW19IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge1NwZWNJdGVtQ29udmVydGVyfSBmcm9tICcuL3NwZWNfaXRlbV9jb252ZXJ0ZXInO1xuaW1wb3J0ICogYXMgd2lyZSBmcm9tICcuL3dpcmUnO1xuXG5jb25zdCBpbnNwZWN0b3JzID0gbmV3IE1hcDxzdHJpbmcsIFRyZWVJdGVtPFNwZWM+PigpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5zcGVjdChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IHBhdGggPSBuZXcgUGF0aChbbmV3IEtleShpZCwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpXSlcblxuICBjb25zdCBqc29uID0gYXdhaXQgc2VydmljZS5nZXRTcGVjKHBhdGgpO1xuICBjb25zdCBzcGVjID0gU3BlYy5jcmVhdGUocGF0aCwganNvbik7XG5cbiAgY29uc3QgdHJlZSA9IFRyZWVJdGVtLmNyZWF0ZShzcGVjLCBuZXcgU3BlY0l0ZW1Db252ZXJ0ZXIoKSk7XG4gIGluc3BlY3RvcnMuc2V0KGlkLCB0cmVlKTtcbiAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQtYXJlYScpIGFzIEVsZW1lbnQpLmFwcGVuZENoaWxkKHRyZWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zcGVjdFNwZWMoaWQ6IHN0cmluZywganNvbjogd2lyZS5TcGVjLCBzaG93SGVhZGVyOiBib29sZWFuKSB7XG4gIGNvbnN0IHBhdGggPSBuZXcgUGF0aChbbmV3IEtleShpZCwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpXSk7XG4gIGNvbnN0IHNwZWMgPSBTcGVjLmNyZWF0ZShwYXRoLCBqc29uKTtcbiAgY29uc3QgdHJlZSA9IFRyZWVJdGVtLmNyZWF0ZShzcGVjLCBuZXcgU3BlY0l0ZW1Db252ZXJ0ZXIoKSk7XG4gIHRyZWUuc2hvd0hlYWRlciA9IHNob3dIZWFkZXI7XG4gIGluc3BlY3RvcnMuc2V0KGlkLCB0cmVlKTtcbiAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQtYXJlYScpIGFzIEVsZW1lbnQpLmFwcGVuZENoaWxkKHRyZWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVmcmVzaChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IHRyZWUgPSBpbnNwZWN0b3JzLmdldChpZCk7XG4gIGlmICh0cmVlKSB7XG4gICAgY29uc3QgcGF0aCA9IG5ldyBQYXRoKFtuZXcgS2V5KGlkLCBBY2Nlc3NvclR5cGUuSURFTlRJRklFUildKTtcbiAgICBjb25zdCBqc29uID0gYXdhaXQgc2VydmljZS5nZXRTcGVjKHBhdGgpO1xuXG4gICAgdHJlZS5yZWZyZXNoKFNwZWMuY3JlYXRlKHBhdGgsIGpzb24pKTtcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvaW5zcGVjdC50cyIsImltcG9ydCAqIGFzIHdpcmUgZnJvbSAnLi93aXJlJztcbmltcG9ydCB7QWNjZXNzb3JUeXBlLCBLZXksIFBhdGh9IGZyb20gJy4vcGF0aCc7XG5pbXBvcnQgKiBhcyBzZXJ2aWNlIGZyb20gJy4vc2VydmljZSc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNwYW4odGV4dDogc3RyaW5nLCBjbGFzc2VzOiBzdHJpbmdbXSA9IFtdKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XG4gIGZvciAoY29uc3QgY2xzIG9mIGNsYXNzZXMpIHtcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuICByZXR1cm4gc3Bhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFNwZWMge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBwYXRoOiBQYXRoLCBwcml2YXRlIHJlYWRvbmx5IGpzb246IHdpcmUuU3BlYykge31cblxuICBzdGF0aWMgY3JlYXRlKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuU3BlYykge1xuICAgIHN3aXRjaCAoanNvbi5zcGVjX3R5cGUpIHtcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICByZXR1cm4gbmV3IExpc3RTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5MaXN0U3BlYyk7XG4gICAgICBjYXNlICd0dXBsZSc6XG4gICAgICAgIHJldHVybiBuZXcgVHVwbGVTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5UdXBsZVNwZWMpO1xuICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgIGNhc2UgJ2luc3RhbmNlJzpcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW5jZVNwZWMocGF0aCwganNvbiBhcyB3aXJlLkluc3RhbmNlU3BlYyk7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25TcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5GdW5jdGlvblNwZWMpO1xuICAgICAgY2FzZSAnZGljdCc6XG4gICAgICAgIHJldHVybiBuZXcgRGljdFNwZWMocGF0aCwganNvbiBhcyB3aXJlLkRpY3RTcGVjKTtcbiAgICAgIGNhc2UgJ3ByaW1pdGl2ZSc6XG4gICAgICAgIHJldHVybiBuZXcgUHJpbWl0aXZlU3BlYyhwYXRoLCBqc29uIGFzIHdpcmUuUHJpbWl0aXZlU3BlYyk7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3JTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5FcnJvclNwZWMpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG5ldyBTcGVjKHBhdGgsIGpzb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0eXBlKCk6IHdpcmUuU3BlY1R5cGUge1xuICAgIHJldHVybiA8d2lyZS5TcGVjVHlwZT4odGhpcy5qc29uLnNwZWNfdHlwZSk7XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX1gLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgOiBgLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnR5cGV9YCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBzaG9ydERlc2NyaXB0aW9uKHByZXZpZXc6IGJvb2xlYW4pOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGNyZWF0ZVNwYW4oYCR7dGhpcy50eXBlfWApO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRTcGVjcygpOiBQcm9taXNlPFNwZWNbXT4ge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5hYnN0cmFjdCBjbGFzcyBTZXF1ZW5jZVNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgc2VxdWVuY2U6IHdpcmUuU2VxdWVuY2VTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuU2VxdWVuY2VTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnNlcXVlbmNlID0ganNvbjtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zZXF1ZW5jZS5sZW5ndGg7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNlcXVlbmNlLmxlbmd0aDtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24ocHJldmlldzogYm9vbGVhbik6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbignJylcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCgke3RoaXMubGVuZ3RofSkke3RoaXMub3BlbkJyYWNrZXR9YCkpO1xuICAgIGlmICghcHJldmlldykge1xuICAgICAgY29uc3QgaXRlbXMgPSBbLi4udGhpcy5zZXF1ZW5jZS5pdGVtc107XG4gICAgICBpdGVtcy5sZW5ndGggPSBNYXRoLm1pbihpdGVtcy5sZW5ndGgsIDEwKTtcblxuICAgICAgY29uc3Qgc3BlY3MgPSBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGggPVxuICAgICAgICAgICAgdGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KFN0cmluZyhpbmRleCksIEFjY2Vzc29yVHlwZS5JTkRFWEVSKSk7XG4gICAgICAgIHJldHVybiBTcGVjLmNyZWF0ZShwYXRoLCBpdGVtKTtcbiAgICAgIH0pO1xuXG4gICAgICBzcGVjcy5mb3JFYWNoKChzcGVjLCBpbmRleCkgPT4ge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHNwZWMuc2hvcnREZXNjcmlwdGlvbih0cnVlKSk7XG4gICAgICAgIGlmIChpbmRleCA8IHNwZWNzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuc2VxdWVuY2UubGVuZ3RoID4gc3BlY3MubGVuZ3RoKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCBcXHUyMDI2JykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3Bhbih0aGlzLmNsb3NlQnJhY2tldCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG5cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX06IGApKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2hvcnREZXNjcmlwdGlvbihmYWxzZSkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIGNvbnN0IGxlbmd0aCA9IE1hdGgubWluKHRoaXMuc2VxdWVuY2UubGVuZ3RoLCAxMDApO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgcGF0aHMucHVzaCh0aGlzLnBhdGguY3JlYXRlKG5ldyBLZXkoaSwgQWNjZXNzb3JUeXBlLklOREVYRVIpKSk7XG4gICAgfVxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkU3BlY3MoKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgICBsZXQganNvbiA9IHRoaXMuc2VxdWVuY2U7XG4gICAgaWYgKHRoaXMuc2VxdWVuY2UucGFydGlhbCkge1xuICAgICAganNvbiA9IDx3aXJlLlNlcXVlbmNlU3BlYz4oYXdhaXQgc2VydmljZS5nZXRTcGVjKHRoaXMucGF0aCkpO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgcGF0aCA9IHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShpLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpO1xuICAgICAgY2hpbGRyZW4ucHVzaChTcGVjLmNyZWF0ZShwYXRoLCBqc29uLml0ZW1zW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIGFic3RyYWN0IGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBjbG9zZUJyYWNrZXQoKTogc3RyaW5nO1xufVxuXG5jbGFzcyBMaXN0U3BlYyBleHRlbmRzIFNlcXVlbmNlU3BlYyB7XG4gIGxpc3Q6IHdpcmUuTGlzdFNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5MaXN0U3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5saXN0ID0ganNvbjtcbiAgfVxuXG4gIGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnWyc7XG4gIH1cbiAgZ2V0IGNsb3NlQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnXSc7XG4gIH1cbn1cblxuY2xhc3MgVHVwbGVTcGVjIGV4dGVuZHMgU2VxdWVuY2VTcGVjIHtcbiAgdHVwbGU6IHdpcmUuVHVwbGVTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuVHVwbGVTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnR1cGxlID0ganNvbjtcbiAgfVxuXG4gIGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnKCc7XG4gIH1cbiAgZ2V0IGNsb3NlQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnKSc7XG4gIH1cbn1cblxuY2xhc3MgSW5zdGFuY2VTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGluc3RhbmNlOiB3aXJlLkluc3RhbmNlU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkluc3RhbmNlU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5pbnN0YW5jZSA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMuaW5zdGFuY2UudHlwZX1gKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmluc3RhbmNlLmxlbmd0aDtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pbnN0YW5jZS5jb250ZW50cylcbiAgICAgICAgLnNvcnQoY29tcGFyZVB5dGhvbklkZW50aWZpZXJzKVxuICAgICAgICAubWFwKChpZGVudGlmaWVyKSA9PiBuZXcgS2V5KGlkZW50aWZpZXIsIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKSlcbiAgICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLnBhdGguY3JlYXRlKGtleSkpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRTcGVjcygpOiBQcm9taXNlPFNwZWNbXT4ge1xuICAgIGxldCBqc29uID0gdGhpcy5pbnN0YW5jZTtcbiAgICBpZiAoanNvbi5wYXJ0aWFsKSB7XG4gICAgICBqc29uID0gPHdpcmUuSW5zdGFuY2VTcGVjPihhd2FpdCBzZXJ2aWNlLmdldFNwZWModGhpcy5wYXRoKSk7XG4gICAgfVxuICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGpzb24uY29udGVudHMpXG4gICAgICAuc29ydChjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnBhdGguY3JlYXRlKG5ldyBLZXkoa2V5LCBBY2Nlc3NvclR5cGUuSURFTlRJRklFUikpO1xuICAgICAgY2hpbGRyZW4ucHVzaChTcGVjLmNyZWF0ZShwYXRoLCBqc29uLmNvbnRlbnRzW2tleV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG59XG5cbmNsYXNzIEZ1bmN0aW9uU3BlYyBleHRlbmRzIFNwZWMge1xuICBmbjogd2lyZS5GdW5jdGlvblNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5GdW5jdGlvblNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZm4gPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgLCBbXSk7XG4gICAgZWxlbWVudC50aXRsZSA9IHRoaXMuZm4uZG9jcztcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfShgLCBbXSkpO1xuXG4gICAgY29uc3QgYXJncyA9IHRoaXMuZm4uYXJndW1lbnRzO1xuXG4gICAgYXJncy5mb3JFYWNoKChhcmcsIGluZGV4KSA9PiB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYXJnLCBbJ2FyZ3VtZW50J10pKTtcbiAgICAgIGlmIChpbmRleCA8IGFyZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignKScpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jbGFzcyBEaWN0U3BlYyBleHRlbmRzIFNwZWMge1xuICBkaWN0OiB3aXJlLkRpY3RTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuRGljdFNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZGljdCA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfWAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX0ge2AsIFtdKSk7XG5cbiAgICBjb25zdCBrZXlzID0gdGhpcy5rZXlzO1xuICAgIGtleXMubGVuZ3RoID0gTWF0aC5taW4oa2V5cy5sZW5ndGgsIDEwKTtcblxuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKFN0cmluZyhrZXkubmFtZSksIFtdKSk7XG4gICAgICBpZiAoaW5kZXggPCBrZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcsICcpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJ30nKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaWN0Lmxlbmd0aCA+IDA7XG4gIH1cblxuICBhc3luYyBnZXRDaGlsZFNwZWNzKCk6IFByb21pc2U8U3BlY1tdPiB7XG4gICAgbGV0IGpzb24gPSB0aGlzLmRpY3Q7XG4gICAgaWYgKHRoaXMuZGljdC5wYXJ0aWFsKSB7XG4gICAgICBqc29uID0gPHdpcmUuRGljdFNwZWM+KGF3YWl0IHNlcnZpY2UuZ2V0U3BlYyh0aGlzLnBhdGgpKTtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoanNvbi5jb250ZW50cylcbiAgICAgIC5zb3J0KGNvbXBhcmVQeXRob25JZGVudGlmaWVycyk7XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgY29uc3QgcGF0aCA9IHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShrZXksIEFjY2Vzc29yVHlwZS5LRVkpKTtcbiAgICAgIGNoaWxkcmVuLnB1c2goU3BlYy5jcmVhdGUocGF0aCwganNvbi5jb250ZW50c1trZXldKSk7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIGdldCBrZXlzKCk6IEtleVtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5kaWN0LmNvbnRlbnRzKVxuICAgICAgICAuc29ydChjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMpXG4gICAgICAgIC5tYXAoKGlkZW50aWZpZXIpID0+IG5ldyBLZXkoaWRlbnRpZmllciwgQWNjZXNzb3JUeXBlLktFWSkpO1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIHJldHVybiB0aGlzLmtleXMubWFwKChrZXkpID0+IHRoaXMucGF0aC5jcmVhdGUoa2V5KSk7XG4gIH1cbn1cblxuY2xhc3MgUHJpbWl0aXZlU3BlYyBleHRlbmRzIFNwZWMge1xuICBwcmltaXRpdmU6IHdpcmUuUHJpbWl0aXZlU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLlByaW1pdGl2ZVNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMucHJpbWl0aXZlID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCwgW10pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNob3J0RGVzY3JpcHRpb24oZmFsc2UpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24ocHJldmlldzogYm9vbGVhbik6IEhUTUxFbGVtZW50IHtcbiAgICBpZiAocHJldmlldykge1xuICAgICAgcmV0dXJuIHRoaXMuYXNFbGVtZW50KDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuYXNFbGVtZW50KDEwMCk7XG4gICAgfVxuICB9XG5cbiAgYXNFbGVtZW50KGxlbmd0aDogbnVtYmVyKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgKTtcbiAgICBpZiAodGhpcy5wcmltaXRpdmUudHlwZSA9PT0gJ3N0cicpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXCJgLCBbJ3R5cGUtc3RyJ10pKTtcbiAgICB9XG4gICAgbGV0IHN0ciA9IHRoaXMucHJpbWl0aXZlLmRlc2NyaXB0aW9uO1xuICAgIGlmIChzdHIubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIGxlbmd0aCkgKyAnXFx1MjAyNic7XG4gICAgfVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihzdHIsIFtgdHlwZS0ke3RoaXMucHJpbWl0aXZlLnR5cGV9YF0pKTtcbiAgICBpZiAodGhpcy5wcmltaXRpdmUudHlwZSA9PT0gJ3N0cicpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXCJgLCBbJ3R5cGUtc3RyJ10pKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuY2xhc3MgRXJyb3JTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGVycm9yOiB3aXJlLkVycm9yU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkVycm9yU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5lcnJvciA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX0gLSAke3RoaXMuZXJyb3IuZXJyb3J9YCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG4vKiogQ29tcGFyZXMgdHdvIFB5dGhvbiBpZGVudGlmaWVycywgc29ydGluZyBwcml2YXRlIG1lbWJlcnMgbGFzdC4gICovXG5mdW5jdGlvbiBjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBudW1iZXIge1xuICBhID0gYS5yZXBsYWNlKC9fL2csICdcXHUyMDI2Jyk7XG4gIGIgPSBiLnJlcGxhY2UoL18vZywgJ1xcdTIwMjYnKTtcbiAgaWYgKGEgPT09IGIpIHJldHVybiAwO1xuICBpZiAoYSA8IGIpIHJldHVybiAtMTtcbiAgcmV0dXJuIDE7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3NwZWNzLnRzIiwiaW1wb3J0IHtUcmVlSXRlbUNvbnZlcnRlcn0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7U3BlY30gZnJvbSAnLi9zcGVjcyc7XG5pbXBvcnQge2dldFNwZWN9IGZyb20gJy4vc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBTcGVjSXRlbUNvbnZlcnRlciBleHRlbmRzIFRyZWVJdGVtQ29udmVydGVyPFNwZWM+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFNwZWMpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGRhdGEuY3JlYXRlSGVhZGVyKCk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBTcGVjKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRhdGEuaGFzSXRlbXMoKTtcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkSXRlbXMoZGF0YTogU3BlYyk6IFByb21pc2U8U3BlY1tdPiB7XG4gICAgcmV0dXJuIGRhdGEuZ2V0Q2hpbGRTcGVjcygpO1xuICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9zcGVjX2l0ZW1fY29udmVydGVyLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==