/** @module links */

import * as d3 from 'd3'
import * as gen from './general'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of the main chart area in pixels (excludes margins).
 * @param {number} opts.height - The height of the main chart area in pixels (excludes margins).
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.subtitle - Subtitle for the chart.
 * @param {string} opts.footer - Footer for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.footerFontSize - Font size (pixels) of chart title.
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
 * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>name</b> - the name of the data item uniquely identifies it and is shown in the legend.
 * <li> <b>number</b> - a numeric value associated with the item.
 * <li> <b>colour</b> - an optional colour for the symbol which can be hex format, e.g. #FFA500, 
 * RGB format, e.g. rgb(100, 255, 0) or a named colour, e.g. red. If not specified, a colour will be assigned.
 * <li> <b>image</b> - this optional property allows you to specify the url of an image file
 * which can be displayed when a user selects the associated item.
 * </ul>
 * @returns {module:links~api} api - Returns an API for the chart.
 */

export function links({
  // Default options in here
  selector = 'body',
  elid = 'link-chart',
  width = 300,
  height = 200,
  expand = false,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 14,
  titleAlign = 'left',
  subtitleAlign = 'left',
  footerAlign = 'left',
  duration = 1000,
  interactivity = 'mousemove',
  data = []
} = {}) {

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-links')
    .style('position', 'relative')
    .style('display', 'inline')

  const svg = mainDiv.append('svg')
  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      //highlightItem(null, null, false)
    }
  })

  const svgChart = svg.append('svg').attr('class', 'mainChart')
  makeChart(data)
  // Texts must come after chart because 
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width"))
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand)

  function makeChart(data) {
    // Make two separate arrays - one for nodes and one for links
    const taxon1 = data.map(d => d.taxon1)
    const taxon2 = data.map(d => d.taxon2)
    const nodes = [...new Set(taxon1), ...new Set(taxon2)].map(t => {
      return {id: t}
    })
    const links = data.map(d => {
      return {
        source: d.taxon1,
        target: d.taxon2
      }
    })

    svgChart.attr("width", width)
    svgChart.attr("height", height)

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-30)) // default strength is -30 (repel)
      .force("center", d3.forceCenter(width / 2, height / 2))

    const link = svgChart.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", 1)

    const node = svgChart.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 5)
        //.attr("fill", color)
        .call(drag(simulation))

    node.append("title")
      .text(d => d.id)

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
    })
  }

  function drag(simulation) {
  
    // function dragstarted() {
    //   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    //   d3.event.subject.fx = d3.event.subject.x;
    //   d3.event.subject.fy = d3.event.subject.y;
    // }

    // function dragged() {
    //   d3.event.subject.fx = d3.event.x;
    //   d3.event.subject.fy = d3.event.y;
    // }

    // function dragended() {
    //   if (!d3.event.active) simulation.alphaTarget(0);
    //   d3.event.subject.fx = null;
    //   d3.event.subject.fy = null;
    // }
    // return d3.drag()
    //     .on("start", dragstarted)
    //     .on("drag", dragged)
    //     .on("end", dragended);

    function dragstart() {
      d3.select(this).classed("fixed", true);
    }

    function dragged() {
      d3.event.subject.fx = clamp(d3.event.x, 0, width);
      d3.event.subject.fy = clamp(d3.event.y, 0, height);
      simulation.alpha(1).restart();
    }

    return d3.drag()
      .on("start", dragstart)
      .on("drag", dragged);
  }

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }

/** @function setChartOpts
  * @param {Object} opts - text options.
  * @param {string} opts.title - Title for the chart.
  * @param {string} opts.subtitle - Subtitle for the chart.
  * @param {string} opts.footer - Footer for the chart.
  * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
  * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title.
  * @param {string} opts.footerFontSize - Font size (pixels) of chart title.
  * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
  * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
  * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
  * @param {Array.<Object>} opts.data - Specifies an array of data objects.
  * @description <b>This function is exposed as a method on the API returned from the links function</b>.
  * Set's the value of the chart data, title, subtitle and/or footer. If an element is missing from the 
  * options object, it's value is not changed.
  */
  function setChartOpts(opts){

    if ('title' in opts) {
      title = opts.title
    }
    if ('subtitle' in opts) {
      subtitle = opts.subtitle
    }
    if ('footer' in opts) {
      footer = opts.footer
    }
    if ('titleFontSize' in opts) {
      titleFontSize = opts.titleFontSize
    }
    if ('subtitleFontSize' in opts) {
      subtitleFontSize = opts.subtitleFontSize
    }
    if ('footerFontSize' in opts) {
      footerFontSize = opts.footerFontSize
    }
    if ('titleAlign' in opts) {
      titleAlign = opts.titleAlign
    }
    if ('subtitleAlign' in opts) {
      subtitleAlign = opts.subtitleAlign
    }
    if ('footerAlign' in opts) {
      footerAlign = opts.footerAlign
    }

    const textWidth = Number(svgChart.attr("width"))
    gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
    gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
    gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)

    if ('data' in opts) {
      makeChart(opts.data)
    }

    //positionElements()
    gen.positionMainElements(svg, expand)
  }

/** @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the links function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the links function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

  /**
   * @typedef {Object} api
   * @property {module:links~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:links~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:links~setChartOpts} setChartOpts - Sets text options for the chart. 

   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
  }
}