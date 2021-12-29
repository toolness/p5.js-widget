import * as Monaco from 'monaco-editor';

const colors = {
    "light-gray": "#A0A0A0",
    "dark-gray": "#666666",
    "almost-black": "#222222",
    "dark-brown": "#704F21",
    "light-brown": "#a67f59",
    "pinkish": "#DC3787", /* not p5 pink, but related */
    "dark-blueish": "#00A1D3",
}

// See the official themes for inspiration:
//
// https://github.com/Microsoft/vscode/blob/main/src/vs/editor/standalone/common/themes.ts#L13
const MonacoTheme: Monaco.editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
    rules: [
        { token: "meta", foreground: colors["dark-gray"] },
        { token: "storage", foreground: colors["dark-brown"] },
        { token: "keyword", foreground: colors["dark-brown"] },
        { token: "number", foreground: colors["pinkish"] },
        { token: "variable", foreground: colors["dark-blueish"] },
        { token: "variable.predefined", foreground: colors["dark-blueish"] },
        { token: "function", foreground: colors["dark-blueish"] },
        // { token: "variable.parameter.definition", foreground: colors["dark-blueish"] },
        // { token: "variable.parameter", foreground: colors["almost-black"] },
        { token: "keyword.operator", foreground: colors["light-brown"] },
        { token: "operator", foreground: colors["light-brown"] },
        { token: "comment", foreground: colors["light-gray"] },
        { token: "string", foreground: colors["dark-blueish"] }
    ],
    colors: {
        "editor.foreground": colors["dark-gray"]
    }
};
export default MonacoTheme;