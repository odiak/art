const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PnpWebpackPlugin = require('pnp-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [PnpWebpackPlugin]
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [{ test: /\.tsx?/, loader: 'ts-loader' }]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  devServer: {
    historyApiFallback: true
  }
}
