const path = require('path');
const webpack = require('webpack');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const externalAssets = [
  'solid-auth-client/dist-popup/popup.html',
  'rdflib/dist/rdflib.min.js',
  'solid-auth-client/dist-lib/solid-auth-client.bundle.js',
  'solid-auth-client/dist-lib/solid-auth-client.bundle.js.map'
];

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.html$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { 
          presets: ['@babel/env', '@babel/preset-react', '@babel/preset-flow'], 
          plugins: ["react-hot-loader/babel", "@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
              'node_modules/purecss-sass/vendor/assets/stylesheets/purecss/_base.scss',
              'node_modules/purecss-sass/vendor/assets/stylesheets/purecss/_grids.scss',
              'node_modules/purecss-sass/vendor/assets/stylesheets/purecss/_grids-responsive.scss',
              'src/theme/main.scss'
            ]
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
            }
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'img/',
              publicPath: 'public/assets/img/'
            }
          }
        ]
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  externals: {
    'node-fetch': 'fetch',
    'text-encoding': 'TextEncoder',
    'whatwg-url': 'window',
    'isomorphic-fetch': 'fetch',
    '@trust/webcrypto': 'crypto'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    port: 3100,
    publicPath: 'http://localhost:3000/dist/',
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin(externalAssets.map(a => require.resolve(a))),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        ...externalAssets.map(f => f.replace(/.*\//, ''))
      ].filter(f => /\.(js|css|scss)$/.test(f)),
      append: false
    })
  ]
};