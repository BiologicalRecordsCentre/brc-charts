import { transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function generateBars(dataFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, yminY, svgChart, interactivity, chartStyle, stacked) {

  let chartBars = []
  const cumulativeHeight = new Array(dataFiltered.length).fill(0)

  const metrics = [...metricsPlus]
  if (stacked) {
    metrics.reverse()
  }
  metrics.forEach((m, i) => {
    if (chartStyle === 'bar') {
      const bars = dataFiltered.map((d,j) => {

        let n, height
        if (stacked) {
          n = yScale(d[m.prop], i) - cumulativeHeight[j]
          height = yScale(yminY, i) - yScale(d[m.prop], i)
          cumulativeHeight[j] += height
        } else {
          n = yScale(d[m.prop], i)
          height = yScale(yminY, i) - n
        }

        return {
          colour: m.colour,
          opacity: m.opacity,
          prop: m.prop,
          period: d.period,
          n: n,
          height: height
        }
      })
      chartBars = [...chartBars, ...bars]
    }
  })

  gTemporal.selectAll(".temporal-bar")
    .data(chartBars, d => `bars-${d.prop}-${d.period}`)
    .join(
      enter => enter.append("rect")
        .attr("class", d => `temporal-bar temporal-graphic temporal-${d.prop}`)
        .attr('width', d => xScale.bandwidth(d.period))
        .attr('height', 0)
        .attr('fill', d => d.colour)
        .attr('opacity', 0)
        .attr('y', yScale.height)
        .attr('x', d => xScale(d.period)),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr('height', 0)
          .attr('y', yScale.height)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr('y', d => d.n)
      .attr('x', d => xScale(d.period))
      .attr('height', d => d.height)
      .attr('width', d => xScale.bandwidth(d.period))
      .attr("fill", d => d.colour)
      .attr("opacity", d => d.opacity), pTrans))

    addEventHandlers(gTemporal.selectAll(".temporal-bar"), 'prop', svgChart, interactivity)
}