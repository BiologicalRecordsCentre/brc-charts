import * as d3 from 'd3'

export function safeId(text) {
  return text ? text.replace(/\W/g,'_') : null
}

export function cloneData(data) {
  return data.map(d => { return {...d}})
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

export function saveChartImage(svg, expand, asSvg, filename) {

  return new Promise((resolve) => {
    if (asSvg) {
      const blob1 =  serialize(svg)
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

  function serialize(svg) {
    const xmlns = "http://www.w3.org/2000/xmlns/"
    const xlinkns = "http://www.w3.org/1999/xlink"
    const svgns = "http://www.w3.org/2000/svg"
  
    const domSvg = svg.node()
    const cloneSvg = domSvg.cloneNode(true)
    const d3Clone = d3.select(cloneSvg)
    // Explicitly change text in clone to required font
    d3Clone.selectAll('text').style('font-family','Arial, Helvetica, sans-serif')
  
    cloneSvg.setAttributeNS(xmlns, "xmlns", svgns)
    cloneSvg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns)
    const serializer = new window.XMLSerializer
    const string = serializer.serializeToString(cloneSvg)
    return new Blob([string], {type: "image/svg+xml"})
  }
  
  function rasterize(svg) {
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
    image.src = URL.createObjectURL(serialize(svg))
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
  if (transition.size()) {
    pArray.push(transition.end())
  }
}
