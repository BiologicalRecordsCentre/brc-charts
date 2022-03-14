/** @module yearly */

import * as d3 from 'd3'
import * as gen from './general'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG. (Default - 'body'.)
 * @param {string} opts.elid - The id for the dom object created. (Default - 'yearly-chart'.)
 * @param {number} opts.width - The width of each sub-chart area in pixels. (Default - 300.)
 * @param {number} opts.height - The height of the each sub-chart area in pixels. (Default - 200.)
 * @param {Object} opts.margin - An object indicating the margins to add around each sub-chart area.
 * @param {number} opts.margin.left - Left margin in pixels. (Default - 40.)
 * @param {number} opts.margin.right - Right margin in pixels. (Default - 40.)
 * @param {number} opts.margin.top - Top margin in pixels. (Default - 20.)
 * @param {number} opts.margin.bottom - Bottom margin in pixels. (Default - 20.)
 * @param {number} opts.perRow - The number of sub-charts per row. (Default - 2.)
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized. (Default - false.)
 * @param {string} opts.title - Title for the chart. (Default - ''.)
 * @param {string} opts.subtitle - Subtitle for the chart. (Default - ''.)
 * @param {string} opts.footer - Footer for the chart. (Default - ''.)
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title. (Default - 24.)
 * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle. (Default - 16.)
 * @param {string} opts.footerFontSize - Font size (pixels) of chart footer. (Default - 10.)
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'. (Default - 'left'.)
 * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'. (Default - 'left'.)
 * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'. (Default - 'left'.)
 * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph. (Default - true.)
 * @param {boolean} opts.showLegend - Whether or not to show an overall chart legend. (Default - true.)
 * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label. (Default - 10.)
 * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.(Default - true.)
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text. (Default - 16.)
 * @param {string} opts.axisLeftLabel - Value for labelling left axis. (Default - ''.)
 * @param {string} opts.axisRightLabel - Value for labelling right axis. (Default - ''.)
 * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
 * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. 
 * If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'count'.)
 * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. 
 * If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - ''.)
 * @param {string} opts.axisTop - If set to 'on' line is drawn otherwise not. (Default - ''.)
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'tick'.)
 * @param {number} opts.headPad - A left hand offset, in pixels, for title, subtitle, legend and footer. (Default 0.)
 * @param {number} opts.duration - The duration of each transition phase in milliseconds. (Default - 1000.)
 * @param {string} opts.showCounts - The type of the graphic 'bar' for a barchart and 'line' for a line graph. (Default - 'bar'.)
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'. (Default - 'none'.)
 * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
 * data for which graphics should be generated on the chart.
 * Each of the objects in the data array can be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>prop</b> - the name of the numeric property in the data (count properties - 'c1' or 'c2' in the example below).
 * <li> <b>label</b> - a label for this metric. (Optional - the default label will be the property name.)
 * <li> <b>colour</b> - optional colour to give the graphic for this metric. Any accepted way of 
 * specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
 * (Optional - default is 'blue'.)
 * <li> <b>opacity</b> - optional opacity to give the graphic for this metric. 
 * (Optional - default is 0.5.)
 * <li> <b>linewidth</b> - optional width of line for line for this metric if displayed as a line graph. 
 * (Optional - default is 1.)
 * </ul>
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>year</b> - a four digit number indicating a year.
 * <li> <b>c1</b> - a count for a given time year (can have any name). 
 * <li> <b>c2</b> - a count for a given time year (can have any name).
 * ... - there must be at leas one count column, but there can be any number of them.
 * </ul>
 * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
 * If empty, graphs for all taxa are created. (Default - [].)

 * @param {number} opts.minYear Indicates the earliest year to use on the y axis. If left unset, the earliest year in the dataset is used. (Default - null.)
 * @param {number} opts.maxYear Indicates the latest year to use on the y axis. If left unset, the latest year in the dataset is used. (Default - null.)
 * @returns {module:yearly~api} api - Returns an API for the chart.
 */

export function yearly({
  // Default options in here
  selector = 'body',
  elid = 'yearly-chart',
  width = 300,
  height = 200,
  margin = {left: 30, right: 30, top: 15, bottom: 20},
  perRow = 2,
  expand = false,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 10,
  legendFontSize = 16,
  showLegend = false,
  axisLeftLabel = '',
  axisRightLabel = '',
  axisLabelFontSize = 10,
  titleAlign = 'left',
  subtitleAlign = 'left',
  footerAlign = 'left',
  showTaxonLabel = true,
  taxonLabelFontSize = 10,
  taxonLabelItalics = false,
  axisLeft = 'tick',
  axisBottom = 'tick',
  axisRight = '',
  axisTop = '',
  showCounts = 'bar', 
  headPad = 0,
  duration = 1000,
  interactivity = 'none',
  data = [],
  taxa = [],
  metrics = [],
  minYear = null,
  maxYear = null,
} = {}) {

  let metricsPlus

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

  const svgChart = svg.append('svg').attr('class', 'mainChart brc-chart-yearly')
  
  preProcessMetrics()
  makeChart()
  // Texts must come after chartbecause 
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width") - headPad)
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand, headPad)

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

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makeYearly(t))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    const legendHeight = showLegend ? makeLegend(perRow * (subChartWidth + subChartPad) - headPad) + subChartPad : 0

    svgsTaxa.forEach((svgTaxon, i) => {
      
      const col = i%perRow
      const row = Math.floor(i/perRow)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad))
      svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight)
    })

    svgChart.attr("width", perRow * (subChartWidth + subChartPad))
    svgChart.attr("height", legendHeight +  Math.ceil(svgsTaxa.length/perRow) * (subChartHeight + subChartPad))
  }

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
        strokeWidth = m.linewidth ? m.linewidth : 2
      }
      return {
        prop: m.prop,
        label: m.label ?  m.label : m.prop,
        opacity: m.opacity ? m.opacity : 0.5,
        colour: m.colour ? m.colour : 'blue',
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

  function makeYearly (taxon) {

    // Pre-process data.
    // Filter to named taxon and to min and max year and sort in year order
    // Add max value to each.

    const dataFiltered = data
      .filter(d => d.taxon === taxon && d.year >= minYear && d.year <= maxYear)
      .sort((a, b) => (a.year > b.year) ? 1 : -1)

    // Set the maximum values for the y axis
    const maxCounts = metricsPlus.map(m => Math.max(...dataFiltered.map(d => d[m.prop])))
    let yMaxCount = Math.max(...maxCounts)
    yMaxCount = yMaxCount < 5 ? 5 : yMaxCount // Prevents tiny values

    // Value scales
    let years = []
    for (let i = minYear; i <= maxYear; i++) {
      years.push(i)
    }
    const xScaleBar = d3.scaleBand().domain(years).range([0, width]).paddingInner(0.1)
    const xScaleLine = d3.scaleLinear().domain([minYear, maxYear]).range([0, width])
    const yScaleCount = d3.scaleLinear().domain([0, yMaxCount]).range([height, 0])
   
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
      bAxis = gen.xAxisYear(width, axisBottom === 'tick', minYear, maxYear, showCounts === 'bar')
    }

    const makeXaxis = (leftRight, axisOpt) => {
      let axis
      const d3axis = leftRight === 'left' ? d3.axisLeft() : d3.axisRight()
      switch(axisOpt) {
        case 'on':
          axis = d3axis.scale(yScaleCount).tickValues([]).tickSizeOuter(0)
          break
        case 'tick':
          axis = d3axis.scale(yScaleCount).ticks(5).tickFormat(d3.format("d"))
          break
      }
      return axis
    }
    const lAxis = makeXaxis('left', axisLeft)
    const rAxis = makeXaxis('right', axisRight)

    // Create or get the relevant chart svg
    let init, svgYearly, gYearly
    if (taxa.length === 1 && svgChart.selectAll('.brc-chart-yearly').size() === 1) {
      svgYearly = svgChart.select('.brc-chart-yearly')
      gYearly = svgYearly.select('.brc-chart-yearly-g')
      init = false
    } else if (svgChart.select(`#${gen.safeId(taxon)}`).size()) {
      svgYearly = svgChart.select(`#${gen.safeId(taxon)}`)
      gYearly = svgYearly.select('.brc-chart-yearly-g')
      init = false
    } else {
      svgYearly = svgChart.append('svg')
        .classed('brc-chart-yearly', true)
        .attr('id', gen.safeId(taxon))
        .style('overflow', 'visible')
      gYearly = svgYearly.append('g')
        .classed('brc-chart-yearly-g', true)
      init = true
    }

    // Line path generators
    const lineCounts = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScaleLine(d.year))
      .y(d => yScaleCount(d.n))

    const chartLines = []
    let chartBars = []

    metricsPlus.forEach(m => {

      const dataDict = dataFiltered.reduce((a,d) => {
        a[d.year]=d[m.prop]
        return a
      }, {})
      if (showCounts === 'line') {
        chartLines.push({
          lineGen: lineCounts,
          colour: m.colour,
          opacity: m.opacity,
          strokeWidth: m.strokeWidth,
          type: 'counts',
          prop: m.prop,
          points: years.map(y => {
            return {
              year: y,
              n: dataDict[y] ? dataDict[y] : 0,
            }
          })
        })
      }
  
      if (showCounts === 'bar') {
        const bars = dataFiltered.map(d => {
          return {
            yScale: yScaleCount,
            colour: m.colour,
            opacity: m.opacity,
            type: 'counts',
            prop: m.prop,
            year: d.year,
            n: yScaleCount(d[m.prop]),
          }
        })
        chartBars = [...chartBars, ...bars]
      }
    })

    const t = svgYearly.transition()
        .duration(duration)

    gYearly.selectAll("rect")
      .data(chartBars, d => `props-${d.year}`)
      .join(
        enter => enter.append("rect")
          .attr("class", d => `yearly-graphic yearly-${d.prop}`)
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
            .attr('y', height)
            .remove())
      ).transition(t)
        // The selection returned by the join function is the merged
        // enter and update selections
        .attr('y', d => d.n)
        .attr('x', d => xScaleBar(d.year))
        .attr('height', d => height - d.n)
        .attr('width', xScaleBar.bandwidth())
        .attr("fill", d => d.colour)
  
    gYearly.selectAll("path")
      .data(chartLines, d => d.type)
      .join(
        enter => enter.append("path")
          .attr("class", d => `yearly-graphic yearly-${d.prop}`)
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

    addEventHandlers(gYearly.selectAll("path"), 'prop')
    addEventHandlers(gYearly.selectAll("rect"), 'prop')
        
    if (init) {

      // Constants for positioning
      const axisLeftPadX = margin.left ? margin.left : 0
      const axisRightPadX = margin.right ? margin.right : 0
      const axisBottomPadY = margin.bottom ? margin.bottom : 0
      const axisTopPadY = margin.top ? margin.top : 0

      // Taxon title
      if (showTaxonLabel) {
        const taxonLabel = svgYearly
          .append('text')
          .classed('brc-chart-yearly-label', true)
          .text(taxon)
          .style('font-size', taxonLabelFontSize)
          .style('font-style', taxonLabelItalics ? 'italic' : '')

        const labelHeight = taxonLabel.node().getBBox().height
        taxonLabel.attr("transform", `translate(${axisLeftPadX}, ${labelHeight})`)
      }
      
       // Size SVG
      svgYearly
        .attr('width', width + axisLeftPadX + axisRightPadX)
        .attr('height', height + axisBottomPadY + axisTopPadY)

      // Position chart
      gYearly.attr("transform", `translate(${axisLeftPadX},${axisTopPadY})`)
      
      // Create axes and position within SVG
      const leftYaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
      const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${axisTopPadY + height/2}) rotate(270)`
      const rightYaxisTrans = `translate(${axisLeftPadX + width}, ${axisTopPadY})`
      const rightYaxisLabelTrans = `translate(${axisLeftPadX + width + axisRightPadX - axisLabelFontSize}, ${axisTopPadY + height/2}) rotate(90)`
      const topXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
      const bottomXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY + height})`

      // Create axes and position within SVG
      if (lAxis) {
        const gLaxis = svgYearly.append("g")
          .attr("class", "l-axis")
          // .classed('yearly-type-counts',  axisLeft === 'tick')
          // .classed('yearly-type-props',  axisLeft !== 'tick')
        gLaxis.attr("transform", leftYaxisTrans)
      }
      if (bAxis) {
        const gBaxis = svgYearly.append("g")
          .attr("class", "x axis")
          .call(bAxis)
        gBaxis.attr("transform", bottomXaxisTrans)
      }
      if (tAxis) {
        const gTaxis = svgYearly.append("g")
          .call(tAxis)
        gTaxis.attr("transform", topXaxisTrans)
      }
      if (rAxis) {
        const gRaxis = svgYearly.append("g")
          //.call(rAxis)
          .attr("class", "r-axis")
          // .classed('yearly-type-counts',  axisRight === 'tick')
          // .classed('yearly-type-props',  axisRight !== 'tick')
        gRaxis.attr("transform", rightYaxisTrans)
      }

      const tYaxisLeftLabel = svgYearly.append("text")
        // .classed('yearly-type-counts',  axisLeft === 'tick')
        // .classed('yearly-type-props',  axisLeft !== 'tick')
        .style("text-anchor", "middle")
        .style('font-size', axisLabelFontSize)
        .text(axisLeftLabel) 
      tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans)

      const tYaxisRightLabel = svgYearly.append("text")
        // .classed('yearly-type-counts',  axisRight === 'tick')
        // .classed('yearly-type-props',  axisRight !== 'tick')
        .style("text-anchor", "middle")
        .style('font-size', axisLabelFontSize)
        .text(axisRightLabel) 
      tYaxisRightLabel.attr("transform", rightYaxisLabelTrans)

    } else {
      if (taxa.length === 1) {
        // Update taxon label
        if (showTaxonLabel) {
          svgYearly.select('.brc-chart-yearly-label').text(taxon)
        }
      }

      // Update the bottom axis if it exists. We do this because
      // yearMin and/or yearMax may have changed.
      if (axisBottom === 'on' || axisBottom === 'tick') {
        svgYearly.select(".x.axis").selectAll('*').remove()
        svgYearly.select(".x.axis").call(bAxis)
      }
    }

    if (svgYearly.selectAll(".l-axis").size()){
      svgYearly.select(".l-axis")
      .transition()
      .duration(duration)
      .call(lAxis)
    }

    if (svgYearly.selectAll(".r-axis").size()){
      svgYearly.select(".r-axis")
      .transition()
      .duration(duration)
      .call(rAxis)
    }
    
    return svgYearly
  }

  function makeLegend (legendWidth) {
    
    const swatchSize = 15
    const swatchFact = 1.3

    // Loop through all the legend elements and work out their
    // positions based on swatch size, item label text size and
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
      m.x = lineWidth + swatchSize + headPad
      m.y = rows * swatchSize * swatchFact

      lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText
    })

    const ls = svgChart.selectAll('.brc-legend-item-rect')
      .data(metricsReversed, m => gen.safeId(m.label))
      .join(enter => {
          const rect = enter.append("rect")
            .attr("class", m=> `brc-legend-item brc-legend-item-rect yearly-graphic yearly-${m.prop}`)
            .attr('width', swatchSize)
            .attr('height', showCounts === 'bar' ? swatchSize : 2)
          return rect
      })
      .attr('x', m => m.x)
      .attr('y', m => showCounts === 'bar' ?  m.y + swatchSize/5 : m.y + swatchSize/2)
      .attr('fill', m => m.colour)

    const lt = svgChart.selectAll('.brc-legend-item-text')
      .data(metricsReversed, m => gen.safeId(m.label))
      .join(enter => {
          const text = enter.append("text")
            .attr("class", m=> `brc-legend-item brc-legend-item-text yearly-graphic yearly-${m.prop}`)
            .text(m => m.label)
            .style('font-size', legendFontSize)
          return text
      })
      .attr('x', m => m.x + swatchSize * swatchFact)
      .attr('y', m => m.y + legendFontSize * 1)

    addEventHandlers(ls, 'prop')
    addEventHandlers(lt, 'prop')

    return swatchSize * swatchFact * (rows + 1)
  }

  function highlightItem(id, highlight) {

    svgChart.selectAll('.yearly-graphic')
      .classed('lowlight', false)

    if (highlight) {
      svgChart.selectAll('.yearly-graphic')
        .classed('lowlight', true)
      svgChart.selectAll(`.yearly-${id}`)
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
  * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
  * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
  * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
  * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
  * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
  * @param {number} opts.minYear Indicates the earliest year to use on the y axis.
  * @param {number} opts.maxYear Indicates the latest year to use on the y axis.
  * @param {Array.<Object>} opts.metrics - Specifies an array of metrics objects (see main interface for details).
  * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
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
    if ('minYear' in opts) {
      minYear = opts.minYear
    }
    if ('maxYear' in opts) {
      maxYear = opts.maxYear
    }
    if ('metrics' in opts) {
      metrics = opts.metrics
    }
    if ('data' in opts) {
      data = opts.data
    }

    const textWidth = Number(svg.select('.mainChart').attr("width"))
    gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
    gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
    gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)

    if ('data' in opts || 'minYear' in opts || 'maxYear' in opts || 'metrics' in opts) {
      preProcessMetrics()
      makeChart()
    }
    gen.positionMainElements(svg, expand)
  }

/** @function setTaxon
  * @param {string} opts.taxon - The taxon to display.
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
  * For single species charts, this allows you to change the taxon displayed.
  */
  function setTaxon(taxon){
    if (taxa.length !== 1) {
      console.log("You can only use the setTaxon method when your chart displays a single taxon.")
    } else {
      taxa = [taxon]
      highlightItem(null, false)
      makeChart()
    }
  }

/** @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

  /**
   * @typedef {Object} api
   * @property {module:yearly~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:yearly~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:yearly~setChartOpts} setChartOpts - Sets various options for the chart. 
   * @property {module:yearly~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon
  }

}