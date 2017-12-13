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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const inspect_1 = __webpack_require__(1);
window.inspect = inspect_1.inspect;
function doSomething() {
    return 'here';
}
exports.doSomething = doSomething;


/***/ }),
/* 1 */
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
const service_1 = __webpack_require__(2);
const specs_1 = __webpack_require__(3);
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
function getSpecs(paths) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawPaths = paths.map((path) => path.toString());
        return [];
    });
}
exports.getSpecs = getSpecs;


/***/ }),
/* 3 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzBhYWM1NjJjNjM4NjI5ZDlmNmUiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9tYWluLnRzIiwid2VicGFjazovLy8uL3NvdXJjZS9jbGllbnQvaW5zcGVjdC50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3NlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc291cmNlL2NsaWVudC9zcGVjcy50cyIsIndlYnBhY2s6Ly8vLi9zb3VyY2UvY2xpZW50L3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBLHlDQUFrQztBQVFsQyxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFPLENBQUM7QUFFekI7SUFDRSxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFGRCxrQ0FFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkQseUNBQW1DO0FBQ25DLHVDQUFzRDtBQUN0RCxzQ0FBbUQ7QUFHbkQsaUJBQThCLElBQVk7O1FBQ3hDLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBRyxDQUFDLElBQUksRUFBRSxvQkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sS0FBSyxHQUFHLE1BQU0sa0JBQVEsQ0FBQyxD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QUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLENBQUM7SUFDSCxDQUFDO0lBRUssTUFBTTs7WUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRSxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUVILENBQUM7S0FBQTtJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pELENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVwQyxDQUFDOztBQTFFTSxXQUFFLEdBQUcsbUJBQW1CLENBQUM7QUFQbEMsNEJBa0ZDIiwiZmlsZSI6Imluc3BlY3QuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYzBhYWM1NjJjNjM4NjI5ZDlmNmUiLCJpbXBvcnQge2luc3BlY3R9IGZyb20gJy4vaW5zcGVjdCc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAgIGluc3BlY3QocGF0aDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbiAgICB9XG59XG5cbndpbmRvdy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRvU29tZXRoaW5nKCk6IHN0cmluZyB7XG4gIHJldHVybiAnaGVyZSc7XG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NvdXJjZS9jbGllbnQvbWFpbi50cyIsImltcG9ydCB7Z2V0U3BlY3N9IGZyb20gJy4vc2VydmljZSc7XG5pbXBvcnQge0FjY2Vzc29yVHlwZSwgS2V5LCBQYXRoLCBTcGVjfSBmcm9tICcuL3NwZWNzJztcbmltcG9ydCB7VHJlZUl0ZW0sIFRyZWVJdGVtQ29udmVydGVyfSBmcm9tICcuL3RyZWUnO1xuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnNwZWN0KHBhdGg6IHN0cmluZykge1xuICBjb25zdCBrZXkgPSBuZXcgS2V5KHBhdGgsIEFjY2Vzc29yVHlwZS5JREVOVElGSUVSKTtcblxuICBjb25zdCBzcGVjcyA9IGF3YWl0IGdldFNwZWNzKFtuZXcgUGF0aChba2V5XSldKTtcbiAgY29uc3Qgc3BlYyA9IHNwZWNzWzBdO1xuXG4gIGNvbnN0IHRyZWUgPSBUcmVlSXRlbS5jcmVhdGUoc3BlYywgbmV3IFNwZWNJdGVtQ29udmVydGVyKCkpO1xuICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI291dHB1dC1hcmVhJykgYXMgRWxlbWVudCkuYXBwZW5kQ2hpbGQodHJlZSk7XG4gIC8vIHdpbmRvdy5yZXNpemVPdXRwdXQoKTtcbn1cblxuY2xhc3MgU3BlY0l0ZW1Db252ZXJ0ZXIgZXh0ZW5kcyBUcmVlSXRlbUNvbnZlcnRlcjxTcGVjPiB7XG4gIGNyZWF0ZUhlYWRlcihkYXRhOiBTcGVjKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiBkYXRhLmNyZWF0ZUhlYWRlcigpO1xuICB9XG5cbiAgaGFzSXRlbXMoZGF0YTogU3BlYyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkYXRhLmhhc0l0ZW1zKCk7XG4gIH1cblxuICBhc3luYyBnZXRDaGlsZEl0ZW1zKGRhdGE6IFNwZWMpOiBQcm9taXNlPFNwZWNbXT4ge1xuICAgIGNvbnN0IHBhdGhzID0gZGF0YS5nZXRDaGlsZFBhdGhzKCk7XG4gICAgcmV0dXJuIGdldFNwZWNzKHBhdGhzKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC9pbnNwZWN0LnRzIiwiaW1wb3J0IHtQYXRoLCBTcGVjfSBmcm9tICcuL3NwZWNzJztcbmltcG9ydCB7U3BlY0pzb259IGZyb20gJy4vc3BlY3NfanNvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTcGVjcyhwYXRoczogUGF0aFtdKTogUHJvbWlzZTxTcGVjW10+IHtcbiAgY29uc3QgcmF3UGF0aHMgPSBwYXRocy5tYXAoKHBhdGgpID0+IHBhdGgudG9TdHJpbmcoKSk7XG5cbiAgcmV0dXJuIFtdO1xuXG4gIC8vIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbGFiLm91dHB1dC5pbnZva2VLZXJuZWxGdW5jdGlvbihcbiAgLy8gICAgICdpbnNwZWN0LmNyZWF0ZV9zcGVjaWZpY2F0aW9uX2Zvcl9qcycsIFtyYXdQYXRoc10sIHt9KTtcbiAgLy8gaWYgKHJlc3VsdC5zdGF0dXMgIT09ICdvaycpIHtcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVuYW1lKTtcbiAgLy8gfVxuXG4gIC8vIGNvbnN0IGRhdGEgPSByZXN1bHQuZGF0YTtcbiAgLy8gY29uc3QganNvbiA9IGRhdGFbJ2FwcGxpY2F0aW9uL2pzb24nXSBhcyBzdHJpbmc7XG4gIC8vIGNvbnN0IHNwZWNKc29uID0gSlNPTi5wYXJzZShqc29uKSBhcyBTcGVjSnNvbltdO1xuICAvLyByZXR1cm4gc3BlY0pzb24ubWFwKChqc29uLCBpbmRleCkgPT4gU3BlYy5jcmVhdGUocGF0aHNbaW5kZXhdLCBqc29uKSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3NlcnZpY2UudHMiLCJpbXBvcnQge0RpY3RTcGVjSnNvbiwgRnVuY3Rpb25TcGVjSnNvbiwgSW5zdGFuY2VTcGVjSnNvbiwgTGlzdFNwZWNKc29uLCBQcmltaXRpdmVTcGVjSnNvbiwgU3BlY0pzb24sIFNwZWNUeXBlfSBmcm9tICcuL3NwZWNzX2pzb24nO1xuXG5mdW5jdGlvbiBjcmVhdGVTcGFuKHRleHQ6IHN0cmluZywgY2xhc3Nlczogc3RyaW5nW10gPSBbXSk6IEhUTUxTcGFuRWxlbWVudCB7XG4gIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHNwYW4udGV4dENvbnRlbnQgPSB0ZXh0O1xuICBmb3IgKGNvbnN0IGNscyBvZiBjbGFzc2VzKSB7XG4gICAgc3Bhbi5jbGFzc0xpc3QuYWRkKGNscyk7XG4gIH1cbiAgcmV0dXJuIHNwYW47XG59XG5cbmV4cG9ydCBlbnVtIEFjY2Vzc29yVHlwZSB7XG4gIElERU5USUZJRVIsXG4gIElOREVYRVIsXG59XG5cbmV4cG9ydCBjbGFzcyBLZXkge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHR5cGU6IEFjY2Vzc29yVHlwZSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFBhdGgge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBrZXlzOiBLZXlbXSkge31cblxuICBjcmVhdGUoa2V5OiBLZXkpIHtcbiAgICByZXR1cm4gbmV3IFBhdGgoWy4uLnRoaXMua2V5cywga2V5XSk7XG4gIH1cblxuICBnZXQga2V5KCk6IEtleSB7XG4gICAgcmV0dXJuIHRoaXMua2V5c1t0aGlzLmtleXMubGVuZ3RoIC0gMV07XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGxldCBwYXRoID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5c1tpXTtcbiAgICAgIHN3aXRjaCAoa2V5LnR5cGUpIHtcbiAgICAgICAgY2FzZSBBY2Nlc3NvclR5cGUuSURFTlRJRklFUjpcbiAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgIHBhdGggPSBwYXRoICsgJy4nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXRoID0gcGF0aCArIGtleS5uYW1lO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFjY2Vzc29yVHlwZS5JTkRFWEVSOlxuICAgICAgICAgIHBhdGggPSBgJHtwYXRofVske2tleS5uYW1lfV1gO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biB0eXBlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTcGVjIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgcGF0aDogUGF0aCwgcHJpdmF0ZSByZWFkb25seSBqc29uOiBTcGVjSnNvbikge31cblxuICBzdGF0aWMgY3JlYXRlKHBhdGg6IFBhdGgsIGpzb246IFNwZWNKc29uKSB7XG4gICAgc3dpdGNoIChqc29uLnNwZWNfdHlwZSkge1xuICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgIHJldHVybiBuZXcgTGlzdFNwZWMocGF0aCwganNvbiBhcyBMaXN0U3BlY0pzb24pO1xuICAgICAgY2FzZSAnbW9kdWxlJzpcbiAgICAgIGNhc2UgJ2luc3RhbmNlJzpcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0YW5jZVNwZWMocGF0aCwganNvbiBhcyBJbnN0YW5jZVNwZWNKc29uKTtcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvblNwZWMocGF0aCwganNvbiBhcyBGdW5jdGlvblNwZWNKc29uKTtcbiAgICAgIGNhc2UgJ2RpY3QnOlxuICAgICAgICByZXR1cm4gbmV3IERpY3RTcGVjKHBhdGgsIGpzb24gYXMgRGljdFNwZWNKc29uKTtcbiAgICAgIGNhc2UgJ3ByaW1pdGl2ZSc6XG4gICAgICAgIHJldHVybiBuZXcgUHJpbWl0aXZlU3BlYyhwYXRoLCBqc29uIGFzIFByaW1pdGl2ZVNwZWNKc29uKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBuZXcgU3BlYyhwYXRoLCBqc29uKTtcbiAgICB9XG4gIH1cblxuICBnZXQgdHlwZSgpOiBTcGVjVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuanNvbi5zcGVjX3R5cGU7XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKCcnLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX1gLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgOiBgLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnR5cGV9YCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBzaG9ydERlc2NyaXB0aW9uKCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gY3JlYXRlU3BhbihgJHt0aGlzLnR5cGV9YCk7XG4gIH1cbn1cblxuY2xhc3MgTGlzdFNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgbGlzdEpzb246IExpc3RTcGVjSnNvbjtcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiBMaXN0U3BlY0pzb24pIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMubGlzdEpzb24gPSBqc29uO1xuICB9XG5cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmxpc3RKc29uLmxlbmd0aDtcbiAgfVxuXG4gIGhhc0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMubGlzdEpzb24ubGVuZ3RoO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbignJywgW10pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoXG4gICAgICAgIGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfSAoJHt0aGlzLmxlbmd0aH0pIFtgLCBbXSkpO1xuICAgIGNvbnN0IGl0ZW1zID0gWy4uLnRoaXMubGlzdEpzb24uaXRlbXNdO1xuICAgIGl0ZW1zLmxlbmd0aCA9IE1hdGgubWluKGl0ZW1zLmxlbmd0aCwgMTApO1xuXG4gICAgY29uc3Qgc3BlY3MgPSBpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwYXRoID1cbiAgICAgICAgICB0aGlzLnBhdGguY3JlYXRlKG5ldyBLZXkoU3RyaW5nKGluZGV4KSwgQWNjZXNzb3JUeXBlLklOREVYRVIpKTtcbiAgICAgIHJldHVybiBTcGVjLmNyZWF0ZShwYXRoLCBpdGVtKTtcbiAgICB9KTtcblxuICAgIHNwZWNzLmZvckVhY2goKHNwZWMsIGluZGV4KSA9PiB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHNwZWMuc2hvcnREZXNjcmlwdGlvbigpKTtcbiAgICAgIGlmIChpbmRleCA8IHNwZWNzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcsICcpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmxpc3RKc29uLmxlbmd0aCA+IHNwZWNzLmxlbmd0aCkge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcsIFxcdTIwMjYnKSk7XG4gICAgfVxuXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGBdYCwgW10pKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGdldENoaWxkUGF0aHMoKTogUGF0aFtdIHtcbiAgICBjb25zdCBsZW5ndGggPSBNYXRoLm1pbih0aGlzLmxpc3RKc29uLmxlbmd0aCwgMTAwKTtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIHBhdGhzLnB1c2godGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KFN0cmluZyhpKSwgQWNjZXNzb3JUeXBlLklOREVYRVIpKSk7XG4gICAgfVxuICAgIHJldHVybiBwYXRocztcbiAgfVxufVxuXG5jbGFzcyBJbnN0YW5jZVNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgaW5zdGFuY2VKc29uOiBJbnN0YW5jZVNwZWNKc29uO1xuXG4gIGNvbnN0cnVjdG9yKHBhdGg6IFBhdGgsIGpzb246IEluc3RhbmNlU3BlY0pzb24pIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuaW5zdGFuY2VKc29uID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX1gKSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGA6IGApKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5pbnN0YW5jZUpzb24udHlwZX1gKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBoYXNJdGVtcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmluc3RhbmNlSnNvbi5sZW5ndGg7XG4gIH1cblxuICBnZXRDaGlsZFBhdGhzKCk6IFBhdGhbXSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VKc29uLmtleXMuc29ydChjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMpXG4gICAgICAgIC5tYXAoKGtleSkgPT4gdGhpcy5wYXRoLmNyZWF0ZShuZXcgS2V5KGtleSwgQWNjZXNzb3JUeXBlLklERU5USUZJRVIpKSk7XG4gIH1cbn1cblxuY2xhc3MgRnVuY3Rpb25TcGVjIGV4dGVuZHMgU3BlYyB7XG4gIGZ1bmN0aW9uSnNvbjogRnVuY3Rpb25TcGVjSnNvbjtcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiBGdW5jdGlvblNwZWNKc29uKSB7XG4gICAgc3VwZXIocGF0aCwganNvbik7XG5cbiAgICB0aGlzLmZ1bmN0aW9uSnNvbiA9IGpzb247XG4gIH1cblxuICBjcmVhdGVIZWFkZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGF0aC5rZXk7XG4gICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZVNwYW4oYGAsIFtdKTtcbiAgICBlbGVtZW50LnRpdGxlID0gdGhpcy5mdW5jdGlvbkpzb24uZG9jcztcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYCR7dGhpcy5wYXRoLmtleS5uYW1lfShgLCBbXSkpO1xuXG4gICAgY29uc3QgYXJncyA9IHRoaXMuZnVuY3Rpb25Kc29uLmFyZ3VtZW50cztcblxuICAgIGFyZ3MuZm9yRWFjaCgoYXJnLCBpbmRleCkgPT4ge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGFyZywgWydhcmd1bWVudCddKSk7XG4gICAgICBpZiAoaW5kZXggPCBhcmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKCcsICcpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJyknKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbn1cblxuY2xhc3MgRGljdFNwZWMgZXh0ZW5kcyBTcGVjIHtcbiAgZGljdEpzb246IERpY3RTcGVjSnNvbjtcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiBEaWN0U3BlY0pzb24pIHtcbiAgICBzdXBlcihwYXRoLCBqc29uKTtcblxuICAgIHRoaXMuZGljdEpzb24gPSBqc29uO1xuICB9XG5cbiAgY3JlYXRlSGVhZGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhdGgua2V5O1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgLCBbXSk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGAke3RoaXMucGF0aC5rZXkubmFtZX1gLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgOiBgLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnR5cGV9IHtgLCBbXSkpO1xuXG4gICAgY29uc3Qga2V5cyA9IHRoaXMua2V5cztcbiAgICBrZXlzLmxlbmd0aCA9IE1hdGgubWluKGtleXMubGVuZ3RoLCAxMCk7XG5cbiAgICBrZXlzLmZvckVhY2goKGtleSwgaW5kZXgpID0+IHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihrZXkubmFtZSwgW10pKTtcbiAgICAgIGlmIChpbmRleCA8IGtleXMubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oJywgJykpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbignfScpKTtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGdldCBrZXlzKCk6IEtleVtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5kaWN0SnNvbi5jb250ZW50cylcbiAgICAgICAgLnNvcnQoY29tcGFyZVB5dGhvbklkZW50aWZpZXJzKVxuICAgICAgICAubWFwKChpZGVudGlmaWVyKSA9PiBuZXcgS2V5KGlkZW50aWZpZXIsIEFjY2Vzc29yVHlwZS5JTkRFWEVSKSk7XG4gIH1cbn1cblxuY2xhc3MgUHJpbWl0aXZlU3BlYyBleHRlbmRzIFNwZWMge1xuICBwcmltaXRpdmVKc29uOiBQcmltaXRpdmVTcGVjSnNvbjtcblxuICBjb25zdHJ1Y3RvcihwYXRoOiBQYXRoLCBqc29uOiBQcmltaXRpdmVTcGVjSnNvbikge1xuICAgIHN1cGVyKHBhdGgsIGpzb24pO1xuXG4gICAgdGhpcy5wcmltaXRpdmVKc29uID0ganNvbjtcbiAgfVxuXG4gIGNyZWF0ZUhlYWRlcigpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5wYXRoLmtleTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlU3BhbihgYCwgW10pO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihgJHt0aGlzLnBhdGgua2V5Lm5hbWV9OiBgLCBbXSkpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hc0VsZW1lbnQoMTAwKSk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBzaG9ydERlc2NyaXB0aW9uKCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5hc0VsZW1lbnQoMTApO1xuICB9XG5cbiAgYXNFbGVtZW50KGxlbmd0aDogbnVtYmVyKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBjcmVhdGVTcGFuKGBgKTtcbiAgICBpZiAodGhpcy5wcmltaXRpdmVKc29uLnR5cGUgPT09ICdzdHInKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVNwYW4oYFwiYCwgWyd0eXBlLXN0ciddKSk7XG4gICAgfVxuICAgIGxldCBzdHIgPSB0aGlzLnByaW1pdGl2ZUpzb24uc3RyaW5nO1xuICAgIGlmIChzdHIubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIGxlbmd0aCkgKyAnXFx1MjAyNic7XG4gICAgfVxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY3JlYXRlU3BhbihzdHIsIFtgdHlwZS0ke3RoaXMucHJpbWl0aXZlSnNvbi50eXBlfWBdKSk7XG4gICAgaWYgKHRoaXMucHJpbWl0aXZlSnNvbi50eXBlID09PSAnc3RyJykge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjcmVhdGVTcGFuKGBcImAsIFsndHlwZS1zdHInXSkpO1xuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxufVxuXG4vKiogQ29tcGFyZXMgdHdvIFB5dGhvbiBpZGVudGlmaWVycywgc29ydGluZyBwcml2YXRlIG1lbWJlcnMgbGFzdC4gICovXG5mdW5jdGlvbiBjb21wYXJlUHl0aG9uSWRlbnRpZmllcnMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBudW1iZXIge1xuICBhID0gYS5yZXBsYWNlKC9fL2csICdcXHUyMDI2Jyk7XG4gIGIgPSBiLnJlcGxhY2UoL18vZywgJ1xcdTIwMjYnKTtcbiAgaWYgKGEgPT09IGIpIHJldHVybiAwO1xuICBpZiAoYSA8IGIpIHJldHVybiAtMTtcbiAgcmV0dXJuIDE7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zb3VyY2UvY2xpZW50L3NwZWNzLnRzIiwiZXhwb3J0IGNsYXNzIFRyZWVJdGVtQ29udmVydGVyPFQ+IHtcbiAgY3JlYXRlSGVhZGVyKGRhdGE6IFQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmdldFRpdGxlKGRhdGEpO1xuICAgIHJldHVybiB0aXRsZTtcbiAgfVxuXG4gIGdldFRpdGxlKGRhdGE6IFQpOiBzdHJpbmcge1xuICAgIHJldHVybiBTdHJpbmcoZGF0YSk7XG4gIH1cblxuICBoYXNJdGVtcyhkYXRhOiBUKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hpbGRJdGVtcyhkYXRhOiBUKTogUHJvbWlzZTxUW10+IHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIHByaXZhdGUgZGF0YTogVDtcbiAgZGF0YUNvbnZlcnRlcjogVHJlZUl0ZW1Db252ZXJ0ZXI8VD47XG4gIGluZGVudCA9IDA7XG4gIGV4cGFuZGVkXyA9IGZhbHNlO1xuICBpdGVtc0NvbnRhaW5lcl86IEVsZW1lbnQ7XG5cbiAgc3RhdGljIGlzID0gJ2luc3BlY3QtdHJlZS1pdGVtJztcblxuICBzdGF0aWMgY3JlYXRlPFQ+KGRhdGE6IFQsIGRhdGFDb252ZXJ0ZXI6IFRyZWVJdGVtQ29udmVydGVyPFQ+KTogVHJlZUl0ZW08VD4ge1xuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFRyZWVJdGVtLmlzKSBhcyBUcmVlSXRlbTxUPjtcbiAgICBpdGVtLmRhdGEgPSBkYXRhO1xuICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IGRhdGFDb252ZXJ0ZXI7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5pbmRlbnQgPSAwO1xuICB9XG5cbiAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICBjb25zdCB0aXRsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGl0bGVSb3cpO1xuXG4gICAgdGl0bGVSb3cuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbmRlbnRTcGFjZXJfKCkpO1xuXG4gICAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9nZ2xlLmNsYXNzTmFtZSA9ICd0b2dnbGUnO1xuICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRvZ2dsZSk7XG5cbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuZGF0YUNvbnZlcnRlci5jcmVhdGVIZWFkZXIodGhpcy5kYXRhKTtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpO1xuICAgIHRpdGxlUm93LmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGlmICghdGhpcy5kYXRhQ29udmVydGVyLmhhc0l0ZW1zKHRoaXMuZGF0YSkpIHtcbiAgICAgIHRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdlbXB0eScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLml0ZW1zQ29udGFpbmVyXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLml0ZW1zQ29udGFpbmVyXyk7XG5cbiAgICAgIHRpdGxlUm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV4cGFuc2lvbl8oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUluZGVudFNwYWNlcl8oKSB7XG4gICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhY2VyJyk7XG4gICAgc3BhY2VyLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICBzcGFjZXIuc3R5bGUud2lkdGggPSBgJHt0aGlzLmluZGVudCAqIDIwfXB4YDtcbiAgICByZXR1cm4gc3BhY2VyO1xuICB9XG5cbiAgdG9nZ2xlRXhwYW5zaW9uXygpIHtcbiAgICB0aGlzLmV4cGFuZGVkXyA9ICF0aGlzLmV4cGFuZGVkXztcblxuICAgIGlmICh0aGlzLmV4cGFuZGVkXykge1xuICAgICAgdGhpcy5leHBhbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2xsYXBzZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV4cGFuZCgpIHtcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBhd2FpdCB0aGlzLmRhdGFDb252ZXJ0ZXIuZ2V0Q2hpbGRJdGVtcyh0aGlzLmRhdGEpO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBUcmVlSXRlbS5jcmVhdGUoY2hpbGQsIHRoaXMuZGF0YUNvbnZlcnRlcik7XG4gICAgICBpdGVtLmluZGVudCA9IHRoaXMuaW5kZW50ICsgMTtcbiAgICAgIGl0ZW0uZGF0YUNvbnZlcnRlciA9IHRoaXMuZGF0YUNvbnZlcnRlcjtcbiAgICAgIHRoaXMuaXRlbXNDb250YWluZXJfLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgIH1cbiAgICAvLyB3aW5kb3cucmVzaXplT3V0cHV0KCk7XG4gIH1cblxuICBjb2xsYXBzZSgpIHtcbiAgICB3aGlsZSAodGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lcl8ubGFzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdleHBhbmRlZCcpO1xuICAgIC8vIHdpbmRvdy5yZXNpemVPdXRwdXQoKTtcbiAgfVxufVxuXG4vLyBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2luc3BlY3QtdHJlZS1pdGVtJywgVHJlZUl0ZW0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc291cmNlL2NsaWVudC90cmVlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==