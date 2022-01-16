var _ = require('underscore');
var webpack = require('webpack');

var production = process.env.NODE_ENV === 'production';

/** @type {import('webpack').Configuration} */
var baseConfig = {
  mode: (production) ? 'production' : 'development',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  optimization: {
    minimize: production,
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, use: 'ts-loader' },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          { 
            loader: "postcss-loader?sourceMap",
            options: {
              postcssOptions: function () {
                return [require('autoprefixer'),
                        require('postcss-custom-properties')];
              }
            }
          }]
      }
    ]
  },
  plugins: [
    // TODO: Monaco is *huge*: like 3Mb. That's probably *ok*, but maybe we can
    // trim the bundle.
    //
    // Shipping default features & only TS, JS:
    // - ts.worker.js: 4.48Mb
    // - main.bundle.js: 3.31Mb
    //
    // Shipping only "coreCommands" & TS, JS:
    // - ts.worker.js: 4.48Mb
    // - main.bundle.js: 3.29Mb
    new (require('monaco-editor-webpack-plugin'))({
      languages: [
        "typescript",
        "javascript"
      ],
    })
  ],
};

var configurations = function() {
  return [].slice.call(arguments).map(function(config) {
    return _.extend(config, baseConfig);
  });
};

module.exports = configurations({
  entry: {
    'main': './lib/main.tsx',
    'preview-frame': './lib/preview-frame.ts',
    'tests': './test/main.tsx'
  },
  devServer: {
    // historyApiFallback: {
    //   index: "../index.html"
    // },
    static: {
      directory: "static/"
    },
  },
  output: {
    filename: '[name].bundle.js'
  }
},
{
  // The p5-widget.js file is directly referenced by widget embedders, so
  // we want the filename and path to be as simple as possible.
  entry: './lib/p5-widget.ts',
  output: {
    filename: 'p5-widget.js'
  }
});
