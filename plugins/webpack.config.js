/* eslint-disable no-console */

const path = require('path');
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const globby = require('globby');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const templates = globby.sync(['*/template.html'], {
  ignore: ['node_modules/**', 'dist*/**'],
});
const singleScripts = globby.sync(['*/script.js'], {
  ignore: ['node_modules/**', 'dist*/**'],
});
const groupScripts = globby.sync(['*/js/*.js'], {
  ignore: ['node_modules/**', 'dist*/**'],
});

const entry = {};

singleScripts.forEach((input) => {
  const arr = input.split('/');
  const output = `${arr[0]}/script.js`;

  entry[output] = './' + input;
});
groupScripts.forEach((input) => {
  console.log(input);
  const arr = input.split('/');
  const output = `${arr[0]}/${arr[2]}`;

  entry[output] = './' + input;
});

const plugins = {};

templates.forEach((input) => {
  const arr = input.split('/');

  plugins[arr[0]] = plugins[arr[0]] = {};
  Object.assign(plugins[arr[0]], {
    template: `/plugins/${arr[0]}/template.html`,
  });
});
singleScripts.forEach((input) => {
  const arr = input.split('/');

  plugins[arr[0]] = plugins[arr[0]] = {};
  Object.assign(plugins[arr[0]], {
    script: `/plugins/${arr[0]}/script.js`,
  });
});
const deleted = {};

groupScripts.forEach((input) => {
  const arr = input.split('/');
  const name = `${arr[2].replace('.js', '')}@${arr[0]}`;

  plugins[name] = plugins[name] = {};
  Object.assign(plugins[name], {
    script: `/plugins/${arr[0]}/${arr[2]}`,
  });

  if (plugins[arr[0]]?.template || deleted[arr[0]]?.template) {
    Object.assign(plugins[name], {
      template: `/plugins/${arr[0]}/template.html`,
    });

    if (plugins[arr[0]]) {
      deleted[arr[0]] = JSON.parse(JSON.stringify(plugins[arr[0]]));
      delete plugins[arr[0]];
    }
  }
});

fs.writeFileSync('../public/plugins.json', JSON.stringify(plugins, null, "\t"))
console.log(plugins);

module.exports = (env = {}) => {
  return {
    mode: 'development',
    entry,
    output: {
      path: path.resolve(__dirname, '../website'),
      filename: 'plugins/[name]',
      chunkFilename: 'plugins/[name]',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.html$/,
          use: 'file-loader',
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: 'vendors.js',
      },
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '*/template.html',
            to: '../website/plugins',
          },
        ],
      }),
      new BundleAnalyzerPlugin(),
    ],
  };
};
