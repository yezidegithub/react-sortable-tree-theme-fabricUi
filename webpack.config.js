const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const target = process.env.TARGET || 'umd';

const styleLoader = {
  loader: 'style-loader',
  options: { insertAt: 'top' },
};

const fileLoader = {
  loader: 'file-loader',
  options: { name: 'static/[name].[ext]' },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      autoprefixer({ browsers: ['IE >= 9', 'last 2 versions', '> 1%'] }),
    ],
  },
};

const cssLoader = isLocal => ({
  loader: 'css-loader',
  options: {
    modules: true,
    '-autoprefixer': true,
    importLoaders: true,
    localIdentName: isLocal ? 'rstcustom__[local]' : '[local]',
  },
});

const config = {
  entry: './index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ReactSortableTreeThemeFileExplorer',
  },
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: false,
          beautify: true,
          comments: true,
        },
        sourceMap: true
      })
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.scss$/,
        use: [styleLoader, cssLoader(true), postcssLoader, 'sass-loader'],
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        // Used for importing css from external modules (react-virtualized, etc.)
        test: /\.css$/,
        use: [styleLoader, cssLoader(false), postcssLoader],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: path.join(__dirname, 'node_modules'),
      }
    ],
  },
};

switch (target) {
  case 'umd':
    // Exclude library dependencies from the bundle
    config.externals = [
      nodeExternals({
        // load non-javascript files with extensions, presumably via loaders
        whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      })
    ];
    break;
  case 'development':
    config.devtool = 'eval';
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      exclude: path.join(__dirname, 'node_modules'),
    });
    config.entry = ['react-hot-loader/patch', './demo/index'];
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    };
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './demo/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
      new webpack.NoEmitOnErrorsPlugin(),
    ];
    config.devServer = {
      contentBase: path.join(__dirname, 'build'),
      port: process.env.PORT || 3001,
      stats: 'minimal',
    };

    break;
  case 'demo':
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|svg)$/,
      use: [fileLoader],
      exclude: path.join(__dirname, 'node_modules'),
    });
    config.entry = './demo/index';
    config.output = {
      path: path.join(__dirname, 'build'),
      filename: 'static/[name].js',
    };
    config.plugins = [
      new HtmlWebpackPlugin({
        inject: true,
        template: './demo/index.html',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
    ];

    break;
  default:
}

module.exports = config;
