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
  data = [],
  means = []
} = {}) {

  const updateChart = makeChart(data, means, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration)

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
  return Math.max(dMin, mMin)
}

function makeChart(data, means, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration) {

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
  const gChart = svgTrend.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Create the API function for updating chart
  const updateChart = makeUpdateChart(svgTrend, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart)
  
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
  gChart
) {
  return (data, means) => {
    // Data
    const dataWork = data.sort((a, b) => (a.year > b.year) ? 1 : -1)
    const yearMin = minYear(dataWork)
    const yearMax = maxYear(dataWork)
    const yMin = minY(dataWork, means)
    const yMax = maxY(dataWork, means)

    // Value scales
    const xScale = d3.scaleLinear().domain([yearMin, yearMax]).range([0, width])
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
        .call(xAxisYear(width, axisBottom === 'tick', yearMin, yearMax, false))
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
    gChart.selectAll('.valueLine')
      .data([data])
      .join(
        enter => enter.append('path')
          .attr("d", d => {
            return linePath(d.map(p => {
              return {
                y: p.year,
                v: yMin
              }
            }))
          })
          .attr('class', 'valueLine')
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', 2),
        update => update
      )
          .transition().duration(duration)
          .attr("d", d => {
            return linePath(d.map(p => {
              return {
                y: p.year,
                v: p.value
              }
            }))
          })
  }
}