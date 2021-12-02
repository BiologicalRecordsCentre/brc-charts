import { pie } from './src/pie'
import { phen1 } from './src/phen1'
import { phen2 } from './src/phen2'
import { accum } from './src/accum'
import { links } from './src/links'
import { trend } from './src/trend'
import { yearly } from './src/yearly'
import { altlat } from './src/altlat'
import pkg from './package.json'

// Output version from package json to console
// to assist with trouble shooting.
console.log(`Running ${pkg.name} version ${pkg.version}`)

export {
  pie,
  phen1,
  phen2,
  accum,
  links,
  trend,
  yearly,
  altlat
} 