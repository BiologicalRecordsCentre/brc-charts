import { transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function generatePointsAndErrors(dataFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, chartStyle, svgChart, interactivity) {

  let chartPoints = []
  let chartErrorBars = []

  metricsPlus.forEach(m => {
    // Construct data structure for points.
    // TODO - if at some point we parameterise display styles
    // for points bars, then it must be specified in here.
    if (m.points) {
      const points = dataFiltered.filter(d => d[m.prop]).map(d => {
        let x
        if (chartStyle === 'bar') {
          x = xScale.v(d.period) + xScale.bandwidth(d.period) / 2
        } else {
          x = xScale.v(d.period)
        }
        return {
          x: x,
          y: yScale(d[m.prop]),
          period: d.period,
          prop: m.prop,
        }
      })
      chartPoints = [...chartPoints, ...points]
    }

    // Construct data structure for error bars.
    // TODO - if at some point we parameterise display styles
    // for error bars, then it must be specified in here.
    if (m.errorBarUpper && m.errorBarLower) {
      const errorBars = dataFiltered.map(d => {
        let x
        if (chartStyle === 'bar') {
          x = xScale.v(d.period) + xScale.bandwidth(d.period) / 2
        } else {
          x = xScale.v(d.period)
        }
        return {
          period: d.period,
          pathEnter:  `M ${x} ${height} L ${x} ${height}`,
          path: `M ${x} ${yScale(d[m.errorBarLower])} L ${x} ${yScale(d[m.errorBarUpper])}`,
          prop: m.prop,
        }
      })
      chartErrorBars = [...chartErrorBars, ...errorBars]
    } 
  })

   // Error bars
  gTemporal.selectAll('.temporal-error-bars')
    .data(chartErrorBars, d => `error-bars-${d.prop}-${d.period}`)
    .join(
      enter => enter.append('path')
        .attr("class", d => `temporal-error-bars temporal-graphic temporal-${d.prop}`)
        //.attr("d", d => d.pathEnter)
        .attr("d", d => d.path)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0),
      update => update,
      exit => exit.call(exit => transPromise(exit
        .transition(t)
        .style("opacity", 0)
        //.attr("d", d => d.pathEnter)
        .attr("d", d => d.path)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
      .attr("d", d => d.path)
      .style('opacity', 1), pTrans))

  addEventHandlers(gTemporal.selectAll(".temporal-error-bars"), 'prop', svgChart, interactivity)

  // Points
  gTemporal.selectAll('.temporal-point')
    .data(chartPoints, d => `point-${d.prop}-${d.period}`)
    .join(
      enter => enter.append('circle')
        .attr("class", d => `temporal-point temporal-graphic temporal-${d.prop}`)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        //.attr('cy', height)
        .attr('r', 3)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        //.attr('cy', height)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .style('opacity', 1), pTrans))

  addEventHandlers(gTemporal.selectAll(".temporal-point"), 'prop', svgChart, interactivity)
}