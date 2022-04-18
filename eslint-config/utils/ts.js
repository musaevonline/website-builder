const extensions = require('../consts');

const tsFiles = `*{${extensions.ts.join(',')}}`;

exports.tsOnly = (config) => ({
  overrides: [Object.assign({}, config, { files: tsFiles })],
});
