import {inspect} from './inspect';

declare global {
    interface Window {
      inspect(path: string): Promise<void>;
    }
}

window.inspect = inspect;

export function doSomething(): string {
  return 'here';
}

