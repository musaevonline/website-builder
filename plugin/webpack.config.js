const path = require("path");

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "plugin.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
    ]
  }
}