/** @module pie */

import * as d3 from 'd3'
import { dataAccessors } from './dataAccess.js'

//https://www.d3-graph-gallery.com/graph/pie_annotation.html
//https://github.com/d3/d3-shape/blob/v2.0.0/README.md#pie

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.radius - The desired radius of the chart in pixels.
 * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie char. Specify a value for donut chart.
 * @param {string} opts.sort - Sort function. Set to 'asc' for ascending, 'desc' for descending or '' for no sort.
 * @param {string} opts.label - How to label sections. Set to 'value' for raw number, 'percent' for percentage or '' for no sort.
 * @param {string} opts.labelFontSize - Set to a font size (pixels).
 * @param {string} opts.labelColour - Specifies the colour of label text.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element.
 * @param {string} opts.backgroundFill - Specifies the background colour of the chart.
 * @param {string} opts.legendSwatchSize - Specifies the size of legend swatches.
 * @param {string} opts.legendSwatchGap - Specifies the size of gap between legend swatches.
 * @param {number} opts.legendWidth - The width of the legend in pixels.
 * @param {string} opts.title - Title for the chart.
 * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
 * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
 * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
 * @param {number} opts.duration - The duration of each transition phase in milliseconds.
 * @param {Array.<Object>} opts.data - Specifies an array of data objects.
 * @returns {module:pie~api} api - Returns an API for the map.
 */
export function pie({
  // Default options in here
  selector = 'body',
  elid = 'piechart',
  radius = 200,
  innerRadius = 0,
  sort = '',
  label = '',
  labelFontSize = 10,
  labelColour = 'black',
  expand = false,
  //backgroundFill = 'white',
  legendSwatchSize = 30,
  legendSwatchGap = 10,
  legendWidth = 250,
  title = '',
  titleFontSize = 24,
  titleAlign = 'left',
  imageWidth = 150,
  duration = 1000,
  interactivity = 'mousemove',
  data = []
} = {}) {

  let dataPrev

  const mainDiv = d3.select(`${selector}`)
    .append('div')
    .attr('id', elid)
    .attr('class', 'brc-chart-pie')
    .style('position', 'relative')
    .style('display', 'inline')

  const chartDiv = mainDiv
    .append('div')

  const svg = chartDiv.append('svg')


  svg.on("click", function() {
    if (interactivity === 'mouseclick') {
      highlightItem(null, false)
    }
  })

  let svgPie, svgLegend
  makeLegend(data)
  makePie(data) 

  const imgSelected = makeImage(svg)
  // Title must come after chart and legend because the 
  // width of those is required to do wrapping for title
  const svgTitle = makeTitle()

  positionElements()

  function positionElements() {

    const width = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"))

    svgLegend.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap)
    svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap)
    svgPie.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap)

    const height = Number(svgTitle.attr("height")) + 2 * legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height")))

    if (expand) {
      svg.attr("viewBox", "0 0 " + width + " " +  height)
    } else {
      svg.attr("width", width)
      svg.attr("height", height)
    }
  }

  function makeTitle () {

    let svgTitle
    if (svg.select('.brc-chart-title').size()) {
      svgTitle = svg.select('.brc-chart-title')
    } else {
      svgTitle = svg.append('svg').classed('brc-chart-title', true)
    }
    
    const chartWidth = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"))
    const lines = wrapText(title, svgTitle, chartWidth)

    const uTitleText = svgTitle.selectAll('.titleText')
      .data(lines)

    uTitleText.enter()
      .append('text')
      .text(d => {
        return d
      })
      .attr("class", "titleText")
      .style('font-size', titleFontSize)

    uTitleText.exit()
      .remove()

    const height = d3.select('.titleText').node().getBBox().height
    const widths = d3.selectAll('.titleText').nodes().map(n => (n.getBBox().width))

    svgTitle.selectAll('.titleText')
      .attr('y', (d, i) => (i + 1) * height)
      .attr('x', (d, i) => {
        if (titleAlign === 'centre') {
          return (chartWidth - widths[i]) / 2
        } else if(titleAlign === 'right') {
          return chartWidth - widths[i]
        } else {
          return 0
        }
      })
    svgTitle.attr("height", height * lines.length)
    return svgTitle
  }

  function makeLegend (data) {

    if (!svgLegend) {
      svgLegend = svg.append('svg').attr('overflow', 'auto')
    }
  
    const uLegendSwatch = svgLegend.selectAll('.legendSwatch')
      .data(data, d => d.name)

    const durationUpdate = uLegendSwatch.nodes().length ? duration : 0
    const durationExit = uLegendSwatch.exit().nodes().length ? duration : 0

    const eLegendSwatch = uLegendSwatch.enter()
      .append('rect')
      .attr('id', (d) => `swatch-${safeId(d.name)}`)
      .classed('legendSwatch', true)
      .attr('y', (d, i) => i * (legendSwatchSize + legendSwatchGap))
      .attr('width', legendSwatchSize)
      .attr('height', legendSwatchSize)
      .style('fill', d => d.colour)
      .attr('opacity', 0)

    addEventHandlers(eLegendSwatch, false)

    eLegendSwatch.transition()
      .delay(durationExit + durationUpdate)
      .duration(duration)
      .attr('opacity', 1)

    uLegendSwatch
      .transition()
      .delay(durationExit)
      .duration(duration)
      .attr('y', (d, i) => i * (legendSwatchSize + legendSwatchGap))
      
    uLegendSwatch.exit()
      .transition()
      .duration(duration)
      .attr('opacity', 0)
      .remove()

    const uLegendText = svgLegend.selectAll('.legendText')
      .data(data, d => d.name)

    const dummyText = svgLegend.append('text').attr('opacity', 0).style('font-size', labelFontSize).text('Dummy')
    let legendTextHeight = dummyText.node().getBBox().height
    dummyText.remove()

    const eLegendText = uLegendText.enter()
      .append('text')
      .text(d => d.name)
      .attr('alignment-baseline', 'middle')
      .attr('id', (d) => `legend-${safeId(d.name)}`)
      .classed('legendText', true)
      .attr('x', () => legendSwatchSize + legendSwatchGap)
      .attr('y', (d, i) => (i + 1) * (legendSwatchSize + legendSwatchGap) - (legendSwatchSize / 2) - (legendTextHeight / 3))
      .style('font-size', labelFontSize)
      .attr('opacity', 0)

    addEventHandlers(eLegendText, false)

    eLegendText.transition()
      .delay(durationExit + durationUpdate)
      .duration(duration)
      .attr('opacity', 1)

    uLegendText
      .transition()
      .delay(durationExit)
      .duration(duration)
      .attr('y', (d, i) => (i + 1) * (legendSwatchSize + legendSwatchGap) - (legendSwatchSize / 2) - (legendTextHeight / 4))
      
    uLegendText.exit()
      .transition()
      .duration(duration)
      .attr('opacity', 0)
      .remove()

    //let legendTextWidth = d3.max(d3.selectAll('.legendText').nodes(), n => n.getBBox().width)
    //svgLegend.attr("width", legendSwatchSize + legendSwatchGap + legendTextWidth)
    svgLegend.attr("width", legendWidth)
    const legendHeight = data.length * (legendSwatchSize + legendSwatchGap) - legendSwatchGap
    svgLegend.attr("height", legendHeight > 0 ? legendHeight : 0)

    return svgLegend
  }

  function makePie (data) {

    let dataDeleted, dataInserted, dataRetained
    const init = !dataPrev
    const dataNew = cloneData(data)
    
    if (init) {
      dataInserted = []
      dataDeleted = []
      dataRetained = []
      dataPrev = []
    } else {
      const prevNames = dataPrev.map(d => d.name)
      const newNames = dataNew.map(d => d.name)

      dataDeleted = dataPrev.filter(d => !newNames.includes(d.name))
      dataDeleted = cloneData(dataDeleted)

      dataInserted = dataNew.filter(d => !prevNames.includes(d.name))
      dataInserted = cloneData(dataInserted)

      dataRetained = dataNew.filter(d => prevNames.includes(d.name))
      dataRetained = cloneData(dataRetained)
    }

    let fnSort
    if (sort === 'asc') {
      fnSort = (a,b) => b-a
    } else if (sort === 'desc') {
      fnSort = (a,b) => a-b
    } else {
      fnSort = null
    }

    const dataDeleted2 = dataDeleted.map(d => {
      const nd = {...d}
      nd.number = 0
      return nd
    })
    const dataComb = cloneData([...dataNew, ...dataDeleted2])

    console.log('dataDeleted', dataDeleted)
    console.log('dataDeleted2', dataDeleted2)
    console.log('dataInserted', dataInserted)
    console.log('dataComb', dataComb)

    const arcsPrev = d3.pie().value(d => d.number).sortValues(fnSort)(dataPrev)
    const arcsComb = d3.pie().value(d => d.number).sortValues(fnSort)(dataComb) 
    
    arcsComb.forEach(arcComb => {
      const prevArc = arcsPrev.find(arcPrev => arcComb.data.name === arcPrev.data.name)
      if (prevArc) {
        arcComb.prevArc = prevArc
        if (dataDeleted.find(d => d.name === arcComb.data.name)) {
          arcComb.deleted = true
        }
      }
      if (dataInserted.find(d => d.name === arcComb.data.name)) {
        arcComb.inserted = true
      }
    })

    // Now data processing complete, reset dataPrev variable
    dataPrev = data

    console.log('arcsComb', arcsComb)

    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius)
    const arcGeneratorLables = d3.arc().innerRadius(innerRadius).outerRadius(radius)

    // Good stuff here: https://bl.ocks.org/mbostock/4341417
    // and here https://bl.ocks.org/mbostock/1346410
    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(arc, _this, trans) {
      let i
      const iPrev = d3.interpolate(_this._current, arc.prevArc)
      const iCurr = d3.interpolate(_this._current, arc)
      const midRadius = innerRadius + (radius-innerRadius)/2

      return function(t) {
        if (trans === 1) {
          if (init) {
            i = iCurr
            arcGenerator.outerRadius(d3.interpolate(innerRadius, radius)(t))
            arcGenerator.innerRadius(innerRadius) 
          } else if (dataInserted.length) {
            if (arc.deleted) {
              // Previous arcs to be deleted
              i = iPrev
              arcGenerator.outerRadius(d3.interpolate(radius, midRadius)(t))
              arcGenerator.innerRadius(d3.interpolate(innerRadius, midRadius)(t))
            } else if (arc.inserted) {
              // New arcs to be inserted (invisibly)
              i = iCurr
              arcGenerator.outerRadius(innerRadius)
              arcGenerator.innerRadius(innerRadius)
            } else {
              // Existing arcs to be shrunk to outer ring
              i = iPrev
              arcGenerator.outerRadius(radius)
              arcGenerator.innerRadius(d3.interpolate(innerRadius, midRadius)(t))
            }
          } else if (dataDeleted.length) {
            if (arc.deleted) {
              // Previous arcs to be deleted
              i = iPrev
              arcGenerator.outerRadius(d3.interpolate(radius, innerRadius)(t))
              arcGenerator.innerRadius(innerRadius)
            } else {
              i = iPrev
              arcGenerator.outerRadius(radius)
              arcGenerator.innerRadius(innerRadius)
            }
          } else {
            i = iCurr
            arcGenerator.outerRadius(radius)
            arcGenerator.innerRadius(innerRadius)
          }
        }

        if (trans === 2) {
          if (dataInserted.length) {
            if (arc.inserted) {
              // Shown inserted arcs in inner ring
              i = iCurr
              arcGenerator.outerRadius(d3.interpolate(innerRadius, midRadius)(t))
              arcGenerator.innerRadius(innerRadius)
            } else if (arc.deleted) {
              // Delted arcs to be kept with inner & outer radius the same (invisible)
              i = iCurr
              arcGenerator.outerRadius(midRadius)
              arcGenerator.innerRadius(midRadius)
            } else {
              // Existing arcs to be shown in new positions in outer ring
              i = iCurr
              arcGenerator.outerRadius(radius)
              arcGenerator.innerRadius(midRadius)
            }
          } else {
            if (arc.deleted) {
              i = iCurr
              arcGenerator.outerRadius(innerRadius)
              arcGenerator.innerRadius(innerRadius)
            } else {
              i = iCurr
              arcGenerator.outerRadius(radius)
              arcGenerator.innerRadius(innerRadius)
            }
          }
        }

        if (trans === 3) {
          if (arc.inserted) {
            // Shown inserted arcs in inner ring
            i = iCurr
            arcGenerator.outerRadius(d3.interpolate(midRadius, radius)(t))
            arcGenerator.innerRadius(innerRadius)
          } else if (!arc.deleted) {
            // Existing arcs to be shown in new positions in outer ring
            i = iCurr
            arcGenerator.outerRadius(radius)
            arcGenerator.innerRadius(d3.interpolate(midRadius, innerRadius)(t))
          } else {
            // Deletions - do nothing
            i = iCurr
          }
        }
         _this._current = i(0)
        return arcGenerator(i(t))
      }
    }

    function centroidTween(a) {
      const i = d3.interpolate(this._current, a)
      this._current = i(0)
      return function(t) {
        return `translate(${arcGeneratorLables.centroid(i(t))})`
      }
    }

    //let svgPie, gPie
    let gPie
    if (svg.select('.brc-chart-pie').size()) {
      svgPie = svg.select('.brc-chart-pie')
      gPie = svgPie.select('g')
    } else {
      svgPie = svg.append('svg').classed('brc-chart-pie', true)
        .attr('width', 2 * radius)
        .attr('height', 2 * radius)
      gPie = svgPie.append('g')
        .attr('transform', `translate(${radius} ${radius})`)
    }

    // map to data
    const uPie = gPie.selectAll('path')
      .data(arcsComb, d => d.data.name)

    const ePie = uPie.enter()
      .append('path')
      .attr('id', (d) => `pie-${safeId(d.data.name)}`)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 1)
      .attr('fill', d => d.data.colour)
      .each(function(d) { this._current = d })

    addEventHandlers(ePie, true)

    const mPie = ePie.merge(uPie)
    let trans
    let transDuration = duration
    
    // Transition 1
    trans = mPie.transition()
      .duration(duration)
      .attrTween('d', function (arc) {
        return arcTween(arc, this, 1)
    })

    // Transition 2 
    if (dataDeleted.length || dataInserted.length) {
      trans = trans.transition()
        .duration(duration)
        .attrTween('d', function (arc) {
          return arcTween(arc, this, 2)
        })
      transDuration += duration
    }

    // Transition 3
    if (dataInserted.length) {
      trans = trans.transition()
        .duration(duration)
        .attrTween('d', function (arc) {
          return arcTween(arc, this, 3)
        })
      transDuration += duration
    }

    // Because we always retain deleted items in order
    // to make smooth transitions, the D3 exit selection
    // is never populated. Instead we have to remove
    // invisible deleted DOM items (SVG paths) ourselves after 
    // the last transition to avoid messing up the transition
    // next time the data changes.
    //uPie.exit().remove()
    trans.on("end", function (arc) {
      if (arc.deleted) {
        d3.select(this).remove()
      }
    })

    if (label) {

      const arcsNew = d3.pie().value(d => d.number).sortValues(fnSort)(dataNew) 

      const uPieLabels = gPie.selectAll('.labelsPie')
        .data(arcsNew, d => d.data.name)
        
      const total = dataNew.reduce((t, c) => {return t + c.number}, 0)

      const ePieLabels = uPieLabels.enter()
        .append('text')
        .attr('id', (d) => `label-${safeId(d.data.name)}`)
        .attr("class", "labelsPie")
        .style('text-anchor', 'middle')
        .style('font-size', labelFontSize)
        .style('fill', labelColour)

      addEventHandlers(ePieLabels, true)

      ePieLabels.merge(uPieLabels)
        .text(d => {
          if (label ==='value') {
            return d.data.number
          } else if (label ==='percent') {
              return `${Math.round(d.data.number / total * 100)}%`
          }
        })
        .attr('opacity', 0)
        .transition()
        .duration(transDuration)
        .attrTween('transform', centroidTween)
        .transition()
        .duration(0)
        .attr('opacity', 1)
      uPieLabels.exit()
        .remove()
    }
  }

  function makeImage(svg) {
    const img = svg.append('image')
      .classed('brc-item-image-hide', true)
      //.attr('xlink:href', 'images/Bumblebees.png')
      .attr('width', imageWidth)
    return img
  }

  function wrapText(text, svgTitle, maxWidth) {

    const textSplit = text.split(" ")
    const lines = ['']
    let line = 0

    for (let i=0; i < textSplit.length; i++) {

      let workingText = `${lines[line]} ${textSplit[i]}`
      workingText = workingText.trim()

      const txt = svgTitle.append('text')
        .text(workingText)
        .style('font-size', titleFontSize)

      const width = txt.node().getBBox().width

      if (width > maxWidth) {
        line++
        lines[line] = textSplit[i]
      } else {
        lines[line] = workingText
      }

      txt.remove()
    }
    return lines
  }

  function addEventHandlers(sel, isArc) {
    sel
      .on("mouseover", function(d) {
      if (interactivity === 'mousemove') {
          highlightItem(isArc ? d.data.name : d.name, true)
        }
      })
      .on("mouseout", function(d) {
        if (interactivity === 'mousemove') {
          highlightItem(isArc ? d.data.name : d.name, false)
        }
      })
      .on("click", function(d) {
        if (interactivity === 'mouseclick') {
          highlightItem(isArc ? d.data.name : d.name, true)
          d3.event.stopPropagation()
        }
      })
  }

  function safeId(text) {
    return text ? text.replace(/\W/g,'_') : null
  }

  function highlightItem (name, show) {
    const i = safeId(name)
    if (show) {
      svg.selectAll('path').classed('brc-lowlight', true)
      svg.selectAll('.legendSwatch').classed('brc-lowlight', true)
      svg.selectAll('.legendText').classed('brc-lowlight', true)
      svg.select(`#swatch-${i}`).classed('brc-lowlight', false)
      svg.select(`#legend-${i}`).classed('brc-lowlight', false)
      svg.select(`#pie-${i}`).classed('brc-lowlight', false)

      const data = dataPrev.find(d => name === d.name)

      if (data && data.image) {
        // Loading image into SVG and setting to specified width
        // and then querying bbox returns zero height. So in order
        // to get the height of the image (required for correct)
        // positioning, it is necessary first to load the image and
        // get the dimensions.
        if (data.imageHeight) {
          if (imgSelected.attr('xlink:href') !== data.image) {
            // The loaded image is different from that of the
            // highlighted item, so load.
            loadImage(data)
          }
          imgSelected.classed('brc-item-image-hide', false)
        } else {
          const img = new Image
          img.onload = function() {
            data.imageWidth = imageWidth 
            data.imageHeight = imageWidth * this.height / this.width
            loadImage(data)
          }
          img.src = 'images/Bumblebees.png'
          imgSelected.classed('brc-item-image-hide', false)
        }
      }
    } else {
      svg.selectAll('.brc-lowlight').classed('brc-lowlight', false)
      imgSelected.classed('brc-item-image-hide', true)
    }
  }

  function loadImage(d) {
    imgSelected.attr('xlink:href', d.image)
    imgSelected.attr('width', d.imageWidth)
    imgSelected.attr('height', d.imageHeight)
    imgSelected.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap + radius - d.imageWidth / 2)
    imgSelected.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap + radius - d.imageHeight / 2)
  }

  function cloneData(data) {
    return data.map(d => { return {...d}})
  }

/** @function setChartTitle
  * @param {string} text - text for chart title.
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
  * Set's the value of the chart title.
  */
  function setChartTitle(text){
    title = text
    makeTitle()
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

/** @function setChartData
  * @param {Array.<Object>} opts.data - Specifies an array of data objects.
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
  * Set's the data array to be bound to the chart.
  */
  function setChartData(newData){
    
    highlightItem(null, false)
    makePie(newData)
    makeLegend(newData)
    positionElements()
  }

  /**
   * @typedef {Object} api
   * @property {module:pie~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
   * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
   * @property {module:pie~setChartTitle} setChartTitle - Sets the title of the chart. 
   * @property {module:pie~setChartData} setChartData - Sets the data for the chart. 

   */
  return {
    getChartHeight: getChartHeight,
    getChartWidth: getChartWidth,
    setChartTitle: setChartTitle,
    setChartData: setChartData,
  }

}