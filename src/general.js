 
export function safeId(text) {
  return text ? text.replace(/\W/g,'_') : null
}

export function cloneData(data) {
  return data.map(d => { return {...d}})
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
