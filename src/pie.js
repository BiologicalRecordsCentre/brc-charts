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
 * @param {Object} opts.accessFns - Sets an object whose properties are data access functions. The property
 * names are the 'keys'.
 * @param {string} opts.accessorKey - Sets the key of the selected data accessor function.
 * @param {string} opts.backgroundFill - Specifies the background colour of the chart.
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
  //expand = false,
  accessFns = dataAccessors,
  fnKey = 'test',
  //backgroundFill = 'white',
} = {}) {

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-pie')
    .style('position', 'relative')
    .style('display', 'inline')

  const titleDiv = mainDiv
    .append('div')
    .attr('class', 'brc-chart-pie-title')
  const legendDiv = mainDiv
    .append('div')
    .attr('class', 'brc-chart-pie-legend')
  const chartDiv = mainDiv
    .append('div')
    .attr('class', 'brc-chart-pie-chart')

  accessFns[fnKey]().then((odata) => {
    makeTitle(odata)
    makeLegend(odata)
    makeChart(odata)
  })

  function makeTitle(odata) {
    const title = titleDiv
      .append('h4')
      .text(odata.meta.title)
  }

  function makeLegend(odata) {
    const legend = legendDiv
      .append('h4')
      .text('Legend')
  }

  function makeChart(odata) {

    const width = 2 * radius + 100
    const height = 2 * radius + 100
    
    const svg = chartDiv
      .append('svg')
        .attr('width', width)
        .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    // Read the data and then create the pie chart
    //fn().then((odata) => {
      console.log(odata)

      const total = odata.data.reduce((t, c) => {return t + c.number}, 0)

      let fnSort
      if (sort === 'asc') {
        fnSort = (a,b) => b-a
      } else if (sort === 'desc') {
        fnSort = (a,b) => a-b
      } else {
        fnSort = null
      }
      const arcs = d3.pie().value(d => d.number).sortValues(fnSort)(odata.data)
      const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius)
      console.log(arcs)

      // map to data
      const u = svg.selectAll('path')
        .data(arcs)

      u.enter()
        .append('path')
        .merge(u)
        .attr('d', arcGenerator)
        .attr('fill', d => d.data.colour)
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 1)

      u.exit()
        .remove()

      if (label) {
        console.log('label', label)

        const l = svg.selectAll('text')
          .data(arcs)
          
        l.enter()
          .append('text')
          .text(d => {
            if (label ==='value') {
              return d.data.number
            } else if (label ==='percent') {
                return `${Math.round(d.data.number / total * 100)}%`
            }
          })
          .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
          .style('text-anchor', 'middle')
          .style('font-size', labelFontSize)
          .style('fill', labelColour)

        l.exit()
          .remove()
      }
    //})
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