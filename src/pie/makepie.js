
import * as d3 from 'd3'
import * as gen from '../general'
import { addEventHandlers } from './highlightitem'

export function makePie (data, dataPrevIn, sort, strokeWidth, radius, innerRadius, innerRadius2, svg, svgChart, imageWidth, interactivity, duration, label, labelColour, labelFontSize) {

  //block = true

  let dataDeleted, dataInserted, dataRetained
  const init = !dataPrevIn
  const dataNew = gen.cloneData(data)
  let dataPrev
  
  if (init) {
    dataInserted = []
    dataDeleted = []
    dataRetained = []
    dataPrev = []
  } else {
    dataPrev = [...dataPrevIn]
    const prevNames = dataPrev.map(d => d.name)
    const newNames = dataNew.map(d => d.name)

    dataDeleted = dataPrev.filter(d => !newNames.includes(d.name))
    dataDeleted = gen.cloneData(dataDeleted)

    dataInserted = dataNew.filter(d => !prevNames.includes(d.name))
    dataInserted = gen.cloneData(dataInserted)

    dataRetained = dataNew.filter(d => prevNames.includes(d.name))
    dataRetained = gen.cloneData(dataRetained)
  }

  let fnSort
  if (sort === 'asc') {
    fnSort = (a,b) => b-a
  } else if (sort === 'desc') {
    fnSort = (a,b) => a-b
  } else {
    fnSort = null
  }

  const dataDeleted2 = dataDeleted.map(d => {
    const nd = {...d}
    nd.number = 0
    return nd
  })
  const dataComb = gen.cloneData([...dataNew, ...dataDeleted2])

  //const arcsPrev = d3.pie().value(d => d.number).sortValues(fnSort)(dataPrev)
  //const arcsComb = d3.pie().value(d => d.number).sortValues(fnSort)(dataComb) 
  const arcsPrev = getArcs(dataPrev)
  const arcsComb = getArcs(dataComb)

  //console.log('dataComb',dataComb)

  function getArcs(data){
    const data1 = data.filter((d) => !d.set || d.set===1)
    const data2 = data.filter((d) => d.set && d.set===2)

    const arcs1 = d3.pie().value(d => d.number).sortValues(fnSort)(data1)
    const arcs2 = d3.pie().value(d => d.number).sortValues(fnSort)(data2)
    return [...arcs1, ...arcs2]
  }
  
  arcsComb.forEach(arcComb => {
    const prevArc = arcsPrev.find(arcPrev => arcComb.data.name === arcPrev.data.name)
    if (prevArc) {
      arcComb.prevArc = prevArc
      if (dataDeleted.find(d => d.name === arcComb.data.name)) {
        arcComb.deleted = true
      }
    }
    if (dataInserted.find(d => d.name === arcComb.data.name)) {
      arcComb.inserted = true
    }
  })

  // Now data processing complete, reset dataPrev variable
  dataPrev = data

  const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius)
  const arcGeneratorLables = d3.arc().innerRadius(innerRadius).outerRadius(radius)
  const arcGeneratorLables2 = d3.arc().innerRadius(innerRadius2).outerRadius(innerRadius)

  // Good stuff here: https://bl.ocks.org/mbostock/4341417
  // and here https://bl.ocks.org/mbostock/1346410
  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(arc, _this, trans, radiusx, innerRadiusx, innerRadius2) {

    let radius, innerRadius
    if (!arc.data.set  || arc.data.set===1) {
      radius = radiusx
      innerRadius = innerRadiusx
    } else {
      radius = innerRadiusx
      innerRadius = innerRadius2
    }

    let i
    const iPrev = d3.interpolate(_this._current, arc.prevArc)
    const iCurr = d3.interpolate(_this._current, arc)
    const midRadius = innerRadius + (radius-innerRadius)/2

    return function(t) {
      if (trans === 1) {
        if (init) {
          i = iCurr
          arcGenerator.outerRadius(d3.interpolate(innerRadius, radius)(t))
          arcGenerator.innerRadius(innerRadius) 
        } else if (dataInserted.length) {
          if (arc.deleted) {
            // Previous arcs to be deleted
            i = iPrev
            if (dataRetained.length) {
              arcGenerator.outerRadius(d3.interpolate(radius, midRadius)(t))
              arcGenerator.innerRadius(d3.interpolate(innerRadius, midRadius)(t))
            } else {
              arcGenerator.outerRadius(d3.interpolate(radius, innerRadius)(t))
              arcGenerator.innerRadius(innerRadius) 
            }
          } else if (arc.inserted) {
            // New arcs to be inserted (invisibly)
            i = iCurr
            arcGenerator.outerRadius(innerRadius)
            arcGenerator.innerRadius(innerRadius)
          } else {
            // Existing arcs to be shrunk to outer ring
            i = iPrev
            arcGenerator.outerRadius(radius)
            arcGenerator.innerRadius(d3.interpolate(innerRadius, midRadius)(t))
          }
        } else if (dataDeleted.length) {
          if (arc.deleted) {
            // Previous arcs to be deleted
            i = iPrev
            arcGenerator.outerRadius(d3.interpolate(radius, innerRadius)(t))
            arcGenerator.innerRadius(innerRadius)
          } else {
            i = iPrev
            arcGenerator.outerRadius(radius)
            arcGenerator.innerRadius(innerRadius)
          }
        } else {
          i = iCurr
          arcGenerator.outerRadius(radius)
          arcGenerator.innerRadius(innerRadius)
        }
      }

      if (trans === 2) {
        if (dataInserted.length) {
          if (arc.inserted) {
            i = iCurr
            if (dataRetained.length) {
              // Shown inserted arcs in inner ring
              arcGenerator.outerRadius(d3.interpolate(innerRadius, midRadius)(t))
              arcGenerator.innerRadius(innerRadius)
            } else {
              arcGenerator.outerRadius(d3.interpolate(innerRadius, radius)(t))
              arcGenerator.innerRadius(innerRadius)
            }
          } else if (arc.deleted) {
            i = iCurr
            if (dataRetained.length) {
              // Deleted arcs to be kept with inner & outer radius the same (invisible)
              arcGenerator.outerRadius(midRadius)
              arcGenerator.innerRadius(midRadius)
            } else {
              arcGenerator.outerRadius(innerRadius)
              arcGenerator.innerRadius(innerRadius)
            }
          } else {
            // Existing arcs to be shown in new positions in outer ring
            i = iCurr
            arcGenerator.outerRadius(radius)
            arcGenerator.innerRadius(midRadius)
          }
        } else {
          if (arc.deleted) {
            i = iCurr
            arcGenerator.outerRadius(innerRadius)
            arcGenerator.innerRadius(innerRadius)
          } else {
            i = iCurr
            arcGenerator.outerRadius(radius)
            arcGenerator.innerRadius(innerRadius)
          }
        }
      }

      if (trans === 3) {
        if (arc.inserted) {
          // Shown inserted arcs in inner ring
          i = iCurr
          arcGenerator.outerRadius(d3.interpolate(midRadius, radius)(t))
          arcGenerator.innerRadius(innerRadius)
        } else if (!arc.deleted) {
          // Existing arcs to be shown in new positions in outer ring
          i = iCurr
          arcGenerator.outerRadius(radius)
          arcGenerator.innerRadius(d3.interpolate(midRadius, innerRadius)(t))
        } else {
          // Deletions - do nothing
          i = iCurr
        }
      }
        _this._current = i(0)
      return arcGenerator(i(t))
    }
  }

  function centroidTween(a) {
    const i = d3.interpolate(this._current, a)
    this._current = i(0)
    return function(t) {
      const gen = a.data.set && a.data.set===2 ? arcGeneratorLables2 : arcGeneratorLables
      //console.log(i(t))
      return `translate(${gen.centroid(i(t))})`
    }
  }

  let svgPie, gPie
  if (svg.select('.brc-chart-pie').size()) {
    svgPie = svgChart.select('.brc-chart-pie')
    gPie = svgPie.select('g')
  } else {
    svgPie = svgChart.append('svg').classed('brc-chart-pie', true)
      .attr('width', 2 * radius)
      .attr('height', 2 * radius)
      .style('overflow', 'visible')
    gPie = svgPie.append('g')
      .attr('transform', `translate(${radius} ${radius})`)

    gPie.append('image')
      .classed('brc-item-image', true)
      .classed('brc-item-image-hide', true)
      .attr('width', imageWidth)
  }

  // Remove those paths that have been 'deleted'
  // This because in our transition, we never actually remove
  // arcs. Best done here because of better handling of
  // interrupted transitions
  gPie.selectAll("path[data-deleted='true']").remove()

  // map to data
  const uPie =gPie.selectAll('path')
    .data(arcsComb, d => d.data.name)

  const ePie = uPie.enter()
    .append('path')
    .attr('id', (d) => `pie-${gen.safeId(d.data.name)}`)
    .attr('stroke', 'white')
    .style('stroke-width', `${strokeWidth}px`)
    .style('opacity', 1)
    .attr('fill', d => d.data.colour)
    .each(function(d) { this._current = d })

  addEventHandlers(svg, ePie, true, interactivity, dataPrev, imageWidth)
  const mPie = ePie.merge(uPie)
  // Mark paths corresponding to deleted arcs as
  // deleted so that they can be removed before next 
  // transition
  mPie.attr('data-deleted', arc => arc.deleted)

  let trans
  let transDuration = duration
  
  // Transition 1
  trans = mPie.transition()
    .duration(duration)
    .attrTween('d', function (arc) {
      return arcTween(arc, this, 1, radius, innerRadius, innerRadius2)
  })

  // Transition 2 
  if (dataDeleted.length || dataInserted.length) {
    trans = trans.transition()
      .duration(duration)
      .attrTween('d', function (arc) {
        return arcTween(arc, this, 2, radius, innerRadius, innerRadius2)
      })
    transDuration += duration
  }

  // Transition 3
  if (dataInserted.length && dataRetained.length) {
    trans = trans.transition()
      .duration(duration)
      .attrTween('d', function (arc) {
        return arcTween(arc, this, 3, radius, innerRadius, innerRadius2)
      })
    transDuration += duration
  }

  // Because we always retain deleted items in order
  // to make smooth transitions, the D3 exit selection
  // is never populated. Instead we have to remove
  // invisible deleted DOM items (SVG paths) ourselves after 
  // the last transition to avoid messing up the transition
  // next time the data changes.
  //uPie.exit().remove()  // there is no exit selection 
  trans.on("end", function () {
    // Be careful about doing anything in here in case transition interrupted
    //if (arc.deleted) {
      //d3.select(this).remove()
    //}
    //block = false
  })

  if (label) {

    //const arcsNew = d3.pie().value(d => d.number).sortValues(fnSort)(dataNew) 
    //console.log(arcsNew)
    const data1 = dataNew.filter((d) => !d.set || d.set===1)
    const data2 = dataNew.filter((d) => d.set && d.set===2)

    const arcs1 = d3.pie().value(d => d.number).sortValues(fnSort)(data1)
    const arcs2 = d3.pie().value(d => d.number).sortValues(fnSort)(data2)
    const arcsNew = [...arcs1, ...arcs2]

    const total1 = data1.reduce((t, c) => {return t + c.number}, 0)
    const total2 = data2.reduce((t, c) => {return t + c.number}, 0)

    const uPieLabels = gPie.selectAll('.labelsPie')
      .data(arcsNew, d => d.data.name)
      
    const ePieLabels = uPieLabels.enter()
      .append('text')
      .attr('id', (d) => `label-${gen.safeId(d.data.name)}`)
      .attr("class", "labelsPie")
      .style('text-anchor', 'middle')
      .style('font-size', labelFontSize)
      .style('fill', labelColour)

    addEventHandlers(svg, ePieLabels, true, interactivity, dataPrev, imageWidth)

    ePieLabels.merge(uPieLabels)
      .text(d => {
        if (label ==='value') {
          return d.data.number
        } else  {

          let total = total1
          if (d.data.set && d.data.set===2) {
            total = total2
          }

          if (Number.isNaN(d.data.number) || total === 0) {
              return ''
          } else {
            let l = Math.round(d.data.number / total * 100)
            // if (l === 0) {
            //   l = Math.ceil(d.data.number / total * 1000)/10
            // }
            return `${l}%`
          }
        }
      })
      .attr('opacity', 0)
      .transition()
      .duration(transDuration)
      .attrTween('transform', centroidTween)
      .transition()
      .duration(0)
      .attr('opacity', d => {
        let total = total1
        if (d.data.set && d.data.set===2) {
          total = total2
        }
        if (Math.round(d.data.number / total * 100) === 0) {
          return 0
        } else {
          return 1
        }
      })
    uPieLabels.exit()
      .remove()

    const uPieLabelsHighlight = gPie.selectAll('.labelsPieHighlight')
      .data(arcsNew, d => d.data.name)
      
    const ePieLabelsHighlight = uPieLabelsHighlight.enter()
      .append('text')
      .attr('id', (d) => `label-highlight-${gen.safeId(d.data.name)}`)
      .classed('labelsPieHighlight', true)
      .classed('brc-lowlight', true)
      .style('text-anchor', 'middle')
      .style('font-size', labelFontSize)
      .style('fill', labelColour)

    addEventHandlers(svg, ePieLabelsHighlight, true, interactivity, dataPrev, imageWidth)

    ePieLabelsHighlight.merge(uPieLabelsHighlight)
      .text(d => {
        if (label ==='value') {
          return d.data.number
        } else {
          let total = total1
          if (d.data.set && d.data.set===2) {
            total = total2
          }

          if (Number.isNaN(d.data.number) || total === 0) {
              return ''
          } else {
            let l = Math.round(d.data.number / total * 1000)/10
            return label ==='pervalue' ? `${l}% (${d.data.number})` : `${l}%`
          }
        }
      })
      .attr('transform', d => {
        const gen = d.data.set && d.data.set===2 ? arcGeneratorLables2 : arcGeneratorLables
        return `translate(${gen.centroid(d)})`
      })
    uPieLabelsHighlight.exit()
      .remove()
  }

  return dataPrev
}