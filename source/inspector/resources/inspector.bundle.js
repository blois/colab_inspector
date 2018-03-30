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
const specs_1 = __webpack_require__(1);
function getSpecs(paths) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawPaths = paths.map((path) => path.toString());
        const result = yield google.colab.kernel.invokeFunction('inspect.create_specification_for_js', [rawPaths], {});
        if (result.status !== 'ok') {
            throw new Error(result.ename);
        }
        const data = result.data;
        const specJson = data['application/json'];
        return specJson.map((json, index) => specs_1.Spec.create(paths[index], json));
    });
}
exports.getSpecs = getSpecs;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createSpan(text, classes = []) {
    const span = document.createElement('span');
    span.textContent = text;
    for (const cls of classes) {
        span.classList.add(cls);
    }
    return span;
}
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
    shortDescription() {
        return createSpan(`${this.type}`);
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
    createHeader() {
        const element = createSpan('', []);
        element.appendChild(createSpan(`${this.path.key.name} (${this.length}) ${this.openBracket}`, []));
        const items = [...this.sequence.items];
        items.length = Math.min(items.length, 10);
        const specs = items.map((item, index) => {
            const path = this.path.create(new Key(String(index), AccessorType.INDEXER));
            return Spec.create(path, item);
        });
        specs.forEach((spec, index) => {
            element.appendChild(spec.shortDescription());
            if (index < specs.length - 1) {
                element.appendChild(createSpan(', '));
            }
        });
        if (this.sequence.length > specs.length) {
            element.appendChild(createSpan(', \u2026'));
        }
        element.appendChild(createSpan(this.closeBracket, []));
        return element;
    }
    getChildPaths() {
        const length = Math.min(this.sequence.length, 100);
        const paths = [];
        for (let i = 0; i < length; ++i) {
            paths.push(this.path.create(new Key(i, AccessorType.INDEXER)));
        }
        return paths;
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
        element.appendChild(createSpan(`${this.path.key.name}`));
        element.appendChild(createSpan(`: `));
        element.appendChild(createSpan(`${this.instance.type}`));
        return element;
    }
    hasItems() {
        return !!this.instance.length;
    }
    getChildPaths() {
        return this.instance.keys.sort(comparePythonIdentifiers)
            .map((key) => this.path.create(new Key(key, AccessorType.IDENTIFIER)));
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
        return !!Object.keys(this.dict.contents).length;
    }
    get keys() {
        return Object.keys(this.dict.contents)
            .sort(comparePythonIdentifiers)
            .map((identifier) => new Key(identifier, AccessorType.KEY));
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
        element.appendChild(createSpan(`${this.path.key.name}: `, []));
        element.appendChild(this.asElement(100));
        return element;
    }
    shortDescription() {
        return this.asElement(10);
    }
    asElement(length) {
        const element = createSpan(``);
        if (this.primitive.type === 'str') {
            element.appendChild(createSpan(`"`, ['type-str']));
        }
        let str = this.primitive.string;
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
const service_1 = __webpack_require__(0);
const specs_1 = __webpack_require__(1);
const tree_1 = __webpack_require__(2);
const spec_item_converter_1 = __webpack_require__(5);
const inspectors = new Map();
function inspect(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = new specs_1.Key(path, specs_1.AccessorType.IDENTIFIER);
        const specs = yield service_1.getSpecs([new specs_1.Path([key])]);
        const spec = specs[0];
        const tree = tree_1.TreeItem.create(spec, new spec_item_converter_1.SpecItemConverter());
        inspectors.set(path, tree);
        document.querySelector('#output-area').appendChild(tree);
    });
}
exports.inspect = inspect;
function inspectSpec(id, json, showHeader) {
    const path = new specs_1.Path([new specs_1.Key(id, specs_1.AccessorType.IDENTIFIER)]);
    const spec = specs_1.Spec.create(path, json);
    const tree = tree_1.TreeItem.create(spec, new spec_item_converter_1.SpecItemConverter());
    tree.showHeader = showHeader;
    inspectors.set(id, tree);
    document.querySelector('#output-area').appendChild(tree);
}
exports.inspectSpec = inspectSpec;
function refresh(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const tree = inspectors.get(path);
        if (tree) {
            const key = new specs_1.Key(path, specs_1.AccessorType.IDENTIFIER);
            const specs = yield service_1.getSpecs([new specs_1.Path([key])]);
            const spec = specs[0];
            tree.refresh(spec);
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
const tree_1 = __webpack_require__(2);
const service_1 = __webpack_require__(0);
class SpecItemConverter extends tree_1.TreeItemConverter {
    createHeader(data) {
        return data.createHeader();
    }
    hasItems(data) {
        return data.hasItems();
    }
    getChildItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = data.getChildPaths();
            return service_1.getSpecs(paths);
        });
    }
}
exports.SpecItemConverter = SpecItemConverter;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTVhNTZhZDBhMmVkNjMzMzM4MTQiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvc3BlY3MudHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC90cmVlLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L2luc3BlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zcGVjX2l0ZW1fY29udmVydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBLHVDQUFtQztBQUduQyxrQkFBK0IsS0FBYTs7UUFDMUMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFdEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQ25ELHFDQUFxQyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUs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QUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQztJQUNILENBQUM7Q0FBQTtBQVRELDBCQVNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQ0Qsc0NBQXlDO0FBRXpDLHlDQUFtQztBQUVuQyx1QkFBK0IsU0FBUSx3QkFBdUI7SUFDNUQsWUFBWSxDQUFDLElBQVU7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVU7UUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUssYUFBYSxDQUFDLElBQVU7O1lBQzVCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNuQyxNQUFNLENBQUMsa0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO0tBQUE7Q0FDRjtBQWJELDhDQWFDIiwiZmlsZSI6Imluc3BlY3Rvci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1NWE1NmFkMGEyZWQ2MzMzMzgxNCIsImltcG9ydCB7UGF0aCwgU3BlY30gZnJvbSAnLi9zcGVjcyc7XG5pbXBvcnQgKiBhcyB3aXJlIGZyb20gJy4vc3BlY3NfanNvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTcGVjcyhwYXRoczogUGF0aFtdKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgY29uc3QgcmF3UGF0aHMgPSBwYXRocy5tYXAoKHBhdGgpID0+IHBhdGgudG9TdHJpbmcoKSk7XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ29vZ2xlLmNvbGFiLmtlcm5lbC5pbnZva2VGdW5jdGlvbihcbiAgICAgICdpbnNwZWN0LmNyZWF0ZV9zcGVjaWZpY2F0aW9uX2Zvcl9qcycsIFtyYXdQYXRoc10sIHt9KTtcbiAgaWYgKHJlc3VsdC5zdGF0dXMgIT09ICdvaycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVuYW1lKTtcbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSByZXN1bHQuZGF0YTtcbiAgY29uc3Qgc3BlY0pzb24gPSBkYXRhWydhcHBsaWNhdGlvbi9qc29uJ10gYXMgd2lyZS5TcGVjW107XG4gIC8vICh3aW5kb3cgYXMgYW55KVsnc3BlY0pzb24nXSA9IHNwZWNKc29uO1xuICByZXR1cm4gc3BlY0pzb24ubWFwKChqc29uLCBpbmRleCkgPT4gU3BlYy5jcmVhdGUocGF0aHNbaW5kZXhdLCBqc29uKSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3NlcnZpY2UudHMiLCJpbXBvcnQgKiBhcyB3aXJlIGZyb20gJy4vc3BlY3NfanNvbic7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNwYW4odGV4dDogc3RyaW5nLCBjbGFzc2VzOiBzdHJpbmdbXSA9IFtdKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XG4gIGZvciAoY29uc3QgY2xzIG9mIGNsYXNzZXMpIHtcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuICByZXR1cm4gc3Bhbjtcbn1cblxuZXhwb3J0IGVudW0gQWNjZXNzb3JUeXBlIHtcbiAgSURFTlRJRklFUixcbiAgSU5ERVhFUixcbiAgS0VZLFxufVxuXG5leHBvcnQgY2xhc3MgS2V5IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogc3RyaW5nfG51bWJlciwgcmVhZG9ubHkgdHlwZTogQWNjZXNzb3JUeXBlKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUGF0aCB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGtleXM6IEtleVtdKSB7fVxuXG4gIGNyZWF0ZShrZXk6IEtleSkge1xuICAgIHJldHVybiBuZXcgUGF0aChbLi4udGhpcy5rZXlzLCBrZXldKTtcbiAgfVxuXG4gIGdldCBrZXkoKTogS2V5IHtcbiAgICByZXR1cm4gdGhpcy5rZXlzW3RoaXMua2V5cy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgbGV0IHBhdGggPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMua2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5rZXlzW2ldO1xuICAgICAgc3dpdGNoIChrZXkudHlwZSkge1xuICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSOlxuICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgcGF0aCA9IHBhdGggKyAnLic7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhdGggPSBwYXRoICsga2V5Lm5hbWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLklOREVYRVI6XG4gICAgICAgICAgcGF0aCA9IGAke3BhdGh9WyR7a2V5Lm5hbWV9XWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLktFWTpcbiAgICAgICAgICBwYXRoID0gYCR7cGF0aH1bXCIke2tleS5uYW1lfVwiXWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwZWMge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBwYXRoOiBQYXRoLCBwcml2YXRlIHJlYWRvbmx5IGpzb246IHdpcmUuU3BlYykge31cblxuICBzdGF0aWMgY3JlYXRlKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuU3BlYykge1xuICAgIHN3aXRjaCAoanNvbi5zcGVjX3R5cGUpIHtcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICByZXR1cm4gbmV3IExpc3RTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5MaXN0U3BlYyk7XG4gICAgICBjYXNlICd0dXBsZSc6XG4gICAgICAgIHJldHVybiBuZXcgVHVwbGVTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5UdXBsZVNwZWMpO1xuICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgIGNhc2UgJ2luc3RhbmNlJzpcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW5jZVNwZWMocGF0aCwganNvbiBhcyB3aXJlLkluc3RhbmNlU3BlYyk7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25TcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5GdW5jdGlvblNwZWMpO1xuICAgICAgY2FzZSAnZGljdCc6XG4gICAgICAgIHJldHVybiBuZXcgRGljdFNwZWMocGF0aCwganNvbiBhcyB3aXJlLkRpY3RTcGVjKTtcbiAgICAgIGNhc2UgJ3ByaW1pdGl2ZSc6XG4gICAgICAgIHJldHVybiBuZXcgUHJpbWl0aXZlU3BlYyhwYXRoLCBqc29uIGFzIHdpcmUuUHJpbWl0aXZlU3BlYyk7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3JTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5FcnJvclNwZWMpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG5ldyBTcGVjKHBhdGgsIGpzb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0eXBlKCk6IHdpcmUuU3BlY1R5cGUge1xuICAgIHJldHVybiA8d2lyZS5TcGVjVHlwZT4odGhpcy5qc29uLnNwZWNfdHlwZSk7XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX1gLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgOiBgLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnR5cGV9YCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBzaG9ydERlc2NyaXB0aW9uKCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gY3JlYXRlU3BhbihgJHt0aGlzLnR5cGV9YCk7XG4gIH1cbn1cblxuYWJzdHJhY3QgY2xhc3MgU2VxdWVuY2VTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIHNlcXVlbmNlOiB3aXJlLlNlcXVlbmNlU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLlNlcXVlbmNlU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5zZXF1ZW5jZSA9IGpzb247XG4gIH1cblxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2VxdWVuY2UubGVuZ3RoO1xuICB9XG5cbiAgaGFzSXRlbXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5zZXF1ZW5jZS5sZW5ndGg7XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9ICgke3RoaXMubGVuZ3RofSkgJHt0aGlzLm9wZW5CcmFja2V0fWAsIFtdKSk7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4udGhpcy5zZXF1ZW5jZS5pdGVtc107XG4gICAgaXRlbXMubGVuZ3RoID0gTWF0aC5taW4oaXRlbXMubGVuZ3RoLCAxMCk7XG5cbiAgICBjb25zdCBzcGVjcyA9IGl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPVxuICAgICAgICAgIHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShTdHJpbmcoaW5kZXgpLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpO1xuICAgICAgcmV0dXJuIFNwZWMuY3JlYXRlKHBhdGgsIGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgc3BlY3MuZm9yRWFjaCgoc3BlYywgaW5kZXgpID0+IHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoc3BlYy5zaG9ydERlc2NyaXB0aW9uKCkpO1xuICAgICAgaWYgKGluZGV4IDwgc3BlY3MubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuc2VxdWVuY2UubGVuZ3RoID4gc3BlY3MubGVuZ3RoKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgXFx1MjAyNicpKTtcbiAgICB9XG5cbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4odGhpcy5jbG9zZUJyYWNrZXQsIFtdKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBnZXRDaGlsZFBhdGhzKCk6IFBhdGhbXSB7XG4gICAgY29uc3QgbGVuZ3RoID0gTWF0aC5taW4odGhpcy5zZXF1ZW5jZS5sZW5ndGgsIDEwMCk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBwYXRocy5wdXNoKHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShpLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgYWJzdHJhY3QgZ2V0IG9wZW5CcmFja2V0KCk6IHN0cmluZztcbiAgYWJzdHJhY3QgZ2V0IGNsb3NlQnJhY2tldCgpOiBzdHJpbmc7XG59XG5cbmNsYXNzIExpc3RTcGVjIGV4dGVuZHMgU2VxdWVuY2VTcGVjIHtcbiAgbGlzdDogd2lyZS5MaXN0U3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkxpc3RTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLmxpc3QgPSBqc29uO1xuICB9XG5cbiAgZ2V0IG9wZW5CcmFja2V0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdbJztcbiAgfVxuICBnZXQgY2xvc2VCcmFja2V0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICddJztcbiAgfVxufVxuXG5jbGFzcyBUdXBsZVNwZWMgZXh0ZW5kcyBTZXF1ZW5jZVNwZWMge1xuICB0dXBsZTogd2lyZS5UdXBsZVNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5UdXBsZVNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMudHVwbGUgPSBqc29uO1xuICB9XG5cbiAgZ2V0IG9wZW5CcmFja2V0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICcoJztcbiAgfVxuICBnZXQgY2xvc2VCcmFja2V0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICcpJztcbiAgfVxufVxuXG5jbGFzcyBJbnN0YW5jZVNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgaW5zdGFuY2U6IHdpcmUuSW5zdGFuY2VTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuSW5zdGFuY2VTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLmluc3RhbmNlID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX1gKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGApKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5pbnN0YW5jZS50eXBlfWApKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuaW5zdGFuY2UubGVuZ3RoO1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmtleXMuc29ydChjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMpXG4gICAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KGtleSwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpKSk7XG4gIH1cbn1cblxuY2xhc3MgRnVuY3Rpb25TcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGZuOiB3aXJlLkZ1bmN0aW9uU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkZ1bmN0aW9uU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5mbiA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LnRpdGxlID0gdGhpcy5mbi5kb2NzO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9KGAsIFtdKSk7XG5cbiAgICBjb25zdCBhcmdzID0gdGhpcy5mbi5hcmd1bWVudHM7XG5cbiAgICBhcmdzLmZvckVhY2goKGFyZywgaW5kZXgpID0+IHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihhcmcsIFsnYXJndW1lbnQnXSkpO1xuICAgICAgaWYgKGluZGV4IDwgYXJncy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCAnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcpJykpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG59XG5cbmNsYXNzIERpY3RTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGRpY3Q6IHdpcmUuRGljdFNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5EaWN0U3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5kaWN0ID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCwgW10pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9YCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYDogYCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy50eXBlfSB7YCwgW10pKTtcblxuICAgIGNvbnN0IGtleXMgPSB0aGlzLmtleXM7XG4gICAga2V5cy5sZW5ndGggPSBNYXRoLm1pbihrZXlzLmxlbmd0aCwgMTApO1xuXG4gICAga2V5cy5mb3JFYWNoKChrZXksIGluZGV4KSA9PiB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oU3RyaW5nKGtleS5uYW1lKSwgW10pKTtcbiAgICAgIGlmIChpbmRleCA8IGtleXMubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignfScpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIU9iamVjdC5rZXlzKHRoaXMuZGljdC5jb250ZW50cykubGVuZ3RoO1xuICB9XG5cbiAgZ2V0IGtleXMoKTogS2V5W10ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmRpY3QuY29udGVudHMpXG4gICAgICAgIC5zb3J0KGNvbXBhcmVQeXRob25JZGVudGlmaWVycylcbiAgICAgICAgLm1hcCgoaWRlbnRpZmllcikgPT4gbmV3IEtleShpZGVudGlmaWVyLCBBY2Nlc3NvclR5cGUuS0VZKSk7XG4gIH1cblxuICBnZXRDaGlsZFBhdGhzKCk6IFBhdGhbXSB7XG4gICAgcmV0dXJuIHRoaXMua2V5cy5tYXAoKGtleSkgPT4gdGhpcy5wYXRoLmNyZWF0ZShrZXkpKTtcbiAgfVxufVxuXG5jbGFzcyBQcmltaXRpdmVTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIHByaW1pdGl2ZTogd2lyZS5QcmltaXRpdmVTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuUHJpbWl0aXZlU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5wcmltaXRpdmUgPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX06IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmFzRWxlbWVudCgxMDApKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24oKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmFzRWxlbWVudCgxMCk7XG4gIH1cblxuICBhc0VsZW1lbnQobGVuZ3RoOiBudW1iZXIpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGlmICh0aGlzLnByaW1pdGl2ZS50eXBlID09PSAnc3RyJykge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGBcImAsIFsndHlwZS1zdHInXSkpO1xuICAgIH1cbiAgICBsZXQgc3RyID0gdGhpcy5wcmltaXRpdmUuc3RyaW5nO1xuICAgIGlmIChzdHIubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIGxlbmd0aCkgKyAnXFx1MjAyNic7XG4gICAgfVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihzdHIsIFtgdHlwZS0ke3RoaXMucHJpbWl0aXZlLnR5cGV9YF0pKTtcbiAgICBpZiAodGhpcy5wcmltaXRpdmUudHlwZSA9PT0gJ3N0cicpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXCJgLCBbJ3R5cGUtc3RyJ10pKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuY2xhc3MgRXJyb3JTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGVycm9yOiB3aXJlLkVycm9yU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkVycm9yU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5lcnJvciA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX0gLSAke3RoaXMuZXJyb3IuZXJyb3J9YCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG4vKiogQ29tcGFyZXMgdHdvIFB5dGhvbiBpZGVudGlmaWVycywgc29ydGluZyBwcml2YXRlIG1lbWJlcnMgbGFzdC4gICovXG5mdW5jdGlvbiBjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBudW1iZXIge1xuICBhID0gYS5yZXBsYWNlKC9fL2csICdcXHUyMDI2Jyk7XG4gIGIgPSBiLnJlcGxhY2UoL18vZywgJ1xcdTIwMjYnKTtcbiAgaWYgKGEgPT09IGIpIHJldHVybiAwO1xuICBpZiAoYSA8IGIpIHJldHVybiAtMTtcbiAgcmV0dXJuIDE7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3NwZWNzLnRzIiwiZXhwb3J0IGNsYXNzIFRyZWVJdGVtQ29udmVydGVyPFQ+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmdldFRpdGxlKGRhdGEpO1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIGdldFRpdGxlKGRhdGE6IFQpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmcoZGF0YSk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBUKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRJdGVtcyhkYXRhOiBUKTogUHJvbWlzZTxUW10+IHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHByaXZhdGUgZGF0YTogVDtcbiAgZGF0YUNvbnZlcnRlcjogVHJlZUl0ZW1Db252ZXJ0ZXI8VD47XG4gIGluZGVudCA9IDA7XG4gIGV4cGFuZGVkXyA9IGZhbHNlO1xuICBzaG93SGVhZGVyID0gdHJ1ZTtcbiAgaXRlbXNDb250YWluZXJfOiBFbGVtZW50O1xuICBwcml2YXRlIGZldGNoaW5nXyA9IGZhbHNlO1xuXG4gIHN0YXRpYyBpcyA9ICdpbnNwZWN0LXRyZWUtaXRlbSc7XG5cbiAgc3RhdGljIGNyZWF0ZTxUPihkYXRhOiBULCBkYXRhQ29udmVydGVyOiBUcmVlSXRlbUNvbnZlcnRlcjxUPik6IFRyZWVJdGVtPFQ+IHtcbiAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChUcmVlSXRlbS5pcykgYXMgVHJlZUl0ZW08VD47XG4gICAgaXRlbS5kYXRhID0gZGF0YTtcbiAgICBpdGVtLmRhdGFDb252ZXJ0ZXIgPSBkYXRhQ29udmVydGVyO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICB0aGlzLnNob3dIZWFkZXIgPSB0cnVlO1xuICAgIHRoaXMuZmV0Y2hpbmdfID0gZmFsc2U7XG4gIH1cblxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IHRpdGxlUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKHRoaXMuc2hvd0hlYWRlcikge1xuICAgICAgdGl0bGVSb3cuY2xhc3NMaXN0LmFkZCgndGl0bGUtcm93Jyk7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRpdGxlUm93KTtcblxuICAgICAgdGl0bGVSb3cuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbmRlbnRTcGFjZXJfKCkpO1xuXG4gICAgICB0b2dnbGUuY2xhc3NOYW1lID0gJ3RvZ2dsZSc7XG4gICAgICB0aXRsZVJvdy5hcHBlbmRDaGlsZCh0b2dnbGUpO1xuXG4gICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZGF0YUNvbnZlcnRlci5jcmVhdGVIZWFkZXIodGhpcy5kYXRhKTtcbiAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJyk7XG4gICAgICB0aXRsZVJvdy5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmRhdGFDb252ZXJ0ZXIuaGFzSXRlbXModGhpcy5kYXRhKSkge1xuICAgICAgdG9nZ2xlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaXRlbXNDb250YWluZXJfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuaXRlbXNDb250YWluZXJfKTtcblxuICAgICAgdGl0bGVSb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlRXhwYW5zaW9uXygpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5zaG93SGVhZGVyKSB7XG4gICAgICB0aGlzLnRvZ2dsZUV4cGFuc2lvbl8oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUluZGVudFNwYWNlcl8oKSB7XG4gICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhY2VyJyk7XG4gICAgc3BhY2VyLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICBzcGFjZXIuc3R5bGUud2lkdGggPSBgJHt0aGlzLmluZGVudCAqIDIwfXB4YDtcbiAgICByZXR1cm4gc3BhY2VyO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVFeHBhbnNpb25fKCkge1xuICAgIHRoaXMuZXhwYW5kZWRfID0gIXRoaXMuZXhwYW5kZWRfO1xuXG4gICAgaWYgKHRoaXMuZXhwYW5kZWRfKSB7XG4gICAgICB0aGlzLmV4cGFuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbGxhcHNlKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZXhwYW5kKCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnZXhwYW5kZWQnKTtcbiAgICB0aGlzLmZldGNoaW5nXyA9IHRydWU7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBhd2FpdCB0aGlzLmRhdGFDb252ZXJ0ZXIuZ2V0Q2hpbGRJdGVtcyh0aGlzLmRhdGEpO1xuICAgIHRoaXMuZmV0Y2hpbmdfID0gZmFsc2U7XG4gICAgdGhpcy5wb3B1bGF0ZUNoaWxkcmVuKGNoaWxkcmVuKTtcbiAgfVxuXG4gIHByaXZhdGUgcG9wdWxhdGVDaGlsZHJlbihjaGlsZHJlbjogVFtdKSB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgY29uc3QgaXRlbSA9IFRyZWVJdGVtLmNyZWF0ZShjaGlsZCwgdGhpcy5kYXRhQ29udmVydGVyKTtcbiAgICAgIGlmICh0aGlzLnNob3dIZWFkZXIpIHtcbiAgICAgICAgaXRlbS5pbmRlbnQgPSB0aGlzLmluZGVudCArIDE7XG4gICAgICB9XG4gICAgICBpdGVtLmRhdGFDb252ZXJ0ZXIgPSB0aGlzLmRhdGFDb252ZXJ0ZXI7XG4gICAgICB0aGlzLml0ZW1zQ29udGFpbmVyXy5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICB9XG4gIH1cblxuICBjb2xsYXBzZSgpIHtcbiAgICB3aGlsZSAodGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdleHBhbmRlZCcpO1xuICB9XG5cbiAgYXN5bmMgcmVmcmVzaChkYXRhOiBUKSB7XG4gICAgaWYgKHRoaXMuZmV0Y2hpbmdfKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgaWYgKHRoaXMuZXhwYW5kZWRfKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGF3YWl0IHRoaXMuZGF0YUNvbnZlcnRlci5nZXRDaGlsZEl0ZW1zKHRoaXMuZGF0YSk7XG4gICAgICB0aGlzLmNvbGxhcHNlKCk7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICB0aGlzLnBvcHVsYXRlQ2hpbGRyZW4oY2hpbGRyZW4pO1xuICAgIH1cbiAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2luc3BlY3QtdHJlZS1pdGVtJywgVHJlZUl0ZW0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC90cmVlLnRzIiwiaW1wb3J0IHtpbnNwZWN0LCBpbnNwZWN0U3BlYywgcmVmcmVzaH0gZnJvbSAnLi9pbnNwZWN0JztcbmltcG9ydCAqIGFzIHdpcmUgZnJvbSAnLi9zcGVjc19qc29uJztcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBXaW5kb3cge1xuICAgICAgaW5zcGVjdChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuICAgICAgaW5zcGVjdFNwZWMoaWQ6IHN0cmluZywganNvbjogd2lyZS5TcGVjLCBzaG93SGVhZGVyOiBib29sZWFuKTogdm9pZDtcbiAgICAgIHJlZnJlc2hJbnNwZWN0b3IocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbiAgICB9XG59XG5cbndpbmRvdy5pbnNwZWN0ID0gaW5zcGVjdDtcbndpbmRvdy5yZWZyZXNoSW5zcGVjdG9yID0gcmVmcmVzaDtcbndpbmRvdy5pbnNwZWN0U3BlYyA9IGluc3BlY3RTcGVjO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9tYWluLnRzIiwiaW1wb3J0IHtnZXRTcGVjc30gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7QWNjZXNzb3JUeXBlLCBLZXksIFBhdGgsIFNwZWN9IGZyb20gJy4vc3BlY3MnO1xuaW1wb3J0IHtUcmVlSXRlbX0gZnJvbSAnLi90cmVlJztcbmltcG9ydCB7U3BlY0l0ZW1Db252ZXJ0ZXJ9IGZyb20gJy4vc3BlY19pdGVtX2NvbnZlcnRlcic7XG5pbXBvcnQgKiBhcyB3aXJlIGZyb20gJy4vc3BlY3NfanNvbic7XG5cbmNvbnN0IGluc3BlY3RvcnMgPSBuZXcgTWFwPHN0cmluZywgVHJlZUl0ZW08U3BlYz4+KCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnNwZWN0KHBhdGg6IHN0cmluZykge1xuICBjb25zdCBrZXkgPSBuZXcgS2V5KHBhdGgsIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKTtcblxuICBjb25zdCBzcGVjcyA9IGF3YWl0IGdldFNwZWNzKFtuZXcgUGF0aChba2V5XSldKTtcbiAgY29uc3Qgc3BlYyA9IHNwZWNzWzBdO1xuXG4gIGNvbnN0IHRyZWUgPSBUcmVlSXRlbS5jcmVhdGUoc3BlYywgbmV3IFNwZWNJdGVtQ29udmVydGVyKCkpO1xuICBpbnNwZWN0b3JzLnNldChwYXRoLCB0cmVlKTtcbiAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQtYXJlYScpIGFzIEVsZW1lbnQpLmFwcGVuZENoaWxkKHRyZWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zcGVjdFNwZWMoaWQ6IHN0cmluZywganNvbjogd2lyZS5TcGVjLCBzaG93SGVhZGVyOiBib29sZWFuKSB7XG4gIGNvbnN0IHBhdGggPSBuZXcgUGF0aChbbmV3IEtleShpZCwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpXSk7XG4gIGNvbnN0IHNwZWMgPSBTcGVjLmNyZWF0ZShwYXRoLCBqc29uKTtcbiAgY29uc3QgdHJlZSA9IFRyZWVJdGVtLmNyZWF0ZShzcGVjLCBuZXcgU3BlY0l0ZW1Db252ZXJ0ZXIoKSk7XG4gIHRyZWUuc2hvd0hlYWRlciA9IHNob3dIZWFkZXI7XG4gIGluc3BlY3RvcnMuc2V0KGlkLCB0cmVlKTtcbiAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdXRwdXQtYXJlYScpIGFzIEVsZW1lbnQpLmFwcGVuZENoaWxkKHRyZWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVmcmVzaChwYXRoOiBzdHJpbmcpIHtcbiAgY29uc3QgdHJlZSA9IGluc3BlY3RvcnMuZ2V0KHBhdGgpO1xuICBpZiAodHJlZSkge1xuICAgIGNvbnN0IGtleSA9IG5ldyBLZXkocGF0aCwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpO1xuICAgIGNvbnN0IHNwZWNzID0gYXdhaXQgZ2V0U3BlY3MoW25ldyBQYXRoKFtrZXldKV0pO1xuICAgIGNvbnN0IHNwZWMgPSBzcGVjc1swXTtcblxuICAgIHRyZWUucmVmcmVzaChzcGVjKTtcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvaW5zcGVjdC50cyIsImltcG9ydCB7VHJlZUl0ZW1Db252ZXJ0ZXJ9IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge1NwZWN9IGZyb20gJy4vc3BlY3MnO1xuaW1wb3J0IHtnZXRTcGVjc30gZnJvbSAnLi9zZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIFNwZWNJdGVtQ29udmVydGVyIGV4dGVuZHMgVHJlZUl0ZW1Db252ZXJ0ZXI8U3BlYz4ge1xuICBjcmVhdGVIZWFkZXIoZGF0YTogU3BlYyk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gZGF0YS5jcmVhdGVIZWFkZXIoKTtcbiAgfVxuXG4gIGhhc0l0ZW1zKGRhdGE6IFNwZWMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZGF0YS5oYXNJdGVtcygpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRJdGVtcyhkYXRhOiBTcGVjKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgICBjb25zdCBwYXRocyA9IGRhdGEuZ2V0Q2hpbGRQYXRocygpO1xuICAgIHJldHVybiBnZXRTcGVjcyhwYXRocyk7XG4gIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3NwZWNfaXRlbV9jb252ZXJ0ZXIudHMiXSwic291cmNlUm9vdCI6IiJ9