import * as d3 from 'd3'

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
  duration = 1000,
  xMin = null,
  xMax = null,
  ylines = [],
  xlines = [],
  data = [],
  style = {}
} = {}) {

  // Ensure default style properties are present
  style.cStroke = style.cStroke ? style.cStroke : 'black'
  style.cStrokeWidth = style.cStrokeWidth ? style.cStrokeWidth : 1
  style.cFill = style.cFill ? style.cFill : 'silver'
 

  const updateChart = makeChart(xMin, xMax, data, xlines, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style)

  return {
    updateChart: updateChart
  }
}

function maxX(data) {
  return Math.max(...data.map(ds => Math.max(...ds.map(d => d.slope))))
}
function minX(data) {
  return Math.min(...data.map(ds => Math.min(...ds.map(d => d.slope))))
}

function makeChart(xMin, xMax, data, xlines, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style) {

  const svgWidth = width + margin.left + margin.right
  const svgHeight = height + margin.top + margin.bottom

  // Append the chart svg
  const svgDensity = d3.select(`${selector}`)
    .append('svg')
    .attr('id', elid)

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
  const updateChart = makeUpdateChart(svgDensity, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, style)
  
  // Update the chart with current data
  updateChart(data, xMin, xMax, xlines, ylines)

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
  style
) {
  return (data, xMin, xMax, xlines, ylines) => {

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
      // if (adjust) {
      //   if (minX(dataWork) < xMinBuff) xMinBuff = minX(dataWork)
      //   if (maxX(dataWork) > xMaxBuff) xMaxBuff = maxX(dataWork)
      //   // Add a margin to min/max values
      //   xMinBuff = xMinBuff - (xMaxBuff - xMinBuff) / 50
      //   xMaxBuff = xMaxBuff + (xMaxBuff - xMinBuff) / 50
      // }

    } else {
      xMinBuff = minX(dataWork)
      xMaxBuff = maxX(dataWork)
      // Add a margin to min/max values
      xMinBuff = xMinBuff - (xMaxBuff - xMinBuff) / 50
      xMaxBuff = xMaxBuff + (xMaxBuff - xMinBuff) / 50
    }

    // Value scales
    const xScale = d3.scaleLinear().domain([xMinBuff, xMaxBuff]).range([0, width])
    const yScale = d3.scaleLinear().domain([0, 70]).range([height, 0]) //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Compute kernel density estimation
    const kde = kernelDensityEstimator(kernelEpanechnikov(0.01), xScale.ticks(100))
    const densities = dataWork.map(ds => kde(ds.map(d => d.slope)))

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
        .call(d3.axisBottom()
        .scale(xScale)
        .ticks(5))
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
    // const linePath = d3.line()
    //   //.curve(d3.curveMonotoneX)
    //   .x(d => xScale(d.y))
    //   .y(d => yScale(d.v))

    const linePath =  d3.line()
      .curve(d3.curveMonotoneX)
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))


    if (dataWork.length) {
      console.log('dataWork', dataWork[0])
      console.log('densities', densities[0])
      console.log('linepath', linePath(densities[0]))
    }
    
    console.log(densities.length)

    d3Test(gChart1, duration, densities, linePath)


    // // Main data line
    // const vData = data.map(p => {return {y: p.year, v: p.value}})
    // d3Line(gChart2, linePath, duration, vData, 'valueLine', style.vStroke, style.vStrokeWidth, 'none')


    // // Confidence polygon
    // lData.sort((a,b) => b.y - a.y) // Reverse order of lData
    // const pData = [...uData, ...lData]
    // d3Line(gChart1, linePath, duration, pData, 'confidence', 'none', 0, style.cFill)


    // // Add path to ylines and generate
    // ylines.forEach(l => {
    //   l.path = linePath([{y: yearMinBuff, v: l.y}, {y: yearMaxBuff, v: l.y}])
    // })
    // const tYlines = ylines.filter(l => l.y >= yMinBuff && l.y <= yMaxBuff)
    // d3Yline(gChart1, tYlines, duration)
  }
}

function d3Test(gChart, duration, data, linePath) {

    gChart.selectAll(`.test-line`)
      .data(data)
      .join(
        enter => enter.append('path')
          .attr("opacity", 0)
          .attr("d", d => linePath(d))
          .attr("class", "test-line")
          .style('fill', 'red')
          .style('stroke', 'black')
          .style('stroke-width', 1),
        update => update,
        exit => exit
          .transition().duration(duration)
          .style("opacity", 0)
          .remove()
      )
      // Join returns merged enter and update selection
          .transition().duration(duration)
          .attr("opacity", 1)
          .attr("d", d => linePath(d))
          
}

function d3Line(gChart, linePath, duration, data, lClass, stroke, strokeWidth, fill) {

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

function d3Yline(gChart, xlines, ylines,duration) {

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