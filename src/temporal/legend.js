import * as gen from '../general'
import { addEventHandlers } from './highlightitem'

export function makeLegend (
  svgChart,
  metricsPlus,
  legendWidth,
  legendFontSize,
  headPad,
  showCounts,
  interactivity
) {
  
  const swatchSize = 15
  const swatchFact = 1.3

  // Loop through all the legend elements and work out their
  // positions based on swatch size, item label text size and
  // legend width.
  const metricsReversed = gen.cloneData(metricsPlus).reverse()

  let rows = 0
  let lineWidth = -swatchSize
  metricsReversed.forEach(m => {
    const tmpText = svgChart.append('text') //.style('display', 'none')
      .text(m.label)
      .style('font-size', legendFontSize)

    const widthText = tmpText.node().getBBox().width
    tmpText.remove()

    if (lineWidth + swatchSize + swatchSize * swatchFact + widthText > legendWidth) {
      ++rows
      lineWidth = -swatchSize
    }
    m.x = lineWidth + swatchSize + headPad
    m.y = rows * swatchSize * swatchFact

    lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText
  })

  const ls = svgChart.selectAll('.brc-legend-item-rect')
    .data(metricsReversed, m => gen.safeId(m.label))
    .join(enter => {
        const rect = enter.append("rect")
          .attr("class", m=> `brc-legend-item brc-legend-item-rect temporal-graphic temporal-${m.prop}`)
          .attr('width', swatchSize)
          .attr('height', showCounts === 'bar' ? swatchSize : 2)
        return rect
    })
    .attr('x', m => m.x)
    .attr('y', m => showCounts === 'bar' ?  m.y + swatchSize/5 : m.y + swatchSize/2)
    .attr('fill', m => m.colour)
    .attr('height', showCounts === 'bar' ? swatchSize : 2)

  const lt = svgChart.selectAll('.brc-legend-item-text')
    .data(metricsReversed, m => gen.safeId(m.label))
    .join(enter => {
        const text = enter.append("text")
          .attr("class", m=> `brc-legend-item brc-legend-item-text temporal-graphic temporal-${m.prop}`)
          .text(m => m.label)
          .style('font-size', legendFontSize)
        return text
    })
    .attr('x', m => m.x + swatchSize * swatchFact)
    .attr('y', m => m.y + legendFontSize * 1)

  addEventHandlers(ls, 'prop', svgChart, interactivity)
  addEventHandlers(lt, 'prop', svgChart, interactivity)

  return swatchSize * swatchFact * (rows + 1)
}