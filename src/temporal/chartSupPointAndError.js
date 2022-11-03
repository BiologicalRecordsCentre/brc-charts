import { transPromise } from '../general'

export function generateSupPointsAndErrors(dataPointsFiltered, gTemporal, t, xScale, yScale, height, pTrans) {

  // Construct data structure for supplementary points.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartPointsSup = dataPointsFiltered.map(d => {
    let x 
    x = xScale.v(d.period)
    return {
      x: x,
      y: yScale(d.y),
      period: d.period
    }
  })

  // Construct data structure for supplementary point error bars.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartPointsSupErrorBars = dataPointsFiltered.map(d => {
    const x = xScale.v(d.period)
    return {
      pathEnter:  `M ${x} ${height} L ${x} ${height}`,
      path: `M ${x} ${yScale(d.lower)} L ${x} ${yScale(d.upper)}`,
      period: d.period
    }
  })

  // Supplementary point error bars
  gTemporal.selectAll('.temporal-error-bars-sup')
    .data(chartPointsSupErrorBars, d => `error-bars-sup-${d.period}`)
    .join(
      enter => enter.append('path')
        .attr("class", `temporal-error-bars-sup`)
        .attr("d", d => d.pathEnter)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        .attr("d", d => d.pathEnter)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
      .attr("d", d => d.path)
      .style('opacity', 1), pTrans))
      
  // Supplementary points
  gTemporal.selectAll('.temporal-point-data-sup')
      .data(chartPointsSup, d => `point-data-sup-${d.period}`)
      .join(
        enter => enter.append('circle')
          .attr("class", `temporal-point-data-sup`)
          .attr('cx', d => d.x)
          //.attr('cy', d => d.y)
          .attr('cy', height)
          .attr('r', 3)
          .style('fill', 'white')
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('opacity', 0),
        update => update,
        exit => exit
          .call(exit => transPromise(exit.transition(t)
          .style("opacity", 0)
          .attr('cy', height)
          .remove(), pTrans))
      )
      // The selection returned by the join function is the merged
      // enter and update selections
      .call(merge => transPromise(merge.transition(t)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('opacity', 1), pTrans))
}