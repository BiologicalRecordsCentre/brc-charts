/** @module trend */

import * as d3 from 'd3'
import * as gen from './general'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of each sub-chart area in pixels.
 * @param {number} opts.height - The height of the each sub-chart area in pixels.
 * @param {number} opts.perRow - The number of sub-charts per row.
 * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
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
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
 * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
 * @param {string} opts.axisTop- If set to 'on' line is drawn otherwise not.
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
 * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
 * If empty, graphs for all taxa are created.
 * @param {Array.<string>} opts.group - An array of taxa (names), indicating which taxa comprise the whole group for which proportion stats are calculated. 
 * If empty, graphs for all taxa are created.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>year</b> - a four digit number indicating a year.
 * <li> <b>count</b> - a count for the given year. 
 * </ul>
 * @param {number} opts.minYear- Indicates the earliest year to use on the y axis. If left unset, the earliest year in the dataset is used.
 * @param {number} opts.maxYear- Indicates the earliest year to use on the y axis. If left unset, the earliest year in the dataset is used.
 * @returns {module:trend~api} api - Returns an API for the chart.
 */

export function trend({
  // Default options in here
  selector = 'body',
  elid = 'trend-chart',
  width = 300,
  height = 200,
  perRow = 2,
  ytype = 'count',
  expand = false,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 10,
  legendFontSize = 16,
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
  interactivity = 'mousemove',
  data = [],
  taxa = [],
  group = [],
  minYear = null,
  maxYear = null
} = {}) {

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .style('position', 'relative')
    .style('display', 'inline')

  const svg = mainDiv.append('svg')
  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(null, false)
    }
  })

  const svgChart = svg.append('svg').attr('class', 'mainChart')
  
  makeChart()
  // Texts must come after chartbecause 
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width"))
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand)

  function makeChart () {

    // Set min and max year from data if not set
    if (!minYear) {
      minYear = Math.min(...data.map(d => d.year))
    }
    if (!maxYear) {
      maxYear = Math.max(...data.map(d => d.year))
    }

    // If taxa for graphs not set, set to all in dataset
    if (!taxa.length) {
      taxa = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    // If group for proportion data not set, set to all in dataset
    if (!group.length) {
      group = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    const yearTotals = {}
    if (ytype === 'proportion') {
      data
        .filter(d => group.indexOf(d.taxon) > -1 && d.year >= minYear && d.year <= maxYear)
        .forEach(d => {
          if (yearTotals[d.year]) {
            yearTotals[d.year] = yearTotals[d.year] + d.count
          } else {
            yearTotals[d.year] = d.count
          }
        })
    }

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makeTrend(t, yearTotals))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    const legendHeight = 0
    //const legendHeight = makeLegend(perRow * (subChartWidth + subChartPad)) + subChartPad

    svgsTaxa.forEach((svgTaxon, i) => {
      
      const col = i%perRow
      const row = Math.floor(i/perRow)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad))
      svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight)
    })

    svgChart.attr("width", perRow * (subChartWidth + subChartPad))
    svgChart.attr("height", legendHeight +  Math.ceil(svgsTaxa.length/perRow) * (subChartHeight + subChartPad))
  }

  function makeTrend (taxon, yearTotals) {

    console.log('yearTotals', yearTotals)

    // Pre-process data.
    // Filter to named taxon and to min and max year and sort in week order
    // Add max value to each.

    const dataFiltered = data
      .filter(d => d.taxon === taxon && d.year >= minYear && d.year <= maxYear)
      .sort((a, b) => (a.year > b.year) ? 1 : -1)

    const dataTransformed = dataFiltered
      .map(d => {
        return {
          year: d.year,
          n: ytype === 'proportion' ? d.count / yearTotals[d.year] : d.count
        }
      })

    const lineData = {
      colour: 'blue',
      strokeWidth: 2,
      points: dataTransformed
    }
    console.log(lineData)
    
    // Set the maximum value for the y axis
    let yMax = Math.max(...dataTransformed.map(d => d.n))
    yMax = yMax < 0.005 ? 0.005 : yMax

    // Value scales
    const xScale = d3.scaleLinear().domain([minYear, maxYear]).range([0, width])
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
      xAxis = gen.xAxisYear(width, axisBottom, minYear, maxYear)
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
      } else if (ytype === 'count') {
        yAxis.tickFormat(d3.format("d"))
      }
    }
    
    // Line path generator
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.year))
      .y(d => yScale(d.n))

    // Create or get the relevant chart svg
    let init, svgTrend, gTrend
    if (taxa.length === 1 && svgChart.selectAll('.brc-chart-trend').size() === 1) {
      svgTrend = svgChart.select('.brc-chart-trend')
      gTrend = svgTrend.select('.brc-chart-trend-g')
      init = false
    } else if (svgChart.select(`#${gen.safeId(taxon)}`).size()) {
      svgTrend = svgChart.select(`#${gen.safeId(taxon)}`)
      gTrend = svgTrend.select('.brc-chart-trend-g')
      init = false
    } else {
      svgTrend = svgChart.append('svg')
        .classed('brc-chart-trend', true)
        .attr('id', gen.safeId(taxon))
      gTrend = svgTrend.append('g')
        .classed('brc-chart-trend-g', true)
      init = true
    }
    
    // Create/update the line paths with D3
    const mlines = gTrend.selectAll("path")
      //.data(lineData,  d => d.id)
      .data([lineData])

    const eLines = mlines.enter()
      .append("path")
      //.attr("class", d => `trend-path-${d.id} trend-path`)
      .attr("class", 'trend-path')
      .attr("d", d => {
        return line(d.points.map(p => {
          return {
            n: 0,
            year: p.year
          }
        }))
      })

    //addEventHandlers(eLines, 'id')

    mlines.merge(eLines)
      .transition()
      .duration(duration)
      .attr("d", d => line(d.points))
      .attr("stroke", d => d.colour)
      .attr("stroke-width", d => d.strokeWidth)

    mlines.exit()
      .transition()
      .duration(duration)
      .attr("d", d => {
        return line(d.points.map(p => {
          return {
            n: 0,
            week: p.week
          }
        }))
      })
      .remove()

    if (init) {
      // Constants for positioning
      const axisPadX = axisLeft === 'tick' ? 35 : 0
      const axisPadY = axisBottom === 'tick' ? 15 : 0
      let labelPadY 

      // Taxon title
      if (showTaxonLabel) {
        const taxonLabel = svgTrend
          .append('text')
          .classed('brc-chart-trend-label', true)
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
      svgTrend
        .attr('width', width + axisPadX + 1)
        .attr('height', height + axisPadY + labelPadY + 1)


      // Position chart
      gTrend.attr("transform", `translate(${axisPadX},${labelPadY})`)
      
      // Create axes and position within SVG
      if (yAxis) {
        const gYaxis = svgTrend.append("g")
          .attr("class", "y-axis")
        gYaxis.attr("transform", `translate(${axisPadX},${labelPadY})`)
      }
      if (xAxis) {
        const gXaxis = svgTrend.append("g")
          .attr("class", "x axis")
          .call(xAxis)

        // gXaxis.selectAll(".tick text")
        //   .style("text-anchor", "start")
        //   .attr("x", 6)
        //   .attr("y", 6)

        gXaxis.attr("transform", `translate(${axisPadX},${height + labelPadY})`)
      }
      if (tAxis) {
        const gTaxis = svgTrend.append("g")
          .call(tAxis)
        gTaxis.attr("transform", `translate(${axisPadX},${labelPadY})`)
      }
      if (rAxis) {
        const gRaxis = svgTrend.append("g")
          .call(rAxis)
        gRaxis.attr("transform", `translate(${axisPadX + width},${labelPadY})`)
      }
    } else if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgTrend.select('.brc-chart-trend-label').text(taxon)
      }
    }

    svgTrend.select(".y-axis")
      .transition()
      .duration(duration)
      .call(yAxis)

    return svgTrend
  }

  function makeLegend (legendWidth) {
    
    const swatchSize = 20
    const swatchFact = 1.3

    // Loop through all the legend elements and work out their
    // positions based on swatch size, item lable text size and
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
      m.x = lineWidth + swatchSize
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

    addEventHandlers(ls, 'label')
    addEventHandlers(lt, 'label')

    return swatchSize * swatchFact * (rows + 1)
  }

  function highlightItem(id, highlight) {

    svgChart.selectAll('.trend-path')
      .classed('lowlight', highlight)

    svgChart.selectAll(`.trend-path-${gen.safeId(id)}`)
      .classed('lowlight', false)
  
    svgChart.selectAll(`.trend-path`)
      .classed('highlight', false)

    if (gen.safeId(id)) {
      svgChart.selectAll(`.trend-path-${gen.safeId(id)}`)
        .classed('highlight', highlight)
    }
    
    svgChart.selectAll('.brc-legend-item')
      .classed('lowlight', highlight)

    if (id) {
      svgChart.selectAll(`.brc-legend-item-${gen.safeId(id)}`)
        .classed('lowlight', false)
    }

    if (id) {
      svgChart.selectAll(`.brc-legend-item-${gen.safeId(id)}`)
        .classed('highlight', highlight)
    } else {
      svgChart.selectAll(`.brc-legend-item`)
        .classed('highlight', false)
    }
  }

  function addEventHandlers(sel, prop) {
    sel
      .on("mouseover", function(d) {
      if (interactivity === 'mousemove') {
          highlightItem(d[prop], true)
        }
      })
      .on("mouseout", function(d) {
        if (interactivity === 'mousemove') {
          highlightItem(d[prop], false)
        }
      })
      .on("click", function(d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d[prop], true)
          d3.event.stopPropagation()
        }
      })
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
  * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
  * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
  * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
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

    const textWidth = Number(svg.select('.mainChart').attr("width"))
    gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
    gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
    gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)

    let remakeChart = false

    if ('data' in opts) {
      data = opts.data
      remakeChart = true
    }

    if ('ytype' in opts) {
      ytype = opts.ytype
      remakeChart = true
    }

    if (remakeChart) makeChart()
    gen.positionMainElements(svg, expand)
  }

/** @function setTaxon
  * @param {string} opts.taxon - The taxon to display.
  * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
  * For single species charts, this allows you to change the taxon displayed.
  */
  function setTaxon(taxon){
    if (taxa.length !== 1) {
      console.log("You can only use the setTaxon method when your chart displays a single taxon.")
    } else {
      taxa = [taxon]
      makeChart()
    }
  }


/** @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

  /**
   * @typedef {Object} api
   * @property {module:phen1~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:phen1~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:phen1~setChartOpts} setChartOpts - Sets text options for the chart. 
   * @property {module:phen1~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon
  }

}