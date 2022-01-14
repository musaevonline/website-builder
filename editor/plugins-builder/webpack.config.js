const globby = require("globby");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const entry = {};
globby
  .sync(["../plugins/*/src/index.js"], { ignore: ["node_modules/**", "dist*/**"] })
  .forEach((input) => {
    const output = input.split("/")[2] + ".js";
    entry[output] = "./" + input;
  });

globby
  .sync(["../plugins/*/src/index/*.js"], { ignore: ["node_modules/**", "dist*/**"] })
  .forEach((input) => {
    console.log(input);
    const arr = input.split("/");
    const output = `${arr.pop().replace('.js', '')}@${arr[2]}.js`;
    entry[output] = "./" + input;
  });

console.log(entry);
module.exports = (env = {}) => {
  return {
    mode: "production",
    entry,
    output: {
      path: path.resolve(__dirname, "../public"),
      filename: "plugins/[name]",
      chunkFilename: "plugins/[name]",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        name: "vendors.js",
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "index.ejs",
        filename: "index.html",
        inject: false,
        minify: false,
      }),
      new BundleAnalyzerPlugin(),
    ],
  };
};
