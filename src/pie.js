/** @module pie */

import * as d3 from 'd3'
import * as gen from './general'

//https://www.d3-graph-gallery.com/graph/pie_annotation.html
//https://github.com/d3/d3-shape/blob/v2.0.0/README.md#pie

/** 
 * @param {Object} opts - Initialisation options.
 * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
 * @param {string} opts.elid - The id for the dom object created.
 * @param {number} opts.radius - The desired radius of the chart in pixels.
 * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie char. Specify a value for donut chart.
 * @param {number} opts.imageWidth - The width of images in pixels. Images will be resized to this width.
 * @param {string} opts.sort - Sort function. Set to 'asc' for ascending, 'desc' for descending or '' for no sort.
 * @param {string} opts.label - How to label sections. Set to 'value' for raw number, 'percent' for percentage or '' for no sort.
 * @param {string} opts.labelFontSize - Specifies the size of label and legend text.
 * @param {string} opts.labelColour - Specifies the colour of label text.
 * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
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
 * <li> <b>name</b> - the name of the data item uniquely identifies it and is shown in the legend.
 * <li> <b>number</b> - a numeric value associated with the item.
 * <li> <b>colour</b> - an optional colour for the symbol which can be hex format, e.g. #FFA500, 
 * RGB format, e.g. rgb(100, 255, 0) or a named colour, e.g. red. If not specified, a colour will be assigned.
 * <li> <b>image</b> - this optional property allows you to specify the url of an image file
 * which can be displayed when a user selects the associated item.
 * </ul>
 * @returns {module:pie~api} api - Returns an API for the chart.
 */

export function pie({
  // Default options in here
  selector = 'body',
  elid = 'piechart',
  radius = 180,
  innerRadius = 0,
  sort = '',
  label = 'percent',
  labelFontSize = 14,
  labelColour = 'white',
  expand = false,
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
  data = []
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
      highlightItem(null, false)
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
    makePie (data)
    makeLegend (data)
    const svgPie = svgChart.select('.brc-chart-pie')
    const svgLegend = svgChart.select('.brc-chart-legend')
    svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap)
    svgChart.attr("width", Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width")))
    svgChart.attr("height", Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))))
  }

  function makeLegend (data) {

    let svgLegend
    if (svg.select('.brc-chart-legend').size()) {
      svgLegend = svgChart.select('.brc-chart-legend')
    } else {
      svgLegend = svgChart.append('svg').classed('brc-chart-legend', true)
        .attr('overflow', 'auto')
    }

    const uLegendSwatch = svgLegend.selectAll('.legendSwatch')
      .data(data, d => d.name)

    const durationUpdate = uLegendSwatch.nodes().length ? duration : 0
    const durationExit = uLegendSwatch.exit().nodes().length ? duration : 0

    const eLegendSwatch = uLegendSwatch.enter()
      .append('rect')
      .attr('id', (d) => `swatch-${gen.safeId(d.name)}`)
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
      .attr('opacity', 1)
      
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
      .attr('id', (d) => `legend-${gen.safeId(d.name)}`)
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
      .attr('opacity', 1)
      
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
  }

  function makePie (data) {

    //block = true

    let dataDeleted, dataInserted, dataRetained
    const init = !dataPrev
    const dataNew = gen.cloneData(data)
    
    if (init) {
      dataInserted = []
      dataDeleted = []
      dataRetained = []
      dataPrev = []
    } else {
      const prevNames = dataPrev.map(d => d.name)
      const newNames = dataNew.map(d => d.name)

      dataDeleted = dataPrev.filter(d => !newNames.includes(d.name))
      dataDeleted = gen.cloneData(dataDeleted)

      dataInserted = dataNew.filter(d => !prevNames.includes(d.name))
      dataInserted = gen.cloneData(dataInserted)

      dataRetained = dataNew.filter(d => prevNames.includes(d.name))
      dataRetained = gen.cloneData(dataRetained)
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
    const dataComb = gen.cloneData([...dataNew, ...dataDeleted2])

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
              if (dataRetained.length) {
                arcGenerator.outerRadius(d3.interpolate(radius, midRadius)(t))
                arcGenerator.innerRadius(d3.interpolate(innerRadius, midRadius)(t))
              } else {
                arcGenerator.outerRadius(d3.interpolate(radius, innerRadius)(t))
                arcGenerator.innerRadius(innerRadius) 
              }
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
              i = iCurr
              if (dataRetained.length) {
                // Shown inserted arcs in inner ring
                arcGenerator.outerRadius(d3.interpolate(innerRadius, midRadius)(t))
                arcGenerator.innerRadius(innerRadius)
              } else {
                arcGenerator.outerRadius(d3.interpolate(innerRadius, radius)(t))
                arcGenerator.innerRadius(innerRadius)
              }
            } else if (arc.deleted) {
              i = iCurr
              if (dataRetained.length) {
                // Deleted arcs to be kept with inner & outer radius the same (invisible)
                arcGenerator.outerRadius(midRadius)
                arcGenerator.innerRadius(midRadius)
              } else {
                arcGenerator.outerRadius(innerRadius)
                arcGenerator.innerRadius(innerRadius)
              }
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

    let svgPie, gPie
    if (svg.select('.brc-chart-pie').size()) {
      svgPie = svgChart.select('.brc-chart-pie')
      gPie = svgPie.select('g')
    } else {
      svgPie = svgChart.append('svg').classed('brc-chart-pie', true)
        .attr('width', 2 * radius)
        .attr('height', 2 * radius)
        .style('overflow', 'visible')
      gPie = svgPie.append('g')
        .attr('transform', `translate(${radius} ${radius})`)

      gPie.append('image')
        .classed('brc-item-image', true)
        .classed('brc-item-image-hide', true)
        .attr('width', imageWidth)
    }

    // Remove those paths that have been 'deleted'
    // This because in our transition, we never actually remove
    // arcs. Best done here because of better handling of
    // interrupted transitions
    gPie.selectAll("path[data-deleted='true']").remove()

    // map to data
    const uPie =gPie.selectAll('path')
      .data(arcsComb, d => d.data.name)

    const ePie = uPie.enter()
      .append('path')
      .attr('id', (d) => `pie-${gen.safeId(d.data.name)}`)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 1)
      .attr('fill', d => d.data.colour)
      .each(function(d) { this._current = d })

    addEventHandlers(ePie, true)
    const mPie = ePie.merge(uPie)
    // Mark paths corresponding to deleted arcs as
    // deleted so that they can be removed before next 
    // transition
    mPie.attr('data-deleted', arc => arc.deleted)

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
    if (dataInserted.length && dataRetained.length) {
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
    //uPie.exit().remove()  // there is no exit selection 
    trans.on("end", function () {
      // Be careful about doing anything in here in case transition interrupted
      //if (arc.deleted) {
        //d3.select(this).remove()
      //}
      //block = false
    })

    if (label) {

      const arcsNew = d3.pie().value(d => d.number).sortValues(fnSort)(dataNew) 

      const uPieLabels = gPie.selectAll('.labelsPie')
        .data(arcsNew, d => d.data.name)
        
      const total = dataNew.reduce((t, c) => {return t + c.number}, 0)

      const ePieLabels = uPieLabels.enter()
        .append('text')
        .attr('id', (d) => `label-${gen.safeId(d.data.name)}`)
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
            let l = Math.round(d.data.number / total * 100)
            if (l === 0) {
              l = Math.round(d.data.number / total * 1000)/10
            }
            return `${l}%`
          }
        })
        .attr('opacity', 0)
        .transition()
        .duration(transDuration)
        .attrTween('transform', centroidTween)
        .transition()
        .duration(0)
        .attr('opacity', d => {
          if (Math.round(d.data.number / total * 100) === 0) {
            return 0
          } else {
            return 1
          }
        })
      uPieLabels.exit()
        .remove()
    }
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

  function highlightItem (name, show) {
    const i = gen.safeId(name)

    const imgSelected = svg.select('.brc-item-image')

    if (show) {
      svg.selectAll('path').classed('brc-lowlight', true)
      svg.selectAll('.legendSwatch').classed('brc-lowlight', true)
      svg.selectAll('.legendText').classed('brc-lowlight', true)
      svg.selectAll('.labelsPie').classed('brc-lowlight', true)
      svg.select(`#swatch-${i}`).classed('brc-lowlight', false)
      svg.select(`#legend-${i}`).classed('brc-lowlight', false)
      svg.select(`#pie-${i}`).classed('brc-lowlight', false)
      svg.select(`#label-${i}`).classed('brc-lowlight', false)

      svg.selectAll('.labelsPie').classed('brc-highlight', false)
      svg.select(`#label-${i}`).classed('brc-highlight', true)

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
          // console.log('data', data)
          const img = new Image
          img.onload = function() {
            data.imageWidth = imageWidth 
            data.imageHeight = imageWidth * this.height / this.width
            loadImage(data)
          }
          img.src = data.image //'images/Bumblebees.png'
          imgSelected.classed('brc-item-image-hide', false)
        }
      } else {
        imgSelected.classed('brc-item-image-hide', true)
      }
    } else {
      svg.selectAll('.brc-lowlight').classed('brc-lowlight', false)
      imgSelected.classed('brc-item-image-hide', true)
      svg.selectAll('.labelsPie').classed('brc-highlight', false)
    }
  }

  function loadImage(d) {
    const imgSelected = svg.select('.brc-item-image')
    imgSelected.attr('xlink:href', d.image)
    imgSelected.attr('width', d.imageWidth)
    imgSelected.attr('height', d.imageHeight)
    imgSelected.attr("x", -d.imageWidth / 2)
    imgSelected.attr("y", -d.imageHeight / 2)
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
  * @param {Array.<Object>} opts.data - Specifies an array of data objects.
  * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
  * Set's the value of the chart data, title, subtitle and/or footer. If an element is missing from the 
  * options object, it's value is not changed.
  */
  function setChartOpts(opts){

    //if (!block) {

      highlightItem(null, false)

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