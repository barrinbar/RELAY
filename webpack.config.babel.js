// @flow

import path from 'path'
import webpack from 'webpack'

import { WDS_PORT } from './src/shared/config'
import { isProd } from './src/shared/util'

export default {
  entry: [
    'react-hot-loader/patch',
    './src/client',
  ],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? '/static/' : `http://localhost:${WDS_PORT}/dist/`,
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
      // { test: /\.jpg$/, use: 'file-loader' },
      { test: /\.(jpe?g|png|gif|svg|ttf)$/i, use: { loader: 'url-loader', options: { limit: 25000 } } },
    ],
    loaders: [
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loader: ['url-loader?limit=25000',
      //     'file?hash=sha512&digest=hex&name=[hash].[ext]',
      //     'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
      //   ],
      // },
      // {
      //   test: /\.(png|svg)?$/,
      //   loader: ['url-loader',
      //   ],
      // },
    ],
  },
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: WDS_PORT,
    hot: true,
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}
