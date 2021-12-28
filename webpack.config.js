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
    new (require('monaco-editor-webpack-plugin'))()
  ].concat(
    production ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ] : []
  ),
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
