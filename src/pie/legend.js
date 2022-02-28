import * as gen from '../general'
import { addEventHandlers} from './highlightitem'

export function makeLegend (data, svg, svgChart, legendWidth, labelFontSize, legendSwatchSize, legendSwatchGap, legendTitle, legendTitle2, legendTitleFontSize, duration, interactivity, dataPrev, imageWidth) {

  let svgLegend
  if (svg.select('.brc-chart-legend').size()) {
    svgLegend = svgChart.select('.brc-chart-legend')
  } else {
    svgLegend = svgChart.append('svg').classed('brc-chart-legend', true)
      .attr('overflow', 'auto')
  }

  // Constants relating to legendTexts
  const legendTitleHeight = legendTitle  ? textHeight(legendTitleFontSize) : 0
  const legendTitleGap = legendTitle  ? legendSwatchGap : 0
  const legendTitleHeight2 = legendTitle2 ? textHeight(legendTitleFontSize) : 0
  const legendTitleGap2 = legendTitle2 ? legendSwatchGap : 0

  // Legend swatches
  const uLegendSwatch = svgLegend.selectAll('.legendSwatch')
    .data(data, d => d.name)

  const durationUpdate = uLegendSwatch.nodes().length ? duration : 0
  const durationExit = uLegendSwatch.exit().nodes().length ? duration : 0

  const eLegendSwatch = uLegendSwatch.enter()
    .append('rect')
    .attr('id', (d) => `swatch-${gen.safeId(d.name)}`)
    .classed('legendSwatch', true)
    .attr('y', (d, i) => {
      let titleHeight;
      if (!d.set || d.set===1) {
        titleHeight = legendTitleHeight + legendTitleGap
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2
      }
      return titleHeight + i * (legendSwatchSize + legendSwatchGap)
    })
    .attr('width', legendSwatchSize)
    .attr('height', legendSwatchSize)
    .style('fill', d => d.colour)
    .attr('opacity', 0)

  addEventHandlers(svg, eLegendSwatch, false, interactivity, dataPrev, imageWidth)

  eLegendSwatch.transition()
    .delay(durationExit + durationUpdate)
    .duration(duration)
    .attr('opacity', 1)

  uLegendSwatch
    .transition()
    .delay(durationExit)
    .duration(duration)
    .attr('y', (d, i) => {
      let titleHeight;
      if (!d.set || d.set===1) {
        titleHeight = legendTitleHeight + legendTitleGap
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2
      }
      return titleHeight + i * (legendSwatchSize + legendSwatchGap)
    })
    .attr('opacity', 1)
    
  uLegendSwatch.exit()
    .transition()
    .duration(duration)
    .attr('opacity', 0)
    .remove()

  // Legend text
  const uLegendText = svgLegend.selectAll('.legendText')
    .data(data, d => d.name)

  const legendTextHeight = textHeight(labelFontSize)

  const eLegendText = uLegendText.enter()
    .append('text')
    .text(d => d.name)
    .attr('alignment-baseline', 'middle')
    .attr('id', (d) => `legend-${gen.safeId(d.name)}`)
    .classed('legendText', true)
    .attr('x', () => legendSwatchSize + legendSwatchGap)
    .attr('y', (d, i) => {
      let titleHeight;
      if (!d.set || d.set===1) {
        titleHeight = legendTitleHeight + legendTitleGap
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2
      }
      return titleHeight + (i + 1) * (legendSwatchSize + legendSwatchGap) - (legendSwatchSize / 2) - (legendTextHeight / 3)
    })
    .style('font-size', labelFontSize)
    .attr('opacity', 0)

  addEventHandlers(svg, eLegendText, false, dataPrev, imageWidth)

  eLegendText.transition()
    .delay(durationExit + durationUpdate)
    .duration(duration)
    .attr('opacity', 1)

  uLegendText
    .transition()
    .delay(durationExit)
    .duration(duration)
    .attr('y', (d, i) => {
      let titleHeight;
      if (!d.set || d.set===1) {
        titleHeight = legendTitleHeight + legendTitleGap
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2
      }
      return titleHeight + (i + 1) * (legendSwatchSize + legendSwatchGap) - (legendSwatchSize / 2) - (legendTextHeight / 3)
    })
    .attr('opacity', 1)
    
  uLegendText.exit()
    .transition()
    .duration(duration)
    .attr('opacity', 0)
    .remove()

  // Legend titles
  const legendTitles = []
  if (legendTitle) legendTitles.push(legendTitle)
  if (legendTitle2) legendTitles.push(legendTitle2)

  const uLegendTitle = svgLegend.selectAll('.legendTitle')
    .data(legendTitles, d => d)

  const eLegendTitle = uLegendTitle.enter()
    .append('text')
    .text(d => d)
    .attr('id', (d) => `legend-title-${gen.safeId(d)}`)
    .classed('legendTitle', true)
    .attr('y', (d, i) => {
      if (i===0) {
        return legendTitleHeight
      } else {
        const dataSet1Length = data.filter(d => !d.set || d.set === 1).length
        return 2 * legendTitleHeight + legendTitleGap + dataSet1Length  * (legendSwatchSize + legendSwatchGap)
      }
    })
    .style('font-size', legendTitleFontSize)
    .attr('opacity', 0)

  eLegendTitle.transition()
    .delay(durationExit + durationUpdate)
    .duration(duration)
    .attr('opacity', 1)

  uLegendTitle
    .transition()
    .delay(durationExit)
    .duration(duration)
    //.attr('y', (d, i) => i * (legendTitleFontSize + legendTitleGap))
    .attr('y', (d, i) => {
      if (i===0) {
        return legendTitleHeight
      } else {
        const dataSet1Length = data.filter(d => !d.set || d.set === 1).length
        return 2 * legendTitleHeight + legendTitleGap + dataSet1Length  * (legendSwatchSize + legendSwatchGap)
      }
    })
    .attr('opacity', 1)
    
  uLegendTitle.exit()
    .transition()
    .duration(duration)
    .attr('opacity', 0)
    .remove()

  //Legend size
  svgLegend.attr("width", legendWidth)
  const legendHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2 + data.length * (legendSwatchSize + legendSwatchGap) - legendSwatchGap
  svgLegend.attr("height", legendHeight > 0 ? legendHeight : 0)

  // Helper functions
  function textHeight(fontSize) {
    const dummyText = svgLegend.append('text').attr('opacity', 0).style('font-size', fontSize).text('Dummy')
    let textHeight = dummyText.node().getBBox().height
    dummyText.remove()
    return textHeight
  }
}