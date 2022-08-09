import * as d3 from 'd3'

export function preProcessMetrics (metrics) {
  // Look for 'fading' colour in taxa and colour appropriately 
  // in fading shades of grey.
  let iFading = 0
  let metricsPlus = metrics.map(m => {
    let iFade, strokeWidth
    if (m.colour === 'fading') {
      iFade = ++iFading
      strokeWidth = 1
    } else {
      strokeWidth = m.strokeWidth
    }
    return {
      prop: m.prop,
      label: m.label,
      colour: m.colour,
      fill: m.fill,
      fading: iFade,
      strokeWidth: strokeWidth
    }
  }).reverse()

  const grey = d3.scaleLinear()
    .range(['#808080', '#E0E0E0'])
    .domain([1, iFading])

  metricsPlus.forEach(m => {
    if (m.fading) {
      m.colour = grey(m.fading)
    }
  })

  return metricsPlus
}