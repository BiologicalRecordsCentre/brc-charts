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
 * @param {string} opts.backgroundColour - The background colour of the main chart area. Can be set to empty string for none. (Default - empty.)
 * @param {string} opts.taxa1colour - The colour to use for taxa in column taxa1. Can be any valid CSS colour string or 'auto' to specify a colour automatically. (Deafult - 'black'.)
 * @param {string} opts.taxa2colour - The colour to use for taxa in column taxa2. Can be any valid CSS colour string or 'auto' to specify a colour automatically. (Deafult - 'black'.)
 * @param {boolean} opts.overflow - A boolean that indicates whether or not to show graphics that overflow the svg boundary. (Default - true.)
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
  overflow = true,
  interactivity = 'mousemove',
  backgroundColour = '',
  taxa1colour = 'black',
  taxa2colour = 'black',
  taxonInfoFn = null,
  linkInfoFn = null,
  radius = 5,
  data = []
} = {}) {

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-links')
    .style('position', 'relative')
    .style('display', 'inline')
  
  mainDiv.classed('chart-overflow', overflow)

  // Define the div for the tooltip
  const popupDiv = d3.select("body").append("div")	
    .attr("class", "brc-chart-links-popup")				
    .style("opacity", 0)
 
  const svg = mainDiv.append('svg')
  if (backgroundColour) {
    svg.style('background-color', backgroundColour)
  }

  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      //highlightItem(null, null, false)
    }
  })

  const svgChart = svg.append('svg')
    .attr('class', 'mainChart')
    .attr('x', 0)
    .attr('y', -80)
    .attr("width", width)
    .attr("height", height)

  const simulation = d3.forceSimulation()
  let nodes

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
    const taxa1 = data.map(d => d.taxon1)
    const taxa2 = data.map(d => d.taxon2)
    const taxa = [...new Set(taxa1), ...new Set(taxa2)]

    // Good example of modifying force layout here:
    // https://observablehq.com/@d3/modifying-a-force-directed-graph
    // In a force directed layout, the current positions of the nodes is stored
    // within the data objects - NOT the DOM ojbects. So to preserve current
    // position of elements when data is updated, we have to keep previous
    // version of the node object.
    let nodesPrev
    if (nodes) {
      // Map gives a dictionary that can be used to lookup
      nodesPrev = new Map(nodes.map(d => [d.id, d]))
    }
    nodes = taxa.map(t => {
      return {
        id: t,
        t1: taxa1.includes(t),
      }
    })
    if (nodesPrev) {
      // Use previous node where it exists
      nodes = nodes.map(d => Object.assign(nodesPrev.get(d.id) || {}, d))
    }
    
    const links = data.map(d => {
      return {
        key: gen.safeId(`${d.taxon1}-${d.taxon2}`),
        source: d.taxon1,
        target: d.taxon2,
        data: d.data
      }
    })

    //const simulation = d3.forceSimulation(nodes)
    simulation.nodes(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-30)) // default strength is -30 (repel)
      .force("center", d3.forceCenter(width / 2, height / 2))
    simulation.alpha(1).restart()

    const link = svgChart.selectAll(".display-link")
      .data(links, d => d.key)
      .join(
        enter => enter.append("line")
          .classed('display-link', true)
          .attr("id", d => d.key),
        update => update,
        exit => exit.remove()
      )

    const selectLink = svgChart.selectAll(".select-link")
      .data(links, d => d.key)
      .join(
        enter => enter.append("line")
          .classed('select-link', true)
          .on("mouseover", function(d) {	
              d3.select(`.display-link#${d.key}`).classed('highlighted', true)
              d3.select(`circle#${gen.safeId(d.source.id)}`).classed('highlighted', true)
              d3.select(`circle#${gen.safeId(d.target.id)}`).classed('highlighted', true)
              popupDiv.transition()		
                .duration(200)		
                .style("opacity", 0.9)
              const html = linkInfoFn ? linkInfoFn(d.source.id, d.target.id, d.data) : ''
              popupDiv.html(html)	
                .style("left", (d3.event.pageX + 10) + "px")		
                .style("top", (d3.event.pageY - 30) + "px")
          })					
          .on("mouseout", function(d) {		
              d3.select(`.display-link#${d.key}`).classed('highlighted', false)
              d3.select(`circle#${gen.safeId(d.source.id)}`).classed('highlighted', false)
              d3.select(`circle#${gen.safeId(d.target.id)}`).classed('highlighted', false)
              popupDiv.transition()		
                .duration(500)		
                .style("opacity", 0)
          }),
        update => update,
        exit => exit.remove()
      )
 
    const node = svgChart.selectAll("circle")
      .data(nodes, d => d.id)
      .join(
        enter => enter.append("circle")
          .attr('id', d => gen.safeId(d.id))
          .attr("r", radius)
          .attr("x", width/2)
          .attr("y", height/2)
          .attr("fill", (d, i) => getColour(taxa1, taxa2, taxa, d, i))
          .on("click", function(d) {
            delete d.fx
            delete d.fy
            d3.select(this).classed("fixed", false)
            simulation.alpha(1).restart()
          })
          .on("mouseover", function(d) {		
              d3.select(this).classed("highlighted", true)
              highLightLinks(d.id, true)
              popupDiv.transition()		
                .duration(200)		
                .style("opacity", 0.9)

              const html = taxonInfoFn ? taxonInfoFn(d.id, d.t1) : d.id
              popupDiv.html(html)	
                .style("left", (d3.event.pageX + 10) + "px")		
                .style("top", (d3.event.pageY - 30) + "px")
              })					
          .on("mouseout", function(d) {		
              d3.select(this).classed("highlighted", false)
              highLightLinks(d.id, false)
              popupDiv.transition()		
                .duration(500)		
                .style("opacity", 0)
          }),
        update => update,
        exit => exit
          .call(exit => exit.transition().duration(1000)
            .attr("r", 0)
            .remove())
      )
        .call(drag(simulation))

    simulation.on("tick", () => {
      node
        .attr("cx", d => {
          if (overflow) {
            return d.x
          } else {
            return d.x = Math.max(radius, Math.min(width - radius, d.x))
          }
        })
        .attr("cy", d => {
          if (overflow) {
            return d.y
          } else {
            return d.y = Math.max(radius, Math.min(height - radius, d.y))
          }
        })
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      selectLink
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
    })

    function highLightLinks(id, highlight) {
      const hLinks = links.filter(l => l.source.id === id || l.target.id === id)
      hLinks.forEach(link => {
        d3.selectAll(`.display-link#${link.key}`).classed('highlighted', highlight)
      })
    }
  }

  function getColour(taxa1, taxa2, taxa, d) {
    let iAuto
    if (taxa1colour === 'auto' && taxa2colour === 'auto') {
      iAuto = taxa.indexOf(d.id)
    } else if (taxa1colour === 'auto') {
      iAuto = taxa1.indexOf(d.id)
    } else if (taxa2colour === 'auto') {
      iAuto = taxa2.indexOf(d.id)
    }

    if (d.t1) {
      if (taxa1colour === 'auto') {
        return autoColour(iAuto)
      } else {
        return taxa1colour
      }
    } else {
      if (taxa2colour === 'auto') {
        return autoColour(iAuto)
      } else {
        return taxa2colour
      }
    }

    function autoColour(i) {
      if (!d.colour) {
        if (i < 10) {
          return d3.schemeCategory10[i]
        }
        else if (i < 18) {
          return d3.schemeDark2[i - 10]
        }
        else if (i < 26) {
          return d3.schemeAccent[i - 18]
        }
        else {
          return d3.interpolateSpectral(Math.random())
        }
      }
    }
  
  }

  function drag(simulation) {
  
    function dragstart() {
      d3.select(this).classed("fixed", true)
    }

    function dragged() {
      d3.event.subject.fx = clamp(d3.event.x, 0, width)
      d3.event.subject.fy = clamp(d3.event.y, 0, height)
      simulation.alpha(1).restart()
    }

    return d3.drag()
      .on("start", dragstart)
      .on("drag", dragged)
  }

  function clamp(x, lo, hi) {
    //return x < lo ? lo : x > hi ? hi : x;
    return x
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
    setChartOpts: setChartOpts
  }
}