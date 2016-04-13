var _ = require('underscore');

var baseConfig = {
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.css$/,
        loaders: ["style", "css?sourceMap", "postcss?sourceMap"]
      }
    ]
  },
  postcss: function () {
    return [require('autoprefixer'), require('precss')];
  }
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
  output: {
    filename: '[name].bundle.js'
  }
},
{
  entry: './lib/p5-widget.ts',
  output: {
    filename: 'p5-widget.js'
  }
});
