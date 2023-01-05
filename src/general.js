import * as d3 from 'd3'

export function safeId(text) {
  // Ensure selector starts with a letter. Replace white space with underscores.
  return text ? `id_${text.replace(/\W/g,'_')}` : null
}

export function cloneData(data) {
  return data.map(d => { return {...d}})
}

export const month2day = [1, 32, 61, 92, 122, 153, 183, 214, 245, 275, 306, 336, 366]
const ysDomain = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
function filterYsDomain(monthScaleRange) {
  const minMonth = monthScaleRange[0]
  const maxMonth = monthScaleRange[1]
  return ysDomain.filter((m,i) => i+1 >= minMonth && i+1 <= maxMonth)
}

function filterMonth2day(monthScaleRange, noAdjust) {
  const minMonth = monthScaleRange[0]
  const maxMonth = monthScaleRange[1]
  const fMonth2day = month2day.filter((d,i) => {
    return i+1 >= minMonth && i+1 <= maxMonth+1
  })
  if (noAdjust) {
    return fMonth2day
  } else {
    return fMonth2day.map(d => d - month2day[minMonth-1] + 1)
  }
}

function getDayRange(monthScaleRange) {
  const filteredMonth2day = filterMonth2day(monthScaleRange)
  return filteredMonth2day[filteredMonth2day.length-1] - filteredMonth2day[0]
}

export function xAxisMonth(width, ticks, fontSize, font) {

  // Still used by accum chart, but replaced by xAxisMonthText
  // and xAxisMonthNoText elsewhere.
  const ysRange = month2day.map(d => (d-1)/365 * width)
  const xScaleTime = d3.scaleOrdinal().domain(ysDomain).range(ysRange)

  const xAxis = d3.axisBottom()
    .scale(xScaleTime)

  // Work out the max text widths of the three styles
  // of month representation
  const svg = d3.select('body').append('svg')
  const getMaxTextWidth = (aText) => {
    return Math.max(...aText.map(m => {
      const tmpText = svg.append('text')
        .text(m)
      if (font) tmpText.style('font-family', font)
      if (fontSize) tmpText.style('font-size', fontSize)
      const textWidth =  tmpText.node().getBBox().width
      tmpText.remove()
      return textWidth
    }))
  }
  const maxFullMonth = getMaxTextWidth(ysDomain)
  const maxMedMonth = getMaxTextWidth(ysDomain.map(m=>m.substr(0,3)))
  const maxMinMonth = getMaxTextWidth(ysDomain.map(m=>m.substr(0,1)))
  svg.remove()

  if (ticks) {
    xAxis.ticks(ysDomain)
      .tickSize(width >= 200 ? 13 : 5, 0)
      .tickFormat(month => {
        //if (width >= 750) {
        if (width / 12 > maxFullMonth + 4) {
          return month
        //} else if (width >= 330) {
        } else if (width / 12 >= maxMedMonth + 4) {
          return month.substr(0,3)
        //} else if (width >= 200) {
        } else if (width /12 >= maxMinMonth + 4) {
          return month.substr(0,1)
        } else {
          return ''
        }
      })
  } else {
    xAxis.tickValues([]).tickSizeOuter(0)
  }
  return xAxis
}

export function xAxisMonthNoText(width, monthScaleRange) {
 
  const filteredYsDomain = filterYsDomain(monthScaleRange)
  const filteredMonth2day = filterMonth2day(monthScaleRange)
  const dayRange = getDayRange(monthScaleRange)

  const ysRange = filteredMonth2day.map(d => (d-1)/dayRange * width)
  const xScaleTime = d3.scaleOrdinal().domain(filteredYsDomain).range(ysRange)

  const xAxis = d3.axisBottom()
    .scale(xScaleTime)

  xAxis.ticks(filteredYsDomain)
    .tickSize(width >= 200 ? 13 : 5, 0)
    .tickFormat(() => '')
 
  return xAxis
}

export function xAxisMonthText(width, ticks, fontSize, font, monthScaleRange) {

  const filteredYsDomain = filterYsDomain(monthScaleRange)
  filteredYsDomain.unshift('')
  const filteredMonth2day = filterMonth2day(monthScaleRange)
  const dayRange = getDayRange(monthScaleRange)

  const monthMid2day = [1]
  for (let i=0; i<filteredMonth2day.length-1; i++) {
    monthMid2day.push((filteredMonth2day[i] + (filteredMonth2day[i+1]-filteredMonth2day[i])/2))
  }
  monthMid2day.push(dayRange + 1)
  
  const ysRange = monthMid2day.map(d => (d-1)/dayRange * width)
  const xScaleTime = d3.scaleOrdinal().domain(filteredYsDomain).range(ysRange)

  const xAxis = d3.axisBottom()
    .scale(xScaleTime)

  // Work out the max text widths of the three styles
  // of month representation
  const svg = d3.select('body').append('svg')
  const getMaxTextWidth = (aText) => {
    return Math.max(...aText.map(m => {
      const tmpText = svg.append('text')
        .text(m)
      if (font) tmpText.style('font-family', font)
      if (fontSize) tmpText.style('font-size', fontSize)
      const textWidth =  tmpText.node().getBBox().width
      tmpText.remove()
      return textWidth
    }))
  }
  const maxFullMonth = getMaxTextWidth(filteredYsDomain)
  const maxMedMonth = getMaxTextWidth(filteredYsDomain.map(m=>m.substr(0,3)))
  const maxMinMonth = getMaxTextWidth(filteredYsDomain.map(m=>m.substr(0,1)))

  svg.remove()

  const monthNumber = monthScaleRange[1] - monthScaleRange[0] + 1
  if (ticks) {
    xAxis.ticks(filteredYsDomain)
      .tickSize(0)
      .tickFormat(month => { 
        if (month === '') {
          return ''
        } else if (width / monthNumber > maxFullMonth + 4) {
          return month
        } else if (width / monthNumber >= maxMedMonth + 4) {
          return month.substr(0,3)
        } else if (width / monthNumber >= maxMinMonth + 4) {
          return month.substr(0,1)
        } else {
          return ''
        }
      })
  } else {
    xAxis.tickValues([]).tickSizeOuter(0)
  }
  return xAxis
}

export function xAxisYear(width, ticks, min, max, bars) {
  const xScale = d3.scaleLinear()
    .range([0, width])

  if (bars) {
    xScale.domain([min - 0.5, max + 0.5])
  } else {
    xScale.domain([min, max])
  }

  const xAxis = d3.axisBottom()
    .scale(xScale)

  if (ticks) {
    const years = max - min
    const threshold = 30

    let ticks
    if (width / years > threshold) {
      ticks = years
    } else if (width / years * 2 > threshold) {
      ticks = years / 2
    } else if (width / years * 5 > threshold) {
      ticks = years / 5
    } else if (width / years * 10 > threshold ) {
      ticks = years / 10
    } else {
      ticks = 2
    }
    xAxis.ticks(ticks) 

    xAxis.tickFormat(year => year.toString())

    if (bars) {
      xAxis.tickSizeOuter(0)
    }
  } else {
    xAxis.tickValues([]).tickSizeOuter(0)
  }
  return xAxis
}

export function wrapText(text, svg, maxWidth, fontSize) {

  const textSplit = text.split(" ")
  const lines = ['']
  let line = 0

  for (let i=0; i < textSplit.length; i++) {

    if (textSplit[i] === '\n') {
      line++
      lines[line] = ''
    } else {
      let workingText = `${lines[line]} ${textSplit[i]}`
      workingText = workingText.trim()

      const txt = svg.append('text')
        .text(workingText)
        .style('font-size', fontSize)

      const width = txt.node().getBBox().width

      if (width > maxWidth) {
        line++
        lines[line] = textSplit[i]
      } else {
        lines[line] = workingText
      }
      txt.remove()
    }
  }
  return lines
}

export function makeText (text, classText, fontSize, textAlign, textWidth, svg) {

  let svgText = svg.select(`.${classText}`)
  if (!svgText.size()) {
    svgText = svg.append('svg').attr("class", classText)
  }
  
  const lines = wrapText(text, svgText, textWidth, fontSize)

  const uText = svgText.selectAll(`.${classText}-line`)
    .data(lines)

  const eText = uText.enter()
    .append('text')
    .attr("class", `${classText}-line`)

  uText
    .merge(eText)
    .text(d => {
      return d
    })
    .style('font-size', fontSize)

  uText.exit()
    .remove()

  const height = svgText.select(`.${classText}-line`).node().getBBox().height
  const widths = svgText.selectAll(`.${classText}-line`).nodes().map(n => (n.getBBox().width))

  svgText.selectAll(`.${classText}-line`)
    .attr('y', (d, i) => (i + 1) * height)
    .attr('x', (d, i) => {
      if (textAlign === 'centre') {
        return (textWidth - widths[i]) / 2
      } else if(textAlign === 'right') {
        return textWidth - widths[i]
      } else {
        return 0
      }
    })
  svgText.attr("height", height * lines.length + height * 0.2) // The 0.2 allows for tails of letters like g, y etc.

  return svgText
}

export function positionMainElements(svg, expand, headPad) {

    headPad = headPad ? headPad : 0 // For backward compatibility
    const space = 10
    const svgTitle = svg.select('.titleText')
    const svgSubtitle = svg.select('.subtitleText')
    const svgChart = svg.select('.mainChart')
    const svgFooter = svg.select('.footerText')

    svgTitle.attr("x", headPad)
    svgSubtitle.attr("x", headPad)
    svgFooter.attr("x", headPad)

    svgSubtitle.attr("y", Number(svgTitle.attr("height")))
    svgChart.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + space)
    svgFooter.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + space +  Number(svgChart.attr("height")))
  
    const height = Number(svgTitle.attr("height")) +
      Number(svgSubtitle.attr("height")) + 
      Number(svgChart.attr("height")) + 
      Number(svgFooter.attr("height")) +
      2 * space

    if (expand) {
      svg.attr("viewBox", "0 0 " + Number(svgChart.attr("width")) + " " +  height)
    } else {
      svg.attr("width", Number(svgChart.attr("width")))
      svg.attr("height", height)
    }

}

export function saveChartImage(svg, expand, asSvg, filename, font) {

  return new Promise((resolve) => {
    if (asSvg) {
      const blob1 =  serialize(svg, font)
      if(filename) {
        download(blob1, filename)
      }
      resolve(blob1)
    } else {
      rasterize(svg).then(blob2 => {
        if(filename) {
          download(blob2, filename)
        }
        resolve(blob2) 
      })
    }
  })

  function download(data, filename) {
    const dataUrl = URL.createObjectURL(data)
    const file = asSvg ? `${filename}.svg` : `${filename}.png`
    downloadLink(dataUrl, file)
  }

  function serialize(svg, font) {
    const xmlns = "http://www.w3.org/2000/xmlns/"
    const xlinkns = "http://www.w3.org/1999/xlink"
    const svgns = "http://www.w3.org/2000/svg"
  
    const domSvg = svg.node()
    const cloneSvg = domSvg.cloneNode(true)
    const d3Clone = d3.select(cloneSvg)
    // Explicitly change text in clone to required font
    const fontOut = font ? font  : 'Arial, Helvetica, sans-serif'
    d3Clone.selectAll('text').style(fontOut)
  
    cloneSvg.setAttributeNS(xmlns, "xmlns", svgns)
    cloneSvg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns)
    const serializer = new window.XMLSerializer
    const string = serializer.serializeToString(cloneSvg)
    return new Blob([string], {type: "image/svg+xml"})
  }
  
  function rasterize(svg, font) {
    let resolve, reject
    const domSvg = svg.node()
    const promise = new Promise((y, n) => (resolve = y, reject = n))
    const image = new Image
    image.onerror = reject
    image.onload = () => {
      const rect = domSvg.getBoundingClientRect()
      // Create a canvas element
      let canvas = document.createElement('canvas')
      canvas.width = rect.width
      canvas.height = rect.height
      let context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, rect.width, rect.height)
      context.canvas.toBlob(resolve)
    }
    image.src = URL.createObjectURL(serialize(svg, font))
    return promise
  }

  function downloadLink(dataUrl, file) {

    // Create a link element
    const link = document.createElement("a")
    // Set link's href to point to the data URL
    link.href = dataUrl
    link.download = file

    // Append link to the body
    document.body.appendChild(link)

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', { 
        bubbles: true, 
        cancelable: true, 
        view: window 
      })
    )
    // Remove link from body
    document.body.removeChild(link)
  }
}

export function transPromise(transition, pArray) {
  // If the transition has any elements in selection, then
  // create a promise that resolves when the transition of
  // the last element completes. We do the check because it
  // seems that with zero elements, the promise does not resolve
  // (remains pending).
  // The promise is created by
  // using the 'end' method on the transition.
  // The promise rejects if a transition is interrupted
  // so need to handle that. (https://www.npmjs.com/package/d3-transition)
  if (transition.size()) {
    const p = transition.end()
    p.catch(() => null)
    pArray.push(p)
  }
}

export function temporalScale(chartStyle, periodType, minPeriod, maxPeriod, xPadding, monthScaleRange, width) {

  // This function returns an object that provides all the functionality of a d3 scale but it is
  // tailored to the needs of the temporal chart. The return object has the following properties:
  // * d3 - this is the raw d3 scale function that lies at the hear of all the functionality.
  // * bandwidth - a replacement for the d3 scale bandwidth function which does any necessary 
  //   preprocessing on passed value before passing to the d3 scale bandwidth function.
  // * v - a replacement for the d3 scale function which does any necessary 
  //   preprocessing on passed value before passing to the d3 scale function.
  let periods = []
  for (let i = minPeriod; i <= maxPeriod; i++) {
    periods.push(i)
  }
  let scaleD3, scaleFn, bandwidthFn
  if (periodType === 'month' || periodType === 'week' || periodType === 'day') {

    const m2d = filterMonth2day(monthScaleRange, true)
    scaleD3 = d3.scaleLinear().domain([m2d[0], m2d[m2d.length - 1]]).range([1, width])
    scaleFn = (v) => {
      return scaleD3(periodToDay(v, periodType, chartStyle, monthScaleRange))
    }
    bandwidthFn = (v) => {
      return periodToWidth(v, periodType, scaleD3)
    }
  } else if (chartStyle === 'bar') {
    scaleD3 = d3.scaleBand().domain(periods).range([0, width]).paddingInner(0.1)
    scaleFn = scaleD3
    bandwidthFn = scaleD3.bandwidth
  } else if (chartStyle === 'line' || chartStyle === 'area') {
    scaleD3 = d3.scaleLinear().domain([minPeriod - xPadding, maxPeriod + xPadding]).range([0, width])
    scaleFn = scaleD3
    bandwidthFn = () => {
      return 0
    }
  }

  // Where the scale is used as an argument to a d3 axis scale function, an unadulterated scale
  // is required, so the d3 scale is added as a property to this scale function so that it can
  // be accessed.
  scaleFn.d3 = scaleD3
  scaleFn.bandwidth = bandwidthFn
  return scaleFn
}

function periodToDay(p, periodType, chartStyle) {
  if (periodType === 'week') {
    if (chartStyle === 'bar') {
      return (p-1)*7 + 1
    } else {
      // style is line or area
      return (p-1)*7 + 1 + 3.5
    }
  } else if(periodType === 'month') {
    if (chartStyle === 'bar') {
      return month2day[p-1]
    } else {
      // style is line or area
      return month2day[p-1] + ((month2day[p] - month2day[p-1]) / 2)
    }
  } else {
    // perioType is 'day'
    if (chartStyle === 'bar') {
      return p
    } else {
      // style is line or area
      return p+0.5
    }
  }
}

function periodToWidth(p, periodType, xScale) {
  if (periodType === 'week') {
    return xScale(7) - xScale(0) - 1
  } else if (periodType === 'month') {
    return xScale(month2day[p]) - xScale(month2day[p-1]) - 1
  } else {
    return xScale(1) - xScale(0) - 1
  }
}

export function spreadScale(minY, maxY, yPadding, metrics, height, composition, spreadOverlap) {
  
  let fn, fnAxis, tickFormat, spreadHeight

  if (composition === 'spread' && metrics.length > 1) {
    
    // Work out height in 'sread units' - su.
    const overlap = Number(spreadOverlap)
    const bottom = 0.2
    const maxmax = Math.max(...metrics.map(m => m.maxValue))
    const suLastMetric = isFinite(maxmax) ? metrics[metrics.length-1].maxValue / maxmax * (1 + overlap) : 0
    const suPenultimateMetric = isFinite(maxmax) ? metrics[metrics.length-2].maxValue / maxmax * (1 + overlap) - 1 : 0
    const suLast = Math.max(suLastMetric, suPenultimateMetric)
    const suHeight = metrics.length - 1 + suLast + bottom 
    const spreadOffset = height / suHeight
    spreadHeight = (1 + overlap) * spreadOffset 

    fn = (v, iMetric) => {
      const d3fn = d3.scaleLinear().domain([minY - yPadding, maxY + yPadding]).range([spreadHeight, 0])
      return d3fn(v) + height - spreadHeight - bottom * spreadOffset - iMetric * spreadOffset
    }

    // Axis scale
    const ysDomain = ['']
    const ysRange = [0]
    if (metrics.length){
      for (let i=0; i<metrics.length; i++) {
        ysDomain.push(metrics[i].label)
        ysRange.push(height - bottom * spreadOffset - i * spreadOffset)
      }
      ysDomain.push('')
      ysRange.push(height)
    } else {
      ysRange.push(height)
    }
    fnAxis = d3.scaleOrdinal().domain(ysDomain).range(ysRange)
    tickFormat = 'c'
  } else {
    const d3fn = d3.scaleLinear().domain([minY - yPadding, maxY + yPadding]).range([height, 0])
    fn = v => {
      return d3fn(v)
    }
    fnAxis = d3fn
    if (maxY-minY > 20) {
      tickFormat = 'd'
    } else if (maxY-minY > 1) {
      tickFormat = '.1f' 
    } else {
      tickFormat = '.2f'
    }
    spreadHeight = height
  }

  fn.yAxis = fnAxis
  fn.tickFormat = tickFormat
  fn.height = spreadHeight
  return fn
}

export function addG (id, g) {
  if (g.select(`#${id}`).size()) { 
    return g.select(`#${id}`)
  } else {
    return g.append('g').attr('id', id)
  }
}
