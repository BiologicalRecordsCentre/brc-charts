import * as d3 from 'd3'
import { addG, transPromise } from '../general'
import { addEventHandlers } from './highlightitem'

export function generateLines(
  dataFiltered, 
  metricsPlus, 
  gTemporal, 
  t, 
  xScale, 
  yScale, 
  height, 
  pTrans, 
  yminY, 
  periods, 
  minPeriodTrans, 
  maxPeriodTrans,
  lineInterpolator,
  missingValues,
  svgChart, 
  interactivity,
  chartStyle,
  composition
) {

  // Add g elements in increasing order of display priority
  const gLinesAreas = addG('gLinesAreas', gTemporal)
  const gLinesBands = addG('gLinesBands', gTemporal)
  const gLinesBandLines = addG('gLinesBandLines', gTemporal)
  const gLinesLines = addG('gLinesLines', gTemporal)

  const lineValues = (points, iPart) => {
    // console.log(iPart, points)
    // points.forEach(d => {
    //   console.log(d.n, yScale(d.n, iPart), height)
    // })
    const d3LineGen = d3.line()
      .x(d => xScale(d.period))
      .y(d => yScale(d.n, iPart))
    if (lineInterpolator) {
      // Interpolating curves can make transitions of polygons iffy
      // because resulting number of points in path is not constant.
      d3LineGen.curve(d3[lineInterpolator]) 
    }
    return d3LineGen(points)
  }

  let chartLines = []
  let chartBands = []
  let chartLineFills = []

  console.log('metricsPlus', metricsPlus)
 
  metricsPlus.forEach((m, iMetric) => {

    // Construct data structure for line/area charts.
    let pointSets
    if (dataFiltered.length && (chartStyle === 'line' || chartStyle === 'area')) {
      pointSets = adjustForTrans(periods.map(p => {
        // Replace any missing values (for a given period)
        // with the missing value specified (can be a value
        // or 'bridge' or 'break')
        const d = dataFiltered.find(d => d.period === p)
        return {
          period: p,
          n: d ? d[m.prop] : missingValues,
          displacement: d ? d.displacement[iMetric] : null
        }
      }))
    } else {
      pointSets = []
    }

    pointSets.forEach((points, i) => {
      let pnts
      if (composition === 'stack') {
        pnts = points.map(p => {
          return {
            n: p.n + p.displacement,
            period: p.period,
            displacement: p.displacement
          }
        })
      } else {
        pnts = points
      }
      chartLines.push({
        colour: m.colour,
        opacity: m.opacity,
        strokeWidth: m.strokeWidth,
        prop: m.prop,
        index: m.index,
        part: i,
        yMin: yminY,
        pathEnter: lineValues(pnts.map(p => {
          return {
            n: yminY,
            period: p.period
          }
        }), iMetric),
        path: lineValues(pnts, iMetric)
      })
      chartLines.sort((a,b) => b.index - a.index)

      if (chartStyle === 'area') {
        // Add bottom line of area to match displacement
        // Always add the same number of points to a baseline
        // as in the mainline - even if it is unstacked (straight line)
        // in order to give nice transitions if switching from overlayed
        // (or spread) to stacked and visa versa.
        const pntsBase = [...points].reverse().map(p => {
          return {
            n: composition === 'stack' && p.displacement > yminY ? p.displacement : yminY,
            period: p.period
          }
        })
        chartLineFills.push({
          opacity: m.fillOpacity,
          fill: m.fill,
          prop: m.prop,
          index: m.index,
          part: i,
          yMin: yminY,
          pathEnter: lineValues(pnts, iMetric) + lineValues(pntsBase.map(p => {
            return {
              n: yminY,
              period: p.period
            }
          }), iMetric).replace('M', 'L'),
          path: lineValues(pnts, iMetric) + lineValues(pntsBase, iMetric).replace('M', 'L')
        })
        chartLineFills.sort((a,b) => b.index - a.index)
      }
    })

    // Construct data structure for confidence band on line charts.
    if (m.bandUpper && m.bandLower ) {

      const upperLine = periods.map(p => {
        const d = dataFiltered.find(d => d.period === p)
        return {
          period: p,
          n: d ? d[m.bandUpper] : missingValues,
          displacement: d ? d.displacement[iMetric] : null
        }
      })
      const lowerLine = [...periods].map(p => {
        const d = dataFiltered.find(d => d.period === p)
        return {
          period: p,
          n: d ? d[m.bandLower] : missingValues,
          displacement: d ? d.displacement[iMetric] : null
        }
      })

      const pointsLowerSet = adjustForTrans(lowerLine)
      const pointsUpperSet = adjustForTrans(upperLine)
      for (let i=0; i<pointsLowerSet.length; i++) {

        const displace = (pnts) => {
          if (composition === 'stack') {
            return pnts.map(p => {
              return {
                n: p.n + p.displacement, 
                period: p.period,
                displacement: p.displacement
              }
            })
          } else {
            return pnts
          }
        }

        const pointsLower = displace(pointsLowerSet[i])
        const pointsUpper = displace(pointsUpperSet[i])
   
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
          prop: m.prop,
          part: i,
          bandPath: lineValues(pointsUpper, iMetric) + lineValues([...pointsLower].reverse(), iMetric).replace('M', 'L'),
          bandPathEnter: lineValues(pointsUpperEnter, iMetric) + lineValues([...pointsLowerEnter].reverse(), iMetric).replace('M', 'L'),
          bandBorders: [lineValues(pointsLower, iMetric), lineValues(pointsUpper, iMetric)],
          bandBordersEnter: [lineValues(pointsLowerEnter, iMetric), lineValues(pointsUpperEnter, iMetric)]
        })
        chartBands.sort((a,b) => b.index - a.index)
      }
    }
  })

  // Bands
  gLinesBands.selectAll(".temporal-band")
    .data(chartBands, d => `band-${d.prop}-${d.part}`)
    .join(
      enter => enter.append("path")
        .attr("class", d => `temporal-band temporal-graphic temporal-${d.prop}`)
        .attr("opacity", 0)
        .attr("fill", d => d.fill)
        .attr("stroke", "none")
        //.attr("d", d => d.bandPathEnter),
        .attr("d", d => d.bandPath),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          //.attr("d", d => d.bandPathEnter)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", d => d.bandPath)
      .attr("opacity", d => d.fillOpacity)
      .attr("fill", d => d.fill), pTrans))

  addEventHandlers(gLinesBands.selectAll(".temporal-band"), 'prop', svgChart, interactivity)

  // Band lines
  for (let iLine=0; iLine<2; iLine++) { 
    gLinesBandLines.selectAll(`.temporal-band-border-${iLine}`)
      .data(chartBands, d => `band-line-${d.prop}-${iLine}-${d.part}`)
      .join(
        enter => enter.append("path")
          .attr("class", d => `temporal-band-border-${iLine} temporal-graphic temporal-${d.prop}`)
          .attr("opacity", 0)
          .attr("fill","none")
          .attr("stroke", d => d.stroke)
          .attr("stroke-width", d => d.strokeWidth)
          //.attr("d", d => d.bandBordersEnter[iLine]),
          .attr("d", d => d.bandBorders[iLine]),
        update => update,
        exit => exit
          .call(exit =>  transPromise(exit.transition(t)
            //.attr("d", d => d.bandBordersEnter[iLine])
            .style("opacity", 0)
            .remove(), pTrans))
         ).call(merge => transPromise(merge.transition(t)
          // The selection returned by the join function is the merged
          // enter and update selections
          .attr("d", d => d.bandBorders[iLine])
          .attr("opacity", d => d.strokeOpacity)
          .attr("stroke", d => d.stroke)
          .attr("stroke-width", d => d.strokeWidth), pTrans))
  
    addEventHandlers(gLinesBandLines.selectAll(`.temporal-band-border-${iLine}`), 'prop', svgChart, interactivity)

  // Main lines
  gLinesLines.selectAll(".temporal-line")
    .data(chartLines,  d => `line-${d.prop}-${d.part}`)
    .join(
      enter => enter.append("path")
        .attr("class", d => `temporal-line temporal-graphic temporal-${d.prop}`)
        .attr("opacity", 0)
        .attr("fill", "none")
        .attr("stroke", d => d.colour)
        .attr("stroke-width", d => d.strokeWidth)
        //.attr("d", d => d.pathEnter),
        .attr("d", d => d.path),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          //.attr("d", d => d.pathEnter)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", d => d.path)
      .attr("opacity", d => d.strokeOpacity)
      .attr("stroke", d => d.colour)
      .attr("stroke-width", d => d.strokeWidth), pTrans))

  addEventHandlers(gLinesLines.selectAll(".temporal-line"), 'prop', svgChart, interactivity)

  // Main line fill
  gLinesAreas.selectAll(".temporal-line-fill")
    .data(chartLineFills, d => `band-${d.prop}-${d.part}`)
    .join(
      enter => enter.append("path")
        .attr("class", d => `temporal-line-fill temporal-graphic temporal-${d.prop}`)
        .attr("opacity", 0)
        .attr("fill", d => d.fill)
        .attr("stroke", "none")
        //.attr("d", d => d.pathEnter),
        .attr("d", d => d.path),
      update => update,
      exit => exit
        .call(exit => transPromise(exit.transition(t)
          //.attr("d", d => d.pathEnter)
          .style("opacity", 0)
          .remove(), pTrans))
    ).call(merge => transPromise(merge.transition(t)
      // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", d => d.path)
      .attr("opacity", d => d.opacity)
      .attr("fill", d => d.fill), pTrans))

  addEventHandlers(gLinesAreas.selectAll(".temporal-band"), 'prop', svgChart, interactivity)
  }

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
      // known value. Have to traverse the array in both directions in
      // order to correctly set leading and trailing 'bridge' values.
      for (let i = 0; i < pnts.length; i++) {
        if (pnts[i].n === 'bridge' && i > 0) {
          pnts[i].n = pnts[i-1].n
          pnts[i].period = pnts[i-1].period
          pnts[i].displacement = pnts[i-1].displacement
        }
      }
      for (let i = pnts.length-1; i >= 0; i--) {
        if (pnts[i].n === 'bridge') {
          pnts[i].n = pnts[i+1].n
          pnts[i].period = pnts[i+1].period
          pnts[i].displacement = pnts[i+1].displacement
        }
      }

      // When minPeriodTrans and MaxPeriodTrans are set, then each trend line
      // must have the same number of points in (MaxPeriodTrans - minPeriodTrans + 1 points).
      // This is to make nice looking transitions between lines with otherwise
      // different numbers of points.
      
      if (minPeriodTrans && pnts.length < maxPeriodTrans-minPeriodTrans) {
        for(let i=minPeriodTrans; i<pnts[0].period; i++) {
          ret.unshift({
            n: pnts[0].n,
            period: pnts[0].period,
            displacement: pnts[0].displacement
          })
        }
      }
      if (maxPeriodTrans && pnts.length < maxPeriodTrans-minPeriodTrans) {
        for(let i=pnts[pnts.length-1].period + 1; i <= maxPeriodTrans; i++) {
          ret.push({
            n: pnts[pnts.length-1].n,
            period: pnts[pnts.length-1].period,
            displacement: pnts[pnts.length-1].displacement
          })
        }
      }
    })

    return retSet
  }
}