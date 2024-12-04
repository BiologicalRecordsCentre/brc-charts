# BRC Charts library
The BRC Charts library is a Javascript library for producing various charts tailored to biological records.

## Installing
You can get the javscript and css builds from 
the [GitHub repo](https://github.com/BiologicalRecordsCentre/brc-charts/tree/master/dist)
or include them in code directly from a CDN, e.g:
```
<script src="https://cdn.jsdelivr.net/gh/biologicalrecordscentre/brc-charts/dist/brccharts.umd.js"></script>
```
or a minified version generated by the CDN:
```
<script src="https://cdn.jsdelivr.net/gh/biologicalrecordscentre/brc-charts/dist/brccharts.umd.min.js"></script>
```
You will also need to inlcude the associated CSS, e.g.:
```
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/biologicalrecordscentre/brc-charts/dist/brccharts.umd.css">
```
or a minified version generated by the CDN:
```
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/biologicalrecordscentre/brc-charts/dist/brccharts.umd.min.css">
```

## API documentation and code examples
For details of the API, view the [JSDoc API documentation](https://biologicalrecordscentre.github.io/brc-charts/docs/api/).

There are also a number of [working examples](https://biologicalrecordscentre.github.io/brc-charts/docs/).

## Notes for developers

### Installing to development environment
This project is configured as a *Node* project. To install and run it in a local development environment you will first need to install [Node and the Node Package Manager (npm)](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) on your computer. Then clone the repository from GitHub and in the root project folder run `npm install`. That will install all the Node package dependencies into a folder called 'node_modules'. Note that this large folder should not be committed to the repository - hece a line in the root `.gitignore` folder to exclude it.

### Documentation
The package uses JSDoc to produce the API documentation. JSDoc is not included in the package dependendies since developers normally install it globally in their development environment.

### Typical build & publish workflow
- `npm audit --omit=dev` (look for any important vulnerabilities)
- `npm run lint`
- `npm run docs` 
- Update the version number in `package.json` 
- `npm run build` (after package update so that correct version is printed to console by library) 
- Update `docs/Readme` (if required, e.g. to link new examples) 
- Git add any new files, e.g. `git add *`
- Git commit all changes, e.g. `git commit -a`
- Git tag \<version\>, e.g. `git tag 1.0.1`. Tag must match version number in package (to ensure that version can be used to target it in CDN) 
- Git push origin \<version\>, e.g. `git push origin 1.0.1` (pushes the tag commit) 
- `git push` (pushes to master branch) 
- Run the following links to purge the jsdelivr CDN caches
  - https://purge.jsdelivr.net/gh/biologicalrecordscentre/brc-charts@latest/dist/brcatlas.umd.js 
  - https://purge.jsdelivr.net/gh/biologicalrecordscentre/brc-charts@latest/dist/brcatlas.umd.css 

### Rollup
Rollup is used to build the transpiled library javascript assets for this package. Rollup is often preferred over webpack or other bundling tools for packaging libraries. The following javascript assets are produced by this rollup configuration:

- **brccharts.umd.js**: this is the browser-friendly javascript for the Charts library which can be used from browsers (supports a couple of different export formats). 
- **brccharts.umd.min.js**: same as previous but minified.
- **brccharts.umd.min.js.map**: this is a javascript map file. It can be used alonside the minified file to help with debugging.
- **brccharts.umd.css**: consolidated CSS file containing all project CSS for the Charts library.

The following rollup plugins are used in the build:
- **@rollup/plugin-node-resolve**: this allows rollup to resolve references to node libraries (in node_modules).
- **@rollup/plugin-commonjs**: this allows rollup to convert CommonJS modules to ES6.
- **@rollup/plugin-babel**: this is what allows rollup to transpile ES6/7 code to ES5 (for the browser packaging). This plugin has dependencies on '@babel/core' and '@babel/preset-env' which are included in the project's node package.
- **rollup-plugin-terser**: this is used to produce the minified file.
- **rollup-plugin-css-only**: for rolling up CSS into a single file.
- **@rollup/plugin-json**: for importing JSON.

### Other files in project
The following files are in the root folder: 

- **README.md**: this readme file.
- **index.js**: the entry point for the rollup build.
- **package.json**: the Node package file for this project.
- **package-lock.json**: the Node package lock file for this project.
- **_config.yml**: used by GitHub pages to configure github pages 
- **.eslintrc.json**: configures ESLint. These some stuff in here that's necessary to get jest and eslint to play nicely together. 
- **babel.config.js**: the configuration in here seems to necessary to get Jest to work properly with ES2015 modules. 
- **rollup.config.js**: rollup configuration.