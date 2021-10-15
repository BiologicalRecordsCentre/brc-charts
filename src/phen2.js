/** @module phen2 */

import * as d3 from 'd3'
import * as gen from './general'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of each sub-chart area in pixels.
 * @param {number} opts.height - The height of the each sub-chart area in pixels.
 * @param {number} opts.perRow - The number of sub-charts per row.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.subtitle - Subtitle for the chart.
 * @param {string} opts.footer - Footer for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.subtitleFontSize - Font size (pixels) of chart sub-title.
 * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
 * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
 * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph.
 * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label.
 * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
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
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>prop</b> - the name of the property in the data (properties - 'p1' or 'p2' in the example below).
 * <li> <b>label</b> - a label for this property.
 * <li> <b>colour</b> - colour to give the band for this property. Any accepted way of specifying web colours can be used.
 * </ul>
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. 
 * There should only be one object per taxon. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>p1</b> - a date band object (see below), indicating start and end weeks for the property (can have any name).
 * <li> <b>p2</b> - a date band object (see below), indicating start and end weeks for the property (can have any name).
 * ... - there must be at leas one property column, but there can be any number of them.
 * </ul>
 * The date band objects have the following structure:
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
  perRow = 2,
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
  axisBottom = 'tick',
  axisTop = 'on',
  axisLeft = 'on',
  axisRight = 'on',
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
  // Texts must come after chart because 
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width") - headPad)
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand, headPad)

  function makeChart () {

    metricsPlus = metrics.map(m => {
      return {
        id:  gen.safeId(m.label),
        prop: m.prop,
        label: m.label,
        colour: m.colour
      }
    })

    if (!taxa.length) {
      taxa = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makePhen(t))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    const legendHeight = makeLegend(perRow * (subChartWidth + subChartPad) - headPad) + subChartPad

    svgsTaxa.forEach((svgTaxon, i) => {
      
      const col = i%perRow
      const row = Math.floor(i/perRow)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad))
      svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight)
    })

    svgChart.attr("width", perRow * (subChartWidth + subChartPad))
    svgChart.attr("height", legendHeight +  Math.ceil(svgsTaxa.length/perRow) * (subChartHeight + subChartPad))
  }

  function makePhen (taxon) {
    // Get data for named taxon
    const dataFiltered = data.find(d => d.taxon === taxon)
    const rectData = metricsPlus.map(m => {
      return {
        id: m.id,
        colour: m.colour,
        start: dataFiltered[m.prop].start,
        end: dataFiltered[m.prop].end,
      }
    })
    
    // Value scale
    //const xScale = d3.scaleLinear().domain([1, 53]).range([0, width])
    const xScale = d3.scaleLinear().domain([1, 365]).range([0, width])

    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0])

    // X (bottom) axis
    let xAxis
    if (axisBottom === 'on' || axisBottom === 'tick') {
      xAxis = gen.xAxisMonth(width, axisBottom === 'tick')
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
    } else if (svgChart.select(`#${gen.safeId(taxon)}`).size()) {
      svgPhen2 = svgChart.select(`#${gen.safeId(taxon)}`)
      gPhen2 = svgPhen2.select('.brc-chart-phen2-g')
      init = false
    } else {
      svgPhen2 = svgChart.append('svg')
        .classed('brc-chart-phen2', true)
        .attr('id', gen.safeId(taxon))
      gPhen2 = svgPhen2.append('g')
        .classed('brc-chart-phen2-g', true)
      init = true
    }
    
    // Create/update the band rectangles with D3
    const mrects = gPhen2.selectAll("rect")
      .data(rectData,  d => d.id)

    const erects = mrects.enter()
      .append("rect")
      .attr("class", d => `phen-rect-${d.id} phen-rect`)
      .attr("height",  height)
      .attr("width", 0)
      .attr("x", d => xScale(d.start+(d.end-d.start)/2))

    addEventHandlers(erects, 'id')

    mrects.merge(erects)
      .transition()
      .duration(duration)
      .attr("width", d => xScale(d.end) - xScale(d.start))
      .attr("x", d => xScale(d.start))
      .attr("fill", d => d.colour)
    
    mrects.exit()
      .transition()
      .duration(duration)
      .remove()

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
      if (xAxis) {
        const gXaxis = svgPhen2.append("g")
          .attr("class", "x axis")
          .call(xAxis)

        gXaxis.selectAll(".tick text")
          .style("text-anchor", "start")
          .attr("x", 6)
          .attr("y", 6)

        gXaxis.attr("transform", `translate(${axisPadX},${height + labelPadY})`)
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
    metricsPlus.forEach(m => {
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
      .data(metricsPlus, m => m.id)
      .join(enter => {
          const rect = enter.append("rect")
            .attr("class", m=> `brc-legend-item brc-legend-item-rect brc-legend-item-${m.id}`)
            .attr('width', swatchSize)
            .attr('height', swatchSize/2)
          return rect
      })
      .attr('x', m => m.x)
      //.attr('y', m => m.y)
      .attr('y', m => m.y + swatchSize/3)
      .attr('fill', m => m.colour)

    const lt = svgChart.selectAll('.brc-legend-item-text')
      .data(metricsPlus, m => gen.safeId(m.label))
      .join(enter => {
          const text = enter.append("text")
            .attr("class", m=> `brc-legend-item brc-legend-item-text brc-legend-item-${m.id}`)
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

    svgChart.selectAll('.phen-rect')
      .classed('lowlight', highlight)

    svgChart.selectAll(`.phen-rect-${id}`)
      .classed('lowlight', false)
  
    svgChart.selectAll(`.phen-rect`)
      .classed('highlight', false)

    if (id) {
      svgChart.selectAll(`.phen-rect-${id}`)
        .classed('highlight', highlight)
    }
    
    svgChart.selectAll('.brc-legend-item')
      .classed('lowlight', highlight)

    if (id) {
      svgChart.selectAll(`.brc-legend-item-${id}`)
        .classed('lowlight', false)
    }

    if (id) {
      svgChart.selectAll(`.brc-legend-item-${id}`)
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
  * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
  * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
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
      remakeChart = true
    }

    if (remakeChart) makeChart()
    gen.positionMainElements(svg, expand)
  }

/** @function setTaxon
  * @param {string} opts.taxon - The taxon to display.
  * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
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

  /**
   * @typedef {Object} api
   * @property {module:phen2~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:phen2~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:phen2~setChartOpts} setChartOpts - Sets text options for the chart. 
   * @property {module:phen2~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon
  }

}