/** @module accum */

import * as d3 from 'd3'
import * as gen from './general'

/**
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of the main chart area in pixels (excludes margins).
 * @param {number} opts.height - The height of the main chart area in pixels (excludes margins).
 * @param {Object} opts.margin - An object indicating the margins to add around the main chart area.
 * @param {number} opts.margin.left - Left margin in pixels.
 * @param {number} opts.margin.right - Right margin in pixels.
 * @param {number} opts.margin.top - Top margin in pixels.
 * @param {number} opts.margin.bottom - Bottom margin in pixels.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.subtitle - Subtitle for the chart.
 * @param {string} opts.footer - Footer for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
 * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
 * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
 * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisTop - If set to 'on' line is drawn otherwise not.
 * @param {string} opts.axisTaxaLabel - Value for labelling taxa accumulation axis.
 * @param {string} opts.axisCountLabel - Value for labelling count accumulation axis.
 * @param {string} opts.axisLabelFontSize - Font size (pixels) for axis labels.
 * @param {string} opts.show - Indicates whether to show accumulation curves for taxa, counts or both. Permitted values: 'taxa', 'counts' or 'both'.
 * @param {boolean} opts.swapYaxes - The default display is number of taxa on left axis and counts on right. Set this to true to swap that.
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
 * If empty, graphs for all taxa are created.
 * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
 * data for which taxa and/or count accumulation lines should be generated on the chart.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>prop</b> - the name of the numeric property in the data (count properties - 'c1' or 'c2' in the example below).
 * <li> <b>labelTaxa</b> - a label for the taxa accumulation metric.
 * <li> <b>labelCounts</b> - a label for the counts accumulation metric.
 * <li> <b>key</b> - a base key for this metric. If the options are updated using the setChartOpts API method, then if this value is set, it is used to uniquely identify the graphic elements. If not set, then the label is used.
 * <li> <b>ColourTaxa</b> - optional colour to give the line for the taxa accumulation metric. Any accepted way of specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
 * <li> <b>ColourCounts</b> - optional colour to give the line for the counts accumulation metric. Any accepted way of specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
 * <li> <b>styleTaxa</b> - options style to give the line for the taxa accumulation metric. Accepted value is 'dashed' which results in a dashed line. Anything else results in a solid line.
 * <li> <b>styleCounts</b> - options style to give the line for the counts accumulation metric. Accepted value is 'dashed' which results in a dashed line. Anything else results in a solid line.
 * </ul>
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>week</b> - a number between 1 and 53 indicating the week of the year.
 * <li> <b>c1</b> - a count for a given time period (can have any name).
 * <li> <b>c2</b> - a count for a given time period (can have any name).
 * ... - there can be any number of these count columns.
 * </ul>
 * @returns {module:accum~api} api - Returns an API for the chart.
 */

export function accum({
  // Default options in here
  selector = 'body',
  elid = 'accum-chart',
  width = 300,
  height = 200,
  margin = {left: 0, right: 0, top: 0, bottom: 0},
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
  axisLeft = 'tick',
  axisBottom = 'tick',
  axisRight = 'tick',
  axisTop = '',
  axisTaxaLabel = '',
  axisCountLabel = '',
  axisLabelFontSize = 10,
  show = 'both',
  swapYaxes = false,
  duration = 1000,
  interactivity = 'mousemove',
  data = [],
  metrics = []
} = {}) {

  let metricsPlus

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-accum')
    .style('position', 'relative')
    .style('display', 'inline')

  const svg = mainDiv.append('svg')
  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(null, null, false)
    }
  })

  const svgChart = svg.append('svg').attr('class', 'mainChart')

  preProcessMetrics()
  makeChart()

  // Texts must come after chart because
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width"))
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand)

  function preProcessMetrics () {
    // Look for 'fading' colour in taxa and colour appropriately
    // in fading shades of grey.

    let iFadingTaxa = 0
    let iFadingCounts = 0
    let iFadeTaxa, iFadeCounts, strokeWidth
    metricsPlus = metrics.map(m => {
      if (m.colourCounts === 'fading') {
        iFadeCounts = ++iFadingCounts
        strokeWidth = 1
      } else {
        strokeWidth = 2
      }
      if (m.colourTaxa === 'fading') {
        iFadeTaxa = ++iFadingTaxa
        strokeWidth = 1
      } else {
        strokeWidth = 2
      }

      return {
        prop: m.prop,
        key: m.key,
        labelTaxa: m.labelTaxa,
        labelCounts: m.labelCounts,
        colourTaxa: m.colourTaxa,
        colourCounts: m.colourCounts,
        styleTaxa: m.styleTaxa,
        styleCounts: m.styleCounts,
        fadingTaxa: iFadeTaxa,
        fadingCounts: iFadeCounts,
        strokeWidth: strokeWidth
      }
    }).reverse()

    const greyTaxa = d3.scaleLinear()
      .range(['#808080', '#E0E0E0'])
      .domain([1, iFadeTaxa])
    const greyCounts = d3.scaleLinear()
      .range(['#808080', '#E0E0E0'])
      .domain([1, iFadeCounts])

    metricsPlus.forEach(m => {
      if (m.fadingTaxa) {
        m.colourTaxa = greyTaxa(m.fadingTaxa)
      }
      if (m.fadingCounts) {
        m.colourCounts = greyCounts(m.fadingCounts)
      }
    })
  }

  function makeChart () {

    const showTaxa = (show === 'taxa' || show === 'both')
    const showCounts = (show === 'counts' || show === 'both')
    let lineData = []

    metricsPlus.forEach(m => {

      const pointsTaxa = []
      const pointsCount = []
      let accumTaxa = []
      let accumCount = 0

      for (let week = 1; week <= 53; week++) {
        // Taxa for this week and property (normally a year)
        // Must have at least one non-zero) count to contribute to taxa count
        const weekStats = data.filter(d => d.week === week).reduce((a, d) => {
          a.total = a.total + d[m.prop]
          if (!a.taxa.includes(d.taxon) && d[m.prop]) {
            a.taxa.push(d.taxon)
          }
          return(a)
        }, {total: 0, taxa: []})

        accumTaxa = [...new Set([...accumTaxa, ...weekStats.taxa])]
        accumCount = accumCount + weekStats.total
        pointsTaxa.push({
          num: weekStats.taxa.length,
          accum: accumTaxa.length,
          week: week
        })
        pointsCount.push({
          num: weekStats.total,
          accum: accumCount,
          week: week
        })
      }

      if (showTaxa) {
        lineData.push({
          id: `${gen.safeId(m.labelTaxa)}`,
          key: m.key ? `${m.key}_taxa` : `${gen.safeId(m.labelTaxa)}`,
          type: 'taxa',
          label: m.labelTaxa,
          colour: m.colourTaxa,
          style: m.styleTaxa,
          strokeWidth: m.strokeWidth,
          max: Math.max(...pointsTaxa.map(p => p.accum)),
          points: pointsTaxa
        })
      }

      if (showCounts){
        lineData.push({
          id: `${gen.safeId(m.labelCounts)}`,
          key: m.key ? `${m.key}_counts` : `${gen.safeId(m.labelCounts)}`,
          type: 'count',
          label: m.labelCounts,
          colour: m.colourCounts,
          style: m.styleCounts,
          strokeWidth: m.strokeWidth,
          max: Math.max(...pointsCount.map(p => p.accum)),
          points: pointsCount
        })
      }
    })

    // Do the legend
    const legendHeight = makeLegend(lineData)

    // Value scales
    const xScale = d3.scaleLinear().domain([1, 53]).range([0, width])
    let yScaleCount, yScaleTaxa
    if (showCounts) {
      yScaleCount = d3.scaleLinear().domain([0, Math.max(...lineData.filter(l => l.type ==='count').map(l => l.max))]).range([height, 0])
    }
    if (showTaxa) {
      yScaleTaxa = d3.scaleLinear().domain([0, Math.max(...lineData.filter(l => l.type ==='taxa').map(l => l.max))]).range([height, 0])
    }

    // Top axis
    let tAxis
    if (axisTop === 'on') {
      tAxis = d3.axisTop()
        .scale(xScale)
        .tickValues([])
        .tickSizeOuter(0)
    }

    // Bottom axis
    let xAxis
    if (axisBottom === 'on' || axisBottom === 'tick') {
      xAxis = gen.xAxisMonth(width, axisBottom === 'tick')
    }

    const yScaleRight = swapYaxes ? yScaleTaxa : yScaleCount
    const yScaleLeft = swapYaxes ?  yScaleCount : yScaleTaxa

    // Left axis
    let yAxisLeft
    if (axisLeft === 'on' || axisLeft === 'tick') {
      if (yScaleLeft) {
        yAxisLeft = d3.axisLeft()
          .scale(yScaleLeft)
          .ticks(5)
        if (axisLeft !== 'tick') {
          yAxisLeft.tickValues([]).tickSizeOuter(0)
        } else if (ytype === 'count') {
          yAxisLeft.tickFormat(d3.format("d"))
        }
      } else {
        yAxisLeft = d3.axisLeft()
          .scale(d3.scaleLinear().range([height, 0]))
          .tickValues([])
          .tickSizeOuter(0)
      }
    }
    // Right axis
    let yAxisRight
    if (axisRight === 'on' || axisRight === 'tick') {
      if (yScaleRight) {
        yAxisRight = d3.axisRight()
          .scale(yScaleRight)
          .ticks(5)
        if (axisRight !== 'tick') {
          yAxisRight.tickValues([]).tickSizeOuter(0)
        } else if (ytype === 'count') {
          yAxisRight.tickFormat(d3.format("d"))
        }
      } else {
        yAxisRight = d3.axisRight()
          .scale(d3.scaleLinear().range([height, 0]))
          .tickValues([])
          .tickSizeOuter(0)
      }
    }

    // Line path generators
    let lineTaxa
    if (showTaxa) {
      lineTaxa = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d.week))
        .y(d => yScaleTaxa(d.accum))
    }

    let lineCount
    if (showCounts) {
      lineCount = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d.week))
        .y(d => yScaleCount(d.accum))
    }

    // Create or get the relevant chart svg
    let init, svgAccum, gAccum
    if (svgChart.select('.brc-chart-accum').size()) {
      svgAccum = svgChart.select('.brc-chart-accum')
      gAccum = svgAccum.select('.brc-chart-accum-g')
      init = false
    } else {
      svgAccum = svgChart.append('svg')
        .classed('brc-chart-accum', true)
        .style('overflow', 'visible')
      gAccum = svgAccum.append('g')
        .classed('brc-chart-accum-g', true)
      init = true
    }

    // Create/update the line paths with D3
    const mlines = gAccum.selectAll("path")
      .data(lineData,  d => d.key)

    const eLines = mlines.enter()
      .append("path")
      //.attr("class", d => `accum-path accum-path-${d.id}`)
      .attr("class", d => `accum-path accum-path-${d.key}`)
      .style("fill", "none")
      .attr("d", d => {
        const lineGen = d.type === 'taxa' ? lineTaxa : lineCount
        return lineGen(d.points.map(p => {
          return {
            accum: 0,
            week: p.week
          }
        }))
      })

    addEventHandlers(eLines)

    mlines.merge(eLines)
      .transition()
      .duration(duration)
      .attr("d", d => {
        const lineGen = d.type === 'taxa' ? lineTaxa : lineCount
        return lineGen(d.points)
      })
      .attr("stroke", d => d.colour)
      .attr("stroke-dasharray", d => d.style === 'dashed' ? '5,5' : '')
      .attr("stroke-width", d => d.strokeWidth)

    mlines.exit()
      .transition()
      .duration(duration)
      .attr("d", d => {
        const lineGen = d.type === 'taxa' ? lineTaxa : lineCount
        return lineGen(d.points.map(p => {
          return {
            accum: 0,
            week: p.week
          }
        }))
      })
      .remove()

    if (init) {
      const axisLeftPadX = margin.left ? margin.left : 0
      const axisRightPadX = margin.right ? margin.right : 0
      const axisBottomPadY = margin.bottom ? margin.bottom : 0
      const axisTopPadY = margin.top ? margin.top : 0

      // Size SVG
      svgAccum
        .attr('width', width + axisLeftPadX + axisRightPadX)
        .attr('height', height + axisBottomPadY + axisTopPadY + legendHeight)

      // Position chart
      gAccum.attr("transform", `translate(${axisLeftPadX},${legendHeight + axisTopPadY})`)

      // Create axes and position within SVG
      const leftYaxisTrans = `translate(${axisLeftPadX},${legendHeight + axisTopPadY})`
      const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${legendHeight + axisTopPadY + height/2}) rotate(270)`
      const rightYaxisTrans = `translate(${axisLeftPadX + width}, ${legendHeight + axisTopPadY})`
      const rightYaxisLabelTrans = `translate(${axisLeftPadX + width + axisRightPadX - axisLabelFontSize}, ${legendHeight + axisTopPadY + height/2}) rotate(90)`

      if (yAxisLeft) {
        const axisLabelClass = swapYaxes ? 'brc-accum-axis-count' : 'brc-accum-axis-taxa'
        const gYaxisLeft = svgAccum.append("g")
          .attr("class", "y-axis y-axis-left")
          .classed(axisLabelClass, true)
        gYaxisLeft.attr("transform", leftYaxisTrans)

        if ((!swapYaxes && showTaxa) || (swapYaxes && showCounts )) {
          const axisLeftLabel = swapYaxes ? axisCountLabel : axisTaxaLabel
          const tYaxisLeftLabel = svgAccum.append("text")
            .classed(axisLabelClass, true)
            .style("text-anchor", "middle")
            .style('font-size', axisLabelFontSize)
            .text(axisLeftLabel)
          tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans)
        }
      }

      if (yAxisRight) {
        const axisLabelClass = swapYaxes ? 'brc-accum-axis-taxa' : 'brc-accum-axis-count'
        const gYaxisCount = svgAccum.append("g")
          .attr("class", "y-axis y-axis-right")
          .classed(axisLabelClass, true)
        gYaxisCount.attr("transform", rightYaxisTrans)

        if ((!swapYaxes && showCounts) || (swapYaxes && showTaxa )) {
          const axisRightLabel = swapYaxes ? axisTaxaLabel : axisCountLabel
          const tYaxisCountLabel = svgAccum.append("text")
            .classed(axisLabelClass, true)
            .style("text-anchor", "middle")
            .style('font-size', axisLabelFontSize)
            .text(axisRightLabel)
          tYaxisCountLabel.attr("transform", rightYaxisLabelTrans)
        }
      }

      if (xAxis) {
        const gXaxis = svgAccum.append("g")
          .attr("class", "x axis")
          .call(xAxis)

        gXaxis.selectAll(".tick text")
          .style("text-anchor", "start")
          .attr("x", 6)
          .attr("y", 6)

        gXaxis.attr("transform", `translate(${axisLeftPadX},${legendHeight + axisTopPadY + height})`)
      }
      if (tAxis) {
        const gTaxis = svgAccum.append("g")
          .call(tAxis)
        gTaxis.attr("transform", `translate(${axisLeftPadX},${legendHeight + axisTopPadY})`)
      }
    }

    if (yAxisLeft) {
      svgAccum.select(".y-axis-left")
        .transition()
        .duration(duration)
        .call(yAxisLeft)
    }

    if (yAxisRight) {
      svgAccum.select(".y-axis-right")
        .transition()
        .duration(duration)
        .call(yAxisRight)
    }

    svgChart.attr("width", svgAccum.attr('width'))
    svgChart.attr("height", svgAccum.attr('height'))

    return svgAccum
  }

  function makeLegend (lineData) {

    const legendWidth = width + margin.left + margin.right
    const swatchSize = 20
    const swatchFact = 1.3

    // Loop through all the legend elements and work out their positions
    // based on swatch size, item label text size and legend width.
    const metricsReversed = gen.cloneData(lineData).reverse()

    let rows = 0
    let lineWidth = -swatchSize
    metricsReversed.forEach(m => {
      const tmpText = svgChart.append('text')
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
      .data(metricsReversed, m => m.key)
      .join(enter => {
          const path = enter.append("path")
            .attr("class", m => `brc-legend-item brc-legend-item-rect brc-legend-item-${m.key}`)
            .attr('d', m => `M ${m.x} ${m.y + swatchSize/2} L ${m.x + swatchSize} ${m.y + swatchSize/2}`)
          return path
      })
      .attr('fill', m => m.colour)
      .attr("stroke", m => m.colour)
      .attr("stroke-dasharray", m => m.style === 'dashed' ? '5,5' : '')
      .attr("stroke-width", m => m.strokeWidth)

    const lt = svgChart.selectAll('.brc-legend-item-text')
      .data(metricsReversed, m => m.key)
      .join(
        enter => {
          const text = enter.append("text")
            .attr("class", m=> `brc-legend-item brc-legend-item-text brc-legend-item-${m.key}`)
            .style('font-size', legendFontSize)
          return text
        })
      .text(m => m.label)
      .attr('x', m => m.x + swatchSize * swatchFact)
      .attr('y', m => m.y + legendFontSize * 1)

    addEventHandlers(ls)
    addEventHandlers(lt)

    return swatchSize * swatchFact * (rows + 1)
  }

  function highlightItem(key, type, highlight) {

    // Graph lines
    svgChart.selectAll('.accum-path')
      .classed('lowlight', highlight)

    svgChart.selectAll(`.accum-path-${key}`)
      .classed('lowlight', false)

    svgChart.selectAll(`.accum-path`)
      .classed('highlight', false)

    if (key) {
      svgChart.selectAll(`.accum-path-${key}`)
        .classed('highlight', highlight)
    }

    // Legend items
    svgChart.selectAll('.brc-legend-item')
      .classed('lowlight', highlight)

    if (key) {
      svgChart.selectAll(`.brc-legend-item-${key}`)
        .classed('lowlight', false)
    }

    if (key) {
      svgChart.selectAll(`.brc-legend-item-${key}`)
        .classed('highlight', highlight)
    } else {
      svgChart.selectAll(`.brc-legend-item`)
        .classed('highlight', false)
    }

    // Axes and axis labels
    svgChart.selectAll('.brc-accum-axis-taxa, .brc-accum-axis-count')
      .classed('lowlight', highlight)

    if (key) {
      svgChart.selectAll(`.brc-accum-axis-${type}`)
        .classed('lowlight', false)
    }

    if (key) {
      svgChart.selectAll(`.brc-accum-axis-${type}`)
        .classed('highlight', highlight)
    } else {
      svgChart.selectAll(`.brc-accum-axis-taxa, .brc-accum-axis-count`)
        .classed('highlight', false)
    }
  }

  function addEventHandlers(sel) {
    sel
      .on("mouseover", function(d) {
        if (interactivity === 'mousemove') {
          highlightItem(d.key, d.type, true)
        }
      })
      .on("mouseout", function(d) {
        if (interactivity === 'mousemove') {
          highlightItem(d.key,  d.type, false)
        }
      })
      .on("click", function(d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d.key, d.type, true)
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
  * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
  * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
  * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
  * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
  * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
  * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
  * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
  * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
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

    if ('metrics' in opts) {
      metrics = opts.metrics
      preProcessMetrics()
      remakeChart = true
    }

    if (remakeChart) makeChart()
    gen.positionMainElements(svg, expand)
  }


/** @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

/** @function saveImage
  * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
  * @param {string} filename - Name of the file (without extension) to generate and download.
  * If the filename is falsey (e.g. blank), it will not automatically download the
  * file. (Allows caller to do something else with the data URL which is returned
  * as the promise's resolved value.)
  * @returns {Promise} promise object represents the data URL of the image.
  * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
  * Download the chart as an image file.
  */
  function saveImage(asSvg, filename, info){
    return gen.saveChartImage(svg, expand, asSvg, filename, null, info)
  }

  /**
   * @typedef {Object} api
   * @property {module:accum~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:accum~getChartHeight} getChartHeight - Gets and returns the current height of the chart.
   * @property {module:accum~setChartOpts} setChartOpts - Sets text options for the chart.
   * @property {module:accum~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts.
   * @property {module:accum~saveImage} saveImage - Generates and downloads and image file for the SVG.
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    saveImage: saveImage
  }

}