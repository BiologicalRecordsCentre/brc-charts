/** @module phen1 */

import * as d3 from 'd3'

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.width - The width of the chart in pixels.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
 * @param {string} opts.labelP1 - Label for time period 1.
 * @param {string} opts.labelP2 - Label for time period 2.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.subtitle - Subtitle for the chart.
 * @param {string} opts.footer - Footer for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.footerFontSize - Font size (pixels) of chart title.
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
 * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
 * <ul>
 * <li> <b>taxon</b> - name of a taxon.
 * <li> <b>week</b> - a number between 1 and 52 indicating the week of the year.
 * <li> <b>p1</b> - a count for the first time period. 
 * <li> <b>p2</b> - a count for the second time period. 
 * </ul>
 * @returns {module:phen1~api} api - Returns an API for the chart.
 */

export function phen1({
  // Default options in here
  selector = 'body',
  elid = 'phen1-chart',
  width = 500,
  labelP1 = 'Period 1',
  labelP2 = 'Period 2',
  expand = false,
  title = '',
  subtitle = '',
  footer = '',
  titleFontSize = 24,
  subtitleFontSize = 16,
  footerFontSize = 14,
  titleAlign = 'left',
  subtitleAlign = 'left',
  footerAlign = 'left',
  duration = 1000,
  data = []
} = {}) {

  let dataPrev

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-phen')
    .style('position', 'relative')
    .style('display', 'inline')

  // const chartDiv = mainDiv
  //   .append('div')

  const svg = mainDiv.append('svg').attr('overflow', 'visible')

  let svgPhen1, svgTitle, svgSubtitle, svgFooter
  makePhen(data) 
  // Title must come after chart and legend because the 
  // width of those is required to do wrapping for title
  //svgTitle = makeText (title, svgTitle, 'titleText', titleFontSize, titleAlign)
  //svgSubtitle = makeText (subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign)
  //svgFooter = makeText (footer, svgFooter, 'footerText', footerFontSize, footerAlign)
  //positionElements()


  function positionElements() {

    const width = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"))

    svgSubtitle.attr("y", Number(svgTitle.attr("height")))
    svgLegend.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap)
    svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap)
    svgPie.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap)
    svgFooter.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))))
    
    const height = Number(svgTitle.attr("height")) + 
      Number(svgSubtitle.attr("height")) + 
      legendSwatchGap + 
      Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))) + 
      Number(svgFooter.attr("height"))

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

    const chartWidth = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"))
    const lines = wrapText(text, svgText, chartWidth, fontSize)

    console.log(classText, text, lines)

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

    console.log('lines', svgText.select(`.${classText}`).size())
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

  function makePhen (data) {

    const init = !dataPrev
    console.log(data)

    //const taxon = 'Aglais io'
    const taxon = 'Pieris napi'

    let cData = data.filter(d => d.taxon === taxon).sort((a, b) => (a.week > b.week) ? 1 : -1)

    const width = 600
    const height = 400
    const margin = 50
  
    //let gPie
    if (svg.select('.brc-chart-phen1').size()) {
      svgPhen1 = svg.select('.brc-chart-phen1')
      //gPie = svgPie.select('g')
    } else {
      svgPhen1 = svg.append('svg').classed('brc-chart-phen1', true)
        .attr('width', width + 2 * margin)
        .attr('height', height + 2 * margin)
      // gPie = svgPie.append('g')
      //   .attr('transform', `translate(${radius} ${radius})`)
    }

    const yMax = Math.max(...cData.map(d => d.p2))
    console.log('yMax', yMax)
    const xScale = d3.scaleLinear().domain([1, 52]).range([0, width])
    const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0])

    const line = d3.line()
      .curve(d3.curveBasis)
      .x(d => xScale(d.week))
      .y(d => yScale(d.p2))

    console.log('xScale result', xScale(12))
    console.log('yScale result', yScale(300))
    console.log('line result', line([{week: 10, p2: 200}, {week: 12, p2: 300}]))

    const lines = svgPhen1.selectAll("lines")
      .data([cData])
      .enter()
      .append("g")

    lines.append("path")
      .attr("d", function(d) { 
        console.log(d)
        return line(d) 
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

    svgTitle = makeText (title, svgTitle, 'titleText', titleFontSize, titleAlign)
    svgSubtitle = makeText (subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign)
    svgFooter = makeText (footer, svgFooter, 'footerText', footerFontSize, footerAlign)

    if ('data' in opts) {
      makePhen(opts.data)
    }

    positionElements()
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

   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartOpts: setChartOpts,
  }

}