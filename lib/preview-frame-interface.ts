// This needs to be kept in its own file because we want to be able to
// import it from different source bundles without having to actually
// bring in any implementation.

// An alternative would be to use a .d.ts file for this, but we'd like
// to be explicit about importing these interfaces so that the source
// code is easier to understand.

export interface ErrorReporter {
  (message: string, line?: number): any
}

// Eventually we might want the preview frame to exist on a separate
// origin for security, which means that we'd have to use postMessage()
// to communicate with it. Thus this interface needs to be asynchronous.
export interface Runner extends Window {
  startSketch: (sketch: string, p5version: string, maxRunTime: number,
                loopCheckFuncName: string, baseURL: string,
                errorCb: ErrorReporter) => void
}
