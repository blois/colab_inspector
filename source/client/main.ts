import {inspect, inspectSpec, refresh} from './inspect';
import * as wire from './specs_json';

declare global {
    interface Window {
      inspect(path: string): Promise<void>;
      inspectSpec(id: string, json: wire.Spec, showHeader: boolean): void;
      refreshInspector(path: string): Promise<void>;
    }
}

window.inspect = inspect;
window.refreshInspector = refresh;
window.inspectSpec = inspectSpec;
