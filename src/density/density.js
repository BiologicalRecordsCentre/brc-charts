// README (updated 15/07/2022)
// This chart is designed to show one or more density plots
// derived from frequency data (data)
// It was created to facilitate the BSBI 2020 Atlas website and
// although some features have been generalised, it contains some
// code that is specific for that use case.
// It is currently undocumented.

import * as d3 from 'd3'
import { transPromise, saveChartImage } from '../general'

export function density({
  // Default options in here
  selector = 'body',
  elid = 'density-chart',
  width = 300,
  height = 200,
  margin = {left: 35, right: 0, top: 20, bottom: 5},
  expand = false,
  axisLabelFontSize = 10,
  axisLeft = 'tick',
  axisBottom = 'tick',
  axisRight = '',
  axisTop = '',
  axisLeftLabel = '',
  axisBottomLabel = '',
  duration = 1000,
  xMin = null,
  xMax = null,
  ylines = [],
  xlines = [],
  data = [],
  styles = [],
  scaleHeight = false
} = {}) {

  const updateChart = makeChart(xMin, xMax, data, xlines, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisBottomLabel, axisLabelFontSize, duration, styles, scaleHeight)

  return {
    updateChart: updateChart,
    saveImage: (asSvg, filename) => {
      console.log('generate density image')
      saveChartImage(d3.select(`#${elid}`), expand, asSvg, filename) 
    }
  }
}

function maxX(data) {
  return Math.max(...data.map(ds => Math.max(...ds.map(d => d.slope))))
}
function minX(data) {
  return Math.min(...data.map(ds => Math.min(...ds.map(d => d.slope))))
}

function makeChart(xMin, xMax, data, xlines, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisBottomLabel, axisLabelFontSize, duration, styles, scaleHeight) {

  const svgWidth = width + margin.left + margin.right
  const svgHeight = height + margin.top + margin.bottom

  // Append the chart svg
  const svgDensity = d3.select(`${selector}`)
    .append('svg')
    .attr('id', elid)
    .style('font-family', 'sans-serif')

  // Size the chart svg
  if (expand) {
    svgDensity.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
  } else {
    svgDensity.attr("width", svgWidth)
    svgDensity.attr("height", svgHeight)
  }

  // Axis labels
  if (axisLeftLabel) {
    svgDensity.append("text")
      .attr("transform", `translate(${axisLabelFontSize},${margin.top + height/2}) rotate(270)`)
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisLeftLabel) 
  }
  if (axisBottomLabel) {
    svgDensity.append("text")
      .attr("transform", `translate(${margin.left + width/2},${margin.top + height + margin.bottom - axisLabelFontSize})`)
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisBottomLabel) 
  }

  // Create axes and position within SVG
  let tAxis, bAxis, lAxis, rAxis
  if (axisLeft === 'on' || axisLeft === 'tick') {
    lAxis = svgDensity.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`) 
  }
  if (axisBottom === 'on' || axisBottom === 'tick') {
    bAxis = svgDensity.append("g")
      .attr("transform", `translate(${margin.left},${margin.top + height})`)
  }
  if (axisTop === 'on') {
    tAxis = svgDensity.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  }
  if (axisRight === 'on') {
    rAxis = svgDensity.append("g")
      .attr("transform", `translate(${margin.left + width}, ${margin.top})`)
  }

  // Create g element for chart elements
  const gChart1 = svgDensity.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
  const gChart2 = svgDensity.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Create the API function for updating chart
  const updateChart = makeUpdateChart(svgDensity, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, styles)
  
  // Update the chart with current data
  updateChart(data, xMin, xMax, xlines, ylines, scaleHeight)

  // Return the api
  return updateChart
}

function makeUpdateChart(
  svg,
  width,
  height,
  tAxis,
  bAxis,
  lAxis,
  rAxis,
  axisBottom,
  duration,
  gChart1,
  gChart2,
  styles,
) {
  return (data, xMin, xMax, xlines, ylines, scaleHeight) => {

    // d3 transition object
    const t = svg.transition()
        .duration(duration)
    let pTrans = []

    // Set ylines and xlines to empty array if not set
    if (!xlines) xlines = []
    if (!ylines) ylines = []
    
    // Data - do any data pre-processing here
    const dataWork = data
    
    // Adjustments - do any min/max adjustments here
    let xMinBuff, xMaxBuff
    if (xMin !== null && xMax !== null && typeof xMin !== 'undefined' && typeof xMax !== 'undefined') { 
      xMinBuff = xMin
      xMaxBuff = xMax
    } else {
      xMinBuff = minX(dataWork)
      xMaxBuff = maxX(dataWork)
      // Add a margin to min/max values
      xMinBuff = xMinBuff - (xMaxBuff - xMinBuff) / 50
      xMaxBuff = xMaxBuff + (xMaxBuff - xMinBuff) / 50
    }

    // X value scale
    const xScale = d3.scaleLinear().domain([xMinBuff, xMaxBuff]).range([0, width])

    // !!!!!!!!!!!!!!!! Non-general custom scale required for BSBI atlas
    const custScale = d3.scaleOrdinal()
      .domain(['', '- -', '-', '0', '+', '+ +', ''])
      .range([xScale(xMinBuff), xScale(-0.004 - (-0.004-xMinBuff)/2), xScale(-0.0025), xScale(0), xScale(0.0025), xScale(0.004 + (xMaxBuff-0.004)/2), xScale(xMaxBuff)])

    // Compute kernel density estimation
    const bandwidths = dataWork.map(ds => {
      const dataMin = Math.min(...ds.map(d => d.slope))
      const dataMax = Math.max(...ds.map(d => d.slope))
      const workMin = xMin === null ? dataMin : dataMin < xMin ? xMin : dataMin
      const workMax = xMax === null ? dataMax : dataMax > xMax ? xMax : dataMax
      return (workMax-workMin)/8
    })
    //console.log('bandwidths', bandwidths)

    const densities = dataWork.map((ds,i) => {
      //const ticks =  xScale.ticks(100)
      const incr =  (xMaxBuff-xMinBuff)/99
      const ticks = d3.range(xMinBuff, xMaxBuff+incr, incr) // For transitions need consistent number of ticks
      const kde = kernelDensityEstimator(kernelEpanechnikov(bandwidths[i]), ticks)
      return kde(ds.map(d => d.slope))
    })

    // For some reason which I don't understand, x values can occassionally overshoot
    // xMaxBuff - so correct.
    densities.forEach(ds => {
      ds.forEach(d => {
        if (d[0] > xMaxBuff) d[0] = xMaxBuff
      })
    })

    // Y value scales must be done on the density values
    // Add a buffer of 1/50 range so y value doesn't go to top of chart
    // Create an overall scale.
    const maxDensity = Math.max(...densities.map(ds => Math.max(...ds.map(d => d[1]))))
    const yScale = d3.scaleLinear().domain([0, maxDensity * 1.02]).range([height, 0])
    // Create a Y scale for each density curve. If the value of scaleHeight is set to false,
    // these scales will all be identical, but if set to true then they will differ so that
    // maximum value of each curve achieves the same height.
    const yScales = densities.map(ds => {
      if (scaleHeight) {
        const maxDensity = Math.max(...ds.map(d => d[1]))
        return d3.scaleLinear().domain([0, maxDensity * 1.02]).range([height, 0])
      } else {
        return yScale
      }
    })

    // Generate axes
    if (tAxis) {
       transPromise(tAxis.transition(t)
        .call(d3.axisTop()
        .scale(data.length ? custScale : xScale) 
        .tickSize([0])
        .ticks(5)
        .tickSizeOuter(0)), pTrans)
    }

    if (bAxis) {
       transPromise(bAxis.transition(t)
        .call(d3.axisBottom()
        .scale(xScale)
        .ticks(5)), pTrans)
    }
    if (lAxis) {
       transPromise(lAxis.transition(t)
        .call(d3.axisLeft()
        .scale(yScale)
        .tickValues([])), pTrans)
        //.ticks(5))
    }
    if (rAxis) {
       rAxis
        .call(d3.axisRight()
        .scale(yScale)
        .tickValues([])
        .tickSizeOuter(0))
    }

    // Line path generator
    const linePath =  d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))

    const linePaths = yScales.map(s => {
      return d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(d[0]))
        .y(d => s(d[1]))
    })

    if (dataWork.length) {
      // console.log('dataWork', dataWork[0])
      // console.log('densities', densities[0])
      // console.log('linepath', linePath(densities[0]))
    }
    
    // Generate density lines
    pTrans = [...pTrans, ...d3Density(gChart1, densities, linePaths, styles, t)]

    // Add path to ylines and generate
    ylines.forEach(l => {
      l.path = linePath([[xMinBuff, l.y], [xMaxBuff, l.y]])
    })
    pTrans = [...pTrans, ...d3Line(gChart1, ylines, 'ylines', t)]

    // Add path to xlines and generate
    xlines.forEach(l => {
      l.path = linePath([[l.x, 0], [l.x, maxDensity * 1.02]])
    })
    pTrans = [...pTrans, ...d3Line(gChart1, xlines, 'xlines', t)]

    return Promise.allSettled(pTrans)
  }
}

function d3Density(gChart, data, linePaths, styles, t) {

  const pTrans = []

  gChart.selectAll(`.density-line`)
    .data(data)
    .join(
      enter => enter.append('path')
        .attr("opacity", 0)
        .attr("d", (d,i) => linePaths[i](d))
        .attr("class", "density-line")
        .style('fill', 'none')
        .style('stroke', (d,i) => getStyle(styles, i).stroke)
        .style('stroke-width', (d,i) => getStyle(styles, i).strokeWidth),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
        .attr("opacity", 1)
        .attr("d", (d,i) => linePaths[i](d)), pTrans))

  return pTrans
}

function d3Line(gChart, lines, lineClass, t) {

  const pTrans = []

  // Horizontal y lines
  gChart.selectAll(`.${lineClass}`)
    .data(lines)
    .join(
      enter => enter.append('path')
        .attr('d', d => d.path)
        .attr('class', lineClass)
        .style('stroke', d => d.stroke)
        .style('stroke-width', d => d.strokeWidth)
        .style ('stroke-dasharray', d => d.strokeDasharray)
        .style('opacity', 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
      .attr('d', d => d.path)
      .style('opacity', 1), pTrans))

  return pTrans
}

// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v) })]
    })
  }
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0
  }
}

function getStyle(styles, i) {
  let style
  if (styles[i]) {
    style = styles[i]
  } else {
    style = {}
  }
  // Default styles
  style.stroke = style.stroke ? style.stroke : 'black'
  style.strokeWidth = style.strokeWidth ? style.strokeWidth : 1
  style.strokeDasharray = style.strokeDasharray ? style.strokeDasharray : '1'

  return style
}