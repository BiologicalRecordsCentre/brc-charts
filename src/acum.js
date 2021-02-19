/** @module acum */

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
 * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
 * data for which a line should be generated on the chart.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>prop</b> - the name of the numeric property in the data (count properties - 'c1' or 'c2' in the example below).
 * <li> <b>label</b> - a label for this metric.
 * <li> <b>colour</b> - optional colour to give the line for this metric. Any accepted way of specifying web colours can be used. Fading
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
 * @returns {module:acum~api} api - Returns an API for the chart.
 */

export function acum({
  // Default options in here
  selector = 'body',
  elid = 'phen1-chart',
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
  axisRight = 'tick',
  axisTop = '',
  duration = 1000,
  interactivity = 'mousemove',
  data = [],
  taxa = [],
  metrics = []
} = {}) {

  let metricsPlus

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-acum')
    .style('position', 'relative')
    .style('display', 'inline')

  const svg = mainDiv.append('svg')
  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(null, false)
    }
  })

  const svgChart = svg.append('svg').attr('class', 'mainChart')
  
  preProcessMetrics()
  makeChart()

  // Texts must come after chartbecause 
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width"))
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand)

  function preProcessMetrics () {
    // Look for 'fading' colour in taxa and colour appropriately 
    // in fading shades of grey.
    
    let iFading = 0
    metricsPlus = metrics.map(m => {
      let iFade, strokeWidth
      if (m.colour === 'fading') {
        iFade = ++iFading
        strokeWidth = 1
      } else {
        strokeWidth = 2
      }
      return {
        prop: m.prop,
        label: m.label,
        colour: m.colour,
        fading: iFade,
        strokeWidth: strokeWidth
      }
    }).reverse()

    const grey = d3.scaleLinear()
      .range(['#808080', '#E0E0E0'])
      .domain([1, iFading])

    metricsPlus.forEach(m => {
      if (m.fading) {
        m.colour = grey(m.fading)
      }
    })
  }

  function makeChart () {

    console.log(metricsPlus)

    let lineData = [] 
    metricsPlus.forEach(m => {

      const pointsTaxa = []
      const pointsCount = []
      let acumTaxa = []
      let acumCount = 0

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

        acumTaxa = [...new Set([...acumTaxa, ...weekStats.taxa])]
        acumCount = acumCount + weekStats.total
        pointsTaxa.push({
          num: weekStats.taxa.length,
          acum: acumTaxa.length,
          week: week
        })
        pointsCount.push({
          num: weekStats.total,
          acum: acumCount,
          week: week
        })
      }

      lineData.push({
        id: `${gen.safeId(m.label)}-taxa`,
        type: 'taxa',
        colour: m.colour,
        strokeWidth: m.strokeWidth,
        max: Math.max(...pointsTaxa.map(p => p.acum)),
        points: pointsTaxa
      })

      lineData.push({
        id: `${gen.safeId(m.label)}-count`,
        type: 'count',
        colour: m.colour,
        strokeWidth: m.strokeWidth,
        max: Math.max(...pointsCount.map(p => p.acum)),
        points: pointsCount
      })
    })

    console.log(lineData)
     
    // Value scales
    const xScale = d3.scaleLinear().domain([1, 53]).range([0, width])
    const yScaleCount = d3.scaleLinear().domain([0, Math.max(...lineData.filter(l => l.type ==='count').map(l => l.max))]).range([height, 0])
    const yScaleTaxa = d3.scaleLinear().domain([0, Math.max(...lineData.filter(l => l.type ==='taxa').map(l => l.max))]).range([height, 0])

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

    // Y count (right) axis
    let yAxisCount
    if (axisRight === 'on' || axisRight === 'tick') {
      yAxisCount = d3.axisRight()
        .scale(yScaleCount)
        .ticks(5)
      if (axisRight !== 'tick') {
        yAxisCount.tickValues([]).tickSizeOuter(0)
      } else if (ytype === 'count') {
        yAxisCount.tickFormat(d3.format("d"))
      }
    }

    // Y taxa (left) axis
    let yAxisTaxa
    if (axisLeft === 'on' || axisLeft === 'tick') {
      yAxisTaxa = d3.axisLeft()
        .scale(yScaleTaxa)
        .ticks(5)
      if (axisLeft !== 'tick') {
        yAxisTaxa.tickValues([]).tickSizeOuter(0)
      } else if (ytype === 'count') {
        yAxisTaxa.tickFormat(d3.format("d"))
      }
    }
    
    // Line path generators
    const lineTaxa = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.week))
      .y(d => yScaleTaxa(d.acum))

    const lineCount = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.week))
      .y(d => yScaleCount(d.acum))

    // Create or get the relevant chart svg
    let init, svgAcum, gAcum
    if (svgChart.select('.brc-chart-acum').size()) {
      svgAcum = svgChart.select('.brc-chart-acum')
      gAcum = svgAcum.select('.brc-chart-acum-g')
      init = false
    } else {
      svgAcum = svgChart.append('svg')
        .classed('brc-chart-acum', true)
      gAcum = svgAcum.append('g')
        .classed('brc-chart-acum-g', true)
      init = true
    }
    
    // Create/update the line paths with D3
    const mlines = gAcum.selectAll("path")
      .data(lineData,  d => d.id)
      
    const eLines = mlines.enter()
      .append("path")
      .attr("class", d => `phen-path-${d.id} acum-path`)
      .attr("stroke-dasharray", d => d.type === 'taxa' ? '5,5' : '')
      .attr("d", d => {
        const lineGen = d.type === 'taxa' ? lineTaxa : lineCount
        return lineGen(d.points.map(p => {
          return {
            acum: 0,
            week: p.week
          }
        }))
      })

    addEventHandlers(eLines, 'id')

    mlines.merge(eLines)
      .transition()
      .duration(duration)
      .attr("d", d => {
        const lineGen = d.type === 'taxa' ? lineTaxa : lineCount
        return lineGen(d.points)
      })
      .attr("stroke", d => d.colour)
      .attr("stroke-width", d => d.strokeWidth)

    mlines.exit()
      .transition()
      .duration(duration)
      .attr("d", d => {
        const lineGen = d.type === 'taxa' ? lineTaxa : lineCount
        return lineGen(d.points.map(p => {
          return {
            acum: 0,
            week: p.week
          }
        }))
      })
      .remove()

    if (init) {
      // Constants for positioning
      const axisLeftPadX = axisLeft === 'tick' ? 35 : 0
      const axisRightPadX = axisRight === 'tick' ? 45 : 0
      const axisPadY = axisBottom === 'tick' ? 15 : 0
      let labelPadY = 5

      // Size SVG
      svgAcum
        .attr('width', width + axisLeftPadX + axisRightPadX + 1)
        .attr('height', height + axisPadY + labelPadY + 1)


      // Position chart
      gAcum.attr("transform", `translate(${axisLeftPadX},${labelPadY})`)
      
      // Create axes and position within SVG
      if (yAxisTaxa) {
        const gYaxisTaxa = svgAcum.append("g")
          .attr("class", "y-axis-taxa")
        gYaxisTaxa.attr("transform", `translate(${axisLeftPadX},${labelPadY})`)
      }

      if (yAxisCount) {
        const gYaxisCount = svgAcum.append("g")
          .attr("class", "y-axis-count")
        gYaxisCount.attr("transform", `translate(${axisLeftPadX + width},${labelPadY})`)
      }

      if (xAxis) {
        const gXaxis = svgAcum.append("g")
          .attr("class", "x axis")
          .call(xAxis)

        gXaxis.selectAll(".tick text")
          .style("text-anchor", "start")
          .attr("x", 6)
          .attr("y", 6)

        gXaxis.attr("transform", `translate(${axisLeftPadX},${height + labelPadY})`)
      }
      if (tAxis) {
        const gTaxis = svgAcum.append("g")
          .call(tAxis)
        gTaxis.attr("transform", `translate(${axisLeftPadX},${labelPadY})`)
      }
    }

    if (yAxisTaxa) {
      svgAcum.select(".y-axis-taxa")
        .transition()
        .duration(duration)
        .call(yAxisTaxa)
    }

    if (yAxisCount) {
      svgAcum.select(".y-axis-count")
        .transition()
        .duration(duration)
        .call(yAxisCount)
    }

    svgChart.attr("width", svgAcum.attr('width'))
    svgChart.attr("height", svgAcum.attr('height'))

    return svgAcum
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

    svgChart.selectAll('.phen-path')
      .classed('lowlight', highlight)

    svgChart.selectAll(`.phen-path-${gen.safeId(id)}`)
      .classed('lowlight', false)
  
    svgChart.selectAll(`.phen-path`)
      .classed('highlight', false)

    if (gen.safeId(id)) {
      svgChart.selectAll(`.phen-path-${gen.safeId(id)}`)
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
  * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
  * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
  * @description <b>This function is exposed as a method on the API returned from the acum function</b>.
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

    if ('metrics' in opts) {
      metrics = opts.metrics
      preProcessMetrics()
      remakeChart = true
    }

    if (remakeChart) makeChart()
    gen.positionMainElements(svg, expand)
  }

/** @function setTaxon
  * @param {string} opts.taxon - The taxon to display.
  * @description <b>This function is exposed as a method on the API returned from the acum function</b>.
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
  * @description <b>This function is exposed as a method on the API returned from the acum function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the acum function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

  /**
   * @typedef {Object} api
   * @property {module:acum~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:acum~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:acum~setChartOpts} setChartOpts - Sets text options for the chart. 
   * @property {module:acum~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon
  }

}