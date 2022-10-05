import * as d3 from 'd3'

export function addEventHandlers(sel, prop, svgChart, interactivity) {
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

  svgChart.selectAll('.yearly-graphic')
    .classed('lowlight', false)

  if (highlight) {
    svgChart.selectAll('.yearly-graphic')
      .classed('lowlight', true)
    svgChart.selectAll(`.yearly-${id}`)
      .classed('lowlight', false)
  }
}