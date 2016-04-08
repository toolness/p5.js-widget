This is an experimental widget to make it easier to embed editable
p5 sketches in blog posts, interactive curricula, and other places.

For more information on its usage, please see the [website][].

The rest of this documentation is about *developing* p5.js-widget,
not using it.

## Quick Start

```
git clone https://github.com/toolness/p5.js-widget.git
cd p5.js-widget
npm install
npm start
```

This will start a development server at
http://localhost:8080/.

The development server automatically rebuilds the main JS bundle
whenever you change any of its dependencies.

Note that this project uses [TypeScript][] and [React][]. Many
source files use [ECMAScript 2015][], TypeScript *and* [JSX][],
which can make the code look a bit unfamiliar.

[website]: https://toolness.github.io/p5.js-widget/
[TypeScript]: http://typescriptlang.org/
[React]: http://facebook.github.io/react/
[JSX]: https://facebook.github.io/react/docs/jsx-in-depth.html
[ECMAScript 2015]: https://babeljs.io/docs/learn-es2015/
