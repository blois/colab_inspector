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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
        return this.json.spec_type;
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
            paths.push(this.path.create(new Key(String(i), AccessorType.INDEXER)));
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
            element.appendChild(createSpan(key.name, []));
            if (index < keys.length - 1) {
                element.appendChild(createSpan(', '));
            }
        });
        element.appendChild(createSpan('}'));
        return element;
    }
    get keys() {
        return Object.keys(this.dict.contents)
            .sort(comparePythonIdentifiers)
            .map((identifier) => new Key(identifier, AccessorType.INDEXER));
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inspect_1 = __webpack_require__(2);
window.inspect = inspect_1.inspect;


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
const service_1 = __webpack_require__(3);
const specs_1 = __webpack_require__(0);
const tree_1 = __webpack_require__(4);
function inspect(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = new specs_1.Key(path, specs_1.AccessorType.IDENTIFIER);
        const specs = yield service_1.getSpecs([new specs_1.Path([key])]);
        const spec = specs[0];
        const tree = tree_1.TreeItem.create(spec, new SpecItemConverter());
        document.querySelector('#output-area').appendChild(tree);
    });
}
exports.inspect = inspect;
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


/***/ }),
/* 3 */
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
const specs_1 = __webpack_require__(0);
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
    }
    static create(data, dataConverter) {
        const item = document.createElement(TreeItem.is);
        item.data = data;
        item.dataConverter = dataConverter;
        return item;
    }
    createdCallback() {
        this.indent = 0;
    }
    attachedCallback() {
        const titleRow = document.createElement('div');
        titleRow.classList.add('title-row');
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
        }
        else {
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
        }
        else {
            this.collapse();
        }
    }
    expand() {
        return __awaiter(this, void 0, void 0, function* () {
            this.classList.add('expanded');
            const children = yield this.dataConverter.getChildItems(this.data);
            for (const child of children) {
                const item = TreeItem.create(child, this.dataConverter);
                item.indent = this.indent + 1;
                item.dataConverter = this.dataConverter;
                this.itemsContainer_.appendChild(item);
            }
        });
    }
    collapse() {
        while (this.itemsContainer_.lastElementChild) {
            this.itemsContainer_.lastElementChild.remove();
        }
        this.classList.remove('expanded');
    }
}
TreeItem.is = 'inspect-tree-item';
exports.TreeItem = TreeItem;
document.registerElement('inspect-tree-item', TreeItem);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWQ2YjQ4NWFmODJiNDJkNzZlNjUiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zcGVjcy50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9pbnNwZWN0LnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDM0RBLG9CQUFvQixJQUFZLEVBQUUsVUFBb0IsRUFBRTtJQUN0RCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsSUFB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VUFBVSxDQUFDLENBQUM7WUFDL0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkUsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLENBQUM7UUFFSCxDQUFDO0tBQUE7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFcEMsQ0FBQzs7QUEzRU0sV0FBRSxHQUFHLG1CQUFtQixDQUFDO0FBUGxDLDRCQW1GQztBQUVELFFBQVEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUMiLCJmaWxlIjoiaW5zcGVjdG9yLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDFkNmI0ODVhZjgyYjQyZDc2ZTY1IiwiaW1wb3J0ICogYXMgd2lyZSBmcm9tICcuL3NwZWNzX2pzb24nO1xuXG5mdW5jdGlvbiBjcmVhdGVTcGFuKHRleHQ6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nW10gPSBbXSk6IEhUTUxTcGFuRWxlbWVudCB7XG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHNwYW4udGV4dENvbnRlbnQgPSB0ZXh0O1xuICBmb3IgKGNvbnN0IGNscyBvZiBjbGFzc2VzKSB7XG4gICAgc3Bhbi5jbGFzc0xpc3QuYWRkKGNscyk7XG4gIH1cbiAgcmV0dXJuIHNwYW47XG59XG5cbmV4cG9ydCBlbnVtIEFjY2Vzc29yVHlwZSB7XG4gIElERU5USUZJRVIsXG4gIElOREVYRVIsXG59XG5cbmV4cG9ydCBjbGFzcyBLZXkge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHR5cGU6IEFjY2Vzc29yVHlwZSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFBhdGgge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBrZXlzOiBLZXlbXSkge31cblxuICBjcmVhdGUoa2V5OiBLZXkpIHtcbiAgICByZXR1cm4gbmV3IFBhdGgoWy4uLnRoaXMua2V5cywga2V5XSk7XG4gIH1cblxuICBnZXQga2V5KCk6IEtleSB7XG4gICAgcmV0dXJuIHRoaXMua2V5c1t0aGlzLmtleXMubGVuZ3RoIC0gMV07XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGxldCBwYXRoID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5c1tpXTtcbiAgICAgIHN3aXRjaCAoa2V5LnR5cGUpIHtcbiAgICAgICAgY2FzZSBBY2Nlc3NvclR5cGUuSURFTlRJRklFUjpcbiAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgIHBhdGggPSBwYXRoICsgJy4nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXRoID0gcGF0aCArIGtleS5uYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5JTkRFWEVSOlxuICAgICAgICAgIHBhdGggPSBgJHtwYXRofVske2tleS5uYW1lfV1gO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biB0eXBlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcGVjIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgcGF0aDogUGF0aCwgcHJpdmF0ZSByZWFkb25seSBqc29uOiB3aXJlLlNwZWMpIHt9XG5cbiAgc3RhdGljIGNyZWF0ZShwYXRoOiBQYXRoLCBqc29uOiB3aXJlLlNwZWMpIHtcbiAgICBzd2l0Y2ggKGpzb24uc3BlY190eXBlKSB7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0U3BlYyhwYXRoLCBqc29uIGFzIHdpcmUuTGlzdFNwZWMpO1xuICAgICAgY2FzZSAndHVwbGUnOlxuICAgICAgICByZXR1cm4gbmV3IFR1cGxlU3BlYyhwYXRoLCBqc29uIGFzIHdpcmUuVHVwbGVTcGVjKTtcbiAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICBjYXNlICdpbnN0YW5jZSc6XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFuY2VTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5JbnN0YW5jZVNwZWMpO1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uU3BlYyhwYXRoLCBqc29uIGFzIHdpcmUuRnVuY3Rpb25TcGVjKTtcbiAgICAgIGNhc2UgJ2RpY3QnOlxuICAgICAgICByZXR1cm4gbmV3IERpY3RTcGVjKHBhdGgsIGpzb24gYXMgd2lyZS5EaWN0U3BlYyk7XG4gICAgICBjYXNlICdwcmltaXRpdmUnOlxuICAgICAgICByZXR1cm4gbmV3IFByaW1pdGl2ZVNwZWMocGF0aCwganNvbiBhcyB3aXJlLlByaW1pdGl2ZVNwZWMpO1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICByZXR1cm4gbmV3IEVycm9yU3BlYyhwYXRoLCBqc29uIGFzIHdpcmUuRXJyb3JTcGVjKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBuZXcgU3BlYyhwYXRoLCBqc29uKTtcbiAgICB9XG4gIH1cblxuICBnZXQgdHlwZSgpOiB3aXJlLlNwZWNUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5qc29uLnNwZWNfdHlwZTtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oJycsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfWAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX1gLCBbXSkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgaGFzSXRlbXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24oKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiBjcmVhdGVTcGFuKGAke3RoaXMudHlwZX1gKTtcbiAgfVxufVxuXG5hYnN0cmFjdCBjbGFzcyBTZXF1ZW5jZVNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgc2VxdWVuY2U6IHdpcmUuU2VxdWVuY2VTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuU2VxdWVuY2VTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnNlcXVlbmNlID0ganNvbjtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zZXF1ZW5jZS5sZW5ndGg7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNlcXVlbmNlLmxlbmd0aDtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oJycsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKFxuICAgICAgICBjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX0gKCR7dGhpcy5sZW5ndGh9KSAke3RoaXMub3BlbkJyYWNrZXR9YCwgW10pKTtcbiAgICBjb25zdCBpdGVtcyA9IFsuLi50aGlzLnNlcXVlbmNlLml0ZW1zXTtcbiAgICBpdGVtcy5sZW5ndGggPSBNYXRoLm1pbihpdGVtcy5sZW5ndGgsIDEwKTtcblxuICAgIGNvbnN0IHNwZWNzID0gaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcGF0aCA9XG4gICAgICAgICAgdGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KFN0cmluZyhpbmRleCksIEFjY2Vzc29yVHlwZS5JTkRFWEVSKSk7XG4gICAgICByZXR1cm4gU3BlYy5jcmVhdGUocGF0aCwgaXRlbSk7XG4gICAgfSk7XG5cbiAgICBzcGVjcy5mb3JFYWNoKChzcGVjLCBpbmRleCkgPT4ge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChzcGVjLnNob3J0RGVzY3JpcHRpb24oKSk7XG4gICAgICBpZiAoaW5kZXggPCBzcGVjcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCAnKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5zZXF1ZW5jZS5sZW5ndGggPiBzcGVjcy5sZW5ndGgpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCBcXHUyMDI2JykpO1xuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3Bhbih0aGlzLmNsb3NlQnJhY2tldCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICBjb25zdCBsZW5ndGggPSBNYXRoLm1pbih0aGlzLnNlcXVlbmNlLmxlbmd0aCwgMTAwKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIHBhdGhzLnB1c2godGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KFN0cmluZyhpKSwgQWNjZXNzb3JUeXBlLklOREVYRVIpKSk7XG4gICAgfVxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIGFic3RyYWN0IGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmc7XG4gIGFic3RyYWN0IGdldCBjbG9zZUJyYWNrZXQoKTogc3RyaW5nO1xufVxuXG5jbGFzcyBMaXN0U3BlYyBleHRlbmRzIFNlcXVlbmNlU3BlYyB7XG4gIGxpc3Q6IHdpcmUuTGlzdFNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5MaXN0U3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5saXN0ID0ganNvbjtcbiAgfVxuXG4gIGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnWyc7XG4gIH1cbiAgZ2V0IGNsb3NlQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnXSc7XG4gIH1cbn1cblxuY2xhc3MgVHVwbGVTcGVjIGV4dGVuZHMgU2VxdWVuY2VTcGVjIHtcbiAgdHVwbGU6IHdpcmUuVHVwbGVTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuVHVwbGVTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnR1cGxlID0ganNvbjtcbiAgfVxuXG4gIGdldCBvcGVuQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnKCc7XG4gIH1cbiAgZ2V0IGNsb3NlQnJhY2tldCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnKSc7XG4gIH1cbn1cblxuY2xhc3MgSW5zdGFuY2VTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGluc3RhbmNlOiB3aXJlLkluc3RhbmNlU3BlYztcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiB3aXJlLkluc3RhbmNlU3BlYykge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5pbnN0YW5jZSA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9YCkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgOiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMuaW5zdGFuY2UudHlwZX1gKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmluc3RhbmNlLmxlbmd0aDtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5rZXlzLnNvcnQoY29tcGFyZVB5dGhvbklkZW50aWZpZXJzKVxuICAgICAgICAubWFwKChrZXkpID0+IHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShrZXksIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKSkpO1xuICB9XG59XG5cbmNsYXNzIEZ1bmN0aW9uU3BlYyBleHRlbmRzIFNwZWMge1xuICBmbjogd2lyZS5GdW5jdGlvblNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5GdW5jdGlvblNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZm4gPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgLCBbXSk7XG4gICAgZWxlbWVudC50aXRsZSA9IHRoaXMuZm4uZG9jcztcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfShgLCBbXSkpO1xuXG4gICAgY29uc3QgYXJncyA9IHRoaXMuZm4uYXJndW1lbnRzO1xuXG4gICAgYXJncy5mb3JFYWNoKChhcmcsIGluZGV4KSA9PiB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYXJnLCBbJ2FyZ3VtZW50J10pKTtcbiAgICAgIGlmIChpbmRleCA8IGFyZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignKScpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jbGFzcyBEaWN0U3BlYyBleHRlbmRzIFNwZWMge1xuICBkaWN0OiB3aXJlLkRpY3RTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuRGljdFNwZWMpIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZGljdCA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfWAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX0ge2AsIFtdKSk7XG5cbiAgICBjb25zdCBrZXlzID0gdGhpcy5rZXlzO1xuICAgIGtleXMubGVuZ3RoID0gTWF0aC5taW4oa2V5cy5sZW5ndGgsIDEwKTtcblxuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGtleS5uYW1lLCBbXSkpO1xuICAgICAgaWYgKGluZGV4IDwga2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCAnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCd9JykpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZ2V0IGtleXMoKTogS2V5W10ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmRpY3QuY29udGVudHMpXG4gICAgICAgIC5zb3J0KGNvbXBhcmVQeXRob25JZGVudGlmaWVycylcbiAgICAgICAgLm1hcCgoaWRlbnRpZmllcikgPT4gbmV3IEtleShpZGVudGlmaWVyLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpO1xuICB9XG59XG5cbmNsYXNzIFByaW1pdGl2ZVNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgcHJpbWl0aXZlOiB3aXJlLlByaW1pdGl2ZVNwZWM7XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogd2lyZS5QcmltaXRpdmVTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnByaW1pdGl2ZSA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfTogYCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYXNFbGVtZW50KDEwMCkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgc2hvcnREZXNjcmlwdGlvbigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuYXNFbGVtZW50KDEwKTtcbiAgfVxuXG4gIGFzRWxlbWVudChsZW5ndGg6IG51bWJlcik6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCk7XG4gICAgaWYgKHRoaXMucHJpbWl0aXZlLnR5cGUgPT09ICdzdHInKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYFwiYCwgWyd0eXBlLXN0ciddKSk7XG4gICAgfVxuICAgIGxldCBzdHIgPSB0aGlzLnByaW1pdGl2ZS5zdHJpbmc7XG4gICAgaWYgKHN0ci5sZW5ndGggPiBsZW5ndGgpIHtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgbGVuZ3RoKSArICdcXHUyMDI2JztcbiAgICB9XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKHN0ciwgW2B0eXBlLSR7dGhpcy5wcmltaXRpdmUudHlwZX1gXSkpO1xuICAgIGlmICh0aGlzLnByaW1pdGl2ZS50eXBlID09PSAnc3RyJykge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGBcImAsIFsndHlwZS1zdHInXSkpO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jbGFzcyBFcnJvclNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgZXJyb3I6IHdpcmUuRXJyb3JTcGVjO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IHdpcmUuRXJyb3JTcGVjKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLmVycm9yID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX06IGApKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy50eXBlfSAtICR7dGhpcy5lcnJvci5lcnJvcn1gLCBbXSkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG59XG5cbi8qKiBDb21wYXJlcyB0d28gUHl0aG9uIGlkZW50aWZpZXJzLCBzb3J0aW5nIHByaXZhdGUgbWVtYmVycyBsYXN0LiAgKi9cbmZ1bmN0aW9uIGNvbXBhcmVQeXRob25JZGVudGlmaWVycyhhOiBzdHJpbmcsIGI6IHN0cmluZyk6IG51bWJlciB7XG4gIGEgPSBhLnJlcGxhY2UoL18vZywgJ1xcdTIwMjYnKTtcbiAgYiA9IGIucmVwbGFjZSgvXy9nLCAnXFx1MjAyNicpO1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIDA7XG4gIGlmIChhIDwgYikgcmV0dXJuIC0xO1xuICByZXR1cm4gMTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvc3BlY3MudHMiLCJpbXBvcnQge2luc3BlY3R9IGZyb20gJy4vaW5zcGVjdCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgIGluc3BlY3QocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbiAgICB9XG59XG5cbndpbmRvdy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvbWFpbi50cyIsImltcG9ydCB7Z2V0U3BlY3N9IGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQge0FjY2Vzc29yVHlwZSwgS2V5LCBQYXRoLCBTcGVjfSBmcm9tICcuL3NwZWNzJztcbmltcG9ydCB7VHJlZUl0ZW0sIFRyZWVJdGVtQ29udmVydGVyfSBmcm9tICcuL3RyZWUnO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnNwZWN0KHBhdGg6IHN0cmluZykge1xuICBjb25zdCBrZXkgPSBuZXcgS2V5KHBhdGgsIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKTtcblxuICBjb25zdCBzcGVjcyA9IGF3YWl0IGdldFNwZWNzKFtuZXcgUGF0aChba2V5XSldKTtcbiAgY29uc3Qgc3BlYyA9IHNwZWNzWzBdO1xuXG4gIGNvbnN0IHRyZWUgPSBUcmVlSXRlbS5jcmVhdGUoc3BlYywgbmV3IFNwZWNJdGVtQ29udmVydGVyKCkpO1xuICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI291dHB1dC1hcmVhJykgYXMgRWxlbWVudCkuYXBwZW5kQ2hpbGQodHJlZSk7XG59XG5cbmNsYXNzIFNwZWNJdGVtQ29udmVydGVyIGV4dGVuZHMgVHJlZUl0ZW1Db252ZXJ0ZXI8U3BlYz4ge1xuICBjcmVhdGVIZWFkZXIoZGF0YTogU3BlYyk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gZGF0YS5jcmVhdGVIZWFkZXIoKTtcbiAgfVxuXG4gIGhhc0l0ZW1zKGRhdGE6IFNwZWMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZGF0YS5oYXNJdGVtcygpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRJdGVtcyhkYXRhOiBTcGVjKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgICBjb25zdCBwYXRocyA9IGRhdGEuZ2V0Q2hpbGRQYXRocygpO1xuICAgIHJldHVybiBnZXRTcGVjcyhwYXRocyk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvaW5zcGVjdC50cyIsImltcG9ydCB7UGF0aCwgU3BlY30gZnJvbSAnLi9zcGVjcyc7XG5pbXBvcnQgKiBhcyB3aXJlIGZyb20gJy4vc3BlY3NfanNvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTcGVjcyhwYXRoczogUGF0aFtdKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgY29uc3QgcmF3UGF0aHMgPSBwYXRocy5tYXAoKHBhdGgpID0+IHBhdGgudG9TdHJpbmcoKSk7XG5cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ29vZ2xlLmNvbGFiLmtlcm5lbC5pbnZva2VGdW5jdGlvbihcbiAgICAgICdpbnNwZWN0LmNyZWF0ZV9zcGVjaWZpY2F0aW9uX2Zvcl9qcycsIFtyYXdQYXRoc10sIHt9KTtcbiAgaWYgKHJlc3VsdC5zdGF0dXMgIT09ICdvaycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVuYW1lKTtcbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSByZXN1bHQuZGF0YTtcbiAgY29uc3Qgc3BlY0pzb24gPSBkYXRhWydhcHBsaWNhdGlvbi9qc29uJ10gYXMgd2lyZS5TcGVjW107XG4gIHJldHVybiBzcGVjSnNvbi5tYXAoKGpzb24sIGluZGV4KSA9PiBTcGVjLmNyZWF0ZShwYXRoc1tpbmRleF0sIGpzb24pKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvc2VydmljZS50cyIsImV4cG9ydCBjbGFzcyBUcmVlSXRlbUNvbnZlcnRlcjxUPiB7XG4gIGNyZWF0ZUhlYWRlcihkYXRhOiBUKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gdGhpcy5nZXRUaXRsZShkYXRhKTtcbiAgICByZXR1cm4gdGl0bGU7XG4gIH1cblxuICBnZXRUaXRsZShkYXRhOiBUKTogc3RyaW5nIHtcbiAgICByZXR1cm4gU3RyaW5nKGRhdGEpO1xuICB9XG5cbiAgaGFzSXRlbXMoZGF0YTogVCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkSXRlbXMoZGF0YTogVCk6IFByb21pc2U8VFtdPiB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFRyZWVJdGVtPFQ+IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBwcml2YXRlIGRhdGE6IFQ7XG4gIGRhdGFDb252ZXJ0ZXI6IFRyZWVJdGVtQ29udmVydGVyPFQ+O1xuICBpbmRlbnQgPSAwO1xuICBleHBhbmRlZF8gPSBmYWxzZTtcbiAgaXRlbXNDb250YWluZXJfOiBFbGVtZW50O1xuXG4gIHN0YXRpYyBpcyA9ICdpbnNwZWN0LXRyZWUtaXRlbSc7XG5cbiAgc3RhdGljIGNyZWF0ZTxUPihkYXRhOiBULCBkYXRhQ29udmVydGVyOiBUcmVlSXRlbUNvbnZlcnRlcjxUPik6IFRyZWVJdGVtPFQ+IHtcbiAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChUcmVlSXRlbS5pcykgYXMgVHJlZUl0ZW08VD47XG4gICAgaXRlbS5kYXRhID0gZGF0YTtcbiAgICBpdGVtLmRhdGFDb252ZXJ0ZXIgPSBkYXRhQ29udmVydGVyO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgfVxuXG4gIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgY29uc3QgdGl0bGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aXRsZVJvdy5jbGFzc0xpc3QuYWRkKCd0aXRsZS1yb3cnKTtcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRpdGxlUm93KTtcblxuICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSW5kZW50U3BhY2VyXygpKTtcblxuICAgIGNvbnN0IHRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvZ2dsZS5jbGFzc05hbWUgPSAndG9nZ2xlJztcbiAgICB0aXRsZVJvdy5hcHBlbmRDaGlsZCh0b2dnbGUpO1xuXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLmRhdGFDb252ZXJ0ZXIuY3JlYXRlSGVhZGVyKHRoaXMuZGF0YSk7XG4gICAgdGl0bGUuY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgICB0aXRsZVJvdy5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICBpZiAoIXRoaXMuZGF0YUNvbnZlcnRlci5oYXNJdGVtcyh0aGlzLmRhdGEpKSB7XG4gICAgICB0b2dnbGUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lcl8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5pdGVtc0NvbnRhaW5lcl8pO1xuXG4gICAgICB0aXRsZVJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVFeHBhbnNpb25fKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVJbmRlbnRTcGFjZXJfKCkge1xuICAgIGNvbnN0IHNwYWNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYWNlcicpO1xuICAgIHNwYWNlci5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgc3BhY2VyLnN0eWxlLndpZHRoID0gYCR7dGhpcy5pbmRlbnQgKiAyMH1weGA7XG4gICAgcmV0dXJuIHNwYWNlcjtcbiAgfVxuXG4gIHRvZ2dsZUV4cGFuc2lvbl8oKSB7XG4gICAgdGhpcy5leHBhbmRlZF8gPSAhdGhpcy5leHBhbmRlZF87XG5cbiAgICBpZiAodGhpcy5leHBhbmRlZF8pIHtcbiAgICAgIHRoaXMuZXhwYW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29sbGFwc2UoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBleHBhbmQoKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdleHBhbmRlZCcpO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gYXdhaXQgdGhpcy5kYXRhQ29udmVydGVyLmdldENoaWxkSXRlbXModGhpcy5kYXRhKTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBpdGVtID0gVHJlZUl0ZW0uY3JlYXRlKGNoaWxkLCB0aGlzLmRhdGFDb252ZXJ0ZXIpO1xuICAgICAgaXRlbS5pbmRlbnQgPSB0aGlzLmluZGVudCArIDE7XG4gICAgICBpdGVtLmRhdGFDb252ZXJ0ZXIgPSB0aGlzLmRhdGFDb252ZXJ0ZXI7XG4gICAgICB0aGlzLml0ZW1zQ29udGFpbmVyXy5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICB9XG4gICAgLy8gd2luZG93LnJlc2l6ZU91dHB1dCgpO1xuICB9XG5cbiAgY29sbGFwc2UoKSB7XG4gICAgd2hpbGUgKHRoaXMuaXRlbXNDb250YWluZXJfLmxhc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgIHRoaXMuaXRlbXNDb250YWluZXJfLmxhc3RFbGVtZW50Q2hpbGQucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnZXhwYW5kZWQnKTtcbiAgICAvLyB3aW5kb3cucmVzaXplT3V0cHV0KCk7XG4gIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdpbnNwZWN0LXRyZWUtaXRlbScsIFRyZWVJdGVtKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvdHJlZS50cyJdLCJzb3VyY2VSb290IjoiIn0=