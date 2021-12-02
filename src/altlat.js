/** @module altlat */

import * as d3 from 'd3'
import * as gen from './general'
import { getCentroid } from 'brc-atlas-bigr'
import { constants } from './constants.js'
import backData from './altlat.json'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG. (Default - 'body'.)
 * @param {string} opts.elid - The id for the dom object created. (Default - 'altlat-chart'.)
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
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text. (Default - 10.)
 * @param {string} opts.axisLeftLabel - Value for labelling left axis. (Default - 'Altitude (m)'.)
 * @param {string} opts.axisBottomLabel - Value for labelling bottom axis. (Default - 'Distance north (km)'.)
 * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
 * @param {string} opts.axisLeft -  If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'tick'.)
 * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. Any other value results in no axis. (Default - ''.)
 * @param {string} opts.axisTop - If set to 'on' line is drawn without ticks. Any other value results in no axis. (Default - ''.)
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'tick'.)
 * @param {number} opts.duration - The duration of each transition phase in milliseconds. (Default - 1000.)
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'. (Default - 'none'.)
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * For each taxon, there is assumed to be a single data item for each rounded distance/altitude combination for which there is a metric value.
 * <ul>
 * <li> <b>taxon</b> - The taxon for which this point refers.
 * <li> <b>distance</b> - The distance north (OS northing) in kilometers rounded down to the nearest 50 km.
 * <li> <b>altitude</b> - The altitude (asl) in metres rounded down to the nearest 100 m.
 * <li> <b>metric</b> - a metric (number) for the given distance and altitude. 
 * </ul>
 * @param {Array.<Object>} opts.ranges - Specifies an array of objects defining ranges for displaying the metrics.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order affects how they appear in the legend.)
 * <ul>
 * <li> <b>min</b> - The minimum metric value to be included in this range.
 * <li> <b>max</b> - The maximum metric value to be included in this range.
 * <li> <b>radius</b> - The radius of the dot to be drawn for this range.
 * <li> <b>legend</b> - Text for the legend item for this range. 
 * </ul>
 * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
 * If empty, graphs for all taxa are created. (Default - [].)
 * @returns {module:altlat~api} api - Returns an API for the chart.
 */

export function altlat({
  // Default options in here
  selector = 'body',
  elid = 'altlat-chart',
  width = 300,
  height = 200,
  margin = {left: 30, right: 30, top: 15, bottom: 15},
  perRow = 2,
  expand = false,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 10,
  legendFontSize = 10,
  showLegend = true,
  axisLeftLabel = 'Altitude (m)',
  axisBottomLabel = 'Distance north (km)',
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
  duration = 1000,
  interactivity = 'none',
  data = [],
  taxa = [],
  ranges = [],
} = {}) {

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .style('position', 'relative')
    .style('display', 'inline')

  const svg = mainDiv.append('svg')
  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem({}, false)
    }
  })

  const svgChart = svg.append('svg').attr('class', 'mainChart brc-chart-altlat')

  // Value scales
  const xScale = d3.scaleLinear().domain([0, 1250]).range([0, width])
  const yScale = d3.scaleLinear().domain([0, 1200]).range([height, 0])
  
  makeChart()
  // Texts must come after chartbecause 
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width"))
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand)

  function makeChart () {

    // If taxa for graphs not set, set to all in dataset
    if (!taxa.length) {
      taxa = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    const subChartPad = 10
    const svgsTaxa = taxa.map(t => makeAltLat(t))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    svgsTaxa.forEach((svgTaxon, i) => {
      
      const col = i%perRow
      const row = Math.floor(i/perRow)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad))
      svgTaxon.attr("y", row * (subChartHeight + subChartPad))
    })

    svgChart.attr("width", perRow * (subChartWidth + subChartPad))
    svgChart.attr("height", Math.ceil(svgsTaxa.length/perRow) * (subChartHeight + subChartPad))
  }

  function makeAltLat (taxon) {

    //console.log(ranges)
    //console.log(data)

    // Pre-process data - filter to named taxon
    //const dataFiltered = data.filter(d => d.taxon === taxon)

    // Top axis
    let tAxis
    if (axisTop === 'on') {
      tAxis = d3.axisTop()
        .scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([])
        .tickSizeOuter(0)
    }

    // Bottom axis
    let bAxis
    if (axisBottom === 'on' || axisBottom === 'tick') {
      const tickVals = axisBottom === 'tick' ? [200, 400, 600, 800, 1000, 1200] : []
      bAxis = d3.axisBottom()
        .scale(xScale)
        .tickValues(tickVals) // km north
        .tickFormat(d3.format("d"))
        .tickSizeOuter(0)
    }

    // Left axis
    let lAxis
    if (axisLeft === 'on' || axisLeft === 'tick') {
      const tickVals = axisLeft === 'tick' ? [200, 400, 600, 800, 1000, 1200] : []
      lAxis = d3.axisLeft()
        .scale(yScale)
        .tickValues(tickVals) // m above sea level
        .tickFormat(d3.format("d"))
        .tickSizeOuter(0)
    }

    // right axis
    let rAxis
    if (axisRight === 'on') {
      rAxis = d3.axisRight()
        .scale(yScale) // Actual scale doesn't matter, but needs one
        .tickValues([])
        .tickSizeOuter(0)
    }

    // Create or get the relevant chart svg
    let init, svgAltLat, gAltLat
    if (taxa.length === 1 && svgChart.selectAll('.brc-chart-altlat').size() === 1) {
      svgAltLat = svgChart.select('.brc-chart-altlat')
      gAltLat = svgAltLat.select('.brc-chart-altlat-g')
      init = false
    } else if (svgChart.select(`#${gen.safeId(taxon)}`).size()) {
      svgAltLat = svgChart.select(`#${gen.safeId(taxon)}`)
      gAltLat = svgAltLat.select('.brc-chart-altlat-g')
      init = false
    } else {
      svgAltLat = svgChart.append('svg')
        .classed('brc-chart-altlat', true)
        .attr('id', gen.safeId(taxon))
        .style('overflow', 'visible')
      gAltLat = svgAltLat.append('g')
        .classed('brc-chart-altlat-g', true)
      init = true
    }

    const backSquareWidth = xScale(50)
    const backSquareHeight = height - yScale(100)

    // Create the background squares
    gAltLat.selectAll("rect")
      .data(backData)
      .join(
        enter => enter.append("rect")
          .attr('width',backSquareWidth)
          .attr('height',backSquareHeight)
          .attr('stroke', 'black')
          .attr('stroke-width', 0.5)
          .attr('fill', d => {
            if (d[1] < 200) {
              return 'white'
            }
            if (d[1] < 400) {
              return '#CCE192'
            }
             if (d[1] < 600) {
              return '#AED367'
            }
             if (d[1] < 800) {
              return '#ECDA49'
            }
             if (d[1] < 1000) {
              return '#D9A738'
            }
            return '#BE8D66'
          })
          .attr('y', d => yScale(d[1]) - backSquareHeight)
          .attr('x', d => xScale(d[0])),
      )
  
    // Create the metric circles
    const t = svgAltLat.transition()
      .duration(duration)

    gAltLat.selectAll(".brc-altlat-metric-circle")
      .data(data, d => `${d.distance}-${d.altitude}`)
      .join(
        enter => enter.append("circle")
          .attr("r", 0)
          .attr("cx", d => xScale(d.distance + 25))
          .attr("cy", d => yScale(d.altitude + 50)),
        update => update,
        exit => exit
          .call(exit => exit.transition(t)
            .attr("r", 0)
            .remove())
      )
      .attr("class", d => `brc-altlat-metric-circle brc-altlat brc-altlat-${getRadius(d.metric)}`)
      .transition(t)
        // The selection returned by the join function is the merged
        // enter and update selections
        .attr("r", d => xScale(getRadius(d.metric)))

    addEventHandlers(gAltLat.selectAll(".brc-altlat-metric-circle"))
        
    if (init) {

      // Constants for positioning
      const axisLeftPadX = margin.left ? margin.left : 0
      const axisRightPadX = margin.right ? margin.right : 0
      const axisBottomPadY = margin.bottom ? margin.bottom : 0
      const axisTopPadY = margin.top ? margin.top : 0

      // Taxon title
      if (showTaxonLabel) {
        const taxonLabel = svgAltLat
          .append('text')
          .classed('brc-chart-altlat-label', true)
          .text(taxon)
          .style('font-size', taxonLabelFontSize)
          .style('font-style', taxonLabelItalics ? 'italic' : '')

        const labelHeight = taxonLabel.node().getBBox().height
        taxonLabel.attr("transform", `translate(${axisLeftPadX}, ${labelHeight})`)
      }
      
      // Size SVG
      svgAltLat
        .attr('width', width + axisLeftPadX + axisRightPadX)
        .attr('height', height + axisBottomPadY + axisTopPadY)

      // Position chart and legend
      gAltLat.attr("transform", `translate(${axisLeftPadX},${axisTopPadY})`)
      
      // Create axes and position within SVG
      const leftYaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
      const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${axisTopPadY + height/2}) rotate(270)`
      const rightYaxisTrans = `translate(${axisLeftPadX + width}, ${axisTopPadY})`
      const topXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
      const bottomXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY + height})`
      const bottomXaxisLabelTrans = `translate(${axisLeftPadX + width/2},  ${height + axisTopPadY + axisBottomPadY})`

      // Create axes and position within SVG
      if (lAxis) {
        const gLaxis = svgAltLat.append("g")
          .call(lAxis)
        gLaxis.attr("transform", leftYaxisTrans)
      }
      if (bAxis) {
        const gBaxis = svgAltLat.append("g")
          .call(bAxis)
        gBaxis.attr("transform", bottomXaxisTrans)
      }
      if (tAxis) {
        const gTaxis = svgAltLat.append("g")
          .call(tAxis)
        gTaxis.attr("transform", topXaxisTrans)
      }
      if (rAxis) {
        const gRaxis = svgAltLat.append("g")
          .call(rAxis)
        gRaxis.attr("transform", rightYaxisTrans)
      }

      const tYaxisLabel = svgAltLat.append("text")
        .style("text-anchor", "middle")
        .style('font-size', axisLabelFontSize)
        .text(axisLeftLabel) 
      tYaxisLabel.attr("transform", leftYaxisLabelTrans)

      const tXaxisLabel = svgAltLat.append("text")
        .style("text-anchor", "middle")
        .style('font-size', axisLabelFontSize)
        .text(axisBottomLabel) 
      tXaxisLabel.attr("transform", bottomXaxisLabelTrans)

    } else if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgAltLat.select('.brc-chart-altlat-label').text(taxon)
      }
    }

    // Make the legend
    if (showLegend) {
       makeLegend(gAltLat)
    }
  
    return svgAltLat
  }

  function makeLegend (gAltLat) {

    const items = ranges.map(r => {
      return {
        text: r.legend,
        radiusTrans: xScale(r.radius),
        radius: r.radius
      }
    })

    const maxRadius = Math.max(...items.map(i => i.radiusTrans))
    const xOffset = xScale(1050)
    const yOffset = yScale(1150)

    const t = gAltLat.transition()
      .duration(duration)

    const ls = gAltLat.selectAll('.brc-altlat-legend-item-circle')
      .data(items, i => gen.safeId(i.text))
      .join(
        enter => {
          const swatches = enter.append("circle")
            .attr("class", i => `brc-altlat-legend-item-circle brc-altlat brc-altlat-${i.radius}`)
            .attr('r', 0)
            .attr('cx', xOffset)
            .attr('cy', (i,j) => yOffset + maxRadius * 2.2 * j)
          return swatches
        },
        update => update
      )
      .attr("class", i => `brc-altlat-legend-item-circle brc-altlat brc-altlat-${i.radius}`)
    ls.transition(t)
      .attr('r', i => i.radiusTrans)

    const lt = gAltLat.selectAll('.brc-altlat-legend-item-text')
      .data(items, i => gen.safeId(i.text))
      .join(
        enter => {
          const text = enter.append("text")
            .text(i => i.text)
            .style('font-size', legendFontSize)
        
          return text
        },
        update => update
      )
      .attr("class", i => `brc-altlat-legend-item-text brc-altlat brc-altlat-${i.radius}`)
      .attr('x', xOffset + maxRadius * 1.3)
      .attr('y', (i,j) => yOffset + maxRadius * 2.2 * j + maxRadius * 0.5)

    addEventHandlers(ls)
    addEventHandlers(lt)
  }

  function getRadius (metric) {
    for (let i=0; i<ranges.length; i++) {
      if (metric >= ranges[i].min && metric <= ranges[i].max) {
        return ranges[i].radius
      }
    }
  }

  function highlightItem(d, highlight) {

    svgChart.selectAll(`.brc-altlat`)
      .classed('lowlight', false)

    const rad = d.radius ? d.radius : d.metric ? getRadius(d.metric) : null

    if (highlight && rad) {
      svgChart.selectAll(`.brc-altlat`)
        .classed('lowlight', true)

      svgChart.selectAll(`.brc-altlat-${rad}`)
        .classed('lowlight', false)
    }
  }

  function addEventHandlers(sel) {
    sel
      .on("mouseover", function(d) {
        if (interactivity === 'mousemove') {
          highlightItem(d, true)
        }
      })
      .on("mouseout", function(d) {
        if (interactivity === 'mousemove') {
          highlightItem(d, false)
        }
      })
      .on("click", function(d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d, true)
          d3.event.stopPropagation()
        }
      })
  }

/** @function dataFromTetrads
  * @param {Array.<string>} tetrads
  * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
  * This function takes a single list of tetrad references and returns a promise that resolves to a
  * data object suitable for displaying with the chart.
  */
  function dataFromTetrads(tetrads) {

    const altlatTetrads = `${constants.thisCdn}/altlat-tetrads.csv`

    return d3.csv(altlatTetrads).then(function(altlat){

      const altlatSorted = altlat.sort((a,b) => {
        if (a.tetrad < b.tetrad) {
          return -1
        }
        if (a.tetrad > b.tetrad) {
          return 1
        }
        return 0
      })

      const tetradsSorted = tetrads.sort((a,b) => {
        if (a.tetrad < b.tetrad) {
          return -1
        }
        if (a.tetrad > b.tetrad) {
          return 1
        }
        return 0
      })

      const groups = []

      console.time("process tetrads")
      tetradsSorted.forEach(t => {
        //const tmi = altlatSorted.findIndex(al => al.tetrad === t)
        let tmi
        for (let i=0; i<altlatSorted.length; i++) {
          if (altlatSorted[i].tetrad === t) {
            tmi = i
            break
          }
        }
        const tm = altlatSorted[tmi]
    
        if (tm) {
          const c = getCentroid(t, 'gb')
          const distance = c.centroid[1]/1000
          const gDistance = Math.floor(distance/50) * 50
          const gAltitude = Math.floor(Math.abs(tm.altMean)/100) * 100 //Altitudes below zero considered in lowest cat

          const group = groups.find(g => g.distance === gDistance && g.altitude === gAltitude)

          if (group) {
            group.tetrads += 1
          } else {
            groups.push({
              distance: gDistance,
              altitude: gAltitude,
              tetrads: 1,
            })
          }
        }
        altlatSorted.splice(0, tmi+1)
      })
      console.timeEnd("process tetrads")

      // Convert the tetrad counts to a proportion of all tetrads in group
      const pgroupss = groups.map(g => {
        const backSquare = backData.find(bd =>  g.distance === bd[0] && g.altitude === bd[1])
        const totalTetrads = backSquare[2]

        //console.log(g.tetrads, totalTetrads)
        return {
          distance: g.distance,
          altitude: g.altitude,
          metric: g.tetrads/totalTetrads * 100,
          taxon: 'dummy'
        }
      })

      return new Promise((resolve) => {
        resolve(pgroupss)
      })
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
  * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
  * @param {Array.<Object>} opts.ranges - Specifies an array of objects defining ranges for displaying the metrics (see main interface for details).
  * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
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

    if ('ranges' in opts) {
      ranges = opts.ranges
      remakeChart = true
    }

    if (remakeChart) makeChart()
    gen.positionMainElements(svg, expand)
  }

/** @function setTaxon
  * @param {string} taxon - The taxon to display.
  * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
  * For single species charts, this allows you to change the taxon displayed.
  */
  function setTaxon(taxon){
    if (taxa.length !== 1) {
      console.log("You can only use the setTaxon method when your chart displays a single taxon.")
    } else {
      taxa = [taxon]
      highlightItem({}, false)
      makeChart()
    }
  }


/** @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

  /**
   * @typedef {Object} api
   * @property {module:altlat~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:altlat~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:altlat~setChartOpts} setChartOpts - Sets text options for the chart. 
   * @property {module:altlat~setTaxon} setTaxon - Changes the displayed taxon for single taxon charts. 
   * @property {module:altlat~dataFromTetrads} dataFromTetrads - Generates data in the format required for the chart from a raw list of tetrad references. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon,
    dataFromTetrads: dataFromTetrads
  }

}