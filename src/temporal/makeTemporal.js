import * as d3 from 'd3'
import { xAxisYear, xAxisMonthText, xAxisMonthNoText, safeId, transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function makeTemporal (
  svgChart,
  taxon,
  taxa,
  data,
  dataPoints,
  dataTrendLines,
  periodType,
  minPeriod,
  maxPeriod,
  minPeriodTrans,
  maxPeriodTrans,
  minY,
  maxY,
  xPadPercent,
  yPadPercent,
  metricsPlus,
  width,
  height,
  axisTop,
  axisBottom,
  chartStyle,
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
  missingValues,
  pTrans
) {
  // Pre-process data.
  // Filter to named taxon and to min and max period and sort in period order
  // Add max value to each.

  const dataFiltered = data
    .filter(d => d.taxon === taxon && d.period >= minPeriod && d.period <= maxPeriod)
    .sort((a, b) => (a.period > b.period) ? 1 : -1)

  const dataPointsFiltered = dataPoints
    .filter(d => d.taxon === taxon && d.period >= minPeriod && d.period <= maxPeriod)
    .sort((a, b) => (a.period > b.period) ? 1 : -1)

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
        y1: d.gradient * minPeriod + d.intercept,
        y2: d.gradient * maxPeriod + d.intercept
      }
    })


  //Set the min and maximum values for the y axis
  const maxMetricYs = metricsPlus.map(m => Math.max(
    ...dataFiltered.map(d => d[m.prop]),
    ...dataFiltered.filter(d => d[m.bandUpper]).map(d => d[m.bandUpper])
  ))

  const maxYA = maxY !== null ? [maxY] : []
  let ymaxY = Math.max(
    ...maxYA,
    ...maxMetricYs,
    ...dataPointsFiltered.map(d => d.y),
    ...dataPointsFiltered.filter(d => d.upper).map(d => d.upper),
    ...dataTrendLinesFiltered.map(d => d.y1),
    ...dataTrendLinesFiltered.map(d => d.y2)
  )
  const minMetricYs = metricsPlus.map(m => Math.min(
    ...dataFiltered.map(d => d[m.prop]),
    ...dataFiltered.filter(d => d[m.bandLower]).map(d => d[m.bandLower])
  ))

  const minYA = minY !== null ? [minY] : []
  let yminY = Math.min(
    ...minYA,
    ...minMetricYs,
    ...dataPointsFiltered.map(d => d.y),
    ...dataPointsFiltered.filter(d => d.lower).map(d => d.lower),
    ...dataTrendLinesFiltered.map(d => d.y1),
    ...dataTrendLinesFiltered.map(d => d.y2)
  )

  if (yAxisOpts.minMax !== null) {
    if (ymaxY < yAxisOpts.minMax) {
      ymaxY = yAxisOpts.minMax
    }
  }
  if (yAxisOpts.fixedMin !== null) {
    yminY = yAxisOpts.fixedMin
  }
  
  // Value scales
  let periods = []
  for (let i = minPeriod; i <= maxPeriod; i++) {
    periods.push(i)
  }

  const xPadding = (maxPeriod-minPeriod) * xPadPercent
  const yPadding = (ymaxY-yminY) * yPadPercent

  const xScaleBar = d3.scaleBand().domain(periods).range([0, width]).paddingInner(0.1)
  const xScaleLine = d3.scaleLinear().domain([minPeriod - xPadding, maxPeriod + xPadding]).range([0, width])
  const yScale = d3.scaleLinear().domain([yminY - yPadding, ymaxY + yPadding]).range([height, 0])
  
  // Top axis
  let tAxis
  if (axisTop === 'on') {
    tAxis = d3.axisTop()
      .scale(xScaleLine) // Actual scale doesn't matter, but needs one
      .tickValues([])
      .tickSizeOuter(0)
  }

  // Bottom axis
  let bAxis, bAxisTicks
  if (axisBottom === 'on' || axisBottom === 'tick') {
    if (periodType === 'year') {
      bAxis = xAxisYear(width, axisBottom === 'tick', minPeriod - xPadding, maxPeriod + xPadding, chartStyle === 'bar')
    } else {
      bAxis = xAxisMonthNoText(width)
      //bAxis = xAxisMonthText(width, axisBottom === 'tick', axisLabelFontSize, 'Arial')
    }
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
  let init, svgTemporal, gTemporal

  if (taxa.length === 1 && svgChart.selectAll('.brc-chart-temporal').size() === 1) {
    svgTemporal = svgChart.select('.brc-chart-temporal')
    gTemporal = svgTemporal.select('.brc-chart-temporal-g')
    init = false
  } else if (svgChart.select(`#${safeId(taxon)}`).size()) {
    svgTemporal = svgChart.select(`#${safeId(taxon)}`)
    gTemporal = svgTemporal.select('.brc-chart-temporal-g')
    init = false
  } else {
    svgTemporal = svgChart.append('svg')
      .classed('brc-chart-temporal', true)
      .attr('id', safeId(taxon))
      .style('overflow', 'visible')
      .style('font-family', 'sans-serif')
    gTemporal = svgTemporal.append('g')
      .classed('brc-chart-temporal-g', true)
    init = true
  }

  // Line path generator
  const lineValues = d3.line()
    //.curve(d3.curveMonotoneX) // Interpolating curves can make transitions of polygons iffy
                                // because resulting number of points in path is not constant.
    .x(d => xScaleLine(d.period))
    .y(d => yScale(d.n))

  let chartLines = []
  let chartBars = []
  let chartBands = []
  let chartPoints = []
  let chartErrorBars = []

  metricsPlus.forEach(m => {

    // Create a collection of the periods in the dataset.
    const dataDict = dataFiltered.reduce((a,d) => {
      a[d.period]=d[m.prop]
      return a
    }, {})

    // Construct data structure for line charts.
    if (chartStyle === 'line' && isFinite(yminY)) {

      const pointSets = adjustForTrans(periods.map(y => {
        // Replace any missing values (for a given period)
        // with the missing value specified (can be a value
        // or 'bridge' or 'break')
        return {
          period: y,
          n: dataDict[y] ? dataDict[y] : missingValues,
        }
      }))
      pointSets.forEach((points, i) => {
        chartLines.push({
          colour: m.colour,
          opacity: m.opacity,
          strokeWidth: m.strokeWidth,
          type: 'counts',
          prop: m.prop,
          part: i,
          yMin: yminY,
          pathEnter: lineValues(points.map(p => {
            return {
              n: yminY,
              period: p.period
            }
          })),
          path: lineValues(points)
        })
      })
    }

    // Construct data structure for confidence band on line charts.
    if (chartStyle === 'line' && m.bandUpper && m.bandLower && isFinite(yminY)) {
      const ddUpper = dataFiltered.reduce((a,d) => {
        a[d.period]=d[m.bandUpper]
        return a
      }, {})
      const ddLower = dataFiltered.reduce((a,d) => {
        a[d.period]=d[m.bandLower]
        return a
      }, {})
      const upperLine = periods.map(y => {
        return {
          period: y,
          n: ddUpper[y] ? ddUpper[y] : missingValues,
        }
      })
      const lowerLine = [...periods].map(y => {
        return {
          period: y,
          n: ddLower[y] ? ddLower[y] : missingValues,
        }
      })

      const pointsLowerSet = adjustForTrans(lowerLine)
      const pointsUpperSet = adjustForTrans(upperLine)
      for (let i=0; i<pointsLowerSet.length; i++) {

        const pointsLower = pointsLowerSet[i]
        const pointsUpper = pointsUpperSet[i]
        const pointsBand = [...pointsLowerSet[i], ...pointsUpperSet[i].reverse()]

        const pointsLowerEnter = pointsLower.map(p => {
          return {
            n: yminY,
            period: p.period
          }
        })
        const pointsUpperEnter = pointsUpper.map(p => {
          return {
            n: yminY,
            period: p.period
          }
        })

        chartBands.push({
          fill: m.bandFill ? m.bandFill : 'silver',
          stroke: m.bandStroke ? m.bandStroke : 'grey',
          fillOpacity: m.bandOpacity !== undefined ? m.bandOpacity : 0.5,
          strokeOpacity: m.bandStrokeOpacity !== undefined ? m.bandStrokeOpacity : 1,
          strokeWidth: m.bandStrokeWidth !== undefined ? m.bandStrokeWidth : 1,
          //type: 'counts',
          prop: m.prop,
          part: i,
          bandPath: lineValues(pointsBand),
          bandPathEnter: lineValues(pointsBand.map(p => {
            return {
              n: yminY,
              period: p.period
            }
          })),
          bandBorders: [lineValues(pointsLower), lineValues(pointsUpper)],
          bandBordersEnter: [lineValues(pointsLowerEnter), lineValues(pointsUpperEnter)]
        })
      }
    }

    // Construct data structure for bar charts.
    if (chartStyle === 'bar') {
      const bars = dataFiltered.map(d => {
        return {
          colour: m.colour,
          opacity: m.opacity,
          //type: 'counts',
          prop: m.prop,
          period: d.period,
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
        if (chartStyle === 'bar') {
          x = xScaleBar(d.period) + xScaleBar.bandwidth() / 2
        } else {
          x = xScaleLine(d.period)
        }
        return {
          x: x,
          y: yScale(d[m.prop]),
          period: d.period,
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
        if (chartStyle === 'bar') {
          x = xScaleBar(d.period) + xScaleBar.bandwidth() / 2
        } else {
          x = xScaleLine(d.period)
        }
        return {
          period: d.period,
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
    const minx = minPeriod - xPadding
    const maxx = maxPeriod + xPadding
    if (chartStyle === 'bar') {
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
    // if (chartStyle === 'bar') {
    //   x = xScaleBar(Math.floor(d.period)) + xScaleBar.bandwidth() * 0.5 +(d.period % 1)
    // } else {
    //   x = xScaleLine(d.period)
    // }
    x = xScaleLine(d.period)

    return {
      x: x,
      y: yScale(d.y),
      period: d.period
    }
  })

  // Construct data structure for supplementary point error bars.
  // TODO - if at some point we parameterise display styles,
  // then it must be specified in here.
  const chartPointsSupErrorBars = dataPointsFiltered.map(d => {
    const x = xScaleLine(d.period)
    return {
      pathEnter:  `M ${x} ${height} L ${x} ${height}`,
      path: `M ${x} ${yScale(d.lower)} L ${x} ${yScale(d.upper)}`,
      period: d.period
    }
  })

  // d3 transition object
  const t = svgTemporal.transition()
      .duration(duration)

  // Bars
  gTemporal.selectAll(".temporal-bar")
    .data(chartBars, d => `bars-${d.prop}-${d.period}`)
    .join(
      enter => enter.append("rect")
        .attr("class", d => `temporal-bar temporal-graphic temporal-${d.prop}`)
        .attr('width', xScaleBar.bandwidth())
        .attr('height', 0)
        .attr('fill', d => d.colour)
        .attr('opacity', 0)
        .attr('y', height)
        .attr('x', d => xScaleBar(d.period)),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr('height', 0)
          .attr('y', height)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr('y', d => d.n)
      .attr('x', d => xScaleBar(d.period))
      .attr('height', d => height - d.n)
      .attr('width', xScaleBar.bandwidth())
      .attr("fill", d => d.colour)
      .attr("opacity", d => d.opacity), pTrans))

  // Bands
  gTemporal.selectAll(".temporal-band")
    .data(chartBands, d => `band-${d.prop}-${d.part}`)
    .join(
      enter => enter.append("path")
        .attr("class", d => `temporal-band temporal-graphic temporal-${d.prop}`)
        .attr("opacity", 0)
        .attr("fill", d => d.fill)
        .attr("stroke", "none")
        .attr("d", d => d.bandPathEnter),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr("d", d => d.bandPathEnter)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", d => d.bandPath)
      .attr("opacity", d => d.fillOpacity)
      .attr("fill", d => d.fill), pTrans))


  // Band lines
  for (let iLine=0; iLine<2; iLine++) { 
    gTemporal.selectAll(`.temporal-band-border-${iLine}`)
      .data(chartBands, d => `band-line-${d.prop}-${iLine}-${d.part}`)
      .join(
        enter => enter.append("path")
          .attr("class", d => `temporal-band-border-${iLine} temporal-graphic temporal-${d.prop}`)
          .attr("opacity", 0)
          .attr("fill","none")
          .attr("stroke", d => d.stroke)
          .attr("stroke-width", d => d.strokeWidth)
          .attr("d", d => d.bandBordersEnter[iLine]),
        update => update,
        exit => exit
          .call(exit =>  transPromise(exit.transition(t)
            .attr("d", d => d.bandBordersEnter[iLine])
            .style("opacity", 0)
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
  gTemporal.selectAll(".temporal-line")
    .data(chartLines,  d => `line-${d.prop}-${d.part}`)
    .join(
      enter => enter.append("path")
        .attr("class", d => `temporal-line temporal-graphic temporal-${d.prop}`)
        .attr("opacity", 0)
        .attr("fill", "none")
        .attr("stroke", d => d.colour)
        .attr("stroke-width", d => d.strokeWidth)
        .attr("d", d => d.pathEnter),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          .attr("d", d => d.pathEnter)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", d => d.path)
      .attr("opacity", d => d.opacity)
      .attr("stroke", d => d.colour)
      .attr("stroke-width", d => d.strokeWidth), pTrans))

  // Error bars
  gTemporal.selectAll('.temporal-error-bars')
      .data(chartErrorBars, d => `error-bars-${d.prop}-${d.period}`)
      .join(
        enter => enter.append('path')
          .attr("class", d => `temporal-error-bars temporal-graphic temporal-${d.prop}`)
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
  gTemporal.selectAll('.temporal-point')
      .data(chartPoints, d => `point-${d.prop}-${d.period}`)
      .join(
        enter => enter.append('circle')
          .attr("class", d => `temporal-point temporal-graphic temporal-${d.prop}`)
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
  gTemporal.selectAll('.temporal-trend-lines-sup')
    .data(chartTrendLineSup)
    .join(
      enter => enter.append('path')
        .attr("d", d => d.pathEnter)
        .attr('class', 'temporal-trend-lines-sup')
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
  gTemporal.selectAll('.temporal-error-bars-sup')
    .data(chartPointsSupErrorBars, d => `error-bars-sup-${d.period}`)
    .join(
      enter => enter.append('path')
        .attr("class", `temporal-error-bars-sup`)
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
  gTemporal.selectAll('.temporal-point-data-sup')
      .data(chartPointsSup, d => `point-data-sup-${d.period}`)
      .join(
        enter => enter.append('circle')
          .attr("class", `temporal-point-data-sup`)
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

  addEventHandlers(gTemporal.selectAll("path"), 'prop', svgChart, interactivity)
  addEventHandlers(gTemporal.selectAll(".temporal-bar"), 'prop', svgChart, interactivity)
  addEventHandlers(gTemporal.selectAll(".temporal-point"), 'prop', svgChart, interactivity)
      
  if (init) {

    // Constants for positioning
    const axisLeftPadX = margin.left ? margin.left : 0
    const axisRightPadX = margin.right ? margin.right : 0
    const axisBottomPadY = margin.bottom ? margin.bottom : 0
    const axisTopPadY = margin.top ? margin.top : 0

    // Taxon title
    if (showTaxonLabel) {
      const taxonLabel = svgTemporal
        .append('text')
        .classed('brc-chart-temporal-label', true)
        .text(taxon)
        .style('font-size', taxonLabelFontSize)
        .style('font-style', taxonLabelItalics ? 'italic' : '')

      const labelHeight = taxonLabel.node().getBBox().height
      taxonLabel.attr("transform", `translate(${axisLeftPadX}, ${labelHeight})`)
    }
    
      // Size SVG
    svgTemporal
      .attr('width', width + axisLeftPadX + axisRightPadX)
      .attr('height', height + axisBottomPadY + axisTopPadY)

    // Position chart
    gTemporal.attr("transform", `translate(${axisLeftPadX},${axisTopPadY})`)
    
    // Create axes and position within SVG
    const leftYaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
    const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${axisTopPadY + height/2}) rotate(270)`
    const rightYaxisTrans = `translate(${axisLeftPadX + width}, ${axisTopPadY})`
    const rightYaxisLabelTrans = `translate(${axisLeftPadX + width + axisRightPadX - axisLabelFontSize}, ${axisTopPadY + height/2}) rotate(90)`
    const topXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
    const bottomXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY + height})`

    // Create axes and position within SVG
    if (lAxis) {
      const gLaxis = svgTemporal.append("g")
        .attr("class", "l-axis")
        // .classed('temporal-type-counts',  axisLeft === 'tick')
        // .classed('temporal-type-props',  axisLeft !== 'tick')
      gLaxis.attr("transform", leftYaxisTrans)
    }
    if (bAxis) {
      const gBaxis = svgTemporal.append("g")
        .attr("class", "x axis")
        .call(bAxis)
      gBaxis.attr("transform", bottomXaxisTrans)
    }
    if (tAxis) {
      const gTaxis = svgTemporal.append("g")
        .call(tAxis)
      gTaxis.attr("transform", topXaxisTrans)
    }
    if (rAxis) {
      const gRaxis = svgTemporal.append("g")
        //.call(rAxis)
        .attr("class", "r-axis")
        // .classed('temporal-type-counts',  axisRight === 'tick')
        // .classed('temporal-type-props',  axisRight !== 'tick')
      gRaxis.attr("transform", rightYaxisTrans)
    }

    const tYaxisLeftLabel = svgTemporal.append("text")
      // .classed('temporal-type-counts',  axisLeft === 'tick')
      // .classed('temporal-type-props',  axisLeft !== 'tick')
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisLeftLabel) 
    tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans)

    const tYaxisRightLabel = svgTemporal.append("text")
      // .classed('temporal-type-counts',  axisRight === 'tick')
      // .classed('temporal-type-props',  axisRight !== 'tick')
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisRightLabel) 
    tYaxisRightLabel.attr("transform", rightYaxisLabelTrans)

  } else {
    if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgTemporal.select('.brc-chart-temporal-label').text(taxon)
      }
    }

    // Update the bottom axis if it exists. We do this because
    // periodMin and/or periodMax may have changed.
    if (axisBottom === 'on' || axisBottom === 'tick') {
      transPromise(svgTemporal.select(".x.axis")
        .transition(t)
        .call(bAxis), pTrans)
    }
  }

  if (svgTemporal.selectAll(".l-axis").size()){

    transPromise(svgTemporal.select(".l-axis")
      .transition(t)
      .call(lAxis), pTrans)
  }

  if (svgTemporal.selectAll(".r-axis").size()){
    transPromise(svgTemporal.select(".r-axis")
      .transition(t)
      .call(rAxis), pTrans)
  }
  
  return svgTemporal

  function adjustForTrans(pntsIn) {
    // Return an array of arrays of points. There may be more than one array
    // of points in the main array if there are breaks in the input array
    // of points.

    // First restructure the passed in points to an array of arrays.
    let pntsSplit = []
    pntsIn.forEach(p => {
      if (p.n === 'break') {
        // Add a new array
        pntsSplit.push([])
      } else {
        if (pntsSplit.length === 0) {
          // Fist value so first add a new array
          pntsSplit.push([])
        }
        // Add point to array
        pntsSplit[pntsSplit.length - 1].push(p)
      }
    })
    // At this point pntsSplit could have empty arrays, e.g. if there
    // where consecutive 'breaks' so weed these out.
    pntsSplit = pntsSplit.filter(a => a.length > 0)

    // Adjust of transition temporal ranges
    const retSet = []
    pntsSplit.forEach(pnts => {

      const ret = [...pnts]
      retSet.push(ret)

      // If missing period values are being bridged, add a point at last
      // known value.
      for (let i = 0; i < pnts.length; i++) {
        if (pnts[i].n === 'bridge') {
          pnts[i].n = pnts[i-1].n
          pnts[i].period = pnts[i-1].period
        }
      }

      // When minPeriodTans and MaxPeriodTrans are set, then each trend line
      // must have the same number of points in (MaxPeriodTrans - minPeriodTans + 1 points).
      // This is to make nice looking transitions between lines with otherwise
      // different numbers of points.
      if (minPeriodTrans) {
        for(let i=minPeriodTrans; i<pnts[0].period; i++) {
          ret.unshift({
            n: pnts[0].n,
            period: pnts[0].period
          })
        }
      }
      if (maxPeriodTrans) {
        for(let i=pnts[pnts.length-1].period + 1; i <= maxPeriodTrans; i++) {
          ret.push({
            n: pnts[pnts.length-1].n,
            period: pnts[pnts.length-1].period
          })
        }
      }
    })
    
    return retSet
    //return retSet[retSet.length - 1]
  }
}