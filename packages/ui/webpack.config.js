const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')
const WebpackAssetsManifest = require('webpack-assets-manifest')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'
  const isNetlify = process.env.NETLIFY === 'true'

  return {
    cache: {
      compression: 'gzip',
      type: 'filesystem',
    },
    devServer: {
      allowedHosts: 'all',
      client: {
        overlay: false,
      },
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
      path.resolve(__dirname, './src/index.tsx'),
      ...(isDev
        ? [require.resolve('react'), require.resolve('react-dom'), require.resolve('react-refresh/runtime')]
        : []),
    ],
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.html$/,
          use: ['html-loader'],
        },
        {
          exclude: /node_modules/,
          test: /\.[cjt]sx?$/,
          use: [
            {
              loader: 'swc-loader',
              options: {
                jsc: {
                  parser: {
                    decorators: true,
                    dynamicImport: true,
                    syntax: 'typescript',
                    tsx: true,
                  },
                  transform: {
                    react: {
                      development: isDev,
                      refresh: isDev,
                      runtime: 'automatic',
                    },
                  },
                },
                module: {
                  type: 'es6',
                },
              },
            },
          ],
        },
        {
          generator: {
            filename: 'static/images/[name][ext]',
          },
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset/resource',
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
        },
    output: {
      chunkFilename: 'static/js/[name].chunk.[contenthash:8].js',
      clean: true,
      filename: 'static/js/[name].[contenthash:8].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        cache: isDev,
        chunks: 'all',
        chunksSortMode: 'auto',
        favicon: path.resolve(__dirname, './public/favicon.png'),
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
            from: './public/_redirects',
            to: '_redirects',
          },
          {
            from: './public/robots.txt',
            to: 'robots.txt',
          },
          {
            from: './public/favicon.png',
            to: 'favicon.png',
          },
        ],
      }),
      ...(!isNetlify
        ? new Dotenv({
            allowEmptyValues: true,
            path: path.resolve(
              __dirname,
              `../../${process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env.local`}`,
            ),
            safe: true,
            silent: true,
          })
        : []),
      ...(isDev
        ? [new ReactRefreshWebpackPlugin({ overlay: false })]
        : [
            new MiniCssExtractPlugin({
              chunkFilename: 'static/css/[id].[chunkhash].css',
              filename: 'static/css/[name].[fullhash].css',
            }),
            new CompressionPlugin(),
            ...(!isNetlify
              ? new webpack.DefinePlugin({
                  'process.env': JSON.stringify({
                    NODE_ENV: 'production',
                  }),
                })
              : []),
            new WebpackAssetsManifest(),
          ]),
    ],
    resolve: {
      extensions: ['.cjs', '.js', '.jsx', '.json', '.css', '.mjs', '.ts', '.tsx'],
      fallback: {
        path: require.resolve('path-browserify'),
      },
      modules: [path.resolve(__dirname, '../../node_modules'), path.resolve(__dirname, './node_modules')],
    },
    target: isDev ? 'web' : 'browserslist',
  }
}
