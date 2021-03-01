import { pie } from './src/pie'
import { phen1 } from './src/phen1'
import { accum } from './src/accum'
import pkg from './package.json'

// Output version from package json to console
// to assist with trouble shooting.
console.log(`Running ${pkg.name} version ${pkg.version}`)

export {
  pie,
  phen1,
  accum
} 