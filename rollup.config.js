// Based on example: https://github.com/rollup/rollup-starter-lib
//import { eslint } from "rollup-plugin-eslint";
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import css from 'rollup-plugin-css-only'

export default [
  // This is a bit of a hack to get rollup to make a single
  // CSS file. This needs to come before the JS build.
  {
    input: './src/css.js',
    output: {
			name: 'brccharts',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
      css({ output: null })
		]
  },
  // Browser-friendly UMD builds
  // No need to create a minified version as jsdelivr CDN can do that for us
  // Avoid bundling d3 or leaflet
  {
    external: ['d3'],
		input: 'index.js',
		output: {
			name: 'brccharts',
			file: pkg.browser,
			format: 'umd',
      globals: {
        'd3': 'd3',
      },
		},
		plugins: [
      //eslint(),
			resolve(), // so Rollup can find node libs
      commonjs(), // so Rollup can convert CommonJS modules to an ES modules
      json(), // required to import package into index.js
      babel({ babelHelpers: 'bundled', presets: ['@babel/preset-env'] }),
		]
  },
  {
    external: ['d3'],
		input: 'index.js',
		output: {
			name: 'brccharts',
			file: pkg.browsermin,
			format: 'umd',
      globals: {
        'd3': 'd3',
      },
		},
		plugins: [
      //eslint(),
			resolve(), // so Rollup can find node libs
      commonjs(), // so Rollup can convert CommonJS modules to an ES modules
      json(), // required to import package into index.js
      babel({ babelHelpers: 'bundled', presets: ['@babel/preset-env'] }),
      terser()
		]
  }
]