/** @module phen2 */

import * as d3 from 'd3'
import { safeId, makeText, positionMainElements, saveChartImage, xAxisMonthNoText, xAxisMonthText, cloneData, transPromise } from './general'

/**
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of each sub-chart area in pixels.
 * @param {number} opts.height - The height of the each sub-chart area in pixels.
 * @param {number} opts.split - Set to true to split bands over seperate lines - defalt is false.
 * @param {number} opts.perRow - The number of sub-charts per row.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.subtitle - Subtitle for the chart.
 * @param {string} opts.footer - Footer for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
 * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
 * @param {string | number} opts.monthFontSize - Font size for month labels. Can be specified in any permitted SVG units. (Default - 12.)
 * @param {string } opts.font - Font to use for chart. (Default - sans-serif.)
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
 * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
 * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph.
 * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label.
 * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.
 * @param {boolean} opts.displayLegend - Indicates whether or not to display a legend. (Default - true.)
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
 * @param {string | number} opts.lineWidth - Sets the stroke-width of all lines on the chart. Can use any permitted SVG stroke-width units. (Default - 1.)
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisLeft - If set to 'on' line is drawn otherwise not.
 * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
 * @param {string} opts.axisTop- If set to 'on' line is drawn otherwise not.
 * @param {number} opts.headPad - A left hand offset, in pixels, for title, subtitle, legend and footer. (Default 0.)
 * @param {number} opts.chartPad - A left hand offset, in pixels, for the chart. (Default 0.)
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
 * @param {string} opts.backColour - Background colour of the chart. Any accepted way of specifying web colours can be used. (Default - white.)
 * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for.
 * If empty, graphs for all taxa are created.
 * @param {Array.<Object>} opts.metrics - An array of objects, each describing a property in the input
 * data for which a band should be generated on the chart.
 * Each of the objects in the metrics array must be sepecified with the properties shown below.
 * <ul>
 * <li> <b>prop</b> - the name of the property in the data (properties - 'p1' or 'p2' in the example below).
 * <li> <b>label</b> - a label for this property.
 * <li> <b>colour</b> - colour to give the band for this property. Any accepted way of specifying web colours can be used.
 * <li> <b>opacity</b> - Optional opacity to give the band for this property. A value between 0 and 1 - default is 1.
 * <li> <b>svg</b> - Optional string defining an SVG path of an icon to use in place of a colour swatch in the legend.
 * <li> <b>svgScale</b> - Optional number defining a scaling factor to apply to SVG icon (relative to others) - default is 1.
 * <li> <b>legendOrder</b> - Optional number used to sort the legend items. Low to high = left to right. If supplied, it
 * should be supplied for all metrics items otherwise results undefined. If not defined, default is to reverse the order.
 * Numbering should start at one and increase in increments of 1. For split bands it is also used to position the bands
 * from top to bottom
 * </ul>
 * The order in which the metrics are specified determines the order in which properties are drawn on the chart. Each is
 * drawn over the previous so for overlapping properties (split = false), the one you want to draw on top should
 * come last.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below.
 * There should only be one object per taxon. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>p1</b> - an array of date band objects (see below), indicating start and end weeks for the property (can have any name).
 * <li> <b>p2</b> - an array of date band objects (see below), indicating start and end weeks for the property (can have any name).
 * ... - there must be at leas one property column, but there can be any number of them.
 * </ul>
 * The objects in each data band array have the following structure:
 * <ul>
 * <li> <b>start</b> - a number between 1 and 365 indicating the day of the year the band starts.
 * <li> <b>end</b> - a number between 1 and 365 indicating the day of the year the band ends.
*  </ul>
 * @returns {module:phen2~api} api - Returns an API for the chart.
 */

export function phen2({
  // Default options in here
  selector = 'body',
  elid = 'phen2-chart',
  width = 300,
  height = 30,
  split = false,
  perRow = 2,
  expand = false,
  title = '',
  subtitle = '',
  footer = '',
  font = 'sans-serif',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 10,
  legendFontSize = 16,
  displayLegend = true,
  monthFontSize = 12,
  titleAlign = 'left',
  subtitleAlign = 'left',
  footerAlign = 'left',
  showTaxonLabel = true,
  taxonLabelFontSize = 16,
  taxonLabelItalics = false,
  axisBottom = 'tick',
  axisTop = 'on',
  axisLeft = 'on',
  axisRight = 'on',
  lineWidth = 1,
  headPad = 0,
  chartPad = 0,
  duration = 1000,
  interactivity = 'mousemove',
  //backColour = 'white',
  data = [],
  taxa = [],
  metrics = []
} = {}) {

  let metricsPlus
  let pTrans

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .classed('brc-chart-phen2-top', true)
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
  // Texts must come after chart because
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width") - headPad)
  makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  positionMainElements(svg, expand, headPad)

  svg.selectAll('line, path').style('stroke-width', lineWidth)
  svg.selectAll('text').style('font-family', font)

  function makeChart () {

    pTrans = []

    metricsPlus = metrics.map((m,i) => {
      return {
        id:  safeId(m.label),
        prop: m.prop,
        label: m.label,
        colour: m.colour,
        opacity: m.opacity ? m.opacity : 1,
        svg: m.svg,
        // By default legend order is reversed
        legendOrder: m.legendOrder ?  m.legendOrder : metrics.length - i,
        svgScale: m.svgScale ? m.svgScale : 1
      }
    })

    if (!taxa.length) {
      taxa = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makePhen(t))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    let legendHeight = 0
    if (displayLegend) {
      legendHeight = makeLegend(perRow * (subChartWidth + subChartPad) - headPad) + subChartPad
    }

    svgsTaxa.forEach((svgTaxon, i) => {

      const col = i%perRow
      const row = Math.floor(i/perRow)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad))
      svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight)
    })

    svgChart.attr("width", perRow * (subChartWidth + subChartPad))
    svgChart.attr("height", legendHeight +  Math.ceil(svgsTaxa.length/perRow) * (subChartHeight + subChartPad))

    return Promise.allSettled(pTrans)
  }

  function makePhen (taxon) {
    // Get data for named taxon
    const dataFiltered = data.find(d => d.taxon === taxon)
    const rectData = []
    if (dataFiltered) {
      metricsPlus.forEach((m, im) => {
        dataFiltered[m.prop].forEach((d,i) => {
          rectData.push({
            id: `${m.id}-${i}`,
            iMetric: m.legendOrder ? m.legendOrder - 1 : im,
            class: m.id,
            colour: m.colour,
            opacity: m.opacity,
            start: d.start,
            end:  d.end
          })
        })
      })
    }

    // Value scale
    const xScale = d3.scaleLinear().domain([1, 365]).range([0, width])
    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0])

    // X (bottom) axis
    let xAxis1, xAxis2
    if (axisBottom === 'on' || axisBottom === 'tick') {
      //xAxis = xAxisMonth(width, axisBottom === 'tick', monthFontSize, font)
      xAxis1 = xAxisMonthNoText(width, [1,12])
      xAxis2 = xAxisMonthText(width, axisBottom === 'tick', monthFontSize, font, [1,12])
    }

    // Top axis
    let tAxis
    if (axisTop === 'on') {
      tAxis = d3.axisTop()
        .scale(xScale)
        .tickValues([])
        .tickSizeOuter(0)
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
    if (axisLeft === 'on') {
      yAxis = d3.axisLeft()
        .scale(yScale)
        .tickValues([])
        .tickSizeOuter(0)
    }

    // Create or get the relevant chart svg
    let init, svgPhen2, gPhen2
    if (taxa.length === 1 && svgChart.selectAll('.brc-chart-phen2').size() === 1) {
      svgPhen2 = svgChart.select('.brc-chart-phen2')
      gPhen2 = svgPhen2.select('.brc-chart-phen2-g')
      init = false
    } else if (svgChart.select(`#${safeId(taxon)}`).size()) {
      svgPhen2 = svgChart.select(`#${safeId(taxon)}`)
      gPhen2 = svgPhen2.select('.brc-chart-phen2-g')
      init = false
    } else {
      svgPhen2 = svgChart.append('svg')
        .classed('brc-chart-phen2', true)
        .attr('id', safeId(taxon))
        .style('overflow', 'visible')
      gPhen2 = svgPhen2.append('g')
        .classed('brc-chart-phen2-g', true)
      init = true
    }

    // Create/update the band rectangles with D3
    const mrects = gPhen2.selectAll("rect")
      .data(rectData,  d => d.id)

    const erects = mrects.enter()
      .append("rect")
      .attr("class", d => `phen-rect-${d.class} phen-rect`)
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", d => xScale(d.start+(d.end-d.start)/2))

    addEventHandlers(erects, 'class')

    transPromise(mrects.merge(erects)
      .transition()
      .duration(duration)
      .attr("width", d => xScale(d.end) - xScale(d.start))
      .attr("height",  split ? height/metricsPlus.length : height)
      .attr("x", d => xScale(d.start))
      .attr("y", d => split ? d.iMetric * height/metricsPlus.length : 0)
      .attr("opacity", d => d.opacity)
      .attr("fill", d => d.colour), pTrans)

    transPromise(mrects.exit()
      .transition()
      .duration(duration)
      .attr("width", 0)
      .attr("height", 0)
      .remove(), pTrans)

    if (init) {
      // Constants for positioning
      const axisPadX = chartPad
      const axisPadY = axisBottom === 'tick' ? 15 : 0
      let labelPadY

      // Taxon title
      if (showTaxonLabel) {
        const taxonLabel = svgPhen2
          .append('text')
          .classed('brc-chart-phen2-label', true)
          .text(taxon)
          //.style('font-family', font)
          .style('font-size', taxonLabelFontSize)
          .style('font-style', taxonLabelItalics ? 'italic' : '')

        const labelHeight = taxonLabel.node().getBBox().height
        taxonLabel.attr("transform", `translate(${axisPadX}, ${labelHeight})`)
        labelPadY = labelHeight * 1.5
      } else {
        labelPadY = 0
      }

      // Size SVG
      svgPhen2
        .attr('width', width + axisPadX + 1)
        .attr('height', height + axisPadY + labelPadY + 1)

      // Position chart
      gPhen2.attr("transform", `translate(${axisPadX},${labelPadY})`)

      // Create axes and position within SVG
      if (xAxis1 && xAxis2) {
        // const gXaxis = svgPhen2.append("g")
        //   .attr("class", "x axis")
        //   .style('font-size', monthFontSize)
        //   .call(xAxis)

        const gXaxis1 = svgPhen2.append("g")
          .attr("class", "x axis")
          .style('font-size', monthFontSize)
          .call(xAxis1)

        const gXaxis2 = svgPhen2.append("g")
          .attr("class", "x axis")
          .style('font-size', monthFontSize)
          .call(xAxis2)

        // gXaxis.selectAll(".tick text")
        //   .style("text-anchor", "start")
        //   .attr("x", 6)
        //   .attr("y", 6)

        gXaxis2.selectAll(".tick text")
          .style("text-anchor", "middle")

        gXaxis1.attr("transform", `translate(${axisPadX},${height + labelPadY})`)
        gXaxis2.attr("transform", `translate(${axisPadX},${height + labelPadY})`)

        //gXaxis.attr("transform", `translate(${axisPadX},${height + labelPadY})`)
      }

      if (yAxis) {
        const gYaxis = svgPhen2.append("g")
          //.attr("class", "y-axis")
          .call(yAxis)
        gYaxis.attr("transform", `translate(${axisPadX},${labelPadY})`)
      }
      if (tAxis) {
        const gTaxis = svgPhen2.append("g")
          .call(tAxis)
        gTaxis.attr("transform", `translate(${axisPadX},${labelPadY})`)
      }
      if (rAxis) {
        const gRaxis = svgPhen2.append("g")
          .call(rAxis)
        gRaxis.attr("transform", `translate(${axisPadX + width},${labelPadY})`)
      }

    } else if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgPhen2.select('.brc-chart-phen2-label').text(taxon)
      }
    }
    return svgPhen2
  }

  function makeLegend (legendWidth) {

    const swatchSize = 20
    const swatchFact = 1.3

    // Loop through all the legend elements and work out their
    // positions based on swatch size, item lable text size and
    // legend width.
    let rows = 0
    let lineWidth = -swatchSize

    //const metricsSorted = cloneData(metricsPlus).reverse()
    const metricsSorted = cloneData(metricsPlus)
      .filter(m => m.label)
      .sort((a,b) => a.legendOrder > b.legendOrder ? 1 : -1)

    // Get the bbox of any SVG icons in metrics
    metricsSorted.filter(m => m.svg).forEach(m => {
      const path = svgChart.append('path').attr('d', m.svg).style('visibility', 'hidden')
      m.svgbbox = path.node().getBBox()
      path.remove()
    })

    metricsSorted.forEach(m => {
      const tmpText = svgChart.append('text') //.style('display', 'none')
        .text(m.label)
        //.style('font-family', font)
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

    // Note that the stuff below uses the D3 Join general udpate pattern
    // https://observablehq.com/@d3/selection-join

    // Swatch
    const ls = svgChart.selectAll('.brc-legend-item-rect')
      .data(metricsSorted, m => m.id)
      .join(enter => {
          const rect = enter.append("rect")
            .attr("class", m => `brc-legend-item brc-legend-item-rect brc-legend-item-${m.id}`)
            .attr('width', swatchSize)
            .attr('height', swatchSize/2)
            .attr('display', m => m.svg ? 'none' : '')
          return rect
      })
      .attr('x', m => m.x)
      .attr('y', m => m.y + swatchSize/3)
      .attr("opacity", d => d.opacity)
      .attr('fill', m => m.colour)

    // SVG icon
    const li = svgChart.selectAll('.brc-legend-item-icon')
      .data(metricsSorted, m => m.id)
      .join(enter => enter
        .append("path")
        .attr("class", m=> `brc-legend-item brc-legend-item-icon brc-legend-item-${m.id}`)
        .attr("d", m => m.svg)
      )
      // The transform has to come outside the enter selection so that it is executed whenever
      // the code is called. Important because the bbox stuff only works if gui is visible and
      // the first time this code is called, it may not be visible.
      // The svg is also scaled by a factor passed in the metrics (svgScale) which
      // defaults to 1.
      .attr('transform', m => {
        if (m.svg && m.svgbbox &&  m.svgbbox.width) {
          const iScale = swatchSize / m.svgbbox.width * m.svgScale
          const xAdj =  m.svgbbox.x * iScale
          const yAdj = m.svgbbox.y * iScale - (swatchSize - m.svgbbox.height * iScale)/2
          return `translate(${m.x - xAdj} ${m.y - yAdj}) scale(${iScale} ${iScale})`
        } else {
          return ''
        }
      })
      .attr('fill', m => m.colour)
      .attr('opacity', m => m.opacity)

    // Text
    const lt = svgChart.selectAll('.brc-legend-item-text')
      .data(metricsSorted, m => safeId(m.label))
      .join(enter => {
          const text = enter.append("text")
            .attr("class", m=> `brc-legend-item brc-legend-item-text brc-legend-item-${m.id}`)
            .text(m => m.label)
            //.style('font-family', font)
            .style('font-size', legendFontSize)
          return text
      })
      .attr('x', m => m.x + swatchSize * swatchFact *  m.svgScale)
      .attr('y', m => m.y + legendFontSize * 1)

    addEventHandlers(ls, 'label')
    addEventHandlers(lt, 'label')
    addEventHandlers(li, 'label')

    return swatchSize * swatchFact * (rows + 1)
  }

  function highlightItem(cls, highlight) {

    svgChart.selectAll('.phen-rect')
      .classed('lowlight', highlight)

    svgChart.selectAll(`.phen-rect-${cls}`)
      .classed('lowlight', false)

    svgChart.selectAll(`.phen-rect`)
      .classed('highlight', false)

    if (cls) {
      svgChart.selectAll(`.phen-rect-${cls}`)
        .classed('highlight', highlight)
    }

    svgChart.selectAll('.brc-legend-item')
      .classed('lowlight', highlight)

    if (cls) {
      svgChart.selectAll(`.brc-legend-item-${cls}`)
        .classed('lowlight', false)
    }

    if (cls) {
      svgChart.selectAll(`.brc-legend-item-${cls}`)
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
          highlightItem(safeId(d[prop]), true)
        }
      })
      .on("mouseout", function(d) {
        if (interactivity === 'mousemove') {
          highlightItem(safeId(d[prop]), false)
        }
      })
      .on("click", function(d) {
        if (interactivity === 'mouseclick') {
          highlightItem(safeId(d[prop]), true)
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
  * @returns {Promise} promise resolves when all transitions complete.
  * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
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
    makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
    makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
    makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)

    let remakeChart = false

    if ('data' in opts) {
      data = opts.data
      remakeChart = true
    }

    if ('metrics' in opts) {
      metrics = opts.metrics
      remakeChart = true
    }

    let pRet
    if (remakeChart) {
      pRet = makeChart()
      positionMainElements(svg, expand)
    } else {
      pRet = Promise.resolve()
    }
    return pRet
  }

/** @function setTaxon
  * @param {string} opts.taxon - The taxon to display.
  * @returns {Promise} promise resolves when all transitions complete.
  * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
  * For single species charts, this allows you to change the taxon displayed.
  */
  function setTaxon(taxon){
    let pRet
    if (taxa.length !== 1) {
      console.log("You can only use the setTaxon method when your chart displays a single taxon.")
      pRet = Promise.resolve()
    } else {
      taxa = [taxon]
      pRet = makeChart()
    }
    return pRet
  }


/** @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
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
  * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
  * Download the chart as an image file.
  */
  function saveImage(asSvg, filename, info){
    return saveChartImage(svg, expand, asSvg, filename, null, info)
  }

  /**
   * @typedef {Object} api
   * @property {module:phen2~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:phen2~getChartHeight} getChartHeight - Gets and returns the current height of the chart.
   * @property {module:phen2~setChartOpts} setChartOpts - Sets text options for the chart.
   * @property {module:phen2~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts.
   * @property {module:phen2~saveImage} saveImage - Generates and downloads and image file for the SVG.
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon,
    saveImage: saveImage
  }

}