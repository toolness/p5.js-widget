module.exports = {
  entry: {
    main: './lib/main.tsx',
    tests: './test/main.tsx'
  },
  output: {
    filename: '[name].bundle.js'
  },
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
}
