import * as d3 from 'd3'
import { xAxisYear, safeId, transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function makeYearly (
  svgChart,
  taxon,
  taxa,
  data,
  dataPoints,
  dataTrendLines,
  minYear,
  maxYear,
  minYearTrans,
  maxYearTrans,
  minCount,
  maxCount,
  xPadPercent,
  yPadPercent,
  metricsPlus,
  width,
  height,
  axisTop,
  axisBottom,
  showCounts,
  axisLeft,
  yAxisOpts,
  axisRight,
  duration,
  interactivity,
  margin,
  showTaxonLabel,
  taxonLabelFontSize,
  taxonLabelItalics,
  axisLabelFontSize,
  axisLeftLabel,
  axisRightLabel,
  fillGaps,
  pTrans
) {

  // Pre-process data.
  // Filter to named taxon and to min and max year and sort in year order
  // Add max value to each.

  const dataFiltered = data
    .filter(d => d.taxon === taxon && d.year >= minYear && d.year <= maxYear)
    .sort((a, b) => (a.year > b.year) ? 1 : -1)

  const dataPointsFiltered = dataPoints
    .filter(d => d.taxon === taxon && d.year >= minYear && d.year <= maxYear)
    .sort((a, b) => (a.year > b.year) ? 1 : -1)

  // Filter dataTrendLinesFiltered data on taxon and also from an array 
  // of gradients and intercepts to an array of arrays of two point lines
  const dataTrendLinesFiltered = dataTrendLines
    .filter(d => d.taxon === taxon)
    .map(d => {
      return {
        taxon: d.taxon,
        colour: d.colour,
        width: d.width,
        opacity: d.opacity,
        y1: d.gradient * minYear + d.intercept,
        y2: d.gradient * maxYear + d.intercept
      }
    })


  //Set the min and maximum values for the y axis
  const maxMetricCounts = metricsPlus.map(m => Math.max(
    ...dataFiltered.map(d => d[m.prop]),
    ...dataFiltered.filter(d => d[m.bandUpper]).map(d => d[m.bandUpper])
  ))

  const maxCountA = maxCount !== null ? [maxCount] : []
  let yMaxCount = Math.max(
    ...maxCountA,
    ...maxMetricCounts,
    ...dataPointsFiltered.map(d => d.y),
    ...dataPointsFiltered.filter(d => d.upper).map(d => d.upper),
    ...dataTrendLinesFiltered.map(d => d.y1),
    ...dataTrendLinesFiltered.map(d => d.y2)
  )
  const minMetricCounts = metricsPlus.map(m => Math.min(
    ...dataFiltered.map(d => d[m.prop]),
    ...dataFiltered.filter(d => d[m.bandLower]).map(d => d[m.bandLower])
  ))

  const minCountA = minCount !== null ? [minCount] : []
  let yMinCount = Math.min(
    ...minCountA,
    ...minMetricCounts,
    ...dataPointsFiltered.map(d => d.y),
    ...dataPointsFiltered.filter(d => d.lower).map(d => d.lower),
    ...dataTrendLinesFiltered.map(d => d.y1),
    ...dataTrendLinesFiltered.map(d => d.y2)
  )
  
  if (yAxisOpts.minMax !== null) {
    if (yMaxCount < yAxisOpts.minMax) {
      yMaxCount = yAxisOpts.minMax
    }
  }
  if (yAxisOpts.fixedMin !== null) {
    yMinCount = yAxisOpts.fixedMin
  }
  
  // Value scales
  let years = []
  for (let i = minYear; i <= maxYear; i++) {
    years.push(i)
  }

  const xPadding = (maxYear-minYear) * xPadPercent
  const yPadding = (yMaxCount-yMinCount) * yPadPercent

  const xScaleBar = d3.scaleBand().domain(years).range([0, width]).paddingInner(0.1)
  const xScaleLine = d3.scaleLinear().domain([minYear - xPadding, maxYear + xPadding]).range([0, width])
  const yScale = d3.scaleLinear().domain([yMinCount - yPadding, yMaxCount + yPadding]).range([height, 0])
  
  // Top axis
  let tAxis
  if (axisTop === 'on') {
    tAxis = d3.axisTop()
      .scale(xScaleLine) // Actual scale doesn't matter, but needs one
      .tickValues([])
      .tickSizeOuter(0)
  }

  // Bottom axis
  let bAxis
  if (axisBottom === 'on' || axisBottom === 'tick') {
    bAxis = xAxisYear(width, axisBottom === 'tick', minYear - xPadding, maxYear + xPadding, showCounts === 'bar')
  }

  // Left and right axes
  const makeXaxis = (leftRight, axisOpt) => {
    let axis
    const d3axis = leftRight === 'left' ? d3.axisLeft() : d3.axisRight()
    switch(axisOpt) {
      case 'on':
        axis = d3axis.scale(yScale).tickValues([]).tickSizeOuter(0)
        break
      case 'tick':
        axis = d3axis.scale(yScale).ticks(5).tickFormat(d3.format(yAxisOpts.numFormat))
        break
    }
    return axis
  }
  const lAxis = makeXaxis('left', axisLeft)
  const rAxis = makeXaxis('right', axisRight)

  // Create or get the relevant chart svg
  let init, svgYearly, gYearly

  if (taxa.length === 1 && svgChart.selectAll('.brc-chart-yearly').size() === 1) {
    svgYearly = svgChart.select('.brc-chart-yearly')
    gYearly = svgYearly.select('.brc-chart-yearly-g')
    init = false
  } else if (svgChart.select(`#${safeId(taxon)}`).size()) {
    svgYearly = svgChart.select(`#${safeId(taxon)}`)
    gYearly = svgYearly.select('.brc-chart-yearly-g')
    init = false
  } else {
    svgYearly = svgChart.append('svg')
      .classed('brc-chart-yearly', true)
      .attr('id', safeId(taxon))
      .style('overflow', 'visible')
      .style('font-family', 'sans-serif')
    gYearly = svgYearly.append('g')
      .classed('brc-chart-yearly-g', true)
    init = true
  }

  // Line path generator
  const lineCounts = d3.line()
    //.curve(d3.curveMonotoneX) // Interpolating curves can make transitions of polygons iffy
                                // because resulting number of points in path is not constant.
    .x(d => xScaleLine(d.year))
    .y(d => yScale(d.n))

  let chartLines = []
  let chartBars = []
  let chartBands = []
  let chartPoints = []
  let chartErrorBars = []

  metricsPlus.forEach(m => {

    // Create a collection of the years in the dataset.
    const dataDict = dataFiltered.reduce((a,d) => {
      a[d.year]=d[m.prop]
      return a
    }, {})

    // Construct data structure for line charts.
    if (showCounts === 'line' && isFinite(yMinCount)) {

      const points = adjustForTrans(years.map(y => {
        // Note below that if the year is not in the datasets, we create a
        // point with the value of zero.
        // TODO - this needs revisiting if we account for 'broken' lines
        // where gaps should be shown. So this will need parameterising 
        // somehow.
        return {
          year: y,
          n: dataDict[y] ? dataDict[y] : 0,
        }
      }))

      chartLines.push({
        colour: m.colour,
        opacity: m.opacity,
        strokeWidth: m.strokeWidth,
        type: 'counts',
        prop: m.prop,
        yMin: yMinCount,
        pathEnter: lineCounts(points.map(p => {
          return {
            n: yMinCount,
            year: p.year
          }
        })),
        path: lineCounts(points)
      })
    }

    // Construct data structure for condidence band on line charts.
    if (showCounts === 'line' && m.bandUpper && m.bandLower && isFinite(yMinCount)) {
      const ddUpper = dataFiltered.reduce((a,d) => {
        a[d.year]=d[m.bandUpper]
        return a
      }, {})
      const ddLower = dataFiltered.reduce((a,d) => {
        a[d.year]=d[m.bandLower]
        return a
      }, {})
      const upperLine = years.map(y => {
        return {
          year: y,
          n: ddUpper[y] ? ddUpper[y] : 0,
        }
      })
      const lowerLine = [...years].map(y => {
        return {
          year: y,
          n: ddLower[y] ? ddLower[y] : 0,
        }
      })

      const pointsLower = adjustForTrans(lowerLine)
      const pointsUpper = adjustForTrans(upperLine)
      const pointsBand = [...adjustForTrans(lowerLine), ...adjustForTrans(upperLine).reverse()]
      const pointsLowerEnter = pointsLower.map(p => {
        return {
          n: yMinCount,
          year: p.year
        }
      })
      const pointsUpderEnter = pointsUpper.map(p => {
        return {
          n: yMinCount,
          year: p.year
        }
      })

      chartBands.push({
        fill: m.bandFill ? m.bandFill : 'silver',
        stroke: m.bandStroke ? m.bandStroke : 'grey',
        fillOpacity: m.bandOpacity !== undefined ? m.bandOpacity : 0.5,
        strokeOpacity: m.bandStrokeOpacity !== undefined ? m.bandStrokeOpacity : 1,
        strokeWidth: m.bandStrokeWidth !== undefined ? m.bandStrokeWidth : 1,
        type: 'counts',
        prop: m.prop,
        bandPath: lineCounts(pointsBand),
        bandPathEnter: lineCounts(pointsBand.map(p => {
          return {
            n: yMinCount,
            year: p.year
          }
        })),
        bandBorders: [lineCounts(pointsLower), lineCounts(pointsUpper)],
        bandBordersEnter: [lineCounts(pointsLowerEnter), lineCounts(pointsUpderEnter)]
      })
    }

    // Construct data structure for bar charts.
    if (showCounts === 'bar') {
      const bars = dataFiltered.map(d => {
        return {
          colour: m.colour,
          opacity: m.opacity,
          type: 'counts',
          prop: m.prop,
          year: d.year,
          n: yScale(d[m.prop]),
        }
      })
      chartBars = [...chartBars, ...bars]
    }

    // Construct data structure for points.
    // TODO - if at some point we parameterise display styles
    // for points bars, then it must be specified in here.
    if (m.points) {
      const points = dataFiltered.filter(d => d[m.prop]).map(d => {
        let x
        if (showCounts === 'bar') {
          x = xScaleBar(d.year) + xScaleBar.bandwidth() / 2
        } else {
          x = xScaleLine(d.year)
        }
        return {
          x: x,
          y: yScale(d[m.prop]),
          year: d.year,
          prop: m.prop,
        }
      })
      chartPoints = [...chartPoints, ...points]
    }

    // Construct data structure for error bars.
    // TODO - if at some point we parameterise display styles
    // for error bars, then it must be specified in here.
    if (m.errorBarUpper && m.errorBarLower) {
      const errorBars = dataFiltered.map(d => {
        let x
        if (showCounts === 'bar') {
          x = xScaleBar(d.year) + xScaleBar.bandwidth() / 2
        } else {
          x = xScaleLine(d.year)
        }
        return {
          year: d.year,
          pathEnter:  `M ${x} ${height} L ${x} ${height}`,
          path: `M ${x} ${yScale(d[m.errorBarLower])} L ${x} ${yScale(d[m.errorBarUpper])}`,
          prop: m.prop,
        }
      })
      chartErrorBars = [...chartErrorBars, ...errorBars]
    } 
  })

  // Construct data structure for supplementary trend lines.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartTrendLineSup = dataTrendLinesFiltered.map(d => {
    // y = mx + c
    let x1, x2
    const minx = minYear - xPadding
    const maxx = maxYear + xPadding
    if (showCounts === 'bar') {
      x1 = xScaleBar(minx)
      x2 = xScaleBar(maxx) + xScaleBar.bandwidth() 
    } else {
      x1 = xScaleLine(minx)
      x2 = xScaleLine(maxx)
    }
    return {
      colour: d.colour ? d.colour : 'red',
      width: d.width ? d.width : '1',
      opacity: d.opacity ? d.opacity : '1',
      pathEnter:  `M ${x1} ${height} L ${x2} ${height}`,
      path: `M ${x1} ${yScale( d.y1)} L ${x2} ${yScale( d.y2)}`,
    }
  })

  // Construct data structure for supplementary points.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartPointsSup = dataPointsFiltered.map(d => {
    let x 
    // if (showCounts === 'bar') {
    //   x = xScaleBar(Math.floor(d.year)) + xScaleBar.bandwidth() * 0.5 +(d.year % 1)
    // } else {
    //   x = xScaleLine(d.year)
    // }
    x = xScaleLine(d.year)

    return {
      x: x,
      y: yScale(d.y),
      year: d.year
    }
  })

  // Construct data structure for supplementary point error bars.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartPointsSupErrorBars = dataPointsFiltered.map(d => {
    const x = xScaleLine(d.year)
    return {
      pathEnter:  `M ${x} ${height} L ${x} ${height}`,
      path: `M ${x} ${yScale(d.lower)} L ${x} ${yScale(d.upper)}`,
      year: d.year
    }
  })

  // d3 transition object
  const t = svgYearly.transition()
      .duration(duration)

  // Bars
  gYearly.selectAll(".yearly-bar")
    .data(chartBars, d => `bars-${d.prop}-${d.year}`)
    .join(
      enter => enter.append("rect")
        .attr("class", d => `yearly-bar yearly-graphic yearly-${d.prop}`)
        .attr('width', xScaleBar.bandwidth())
        .attr('height', 0)
        .attr('fill', d => d.colour)
        .attr('opacity', d => d.opacity)
        .attr('y', height)
        .attr('x', d => xScaleBar(d.year)),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr('height', 0)
          .attr('y', height)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr('y', d => d.n)
      .attr('x', d => xScaleBar(d.year))
      .attr('height', d => height - d.n)
      .attr('width', xScaleBar.bandwidth())
      .attr("fill", d => d.colour)
      .attr("opacity", d => d.opacity), pTrans))

  // Bands
  gYearly.selectAll(".yearly-band")
    .data(chartBands, d => `band-${d.prop}`)
    .join(
      enter => enter.append("path")
        .attr("class", d => `yearly-band yearly-graphic yearly-${d.prop}`)
        .attr("opacity", d => d.fillOpacity)
        .attr("fill", d => d.fill)
        .attr("stroke", "none")
        .attr("d", d => d.bandPathEnter),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr("d", d => d.bandPathEnter)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", d => d.bandPath)
      .attr("opacity", d => d.fillOpacity)
      .attr("fill", d => d.fill), pTrans))


  // Band lines
  for (let iLine=0; iLine<2; iLine++) { 
    gYearly.selectAll(`.yearly-band-border-${iLine}`)
      .data(chartBands, d => `band-line-${d.prop}-${iLine}`)
      .join(
        enter => enter.append("path")
          .attr("class", d => `yearly-band-border-${iLine} yearly-graphic yearly-${d.prop}`)
          .attr("opacity", d => d.strokeOpacity)
          .attr("fill","none")
          .attr("stroke", d => d.stroke)
          .attr("stroke-width", d => d.strokeWidth)
          .attr("d", d => d.bandBordersEnter[iLine]),
        update => update,
        exit => exit
          .call(exit =>  transPromise(exit.transition(t)
            .attr("d", d => d.bandBordersEnter[iLine])
            .remove(), pTrans))
         ).call(merge => transPromise(merge.transition(t)
          // The selection returned by the join function is the merged
          // enter and update selections
          .attr("d", d => d.bandBorders[iLine])
          .attr("opacity", d => d.strokeOpacity)
          .attr("stroke", d => d.stroke)
          .attr("stroke-width", d => d.strokeWidth), pTrans))
  }

  // Main lines
  gYearly.selectAll(".yearly-line")
    .data(chartLines,  d => `line-${d.prop}`)
    .join(
      enter => enter.append("path")
        .attr("class", d => `yearly-line yearly-graphic yearly-${d.prop}`)
        .attr("opacity", d => d.opacity)
        .attr("fill", "none")
        .attr("stroke", d => d.colour)
        .attr("stroke-width", d => d.strokeWidth)
        .attr("d", d => d.pathEnter),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr("d", d => d.pathEnter)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", d => d.path)
      .attr("opacity", d => d.opacity)
      .attr("stroke", d => d.colour)
      .attr("stroke-width", d => d.strokeWidth), pTrans))

  // Error bars
  gYearly.selectAll('.yearly-error-bars')
      .data(chartErrorBars, d => `error-bars-${d.prop}-${d.year}`)
      .join(
        enter => enter.append('path')
          .attr("class", d => `yearly-error-bars yearly-graphic yearly-${d.prop}`)
          .attr("d", d => d.pathEnter)
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('opacity', 0),
        update => update,
        exit => exit.call(exit => transPromise(exit
          .transition(t)
          .style("opacity", 0)
          .attr("d", d => d.pathEnter)
          .remove(), pTrans))
      )
      // The selection returned by the join function is the merged
      // enter and update selections
      .call(merge => transPromise(merge.transition(t)
        .attr("d", d => d.path)
        .style('opacity', 1), pTrans))

  // Points
  gYearly.selectAll('.yearly-point')
      .data(chartPoints, d => `point-${d.prop}-${d.year}`)
      .join(
        enter => enter.append('circle')
          .attr("class", d => `yearly-point yearly-graphic yearly-${d.prop}`)
          .attr('cx', d => d.x)
          //.attr('cy', d => d.y)
          .attr('cy', height)
          .attr('r', 3)
          .style('fill', 'white')
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('opacity', 0),
        update => update,
        exit => exit
          .call(exit => transPromise(exit.transition(t)
          .style("opacity", 0)
          .attr('cy', height)
          .remove(), pTrans))
      )
      // The selection returned by the join function is the merged
      // enter and update selections
      .call(merge => transPromise(merge.transition(t)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('opacity', 1), pTrans))

  // Supplementary trend lines
  gYearly.selectAll('.yearly-trend-lines-sup')
    .data(chartTrendLineSup)
    .join(
      enter => enter.append('path')
        .attr("d", d => d.pathEnter)
        .attr('class', 'yearly-trend-lines-sup')
        .style('stroke', d => d.colour)
        .style('stroke-width', d => d.width)
        .attr("opacity", 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        .attr("d", d => d.pathEnter)
        .remove(), pTrans))
    )
    // Join returns merged enter and update selection
    .call(merge => transPromise(merge.transition(t)
      .attr("d", d => d.path)
      .attr("opacity", d => d.opacity)
      .style('stroke', d => d.colour)
      .style('stroke-width', d => d.width), pTrans))
 
  // Supplementary points error bars
  gYearly.selectAll('.yearly-error-bars-sup')
    .data(chartPointsSupErrorBars, d => `error-bars-sup-${d.year}`)
    .join(
      enter => enter.append('path')
        .attr("class", `yearly-error-bars-sup`)
        .attr("d", d => d.pathEnter)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
        .style("opacity", 0)
        .attr("d", d => d.pathEnter)
        .remove(), pTrans))
    )
    // The selection returned by the join function is the merged
    // enter and update selections
    .call(merge => transPromise(merge.transition(t)
      .attr("d", d => d.path)
      .style('opacity', 1), pTrans))
      
  // Supplementary points
  gYearly.selectAll('.yearly-point-data-sup')
      .data(chartPointsSup, d => `point-data-sup-${d.year}`)
      .join(
        enter => enter.append('circle')
          .attr("class", `yearly-point-data-sup`)
          .attr('cx', d => d.x)
          //.attr('cy', d => d.y)
          .attr('cy', height)
          .attr('r', 3)
          .style('fill', 'white')
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('opacity', 0),
        update => update,
        exit => exit
          .call(exit => transPromise(exit.transition(t)
          .style("opacity", 0)
          .attr('cy', height)
          .remove(), pTrans))
      )
      // The selection returned by the join function is the merged
      // enter and update selections
      .call(merge => transPromise(merge.transition(t)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('opacity', 1), pTrans))

  addEventHandlers(gYearly.selectAll("path"), 'prop', svgChart, interactivity)
  addEventHandlers(gYearly.selectAll(".yearly-bar"), 'prop', svgChart, interactivity)
  addEventHandlers(gYearly.selectAll(".yearly-point"), 'prop', svgChart, interactivity)
      
  if (init) {

    // Constants for positioning
    const axisLeftPadX = margin.left ? margin.left : 0
    const axisRightPadX = margin.right ? margin.right : 0
    const axisBottomPadY = margin.bottom ? margin.bottom : 0
    const axisTopPadY = margin.top ? margin.top : 0

    // Taxon title
    if (showTaxonLabel) {
      const taxonLabel = svgYearly
        .append('text')
        .classed('brc-chart-yearly-label', true)
        .text(taxon)
        .style('font-size', taxonLabelFontSize)
        .style('font-style', taxonLabelItalics ? 'italic' : '')

      const labelHeight = taxonLabel.node().getBBox().height
      taxonLabel.attr("transform", `translate(${axisLeftPadX}, ${labelHeight})`)
    }
    
      // Size SVG
    svgYearly
      .attr('width', width + axisLeftPadX + axisRightPadX)
      .attr('height', height + axisBottomPadY + axisTopPadY)

    // Position chart
    gYearly.attr("transform", `translate(${axisLeftPadX},${axisTopPadY})`)
    
    // Create axes and position within SVG
    const leftYaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
    const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${axisTopPadY + height/2}) rotate(270)`
    const rightYaxisTrans = `translate(${axisLeftPadX + width}, ${axisTopPadY})`
    const rightYaxisLabelTrans = `translate(${axisLeftPadX + width + axisRightPadX - axisLabelFontSize}, ${axisTopPadY + height/2}) rotate(90)`
    const topXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
    const bottomXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY + height})`

    // Create axes and position within SVG
    if (lAxis) {
      const gLaxis = svgYearly.append("g")
        .attr("class", "l-axis")
        // .classed('yearly-type-counts',  axisLeft === 'tick')
        // .classed('yearly-type-props',  axisLeft !== 'tick')
      gLaxis.attr("transform", leftYaxisTrans)
    }
    if (bAxis) {
      const gBaxis = svgYearly.append("g")
        .attr("class", "x axis")
        .call(bAxis)
      gBaxis.attr("transform", bottomXaxisTrans)
    }
    if (tAxis) {
      const gTaxis = svgYearly.append("g")
        .call(tAxis)
      gTaxis.attr("transform", topXaxisTrans)
    }
    if (rAxis) {
      const gRaxis = svgYearly.append("g")
        //.call(rAxis)
        .attr("class", "r-axis")
        // .classed('yearly-type-counts',  axisRight === 'tick')
        // .classed('yearly-type-props',  axisRight !== 'tick')
      gRaxis.attr("transform", rightYaxisTrans)
    }

    const tYaxisLeftLabel = svgYearly.append("text")
      // .classed('yearly-type-counts',  axisLeft === 'tick')
      // .classed('yearly-type-props',  axisLeft !== 'tick')
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisLeftLabel) 
    tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans)

    const tYaxisRightLabel = svgYearly.append("text")
      // .classed('yearly-type-counts',  axisRight === 'tick')
      // .classed('yearly-type-props',  axisRight !== 'tick')
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisRightLabel) 
    tYaxisRightLabel.attr("transform", rightYaxisLabelTrans)

  } else {
    if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgYearly.select('.brc-chart-yearly-label').text(taxon)
      }
    }

    // Update the bottom axis if it exists. We do this because
    // yearMin and/or yearMax may have changed.
    if (axisBottom === 'on' || axisBottom === 'tick') {
      transPromise(svgYearly.select(".x.axis")
        .transition(t)
        .call(bAxis), pTrans)
    }
  }

  if (svgYearly.selectAll(".l-axis").size()){

    transPromise(svgYearly.select(".l-axis")
      .transition(t)
      .call(lAxis), pTrans)
  }

  if (svgYearly.selectAll(".r-axis").size()){
    transPromise(svgYearly.select(".r-axis")
      .transition(t)
      .call(rAxis), pTrans)
  }
  
  return svgYearly

  function adjustForTrans(pnts) {
    const ret = [...pnts]

    if (minYearTrans) {
      for(let i=minYearTrans; i<=pnts[0].year; i++) {
        ret.unshift({
          n: pnts[0].n,
          year: pnts[0].year
        })
      }
    }

    if (maxYearTrans) {
      for(let i=pnts[pnts.length-1].year + 1; i <= maxYearTrans; i++) {
        ret.push({
          n: pnts[pnts.length-1].n,
          year: pnts[pnts.length-1].year
        })
      }
    }

    return ret
  }
}