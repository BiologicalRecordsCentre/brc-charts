import * as gen from '../general'
import { addEventHandlers} from './highlightitem'

export function makeLegend (legendWidth, metrics, svgChart, legendFontSize, headPad, interactivity) {
  
  const swatchSize = 20
  const swatchFact = 1.3

  // Loop through all the legend elements and work out their
  // positions based on swatch size, item lable text size and
  // legend width.
  const metricsReversed = gen.cloneData(metrics).reverse()

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
          .attr("class", m=> `brc-legend-item brc-legend-item-rect brc-legend-item-${gen.safeId(m.label)}`)
          .attr('width', swatchSize)
          .attr('height', 2)
        return rect
    })
    .attr('x', m => m.x)
    .attr('y', m => m.y + swatchSize/2)
    .attr('fill', m => m.colour)

  const lt = svgChart.selectAll('.brc-legend-item-text')
    .data(metricsReversed, m => gen.safeId(m.label))
    .join(enter => {
        const text = enter.append("text")
          .attr("class", m=> `brc-legend-item brc-legend-item-text brc-legend-item-${gen.safeId(m.label)}`)
          .text(m => m.label)
          .style('font-size', legendFontSize)
        return text
    })
    .attr('x', m => m.x + swatchSize * swatchFact)
    .attr('y', m => m.y + legendFontSize * 1)

  addEventHandlers(ls, 'label', interactivity, svgChart)
  addEventHandlers(lt, 'label', interactivity, svgChart)

  return swatchSize * swatchFact * (rows + 1)
}