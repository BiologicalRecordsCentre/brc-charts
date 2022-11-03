import { transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function generateBars(dataFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, svgChart, interactivity) {

  let chartBars = []

  metricsPlus.forEach(m => {
    const bars = dataFiltered.map(d => {
      return {
        colour: m.colour,
        opacity: m.opacity,
        //type: 'counts',
        prop: m.prop,
        period: d.period,
        n: yScale(d[m.prop]),
      }
    })
    chartBars = [...chartBars, ...bars]
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
        .attr('y', height)
        .attr('x', d => xScale.v(d.period)),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr('height', 0)
          .attr('y', height)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr('y', d => d.n)
      .attr('x', d => xScale.v(d.period))
      .attr('height', d => height - d.n)
      .attr('width', d => xScale.bandwidth(d.period))
      .attr("fill", d => d.colour)
      .attr("opacity", d => d.opacity), pTrans))

    addEventHandlers(gTemporal.selectAll(".temporal-bar"), 'prop', svgChart, interactivity)
}