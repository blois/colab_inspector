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
        const result = yield colab.output.kernel.invokeFunction('inspect.create_specification_for_js', [rawPaths], {});
        if (result.status !== 'ok') {
            throw new Error(result.ename);
        }
        const data = result.data;
        const json = data['application/json'];
        const specJson = JSON.parse(json);
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWFkMWYzMzc3ODFmOTc5MzM0M2EiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zcGVjcy50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9pbnNwZWN0LnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvc2VydmljZS50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDM0RBLG9CQUFvQixJQUFZLEVBQUUsVUFBb0IsRUFBRTtJQUN0RCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsSUFB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LEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUVILENBQUM7S0FBQTtJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pELENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVwQyxDQUFDOztBQTFFTSxXQUFFLEdBQUcsbUJBQW1CLENBQUM7QUFQbEMsNEJBa0ZDIiwiZmlsZSI6Imluc3BlY3Rvci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhYWQxZjMzNzc4MWY5NzkzMzQzYSIsImltcG9ydCB7RGljdFNwZWNKc29uLCBGdW5jdGlvblNwZWNKc29uLCBJbnN0YW5jZVNwZWNKc29uLCBMaXN0U3BlY0pzb24sIFByaW1pdGl2ZVNwZWNKc29uLCBTcGVjSnNvbiwgU3BlY1R5cGV9IGZyb20gJy4vc3BlY3NfanNvbic7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNwYW4odGV4dDogc3RyaW5nLCBjbGFzc2VzOiBzdHJpbmdbXSA9IFtdKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgc3Bhbi50ZXh0Q29udGVudCA9IHRleHQ7XG4gIGZvciAoY29uc3QgY2xzIG9mIGNsYXNzZXMpIHtcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgfVxuICByZXR1cm4gc3Bhbjtcbn1cblxuZXhwb3J0IGVudW0gQWNjZXNzb3JUeXBlIHtcbiAgSURFTlRJRklFUixcbiAgSU5ERVhFUixcbn1cblxuZXhwb3J0IGNsYXNzIEtleSB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IHN0cmluZywgcmVhZG9ubHkgdHlwZTogQWNjZXNzb3JUeXBlKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUGF0aCB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGtleXM6IEtleVtdKSB7fVxuXG4gIGNyZWF0ZShrZXk6IEtleSkge1xuICAgIHJldHVybiBuZXcgUGF0aChbLi4udGhpcy5rZXlzLCBrZXldKTtcbiAgfVxuXG4gIGdldCBrZXkoKTogS2V5IHtcbiAgICByZXR1cm4gdGhpcy5rZXlzW3RoaXMua2V5cy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgbGV0IHBhdGggPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMua2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy5rZXlzW2ldO1xuICAgICAgc3dpdGNoIChrZXkudHlwZSkge1xuICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSOlxuICAgICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgcGF0aCA9IHBhdGggKyAnLic7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhdGggPSBwYXRoICsga2V5Lm5hbWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQWNjZXNzb3JUeXBlLklOREVYRVI6XG4gICAgICAgICAgcGF0aCA9IGAke3BhdGh9WyR7a2V5Lm5hbWV9XWA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwZWMge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBwYXRoOiBQYXRoLCBwcml2YXRlIHJlYWRvbmx5IGpzb246IFNwZWNKc29uKSB7fVxuXG4gIHN0YXRpYyBjcmVhdGUocGF0aDogUGF0aCwganNvbjogU3BlY0pzb24pIHtcbiAgICBzd2l0Y2ggKGpzb24uc3BlY190eXBlKSB7XG4gICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0U3BlYyhwYXRoLCBqc29uIGFzIExpc3RTcGVjSnNvbik7XG4gICAgICBjYXNlICdtb2R1bGUnOlxuICAgICAgY2FzZSAnaW5zdGFuY2UnOlxuICAgICAgICByZXR1cm4gbmV3IEluc3RhbmNlU3BlYyhwYXRoLCBqc29uIGFzIEluc3RhbmNlU3BlY0pzb24pO1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uU3BlYyhwYXRoLCBqc29uIGFzIEZ1bmN0aW9uU3BlY0pzb24pO1xuICAgICAgY2FzZSAnZGljdCc6XG4gICAgICAgIHJldHVybiBuZXcgRGljdFNwZWMocGF0aCwganNvbiBhcyBEaWN0U3BlY0pzb24pO1xuICAgICAgY2FzZSAncHJpbWl0aXZlJzpcbiAgICAgICAgcmV0dXJuIG5ldyBQcmltaXRpdmVTcGVjKHBhdGgsIGpzb24gYXMgUHJpbWl0aXZlU3BlY0pzb24pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG5ldyBTcGVjKHBhdGgsIGpzb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0eXBlKCk6IFNwZWNUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5qc29uLnNwZWNfdHlwZTtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oJycsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfWAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX1gLCBbXSkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgaGFzSXRlbXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24oKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiBjcmVhdGVTcGFuKGAke3RoaXMudHlwZX1gKTtcbiAgfVxufVxuXG5jbGFzcyBMaXN0U3BlYyBleHRlbmRzIFNwZWMge1xuICBsaXN0SnNvbjogTGlzdFNwZWNKc29uO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IExpc3RTcGVjSnNvbikge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5saXN0SnNvbiA9IGpzb247XG4gIH1cblxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubGlzdEpzb24ubGVuZ3RoO1xuICB9XG5cbiAgaGFzSXRlbXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5saXN0SnNvbi5sZW5ndGg7XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9ICgke3RoaXMubGVuZ3RofSkgW2AsIFtdKSk7XG4gICAgY29uc3QgaXRlbXMgPSBbLi4udGhpcy5saXN0SnNvbi5pdGVtc107XG4gICAgaXRlbXMubGVuZ3RoID0gTWF0aC5taW4oaXRlbXMubGVuZ3RoLCAxMCk7XG5cbiAgICBjb25zdCBzcGVjcyA9IGl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPVxuICAgICAgICAgIHRoaXMucGF0aC5jcmVhdGUobmV3IEtleShTdHJpbmcoaW5kZXgpLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpO1xuICAgICAgcmV0dXJuIFNwZWMuY3JlYXRlKHBhdGgsIGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgc3BlY3MuZm9yRWFjaCgoc3BlYywgaW5kZXgpID0+IHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoc3BlYy5zaG9ydERlc2NyaXB0aW9uKCkpO1xuICAgICAgaWYgKGluZGV4IDwgc3BlY3MubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMubGlzdEpzb24ubGVuZ3RoID4gc3BlY3MubGVuZ3RoKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgXFx1MjAyNicpKTtcbiAgICB9XG5cbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYF1gLCBbXSkpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZ2V0Q2hpbGRQYXRocygpOiBQYXRoW10ge1xuICAgIGNvbnN0IGxlbmd0aCA9IE1hdGgubWluKHRoaXMubGlzdEpzb24ubGVuZ3RoLCAxMDApO1xuICAgIGNvbnN0IHBhdGhzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgcGF0aHMucHVzaCh0aGlzLnBhdGguY3JlYXRlKG5ldyBLZXkoU3RyaW5nKGkpLCBBY2Nlc3NvclR5cGUuSU5ERVhFUikpKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG59XG5cbmNsYXNzIEluc3RhbmNlU3BlYyBleHRlbmRzIFNwZWMge1xuICBpbnN0YW5jZUpzb246IEluc3RhbmNlU3BlY0pzb247XG5cbiAgY29uc3RydWN0b3IocGF0aDogUGF0aCwganNvbjogSW5zdGFuY2VTcGVjSnNvbikge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5pbnN0YW5jZUpzb24gPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfWApKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYDogYCkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLmluc3RhbmNlSnNvbi50eXBlfWApKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuaW5zdGFuY2VKc29uLmxlbmd0aDtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZUpzb24ua2V5cy5zb3J0KGNvbXBhcmVQeXRob25JZGVudGlmaWVycylcbiAgICAgICAgLm1hcCgoa2V5KSA9PiB0aGlzLnBhdGguY3JlYXRlKG5ldyBLZXkoa2V5LCBBY2Nlc3NvclR5cGUuSURFTlRJRklFUikpKTtcbiAgfVxufVxuXG5jbGFzcyBGdW5jdGlvblNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgZnVuY3Rpb25Kc29uOiBGdW5jdGlvblNwZWNKc29uO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IEZ1bmN0aW9uU3BlY0pzb24pIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZnVuY3Rpb25Kc29uID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCwgW10pO1xuICAgIGVsZW1lbnQudGl0bGUgPSB0aGlzLmZ1bmN0aW9uSnNvbi5kb2NzO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9KGAsIFtdKSk7XG5cbiAgICBjb25zdCBhcmdzID0gdGhpcy5mdW5jdGlvbkpzb24uYXJndW1lbnRzO1xuXG4gICAgYXJncy5mb3JFYWNoKChhcmcsIGluZGV4KSA9PiB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYXJnLCBbJ2FyZ3VtZW50J10pKTtcbiAgICAgIGlmIChpbmRleCA8IGFyZ3MubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignKScpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG5jbGFzcyBEaWN0U3BlYyBleHRlbmRzIFNwZWMge1xuICBkaWN0SnNvbjogRGljdFNwZWNKc29uO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IERpY3RTcGVjSnNvbikge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5kaWN0SnNvbiA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfWAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMudHlwZX0ge2AsIFtdKSk7XG5cbiAgICBjb25zdCBrZXlzID0gdGhpcy5rZXlzO1xuICAgIGtleXMubGVuZ3RoID0gTWF0aC5taW4oa2V5cy5sZW5ndGgsIDEwKTtcblxuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGtleS5uYW1lLCBbXSkpO1xuICAgICAgaWYgKGluZGV4IDwga2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignLCAnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCd9JykpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgZ2V0IGtleXMoKTogS2V5W10ge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmRpY3RKc29uLmNvbnRlbnRzKVxuICAgICAgICAuc29ydChjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMpXG4gICAgICAgIC5tYXAoKGlkZW50aWZpZXIpID0+IG5ldyBLZXkoaWRlbnRpZmllciwgQWNjZXNzb3JUeXBlLklOREVYRVIpKTtcbiAgfVxufVxuXG5jbGFzcyBQcmltaXRpdmVTcGVjIGV4dGVuZHMgU3BlYyB7XG4gIHByaW1pdGl2ZUpzb246IFByaW1pdGl2ZVNwZWNKc29uO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IFByaW1pdGl2ZVNwZWNKc29uKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLnByaW1pdGl2ZUpzb24gPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX06IGAsIFtdKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmFzRWxlbWVudCgxMDApKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHNob3J0RGVzY3JpcHRpb24oKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmFzRWxlbWVudCgxMCk7XG4gIH1cblxuICBhc0VsZW1lbnQobGVuZ3RoOiBudW1iZXIpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGApO1xuICAgIGlmICh0aGlzLnByaW1pdGl2ZUpzb24udHlwZSA9PT0gJ3N0cicpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgXCJgLCBbJ3R5cGUtc3RyJ10pKTtcbiAgICB9XG4gICAgbGV0IHN0ciA9IHRoaXMucHJpbWl0aXZlSnNvbi5zdHJpbmc7XG4gICAgaWYgKHN0ci5sZW5ndGggPiBsZW5ndGgpIHtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgbGVuZ3RoKSArICdcXHUyMDI2JztcbiAgICB9XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKHN0ciwgW2B0eXBlLSR7dGhpcy5wcmltaXRpdmVKc29uLnR5cGV9YF0pKTtcbiAgICBpZiAodGhpcy5wcmltaXRpdmVKc29uLnR5cGUgPT09ICdzdHInKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYFwiYCwgWyd0eXBlLXN0ciddKSk7XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG59XG5cbi8qKiBDb21wYXJlcyB0d28gUHl0aG9uIGlkZW50aWZpZXJzLCBzb3J0aW5nIHByaXZhdGUgbWVtYmVycyBsYXN0LiAgKi9cbmZ1bmN0aW9uIGNvbXBhcmVQeXRob25JZGVudGlmaWVycyhhOiBzdHJpbmcsIGI6IHN0cmluZyk6IG51bWJlciB7XG4gIGEgPSBhLnJlcGxhY2UoL18vZywgJ1xcdTIwMjYnKTtcbiAgYiA9IGIucmVwbGFjZSgvXy9nLCAnXFx1MjAyNicpO1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIDA7XG4gIGlmIChhIDwgYikgcmV0dXJuIC0xO1xuICByZXR1cm4gMTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvc3BlY3MudHMiLCJpbXBvcnQge2luc3BlY3R9IGZyb20gJy4vaW5zcGVjdCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgIGluc3BlY3QocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbiAgICB9XG59XG5cbndpbmRvdy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvbWFpbi50cyIsImltcG9ydCB7Z2V0U3BlY3N9IGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQge0FjY2Vzc29yVHlwZSwgS2V5LCBQYXRoLCBTcGVjfSBmcm9tICcuL3NwZWNzJztcbmltcG9ydCB7VHJlZUl0ZW0sIFRyZWVJdGVtQ29udmVydGVyfSBmcm9tICcuL3RyZWUnO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnNwZWN0KHBhdGg6IHN0cmluZykge1xuICBjb25zdCBrZXkgPSBuZXcgS2V5KHBhdGgsIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKTtcblxuICBjb25zdCBzcGVjcyA9IGF3YWl0IGdldFNwZWNzKFtuZXcgUGF0aChba2V5XSldKTtcbiAgY29uc3Qgc3BlYyA9IHNwZWNzWzBdO1xuXG4gIGNvbnN0IHRyZWUgPSBUcmVlSXRlbS5jcmVhdGUoc3BlYywgbmV3IFNwZWNJdGVtQ29udmVydGVyKCkpO1xuICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI291dHB1dC1hcmVhJykgYXMgRWxlbWVudCkuYXBwZW5kQ2hpbGQodHJlZSk7XG4gIC8vIHdpbmRvdy5yZXNpemVPdXRwdXQoKTtcbn1cblxuY2xhc3MgU3BlY0l0ZW1Db252ZXJ0ZXIgZXh0ZW5kcyBUcmVlSXRlbUNvbnZlcnRlcjxTcGVjPiB7XG4gIGNyZWF0ZUhlYWRlcihkYXRhOiBTcGVjKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiBkYXRhLmNyZWF0ZUhlYWRlcigpO1xuICB9XG5cbiAgaGFzSXRlbXMoZGF0YTogU3BlYyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkYXRhLmhhc0l0ZW1zKCk7XG4gIH1cblxuICBhc3luYyBnZXRDaGlsZEl0ZW1zKGRhdGE6IFNwZWMpOiBQcm9taXNlPFNwZWNbXT4ge1xuICAgIGNvbnN0IHBhdGhzID0gZGF0YS5nZXRDaGlsZFBhdGhzKCk7XG4gICAgcmV0dXJuIGdldFNwZWNzKHBhdGhzKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9pbnNwZWN0LnRzIiwiaW1wb3J0IHtQYXRoLCBTcGVjfSBmcm9tICcuL3NwZWNzJztcbmltcG9ydCB7U3BlY0pzb259IGZyb20gJy4vc3BlY3NfanNvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTcGVjcyhwYXRoczogUGF0aFtdKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgY29uc3QgcmF3UGF0aHMgPSBwYXRocy5tYXAoKHBhdGgpID0+IHBhdGgudG9TdHJpbmcoKSk7XG5cbiAgLy8gcmV0dXJuIFtdO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbGFiLm91dHB1dC5rZXJuZWwuaW52b2tlRnVuY3Rpb24oXG4gICAgICAnaW5zcGVjdC5jcmVhdGVfc3BlY2lmaWNhdGlvbl9mb3JfanMnLCBbcmF3UGF0aHNdLCB7fSk7XG4gIGlmIChyZXN1bHQuc3RhdHVzICE9PSAnb2snKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lbmFtZSk7XG4gIH1cblxuICBjb25zdCBkYXRhID0gcmVzdWx0LmRhdGE7XG4gIGNvbnN0IGpzb24gPSBkYXRhWydhcHBsaWNhdGlvbi9qc29uJ10gYXMgc3RyaW5nO1xuICBjb25zdCBzcGVjSnNvbiA9IEpTT04ucGFyc2UoanNvbikgYXMgU3BlY0pzb25bXTtcbiAgcmV0dXJuIHNwZWNKc29uLm1hcCgoanNvbiwgaW5kZXgpID0+IFNwZWMuY3JlYXRlKHBhdGhzW2luZGV4XSwganNvbikpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9zZXJ2aWNlLnRzIiwiZXhwb3J0IGNsYXNzIFRyZWVJdGVtQ29udmVydGVyPFQ+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmdldFRpdGxlKGRhdGEpO1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIGdldFRpdGxlKGRhdGE6IFQpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmcoZGF0YSk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBUKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRJdGVtcyhkYXRhOiBUKTogUHJvbWlzZTxUW10+IHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHByaXZhdGUgZGF0YTogVDtcbiAgZGF0YUNvbnZlcnRlcjogVHJlZUl0ZW1Db252ZXJ0ZXI8VD47XG4gIGluZGVudCA9IDA7XG4gIGV4cGFuZGVkXyA9IGZhbHNlO1xuICBpdGVtc0NvbnRhaW5lcl86IEVsZW1lbnQ7XG5cbiAgc3RhdGljIGlzID0gJ2luc3BlY3QtdHJlZS1pdGVtJztcblxuICBzdGF0aWMgY3JlYXRlPFQ+KGRhdGE6IFQsIGRhdGFDb252ZXJ0ZXI6IFRyZWVJdGVtQ29udmVydGVyPFQ+KTogVHJlZUl0ZW08VD4ge1xuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFRyZWVJdGVtLmlzKSBhcyBUcmVlSXRlbTxUPjtcbiAgICBpdGVtLmRhdGEgPSBkYXRhO1xuICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IGRhdGFDb252ZXJ0ZXI7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5pbmRlbnQgPSAwO1xuICB9XG5cbiAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICBjb25zdCB0aXRsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGl0bGVSb3cpO1xuXG4gICAgdGl0bGVSb3cuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbmRlbnRTcGFjZXJfKCkpO1xuXG4gICAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9nZ2xlLmNsYXNzTmFtZSA9ICd0b2dnbGUnO1xuICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRvZ2dsZSk7XG5cbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuZGF0YUNvbnZlcnRlci5jcmVhdGVIZWFkZXIodGhpcy5kYXRhKTtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpO1xuICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGlmICghdGhpcy5kYXRhQ29udmVydGVyLmhhc0l0ZW1zKHRoaXMuZGF0YSkpIHtcbiAgICAgIHRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1zQ29udGFpbmVyXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLml0ZW1zQ29udGFpbmVyXyk7XG5cbiAgICAgIHRpdGxlUm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV4cGFuc2lvbl8oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUluZGVudFNwYWNlcl8oKSB7XG4gICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhY2VyJyk7XG4gICAgc3BhY2VyLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICBzcGFjZXIuc3R5bGUud2lkdGggPSBgJHt0aGlzLmluZGVudCAqIDIwfXB4YDtcbiAgICByZXR1cm4gc3BhY2VyO1xuICB9XG5cbiAgdG9nZ2xlRXhwYW5zaW9uXygpIHtcbiAgICB0aGlzLmV4cGFuZGVkXyA9ICF0aGlzLmV4cGFuZGVkXztcblxuICAgIGlmICh0aGlzLmV4cGFuZGVkXykge1xuICAgICAgdGhpcy5leHBhbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2xsYXBzZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV4cGFuZCgpIHtcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBhd2FpdCB0aGlzLmRhdGFDb252ZXJ0ZXIuZ2V0Q2hpbGRJdGVtcyh0aGlzLmRhdGEpO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBUcmVlSXRlbS5jcmVhdGUoY2hpbGQsIHRoaXMuZGF0YUNvbnZlcnRlcik7XG4gICAgICBpdGVtLmluZGVudCA9IHRoaXMuaW5kZW50ICsgMTtcbiAgICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IHRoaXMuZGF0YUNvbnZlcnRlcjtcbiAgICAgIHRoaXMuaXRlbXNDb250YWluZXJfLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgIH1cbiAgICAvLyB3aW5kb3cucmVzaXplT3V0cHV0KCk7XG4gIH1cblxuICBjb2xsYXBzZSgpIHtcbiAgICB3aGlsZSAodGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdleHBhbmRlZCcpO1xuICAgIC8vIHdpbmRvdy5yZXNpemVPdXRwdXQoKTtcbiAgfVxufVxuXG4vLyBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2luc3BlY3QtdHJlZS1pdGVtJywgVHJlZUl0ZW0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC90cmVlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==