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

declare interface PreviewFrameStartSketch {
  (sketch: string, p5version: string, maxRunTime: number,
   loopCheckFuncName: string, errorCb: PreviewFrameErrorReporter): void
}

// Eventually we might want the preview frame to exist on a separate
// origin for security, which means that we'd have to use postMessage()
// to communicate with it. Thus this interface needs to be asynchronous.
declare interface PreviewFrameProxy extends Window {
  startSketch: PreviewFrameStartSketch
}

declare interface PreviewFrameWindow extends Window {
  // This is exported by p5 when it's in global mode.
  noLoop: () => void;
  startSketch: PreviewFrameStartSketch;
}
