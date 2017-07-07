const buble = require('rollup-plugin-buble');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const version = require('../package.json').version;

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/ree-validate.js',
  format: 'umd',
  moduleName: 'ReeValidate',
  plugins: [
    replace({ __VERSION__: version }),
    nodeResolve(),
    commonjs(),
    buble(),
  ],
  banner:
`/**
 * ree-validate v${version}
 * Extended from vee-validate
 * (c) ${new Date().getFullYear()} Moeen Basra
 * @license MIT
 *
 * Special Thanks to Abdelrahman Awad
 */`
};
