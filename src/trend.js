/** @module trend */

import * as d3 from 'd3'
import * as gen from './general'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of each sub-chart area in pixels.
 * @param {number} opts.height - The height of the each sub-chart area in pixels.
 * @param {Object} opts.margin - An object indicating the margins to add around each sub-chart area. 
 * @param {number} opts.margin.left - Left margin in pixels. 
 * @param {number} opts.margin.right - Right margin in pixels. 
 * @param {number} opts.margin.top - Top margin in pixels. 
 * @param {number} opts.margin.bottom - Bottom margin in pixels. 
 * @param {number} opts.perRow - The number of sub-charts per row.
 * @param {string} opts.colour - Colour to use for the line or bars. (Default - 'CornflowerBlue'.)
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
 * @param {boolean} opts.showLegend - Whether or not to show an overall chart legend. (Default = true.)
 * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label.
 * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
 * @param {string} opts.axisLeftLabel - Value for labelling left axis.
 * @param {string} opts.axisRightLabel - Value for labelling right axis.
 * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
 * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. 
 * If set to 'counts' line and ticks drawn for counts scale. If set to 'proportions' line and ticks drawn for proportions scale. 
 * If set to 'percentages' line and ticks drawn for proportions scale. Any other value results in no axis. (Default - 'percentages'.)
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. 
 * If set to 'counts' line and ticks drawn for counts scale. If set to 'proportions' line and ticks drawn for proportions scale. 
 * If set to 'percentages' line and ticks drawn for proportions scale. Any other value results in no axis. (Default - 'counts'.)
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

// TODO - document the following compound properties
// styleCounts: {colour: 'CornflowerBlue', opacity: 1, strokeWidth: 2, legend: 'Number of records'},
// styleProps: {colour: 'black', opacity: 1, strokeWidth: 2, legend: 'Percentage of all ladybird records'},

export function trend({
  // Default options in here
  selector = 'body',
  elid = 'trend-chart',
  width = 300,
  height = 200,
  margin = {left: 0, right: 0, top: 0, bottom: 0},
  perRow = 2,
  expand = false,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 10,
  legendFontSize = 16,
  showLegend = true,
  axisLeftLabel = '',
  axisRightLabel = '',
  axisLabelFontSize = 10,
  titleAlign = 'left',
  subtitleAlign = 'left',
  footerAlign = 'left',
  showTaxonLabel = true,
  taxonLabelFontSize = 16,
  taxonLabelItalics = false,
  axisLeft = 'counts',
  axisBottom = 'tick',
  axisRight = 'percentages',
  axisTop = '',
  //
  showCounts = 'bar', //bar line or anything else
  showProps = 'line', //bar line or anything else not 
  styleCounts = {colour: 'CornflowerBlue', opacity: 1},
  styleProps = {colour: 'black', opacity: 1, strokeWidth: 2},
  //
  duration = 1000,
  interactivity = 'mousemove',
  data = [],
  taxa = [],
  group = [],
  minYear = null,
  maxYear = null,
} = {}) {

  // Ensure style prop objects have the required properties.
  styleCounts.colour = styleCounts.colour ? styleCounts.colour : 'CornflowerBlue'
  styleCounts.opacity = styleCounts.opacity ? styleCounts.opacity : 1
  styleCounts.strokeWidth = styleCounts.strokeWidth ? styleCounts.strokeWidth : 2
  styleProps.colour = styleProps.colour ? styleProps.colour : 'black'
  styleProps.opacity = styleProps.opacity ? styleProps.opacity : 1
  styleProps.strokeWidth = styleProps.strokeWidth ? styleProps.strokeWidth : 2

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

  const svgChart = svg.append('svg').attr('class', 'mainChart brc-chart-trend')
  
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

    // If group for proportion/percentage data not set, set to all in dataset
    if (!group.length) {
      group = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    // Generate object with yearly totals
    const yearTotals = {}
    data
      .filter(d => group.indexOf(d.taxon) > -1 && d.year >= minYear && d.year <= maxYear)
      .forEach(d => {
        if (yearTotals[d.year]) {
          yearTotals[d.year] = yearTotals[d.year] + d.count
        } else {
          yearTotals[d.year] = d.count
        }
      })

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makeTrend(t, yearTotals))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    const legendHeight = showLegend ? makeLegend(perRow * (subChartWidth + subChartPad)) + subChartPad : 0

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

    // Pre-process data.
    // Filter to named taxon and to min and max year and sort in year order
    // Add max value to each.

    const dataFiltered = data
      .filter(d => d.taxon === taxon && d.year >= minYear && d.year <= maxYear)
      .sort((a, b) => (a.year > b.year) ? 1 : -1)

    // Set the maximum values for the y axis
    let yMaxProp = Math.max(...dataFiltered.map(d => d.count / yearTotals[d.year]))
    yMaxProp = yMaxProp < 0.005 ? 0.005 : yMaxProp // Prevents tiny values
    let yMaxCount = Math.max(...dataFiltered.map(d => d.count))

    // Value scales
    let years = []
    for (let i = minYear; i <= maxYear; i++) {
      years.push(i)
    }
    const xScaleBar = d3.scaleBand().domain(years).range([0, width]).paddingInner(0.1)
    const xScaleLine = d3.scaleLinear().domain([minYear, maxYear]).range([0, width])
    const yScaleCount = d3.scaleLinear().domain([0, yMaxCount]).range([height, 0])
    const yScaleProps = d3.scaleLinear().domain([0, yMaxProp]).range([height, 0])

    // Top axis
    let tAxis
    if (axisTop === 'on') {
      tAxis = d3.axisTop()
        .scale(xScaleLine) // Actual scale doesn't matter, but needs one
        .tickValues([])
        .tickSizeOuter(0)
    }

    // Bottom axis
    let bAxis
    if (axisBottom === 'on' || axisBottom === 'tick') {
      bAxis = gen.xAxisYear(width, axisBottom === 'tick', minYear, maxYear, (showCounts === 'bar' || showProps === 'bar'))
    }

    const makeXaxis = (leftRight, axisOpt) => {
      let axis
      const d3axis = leftRight === 'left' ? d3.axisLeft() : d3.axisRight()
      switch(axisOpt) {
        case 'on':
          axis = d3axis.scale(yScaleCount).tickValues([]).tickSizeOuter(0)
          break
        case 'counts':
          axis = d3axis.scale(yScaleCount).ticks(5).tickFormat(d3.format("d"))
          break
        case 'proportions':
          axis = d3axis.scale(yScaleProps).ticks(5)
          break
        case 'percentages':
          axis = d3axis.scale(yScaleProps).ticks(5).tickFormat(d3.format(".0%"))
          break
      }
      return axis
    }
    const lAxis = makeXaxis('left', axisLeft)
    const rAxis = makeXaxis('right', axisRight)

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

    // Line path generators
    const lineCounts = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScaleLine(d.year))
      .y(d => yScaleCount(d.n))

    const lineProps = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScaleLine(d.year))
      .y(d => yScaleProps(d.n))

    const chartLines = []
    if (showCounts === 'line') {
      chartLines.push({
        lineGen: lineCounts,
        colour: styleCounts.colour,
        opacity: styleCounts.opacity,
        strokeWidth: styleCounts.strokeWidth,
        type: 'counts',
        points: dataFiltered.map(d => {
          return {
            year: d.year,
            n: d.count,
          }
        }) 
      })
    }
    if (showProps === 'line') {
      chartLines.push({
        lineGen: lineProps,
        colour: styleProps.colour,
        opacity: styleProps.opacity,
        strokeWidth: styleProps.strokeWidth,
        type: 'props',
        points: dataFiltered.map(d => {
          return {
            year: d.year,
            n: d.count / yearTotals[d.year],
          }
        }) 
      })
    }
    let chartBars = []
    if (showCounts === 'bar') {
      const bars = dataFiltered.map(d => {
        return {
          yScale: yScaleCount,
          colour: styleCounts.colour,
          opacity: styleCounts.opacity,
          type: 'counts',
          year: d.year,
          n: yScaleCount(d.count),
        }
      })
      chartBars = [...chartBars, ...bars]
    }
    if (showProps === 'bar') {
      const bars = dataFiltered.map(d => {
        return {
          yScale: yScaleProps,
          colour: styleProps.colour,
          opacity: styleProps.opacity,
          type: 'props',
          year: d.year,
          n: yScaleProps(d.count / yearTotals[d.year]),
        }
      })
      chartBars = [...chartBars, ...bars]
    }

    const t = svgTrend.transition()
        .duration(duration)

    const rects = gTrend.selectAll("rect")
      .data(chartBars, d => `props-${d.year}`)
      .join(
        enter => enter.append("rect")
          .attr("class", d => `trend-type-${d.type}`)
          .attr('width', xScaleBar.bandwidth())
          .attr('height', 0)
          .attr('fill', d => d.colour)
          .attr('opacity', d => d.opacity)
          .attr('y', height)
          .attr('x', d => xScaleBar(d.year)),
        update => update,
        exit => exit
          .call(exit => exit.transition(t)
            .attr('height', 0)
            .remove())
      ).transition(t)
        // The selection returned by the join function is the merged
        // enter and update selections
        .attr('y', d => d.n)
        .attr('height', d => height - d.n)
        .attr("fill", d => d.colour)
  
    const lines = gTrend.selectAll("path")
      .data(chartLines, d => d.type)
      .join(
        enter => enter.append("path")
          .attr("class", d => `trend-type-${d.type}`)
          .attr("opacity", d => d.opacity)
          .attr("stroke", d => d.colour)
          .attr("stroke-width", d => d.strokeWidth)
          .attr("d", d => {
            return d.lineGen(d.points.map(p => {
              return {
                n: 0,
                year: p.year
              }
            }))}),
        update => update,
        exit => exit
          .call(exit => exit.transition(t)
            .attr("d", d => {
              return d.lineGen(d.points.map(p => {
                return {
                  n: 0,
                  year: p.year
                }
              }))
            })
            .remove())
      ).transition(t)
        // The selection returned by the join function is the merged
        // enter and update selections
        .attr("d", d => d.lineGen(d.points))

    addEventHandlers(gTrend.selectAll("path"), 'type')
    addEventHandlers(gTrend.selectAll("rect"), 'type')
        
    if (init) {

      // Constants for positioning
      const axisLeftPadX = margin.left ? margin.left : 0
      const axisRightPadX = margin.right ? margin.right : 0
      const axisBottomPadY = margin.bottom ? margin.bottom : 0
      const axisTopPadY = margin.top ? margin.top : 0

      // Taxon title
      if (showTaxonLabel) {
        const taxonLabel = svgTrend
          .append('text')
          .classed('brc-chart-trend-label', true)
          .text(taxon)
          .style('font-size', taxonLabelFontSize)
          .style('font-style', taxonLabelItalics ? 'italic' : '')

        const labelHeight = taxonLabel.node().getBBox().height
        taxonLabel.attr("transform", `translate(${axisLeftPadX}, ${labelHeight})`)
      }
      
       // Size SVG
      svgTrend
        .attr('width', width + axisLeftPadX + axisRightPadX)
        .attr('height', height + axisBottomPadY + axisTopPadY)

      // Position chart
      gTrend.attr("transform", `translate(${axisLeftPadX},${axisTopPadY})`)
      
      // Create axes and position within SVG
      const leftYaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
      const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${axisTopPadY + height/2}) rotate(270)`
      const rightYaxisTrans = `translate(${axisLeftPadX + width}, ${axisTopPadY})`
      const rightYaxisLabelTrans = `translate(${axisLeftPadX + width + axisRightPadX - axisLabelFontSize}, ${axisTopPadY + height/2}) rotate(90)`
      const topXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
      const bottomXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY + height})`

      // Create axes and position within SVG
      if (lAxis) {
        const gLaxis = svgTrend.append("g")
          .attr("class", "y-axis")
          .classed('trend-type-counts',  axisLeft === 'counts')
          .classed('trend-type-props',  axisLeft !== 'counts')
        gLaxis.attr("transform", leftYaxisTrans)
      }
      if (bAxis) {
        const gBaxis = svgTrend.append("g")
          .attr("class", "x axis")
          .call(bAxis)
        gBaxis.attr("transform", bottomXaxisTrans)
      }
      if (tAxis) {
        const gTaxis = svgTrend.append("g")
          .call(tAxis)
        gTaxis.attr("transform", topXaxisTrans)
      }
      if (rAxis) {
        const gRaxis = svgTrend.append("g")
          .call(rAxis)
          .classed('trend-type-counts',  axisRight === 'counts')
          .classed('trend-type-props',  axisRight !== 'counts')
        gRaxis.attr("transform", rightYaxisTrans)
      }

      const tYaxisLeftLabel = svgTrend.append("text")
        .classed('trend-type-counts',  axisLeft === 'counts')
        .classed('trend-type-props',  axisLeft !== 'counts')
        .style("text-anchor", "middle")
        .style('font-size', axisLabelFontSize)
        .text(axisLeftLabel) 
      tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans)

      const tYaxisRightLabel = svgTrend.append("text")
        .classed('trend-type-counts',  axisRight === 'counts')
        .classed('trend-type-props',  axisRight !== 'counts')
        .style("text-anchor", "middle")
        .style('font-size', axisLabelFontSize)
        .text(axisRightLabel) 
      tYaxisRightLabel.attr("transform", rightYaxisLabelTrans)

    } else if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgTrend.select('.brc-chart-trend-label').text(taxon)
      }
    }

    if (svgTrend.selectAll(".y-axis").size()){
      svgTrend.select(".y-axis")
      .transition()
      .duration(duration)
      .call(lAxis)
    }
    
    return svgTrend
  }

  function makeLegend (legendWidth) {
    
    const swatchSize = 20
    const swatchFact = 1.3

    const items = []
    if (showCounts === 'line' || showCounts === 'bar') {
      items.push({
        colour: styleCounts.colour,
        opacity: styleCounts.opacity,
        graphic: showCounts,
        text: styleCounts.legend,
        type: 'counts'
      })
    }
    if (showProps === 'line' || showProps === 'bar') {
      items.push({
        colour: styleProps.colour,
        opacity: styleProps.opacity,
        graphic: showProps,
        text: styleProps.legend,
        type: 'props'
      })
    }

    // Loop through all the legend elements and work out their
    // positions based on swatch size, item label text size and
    // legend width.
    let rows = 0
    let lineWidth = -swatchSize
    items.forEach(i => {
      const tmpText = svgChart.append('text')
        .text(i.text)
        .style('font-size', legendFontSize)

      const widthText = tmpText.node().getBBox().width
      tmpText.remove()

      if (lineWidth + swatchSize + swatchSize * swatchFact + widthText > legendWidth) {
        ++rows
        lineWidth = -swatchSize
      }
      i.x = lineWidth + swatchSize
      i.y = rows * swatchSize * swatchFact

      lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText
    })
    
    const ls = svgChart.selectAll('.brc-legend-item-rect')
      .data(items, i => gen.safeId(i.label))
      .join(enter => {
          const rect = enter.append("rect")
            //.attr("class", i=> `brc-legend-item brc-legend-item-rect brc-legend-item-${gen.safeId(i.label)}`)
            .attr('class', i => `trend-type-${i.type}`)
            .attr('width', swatchSize)
            .attr('height', i => i.graphic === 'bar' ? swatchSize/2 : 2)
          return rect
      })
      .attr('x', i => i.x)
      .attr('y', i => i.graphic === 'bar' ? i.y + legendFontSize - swatchSize/2 : i.y + legendFontSize - 2)
      .attr('fill', i => i.colour)
      .attr('opacity', i => i.opacity)

    const lt = svgChart.selectAll('.brc-legend-item-text')
      .data(items, i => gen.safeId(i.label))
      .join(enter => {
          const text = enter.append("text")
            //.attr("class", i=> `brc-legend-item brc-legend-item-text brc-legend-item-${gen.safeId(i.label)}`)
            .attr('class', i => `trend-type-${i.type}`)
            .text(i => i.text)
            .style('font-size', legendFontSize)
          return text
      })
      .attr('x', i => i.x + swatchSize * swatchFact)
      .attr('y', i => i.y + legendFontSize * 1)

    addEventHandlers(ls, 'type')
    addEventHandlers(lt, 'type')

    return swatchSize * swatchFact * (rows + 1)
  }

  function highlightItem(id, highlight) {

    svgChart.selectAll('.trend-type-counts,.trend-type-props')
      .classed('lowlight', false)

    if (highlight) {
      svgChart.selectAll('.trend-type-counts,.trend-type-props')
        .classed('lowlight', true)
      svgChart.selectAll(`.trend-type-${id}`)
        .classed('lowlight', false)
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