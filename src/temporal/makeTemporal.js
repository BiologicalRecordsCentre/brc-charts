import * as d3 from 'd3'
import { xAxisYear, xAxisMonthText, xAxisMonthNoText, temporalScale, spreadScale, safeId, transPromise } from '../general'
import { generateBars } from './chartBar'
import { generateLines } from './chartLine'
import { generatePointsAndErrors } from './chartPointAndError'
import { generateSupPointsAndErrors } from './chartSupPointAndError'
import { generateSupTrendLines } from './chartSupTrendLine'
import { generateSupVerticals } from './chartSupVertical'

export function makeTemporal (
  svgChart,
  taxon,
  taxa,
  data,
  dataPoints,
  dataTrendLines,
  periodType,
  monthScaleRange,
  minPeriod,
  maxPeriod,
  minPeriodTrans,
  maxPeriodTrans,
  minY,
  maxY,
  minMaxY,
  xPadPercent,
  yPadPercent,
  metricsPlus,
  width,
  height,
  axisTop,
  axisBottom,
  chartStyle,
  axisLeft,
  //yAxisOpts,
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
  lineInterpolator,
  verticals,
  metricExpression,
  composition,
  pTrans
) {
  // Pre-process data.
  // Filter to named taxon and to min and max period and sort in period order
  // Adjust metrics data to accoutn for metricExpress value.
  const dataFiltered = JSON.parse(JSON.stringify(data))
    .filter(d => d.taxon === taxon && d.period >= minPeriod && d.period <= maxPeriod)
    .sort((a, b) => (a.period > b.period) ? 1 : -1)
  
  // Adjust metric values and record, in metric structure,
  // hightest values (required in spread display)
  metricsPlus.forEach(m => {
    const vals = dataFiltered.map(d => d[m.prop])
    let denominator 
    if (metricExpression === 'proportion') {
      denominator = vals.reduce((a, v) => a + v, 0)
    } else if (metricExpression === 'normalized') {
      denominator = Math.max(...vals)
    } else {
      denominator = 1
    }
    dataFiltered.forEach(d => {
      d[m.prop] = d[m.prop] / denominator
    })
    // Record max data value in metric
    m.maxValue = Math.max(...dataFiltered.map(d => d[m.prop]))
  })

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
  function v(d) {
    return typeof(d) === 'number'
  }

  let missing = []
  if (typeof missingValues === 'number') {
    missing = [missingValues]
  }

  let cumulativeTotals = []
  if (composition === 'stack') {
    // For stacked displays, need to creat cumulative totals array
    cumulativeTotals = new Array(dataFiltered.length).fill(0)
    dataFiltered.forEach((d,i) => {
      metricsPlus.forEach(m => {
        cumulativeTotals[i] += d[m.prop]
      })
    })
  }

  const maxMetricYs = metricsPlus.map(m => Math.max(
    ...dataFiltered.filter(d => v(d[m.prop])).map(d => d[m.prop]),
    ...dataFiltered.filter(d => v(d[m.bandUpper])).map(d => d[m.bandUpper]),
    ...dataFiltered.filter(d => v(d[m.errorBarUpper])).map(d => d[m.errorBarUpper]),
    ...missing
  ))

  const maxYA = maxY !== null ? [maxY] : []
  let ymaxY = Math.max(
    ...maxYA,
    ...maxMetricYs,
    ...cumulativeTotals,
    ...dataPointsFiltered.map(d => d.y),
    ...dataPointsFiltered.filter(d => v(d.upper)).map(d => d.upper),
    ...dataTrendLinesFiltered.map(d => d.y1),
    ...dataTrendLinesFiltered.map(d => d.y2)
  )
  const minMetricYs = metricsPlus.map(m => Math.min(
    ...dataFiltered.filter(d => v(d[m.prop])).map(d => d[m.prop]),
    ...dataFiltered.filter(d => v(d[m.bandLower])).map(d => d[m.bandLower]),
    ...dataFiltered.filter(d => v(d[m.errorBarLower])).map(d => d[m.errorBarLower]),
    ...missing
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

  if (minMaxY !== null) {
    if (ymaxY < minMaxY) {
      ymaxY = minMaxY
    }
  }

  // Value scales
  let periods = []
  for (let i = minPeriod; i <= maxPeriod; i++) {
    periods.push(i)
  }

  const xPadding = (maxPeriod-minPeriod) * xPadPercent/100
  const yPadding = (ymaxY-yminY) * yPadPercent/100

  const xScale = temporalScale(chartStyle, periodType, minPeriod, maxPeriod, xPadding, monthScaleRange, width)
  const yScale = spreadScale(yminY, ymaxY, yPadding, metricsPlus, height, composition)

  // Top axis
  let tAxis
  if (axisTop === 'on') {
    tAxis = d3.axisTop()
      .scale(xScale.d3) // Needs a d3 scale obj
      .tickValues([])
      .tickSizeOuter(0)
  }

  // Bottom axis
  let bAxis, bAxis1
  if (axisBottom === 'on' || axisBottom === 'tick') {
    if (periodType === 'year') {
      bAxis = xAxisYear(width, axisBottom === 'tick', minPeriod - xPadding, maxPeriod + xPadding, chartStyle === 'bar')
    } else {
      // PeriodType is month or week.
      // For month or week periodTypes, axis is generated in two parts,
      // one for the ticks and one for the annotation because
      // default places tick in centre of text. bAxis1 takes
      // care of the text.
      bAxis = xAxisMonthNoText(width, monthScaleRange)
      bAxis1 = xAxisMonthText(width, axisBottom === 'tick', axisLabelFontSize, 'Arial', monthScaleRange)
    }
  }

  // Left and right axes
  const makeXaxis = (leftRight, axisOpt) => {
    let axis
    const d3axis = leftRight === 'left' ? d3.axisLeft() : d3.axisRight()
    switch(axisOpt) {
      case 'on':
        axis = d3axis.scale(yScale.yAxis).tickValues([]).tickSizeOuter(0)
        break
      case 'tick':
        axis = d3axis.scale(yScale.yAxis).ticks(5).tickFormat(d3.format(yScale.tickFormat))
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

  // d3 transition object
  const t = svgTemporal.transition().duration(duration)

  // Generate/regenerate chart elements
  generateSupVerticals(verticals, gTemporal, t, xScale, height, pTrans)
  generateBars(dataFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, yminY,  svgChart, interactivity, chartStyle, composition)
  generateLines(dataFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, yminY, periods, minPeriodTrans, maxPeriodTrans, lineInterpolator, missingValues, svgChart, interactivity, chartStyle, composition)
  generatePointsAndErrors(dataFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, chartStyle, svgChart, interactivity)
  generateSupTrendLines(dataTrendLinesFiltered, metricsPlus, gTemporal, t, xScale, yScale, height, pTrans, chartStyle, minPeriod, maxPeriod, xPadding)
  generateSupPointsAndErrors(dataPointsFiltered, gTemporal, t, xScale, yScale, height, pTrans)

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
    
  //} else {
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
    if (bAxis1) {
      // For month or week periodType charts, axis is generated in two parts,
      // one for the ticks and one for the annotation because
      // default places tick in centre of text. Baxis 1 takes
      // care of the text.
      const gBaxis1 = svgTemporal.append("g")
        .attr("class", "x axis1")
        .call(bAxis1)
      gBaxis1.attr("transform", bottomXaxisTrans)
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
      if (bAxis1) {
        transPromise(svgTemporal.select(".x.axis1")
          .transition(t)
          .call(bAxis1), pTrans)
      }
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
}