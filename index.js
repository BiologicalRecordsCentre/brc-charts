import { pie } from './src/pie/pie'
import { phen1 } from './src/phen1/phen1'
import { phen2 } from './src/phen2'
import { accum } from './src/accum'
import { links } from './src/links'
import { trend } from './src/trend'
import { trend2 } from './src/trend2/trend2'
import { trend3 } from './src/trend3/trend3'
import { density } from './src/density/density'
import { bar } from './src/bar/bar'
import { yearly } from './src/yearly/yearly'
import { temporal } from './src/temporal/temporal'
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
  trend2,
  trend3,
  density,
  bar,
  yearly,
  temporal,
  altlat
} 