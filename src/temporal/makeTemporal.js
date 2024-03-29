import * as d3 from 'd3'
import { addG, xAxisYear, xAxisMonthText, xAxisMonthNoText, temporalScale, spreadScale, safeId, transPromise } from '../general'
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
  spreadOverlap,
  pTrans,
  watermark
) {
  
  // xPadding is calculated before yPadding because it is needed early
  const xPadding = (maxPeriod-minPeriod) * xPadPercent/100
  
  // Pre-process data.
  // Filter to named taxon and to min and max period and sort in period order
  // Adjust metrics data to accoutn for metricExpress value.
  const dataFiltered = JSON.parse(JSON.stringify(data))
    .filter(d => taxon ? d.taxon === taxon : true)
    .filter(d => (d.period >= minPeriod && d.period <= maxPeriod))
    .sort((a, b) => (a.period > b.period) ? 1 : -1)
  // Adjust metric values and record, in metric structure,
  // hightest values (required in spread display)

  metricsPlus.forEach(m => {
    // If taxon named in metric, further filter data to the named taxon.
    const dataFilteredMetric = dataFiltered.filter(d => m.taxon ? d.taxon === m.taxon : true)

    let denominator 
    if (metricExpression === 'proportion') {
      denominator = dataFilteredMetric.map(d => d[m.prop]).reduce((a, v) => a + v, 0)
    } else if (metricExpression === 'normalized') {
      denominator = Math.max(...dataFilteredMetric.map(d => d[m.prop]))
    } else {
      denominator = 1
    }
    dataFilteredMetric.forEach(d => {
      if (d[m.prop] !== null) {
        d[m.prop] = d[m.prop] / denominator
      }
    })
    // Record max data value in metric
    const errorBarUppers = m.errorBarUpper && m.errorBarLower ? dataFilteredMetric.map(d => d[m.errorBarUpper]) : []
    const bandUppers = m.bandUpper && m.bandLower ? dataFilteredMetric.map(d => d[m.bandUpper]) : []
    m.maxValue = Math.max(...dataFilteredMetric.map(d => d[m.prop]), ...errorBarUppers, ...bandUppers)
  })

  // Add data displacement values for cummulative displays such as stacked
  dataFiltered.forEach(d => {
    metricsPlus.forEach((m,i) => {
      if (!m.taxon || d.taxon === m.taxon) {
        if (!d.displacement) {
          d.displacement = [0]
        } else {
          d.displacement.push(d.displacement[i-1] + d[metricsPlus[i-1].prop])
        }
      }
    })
  })

  // Filter dataPoints data on taxon (if specified) and to within min and max period.
  const dataPointsFiltered = dataPoints
    .filter(d =>  (taxon && d.taxon ? d.taxon === taxon : true) && d.period >= minPeriod && d.period <= maxPeriod)
    .sort((a, b) => (a.period > b.period) ? 1 : -1)

  // Filter dataTrendLines data on taxon (if specified) and convert from an 
  // array of gradients and intercepts to an array of arrays of two point lines.
  // If the coords of the lines are included in dataTrendLines rather than
  // gradients and intercepts, then these values are used. 

  const dataTrendLinesFiltered = dataTrendLines
    .filter(d => taxon && d.taxon ? d.taxon === taxon : true)
    .map(d => {
      let y1, y2, p1, p2
      if (d.p1 && d.p2 && d.v1 && d.v2 ) {
        p1 = d.p1
        p2 = d.p2
        y1 = d.v1
        y2 = d.v2
      } else {
        p1 = minPeriod - xPadding
        p2 = maxPeriod + xPadding
        if(d.gradient === 0) {
          y1 = d.intercept
          y2 = d.intercept
        } else {
          y1 = d.gradient * minPeriod + d.intercept 
          y2 = d.gradient * maxPeriod + d.intercept
        }
      }

      return {
        id: d.id,
        taxon: d.taxon,
        colour: d.colour,
        width: d.width,
        opacity: d.opacity,
        y1: y1,
        y2: y2,
        p1: p1,
        p2: p2
      }
    })

  // Filter verticals on taxon (if specified) and to within min and max period.
  const verticalsFiltered = verticals
    .filter(d =>  (d.taxon && taxon ? d.taxon === taxon : true))
    .sort((a, b) => (a.period > b.period) ? 1 : -1)

  //Set the min and maximum values for the y axis
  function v(d) {
    return typeof(d) === 'number'
  }

  function inRange(m,d) {
    let ret = true
    if (m.periodMin && d.period < m.periodMin) ret = false
    if (m.periodMax && d.period > m.periodMax) ret = false
    return ret
  }

  // This next section is all about working out the minimum and maximum Y values
  // (minYscale and maxYscale) which are required for generating the Y scale. It is 
  // complicated because it depends on the type of data used and the display
  // composition.
  let missing = []
  if (typeof(missingValues) !== 'undefined' && missingValues !== 'break' && missingValues !== 'bridge') {
    // Maybe need to be more nuanced here - only adding missing value if it is actually used
    // to replace missing values in dataset.
    missing = [Number(missingValues)]
  }
  let cumulativeTotals = []
  const extensionValues = []
  if (composition === 'stack') {
    // For stacked displays, need to create cumulative totals array
    cumulativeTotals = new Array(dataFiltered.length).fill(0)
    dataFiltered.forEach((d,i) => {
      metricsPlus.forEach(m => {
        // In stacked displays, error bars/bands from metrics other
        // than the one stacked on top can extend beyond the limit
        // of the metric on top, so we create an array to hold all
        // the possible values that could be the maximum value.
        if (!m.taxon || d.taxon === m.taxon) {
          if (v(d[m.bandUpper])) {
            extensionValues.push(cumulativeTotals[i] + d[m.bandUpper])
          }
          if (v(d[m.errorBarUpper])) {
            extensionValues.push(cumulativeTotals[i] + d[m.errorBarUpper])
          }
          // Increment the cumulative total
          cumulativeTotals[i] += d[m.prop]
        }
      })
    })
  }

  const maxMetricYs = metricsPlus.map(m => Math.max(
    ...dataFiltered.filter(d => m.taxon ? d.taxon === m.taxon : true).filter(d => v(d[m.prop])).filter(d => inRange(m,d)).map(d => d[m.prop]),
    ...dataFiltered.filter(d => m.taxon ? d.taxon === m.taxon : true).filter(d => v(d[m.bandUpper])).filter(d => inRange(m,d)).map(d => d[m.bandUpper]),
    ...dataFiltered.filter(d => m.taxon ? d.taxon === m.taxon : true).filter(d => v(d[m.errorBarUpper])).filter(d => inRange(m,d)).map(d => d[m.errorBarUpper]),
  ))
  const maxYA = maxY !== null ? [maxY] : []
  let maxYscale = Math.max(
    ...maxYA,
    ...maxMetricYs,
    ...cumulativeTotals,
    ...extensionValues,
    ...dataPointsFiltered.map(d => d.y),
    ...dataPointsFiltered.filter(d => v(d.upper)).map(d => d.upper),
    ...dataTrendLinesFiltered.map(d => d.y1),
    ...dataTrendLinesFiltered.map(d => d.y2)
  )

  const minMetricYs = metricsPlus.map(m => Math.min(
    ...dataFiltered.filter(d => m.taxon ? d.taxon === m.taxon : true).filter(d => v(d[m.prop])).filter(d => inRange(m,d)).map(d => d[m.prop]),
    ...dataFiltered.filter(d => m.taxon ? d.taxon === m.taxon : true).filter(d => v(d[m.bandLower])).filter(d => inRange(m,d)).map(d => d[m.bandLower]),
    ...dataFiltered.filter(d => m.taxon ? d.taxon === m.taxon : true).filter(d => v(d[m.errorBarLower])).filter(d => inRange(m,d)).map(d => d[m.errorBarLower]),
    ...missing
  ))

  //console.log('dataFiltered', dataFiltered)
  //console.log('minMetricYs', minMetricYs)

  const minYA = minY !== null ? [minY] : []
  let minYscale = Math.min(
    ...minYA,
    ...minMetricYs,
    ...dataPointsFiltered.map(d => d.y),
    ...dataPointsFiltered.filter(d => d.lower).map(d => d.lower),
    ...dataTrendLinesFiltered.map(d => d.y1),
    ...dataTrendLinesFiltered.map(d => d.y2)
  )
  if (minMaxY !== null) {
    if (maxYscale < minMaxY) {
      maxYscale = minMaxY
    }
  }

  // Value scales
  let periods = []
  for (let i = minPeriod; i <= maxPeriod; i++) {
    periods.push(i)
  }

  // yPadding (xPadding calculated earlier when needed)
  const yPadding = (maxYscale-minYscale) * yPadPercent/100

  const xScale = temporalScale(chartStyle, periodType, minPeriod, maxPeriod, xPadding, monthScaleRange, width)
  const yScale = spreadScale(minYscale, maxYscale, yPadding, metricsPlus, height, composition, spreadOverlap)

  // Top axis
  let tAxis
  if (axisTop === 'on') {
    tAxis = d3.axisTop()
      .scale(d3.scaleLinear().domain([0,1]).range([0, width])) // Needs a d3 scale obj
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
      // default axes tick in centre of text. bAxis1 takes
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

  // Add specific g elements to gTemporal for different chart element groups
  // The order they are added affects there position in the display stack
  // Those added last are displayed on top.
  const gWatermark = addG('gTemporalWatermark', gTemporal)
  const gVerticals = addG('gSupVerticals', gTemporal)
  const gBars = addG('gTemporalBars', gTemporal)
  const gLines = addG('gTemporalLines', gTemporal)
  const gPointsAndErrors = addG('gTemporalPointsAndErrors', gTemporal)
  const gSupTrendLines = addG('gTemporalSupTrendLines', gTemporal)
  const gSupPointsAndErrors = addG('gTemporalSupPointsAndErrors', gTemporal)

  // Generate/regenerate chart elements
  generateBars(dataFiltered, metricsPlus, gBars, t, xScale, yScale, height, pTrans, minYscale,  svgChart, interactivity, chartStyle, composition)
  generateLines(dataFiltered, metricsPlus, gLines, t, xScale, yScale, height, pTrans, minYscale, periods, minPeriodTrans, maxPeriodTrans, lineInterpolator, missingValues, svgChart, interactivity, chartStyle, composition)
  generatePointsAndErrors(dataFiltered, metricsPlus, gPointsAndErrors, t, xScale, yScale, height, pTrans, chartStyle, svgChart, interactivity, composition)
  generateSupTrendLines(dataTrendLinesFiltered, metricsPlus, gSupTrendLines, t, xScale, yScale, height, pTrans, chartStyle, svgChart, interactivity)
  generateSupPointsAndErrors(dataPointsFiltered, gSupPointsAndErrors, t, xScale, yScale, height, pTrans)
  generateSupVerticals(verticalsFiltered, gVerticals, t, xScale, height, pTrans)
  
  if (init) {

    // Constants for positioning
    const axisLeftPadX = margin.left ? margin.left : 0
    const axisRightPadX = margin.right ? margin.right : 0
    const axisBottomPadY = margin.bottom ? margin.bottom : 0
    const axisTopPadY = margin.top ? margin.top : 0

    // Watermark
    if (watermark.text) {

      const wmark = gWatermark.append('text')
      wmark.text(watermark.text)
      if (watermark.font) {
        wmark.style('font-family', watermark.font)
      }
      wmark.style('font-size', watermark.fontSize ? `${watermark.fontSize}px` : '20px')
      wmark.style('font-weight', watermark.fontWeight ? watermark.fontWeight : 'bolder')
      if (watermark.colour) {
        wmark.style('fill', watermark.colour)
      }
      wmark.style('fill-opacity', watermark.opacity ? watermark.opacity : '0.3')

      const wmarkWidth = wmark.node().getBBox().width
      const wmarkHeight = wmark.node().getBBox().height
      const wMarkY =  wmark.node().getBBox().y

      const rotation = watermark.rotation ? watermark.rotation : 0
      wmark.style('transform-origin', `${wmarkWidth/2}px ${wmarkHeight/2+wMarkY}px`)
      wmark.style('transform', `translate(${width/2-wmarkWidth/2}px, ${height/2-wmarkHeight/2-wMarkY}px) rotate(${rotation}deg)`)
    }

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