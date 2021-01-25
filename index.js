import { dataAccessors } from './src/dataAccess'
import { pie } from './src/pie'
import pkg from './package.json'

// Output version from package json to console
// to assist with trouble shooting.
console.log(`Running ${pkg.name} version ${pkg.version}`)

export {
  dataAccessors,
  pie,
} 