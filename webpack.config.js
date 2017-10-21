var path = require('path');

module.exports = {
  entry: "./public/js/app.js",
  output: {
    path: path.resolve(__dirname, "./public/js"),
    filename: "compiled.js"
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query:{
          presets: ['es2015']
      },
      test: /\.js$/,
      exclude: /node_modules/
      }
    ]
  }
}
