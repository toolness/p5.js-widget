declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

declare namespace Url {
  function parse(url: string, parseQueryString?: boolean): any;
}

declare module "url" {
    export = Url;
}

declare interface PreviewFrameErrorReporter {
  (message: string, line?: number): any
}

// Eventually we might want the preview frame to exist on a separate
// origin for security, which means that we'd have to use postMessage()
// to communicate with it. Thus this interface needs to be asynchronous.
declare interface PreviewFrame extends Window {
  startSketch: (sketch: string, p5version: string, maxRunTime: number,
                loopCheckFuncName: string, baseURL: string,
                errorCb: PreviewFrameErrorReporter) => void
}
