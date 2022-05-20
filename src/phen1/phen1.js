/** @module phen1 */

import * as d3 from 'd3'
import { makeText,  positionMainElements, saveChartImage } from '../general'
import { makePhen } from './makephen'
import { highlightItem } from './highlightitem'
import { preProcessMetrics } from './metricsplus'
import { makeLegend } from './legend'


/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of each sub-chart area in pixels.
 * @param {number} opts.height - The height of the each sub-chart area in pixels.
 * @param {Object} opts.margin - An object indicating the margins to add around each sub-chart area.
 * @param {number} opts.margin.left - Left margin in pixels. (Default - 35.)
 * @param {number} opts.margin.right - Right margin in pixels. (Default - 0.)
 * @param {number} opts.margin.top - Top margin in pixels. (Default - 20.)
 * @param {number} opts.margin.bottom - Bottom margin in pixels. (Default - 5.)
 * @param {number} opts.perRow - The number of sub-charts per row.
 * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
 * @param {boolean} opts.spread - Indicates whether multiple metrics are to be spread vertically across the chart.
 * @param {string} opts.style - Indicates the type of graphics to be used for the chart. Can be 'lines', 'bars' or 'areas'. (Default - 'lines'.)
 * @param {boolean} opts.stacked - Indicates whether to stack metrics or superimpose them. If true, the metrics are stacked. This
 * is only relevant for charts of style 'bars' or 'areas'. It has no effect on charts with the style 'lines'. (Default - false.)
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
 * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
 * @param {boolean} opts.showLegend - Whether or not to show the legend.
 * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
 * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
 * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
 * @param {string} opts.axisTop - If set to 'on' line is drawn otherwise not.
 * @param {string} opts.axisLeftLabel - Value for labelling left axis. (Default - ''.)
 * @param {Array.<string>} opts.bands - An array of up to 12 colours (any standard colour notation), used to display bands for each month
 * as a background on the chart. (Default is an empty array.)
 * @param {Array.<string>} opts.lines - An array of up to 12 colours (any standard colour notation), used to display vertical lines to
 * delineat each month as a background on the chart. (Default is an empty array.)
 * @param {number} opts.monthLineWidth - The width of lines used to delineate months.
 * @param {number} opts.headPad - A left hand offset, in pixels, for title, subtitle, legend and footer. (Default 0.)
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
 * <li> <b>colour</b> - optional colour to give the line for this metric. Any accepted way of specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
 * <li> <b>fill</b> - optional colour to colour the graph area for this metric. Any accepted way of specifying web colours can be used.
 * </ul>
 * Note that if a metric has no data for a given taxon, then the graphics representing it will be
 * marked with the CSS class 'phen-path-no-data'. You can use this to style as you see fit.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> either <b>week</b> - a number between 1 and 53 indicating the week of the year,
 * <li> or <b>month</b> - a number between 1 and 12 indicating the month of the year,
 * <li> <b>c1</b> - a count for a given time period (can have any name). 
 * <li> <b>c2</b> - a count for a given time period (can have any name).
 * ... - there must be at least one count column, but there can be any number of them.
 * </ul>
 * @returns {module:phen1~api} api - Returns an API for the chart.
 */

export function phen1({
  // Default options in here
  selector = 'body',
  elid = 'phen1-chart',
  width = 300,
  height = 200,
  margin = {left: 35, right: 0, top: 20, bottom: 5},
  bands= [],
  lines=[],
  monthLineWidth = 1,
  perRow = 2,
  ytype = 'count',
  expand = false,
  spread = false,
  style = 'lines',
  stacked = false,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 10,
  legendFontSize = 16,
  axisLabelFontSize = 10,
  showLegend = true,
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
  axisLeftLabel = '',
  headPad = 0,
  duration = 1000,
  interactivity = 'mousemove',
  data = [],
  taxa = [],
  metrics = []
} = {}) {

  metrics = preProcessMetrics(metrics)

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .classed('brc-chart-phen1-top', true)
    .style('position', 'relative')
    .style('display', 'inline')

  const svg = mainDiv.append('svg')

  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(null, false, svgChart)
    }
  })

  const svgChart = svg.append('svg').attr('class', 'mainChart').style('overflow', 'visible')
  
  makeChart()

  // Texts must come after chart because 
  // the chart width is required
  const textWidth = Number(svg.select('.mainChart').attr("width") - headPad)
  makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  positionMainElements(svg, expand, headPad)

  function makeChart () {

    // Give warning and return if invalid option combinations are used
    if (stacked && spread) {
      console.log('You cannot set both the stacked and spread options to true.')
      return
    }
    if ((ytype === 'normalized' || ytype === 'proportion') && stacked) {
      console.log('You cannot used a y axis type of normalized or proportion with a stacked display.')
      return
    }

    if (!taxa.length) {
      taxa = data.map(d => d.taxon).filter((v, i, a) => a.indexOf(v) === i)
    }

    const subChartPad = 10
    const pTrans = []

    const svgsTaxa = taxa.map(t => {
      return makePhen (t, taxa, data, metrics, svgChart, width, height, 
        ytype, spread, axisTop, axisBottom, axisLeft, axisRight, monthLineWidth, bands, lines,
        style, stacked, duration, margin, showTaxonLabel, taxonLabelFontSize, taxonLabelItalics,
        axisLabelFontSize, axisLeftLabel, interactivity, pTrans)
    })

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    let legendHeight = 0
    if (showLegend) {
      const legendWidth = perRow * (subChartWidth + subChartPad) - headPad
      legendHeight = makeLegend(legendWidth, metrics, svgChart, legendFontSize, headPad, interactivity, style) + subChartPad
    }

    svgsTaxa.forEach((svgTaxon, i) => {
      
      const col = i%perRow
      const row = Math.floor(i/perRow)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad))
      svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight)
    })

    svgChart.attr("width", perRow * (subChartWidth + subChartPad))
    svgChart.attr("height", legendHeight +  Math.ceil(svgsTaxa.length/perRow) * (subChartHeight + subChartPad))

    return Promise.all(pTrans)
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
  * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
  * @param {boolean} opts.spread - Indicates whether multiple metrics are to be spread vertically across the chart.
  * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
  * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
  * @returns {Promise} promise resolves when all transitions complete.
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
    makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
    makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
    makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)

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
      metrics = preProcessMetrics(opts.metrics)
      remakeChart = true
    }

    if ('spread' in opts) {
      spread = opts.spread
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
  * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
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

/** @function saveImage
  * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
  * @param {string} filename - Name of the file (without extension) to generate and download.
  * If the filename is falsey (e.g. blank), it will not automatically download the
  * file. (Allows caller to do something else with the data URL which is returned
  * as the promise's resolved value.)
  * @returns {Promise} promise object represents the data URL of the image.
  * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
  * Download the chart as an image file.
  */
  function saveImage(asSvg, filename){
    return saveChartImage(svg, expand, asSvg, filename) 
  }

  /**
   * @typedef {Object} api
   * @property {module:phen1~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:phen1~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:phen1~setChartOpts} setChartOpts - Sets text options for the chart. 
   * @property {module:phen1~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
   * @property {module:phen1~saveImage} saveImage - Generates and downloads and image file for the SVG. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon,
    saveImage: saveImage
  }

}