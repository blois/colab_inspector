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
            case 'module':
            case 'instance':
                return new InstanceSpec(path, json);
            case 'function':
                return new FunctionSpec(path, json);
            case 'dict':
                return new DictSpec(path, json);
            case 'primitive':
                return new PrimitiveSpec(path, json);
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
class ListSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.listJson = json;
    }
    get length() {
        return this.listJson.length;
    }
    hasItems() {
        return !!this.listJson.length;
    }
    createHeader() {
        const element = createSpan('', []);
        element.appendChild(createSpan(`${this.path.key.name} (${this.length}) [`, []));
        const items = [...this.listJson.items];
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
        if (this.listJson.length > specs.length) {
            element.appendChild(createSpan(', \u2026'));
        }
        element.appendChild(createSpan(`]`, []));
        return element;
    }
    getChildPaths() {
        const length = Math.min(this.listJson.length, 100);
        const paths = [];
        for (let i = 0; i < length; ++i) {
            paths.push(this.path.create(new Key(String(i), AccessorType.INDEXER)));
        }
        return paths;
    }
}
class InstanceSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.instanceJson = json;
    }
    createHeader() {
        const key = this.path.key;
        const element = createSpan(``);
        element.appendChild(createSpan(`${this.path.key.name}`));
        element.appendChild(createSpan(`: `));
        element.appendChild(createSpan(`${this.instanceJson.type}`));
        return element;
    }
    hasItems() {
        return !!this.instanceJson.length;
    }
    getChildPaths() {
        return this.instanceJson.keys.sort(comparePythonIdentifiers)
            .map((key) => this.path.create(new Key(key, AccessorType.IDENTIFIER)));
    }
}
class FunctionSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.functionJson = json;
    }
    createHeader() {
        const key = this.path.key;
        const element = createSpan(``, []);
        element.title = this.functionJson.docs;
        element.appendChild(createSpan(`${this.path.key.name}(`, []));
        const args = this.functionJson.arguments;
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
        this.dictJson = json;
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
        return Object.keys(this.dictJson.contents)
            .sort(comparePythonIdentifiers)
            .map((identifier) => new Key(identifier, AccessorType.INDEXER));
    }
}
class PrimitiveSpec extends Spec {
    constructor(path, json) {
        super(path, json);
        this.primitiveJson = json;
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
        if (this.primitiveJson.type === 'str') {
            element.appendChild(createSpan(`"`, ['type-str']));
        }
        let str = this.primitiveJson.string;
        if (str.length > length) {
            str = str.substr(0, length) + '\u2026';
        }
        element.appendChild(createSpan(str, [`type-${this.primitiveJson.type}`]));
        if (this.primitiveJson.type === 'str') {
            element.appendChild(createSpan(`"`, ['type-str']));
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGVhZGVkNmY1NWRlMDIyNzkzZjkiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zcGVjcy50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9pbnNwZWN0LnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDM0RBLG9CQUFvQixJQUFZLEVBQUUsVUFBb0IsRUFBRTtJQUN0RCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsSUFB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YSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLENBQUM7UUFFSCxDQUFDO0tBQUE7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFcEMsQ0FBQzs7QUExRU0sV0FBRSxHQUFHLG1CQUFtQixDQUFDO0FBUGxDLDRCQWtGQztBQUVELFFBQVEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUMiLCJmaWxlIjoiaW5zcGVjdG9yLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGRlYWRlZDZmNTVkZTAyMjc5M2Y5IiwiaW1wb3J0IHtEaWN0U3BlY0pzb24sIEZ1bmN0aW9uU3BlY0pzb24sIEluc3RhbmNlU3BlY0pzb24sIExpc3RTcGVjSnNvbiwgUHJpbWl0aXZlU3BlY0pzb24sIFNwZWNKc29uLCBTcGVjVHlwZX0gZnJvbSAnLi9zcGVjc19qc29uJztcblxuZnVuY3Rpb24gY3JlYXRlU3Bhbih0ZXh0OiBzdHJpbmcsIGNsYXNzZXM6IHN0cmluZ1tdID0gW10pOiBIVE1MU3BhbkVsZW1lbnQge1xuICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBzcGFuLnRleHRDb250ZW50ID0gdGV4dDtcbiAgZm9yIChjb25zdCBjbHMgb2YgY2xhc3Nlcykge1xuICAgIHNwYW4uY2xhc3NMaXN0LmFkZChjbHMpO1xuICB9XG4gIHJldHVybiBzcGFuO1xufVxuXG5leHBvcnQgZW51bSBBY2Nlc3NvclR5cGUge1xuICBJREVOVElGSUVSLFxuICBJTkRFWEVSLFxufVxuXG5leHBvcnQgY2xhc3MgS2V5IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogc3RyaW5nLCByZWFkb25seSB0eXBlOiBBY2Nlc3NvclR5cGUpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXRoIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkga2V5czogS2V5W10pIHt9XG5cbiAgY3JlYXRlKGtleTogS2V5KSB7XG4gICAgcmV0dXJuIG5ldyBQYXRoKFsuLi50aGlzLmtleXMsIGtleV0pO1xuICB9XG5cbiAgZ2V0IGtleSgpOiBLZXkge1xuICAgIHJldHVybiB0aGlzLmtleXNbdGhpcy5rZXlzLmxlbmd0aCAtIDFdO1xuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBsZXQgcGF0aCA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5rZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLmtleXNbaV07XG4gICAgICBzd2l0Y2ggKGtleS50eXBlKSB7XG4gICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLklERU5USUZJRVI6XG4gICAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICBwYXRoID0gcGF0aCArICcuJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcGF0aCA9IHBhdGggKyBrZXkubmFtZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBBY2Nlc3NvclR5cGUuSU5ERVhFUjpcbiAgICAgICAgICBwYXRoID0gYCR7cGF0aH1bJHtrZXkubmFtZX1dYDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdHlwZScpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3BlYyB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHBhdGg6IFBhdGgsIHByaXZhdGUgcmVhZG9ubHkganNvbjogU3BlY0pzb24pIHt9XG5cbiAgc3RhdGljIGNyZWF0ZShwYXRoOiBQYXRoLCBqc29uOiBTcGVjSnNvbikge1xuICAgIHN3aXRjaCAoanNvbi5zcGVjX3R5cGUpIHtcbiAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICByZXR1cm4gbmV3IExpc3RTcGVjKHBhdGgsIGpzb24gYXMgTGlzdFNwZWNKc29uKTtcbiAgICAgIGNhc2UgJ21vZHVsZSc6XG4gICAgICBjYXNlICdpbnN0YW5jZSc6XG4gICAgICAgIHJldHVybiBuZXcgSW5zdGFuY2VTcGVjKHBhdGgsIGpzb24gYXMgSW5zdGFuY2VTcGVjSnNvbik7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb25TcGVjKHBhdGgsIGpzb24gYXMgRnVuY3Rpb25TcGVjSnNvbik7XG4gICAgICBjYXNlICdkaWN0JzpcbiAgICAgICAgcmV0dXJuIG5ldyBEaWN0U3BlYyhwYXRoLCBqc29uIGFzIERpY3RTcGVjSnNvbik7XG4gICAgICBjYXNlICdwcmltaXRpdmUnOlxuICAgICAgICByZXR1cm4gbmV3IFByaW1pdGl2ZVNwZWMocGF0aCwganNvbiBhcyBQcmltaXRpdmVTcGVjSnNvbik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbmV3IFNwZWMocGF0aCwganNvbik7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHR5cGUoKTogU3BlY1R5cGUge1xuICAgIHJldHVybiB0aGlzLmpzb24uc3BlY190eXBlO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbignJywgW10pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9YCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYDogYCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy50eXBlfWAsIFtdKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRDaGlsZFBhdGhzKCk6IFBhdGhbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgc2hvcnREZXNjcmlwdGlvbigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGNyZWF0ZVNwYW4oYCR7dGhpcy50eXBlfWApO1xuICB9XG59XG5cbmNsYXNzIExpc3RTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGxpc3RKc29uOiBMaXN0U3BlY0pzb247XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogTGlzdFNwZWNKc29uKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLmxpc3RKc29uID0ganNvbjtcbiAgfVxuXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5saXN0SnNvbi5sZW5ndGg7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmxpc3RKc29uLmxlbmd0aDtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oJycsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKFxuICAgICAgICBjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX0gKCR7dGhpcy5sZW5ndGh9KSBbYCwgW10pKTtcbiAgICBjb25zdCBpdGVtcyA9IFsuLi50aGlzLmxpc3RKc29uLml0ZW1zXTtcbiAgICBpdGVtcy5sZW5ndGggPSBNYXRoLm1pbihpdGVtcy5sZW5ndGgsIDEwKTtcblxuICAgIGNvbnN0IHNwZWNzID0gaXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcGF0aCA9XG4gICAgICAgICAgdGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KFN0cmluZyhpbmRleCksIEFjY2Vzc29yVHlwZS5JTkRFWEVSKSk7XG4gICAgICByZXR1cm4gU3BlYy5jcmVhdGUocGF0aCwgaXRlbSk7XG4gICAgfSk7XG5cbiAgICBzcGVjcy5mb3JFYWNoKChzcGVjLCBpbmRleCkgPT4ge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChzcGVjLnNob3J0RGVzY3JpcHRpb24oKSk7XG4gICAgICBpZiAoaW5kZXggPCBzcGVjcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCAnKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5saXN0SnNvbi5sZW5ndGggPiBzcGVjcy5sZW5ndGgpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCBcXHUyMDI2JykpO1xuICAgIH1cblxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXWAsIFtdKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBnZXRDaGlsZFBhdGhzKCk6IFBhdGhbXSB7XG4gICAgY29uc3QgbGVuZ3RoID0gTWF0aC5taW4odGhpcy5saXN0SnNvbi5sZW5ndGgsIDEwMCk7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBwYXRocy5wdXNoKHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShTdHJpbmcoaSksIEFjY2Vzc29yVHlwZS5JTkRFWEVSKSkpO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aHM7XG4gIH1cbn1cblxuY2xhc3MgSW5zdGFuY2VTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGluc3RhbmNlSnNvbjogSW5zdGFuY2VTcGVjSnNvbjtcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiBJbnN0YW5jZVNwZWNKc29uKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLmluc3RhbmNlSnNvbiA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9YCkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgOiBgKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMuaW5zdGFuY2VKc29uLnR5cGV9YCkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgaGFzSXRlbXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5pbnN0YW5jZUpzb24ubGVuZ3RoO1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlSnNvbi5rZXlzLnNvcnQoY29tcGFyZVB5dGhvbklkZW50aWZpZXJzKVxuICAgICAgICAubWFwKChrZXkpID0+IHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShrZXksIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKSkpO1xuICB9XG59XG5cbmNsYXNzIEZ1bmN0aW9uU3BlYyBleHRlbmRzIFNwZWMge1xuICBmdW5jdGlvbkpzb246IEZ1bmN0aW9uU3BlY0pzb247XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogRnVuY3Rpb25TcGVjSnNvbikge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5mdW5jdGlvbkpzb24gPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgLCBbXSk7XG4gICAgZWxlbWVudC50aXRsZSA9IHRoaXMuZnVuY3Rpb25Kc29uLmRvY3M7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX0oYCwgW10pKTtcblxuICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmZ1bmN0aW9uSnNvbi5hcmd1bWVudHM7XG5cbiAgICBhcmdzLmZvckVhY2goKGFyZywgaW5kZXgpID0+IHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihhcmcsIFsnYXJndW1lbnQnXSkpO1xuICAgICAgaWYgKGluZGV4IDwgYXJncy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCAnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcpJykpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG59XG5cbmNsYXNzIERpY3RTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGRpY3RKc29uOiBEaWN0U3BlY0pzb247XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogRGljdFNwZWNKc29uKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLmRpY3RKc29uID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCwgW10pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9YCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYDogYCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy50eXBlfSB7YCwgW10pKTtcblxuICAgIGNvbnN0IGtleXMgPSB0aGlzLmtleXM7XG4gICAga2V5cy5sZW5ndGggPSBNYXRoLm1pbihrZXlzLmxlbmd0aCwgMTApO1xuXG4gICAga2V5cy5mb3JFYWNoKChrZXksIGluZGV4KSA9PiB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oa2V5Lm5hbWUsIFtdKSk7XG4gICAgICBpZiAoaW5kZXggPCBrZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcsICcpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJ30nKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBnZXQga2V5cygpOiBLZXlbXSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuZGljdEpzb24uY29udGVudHMpXG4gICAgICAgIC5zb3J0KGNvbXBhcmVQeXRob25JZGVudGlmaWVycylcbiAgICAgICAgLm1hcCgoaWRlbnRpZmllcikgPT4gbmV3IEtleShpZGVudGlmaWVyLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpO1xuICB9XG59XG5cbmNsYXNzIFByaW1pdGl2ZVNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgcHJpbWl0aXZlSnNvbjogUHJpbWl0aXZlU3BlY0pzb247XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogUHJpbWl0aXZlU3BlY0pzb24pIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMucHJpbWl0aXZlSnNvbiA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfTogYCwgW10pKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYXNFbGVtZW50KDEwMCkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgc2hvcnREZXNjcmlwdGlvbigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuYXNFbGVtZW50KDEwKTtcbiAgfVxuXG4gIGFzRWxlbWVudChsZW5ndGg6IG51bWJlcik6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCk7XG4gICAgaWYgKHRoaXMucHJpbWl0aXZlSnNvbi50eXBlID09PSAnc3RyJykge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGBcImAsIFsndHlwZS1zdHInXSkpO1xuICAgIH1cbiAgICBsZXQgc3RyID0gdGhpcy5wcmltaXRpdmVKc29uLnN0cmluZztcbiAgICBpZiAoc3RyLmxlbmd0aCA+IGxlbmd0aCkge1xuICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBsZW5ndGgpICsgJ1xcdTIwMjYnO1xuICAgIH1cbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oc3RyLCBbYHR5cGUtJHt0aGlzLnByaW1pdGl2ZUpzb24udHlwZX1gXSkpO1xuICAgIGlmICh0aGlzLnByaW1pdGl2ZUpzb24udHlwZSA9PT0gJ3N0cicpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXCJgLCBbJ3R5cGUtc3RyJ10pKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuLyoqIENvbXBhcmVzIHR3byBQeXRob24gaWRlbnRpZmllcnMsIHNvcnRpbmcgcHJpdmF0ZSBtZW1iZXJzIGxhc3QuICAqL1xuZnVuY3Rpb24gY29tcGFyZVB5dGhvbklkZW50aWZpZXJzKGE6IHN0cmluZywgYjogc3RyaW5nKTogbnVtYmVyIHtcbiAgYSA9IGEucmVwbGFjZSgvXy9nLCAnXFx1MjAyNicpO1xuICBiID0gYi5yZXBsYWNlKC9fL2csICdcXHUyMDI2Jyk7XG4gIGlmIChhID09PSBiKSByZXR1cm4gMDtcbiAgaWYgKGEgPCBiKSByZXR1cm4gLTE7XG4gIHJldHVybiAxO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9zcGVjcy50cyIsImltcG9ydCB7aW5zcGVjdH0gZnJvbSAnLi9pbnNwZWN0JztcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBXaW5kb3cge1xuICAgICAgaW5zcGVjdChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xuICAgIH1cbn1cblxud2luZG93Lmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9tYWluLnRzIiwiaW1wb3J0IHtnZXRTcGVjc30gZnJvbSAnLi9zZXJ2aWNlJztcbmltcG9ydCB7QWNjZXNzb3JUeXBlLCBLZXksIFBhdGgsIFNwZWN9IGZyb20gJy4vc3BlY3MnO1xuaW1wb3J0IHtUcmVlSXRlbSwgVHJlZUl0ZW1Db252ZXJ0ZXJ9IGZyb20gJy4vdHJlZSc7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluc3BlY3QocGF0aDogc3RyaW5nKSB7XG4gIGNvbnN0IGtleSA9IG5ldyBLZXkocGF0aCwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpO1xuXG4gIGNvbnN0IHNwZWNzID0gYXdhaXQgZ2V0U3BlY3MoW25ldyBQYXRoKFtrZXldKV0pO1xuICBjb25zdCBzcGVjID0gc3BlY3NbMF07XG5cbiAgY29uc3QgdHJlZSA9IFRyZWVJdGVtLmNyZWF0ZShzcGVjLCBuZXcgU3BlY0l0ZW1Db252ZXJ0ZXIoKSk7XG4gIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3V0cHV0LWFyZWEnKSBhcyBFbGVtZW50KS5hcHBlbmRDaGlsZCh0cmVlKTtcbiAgLy8gd2luZG93LnJlc2l6ZU91dHB1dCgpO1xufVxuXG5jbGFzcyBTcGVjSXRlbUNvbnZlcnRlciBleHRlbmRzIFRyZWVJdGVtQ29udmVydGVyPFNwZWM+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFNwZWMpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGRhdGEuY3JlYXRlSGVhZGVyKCk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBTcGVjKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRhdGEuaGFzSXRlbXMoKTtcbiAgfVxuXG4gIGFzeW5jIGdldENoaWxkSXRlbXMoZGF0YTogU3BlYyk6IFByb21pc2U8U3BlY1tdPiB7XG4gICAgY29uc3QgcGF0aHMgPSBkYXRhLmdldENoaWxkUGF0aHMoKTtcbiAgICByZXR1cm4gZ2V0U3BlY3MocGF0aHMpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L2luc3BlY3QudHMiLCJpbXBvcnQge1BhdGgsIFNwZWN9IGZyb20gJy4vc3BlY3MnO1xuaW1wb3J0IHtTcGVjSnNvbn0gZnJvbSAnLi9zcGVjc19qc29uJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNwZWNzKHBhdGhzOiBQYXRoW10pOiBQcm9taXNlPFNwZWNbXT4ge1xuICBjb25zdCByYXdQYXRocyA9IHBhdGhzLm1hcCgocGF0aCkgPT4gcGF0aC50b1N0cmluZygpKTtcblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBnb29nbGUuY29sYWIua2VybmVsLmludm9rZUZ1bmN0aW9uKFxuICAgICAgJ2luc3BlY3QuY3JlYXRlX3NwZWNpZmljYXRpb25fZm9yX2pzJywgW3Jhd1BhdGhzXSwge30pO1xuICBpZiAocmVzdWx0LnN0YXR1cyAhPT0gJ29rJykge1xuICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZW5hbWUpO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IHJlc3VsdC5kYXRhO1xuICBjb25zdCBzcGVjSnNvbiA9IGRhdGFbJ2FwcGxpY2F0aW9uL2pzb24nXSBhcyBTcGVjSnNvbltdO1xuICAvLyBjb25zdCBzcGVjSnNvbiA9IEpTT04ucGFyc2UoanNvbikgYXMgU3BlY0pzb25bXTtcbiAgcmV0dXJuIHNwZWNKc29uLm1hcCgoanNvbiwgaW5kZXgpID0+IFNwZWMuY3JlYXRlKHBhdGhzW2luZGV4XSwganNvbikpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9zZXJ2aWNlLnRzIiwiZXhwb3J0IGNsYXNzIFRyZWVJdGVtQ29udmVydGVyPFQ+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmdldFRpdGxlKGRhdGEpO1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIGdldFRpdGxlKGRhdGE6IFQpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmcoZGF0YSk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBUKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRJdGVtcyhkYXRhOiBUKTogUHJvbWlzZTxUW10+IHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHByaXZhdGUgZGF0YTogVDtcbiAgZGF0YUNvbnZlcnRlcjogVHJlZUl0ZW1Db252ZXJ0ZXI8VD47XG4gIGluZGVudCA9IDA7XG4gIGV4cGFuZGVkXyA9IGZhbHNlO1xuICBpdGVtc0NvbnRhaW5lcl86IEVsZW1lbnQ7XG5cbiAgc3RhdGljIGlzID0gJ2luc3BlY3QtdHJlZS1pdGVtJztcblxuICBzdGF0aWMgY3JlYXRlPFQ+KGRhdGE6IFQsIGRhdGFDb252ZXJ0ZXI6IFRyZWVJdGVtQ29udmVydGVyPFQ+KTogVHJlZUl0ZW08VD4ge1xuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFRyZWVJdGVtLmlzKSBhcyBUcmVlSXRlbTxUPjtcbiAgICBpdGVtLmRhdGEgPSBkYXRhO1xuICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IGRhdGFDb252ZXJ0ZXI7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5pbmRlbnQgPSAwO1xuICB9XG5cbiAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICBjb25zdCB0aXRsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGl0bGVSb3cpO1xuXG4gICAgdGl0bGVSb3cuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbmRlbnRTcGFjZXJfKCkpO1xuXG4gICAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9nZ2xlLmNsYXNzTmFtZSA9ICd0b2dnbGUnO1xuICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRvZ2dsZSk7XG5cbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuZGF0YUNvbnZlcnRlci5jcmVhdGVIZWFkZXIodGhpcy5kYXRhKTtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpO1xuICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGlmICghdGhpcy5kYXRhQ29udmVydGVyLmhhc0l0ZW1zKHRoaXMuZGF0YSkpIHtcbiAgICAgIHRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1zQ29udGFpbmVyXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLml0ZW1zQ29udGFpbmVyXyk7XG5cbiAgICAgIHRpdGxlUm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV4cGFuc2lvbl8oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUluZGVudFNwYWNlcl8oKSB7XG4gICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhY2VyJyk7XG4gICAgc3BhY2VyLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICBzcGFjZXIuc3R5bGUud2lkdGggPSBgJHt0aGlzLmluZGVudCAqIDIwfXB4YDtcbiAgICByZXR1cm4gc3BhY2VyO1xuICB9XG5cbiAgdG9nZ2xlRXhwYW5zaW9uXygpIHtcbiAgICB0aGlzLmV4cGFuZGVkXyA9ICF0aGlzLmV4cGFuZGVkXztcblxuICAgIGlmICh0aGlzLmV4cGFuZGVkXykge1xuICAgICAgdGhpcy5leHBhbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2xsYXBzZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV4cGFuZCgpIHtcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBhd2FpdCB0aGlzLmRhdGFDb252ZXJ0ZXIuZ2V0Q2hpbGRJdGVtcyh0aGlzLmRhdGEpO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBUcmVlSXRlbS5jcmVhdGUoY2hpbGQsIHRoaXMuZGF0YUNvbnZlcnRlcik7XG4gICAgICBpdGVtLmluZGVudCA9IHRoaXMuaW5kZW50ICsgMTtcbiAgICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IHRoaXMuZGF0YUNvbnZlcnRlcjtcbiAgICAgIHRoaXMuaXRlbXNDb250YWluZXJfLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgIH1cbiAgICAvLyB3aW5kb3cucmVzaXplT3V0cHV0KCk7XG4gIH1cblxuICBjb2xsYXBzZSgpIHtcbiAgICB3aGlsZSAodGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdleHBhbmRlZCcpO1xuICAgIC8vIHdpbmRvdy5yZXNpemVPdXRwdXQoKTtcbiAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2luc3BlY3QtdHJlZS1pdGVtJywgVHJlZUl0ZW0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC90cmVlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==