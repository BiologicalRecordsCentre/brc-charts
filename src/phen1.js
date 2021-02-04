/** @module phen1 */

import * as d3 from 'd3'
import * as gen from './general'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of each sub-chart area in pixels.
 * @param {number} opts.height - The height of the each sub-chart area in pixels.
 * @param {number} opts.perRow - The number of sub-charts per row.
 * @param {boolean} opts.normalize - Whether or not to use normalized or actual numbers.
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
 * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph.
 * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label.
 * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.
 * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
 * @param {string} opts.axisTop- If set to 'on' line is drawn otherwise not.
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
 * If empty, graphs for all taxa are created.
 * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
 * data for which a line should be generated on the chart.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>prop</b> - the name of the nuemric property in the data.
 * <li> <b>label</b> - a label for this metric.
 * <li> <b>colour</b> - optional colour to give the line for this metric. 
 * </ul>
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>week</b> - a number between 1 and 53 indicating the week of the year.
 * <li> <b>p1</b> - a count for the first time period. 
 * <li> <b>p2</b> - a count for the second time period. 
 * </ul>
 * @returns {module:phen1~api} api - Returns an API for the chart.
 */

export function phen1({
  // Default options in here
  selector = 'body',
  elid = 'phen1-chart',
  width = 300,
  height = 200,
  perRow = 2,
  normalize = false,
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
  showTaxonLabel = true,
  taxonLabelFontSize = 16,
  taxonLabelItalics = false,
  axisLeft = 'tick',
  axisBottom = 'tick',
  axisRight = '',
  axisTop = '',
  duration = 1000,
  data = [],
  taxa = [],
  metrics = []
} = {}) {

  let dataPrev

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-phen')
    .style('position', 'relative')
    .style('display', 'inline')

  // const chartDiv = mainDiv
  //   .append('div')

  const svg = mainDiv.append('svg') //.attr('overflow', 'visible')

  let svgTitle, svgSubtitle, svgFooter
  
  makeChart()

  // Title must come after chart and legend because the 
  // width of those is required to do wrapping for title
  //svgTitle = makeText (title, svgTitle, 'titleText', titleFontSize, titleAlign)
  //svgSubtitle = makeText (subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign)
  //svgFooter = makeText (footer, svgFooter, 'footerText', footerFontSize, footerAlign)
  //positionElements()

  function makeChart () {
    if (!taxa.length) {
      taxa = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makePhen(t))
    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    svgsTaxa.forEach((svgTaxon, i) => {
      
      const col = i%perRow
      const row = Math.floor(i/perRow)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad))
      svgTaxon.attr("y", row * (subChartHeight + subChartPad))
    })

    const cols = svgsTaxa.length%perRow + 1
    const rows = Math.floor(svgsTaxa.length/perRow) + 1

    svg.attr("width", cols * (subChartWidth + subChartPad))
    svg.attr("height", rows * (subChartHeight + subChartPad))
  }

  function positionElements() {

    const width = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"))

    svgSubtitle.attr("y", Number(svgTitle.attr("height")))
    svgLegend.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap)
    svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap)
    svgPie.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap)
    svgFooter.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))))
    
    const height = Number(svgTitle.attr("height")) + 
      Number(svgSubtitle.attr("height")) + 
      legendSwatchGap + 
      Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))) + 
      Number(svgFooter.attr("height"))

    if (expand) {
      svg.attr("viewBox", "0 0 " + width + " " +  height)
    } else {
      svg.attr("width", width)
      svg.attr("height", height)
    }
  }

  function makeText (text, svgText, classText, fontSize, textAlign) {

    if (!svgText) {
      svgText = svg.append('svg')
    }

    const chartWidth = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"))
    const lines = wrapText(text, svgText, chartWidth, fontSize)

    const uText = svgText.selectAll(`.${classText}`)
      .data(lines)

    const eText = uText.enter()
      .append('text')

    uText
      .merge(eText)
      .text(d => {
        return d
      })
      .attr("class", classText)
      .style('font-size', fontSize)

    uText.exit()
      .remove()

    const height = svgText.select(`.${classText}`).node().getBBox().height
    const widths = svgText.selectAll(`.${classText}`).nodes().map(n => (n.getBBox().width))

    svgText.selectAll(`.${classText}`)
      .attr('y', (d, i) => (i + 1) * height)
      .attr('x', (d, i) => {
        if (textAlign === 'centre') {
          return (chartWidth - widths[i]) / 2
        } else if(textAlign === 'right') {
          return chartWidth - widths[i]
        } else {
          return 0
        }
      })
    svgText.attr("height", height * lines.length + height * 0.2) // The 0.2 allows for tails of letters like g, y etc.

    return svgText
  }

  function makePhen (taxon) {

    // Pre-process data.
    // Filter to named taxon and sort in week order
    // Add max value to each.
    const dataFiltered = data.filter(d => d.taxon === taxon).sort((a, b) => (a.week > b.week) ? 1 : -1)
    let lineData = [] 
    metrics.forEach(m => {
      lineData.push({
        colour: m.colour,
        max: Math.max(...dataFiltered.map(d => d[m.prop])),
        //total: dataFiltered.reduce((a, d) => a + d[m.prop], 0),
        points: dataFiltered.map(d => {
          return {
            n: d[m.prop],
            week: d.week
          }
        })
      })
    })

    // Set the maximum value for the y axis
    let yMax
    if (normalize) {
      yMax = 1
    } else {
      yMax = Math.max(...lineData.map(d => d.max))
      if (yMax < 5) yMax = 5
    }

    // Value scales
    const xScale = d3.scaleLinear().domain([1, 53]).range([0, width])
    const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0])

    // Top axis
    let tAxis
    if (axisTop === 'on') {
      tAxis = d3.axisTop()
        .scale(xScale)
        .tickValues([])
        .tickSizeOuter(0)
    }

    // X (bottom) axis
    let xAxis
    if (axisBottom === 'on' || axisBottom === 'tick') {
      // xScaleTime is only used to create the x axis
      const xScaleTime = d3.scaleTime()
        .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
        .range([0, width])
      
      xAxis = d3.axisBottom()
        .scale(xScaleTime)

      if (axisBottom === 'tick') {
        xAxis.ticks(d3.timeMonth)
          .tickSize(width >= 200 ? 13 : 5, 0)
          .tickFormat(date => {
            if (width >= 750) {
              return d3.timeFormat('%B')(date)
            } else if (width >= 330) {
              return d3.timeFormat('%b')(date)
            } else if (width >= 200) {
              return date.toLocaleString('default', { month: 'short' }).substr(0,1)
            } else {
              return ''
            }
          })
      } else {
        xAxis.tickValues([]).tickSizeOuter(0)
      }
    }

    // Right axis
    let rAxis
    if (axisRight === 'on') {
      rAxis = d3.axisRight()
        .scale(yScale)
        .tickValues([])
        .tickSizeOuter(0)
    }

    // Y (left) axis
    let yAxis
    if (axisLeft === 'on' || axisLeft === 'tick') {
      yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5)
      if (axisLeft !== 'tick') {
        yAxis.tickValues([]).tickSizeOuter(0)
      } else if (!normalize) {
        yAxis.tickFormat(d3.format("d"))
      }
    }
    
    // Line path generator
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      //.curve(d3.curveCardinal)
      .x(d => xScale(d.week))
      .y(d => yScale(d.n))


    // Create or get the relevant chart svg
    let init, svgPhen1, gPhen1
    if (svg.select(`#${gen.safeId(taxon)}`).size()) {
      svgPhen1 = svg.select(`#${gen.safeId(taxon)}`)
      gPhen1 = svgPhen1.select('.brc-chart-phen1-g')
      init = false
    } else {
      svgPhen1 = svg.append('svg')
        .classed('brc-chart-phen1', true)
        .attr('id', gen.safeId(taxon))
      gPhen1 = svgPhen1.append('g')
        .classed('brc-chart-phen1-g', true)
      init = true
    }
    
    // Create/update the line paths with D3
    const mlines = gPhen1.selectAll("path")
      .data(lineData)

    const eLines = mlines.enter()
      .append("g")
      .append("path")

    mlines.merge(eLines)
      .transition()
      .duration(duration)
      .attr("d", d => {
        if (normalize) {
          return line(d.points.map(p => {
            return {
              n: d.max ? p.n/d.max : 0,
              week: p.week
            }
          }))
        } else {
          return line(d.points)
        }
      })
      .attr("stroke", d => d.colour)
      .attr("stroke-width", 2)

    mlines.exit()
      .remove()

    if (init) {
      // Constants for positioning
      const axisPadX = axisLeft === 'tick' ? 35 : 0
      const axisPadY = axisBottom === 'tick' ? 15 : 0
      let labelPadY 

      // Taxon title
      if (showTaxonLabel) {
        const taxonLabel = svgPhen1
          .append('text')
          .text(taxon)
          .style('font-size', taxonLabelFontSize)
          .style('font-style', taxonLabelItalics ? 'italic' : '')

        const labelHeight = taxonLabel.node().getBBox().height
        taxonLabel.attr("transform", `translate(${axisPadX}, ${labelHeight})`)
        labelPadY = labelHeight * 1.5
      } else {
        labelPadY = 0
      }
      
      // Size SVG
      svgPhen1
        .attr('width', width + axisPadX + 1)
        .attr('height', height + axisPadY + labelPadY + 1)


      // Position chart
      gPhen1.attr("transform", `translate(${axisPadX},${labelPadY})`)
      
      // Create axes and position within SVG
      if (yAxis) {
        const gYaxis = svgPhen1.append("g")
          .attr("class", "y-axis")
          // .transition()
          // .duration(duration)
          // .call(yAxis)
        gYaxis.attr("transform", `translate(${axisPadX},${labelPadY})`)
      }
      if (xAxis) {
        const gXaxis = svgPhen1.append("g")
          .attr("class", "x axis")
          .call(xAxis)

        gXaxis.selectAll(".tick text")
          .style("text-anchor", "start")
          .attr("x", 6)
          .attr("y", 6)

        gXaxis.attr("transform", `translate(${axisPadX},${height + labelPadY})`)
      }
      if (tAxis) {
        const gTaxis = svgPhen1.append("g")
          .call(tAxis)
        gTaxis.attr("transform", `translate(${axisPadX},${labelPadY})`)
      }
      if (rAxis) {
        const gRaxis = svgPhen1.append("g")
          .call(rAxis)
        gRaxis.attr("transform", `translate(${axisPadX + width},${labelPadY})`)
      }
    }

    svgPhen1.select(".y-axis")
      .transition()
      .duration(duration)
      .call(yAxis)

    return svgPhen1
  }

  function wrapText(text, svgTitle, maxWidth, fontSize) {

    const textSplit = text.split(" ")
    const lines = ['']
    let line = 0

    for (let i=0; i < textSplit.length; i++) {

      if (textSplit[i] === '\n') {
        line++
        lines[line] = ''
      } else {
        let workingText = `${lines[line]} ${textSplit[i]}`
        workingText = workingText.trim()

        const txt = svgTitle.append('text')
          .text(workingText)
          .style('font-size', fontSize)

        const width = txt.node().getBBox().width

        if (width > maxWidth) {
          line++
          lines[line] = textSplit[i]
        } else {
          lines[line] = workingText
        }
        txt.remove()
      }
    }
    return lines
  }

  function cloneData(data) {
    return data.map(d => { return {...d}})
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
  * @param {boolean} opts.normalize - Whether or not to use normalized or actual numbers.
  * @param {Array.<Object>} opts.data - Specifies an array of data objects.
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
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

    //svgTitle = makeText (title, svgTitle, 'titleText', titleFontSize, titleAlign)
    //svgSubtitle = makeText (subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign)
    //svgFooter = makeText (footer, svgFooter, 'footerText', footerFontSize, footerAlign)

    // if ('data' in opts) {
    //   makePhen(opts.data)
    // }

    if ('normalize' in opts) {
      normalize = opts.normalize
      makeChart()
    }

    if ('taxa' in opts) {
      taxa = opts.taxa
      makeChart()
    }

    //positionElements()
  }

/** @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

  /**
   * @typedef {Object} api
   * @property {module:pie~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:pie~setChartOpts} setChartOpts - Sets text options for the chart. 

   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
  }

}