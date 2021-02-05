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
  metrics = []
} = {}) {

  let metricsPlus

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-phen')
    .style('position', 'relative')
    .style('display', 'inline')


  const svg = mainDiv.append('svg')
  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(null, false)
    }
  })

  const svgChart = svg.append('svg')

  let svgTitle, svgSubtitle, svgFooter
  
  preProcessMetrics()
  makeChart()

  // Title must come after chart and legend because 
  // the chartis required to do wrapping for title
  svgTitle = makeText (title, svgTitle, 'titleText', titleFontSize, titleAlign)
  svgSubtitle = makeText (subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign)
  svgFooter = makeText (footer, svgFooter, 'footerText', footerFontSize, footerAlign)
  
  positionElements()

  function makeChart () {
    if (!taxa.length) {
      taxa = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makePhen(t))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    const legendHeight = makeLegend(perRow * (subChartWidth + subChartPad)) + subChartPad

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
        strokeWidth = 2
      }
      return {
        prop: m.prop,
        label: m.label,
        colour: m.colour,
        fading: iFade,
        strokeWidth: strokeWidth
      }
    })
    const grey = d3.scaleLinear()
      .range(['#E0E0E0', '#808080'])
      .domain([1, iFading])

    metricsPlus.forEach(m => {
      if (m.fading) {
        m.colour = grey(m.fading)
      }
    })

    console.log(metricsPlus)
  }

  function positionElements() {

    const space = 10
    const width = Number(svgChart.attr("width"))

    svgSubtitle.attr("y", Number(svgTitle.attr("height")))
    svgChart.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + space)
    svgFooter.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + space +  Number(svgChart.attr("height")))
  
    const height = Number(svgTitle.attr("height")) +
      Number(svgSubtitle.attr("height")) + 
      Number(svgChart.attr("height")) + 
      Number(svgFooter.attr("height")) +
      2 * space

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

    const chartWidth = Number(svgChart.attr("width"))
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
    metricsPlus.forEach(m => {
      lineData.push({
        id: gen.safeId(m.label),
        colour: m.colour,
        strokeWidth: m.strokeWidth,
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
      .x(d => xScale(d.week))
      .y(d => yScale(d.n))

    // Create or get the relevant chart svg
    let init, svgPhen1, gPhen1
    if (taxa.length === 1 && svgChart.selectAll('.brc-chart-phen1').size() === 1) {
      svgPhen1 = svgChart.select('.brc-chart-phen1')
      gPhen1 = svgPhen1.select('.brc-chart-phen1-g')
      init = false
    } else if (svgChart.select(`#${gen.safeId(taxon)}`).size()) {
      svgPhen1 = svgChart.select(`#${gen.safeId(taxon)}`)
      gPhen1 = svgPhen1.select('.brc-chart-phen1-g')
      init = false
    } else {
      svgPhen1 = svgChart.append('svg')
        .classed('brc-chart-phen1', true)
        .attr('id', gen.safeId(taxon))
      gPhen1 = svgPhen1.append('g')
        .classed('brc-chart-phen1-g', true)
      init = true
    }
    
    // Create/update the line paths with D3
    const mlines = gPhen1.selectAll("path")
      .data(lineData,  d => d.id)

    const eLines = mlines.enter()
      .append("path")
      .attr("class", d => `phen-path-${d.id} phen-path`)
      .attr("d", d => {
        return line(d.points.map(p => {
          return {
            n: 0,
            week: p.week
          }
        }))
      })

    addEventHandlers(eLines, 'id')

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
        const taxonLabel = svgPhen1
          .append('text')
          .classed('brc-chart-phen1-label', true)
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
    } else if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgPhen1.select('.brc-chart-phen1-label').text(taxon)
      }
    }

    svgPhen1.select(".y-axis")
      .transition()
      .duration(duration)
      .call(yAxis)

    return svgPhen1
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
    const uLegendItems = svgChart.selectAll('.brc-legend-item')
      .data(metricsReversed, m => gen.safeId(m.label))

    const eLegendItems = uLegendItems.enter()

    const items = eLegendItems.append('g')
      .classed('brc-legend-item', true)
      .attr('id', m => `brc-legend-item-${m.label}`)

    const ls = items.append('rect')
      .attr('width', swatchSize)
      .attr('height', 2)
      .attr('fill', m => m.colour)
      .attr('x', m => m.x)
      .attr('y', m => m.y + swatchSize/2)

    const lt = items.append('text')
      .text(m => m.label)
      .style('font-size', legendFontSize)
      .attr('x', m => m.x + swatchSize * swatchFact)
      .attr('y', m => m.y + taxonLabelFontSize)

    uLegendItems.exit()
      .remove()

    addEventHandlers(ls, 'label')
    addEventHandlers(lt, 'label')

    return swatchSize * swatchFact * (rows + 1)
  }

  function highlightItem(id, highlight) {

    svgChart.selectAll('.phen-path')
      .classed('lowlight', highlight)

    svgChart.selectAll(`.phen-path-${id}`)
      .classed('lowlight', false)
  
    svgChart.selectAll(`.phen-path`)
      .classed('highlight', false)

    if (id) {
      svgChart.selectAll(`.phen-path-${id}`)
        .classed('highlight', highlight)
    }
    
    svgChart.selectAll('.brc-legend-item')
      .classed('lowlight', highlight)

    svgChart.selectAll(`#brc-legend-item-${id}`)
      .classed('lowlight', false)

    if (id) {
      svgChart.select(`#brc-legend-item-${id}`)
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

    if ('data' in opts) {
      data = opts.data
      makeChart()
    }

    if ('normalize' in opts) {
      normalize = opts.normalize
      makeChart()
    }

    if ('metrics' in opts) {
      metrics = opts.metrics
      preProcessMetrics()
      makeChart()
    }

    if ('taxa' in opts) {
      taxa = opts.taxa
      makeChart()
    }

    //positionElements()
  }

/** @function setTaxon
  * @param {string} opts.taxon - The taxon to display.
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
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
   * @property {module:pie~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon
  }

}