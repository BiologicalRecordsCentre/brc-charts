import * as d3 from 'd3'
import { xAxisYear } from '../general'

export function trend2({
  // Default options in here
  selector = 'body',
  elid = 'trend2-chart',
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
  yearMin = null,
  yearMax = null,
  data = [],
  means = [],
  style = {}
} = {}) {

  // Ensure default style properties are present
  style.vStroke = style.vStroke ? style.vStroke : 'black'
  style.vStrokeWidth = style.vStrokeWidth ? style.vStrokeWidth : 2
  style.cStroke = style.cStroke ? style.cStroke : 'black'
  style.cStrokeWidth = style.cStrokeWidth ? style.cStrokeWidth : 1
  style.cFill = style.cFill ? style.cFill : 'silver'
  style.mFill = style.mFill ? style.mFill : 'white'
  style.mRad = style.mRad ? style.mRad : 2
  style.mStroke = style.mStroke ? style.mStroke : 'black'
  style.mStrokeWidth = style.mStrokeWidth ? style.mStrokeWidth : 1
  style.sdStroke = style.sdStroke ? style.sdStroke : 'black'
  style.sdStrokeWidth = style.sdStrokeWidth ? style.sdStrokeWidth : 1

  const updateChart = makeChart(yearMin, yearMax, data, means, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style)

  return {
    updateChart: updateChart
  }
}

function maxYear(data) {
  return Math.max(...data.map(d => d.year))
}
function minYear(data) {
  return Math.min(...data.map(d => d.year))
}
function maxY(data, means) {
  const dMax = Math.max(...data.map(d => d.upper ? d.upper : d.value))
  const mMax = Math.max(...means.map(d => d.mean + d.sd))
  return Math.max(dMax, mMax)
}
function minY(data, means) {
  const dMin = Math.min(...data.map(d => d.lower ? d.lower : d.value))
  const mMin = Math.min(...means.map(d => d.mean - d.sd))
  return Math.min(dMin, mMin)
}

function makeChart(yearMin, yearMax, data, means, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style) {

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
  updateChart(data, means)

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
  return (data, means) => {
    // Data
    const dataWork = data.sort((a, b) => (a.year > b.year) ? 1 : -1)

    const yearMinData = minYear(dataWork)
    const yearMaxData = maxYear(dataWork)

    let yMin = minY(dataWork, means)
    let yMax = maxY(dataWork, means)
    // Add a margin to min/max values
    yMin = yMin - (yMax - yMin) / 50
    yMax = yMax + (yMax - yMin) / 50

    let yearMinBuff, yearMaxBuff
    if (yearMin) {
      yearMinBuff = yearMin
    } else {
      yearMinBuff = Math.floor(yearMinData - (yearMaxData - yearMinData) / 50)
    }
    if (yearMax) {
      yearMaxBuff = yearMax
    } else {
      yearMaxBuff = Math.floor(yearMaxData + (yearMaxData - yearMinData) / 50)
    }

    // Value scales
    const xScale = d3.scaleLinear().domain([yearMinBuff, yearMaxBuff]).range([0, width])
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0])

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
    const vData = data.map(p => {return {y: p.year, v: p.value}})
    d3Line(gChart2, linePath, yMin, duration, vData, 'valueLine', style.vStroke, style.vStrokeWidth, 'none')

    // Upper confidence line
    const uData = data.map(p => {return {y: p.year, v: p.upper}})
    d3Line(gChart2, linePath, yMin, duration, uData, 'upperLine', style.cStroke, style.cStrokeWidth, 'none')

    // Upper confidence line
    const lData = data.map(p => {return {y: p.year, v: p.lower}})
    d3Line(gChart2, linePath, yMin, duration, lData, 'lowerLine', style.cStroke, style.cStrokeWidth, 'none')

    // Confidence polygon
    lData.sort((a,b) => b.y - a.y) // Reverse order of lData
    const pData = [...uData, ...lData]
    d3Line(gChart1, linePath, yMin, duration, pData, 'confidence', 'none', 0, style.cFill)

    // Mean and SDs
    const tMeans = means.map(p => {
      return {
        x: xScale(p.year),
        y: yScale(p.mean),
        bar: linePath([{y: p.year, v: p.mean-p.sd}, {y: p.year, v: p.mean+p.sd}]),
        barStart: linePath([{y: p.year, v: yMin}, {y: p.year, v: yMin}])
      }
    })
    d3MeanSd(gChart2, linePath, yScale(yMin), duration, tMeans, style)
  }
}

function d3Line(gChart, linePath, yMin, duration, data, lClass, stroke, strokeWidth, fill) {

    let aData
    if (data.length === 0) {
      aData = data
    } else {
      aData = [data]
    }

    gChart.selectAll(`.${lClass}`)
      .data(aData)
      .join(
        enter => enter.append('path')
          //.attr("d", d => {linePath(d.map(p => {return {y: p.y,v: yMin}}))})
          .attr("d", d => linePath(d))
          .attr('class', lClass)
          .style('fill', fill)
          .style('stroke', stroke)
          .style('stroke-width', strokeWidth)
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
          .attr("opacity", 1)
}

function d3MeanSd(gChart, linePath, yMin, duration, means, style) {

    //console.log(means)
    //console.log(style)

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
