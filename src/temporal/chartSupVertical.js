import { transPromise } from '../general'

export function generateSupVerticals(verticals, gTemporal, t, xScale, height, pTrans) {

  // Construct data structures for vertical lines and bars
  const chartVerticalLines = verticals.filter(d => !d.width).map((d,i) => {
    // Use the D3 scale function (not v) because in charts of type periodType
    // week or month, the start and width values are in *days* not periods
    // (week or month number).
    const x = xScale.d3(d.start)
    return {
      path: `M ${x} 0 L ${x} ${height}`,
      colour: d.colour,
      index: i
    }
  })

  // Construct data structures for vertical lines and bars
  const chartVerticalBands = verticals.filter(d => d.width).map((d,i) => {
    // Use the D3 scale function (not v) because in charts of type periodType
    // week or month, the start and width values are in *days* not periods
    // (week or month number).
    return {
      x: xScale.d3(d.start),
      width: xScale.d3(d.start + d.width) - xScale.d3(d.start),
      colour: d.colour,
      index: i
    }
  })

  // Vertical lines
  gTemporal.selectAll('.temporal-vertical-line-sup')
    .data(chartVerticalLines, d => `vertical-line-sup-${d.index}`)
    .join(
      enter => enter.append('path')
        .attr("class", `temporal-vertical-line-sup`)
        .attr("d", d => d.path)
        .style('stroke', d => d.colour)
        .style('stroke-width', 1)
        .style('opacity', 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
      .style('opacity', 1), pTrans))

  // Vertical bands
  gTemporal.selectAll('.temporal-vertical-band-sup')
    .data(chartVerticalBands, d => `vertical-band-sup-${d.index}`)
    .join(
      enter => enter.append("rect")
        .attr("class", `temporal-vertical-band-sup`)
        .attr('width', d => d.width)
        .attr('height', height)
        .attr('fill', d => d.colour)
        .attr('opacity', 0)
        .attr('y', 0)
        .attr('x', d => d.x),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("opacity", 1), pTrans))
}