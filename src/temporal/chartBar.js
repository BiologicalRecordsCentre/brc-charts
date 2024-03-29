import { transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function generateBars(dataFilteredAll, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, yminY, svgChart, interactivity, chartStyle, composition) {

  let chartBars = []
  const displacement = {}

  metricsPlus.forEach((m, i) => {

    //####
    const dataFiltered = dataFilteredAll.filter(d => m.taxon ? d.taxon === m.taxon : true)

    if (chartStyle === 'bar') {
      const bars = dataFiltered.map(d => {
        let n, barHeight
        if (composition === 'stack') {
          const displace = displacement[d.period] 
          if (typeof(displace) === 'undefined') {
            n = yScale(d[m.prop], i)
            barHeight = height - n
            displacement[d.period] = d[m.prop]
          } else {
            n = yScale(d[m.prop] + displace, i)
            barHeight = yScale(displace, i) - n
            displacement[d.period] += d[m.prop]
          }
        } else {
           n = yScale(d[m.prop], i)
           barHeight = yScale(yminY, i) - n
        }
        return {
          colour: m.colour,
          opacity: m.fillOpacity,
          prop: m.id ? m.id : `${m.prop}-${m.index}`,
          period: d.period,
          n: n,
          height: barHeight
        }
      })
      chartBars = [...chartBars, ...bars]
    }
  })
  chartBars.reverse()

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