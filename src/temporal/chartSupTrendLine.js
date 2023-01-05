import { transPromise } from '../general'

export function generateSupTrendLines(dataTrendLinesFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, chartStyle, minPeriod, maxPeriod, xPadding) {

  // Construct data structure for supplementary trend lines.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartTrendLineSup = dataTrendLinesFiltered.map(d => {
    // y = mx + c
    const minx = minPeriod - xPadding
    const maxx = maxPeriod + xPadding
    const x1 = xScale(minx)
    let x2
    if (chartStyle === 'bar') {
      x2 = xScale(maxx) + xScale.bandwidth(maxx)
    } else {
      x2 = xScale(maxx)
    }
    return {
      colour: d.colour ? d.colour : 'red',
      width: d.width ? d.width : '1',
      opacity: d.opacity ? d.opacity : '1',
      pathEnter:  `M ${x1} ${height} L ${x2} ${height}`,
      path: `M ${x1} ${yScale( d.y1)} L ${x2} ${yScale( d.y2)}`,
    }
  })

  console.log('chartTrendLineSup', chartTrendLineSup)

  // Supplementary trend lines
  gTemporal.selectAll('.temporal-trend-lines-sup')
    .data(chartTrendLineSup)
    .join(
      enter => enter.append('path')
        .attr("d", d => d.pathEnter)
        .attr('class', 'temporal-trend-lines-sup')
        .style('stroke', d => d.colour)
        .style('stroke-width', d => d.width)
        .attr("opacity", 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        .attr("d", d => d.pathEnter)
        .remove(), pTrans))
    )
    // Join returns merged enter and update selection
    .call(merge => transPromise(merge.transition(t)
      .attr("d", d => d.path)
      .attr("opacity", d => d.opacity)
      .style('stroke', d => d.colour)
      .style('stroke-width', d => d.width), pTrans))
}