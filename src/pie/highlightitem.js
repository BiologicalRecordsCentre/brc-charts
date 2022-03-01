import * as d3 from 'd3'
import * as gen from '../general'

export function addEventHandlers(svg, sel, isArc, interactivity, dataPrev, imageWidth) {
  sel
    .on("mouseover", function(d) {
    if (interactivity === 'mousemove') {
        highlightItem(svg, isArc ? d.data.name : d.name, true, dataPrev, imageWidth)
      }
    })
    .on("mouseout", function(d) {
      if (interactivity === 'mousemove') {
        highlightItem(svg, isArc ? d.data.name : d.name, false, dataPrev, imageWidth)
      }
    })
    .on("click", function(d) {
      if (interactivity === 'mouseclick') {
        highlightItem(svg, isArc ? d.data.name : d.name, true, dataPrev, imageWidth)
        d3.event.stopPropagation()
      }
    })
}

export function highlightItem (svg, name, show, dataPrev, imageWidth) {
  
  const i = gen.safeId(name)
  const imgSelected = svg.select('.brc-item-image')

  if (show) {
    svg.selectAll('path').classed('brc-lowlight', true)
    svg.selectAll('.legendSwatch').classed('brc-lowlight', true)
    svg.selectAll('.legendText').classed('brc-lowlight', true)
    svg.selectAll('.labelsPie').classed('brc-lowlight', true)
    svg.selectAll('.labelsPieHighlight').classed('brc-lowlight', true)

    svg.select(`#swatch-${i}`).classed('brc-lowlight', false)
    svg.select(`#legend-${i}`).classed('brc-lowlight', false)
    svg.select(`#pie-${i}`).classed('brc-lowlight', false)
    svg.select(`#label-highlight-${i}`).classed('brc-lowlight', false)
    
    svg.selectAll('.labelsPieHighlight').classed('brc-highlight', false)
    svg.select(`#label-highlight-${i}`).classed('brc-highlight', true)

    const data = dataPrev.find(d => name === d.name)
    if (data && data.image) {
      // Loading image into SVG and setting to specified width
      // and then querying bbox returns zero height. So in order
      // to get the height of the image (required for correct)
      // positioning, it is necessary first to load the image and
      // get the dimensions.
      if (data.imageHeight) {
        if (imgSelected.attr('xlink:href') !== data.image) {
          // The loaded image is different from that of the
          // highlighted item, so load.
          loadImage(data, svg)
        }
        imgSelected.classed('brc-item-image-hide', false)
      } else {
        // console.log('data', data)
        const img = new Image
        img.onload = function() {
          data.imageWidth = imageWidth 
          data.imageHeight = imageWidth * this.height / this.width
          loadImage(data, svg)
        }
        img.src = data.image
        imgSelected.classed('brc-item-image-hide', false)
      }
    } else {
      imgSelected.classed('brc-item-image-hide', true)
    }
  } else {
    svg.selectAll('.brc-lowlight').classed('brc-lowlight', false)
    imgSelected.classed('brc-item-image-hide', true)
    svg.selectAll('.labelsPie').classed('brc-highlight', false)

    svg.selectAll('.labelsPieHighlight').classed('brc-highlight', false)
    svg.selectAll('.labelsPieHighlight').classed('brc-lowlight', true)
  }
}

function loadImage(d, svg) {
  const imgSelected = svg.select('.brc-item-image')
  imgSelected.attr('xlink:href', d.image)
  imgSelected.attr('width', d.imageWidth)
  imgSelected.attr('height', d.imageHeight)
  imgSelected.attr("x", -d.imageWidth / 2)
  imgSelected.attr("y", -d.imageHeight / 2)
}