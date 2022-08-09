import * as d3 from 'd3'
import { month2day, safeId, xAxisMonthNoText, xAxisMonthText, transPromise } from '../general'
import { addEventHandlers} from './highlightitem'

export function makePhen (taxon, taxa, data, metricsin, svgChart, width, height, 
  ytype, spread, axisTop, axisBottom, axisLeft, axisRight, monthLineWidth, bands, lines,
  style, stacked, duration, margin, showTaxonLabel, taxonLabelFontSize, taxonLabelItalics,
  axisLabelFontSize, axisLeftLabel, interactivity, pTrans,  monthFontSize, font
) {

  // Examine the first record to see if week or month is specified for period
  let period
  if (data.length === 0 || 'week' in data[0]) {
    period = 'week'
  } else {
    period = 'month'
  }

  // Reverse the metrics if this is a stacked display
  const metrics = stacked ? [...metricsin].reverse() : [...metricsin]

  // Pre-process data.
  // Filter to named taxon and sort in week/month order
  // Add max value to each.
  const dataFiltered = data.filter(d => d.taxon === taxon)
    .filter(d => period === 'week' ? d[period] < 53 : d[period] < 13)
    .sort((a, b) => (a[period] > b[period]) ? 1 : -1)

  const metricData = [] 
  const stackOffsets = new Array(period === 'week' ? 52 : 12).fill(0) 

  metrics.forEach(m => {
    let total = dataFiltered.reduce((a, d) => a + d[m.prop], 0)
    let max = Math.max(...dataFiltered.map(d => d[m.prop]))
    let maxProportion =  Math.max(...dataFiltered.map(d => d[m.prop]/total))

    // If there are no data for this metric, then reset values
    // The metric will also be marked as no data so that it can
    // be styled as required.
    if (isNaN(total)) {
      total = max = maxProportion = 0
    }

    let points = dataFiltered.map(d => {
      return {
        n: total ? d[m.prop] : 0,
        period: d[period],
        id: `${safeId(m.label)}-${d[period]}`,
      }
    })

    // If the style is areas, then ensure that there is a point 
    // for every week or month.
    if (style === 'areas') {
      const maxPeriod = period === 'week' ? 52 : 12
      const pointsPlus = []
      for (let p = 1; p <= maxPeriod; p++) {
        const match = points.find(p1 => p1.period === p)
        if (typeof(match) !== 'undefined') {
          pointsPlus.push(match)
        } else {
          pointsPlus.push({
            n: 0,
            period: p,
            id: `${safeId(m.label)}-${p}`,
          })
        }
      }
      points = pointsPlus
    }

    // The closure array is a small array of points which can
    // be used, in conjunction with the main points, to make
    // a properly enclosed polygon that drops open sides down
    // to the x axis.
    let closure=[]
    if (points.length) {
      if (points[points.length-1].n > 0) {
        closure.push({n: 0, period: points[points.length-1].period})
      }
      if (points[0].n > 0) {
        closure.push({n: 0, period: points[0].period})
      }
    }

    metricData.push({
      id: safeId(m.label),
      colour: m.colour,
      strokeWidth: m.strokeWidth,
      fill: m.fill ? m.fill : 'none',
      max: max,
      maxProportion: maxProportion,
      total: total,
      points: points,
      stackOffsets: [...stackOffsets],
      closure: closure,
      hasData: total ? true : false
    })

    // If stacked display updated the stackOffsets array
    if (stacked) {
      points.forEach(d => stackOffsets[d.period-1] += d.n)
    }
  })

  // Set the maximum value for the y axis
  let yMax
  if (ytype === 'normalized') {
    yMax = 1
  } else if (ytype === 'proportion') {
    yMax = Math.max(...metricData.map(d => {
      if (isNaN(d.maxProportion)) {
        return 0
      } else {
        return d.maxProportion
      }
    }))
  } else if (stacked) {
    yMax = Math.max(...stackOffsets.filter(d => d))
  } else {
    yMax = Math.max(...metricData.map(d => d.max))
    if (yMax < 5 && !spread && axisLeft === 'tick') yMax = 5
  }
  
  // Calculate spread metrics
  let maxMetricHeight = height
  let topProp = 0
  let spreadHeight = 0

  if (spread && metricData.length > 1) {
    const maxProp = 1.8
    let valMax0, valMax1
    if (ytype === 'normalized') {
      valMax0 = metricData[0].hasData ? 1 : 0
      valMax1 = metricData[1].hasData ? 1 : 0
    } else if(ytype === 'proportion') {
      valMax0 = metricData[0].maxProportion
      valMax1 = metricData[1].maxProportion
    } else {
      valMax0 = metricData[0].max
      valMax1 = metricData[1].max
    }
    const h1Prop = maxProp * valMax0 / yMax
    const h2Prop = maxProp * valMax1 / yMax
    topProp = Math.max(h1Prop, h2Prop-1)
    spreadHeight = height / (0.5 + metricData.length-1 + topProp)
    maxMetricHeight = maxProp * spreadHeight
  }

  // Value scales and related data and functions
  function periodToDay(p) {
    if (period === 'week') {
      if (style === 'bars') {
        return (p-1)*7
      } else {
        // style is lines
        return (p-1)*7 + 3.5
      }
    } else {
      // period === month
      if (style === 'bars') {
        return month2day[p-1]
      } else {
        // style is lines
        return month2day[p-1] + ((month2day[p] - month2day[p-1]) / 2)
      }
    }
  }
  function periodToWidth(p) {
    if (period === 'week') {
      return xScale(7) - xScale(0) - 1
    } else {
      return xScale(month2day[p]) - xScale(month2day[p-1]) - 1
    }
  }
  const xScale = d3.scaleLinear().domain([0, 366]).range([0, width])
  const yScale = d3.scaleLinear().domain([0, yMax]).range([maxMetricHeight, 0])
  // sScale is for the y axis for spread displays
  const ysDomain = ['']
  const ysRange = [0]
  if (metrics.length){
    for (let i=0; i<metrics.length; i++) {
      ysDomain.push(metrics[i].label)
      ysRange.push(topProp*spreadHeight+i*spreadHeight)
    }
    ysDomain.push('')
    ysRange.push(height)
  } else {
    ysRange.push(height)
  }
  const sScale = d3.scaleOrdinal().domain(ysDomain).range(ysRange)

  // Top axis
  let tAxis
  if (axisTop === 'on') {
    tAxis = d3.axisTop()
      .scale(xScale)
      .tickValues([])
      .tickSizeOuter(0)
  }

  // X (bottom) axis
  let xAxis1, xAxis2
  if (axisBottom === 'on' || axisBottom === 'tick') {
    //xAxis = xAxisMonth(width, axisBottom === 'tick')
    xAxis1 = xAxisMonthNoText(width)
    xAxis2 = xAxisMonthText(width, axisBottom === 'tick', monthFontSize, font)
  }

  // Right axis
  let rAxis
  if (axisRight === 'on') {
    rAxis = d3.axisRight()
      .scale(yScale)
      .tickValues([])
      .tickSizeOuter(0)
  }

  // Y (left) axis
  let yAxis
  if (axisLeft === 'on' || axisLeft === 'tick') {
    if (spread) {
      yAxis = d3.axisLeft()
        .scale(sScale)
        .ticks(5)
    } else {
      yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5)
      if (axisLeft !== 'tick') {
        yAxis.tickValues([]).tickSizeOuter(0)
      } else if (ytype === 'count') {
        yAxis.tickFormat(d3.format("d"))
      }
    }
  }

  // Line generator with curves
  const lineCurved = d3.line()
    .curve(d3.curveMonotoneX)
    .x(d => xScale(periodToDay(d.period)))
    .y(d => height - maxMetricHeight + yScale(d.n))
  // Line generator without curves
  const lineNotCurved = d3.line()
    .x(d => xScale(periodToDay(d.period)))
    .y(d => height - maxMetricHeight + yScale(d.n))

  // Create or get the relevant chart svg
  let init, svgPhen1, gPhen1
  if (taxa.length === 1 && svgChart.selectAll('.brc-chart-phen1').size() === 1) {
    svgPhen1 = svgChart.select('.brc-chart-phen1')
    gPhen1 = svgPhen1.select('.brc-chart-phen1-g')
    init = false
  } else if (svgChart.select(`#${safeId(taxon)}`).size()) {
    svgPhen1 = svgChart.select(`#${safeId(taxon)}`)
    gPhen1 = svgPhen1.select('.brc-chart-phen1-g')
    init = false
  } else {
    svgPhen1 = svgChart.append('svg')
      .classed('brc-chart-phen1', true)
      .attr('id', safeId(taxon))
      .style('overflow', 'visible')
    gPhen1 = svgPhen1.append('g')
      .classed('brc-chart-phen1-g', true)
    init = true
  }

  // Vertical bands and lines
  gPhen1.selectAll(".brc-chart-month-band")
    .data(bands,  (b, i) => `month-band-${i}`)
  .enter()
    .append("rect")
    .attr("class", `brc-chart-month-band`)
    .style("fill", (d,i) => bands[i])
    .attr("y", 0)
    .attr("x", (d,i) => xScale(month2day[i]) - 1)
    .attr("height", height)
    .attr("width", (d,i) => {
      return xScale(month2day[i+1]) - xScale(month2day[i])
    })
  gPhen1.selectAll(".brc-chart-month-line")
    .data(lines,  (b, i) => `month-line-${i}`)
  .enter()
    .append("rect")
    .attr("class", `brc-chart-month-line`)
    .style("fill", (d,i) => lines[i])
    .attr("y", 0)
    .attr("x", (d,i) => xScale(month2day[i+1]) - monthLineWidth/2 - 1)
    .attr("height", height)
    .attr("width", monthLineWidth)

  // Create/update the graphics for the metrics 
  const agroups = gPhen1.selectAll("g")
    .data(metricData,  d => d.id)
  
  const egroups = agroups.enter()
    .append("g")
      .attr("opacity", 0)
      .attr("class", d => `phen-metric-${d.id} phen-metric`)

  addEventHandlers(egroups, 'id', interactivity, svgChart)

  const mgroups = agroups.merge(egroups)
    .classed(`phen-metric-no-data`, d => !d.hasData)

  const t = svgChart.transition().duration(duration)

  transPromise(mgroups.transition(t)
    .attr('opacity', 1)
    .attr("transform", (d,i) => `translate(0,-${(metricData.length-1-i + 0.5) * spreadHeight})`), pTrans)

  const xgroups = agroups.exit()

  if (style === 'bars') {
    
    mgroups.each(d => {
      const colour = d.colour
      const max = d.max
      const total = d.total
      const stackOffsets = d.stackOffsets

      gPhen1.select(`.phen-metric-${d.id}`).selectAll('rect')
        .data(d.points,  d => d.id)
        .join (
          enter => enter.append("rect")
              .attr("fill", colour)
              .attr("stroke", 'white')
              .attr("stroke-width", 1)
              .attr("x", d => xScale(periodToDay(d.period))-1)
              .attr("y", height)
              .attr("width", d => periodToWidth(d.period))
              .attr("height", 0),
          update => update
            // Use call for transitions to avoid breaking the
            // method chain (https://observablehq.com/@d3/selection-join)
            .call(update => transPromise(update.transition(t)
              .attr("fill", colour), pTrans)),
          exit => exit
            .call(exit => transPromise(exit.transition(t)
              .attr("height", 0)
              .remove(), pTrans))
        ).call(merge => transPromise(merge.transition(t)
          .attr("y", d => getBarY(d, max, total, stackOffsets))
          .attr("height", d => getBarHeight(d, max, total)), pTrans))
    })
  } else if (style === 'areas') {
    egroups.append("path")
      .attr("class", 'phen-path-area')
      .attr("d", d => flatPath(d, true))
  } else {
    // style ==='line'
    egroups.append("path")
      .attr("class", 'phen-path-fill')
      .attr("d", d => flatPath(d, true))
       
    egroups.append("path")
      .attr("class", 'phen-path-line')
      .attr("d", d => flatPath(d, false))
  }

  // Each phenology line consists of both a line and polygon. This
  // is necessary because if we relied on a single polygon, it is
  // not always possible to confine the line graphics to the part
  // of the polygon which represents the phenology line.

  // Important for correct data binding to use select - NOT selectAll
  // in sub-selections (https://bost.ocks.org/mike/selection/#non-grouping)
  transPromise(mgroups.select('.phen-path-line')
    .transition(t)
    .attr("d", d => getPath(d, false))
    .attr("stroke", d => d.colour)
    .attr("stroke-width", d => d.strokeWidth)
    .attr("fill", "none"), pTrans)

  transPromise(mgroups.select('.phen-path-fill')
    .transition(t)
    .attr("d", d => getPath(d, true))
    .attr("fill", d => d.fill), pTrans)

  transPromise(mgroups.select('.phen-path-area')
    .transition(t)
    .attr("d", d => getPath(d, true))
    .attr("fill", d => d.colour), pTrans)

  transPromise(xgroups.select('.phen-path-line')
    .transition(t)
    .attr("d", d => flatPath(d, false)), pTrans)

  transPromise(xgroups.select('.phen-path-fill')
    .transition(t)
    .attr("d", d => flatPath(d, true)), pTrans)

  transPromise(xgroups.select('.phen-path-area')
    .transition(t)
    .attr("d", d => flatPath(d, true)), pTrans)

  transPromise(xgroups.transition(t)
    .attr("opacity", 0)
    .remove(), pTrans)

  // Path and bar generation helper functions
  function flatPath(d, poly) {
    const lineFn = style === 'areas' ? lineNotCurved : lineCurved
    let flat = lineFn(d.points.map(p => {
        return {
          n: 0,
          period: p.period,
        }
      }))
    if (d.closure.length && poly) {
      flat = `${flat}L${lineNotCurved(d.closure).substring(1)}`
    } 
    return flat
  }
  function getPath(d, poly) {
    const lineFn = style === 'areas' ? lineNotCurved : lineCurved
    let lPath
    if (ytype === 'normalized') {
      lPath = lineFn(d.points.map(p => {
        return {
          n: d.max ? p.n/d.max : 0,
          period: p.period,
        }
      }))
    } else if (ytype === 'proportion') {
      lPath = lineFn(d.points.map(p => {
        return {
          n: d.total === 0 ? 0 : p.n/d.total,
          period: p.period,
        }
      }))
    } else if (stacked) {
      const so1 = [...d.stackOffsets]
      const so2 = [...d.stackOffsets]
      d.points.forEach(p => {
        so2[p.period-1]+=p.n
      })
      const p1 = so1.map((n,i) => {return {period: i+1, n: n}})
      const p2 = so2.map((n,i) => {return {period: i+1, n: n}})
      const all = [...p1, ...p2.reverse()]
      lPath = lineFn(all)
    } else {
      lPath = lineFn(d.points)
    }
    // If this is for a poly underneath a line
    // display, close the path 
    if (poly && d.closure.length && !stacked) {
      lPath = `${lPath}L${lineNotCurved(d.closure).substring(1)}`
    }
    return lPath
  }
  function getBarHeight(d, max, total) {
    let v
    if (ytype === 'normalized') {
      v = max ? d.n/max : 0
    } else if (ytype === 'proportion') {
      v = total === 0 ? 0 : d.n/total
    } else {
      v = d.n
    }
    return maxMetricHeight - yScale(v)
  }

  function getBarY(d, max, total, stackOffsets) {
    let barY
    if (ytype === 'normalized') {
      barY = yScale(max ? d.n/max : 0)
    } else if (ytype === 'proportion') {
      barY = yScale(total === 0 ? 0 : d.n/total)
    } else if (stacked) {
      barY = yScale(stackOffsets[d.period-1] + d.n)
    } else {
      barY = yScale(d.n)
    }
    return barY + (height - maxMetricHeight)
  }

  if (init) {
    // Constants for positioning
    const axisLeftPadX = margin.left ? margin.left : 0
    const axisRightPadX = margin.right ? margin.right : 0
    const axisBottomPadY = margin.bottom ? margin.bottom : 0
    const axisTopPadY = margin.top ? margin.top : 0

    // Taxon title
    if (showTaxonLabel) {
      const taxonLabel = svgPhen1
        .append('text')
        .classed('brc-chart-phen1-label', true)
        .text(taxon)
        .style('font-size', taxonLabelFontSize)
        .style('font-style', taxonLabelItalics ? 'italic' : '')

      const labelHeight = taxonLabel.node().getBBox().height
      taxonLabel.attr("transform", `translate(${axisLeftPadX}, ${labelHeight})`)
    }
    
    // Size SVG
    svgPhen1
      .attr('width', width + axisLeftPadX + axisRightPadX)
      //.attr('height', height + axisBottomPadY + axisTopPadY)
      .attr('height', height + axisBottomPadY + axisTopPadY)

    // Position chart
    gPhen1.attr("transform", `translate(${axisLeftPadX},${axisTopPadY})`)

    // Create axes and position within SVG
    const leftYaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
    const rightYaxisTrans = `translate(${axisLeftPadX + width}, ${axisTopPadY})`
    const topXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY})`
    //const bottomXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY + height})`
    const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${axisTopPadY + height/2}) rotate(270)`
    
    // Create axes and position within SVG
    if (yAxis) {
      const gYaxis = svgPhen1.append("g")
        .attr("class", "y-axis")
      gYaxis.attr("transform", leftYaxisTrans)
    }
    if (xAxis1 && xAxis2) {
      // const gXaxis = svgPhen1.append("g")
      //   .attr("class", "x axis")
      //   .call(xAxis)

      const gXaxis1 = svgPhen1.append("g")
        .attr("class", "x axis")
        .style('font-size', monthFontSize)
        .call(xAxis1)

      const gXaxis2 = svgPhen1.append("g")
        .attr("class", "x axis")
        .style('font-size', monthFontSize)
        .call(xAxis2)

      // gXaxis.selectAll(".tick text")
      //   .style("text-anchor", "start")
      //   .attr("x", 6)
      //   .attr("y", 6)

      // gXaxis.attr("transform", bottomXaxisTrans)

      gXaxis2.selectAll(".tick text")
        .style("text-anchor", "middle")

      gXaxis1.attr("transform", `translate(${axisLeftPadX},${height + axisTopPadY})`)
      gXaxis2.attr("transform", `translate(${axisLeftPadX},${height + axisTopPadY})`)
    }
    if (tAxis) {
      const gTaxis = svgPhen1.append("g")
        .call(tAxis)
      gTaxis.attr("transform", topXaxisTrans)
    }
    if (rAxis) {
      const gRaxis = svgPhen1.append("g")
        .call(rAxis)
      gRaxis.attr("transform", rightYaxisTrans)
    }

    const tYaxisLeftLabel = svgPhen1.append("text")
      .style("text-anchor", "middle")
      .style('font-size', axisLabelFontSize)
      .text(axisLeftLabel) 
    tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans)

  } else if (taxa.length === 1) {
    // Update taxon label
    if (showTaxonLabel) {
      svgPhen1.select('.brc-chart-phen1-label').text(taxon)
    }
  }

  if (yAxis) {
    transPromise(svgPhen1.select(".y-axis")
      .transition(t)
      .call(yAxis), pTrans)
  }

  return svgPhen1
}