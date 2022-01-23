import * as d3 from 'd3'

export function safeId(text) {
  return text ? text.replace(/\W/g,'_') : null
}

export function cloneData(data) {
  return data.map(d => { return {...d}})
}

export function xAxisMonthSafe(width, ticks) {
  const xScaleTime = d3.scaleTime()
    .domain([new Date(2000, 0, 1), new Date(2000, 11, 31)])
    .range([0, width])
  
  const xAxis = d3.axisBottom()
    .scale(xScaleTime)

  if (ticks) {
    xAxis.ticks(d3.timeMonth)
      .tickSize(width >= 200 ? 13 : 5, 0)
      .tickFormat(date => {
        if (width >= 750) {
          return d3.timeFormat('%B')(date)
        } else if (width >= 330) {
          return d3.timeFormat('%b')(date)
        } else if (width >= 200) {
          return date.toLocaleString('default', { month: 'short' }).substr(0,1)
        } else {
          return ''
        }
      })
  } else {
    xAxis.tickValues([]).tickSizeOuter(0)
  }
  return xAxis
}

export const month2day = [1, 32, 61, 92, 122, 153, 183, 214, 245, 275, 306, 336, 367]

export function xAxisMonth(width, ticks) {

  const ysDomain = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const ysRange = month2day.map(d => (d-1)/366 * width)
  const xScaleTime = d3.scaleOrdinal().domain(ysDomain).range(ysRange)

  const xAxis = d3.axisBottom()
    .scale(xScaleTime)

  if (ticks) {
    xAxis.ticks(ysDomain)
      .tickSize(width >= 200 ? 13 : 5, 0)
      .tickFormat(month => {
        if (width >= 750) {
          return month
        } else if (width >= 330) {
          return month.substr(0,3)
        } else if (width >= 200) {
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