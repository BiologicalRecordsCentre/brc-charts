import * as d3 from 'd3'
import { transPromise } from '../general'
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
  interactivity
) {

  // Line path generator
  // const lineValues = d3.line()
  //   .x(d => xScale.v(d.period))
  //   .y(d => yScale(d.n))

  // if (lineInterpolator) {
  //   // Interpolating curves can make transitions of polygons iffy
  //   // because resulting number of points in path is not constant.
  //   lineValues.curve(d3[lineInterpolator]) 
  // }

  const lineValues = (points, iPart) => {
    const d3LineGen = d3.line()
      .x(d => xScale.v(d.period))
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

  metricsPlus.forEach((m, iMetric) => {
      // Create a collection of the periods in the dataset.
    const dataDict = dataFiltered.reduce((a,d) => {
      a[d.period]=d[m.prop]
      return a
    }, {})

    // Construct data structure for line charts.
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
        }), iMetric),
        path: lineValues(points, iMetric)
      })
    })

    // Construct data structure for confidence band on line charts.
    if (m.bandUpper && m.bandLower ) {
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
          bandPath: lineValues(pointsBand, iMetric),
          bandPathEnter: lineValues(pointsBand.map(p => {
            return {
              n: yminY,
              period: p.period
            }
          }), iMetric),
          bandBorders: [lineValues(pointsLower, iMetric), lineValues(pointsUpper, iMetric)],
          bandBordersEnter: [lineValues(pointsLowerEnter, iMetric), lineValues(pointsUpperEnter, iMetric)]
        })
      }
    }
  })

  // Bands
  gTemporal.selectAll(".temporal-band")
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

  addEventHandlers(gTemporal.selectAll(".temporal-band"), 'prop', svgChart, interactivity)

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
  
    addEventHandlers(gTemporal.selectAll(`.temporal-band-border-${iLine}`), 'prop', svgChart, interactivity)
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
      .attr("stroke", d => d.colour)
      .attr("stroke-width", d => d.strokeWidth), pTrans))

  addEventHandlers(gTemporal.selectAll(".temporal-line"), 'prop', svgChart, interactivity)

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
  }
}