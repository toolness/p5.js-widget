import * as Monaco from 'monaco-editor';

const colors = {
    "light-gray": "#A0A0A0",
    "dark-gray": "#666666",
    "almost-black": "#222222",
    "dark-brown": "#704F21",
    "light-brown": "#a67f59",
    "pinkish": "#DC3787", /* not p5 pink, but related */
    "dark-blueish": "#00A1D3",
    "very-light-gray": "#f0f0f0",
}

// See the official themes for inspiration, but note that they use a different tokenizer:
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
        { token: "identifier", foreground: colors["dark-blueish"] },
        { token: "function", foreground: colors["dark-blueish"] },
        { token: "delimiter", foreground: colors["dark-gray"] },
        { token: "operator", foreground: colors["light-brown"] },
        { token: "comment", foreground: colors["light-gray"] },
        { token: "string", foreground: colors["dark-blueish"] }
    ],
    colors: {
        "editor.foreground": colors["dark-gray"],
        "editorLineNumber.foreground": colors['light-gray'],

        // Took me a long time to find:
        // https://stackoverflow.com/questions/65659354/what-is-the-name-of-configuration-to-change-the-background-of-line-number-vscode
        "editorGutter.background": colors['very-light-gray'],
    }
};
export default MonacoTheme;