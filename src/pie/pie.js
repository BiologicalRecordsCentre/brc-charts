/** @module pie */

import * as d3 from 'd3'
import * as gen from '../general'
import { makePie } from './makepie'
import { makeLegend } from './legend'
import { highlightItem} from './highlightitem'

//https://www.d3-graph-gallery.com/graph/pie_annotation.html
//https://github.com/d3/d3-shape/blob/v2.0.0/README.md#pie

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.strokeWidth - The desired width of the line delineating chart segments in pixels.
 * @param {number} opts.radius - The desired radius of the chart in pixels.
 * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie chart. Specify a value for donut chart.
 * If your data specify more than one dataset (for concentric donuts), this value is also the out-radius of the second set.
 * @param {number} opts.innerRadius2 - The desired inner radius of the second dataset in pixels, for a donut chart with two concentric donuts.
 * Default of zero gives a pie char. Specify a value for donut chart.
 * @param {number} opts.imageWidth - The width of images in pixels. Images will be resized to this width.
 * @param {string} opts.sort - Sort function. Set to 'asc' for ascending, 'desc' for descending or '' for no sort.
 * @param {string} opts.label - How to label sections. Set to 'value' for raw number, 'percent' for percentage or
 * 'pervalue' for percentage and count together.
 * @param {string} opts.labelFontSize - Specifies the size of label and legend text.
 * @param {string} opts.labelColour - Specifies the colour of label text.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
 * @param {string} opts.legendTitle - Specifies text, if required, for a legend title.
 * @param {string} opts.legendTitle2 - Specifies text, if required, for a legend title for second dataset (inner concentric donut).
 * @param {string} opts.legendTitleFontSize - Font size (pixels) of legend title(s).
 * @param {string} opts.legendSwatchSize - Specifies the size of legend swatches.
 * @param {string} opts.legendSwatchGap - Specifies the size of gap between legend swatches.
 * @param {number} opts.legendWidth - The width of the legend in pixels.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.subtitle - Subtitle for the chart.
 * @param {string} opts.footer - Footer for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
 * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
 * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>set</b> - a number to indicate to which 'dataset' this item belongs. Used when concentric donuts are requred.
 * <li> <b>name</b> - the name of the data item uniquely identifies it and is shown in the legend.
 * <li> <b>number</b> - a numeric value associated with the item.
 * <li> <b>colour</b> - an optional colour for the symbol which can be hex format, e.g. #FFA500, 
 * RGB format, e.g. rgb(100, 255, 0) or a named colour, e.g. red. If not specified, a colour will be assigned.
 * <li> <b>image</b> - this optional property allows you to specify the url of an image file
 * which can be displayed when a user selects the associated item.
 * </ul>
 * @param {function} opts.callback - A callback function executed when a pie segment is highlighted. Gets passed
 * the name property of the highlighted data.
 * @returns {module:pie~api} api - Returns an API for the chart.
 */

export function pie({
  // Default options in here
  selector = 'body',
  elid = 'piechart',
  strokeWidth = 2,
  radius = 180,
  innerRadius = 0,
  innerRadius2 = 0,
  sort = '',
  label = 'percent',
  labelFontSize = 14,
  labelColour = 'white',
  expand = false,
  legendTitle = '',
  legendTitle2 = '',
  legendTitleFontSize = 16,
  legendSwatchSize = 30,
  legendSwatchGap = 10,
  legendWidth = 200,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 14,
  titleAlign = 'left',
  subtitleAlign = 'left',
  footerAlign = 'left',
  imageWidth = 150,
  duration = 1000,
  interactivity = 'mousemove',
  data = [],
  callback = function(){return}
} = {}) {

  let dataPrev
  //let block = false

  colourData(data)

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-pie')
    .style('position', 'relative')
    .style('display', 'inline')

  const chartDiv = mainDiv
    .append('div')

  const svg = chartDiv.append('svg').attr('overflow', 'visible')
  const svgChart = svg.append('svg').attr('class', 'mainChart')

  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(svg, null, false, dataPrev, imageWidth, callback)
    }
  })

  makeChart(data)
  const textWidth = Number(svgChart.attr("width"))
  // Texts must come after chart and legend because the 
  // width of those is required to do wrap text
  gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
  gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
  gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)
  gen.positionMainElements(svg, expand)

  function makeChart(data) {

    dataPrev = makePie (data, dataPrev, sort, strokeWidth, radius, innerRadius, innerRadius2, svg, svgChart, imageWidth, interactivity, duration, label, labelColour, labelFontSize, callback)
    
    makeLegend (data, svg, svgChart, legendWidth, labelFontSize, legendSwatchSize, legendSwatchGap, legendTitle, legendTitle2, legendTitleFontSize, duration, interactivity, dataPrev, imageWidth, callback)
    const svgPie = svgChart.select('.brc-chart-pie')
    const svgLegend = svgChart.select('.brc-chart-legend')
    svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap)
    svgChart.attr("width", Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width")))
    svgChart.attr("height", Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))))
  }

  function colourData(data) {
    data.forEach((d,i) => {
      if (!d.colour) {
        if (i < 10) {
          d.colour = d3.schemeCategory10[i]
        }
        else if (i < 18) {
          d.colour = d3.schemeDark2[i - 10]
        }
        else if (i < 26) {
          d.colour = d3.schemeAccent[i - 18]
        }
        else {
          d.colour = d3.interpolateSpectral(Math.random())
        }
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
  * @param {number} opts.radius - The desired radius of the chart in pixels.
  * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie chart. Specify a value for donut chart.
  * If your data specify more than one dataset (for concentric donuts), this value is also the out-radius of the second set.
  * @param {number} opts.innerRadius2 - The desired inner radius of the second dataset in pixels, for a donut chart with two concentric donuts.
  * Default of zero gives a pie char. Specify a value for donut chart.
  * @param {string} opts.legendTitle - Specifies text, if requiredi, for a legend title.
  * @param {string} opts.legendTitle2 - Specifies text, if required, for a legend title for second dataset (inner concentric donut).
  * @param {Array.<Object>} opts.data - Specifies an array of data objects.
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
  * Set's the value of the chart data, title, subtitle and/or footer. If an element is missing from the 
  * options object, it's value is not changed.
  */
  function setChartOpts(opts){

    //if (!block) {

      highlightItem(svg, null, false, dataPrev, imageWidth, callback)

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
      if ('radius' in opts) {
        radius = opts.radius
      }
      if ('innerRadius' in opts) {
        innerRadius = opts.innerRadius
      }
      if ('innerRadius2' in opts) {
        innerRadius2 = opts.innerRadius2
      }
       if ('legendTitle' in opts) {
        legendTitle = opts.legendTitle
      }
      if ('legendTitle2' in opts) {
        legendTitle2 = opts.legendTitle2
      }

      const textWidth = Number(svgChart.attr("width"))
      gen.makeText (title, 'titleText', titleFontSize, titleAlign, textWidth, svg)
      gen.makeText (subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg)
      gen.makeText (footer, 'footerText', footerFontSize, footerAlign, textWidth, svg)

      if ('data' in opts) {
        colourData(opts.data)
        makeChart(opts.data)
      }

      //positionElements()
      gen.positionMainElements(svg, expand)
    // } else {
    //   console.log('Transition in progress')
    // }
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

/** @function saveImage
  * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
  * @param {string} filename - Name of the file (without extension) to generate and download.
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
  * Download the chart as an image file.
  */
  function saveImage(asSvg, filename){
    gen.saveChartImage(svg, expand, asSvg, filename) 
  }

  /**
   * @typedef {Object} api
   * @property {module:pie~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:pie~setChartOpts} setChartOpts - Sets text options for the chart. 
   * @property {module:pie~saveImage} saveImage - Generates and downloads and image file for the SVG. 
   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
    saveImage: saveImage
  }

}