import { addG, transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function generatePointsAndErrors(dataFilteredAll, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, chartStyle, svgChart, interactivity, composition) {

  // Add g elements in increasing order of display priority
  const gErrors = addG('gPointsAndErrorsErrors', gTemporal)
  const gPoints = addG('gPointsAndErrorsPoints', gTemporal)

  let chartPoints = []
  let chartErrorBars = []
  const displacement = {}
  
  const metrics = [...metricsPlus]
  if (composition === 'stack') {
    metrics.reverse()
  }

  metricsPlus.forEach((m,i) => {

    //####
    const dataFiltered = dataFilteredAll.filter(d => m.taxon ? d.taxon === m.taxon : true)

    // Construct data structure for points.
    const bErrorBars = m.errorBarUpper && m.errorBarLower
    const bPoints = m.points

    if (bPoints || bErrorBars) {
      const points = dataFiltered.map(d => {

        let n, u, l
        if (composition === 'stack') {
          const displace = displacement[d.period] 
          if (typeof(displace) === 'undefined') {
            if (bPoints) {
              n = yScale(d[m.prop], i)
            }
            if (bErrorBars) {
              u = yScale(d[m.errorBarUpper], i)
              l = yScale(d[m.errorBarLower], i)
            }
            displacement[d.period] = d[m.prop]
          } else {
            if (bPoints) {
              n = yScale(d[m.prop] + displace, i)
            }
            if (bErrorBars) {
              u = yScale(d[m.errorBarUpper] + displace, i)
              l = yScale(d[m.errorBarLower] + displace, i)
            }
            displacement[d.period] += d[m.prop]
          }
        } else {
          if (bPoints) {
            n = yScale(d[m.prop], i)
          }
          if (bErrorBars) {
            u = yScale(d[m.errorBarUpper], i)
            l = yScale(d[m.errorBarLower], i)
          }
        }

        let x
        if (chartStyle === 'bar') {
          x = xScale(d.period) + xScale.bandwidth(d.period) / 2
        } else {
          x = xScale(d.period)
        }

        const ret = {
          x: x,
          period: d.period,
          prop: `${m.prop}-${m.index}`,
        }

        if (bPoints) {
          ret.y = n
        }

        if (bErrorBars) {
          ret.pathEnter = `M ${x} ${height} L ${x} ${height}`
          ret.path = `M ${x} ${l} L ${x} ${u}`
        }

        return ret
      })
      if (bPoints) chartPoints = [...chartPoints, ...points]
      if (bErrorBars) chartErrorBars =  [...chartErrorBars, ...points]
    }
  })

   // Error bars
  gErrors.selectAll('.temporal-error-bars')
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

  addEventHandlers(gErrors.selectAll(".temporal-error-bars"), 'prop', svgChart, interactivity)

  // Points
  gPoints.selectAll('.temporal-point')
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

  addEventHandlers(gPoints.selectAll(".temporal-point"), 'prop', svgChart, interactivity)
}