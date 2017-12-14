declare interface EvaluateResult {
  data: EvaluateData;
  ename: string;
  evalue: string;
  status: string;
}

declare interface EvaluateData { [index: string]: {}; }

declare namespace google.colab.output.kernel {
  export function invokeFunction(
      name: string, args: Array<{}>, kwargs: {}): Promise<EvaluateResult>;
}

declare module webcomponents {
  export interface CustomElementInit {
    prototype: HTMLElement;
    extends?: string;
  }

  export interface CustomElementConstructor { new(): HTMLElement; }
}

interface Document {
  registerElement(name: string, prototype: webcomponents.CustomElementInit):
      webcomponents.CustomElementConstructor;
}

interface Window {
  resizeOutput(): void;
}

interface HTMLElement {
  createdCallback?(): void;

  attachedCallback?(): void;

  detachedCallback?(): void;
}
