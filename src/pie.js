/** @module pie */

import * as d3 from 'd3'
import { dataAccessors } from './dataAccess.js'

//https://www.d3-graph-gallery.com/graph/pie_annotation.html
//https://github.com/d3/d3-shape/blob/v2.0.0/README.md#pie

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.radius - The desired radius of the chart in pixels.
 * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie char. Specify a value for donut chart.
 * @param {string} opts.sort - Sort function. Set to 'asc' for ascending, 'desc' for descending or '' for no sort.
 * @param {string} opts.label - How to label sections. Set to 'value' for raw number, 'percent' for percentage or '' for no sort.
 * @param {string} opts.labelFontSize - Set to a font size (pixels).
 * @param {string} opts.labelColour - Specifies the colour of label text.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element.
 * @param {string} opts.backgroundFill - Specifies the background colour of the chart.
 * @param {string} opts.legendSwatchSize - Specifies the size of legend swatches.
 * @param {string} opts.legendSwatchGap - Specifies the size of gap between legend swatches.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * @returns {module:pie~api} api - Returns an API for the map.
 */
export function pie({
  // Default options in here
  selector = 'body',
  elid = 'piechart',
  radius = 200,
  innerRadius = 0,
  sort = '',
  label = '',
  labelFontSize = 10,
  labelColour = 'black',
  expand = false,
  //backgroundFill = 'white',
  legendSwatchSize = 30,
  legendSwatchGap = 10,
  title = '',
  titleFontSize = 24,
  titleAlign = 'left',
  data = []
} = {}) {

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-pie')
    .style('position', 'relative')
    .style('display', 'inline')

  const chartDiv = mainDiv
    .append('div')

  const svg = chartDiv.append('svg')

  const svgLegend = makeLegend(data, svg)
  const svgPie = makePie(data, svg)
  
  // Can calcualte with at this point since only legend and chart affect width
  const width = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"))

  const svgTitle = makeTitle(svg, width)

  svgLegend.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap)
  svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap)
  svgPie.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap)
  
  const height = Number(svgTitle.attr("height")) + 2 * legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height")))

  if (expand) {
    svg.attr("viewBox", "0 0 " + width + " " +  height)
  } else {
    svg.attr("width", width)
    svg.attr("height", height)
  }

  function wrapText(text, svgTitle, maxWidth) {

    const textSplit = text.split(" ")
    const lines = ['']
    let line = 0

    for (let i=0; i < textSplit.length; i++) {

      let workingText = `${lines[line]} ${textSplit[i]}`
      workingText = workingText.trim()

      const txt = svgTitle.append('text')
        .text(workingText)
        .style('font-size', titleFontSize)

      const width = txt.node().getBBox().width

      if (width > maxWidth) {
        line++
        lines[line] = textSplit[i]
      } else {
        lines[line] = workingText
      }

      txt.remove()
    }
    return lines
  }

  function makeTitle (svg, chartWidth) {
    const svgTitle = svg.append('svg')
    
    const lines = wrapText(title, svgTitle, chartWidth)

    const uTitleText = svgTitle.selectAll('.titleText')
      .data(lines)

    uTitleText.enter()
      .append('text')
      .merge(uTitleText)
      .text(d => {
        console.log(d)
        return d
      })
      .attr("class", "titleText")
      .style('font-size', titleFontSize)

    uTitleText.exit()
      .remove()

    const height = d3.select('.titleText').node().getBBox().height
    const widths = d3.selectAll('.titleText').nodes().map(n => (n.getBBox().width))

    svgTitle.selectAll('.titleText')
      .attr('y', (d, i) => (i + 1) * height)
      .attr('x', (d, i) => {
        if (titleAlign === 'centre') {
          return (chartWidth - widths[i]) / 2
        } else if(titleAlign === 'right') {
          return chartWidth - widths[i]
        } else {
          return 0
        }
      })
    svgTitle.attr("height", height * lines.length)
    return svgTitle
  }

  function makeLegend (data, svg) {
    const svgLegend = svg.append('svg')

    const uLegendSwatch = svgLegend.selectAll('.legendSwatch')
      .data(data)

    uLegendSwatch.enter()
      .append('rect')
      .merge(uLegendSwatch)
      .attr('id', (d, i) => `swatch-${i}`)
      .attr("class", "legendSwatch")
      .attr('y', (d, i) => i * (legendSwatchSize + legendSwatchGap))
      .attr('width', legendSwatchSize)
      .attr('height', legendSwatchSize)
      .style('fill', d => d.colour)
      .on("mouseover", function(d, i) {
        highlightItem(i, true)
      })
      .on("mouseout", function(d, i) {
        highlightItem(i, false)
      })

    uLegendSwatch.exit()
      .remove()

    const uLegendText = svgLegend.selectAll('.legendText')
      .data(data)

    uLegendText.enter()
      .append('text')
      .merge(uLegendText)
      .text(d => d.name)
      .attr('id', (d,i) => `legend-${i}`)
      .attr("class", "legendText")
      .attr('x', () => legendSwatchSize + legendSwatchGap)
      .style('font-size', labelFontSize)
      .on("mouseover", function(d, i) {
        highlightItem(i, true)
      })
      .on("mouseout", function(d, i) {
        highlightItem(i, false)
      })

    uLegendText.exit()
      .remove()

    const legendTextWidth = d3.max(d3.selectAll('.legendText').nodes(), n => n.getBBox().width)
    const legendTextHeight = d3.max(d3.selectAll('.legendText').nodes(), n => n.getBBox().height)

    // We delay setting vertical position of legend text until we know the text height so that
    // we can centre with swatch

    svgLegend.selectAll('.legendText')
      .data(data)
      .attr('y', (d, i) => (i + 1) * (legendSwatchSize + legendSwatchGap) - (legendSwatchSize / 2) - (legendTextHeight / 4))

    svgLegend.attr("width", legendSwatchSize + legendSwatchGap + legendTextWidth)
    svgLegend.attr("height", data.length * (legendSwatchSize + legendSwatchGap) - legendSwatchGap)
    return svgLegend
  }

  function makePie (data, svg) {

    const svgPie = svg.append('svg')
      .attr('width', 2 * radius)
      .attr('height', 2 * radius)

    const gPie = svgPie.append('g')
      //.attr('transform', `translate(${legendWidth + radius} ${radius})`)
      .attr('transform', `translate(${radius} ${radius})`)

    let fnSort
    if (sort === 'asc') {
      fnSort = (a,b) => b-a
    } else if (sort === 'desc') {
      fnSort = (a,b) => a-b
    } else {
      fnSort = null
    }
    const arcs = d3.pie().value(d => d.number).sortValues(fnSort)(data)
    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius)

    // map to data
    const uPie = gPie.selectAll('path')
      .data(arcs)

    uPie.enter()
      .append('path')
      .merge(uPie)
      .attr('id', (d, i) => `pie-${i}`)
      .attr('d', arcGenerator)
      .attr('fill', d => d.data.colour)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 1)
      .on("mouseover", function(d, i) {
        highlightItem(i, true)
      })
      .on("mouseout", function(d, i) {
        highlightItem(i, false)
      })

    uPie.exit()
      .remove()

    if (label) {
      const uPieLabels = gPie.selectAll('.labelsPie')
        .data(arcs)
        
      const total = data.reduce((t, c) => {return t + c.number}, 0)

      uPieLabels.enter()
        .append('text')
        .merge(uPieLabels)
        .text(d => {
          if (label ==='value') {
            return d.data.number
          } else if (label ==='percent') {
              return `${Math.round(d.data.number / total * 100)}%`
          }
        })
        .attr("class", "labelsPie")
        .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', labelFontSize)
        .style('fill', labelColour)
        .on("mouseover", function(d, i) {
          highlightItem(i, true)
        })
        .on("mouseout", function(d, i) {
          highlightItem(i, false)
        })

      uPieLabels.exit()
        .remove()
    }

    return svgPie
  }

  function highlightItem (i, show) {
    console.log(svg.select(`#pie-${i}`))
    
    if (show) {
      svg.selectAll('path').classed('brc-lowlight', true)
      svg.selectAll('.legendSwatch').classed('brc-lowlight', true)
      svg.selectAll('.legendText').classed('brc-lowlight', true)
      svg.select(`#swatch-${i}`).classed('brc-lowlight', false)
      svg.select(`#legend-${i}`).classed('brc-lowlight', false)
      svg.select(`#pie-${i}`).classed('brc-lowlight', false)
    } else {
      svg.selectAll('.brc-lowlight').classed('brc-lowlight', false)
    }
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the svgMap function</b>.
  * Return the blah.
  */
  function getChartHeight(){
      //todo
    return height
  }

  /**
   * @typedef {Object} api
   * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   */
  return {
    getChartHeight: getChartHeight,
  }

}