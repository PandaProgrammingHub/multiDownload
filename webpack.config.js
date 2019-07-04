const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path');
module.exports = env => {
    return {
      entry: [
        './src/index.js' // your app's entry point
      ],
      // devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'multipledownload-bundle.js'
      },
      resolve: {
        extensions: ['.js', '.jsx', '.scss']
      },
  
      // module: {
      //   loaders
      // },
      module: {
            rules: [
              {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
              },
              {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader"
                  }
                ]
              },
              {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                // use: [
                //   { loader: 'style-loader' },
                //   {
                //     loader: 'css-loader',
                //     options: {
                //       modules: true,
                //       localIdentName: '[name]__[local]--[hash:base64:5]'
                //     }
                //   }
                // ]
              },
            ]
          },
      plugins: [
        new HtmlWebPackPlugin({
          template: './index.html',
          files: {
            js: ['multipledownload-bundle.js']
          }
        })
      ]
    }
  }