import * as d3 from 'd3'
import { xAxisYear } from '../general'

export function trend3({
  // Default options in here
  selector = 'body',
  elid = 'trend3-chart',
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
  duration = 1000,
  yearMin = 1949,
  yearMax = 2019,
  yMin = null,
  yMax = null,
  adjust = false,
  ylines = [],
  data = [],
  means = [],
  style = {}
} = {}) {

  // Ensure default style properties are present
  style.vStroke = style.vStroke ? style.vStroke : 'black'
  style.vStrokeWidth = style.vStrokeWidth ? style.vStrokeWidth : 2
  style.vOpacity = style.vOpacity ? style.vOpacity : 0.1
  style.mFill = style.mFill ? style.mFill : 'white'
  style.mRad = style.mRad ? style.mRad : 2
  style.mStroke = style.mStroke ? style.mStroke : 'black'
  style.mStrokeWidth = style.mStrokeWidth ? style.mStrokeWidth : 1
  style.sdStroke = style.sdStroke ? style.sdStroke : 'black'
  style.sdStrokeWidth = style.sdStrokeWidth ? style.sdStrokeWidth : 1

  const updateChart = makeChart(yMin, yMax, adjust, yearMin, yearMax, data, means, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style)

  return {
    updateChart: updateChart
  }
}

function maxY(data, means) {
  const dMax = Math.max(...data.map(d =>  Math.max(d[0].v, d[1].v)))
  const mMax = Math.max(...means.map(d => d.mean + d.sd))
  return Math.max(dMax, mMax)
}
function minY(data, means) {
  const dMin = Math.min(...data.map(d => Math.min(d[0].v, d[1].v)))
  const mMin = Math.min(...means.map(d => d.mean - d.sd))
  return Math.min(dMin, mMin)
}

function makeChart(yMin, yMax, adjust, yearMin, yearMax, data, means, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style) {

  const svgWidth = width + margin.left + margin.right
  const svgHeight = height + margin.top + margin.bottom

  // Append the chart svg
  const svgTrend = d3.select(`${selector}`)
    .append('svg')
    .attr('id', elid)

  // Size the chart svg
  if (expand) {
    svgTrend.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
  } else {
    svgTrend.attr("width", svgWidth)
    svgTrend.attr("height", svgHeight)
  }

  // Axis labels
  if (axisLeftLabel) {
    svgTrend.append("text")
      .attr("transform", `translate(${axisLabelFontSize},${margin.top + height/2}) rotate(270)`)
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisLeftLabel) 
  }

  // Create axes and position within SVG
  let tAxis, bAxis, lAxis, rAxis
  if (axisLeft === 'on' || axisLeft === 'tick') {
    lAxis = svgTrend.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  }
  if (axisBottom === 'on' || axisBottom === 'tick') {
    bAxis = svgTrend.append("g")
      .attr("transform", `translate(${margin.left},${margin.top + height})`)
  }
  if (axisTop === 'on') {
    tAxis = svgTrend.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  }
  if (axisRight === 'on') {
    rAxis = svgTrend.append("g")
      .attr("transform", `translate(${margin.left + width}, ${margin.top})`)
  }

  // Create g element for chart elements
  const gChart1 = svgTrend.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
  const gChart2 = svgTrend.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Create the API function for updating chart
  const updateChart = makeUpdateChart(svgTrend, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, style, yearMin, yearMax)
  
  // Update the chart with current data
  updateChart(data, means, yMin, yMax, adjust, ylines)

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
  style,
  yearMin, 
  yearMax
) {
  return (data, means, yMin, yMax, adjust, ylines) => {

    // Set ylines to empty array if not set
    if (!ylines) {
      ylines = []
    }

    // Convert data from an array of gradients and intercepts to an array 
    // of arrays of two point lines
    const dataWork = data.map(d => {
      const yStart = d.gradient * yearMin + d.intercept
      const yEnd = d.gradient * yearMax + d.intercept
      return [{y: yearMin, v: yStart}, {y: yearMax, v: yEnd}]
    })

    // Adjustments
    let yMinBuff, yMaxBuff
    if (yMin !== null && yMax !== null && typeof yMin !== 'undefined' && typeof yMax !== 'undefined') { 
      yMinBuff = yMin
      yMaxBuff = yMax
      if (adjust) {
        if (minY(dataWork, means) < yMinBuff) yMinBuff = minY(dataWork, means)
        if (maxY(dataWork, means) > yMaxBuff) yMaxBuff = maxY(dataWork, means)
        // Add a margin to min/max values
        yMinBuff = yMinBuff - (yMaxBuff - yMinBuff) / 50
        yMaxBuff = yMaxBuff + (yMaxBuff - yMinBuff) / 50
      }
    } else {
      yMinBuff = minY(dataWork, means)
      yMaxBuff = maxY(dataWork, means)
      // Add a margin to min/max values
      yMinBuff = yMinBuff - (yMaxBuff - yMinBuff) / 50
      yMaxBuff = yMaxBuff + (yMaxBuff - yMinBuff) / 50
    }
    const yearMinBuff = yearMin
    const yearMaxBuff = yearMax

    // Value scales
    const xScale = d3.scaleLinear().domain([yearMinBuff, yearMaxBuff]).range([0, width])
    const yScale = d3.scaleLinear().domain([yMinBuff, yMaxBuff]).range([height, 0])

    // Generate axes
    if (tAxis) {
      tAxis
        .call(d3.axisTop()
          .scale(xScale) // Actual scale doesn't matter, but needs one
          .tickValues([])
          .tickSizeOuter(0))
    }
    if (bAxis) {
      bAxis.transition().duration(duration)
        .call(xAxisYear(width, axisBottom === 'tick', yearMinBuff, yearMaxBuff, false))
    }
    if (lAxis) {
      lAxis.transition().duration(duration)
        .call(d3.axisLeft()
        .scale(yScale)
        .ticks(5))
    }
    if (rAxis) {
      rAxis
        .call(d3.axisRight()
        .scale(yScale)
        .tickValues([])
        .tickSizeOuter(0))
    }

    // Line path generator
    const linePath = d3.line()
      //.curve(d3.curveMonotoneX)
      .x(d => xScale(d.y))
      .y(d => yScale(d.v))

    // Main data line
    d3Line(gChart2, linePath, duration, dataWork, style)

    // Mean and SDs
    const tMeans = means.map(p => {
      return {
        x: xScale(p.year),
        y: yScale(p.mean),
        bar: linePath([{y: p.year, v: p.mean-p.sd}, {y: p.year, v: p.mean+p.sd}]),
        barStart: linePath([{y: p.year, v: yMinBuff}, {y: p.year, v: yMinBuff}])
      }
    })
    d3MeanSd(gChart2, linePath, yScale(yMinBuff), duration, tMeans, style)

    // Add path to ylines and generate
    ylines.forEach(l => {
      l.path = linePath([{y: yearMinBuff, v: l.y}, {y: yearMaxBuff, v: l.y}])
    })
    d3Yline(gChart1, ylines, duration)
  }
}

function d3Line(gChart, linePath, duration, data, style) {

    gChart.selectAll('.trend-line')
      .data(data)
      .join(
        enter => enter.append('path')
          .attr("d", d => linePath(d))
          .attr('class', 'trend-line')
          .style('stroke', style.vStroke)
          .style('stroke-width', style.vStrokeWidth)
          .attr("opacity", 0),
        update => update,
        exit => exit
          .transition().duration(duration)
          .style("opacity", 0)
          .remove()
      )
      // Join returns merged enter and update selection
          .transition().duration(duration)
          .attr("d", d => linePath(d))
          .attr("opacity", style.vOpacity)
}

function d3MeanSd(gChart, linePath, yMinBuff, duration, means, style) {

     // SDs
    gChart.selectAll('.sds')
      .data(means)
      .join(
        enter => enter.append('path')
          .attr('d', d => d.bar)
          .attr('class', 'sds')
          .style('stroke', style.sdStroke)
          .style('stroke-width', style.sdStrokeWidth)
          .style('opacity', 0),
        update => update,
        exit => exit
          .transition().duration(duration)
          .style("opacity", 0)
          .remove()
      )
      // Join returns merged enter and update selection
          .transition().duration(duration)
          .attr('d', d => d.bar)
          .style('opacity', 1)

    // Means
    gChart.selectAll('.means')
      .data(means)
      .join(
        enter => enter.append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', style.mRad)
          .attr('class', 'means')
          .style('fill', style.mFill)
          .style('stroke', style.mStroke)
          .style('stroke-width', style.mStrokeWidth)
          .style('opacity', 0),
        update => update,
        exit => exit
          .transition().duration(duration)
          .style("opacity", 0)
          .remove()
      )
      // Join returns merged enter and update selection
           .transition().duration(duration)
           .attr('cx', d => d.x)
           .attr('cy', d => d.y)
           .style('opacity', 1)
}

function d3Yline(gChart, ylines, duration) {

    // Horizontal y lines
    gChart.selectAll('.ylines')
      .data(ylines)
      .join(
        enter => enter.append('path')
          .attr('d', d => d.path)
          .attr('class', 'ylines')
          .style('stroke', d => d.stroke)
          .style('stroke-width', d => d.strokeWidth)
          .style('opacity', 0),
        update => update,
        exit => exit
          .transition().duration(duration)
          .style("opacity", 0)
          .remove()
      )
      // Join returns merged enter and update selection
          .transition().duration(duration)
          .attr('d', d => d.path)
          .style('opacity', 1)
}