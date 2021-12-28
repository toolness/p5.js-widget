import * as Monaco from 'monaco-editor';

const colors = {
    "light-gray": "#A0A0A0",
    "dark-gray": "#666666",
    "almost-black": "#222",
    "dark-brown": "#704F21",
    "light-brown": "#a67f59",
    "pinkish": "#DC3787", /* not p5 pink, but related */
    "dark-blueish": "#00A1D3",
}

const MonacoTheme: Monaco.editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
    rules: [
        
    ],
    colors: {
        "editor.foreground": colors["dark-gray"]
    }
};
export default MonacoTheme;