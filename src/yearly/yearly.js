/** 
 * @deprecated The yearly chart is deprecated in favour of the temporal chart.
 * The temporal chart combines the phen1 and yearly charts and adds
 * even more functionality.
 * @module yearly
 */

import * as d3 from 'd3'
import * as gen from '../general'
import { makeYearly } from './makeYearly'
import { makeLegend } from './legend'
import { highlightItem } from './highlightitem'

/**
 * @deprecated yearly is deprecated in favour of the temporal chart.
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
 * @param {string} opts.yAxisOpts - Specifies options for scaling and displaying left axis.
 * @param {string} opts.yAxisOpts.numFormat - Indicates format for displaying numeric values (uses d3 format values - https://github.com/d3/d3-format). (Default is 'd'.)
 * @param {number} opts.yAxisOpts.minMax - Indicates a minumum value for the maximum value. Set to null for no minimum value. (Default is 5.)
 * @param {number} opts.yAxisOpts.fixedMin - Sets a fixed minimum. Set to null for no fixed minimum. (Default is 0.)
 * @param {number} opts.yAxisOpts.padding - Sets padding to add to the y axis limits as a proportion of data range. (Default is 0.)
 * @param {number} opts.headPad - A left hand offset, in pixels, for title, subtitle, legend and footer. (Default 0.)
 * @param {number} opts.duration - The duration of each transition phase in milliseconds. (Default - 1000.)
 * @param {string} opts.showCounts - The type of the graphic 'bar' for a barchart and 'line' for a line graph. (Default - 'bar'.)
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'. (Default - 'none'.)
 * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
 * data for which graphics should be generated on the chart.
 * Each of the objects in the data array can be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>prop</b> - the name of the numeric property in the data (metric properties - 'c1' or 'c2' in the example below).
 * <li> <b>label</b> - a label for this metric. (Optional - the default label will be the property name.)
 * <li> <b>colour</b> - optional colour to give the graphic for this metric. Any accepted way of
 * specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
 * (Optional - default is 'blue'.)
 * <li> <b>opacity</b> - optional opacity to give the graphic for this metric.
 * (Optional - default is 0.5.)
 * <li> <b>linewidth</b> - optional width of line for line for this metric if displayed as a line graph.
 * (Optional - default is 1.)
 * <li> <b>bandUpper</b> - optional name of a numeric property in the data which indicates the upper value
 * of a confidence band. Can only be used where <i>showCounts</i> is 'line'.
 * <li> <b>bandLower</b> - optional name of a numeric property in the data which indicates the lower value
 * of a confidence band. Can only be used where <i>showCounts</i> is 'line'.
 * <li> <b>bandFill</b> - optional colour to use for a confidence band. Any accepted way of
 * specifying web colours can be used.
 * (Optional - default is 'silver'.)
 * <li> <b>bandStroke</b> - optional colour to use for the uppder and lower boundaries of a confidence band. Any accepted way of
 * specifying web colours can be used.
 * (Optional - default is 'grey'.)
 * <li> <b>bandOpacity</b> - optional opacity to give the confidence band for this metric.
 * (Optional - default is 0.5.)
 * <li> <b>bandStrokeOpacity</b> - optional opacity to give the boundaries of the confidence band for this metric.
 * (Optional - default is 1.)
 * <li> <b>bandStrokewidth</b> - optional width of line for bounary lines of the confidence band this metric if displayed as a line graph.
 * (Optional - default is 1.)
 * <li> <b>points</b> - optional name of a numeric property in the data which indicates where a point is to be displayed.
 * <li> <b>errorBarUpper</b> - optional name of a numeric property in the data which indicates the upper value
 * of an error bar. Used in conjunction with the <i>errorBarLower</i> property.
* <li> <b>errorBarLower</b> - optional name of a numeric property in the data which indicates the lower value
 * of an error bar. Used in conjunction with the <i>errorBarUpper</i> property.
 * </ul>
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>year</b> - a four digit number indicating a year.
 * <li> <b>c1</b> - a metric for a given year (can have any name).
 * <li> <b>c2</b> - a metric for a given year (can have any name).
 * ... - there must be at least one metric column, but there can be any number of them.
 * </ul>
 * @param {Array.<Object>} opts.dataPoints - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>year</b> - a four digit number indicating a year.
 * <li> <b>y</b> - y value for a given year.
 * <li> <b>upper</b> - a value for upper confidence band.
 * <li> <b>lower</b> - a value for lower confidence band.
 * </ul>
 * @param {Array.<Object>} opts.dataTrendLines - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>gradient</b> - a gradient for the line.
 * <li> <b>inercept</b> - the y axis intercept value (at x = 0) for the line.
 * <li> <b>colour</b> - the colour of the line the line. Any accepted way of specifying web colours can be used. (Default - red.)
 * <li> <b>width</b> - the width the line the line in pixels. (Default - 1.)
 * <li> <b>opacity</b> - the opacity of the line. (Default - 1.)
 * </ul>
 * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for.
 * If empty, graphs for all taxa are created. (Default - [].)

 * @param {number} opts.minYear Indicates the earliest year to use on the x axis. If left unset, the earliest year in the dataset is used. (Default - null.)
 * @param {number} opts.maxYear Indicates the latest year to use on the x axis. If left unset, the latest year in the dataset is used. (Default - null.)
 * @param {number} opts.minYearTrans If set, this indicates the lowest possible year. It is only useful if transitioning between datasets with different
 * year ranges - its purpose is to facilitate smooth transitions of lines and bands in these cases. (Default - null.)
 * @param {number} opts.maxYearTrans If set, this indicates the highest possible year. It is only useful if transitioning between datasets with different
 * year ranges - its purpose is to facilitate smooth transitions of lines and bands in these cases. (Default - null.)
 * @param {number} opts.minCount Indicates the lowest value to use on the y axis. If left unset, the lowest value in the dataset is used. (Default - null.)
 * @param {number} opts.maxCount Indicates the highest value to use on the y axis. If left unset, the highest value in the dataset is used. (Default - null.)
 * @param {number} opts.xPadPercent Padding to add either side of min and max year value - expressed as percentage of year range. Can only be used on line charts. (Default - 0.)
 * @param {number} opts.yPadPercent Padding to add either side of min and max y value - expressed as percentage of y range. Can only be used on line charts. (Default - 0.)
 * @param {string|number} opts.missingValues A value which indicates how gaps in yearly data are treated. Can either be the string value 'break' which
 * causes trend lines to break where no value, 'bridge' which causes gaps to be bridged with straight line or a numeric value. (Default - 0.)
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
  yAxisOpts = {numFormat: 'd', minMax: 5, fixedMin: 0, padding: 0},
  axisBottom = 'tick',
  axisRight = '',
  axisTop = '',
  showCounts = 'bar',
  headPad = 0,
  duration = 1000,
  interactivity = 'none',
  data = [],
  dataPoints = [],
  dataTrendLines = [],
  taxa = [],
  metrics = [],
  minYear = null,
  maxYear = null,
  minYearTrans = null,
  maxYearTrans = null,
  minCount = null,
  maxCount = null,
  xPadPercent = 0,
  yPadPercent = 0,
  missingValues = 0
} = {}) {

  // xPadPercent and yPadPercent can not be used with charts of bar type.
  if (showCounts === 'bar') {
    xPadPercent = 0
    yPadPercent = 0
  }

  let metricsPlus

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .style('position', 'relative')
    .style('display', 'inline')

  const svg = mainDiv.append('svg')
  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(null, false, svgChart)
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
    const pTrans = []

    const svgsTaxa = taxa.map(t => makeYearly(
      svgChart,
      t,
      taxa,
      data,
      dataPoints,
      dataTrendLines,
      minYear,
      maxYear,
      minYearTrans,
      maxYearTrans,
      minCount,
      maxCount,
      xPadPercent,
      yPadPercent,
      metricsPlus,
      width,
      height,
      axisTop,
      axisBottom,
      showCounts,
      axisLeft,
      yAxisOpts,
      axisRight,
      duration,
      interactivity,
      margin,
      showTaxonLabel,
      taxonLabelFontSize,
      taxonLabelItalics,
      axisLabelFontSize,
      axisLeftLabel,
      axisRightLabel,
      missingValues,
      pTrans
    ))

    const subChartWidth = Number(svgsTaxa[0].attr("width"))
    const subChartHeight = Number(svgsTaxa[0].attr("height"))

    const legendHeight = showLegend ? makeLegend(
      svgChart,
      metricsPlus,
      perRow * (subChartWidth + subChartPad) - headPad,
      legendFontSize,
      headPad,
      showCounts,
      interactivity
    ) + subChartPad : 0

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
        opacity: m.opacity !== 'undefined' ? m.opacity : 0.5,
        colour: m.colour ? m.colour : 'blue',
        fading: iFade,
        strokeWidth: strokeWidth,
        bandUpper: m.bandUpper,
        bandLower: m.bandLower,
        bandFill: m.bandFill,
        bandOpacity: m.bandOpacity,
        bandStroke: m.bandStroke,
        bandStrokeWidth: m.bandStrokeWidth,
        bandStrokeOpacity: m.bandStrokeOpacity,
        points: m.points,
        errorBarUpper: m.errorBarUpper,
        errorBarLower: m.errorBarLower
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

/** 
  * @deprecated yearly is deprecated in favour of the temporal chart.
  * @function setChartOpts
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
  * @param {Array.<Object>} opts.dataPoints - Specifies an array of data objects (see main interface for details).
  * @returns {Promise} promise that resolves when all transitions complete.
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
    if ('minCount' in opts) {
      minCount = opts.minCount
    }
    if ('maxCount' in opts) {
      maxCount = opts.maxCount
    }
    if ('metrics' in opts) {
      metrics = opts.metrics
    }
    if ('data' in opts) {
      data = opts.data
    }
    if ('dataPoints' in opts) {
      dataPoints = opts.dataPoints
    }
    if ('dataTrendLines' in opts) {
      dataTrendLines = opts.dataTrendLines
    }

    if ('taxa' in opts) {
      taxa = opts.taxa
      highlightItem(null, false, svgChart)
    }

    const textWidth = Number(svg.select('.mainChart').attr("width"))
    gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
    gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
    gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)

    let pRet
    if ('taxa' in opts || 'data' in opts || 'minYear' in opts || 'maxYear' in opts || 'metrics' in opts || 'minCount' in opts || 'maxCount' in opts) {
      preProcessMetrics()
      pRet = makeChart()
      gen.positionMainElements(svg, expand)
    } else {
      pRet = Promise.resolve()
    }
    return pRet
  }

/** 
  * @deprecated yearly is deprecated in favour of the temporal chart.
  * @function setTaxon
  * @param {string} opts.taxon - The taxon to display.
  * @returns {Promise} promise that resolves when all transitions complete.
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
  * For single species charts, this allows you to change the taxon displayed.
  */
  function setTaxon(taxon){
    let pRet
    if (taxa.length !== 1) {
      console.log("You can only use the setTaxon method when your chart displays a single taxon.")
      pRet = Promise.resolve()
    } else {
      taxa = [taxon]
      highlightItem(null, false, svgChart)
      pRet = makeChart()
    }
    return pRet
  }

/** 
  * @deprecated yearly is deprecated in favour of the temporal chart.
  * @function getChartWidth
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
  * Return the full width of the chart svg.
  */
  function getChartWidth(){
    return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2]
  }

/** 
  * @deprecated yearly is deprecated in favour of the temporal chart.
  * @function getChartHeight
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
  * Return the full height of the chart svg.
  */
  function getChartHeight(){
    return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3]
  }

/** 
  * @deprecated yearly is deprecated in favour of the temporal chart.
  * @function saveImage
  * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
  * @param {string} filename - Name of the file (without extension) to generate and download.
  * If the filename is falsey (e.g. blank), it will not automatically download the
  * file. (Allows caller to do something else with the data URL which is returned
  * as the promise's resolved value.)
  * @returns {Promise} promise object represents the data URL of the image.
  * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
  * Download the chart as an image file.
  */
  function saveImage(asSvg, filename, info){
    return gen.saveChartImage(svg, expand, asSvg, filename, null, info)
  }


  /**
   * @deprecated yearly is deprecated in favour of the temporal chart.
   * @typedef {Object} api
   * @property {module:yearly~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:yearly~getChartHeight} getChartHeight - Gets and returns the current height of the chart.
   * @property {module:yearly~setChartOpts} setChartOpts - Sets various options for the chart.
   * @property {module:yearly~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts.
   * @property {module:yearly~saveImage} saveImage - Generates and downloads and image file for the SVG.
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    setTaxon: setTaxon,
    saveImage: saveImage
  }

}