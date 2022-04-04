const globby = require("globby");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const templates = globby.sync(["../plugins/*/template.html"], { ignore: ["node_modules/**", "dist*/**"] })
const singleScripts = globby.sync(["../plugins/*/script.js"], { ignore: ["node_modules/**", "dist*/**"] })
const groupScripts = globby.sync(["../plugins/*/js/*.js"], { ignore: ["node_modules/**", "dist*/**"] })

const entry = {};

singleScripts.forEach((input) => {
    const arr = input.split("/");
    const output = `${arr[2]}/script.js`;
    entry[output] = "./" + input;
  });
groupScripts.forEach((input) => {
    console.log(input);
    const arr = input.split("/");
    const output = `${arr[2]}/${arr[4]}`;
    entry[output] = "./" + input;
  });

const plugins = {}

templates.forEach((input) => {
  const arr = input.split("/");
  plugins[arr[2]] = plugins[arr[2]] = {}
  Object.assign(plugins[arr[2]], {
    template: `/plugins/${arr[2]}/template.html`
  })
});
singleScripts.forEach((input) => {
  const arr = input.split("/");
  plugins[arr[2]] = plugins[arr[2]] = {}
  Object.assign(plugins[arr[2]], {
    script: `/plugins/${arr[2]}/script.js`
  })
});
const deleted = {}
groupScripts.forEach((input) => {
  const arr = input.split("/");
  const name = `${arr[4].replace('.js', '')}@${arr[2]}`
  plugins[name] = plugins[name] = {}
  Object.assign(plugins[name], {
    script: `/plugins/${arr[2]}/${arr[4]}`
  })
  if (plugins[arr[2]]?.template || deleted[arr[2]]?.template) {
    Object.assign(plugins[name], {
      template: `/plugins/${arr[2]}/template.html`
    })
    if (plugins[arr[2]]) {
      deleted[arr[2]] = JSON.parse(JSON.stringify(plugins[arr[2]]));
      delete plugins[arr[2]]
    }
  }
});
console.log(deleted)
console.log(plugins);

module.exports = (env = {}) => {
  return {
    mode: "development",
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
        {
          test: /\.html$/,
          use: 'file-loader'
        }
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        name: "vendors.js",
      },
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { 
            from: "../plugins/*/template.html", 
            to: ({ absoluteFilename }) => 
              `../public/${absoluteFilename.split('/').reverse()[1]}`
            
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: "index.ejs",
        filename: "index.html",
        inject: false,
        minify: false,
        templateParameters: {
          plugins
        }
      }),
      new BundleAnalyzerPlugin(),
    ],
  };
};
