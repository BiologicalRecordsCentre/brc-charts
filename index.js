import { pie } from './src/pie'
import { phen1 } from './src/phen1'
import { acum } from './src/acum'
import pkg from './package.json'

// Output version from package json to console
// to assist with trouble shooting.
console.log(`Running ${pkg.name} version ${pkg.version}`)

export {
  pie,
  phen1,
  acum
} 