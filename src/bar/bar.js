// README (updated 15/07/2022)
// This chart is designed to display a bar chart.
// Although initiallly created to facilitate the BSBI altas website,
// it has been generalised and can be used in other contexts
// It is currently undocumented.

import * as d3 from 'd3'
import { transPromise, saveChartImage } from '../general'

export function bar({
  // Default options in here
  selector = 'body',
  elid = 'bar-chart',
  width = 300,
  height = 200,
  padding = 0,
  barHeightOnZero = 0,
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
  labelPosition = {},
  tooltip = false,
} = {}) {

  const updateChart = makeChart(data, labelPosition, selector, elid, width, height, padding, barHeightOnZero, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, tooltip)

  return {
    updateChart: updateChart,
    saveImage: (asSvg, filename, info) => {
      return saveChartImage(d3.select(`#${elid}`), expand, asSvg, filename, null, info)
    }
  }
}

function makeChart(data, labelPosition, selector, elid, width, height, padding, barHeightOnZero, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, tooltip) {

  const svgWidth = width + margin.left + margin.right
  const svgHeight = height + margin.top + margin.bottom

  // Append the chart svg
  const svgBar = d3.select(`${selector}`)
    .append('svg')
    .attr('id', elid)
    .style('font-family', 'sans-serif')

  // Size the chart svg
  if (expand) {
    // The original width and height may be needed elsewhere but if viewBox is used, will
    // not be available through the width and height attributes of the svg, so add them as
    // data attributes.
    svgBar.attr('data-width', svgWidth)
    svgBar.attr('data-height', svgHeight)

    svgBar.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
  } else {
    svgBar.attr("width", svgWidth)
    svgBar.attr("height", svgHeight)
  }

  // Axis labels
  if (axisLeftLabel) {
    svgBar.append("text")
      .attr("transform", `translate(${axisLabelFontSize},${margin.top + height/2}) rotate(270)`)
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisLeftLabel)
  }

  // Create axes and position within SVG
  let tAxis, bAxis, lAxis, rAxis
  if (axisLeft === 'on' || axisLeft === 'tick') {
    lAxis = svgBar.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  }
  if (axisBottom === 'on' || axisBottom === 'tick') {
    bAxis = svgBar.append("g")
      .attr("transform", `translate(${margin.left},${margin.top + height})`)
  }
  if (axisTop === 'on') {
    tAxis = svgBar.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  }
  if (axisRight === 'on') {
    rAxis = svgBar.append("g")
      .attr("transform", `translate(${margin.left + width}, ${margin.top})`)
  }

  // Create g element for chart elements
  const gChart = svgBar.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Create the API function for updating chart
  const updateChart = makeUpdateChart(labelPosition, svgBar, width, height, padding, barHeightOnZero, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart, tooltip)

  // Update the chart with current data
  updateChart(data)

  // Return the api
  return updateChart
}

function makeUpdateChart(
  labelPosition,
  svg,
  width,
  height,
  padding,
  barHeightOnZero,
  tAxis,
  bAxis,
  lAxis,
  rAxis,
  axisBottom,
  duration,
  gChart,
  tooltip
) {

  return (data) => {

    // d3 transition object
    const t = svg.transition()
        .duration(duration)
    let pTrans = []

    // Value scales
    let yMaxBuff = Math.max(...data.map(d => d.value))
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width])
    const yScale = d3.scaleLinear().domain([yMaxBuff, 0]).range([0, height])
    const xScaleBottom = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding([padding])

    // Generate axes
    if (tAxis) {
      tAxis
        .call(d3.axisTop()
        .scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([])
        .tickSizeOuter(0))
    }
    if (bAxis && axisBottom === 'tick') {
      transPromise(bAxis.transition(t)
        .call(d3.axisBottom()
        .scale(xScaleBottom)
        .tickSizeOuter(0)), pTrans)

      const labels = bAxis.selectAll("text")
      if (labelPosition["text-anchor"]) labels.style("text-anchor", labelPosition["text-anchor"])
      if (labelPosition["dx"]) labels.attr("dx", labelPosition["dx"])
      if (labelPosition["dy"]) labels.attr("dy", labelPosition["dy"])
      if (labelPosition["transform"]) labels.attr("transform", labelPosition["transform"])
    }

    if (bAxis && axisBottom === 'on') {
       transPromise(bAxis.transition(t)
        .call(d3.axisBottom()
        .scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([])
        .tickSizeOuter(0)), pTrans)
    }
    if (lAxis) {
       transPromise(lAxis.transition(t)
        .call(d3.axisLeft()
        .scale(yScale)
        .ticks(5)), pTrans)
    }
    if (rAxis) {
       transPromise(rAxis.transition(t)
        .call(d3.axisRight()
        .scale(yScale)
        .tickValues([])
        .tickSizeOuter(0)), pTrans)
    }
    // Bar data
    data.forEach(d => {
      d.x = xScaleBottom(d.label)
      d.y = yScale(d.value)
      d.ye = height
      d.width = xScaleBottom.bandwidth()
      d.height = height - yScale(d.value) ? height - yScale(d.value) : barHeightOnZero
    })

    pTrans = [...d3Bars(data, gChart, t, tooltip), ...pTrans]

    return Promise.allSettled(pTrans)
  }
}

function d3Bars(data, gChart, t, tooltip) {

  const pTrans = []

  gChart.selectAll(`.bar`)
    .data(data)
    .join(
      enter => enter.append('rect')
        .attr('class', 'bar')
        .style('fill', d => d.fill)
        .style('stroke', d => d.stroke)
        .style('stroke-width', d => d.strokeWidth)
        .style('opacity', 0)
        .attr('x', d => d.x)
        .attr('y', d => d.ye)
        .attr('width', d => d.width)
        .attr('height', 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style('opacity', 0)
        .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .style('opacity', 1)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height), pTrans))


  // Tooltips
  if (tooltip) {
  gChart.selectAll(`.bar`)
    .append('title').text(d => `${d.label}: ${d.value}%`)
  }

  gChart.selectAll(`.barLabel`)
    .data(data)
    .join(
      enter => enter.append('text')
        .attr('class', 'barLabel')
        .style('opacity', 0)
        .attr('x', d => d.x)
        .attr('y', d => d.ye)
        .attr('width', d => d.width)
        .attr('height', 0),

      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style('opacity', 0)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
      .style('opacity', 1)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height), pTrans))

  return pTrans
}