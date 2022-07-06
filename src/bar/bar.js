import * as d3 from 'd3'

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
  labelPosition = {}
} = {}) {

  const updateChart = makeChart(data, labelPosition, selector, elid, width, height, padding, barHeightOnZero, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration)

  return {
    updateChart: updateChart
  }
}

function makeChart(data, labelPosition, selector, elid, width, height, padding, barHeightOnZero, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration) {

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
  const updateChart = makeUpdateChart(labelPosition, svgTrend, width, height, padding, barHeightOnZero, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart)
  
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
  gChart
) {
  return (data) => {

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
      bAxis.transition().duration(duration)
        .call(d3.axisBottom()
        .scale(xScaleBottom)
        .tickSizeOuter(0))

      const labels = bAxis.selectAll("text")	
      if (labelPosition["text-anchor"]) labels.style("text-anchor", labelPosition["text-anchor"])
      if (labelPosition["dx"]) labels.attr("dx", labelPosition["dx"])
      if (labelPosition["dy"]) labels.attr("dy", labelPosition["dy"])
      if (labelPosition["transform"]) labels.attr("transform", labelPosition["transform"])
    }
    if (bAxis && axisBottom === 'on') {
      bAxis.transition().duration(duration)
        .call(d3.axisBottom()
        .scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([])
        .tickSizeOuter(0))
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
    // Bar data
    data.forEach(d => {
      d.x = xScaleBottom(d.label)
      d.y = yScale(d.value)
      d.ye = height
      d.width = xScaleBottom.bandwidth()
      d.height = height - yScale(d.value) ? height - yScale(d.value) : barHeightOnZero
    })
    d3Bars(data, gChart, duration)
  }
}

function d3Bars(data, gChart, duration) {

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
          .transition().duration(duration)
          .style('opacity', 0)
          .remove()
      )
      // Join returns merged enter and update selection
          .transition().duration(duration)
          .style('opacity', 1)
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .attr('width', d => d.width)
          .attr('height', d => d.height)

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
          .transition().duration(duration)
          .style('opacity', 0)
          .remove()
      )
      // Join returns merged enter and update selection
          .transition().duration(duration)
          .style('opacity', 1)
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .attr('width', d => d.width)
          .attr('height', d => d.height)
}