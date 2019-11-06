/** 
 * @type import('webpack').Configuration 
 */
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MODE = 'develop'
const enabledSourceMap = (MODE === 'development')

module.exports = {
  mode: MODE,
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/dist/`
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'style-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'style-loader',
          // CSSをバンドルするための機能
          {
            loader: 'css-loader',
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
 
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            },
          },
          // PostCSSのための設定
          {
            loader: 'postcss-loader',
            options: {
              // PostCSS側でもソースマップを有効にする
              sourceMap: true,
              plugins: [
                // Autoprefixerを有効化
                // ベンダープレフィックスを自動付与する
                require('autoprefixer')({grid: true}),
                require('cssnano')({
                  // ベンダープレフィックスは削除しない
                  autoprefixer: false
                })
              ]
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
            }
          },
          'import-glob-loader'
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        use: [{
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }]
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react"
              ]
            }
          }
        ]
      }
    ]
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    },
    extensions: [
      '*', '.ts', '.tsx', '.js', '.json', '.vue'
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: `${__dirname}/static/images`,
        to: `${__dirname}/dist/images`,
        flatten: false
      },
      {
        from: `${__dirname}/static/video`,
        to: `${__dirname}/dist/video`,
        flatten: false
      }
    ])
  ],

  // Configuration for dev server
  devServer: {
    contentBase: `${__dirname}/dist/`,
    watchContentBase: true,
    open: true,
    port: 7500
  }
}