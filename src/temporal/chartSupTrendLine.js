import { transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function generateSupTrendLines(dataTrendLinesFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, chartStyle, svgChart, interactivity) {

  //console.log('dataTrendLinesFiltered', dataTrendLinesFiltered)

  // Construct data structure for supplementary trend lines.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartTrendLineSup = dataTrendLinesFiltered.filter(d => {
      // p1 and p2 can be infinite if data is empty
      return isFinite(d.p1) && isFinite(d.p2)
    })
    .map(d => {
      // y = mx + c
      const x1 = xScale(d.p1)
      let x2
      if (chartStyle === 'bar') {
        x2 = xScale(d.p2) + xScale.bandwidth(d.p2)
      } else {
        x2 = xScale(d.p2)
      }
      return {
        id: d.id,
        colour: d.colour ? d.colour : 'red',
        width: d.width ? d.width : '1',
        opacity: d.opacity ? d.opacity : '1',
        pathEnter:  `M ${x1} ${height} L ${x2} ${height}`,
        path: `M ${x1} ${yScale(d.y1)} L ${x2} ${yScale(d.y2)}`,
      }
    })

  // Supplementary trend lines
  gTemporal.selectAll('.temporal-trend-lines-sup')
    .data(chartTrendLineSup, d => d.id)
    .join(
      enter => enter.append('path')
        //.attr("d", d => d.pathEnter)
        .attr("d", d => d.path)
        .attr('class', d => d.id ? `temporal-${d.id}` : '')
        .classed('temporal-trend-lines-sup', true)
        .classed('temporal-graphic', d => d.id ? true : false)
        .style('stroke', d => d.colour)
        .style('stroke-width', d => d.width)
        .attr("opacity", 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        //.attr("d", d => d.pathEnter)
        .remove(), pTrans))
    )
    // Join returns merged enter and update selection
    .call(merge => transPromise(merge.transition(t)
      .attr("d", d => d.path)
      .attr("opacity", d => d.opacity)
      .style('stroke', d => d.colour)
      .style('stroke-width', d => d.width), pTrans))

  addEventHandlers(gTemporal.selectAll(".temporal-trend-lines-sup"), 'id', svgChart, interactivity)
}