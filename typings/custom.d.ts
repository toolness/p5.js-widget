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
