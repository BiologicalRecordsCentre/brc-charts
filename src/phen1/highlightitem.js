import * as d3 from 'd3'
import * as gen from '../general'

export function addEventHandlers(sel, prop, interactivity, svgChart) {
  sel
    .on("mouseover", function(d) {
    if (interactivity === 'mousemove') {
        highlightItem(d[prop], true, svgChart)
      }
    })
    .on("mouseout", function(d) {
      if (interactivity === 'mousemove') {
        highlightItem(d[prop], false, svgChart)
      }
    })
    .on("click", function(d) {
      if (interactivity === 'mouseclick') {
        highlightItem(d[prop], true, svgChart)
        d3.event.stopPropagation()
      }
    })
}

export function highlightItem(id, highlight, svgChart) {

  svgChart.selectAll('.phen-metric path')
    .classed('lowlight', highlight)

  svgChart.selectAll(`.phen-metric-${gen.safeId(id)} path`)
    .classed('lowlight', false)

  svgChart.selectAll(`.phen-metric path`)
    .classed('highlight', false)

  if (gen.safeId(id)) {
    svgChart.selectAll(`.phen-metric-${gen.safeId(id)} path`)
      .classed('highlight', highlight)
  }

  svgChart.selectAll('.phen-metric rect')
    .classed('lowlight', highlight)

  svgChart.selectAll(`.phen-metric-${gen.safeId(id)} rect`)
    .classed('lowlight', false)

  svgChart.selectAll(`.phen-metric rect`)
    .classed('highlight', false)

  if (gen.safeId(id)) {
    svgChart.selectAll(`.phen-metric-${gen.safeId(id)} rect`)
      .classed('highlight', highlight)
  }
  
  svgChart.selectAll('.brc-legend-item')
    .classed('lowlight', highlight)

  if (id) {
    svgChart.selectAll(`.brc-legend-item-${gen.safeId(id)}`)
      .classed('lowlight', false)
  }

  if (id) {
    svgChart.selectAll(`.brc-legend-item-${gen.safeId(id)}`)
      .classed('highlight', highlight)
  } else {
    svgChart.selectAll(`.brc-legend-item`)
      .classed('highlight', false)
  }
}