const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')
const WebpackAssetsManifest = require('webpack-assets-manifest')

const tsPaths = require('./tsconfig.paths.json').compilerOptions.paths

process.env.USE_WEBPACK = 'true'

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  return {
    cache: {
      compression: 'gzip',
      type: 'filesystem',
    },
    devServer: {
      allowedHosts: 'all',
      devMiddleware: {
        writeToDisk: true,
      },
      historyApiFallback: true,
      hot: true,
      port: 3000,
      static: {
        watch: true,
      },
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    entry: [
      path.join(__dirname, '/src/index.tsx'),
      path.join(__dirname, '/src/index.css'),
      ...(isDev ? ['react', 'react-dom', 'react-refresh/runtime'] : []),
    ],
    mode: argv.mode,
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: [
            {
              loader: 'esbuild-loader',
              options: {
                loader: 'tsx',
                target: 'es2015', // Or 'ts' if you don't need tsx
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [...(isDev ? ['style-loader'] : [MiniCssExtractPlugin.loader]), 'css-loader'],
        },
      ],
    },
    optimization: isDev
      ? {
          runtimeChunk: 'single',
        }
      : {
          minimize: true,
          nodeEnv: 'production',
          runtimeChunk: {
            name: 'runtime',
          },
          splitChunks: {
            chunks: 'all',
            name: 'shared',
          },
          usedExports: true,
        },
    output: {
      chunkFilename: 'static/js/[name].chunk.[contenthash:8].js',
      clean: true,
      filename: 'static/js/[name].[contenthash:8].js',
      path: path.join(__dirname, 'build'),
      publicPath: '/',
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new HtmlWebpackPlugin({
        cache: isDev,
        chunks: 'all',
        chunksSortMode: 'auto',
        favicon: path.join(__dirname, './public/favicon.png'),
        filename: 'index.html',
        inject: true,
        minify: isDev
          ? false
          : {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
        template: path.join(__dirname, './public/index.html'),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public/_redirects',
            to: '_redirects',
          },
          {
            from: 'public/robots.txt',
            to: 'robots.txt',
          },
          {
            from: 'public/favicon.png',
            to: 'favicon.png',
          },
        ],
      }),
      new Dotenv({
        allowEmptyValues: true,
        defaults: false,
        path: path.join(__dirname, `/${process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env.dev`}`),
        safe: true,
        silent: true,
        systemvars: true,
      }),
      new MiniCssExtractPlugin({
        chunkFilename: 'static/css/[id].[chunkhash].css',
        filename: 'static/css/[name].[fullhash].css',
      }),
      new CompressionPlugin(),
      new WebpackAssetsManifest(),
    ],
    resolve: {
      alias: {
        ...Object.keys(tsPaths).reduce(
          (acc, key) => ({
            ...acc,
            [key.replace('/*', '')]: path.resolve(__dirname, `./${tsPaths[key][0].replace('/*', '')}`),
          }),
          {},
        ),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallback: {
        path: require.resolve('path-browserify'),
      },
    },
    target: isDev ? 'web' : 'browserslist',
  }
}
