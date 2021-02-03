(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.brccharts = {}, global.d3));
}(this, (function (exports, d3) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  //https://github.com/d3/d3-shape/blob/v2.0.0/README.md#pie

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
   * @param {string} opts.elid - The id for the dom object created.
   * @param {number} opts.radius - The desired radius of the chart in pixels.
   * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie char. Specify a value for donut chart.
   * @param {number} opts.imageWidth - The width of images in pixels. Images will be resized to this width.
   * @param {string} opts.sort - Sort function. Set to 'asc' for ascending, 'desc' for descending or '' for no sort.
   * @param {string} opts.label - How to label sections. Set to 'value' for raw number, 'percent' for percentage or '' for no sort.
   * @param {string} opts.labelFontSize - Set to a font size (pixels).
   * @param {string} opts.labelColour - Specifies the colour of label text.
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
   * @param {string} opts.legendSwatchSize - Specifies the size of legend swatches.
   * @param {string} opts.legendSwatchGap - Specifies the size of gap between legend swatches.
   * @param {number} opts.legendWidth - The width of the legend in pixels.
   * @param {string} opts.title - Title for the chart.
   * @param {string} opts.subtitle - Subtitle for the chart.
   * @param {string} opts.footer - Footer for the chart.
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.footerFontSize - Font size (pixels) of chart title.
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
   * @param {number} opts.duration - The duration of each transition phase in milliseconds.
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>name</b> - the name of the data item uniquely identifies it and is shown in the legend.
   * <li> <b>number</b> - a numeric value associated with the item.
   * <li> <b>colour</b> - an optional colour for the symbol which can be hex format, e.g. #FFA500, 
   * RGB format, e.g. rgb(100, 255, 0) or a named colour, e.g. red. If not specified, a colour will be assigned.
   * <li> <b>image</b> - this optional property allows you to specify the url of an image file
   * which can be displayed when a user selects the associated item.
   * </ul>
   * @returns {module:pie~api} api - Returns an API for the chart.
   */

  function pie() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'piechart' : _ref$elid,
        _ref$radius = _ref.radius,
        radius = _ref$radius === void 0 ? 180 : _ref$radius,
        _ref$innerRadius = _ref.innerRadius,
        innerRadius = _ref$innerRadius === void 0 ? 0 : _ref$innerRadius,
        _ref$sort = _ref.sort,
        sort = _ref$sort === void 0 ? '' : _ref$sort,
        _ref$label = _ref.label,
        label = _ref$label === void 0 ? 'percent' : _ref$label,
        _ref$labelFontSize = _ref.labelFontSize,
        labelFontSize = _ref$labelFontSize === void 0 ? 14 : _ref$labelFontSize,
        _ref$labelColour = _ref.labelColour,
        labelColour = _ref$labelColour === void 0 ? 'white' : _ref$labelColour,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$legendSwatchSize = _ref.legendSwatchSize,
        legendSwatchSize = _ref$legendSwatchSize === void 0 ? 30 : _ref$legendSwatchSize,
        _ref$legendSwatchGap = _ref.legendSwatchGap,
        legendSwatchGap = _ref$legendSwatchGap === void 0 ? 10 : _ref$legendSwatchGap,
        _ref$legendWidth = _ref.legendWidth,
        legendWidth = _ref$legendWidth === void 0 ? 200 : _ref$legendWidth,
        _ref$title = _ref.title,
        title = _ref$title === void 0 ? '' : _ref$title,
        _ref$subtitle = _ref.subtitle,
        subtitle = _ref$subtitle === void 0 ? '' : _ref$subtitle,
        _ref$footer = _ref.footer,
        footer = _ref$footer === void 0 ? '' : _ref$footer,
        _ref$titleFontSize = _ref.titleFontSize,
        titleFontSize = _ref$titleFontSize === void 0 ? 24 : _ref$titleFontSize,
        _ref$subtitleFontSize = _ref.subtitleFontSize,
        subtitleFontSize = _ref$subtitleFontSize === void 0 ? 16 : _ref$subtitleFontSize,
        _ref$footerFontSize = _ref.footerFontSize,
        footerFontSize = _ref$footerFontSize === void 0 ? 14 : _ref$footerFontSize,
        _ref$titleAlign = _ref.titleAlign,
        titleAlign = _ref$titleAlign === void 0 ? 'left' : _ref$titleAlign,
        _ref$subtitleAlign = _ref.subtitleAlign,
        subtitleAlign = _ref$subtitleAlign === void 0 ? 'left' : _ref$subtitleAlign,
        _ref$footerAlign = _ref.footerAlign,
        footerAlign = _ref$footerAlign === void 0 ? 'left' : _ref$footerAlign,
        _ref$imageWidth = _ref.imageWidth,
        imageWidth = _ref$imageWidth === void 0 ? 150 : _ref$imageWidth,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'mousemove' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data;

    var dataPrev;
    var block = false;
    colourData(data);
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).attr('class', 'brc-chart-pie').style('position', 'relative').style('display', 'inline');
    var chartDiv = mainDiv.append('div');
    var svg = chartDiv.append('svg').attr('overflow', 'visible');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, false);
      }
    });
    var svgPie, svgLegend, svgTitle, svgSubtitle, svgFooter;
    makeLegend(data);
    makePie(data); // Title must come after chart and legend because the 
    // width of those is required to do wrapping for title
    //makeTitle()

    svgTitle = makeText(title, svgTitle, 'titleText', titleFontSize, titleAlign);
    svgSubtitle = makeText(subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign);
    svgFooter = makeText(footer, svgFooter, 'footerText', footerFontSize, footerAlign);
    positionElements();
    var imgSelected = makeImage();

    function positionElements() {
      var width = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"));
      svgSubtitle.attr("y", Number(svgTitle.attr("height")));
      svgLegend.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap);
      svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap);
      svgPie.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap);
      svgFooter.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))));
      var height = Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))) + Number(svgFooter.attr("height"));

      if (expand) {
        svg.attr("viewBox", "0 0 " + width + " " + height);
      } else {
        svg.attr("width", width);
        svg.attr("height", height);
      }
    }

    function makeText(text, svgText, classText, fontSize, textAlign) {
      if (!svgText) {
        svgText = svg.append('svg');
      }

      var chartWidth = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"));
      var lines = wrapText(text, svgText, chartWidth, fontSize);
      console.log(classText, text, lines);
      var uText = svgText.selectAll(".".concat(classText)).data(lines);
      var eText = uText.enter().append('text');
      uText.merge(eText).text(function (d) {
        return d;
      }).attr("class", classText).style('font-size', fontSize);
      uText.exit().remove();
      console.log('lines', svgText.select(".".concat(classText)).size());
      var height = svgText.select(".".concat(classText)).node().getBBox().height;
      var widths = svgText.selectAll(".".concat(classText)).nodes().map(function (n) {
        return n.getBBox().width;
      });
      svgText.selectAll(".".concat(classText)).attr('y', function (d, i) {
        return (i + 1) * height;
      }).attr('x', function (d, i) {
        if (textAlign === 'centre') {
          return (chartWidth - widths[i]) / 2;
        } else if (textAlign === 'right') {
          return chartWidth - widths[i];
        } else {
          return 0;
        }
      });
      svgText.attr("height", height * lines.length + height * 0.2); // The 0.2 allows for tails of letters like g, y etc.

      return svgText;
    }

    function makeLegend(data) {
      if (!svgLegend) {
        svgLegend = svg.append('svg').attr('overflow', 'auto');
      }

      var uLegendSwatch = svgLegend.selectAll('.legendSwatch').data(data, function (d) {
        return d.name;
      });
      var durationUpdate = uLegendSwatch.nodes().length ? duration : 0;
      var durationExit = uLegendSwatch.exit().nodes().length ? duration : 0;
      var eLegendSwatch = uLegendSwatch.enter().append('rect').attr('id', function (d) {
        return "swatch-".concat(safeId(d.name));
      }).classed('legendSwatch', true).attr('y', function (d, i) {
        return i * (legendSwatchSize + legendSwatchGap);
      }).attr('width', legendSwatchSize).attr('height', legendSwatchSize).style('fill', function (d) {
        return d.colour;
      }).attr('opacity', 0);
      addEventHandlers(eLegendSwatch, false);
      eLegendSwatch.transition().delay(durationExit + durationUpdate).duration(duration).attr('opacity', 1);
      uLegendSwatch.transition().delay(durationExit).duration(duration).attr('y', function (d, i) {
        return i * (legendSwatchSize + legendSwatchGap);
      });
      uLegendSwatch.exit().transition().duration(duration).attr('opacity', 0).remove();
      var uLegendText = svgLegend.selectAll('.legendText').data(data, function (d) {
        return d.name;
      });
      var dummyText = svgLegend.append('text').attr('opacity', 0).style('font-size', labelFontSize).text('Dummy');
      var legendTextHeight = dummyText.node().getBBox().height;
      dummyText.remove();
      var eLegendText = uLegendText.enter().append('text').text(function (d) {
        return d.name;
      }).attr('alignment-baseline', 'middle').attr('id', function (d) {
        return "legend-".concat(safeId(d.name));
      }).classed('legendText', true).attr('x', function () {
        return legendSwatchSize + legendSwatchGap;
      }).attr('y', function (d, i) {
        return (i + 1) * (legendSwatchSize + legendSwatchGap) - legendSwatchSize / 2 - legendTextHeight / 3;
      }).style('font-size', labelFontSize).attr('opacity', 0);
      addEventHandlers(eLegendText, false);
      eLegendText.transition().delay(durationExit + durationUpdate).duration(duration).attr('opacity', 1);
      uLegendText.transition().delay(durationExit).duration(duration).attr('y', function (d, i) {
        return (i + 1) * (legendSwatchSize + legendSwatchGap) - legendSwatchSize / 2 - legendTextHeight / 4;
      });
      uLegendText.exit().transition().duration(duration).attr('opacity', 0).remove(); //let legendTextWidth = d3.max(d3.selectAll('.legendText').nodes(), n => n.getBBox().width)
      //svgLegend.attr("width", legendSwatchSize + legendSwatchGap + legendTextWidth)

      svgLegend.attr("width", legendWidth);
      var legendHeight = data.length * (legendSwatchSize + legendSwatchGap) - legendSwatchGap;
      svgLegend.attr("height", legendHeight > 0 ? legendHeight : 0);
    }

    function makePie(data) {
      block = true;
      var dataDeleted, dataInserted, dataRetained;
      var init = !dataPrev;
      var dataNew = cloneData(data);

      if (init) {
        dataInserted = [];
        dataDeleted = [];
        dataRetained = [];
        dataPrev = [];
      } else {
        var prevNames = dataPrev.map(function (d) {
          return d.name;
        });
        var newNames = dataNew.map(function (d) {
          return d.name;
        });
        dataDeleted = dataPrev.filter(function (d) {
          return !newNames.includes(d.name);
        });
        dataDeleted = cloneData(dataDeleted);
        dataInserted = dataNew.filter(function (d) {
          return !prevNames.includes(d.name);
        });
        dataInserted = cloneData(dataInserted);
        dataRetained = dataNew.filter(function (d) {
          return prevNames.includes(d.name);
        });
        dataRetained = cloneData(dataRetained);
      }

      var fnSort;

      if (sort === 'asc') {
        fnSort = function fnSort(a, b) {
          return b - a;
        };
      } else if (sort === 'desc') {
        fnSort = function fnSort(a, b) {
          return a - b;
        };
      } else {
        fnSort = null;
      }

      var dataDeleted2 = dataDeleted.map(function (d) {
        var nd = _objectSpread2({}, d);

        nd.number = 0;
        return nd;
      });
      var dataComb = cloneData([].concat(_toConsumableArray(dataNew), _toConsumableArray(dataDeleted2)));
      console.log('dataDeleted', dataDeleted);
      console.log('dataDeleted2', dataDeleted2);
      console.log('dataInserted', dataInserted);
      console.log('dataComb', dataComb);
      var arcsPrev = d3.pie().value(function (d) {
        return d.number;
      }).sortValues(fnSort)(dataPrev);
      var arcsComb = d3.pie().value(function (d) {
        return d.number;
      }).sortValues(fnSort)(dataComb);
      arcsComb.forEach(function (arcComb) {
        var prevArc = arcsPrev.find(function (arcPrev) {
          return arcComb.data.name === arcPrev.data.name;
        });

        if (prevArc) {
          arcComb.prevArc = prevArc;

          if (dataDeleted.find(function (d) {
            return d.name === arcComb.data.name;
          })) {
            arcComb.deleted = true;
          }
        }

        if (dataInserted.find(function (d) {
          return d.name === arcComb.data.name;
        })) {
          arcComb.inserted = true;
        }
      }); // Now data processing complete, reset dataPrev variable

      dataPrev = data;
      console.log('arcsComb', arcsComb);
      var arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius);
      var arcGeneratorLables = d3.arc().innerRadius(innerRadius).outerRadius(radius); // Good stuff here: https://bl.ocks.org/mbostock/4341417
      // and here https://bl.ocks.org/mbostock/1346410
      // Store the displayed angles in _current.
      // Then, interpolate from _current to the new angles.
      // During the transition, _current is updated in-place by d3.interpolate.

      function arcTween(arc, _this, trans) {
        var i;
        var iPrev = d3.interpolate(_this._current, arc.prevArc);
        var iCurr = d3.interpolate(_this._current, arc);
        var midRadius = innerRadius + (radius - innerRadius) / 2;
        return function (t) {
          if (trans === 1) {
            if (init) {
              i = iCurr;
              arcGenerator.outerRadius(d3.interpolate(innerRadius, radius)(t));
              arcGenerator.innerRadius(innerRadius);
            } else if (dataInserted.length) {
              if (arc.deleted) {
                // Previous arcs to be deleted
                i = iPrev;

                if (dataRetained.length) {
                  arcGenerator.outerRadius(d3.interpolate(radius, midRadius)(t));
                  arcGenerator.innerRadius(d3.interpolate(innerRadius, midRadius)(t));
                } else {
                  arcGenerator.outerRadius(d3.interpolate(radius, innerRadius)(t));
                  arcGenerator.innerRadius(innerRadius);
                }
              } else if (arc.inserted) {
                // New arcs to be inserted (invisibly)
                i = iCurr;
                arcGenerator.outerRadius(innerRadius);
                arcGenerator.innerRadius(innerRadius);
              } else {
                // Existing arcs to be shrunk to outer ring
                i = iPrev;
                arcGenerator.outerRadius(radius);
                arcGenerator.innerRadius(d3.interpolate(innerRadius, midRadius)(t));
              }
            } else if (dataDeleted.length) {
              if (arc.deleted) {
                // Previous arcs to be deleted
                i = iPrev;
                arcGenerator.outerRadius(d3.interpolate(radius, innerRadius)(t));
                arcGenerator.innerRadius(innerRadius);
              } else {
                i = iPrev;
                arcGenerator.outerRadius(radius);
                arcGenerator.innerRadius(innerRadius);
              }
            } else {
              i = iCurr;
              arcGenerator.outerRadius(radius);
              arcGenerator.innerRadius(innerRadius);
            }
          }

          if (trans === 2) {
            if (dataInserted.length) {
              if (arc.inserted) {
                i = iCurr;

                if (dataRetained.length) {
                  // Shown inserted arcs in inner ring
                  arcGenerator.outerRadius(d3.interpolate(innerRadius, midRadius)(t));
                  arcGenerator.innerRadius(innerRadius);
                } else {
                  arcGenerator.outerRadius(d3.interpolate(innerRadius, radius)(t));
                  arcGenerator.innerRadius(innerRadius);
                }
              } else if (arc.deleted) {
                i = iCurr;

                if (dataRetained.length) {
                  // Deleted arcs to be kept with inner & outer radius the same (invisible)
                  arcGenerator.outerRadius(midRadius);
                  arcGenerator.innerRadius(midRadius);
                } else {
                  arcGenerator.outerRadius(innerRadius);
                  arcGenerator.innerRadius(innerRadius);
                }
              } else {
                // Existing arcs to be shown in new positions in outer ring
                i = iCurr;
                arcGenerator.outerRadius(radius);
                arcGenerator.innerRadius(midRadius);
              }
            } else {
              if (arc.deleted) {
                i = iCurr;
                arcGenerator.outerRadius(innerRadius);
                arcGenerator.innerRadius(innerRadius);
              } else {
                i = iCurr;
                arcGenerator.outerRadius(radius);
                arcGenerator.innerRadius(innerRadius);
              }
            }
          }

          if (trans === 3) {
            if (arc.inserted) {
              // Shown inserted arcs in inner ring
              i = iCurr;
              arcGenerator.outerRadius(d3.interpolate(midRadius, radius)(t));
              arcGenerator.innerRadius(innerRadius);
            } else if (!arc.deleted) {
              // Existing arcs to be shown in new positions in outer ring
              i = iCurr;
              arcGenerator.outerRadius(radius);
              arcGenerator.innerRadius(d3.interpolate(midRadius, innerRadius)(t));
            } else {
              // Deletions - do nothing
              i = iCurr;
            }
          }

          _this._current = i(0);
          return arcGenerator(i(t));
        };
      }

      function centroidTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
          return "translate(".concat(arcGeneratorLables.centroid(i(t)), ")");
        };
      } //let svgPie, gPie


      var gPie;

      if (svg.select('.brc-chart-pie').size()) {
        svgPie = svg.select('.brc-chart-pie');
        gPie = svgPie.select('g');
      } else {
        svgPie = svg.append('svg').classed('brc-chart-pie', true).attr('width', 2 * radius).attr('height', 2 * radius);
        gPie = svgPie.append('g').attr('transform', "translate(".concat(radius, " ").concat(radius, ")"));
      } // map to data


      var uPie = gPie.selectAll('path').data(arcsComb, function (d) {
        return d.data.name;
      });
      var ePie = uPie.enter().append('path').attr('id', function (d) {
        return "pie-".concat(safeId(d.data.name));
      }).attr('stroke', 'white').style('stroke-width', '2px').style('opacity', 1).attr('fill', function (d) {
        return d.data.colour;
      }).each(function (d) {
        this._current = d;
      });
      addEventHandlers(ePie, true);
      var mPie = ePie.merge(uPie);
      var trans;
      var transDuration = duration; // Transition 1

      trans = mPie.transition().duration(duration).attrTween('d', function (arc) {
        return arcTween(arc, this, 1);
      }); // Transition 2 

      if (dataDeleted.length || dataInserted.length) {
        trans = trans.transition().duration(duration).attrTween('d', function (arc) {
          return arcTween(arc, this, 2);
        });
        transDuration += duration;
      } // Transition 3


      if (dataInserted.length && dataRetained.length) {
        trans = trans.transition().duration(duration).attrTween('d', function (arc) {
          return arcTween(arc, this, 3);
        });
        transDuration += duration;
      } // Because we always retain deleted items in order
      // to make smooth transitions, the D3 exit selection
      // is never populated. Instead we have to remove
      // invisible deleted DOM items (SVG paths) ourselves after 
      // the last transition to avoid messing up the transition
      // next time the data changes.
      //uPie.exit().remove()


      trans.on("end", function (arc) {
        if (arc.deleted) {
          d3.select(this).remove();
        }

        block = false;
      });

      if (label) {
        var arcsNew = d3.pie().value(function (d) {
          return d.number;
        }).sortValues(fnSort)(dataNew);
        var uPieLabels = gPie.selectAll('.labelsPie').data(arcsNew, function (d) {
          return d.data.name;
        });
        var total = dataNew.reduce(function (t, c) {
          return t + c.number;
        }, 0);
        var ePieLabels = uPieLabels.enter().append('text').attr('id', function (d) {
          return "label-".concat(safeId(d.data.name));
        }).attr("class", "labelsPie").style('text-anchor', 'middle').style('font-size', labelFontSize).style('fill', labelColour);
        addEventHandlers(ePieLabels, true);
        ePieLabels.merge(uPieLabels).text(function (d) {
          if (label === 'value') {
            return d.data.number;
          } else if (label === 'percent') {
            return "".concat(Math.round(d.data.number / total * 100), "%");
          }
        }).attr('opacity', 0).transition().duration(transDuration).attrTween('transform', centroidTween).transition().duration(0).attr('opacity', 1);
        uPieLabels.exit().remove();
      }
    }

    function makeImage() {
      var img = svg.append('image').classed('brc-item-image-hide', true) //.attr('xlink:href', 'images/Bumblebees.png')
      .attr('width', imageWidth);
      return img;
    }

    function wrapText(text, svgTitle, maxWidth, fontSize) {
      var textSplit = text.split(" ");
      var lines = [''];
      var line = 0;

      for (var i = 0; i < textSplit.length; i++) {
        if (textSplit[i] === '\n') {
          line++;
          lines[line] = '';
        } else {
          var workingText = "".concat(lines[line], " ").concat(textSplit[i]);
          workingText = workingText.trim();
          var txt = svgTitle.append('text').text(workingText).style('font-size', fontSize);
          var width = txt.node().getBBox().width;

          if (width > maxWidth) {
            line++;
            lines[line] = textSplit[i];
          } else {
            lines[line] = workingText;
          }

          txt.remove();
        }
      }

      return lines;
    }

    function addEventHandlers(sel, isArc) {
      sel.on("mouseover", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(isArc ? d.data.name : d.name, true);
        }
      }).on("mouseout", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(isArc ? d.data.name : d.name, false);
        }
      }).on("click", function (d) {
        if (interactivity === 'mouseclick') {
          highlightItem(isArc ? d.data.name : d.name, true);
          d3.event.stopPropagation();
        }
      });
    }

    function safeId(text) {
      return text ? text.replace(/\W/g, '_') : null;
    }

    function highlightItem(name, show) {
      var i = safeId(name);

      if (show) {
        svg.selectAll('path').classed('brc-lowlight', true);
        svg.selectAll('.legendSwatch').classed('brc-lowlight', true);
        svg.selectAll('.legendText').classed('brc-lowlight', true);
        svg.select("#swatch-".concat(i)).classed('brc-lowlight', false);
        svg.select("#legend-".concat(i)).classed('brc-lowlight', false);
        svg.select("#pie-".concat(i)).classed('brc-lowlight', false);

        var _data = dataPrev.find(function (d) {
          return name === d.name;
        });

        if (_data && _data.image) {
          // Loading image into SVG and setting to specified width
          // and then querying bbox returns zero height. So in order
          // to get the height of the image (required for correct)
          // positioning, it is necessary first to load the image and
          // get the dimensions.
          if (_data.imageHeight) {
            if (imgSelected.attr('xlink:href') !== _data.image) {
              // The loaded image is different from that of the
              // highlighted item, so load.
              loadImage(_data);
            }

            imgSelected.classed('brc-item-image-hide', false);
          } else {
            var img = new Image();

            img.onload = function () {
              _data.imageWidth = imageWidth;
              _data.imageHeight = imageWidth * this.height / this.width;
              loadImage(_data);
            };

            img.src = 'images/Bumblebees.png';
            imgSelected.classed('brc-item-image-hide', false);
          }
        } else {
          imgSelected.classed('brc-item-image-hide', true);
        }
      } else {
        svg.selectAll('.brc-lowlight').classed('brc-lowlight', false);
        imgSelected.classed('brc-item-image-hide', true);
      }
    }

    function loadImage(d) {
      imgSelected.attr('xlink:href', d.image);
      imgSelected.attr('width', d.imageWidth);
      imgSelected.attr('height', d.imageHeight);
      imgSelected.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap + radius - d.imageWidth / 2);
      imgSelected.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + 2 * legendSwatchGap + radius - d.imageHeight / 2);
    }

    function cloneData(data) {
      return data.map(function (d) {
        return _objectSpread2({}, d);
      });
    }

    function colourData(data) {
      data.forEach(function (d, i) {
        if (!d.colour) {
          if (i < 10) {
            d.colour = d3.schemeCategory10[i];
          } else if (i < 18) {
            d.colour = d3.schemeDark2[i - 10];
          } else if (i < 26) {
            d.colour = d3.schemeAccent[i - 18];
          } else {
            d.colour = d3.interpolateSpectral(Math.random());
          }
        }
      });
    }
    /** @function setChartOpts
      * @param {Object} opts - text options.
      * @param {string} opts.title - Title for the chart.
      * @param {string} opts.subtitle - Subtitle for the chart.
      * @param {string} opts.footer - Footer for the chart.
      * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart title.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {Array.<Object>} opts.data - Specifies an array of data objects.
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Set's the value of the chart data, title, subtitle and/or footer. If an element is missing from the 
      * options object, it's value is not changed.
      */


    function setChartOpts(opts) {
      if (!block) {
        highlightItem(null, false);

        if ('title' in opts) {
          title = opts.title;
        }

        if ('subtitle' in opts) {
          subtitle = opts.subtitle;
        }

        if ('footer' in opts) {
          footer = opts.footer;
        }

        if ('titleFontSize' in opts) {
          titleFontSize = opts.titleFontSize;
        }

        if ('subtitleFontSize' in opts) {
          subtitleFontSize = opts.subtitleFontSize;
        }

        if ('footerFontSize' in opts) {
          footerFontSize = opts.footerFontSize;
        }

        if ('titleAlign' in opts) {
          titleAlign = opts.titleAlign;
        }

        if ('subtitleAlign' in opts) {
          subtitleAlign = opts.subtitleAlign;
        }

        if ('footerAlign' in opts) {
          footerAlign = opts.footerAlign;
        }

        svgTitle = makeText(title, svgTitle, 'titleText', titleFontSize, titleAlign);
        svgSubtitle = makeText(subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign);
        svgFooter = makeText(footer, svgFooter, 'footerText', footerFontSize, footerAlign);

        if ('data' in opts) {
          colourData(opts.data);
          makePie(opts.data);
          makeLegend(opts.data);
        }

        positionElements();
      } else {
        console.log('Transition in progress');
      }
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /**
     * @typedef {Object} api
     * @property {module:pie~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:pie~setChartOpts} setChartOpts - Sets text options for the chart. 
       */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts
    };
  }

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
   * @param {string} opts.elid - The id for the dom object created.
   * @param {number} opts.width - The width of each sub-chart area in pixels.
   * @param {number} opts.height - The height of the each sub-chart area in pixels.
   * @param {number} opts.perRow - The number of sub-charts per row.
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
   * @param {string} opts.title - Title for the chart.
   * @param {string} opts.subtitle - Subtitle for the chart.
   * @param {string} opts.footer - Footer for the chart.
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.footerFontSize - Font size (pixels) of chart title.
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
   * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
   * @param {string} opts.axisTop- If set to 'on' line is drawn otherwise not.
   * @param {number} opts.duration - The duration of each transition phase in milliseconds.
   * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
   * If empty, graphs for all taxa are created.
   * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
   * data for which a line should be generated on the chart.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>prop</b> - the name of the nuemric property in the data.
   * <li> <b>label</b> - a label for this metric.
   * <li> <b>colour</b> - optional colour to give the line for this metric. 
   * </ul>
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>week</b> - a number between 1 and 52 indicating the week of the year.
   * <li> <b>p1</b> - a count for the first time period. 
   * <li> <b>p2</b> - a count for the second time period. 
   * </ul>
   * @returns {module:phen1~api} api - Returns an API for the chart.
   */

  function phen1() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'phen1-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$perRow = _ref.perRow,
        perRow = _ref$perRow === void 0 ? 2 : _ref$perRow,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$title = _ref.title,
        title = _ref$title === void 0 ? '' : _ref$title,
        _ref$subtitle = _ref.subtitle,
        subtitle = _ref$subtitle === void 0 ? '' : _ref$subtitle,
        _ref$footer = _ref.footer,
        footer = _ref$footer === void 0 ? '' : _ref$footer,
        _ref$titleFontSize = _ref.titleFontSize,
        titleFontSize = _ref$titleFontSize === void 0 ? 24 : _ref$titleFontSize,
        _ref$subtitleFontSize = _ref.subtitleFontSize,
        subtitleFontSize = _ref$subtitleFontSize === void 0 ? 16 : _ref$subtitleFontSize,
        _ref$footerFontSize = _ref.footerFontSize,
        footerFontSize = _ref$footerFontSize === void 0 ? 14 : _ref$footerFontSize,
        _ref$titleAlign = _ref.titleAlign,
        titleAlign = _ref$titleAlign === void 0 ? 'left' : _ref$titleAlign,
        _ref$subtitleAlign = _ref.subtitleAlign,
        subtitleAlign = _ref$subtitleAlign === void 0 ? 'left' : _ref$subtitleAlign,
        _ref$footerAlign = _ref.footerAlign,
        footerAlign = _ref$footerAlign === void 0 ? 'left' : _ref$footerAlign,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'tick' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$duration = _ref.duration,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$taxa = _ref.taxa,
        taxa = _ref$taxa === void 0 ? [] : _ref$taxa,
        _ref$metrics = _ref.metrics,
        metrics = _ref$metrics === void 0 ? [] : _ref$metrics;
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).attr('class', 'brc-chart-phen').style('position', 'relative').style('display', 'inline'); // const chartDiv = mainDiv
    //   .append('div')

    var svg = mainDiv.append('svg').attr('overflow', 'visible');
    var svgTitle, svgSubtitle, svgFooter;

    if (!taxa.length) {
      taxa = data.map(function (d) {
        return d.taxon;
      }).filter(function (v, i, a) {
        return a.indexOf(v) === i;
      });
    }

    var subChartPad = 20;
    var svgsTaxa = taxa.map(function (t) {
      return makePhen(t);
    });
    var subChartWidth = Number(svgsTaxa[0].attr("width"));
    var subChartHeight = Number(svgsTaxa[0].attr("height"));
    svgsTaxa.forEach(function (svgTaxon, i) {
      var col = i % perRow;
      var row = Math.floor(i / perRow); //console.log(i, col, row)

      svgTaxon.attr("x", col * (subChartWidth + subChartPad) - subChartPad);
      svgTaxon.attr("y", row * (subChartHeight + subChartPad) - subChartPad);
    });
    var cols = svgsTaxa.length % perRow + 1;
    var rows = Math.floor(svgsTaxa.length / perRow) + 1;
    svg.attr("width", cols * (subChartWidth + subChartPad) - subChartPad);
    svg.attr("height", rows * (subChartHeight + subChartPad) - subChartPad); // Title must come after chart and legend because the 
    // width of those is required to do wrapping for title
    //svgTitle = makeText (title, svgTitle, 'titleText', titleFontSize, titleAlign)
    //svgSubtitle = makeText (subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign)
    //svgFooter = makeText (footer, svgFooter, 'footerText', footerFontSize, footerAlign)
    //positionElements()

    function positionElements() {
      var width = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"));
      svgSubtitle.attr("y", Number(svgTitle.attr("height")));
      svgLegend.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap);
      svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap);
      svgPie.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap);
      svgFooter.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))));
      var height = Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))) + Number(svgFooter.attr("height"));

      if (expand) {
        svg.attr("viewBox", "0 0 " + width + " " + height);
      } else {
        svg.attr("width", width);
        svg.attr("height", height);
      }
    }

    function makeText(text, svgText, classText, fontSize, textAlign) {
      if (!svgText) {
        svgText = svg.append('svg');
      }

      var chartWidth = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"));
      var lines = wrapText(text, svgText, chartWidth, fontSize);
      console.log(classText, text, lines);
      var uText = svgText.selectAll(".".concat(classText)).data(lines);
      var eText = uText.enter().append('text');
      uText.merge(eText).text(function (d) {
        return d;
      }).attr("class", classText).style('font-size', fontSize);
      uText.exit().remove();
      console.log('lines', svgText.select(".".concat(classText)).size());
      var height = svgText.select(".".concat(classText)).node().getBBox().height;
      var widths = svgText.selectAll(".".concat(classText)).nodes().map(function (n) {
        return n.getBBox().width;
      });
      svgText.selectAll(".".concat(classText)).attr('y', function (d, i) {
        return (i + 1) * height;
      }).attr('x', function (d, i) {
        if (textAlign === 'centre') {
          return (chartWidth - widths[i]) / 2;
        } else if (textAlign === 'right') {
          return chartWidth - widths[i];
        } else {
          return 0;
        }
      });
      svgText.attr("height", height * lines.length + height * 0.2); // The 0.2 allows for tails of letters like g, y etc.

      return svgText;
    }

    function makePhen(taxon) {
      var dataFiltered = data.filter(function (d) {
        return d.taxon === taxon;
      }).sort(function (a, b) {
        return a.week > b.week ? 1 : -1;
      });
      var lineData = [];
      metrics.forEach(function (m) {
        lineData.push({
          colour: m.colour,
          points: dataFiltered.map(function (d) {
            return {
              n: d[m.prop],
              week: d.week
            };
          })
        });
      });
      var yMax = metrics.reduce(function (a, m) {
        var mMax = Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
          return d[m.prop];
        })));
        return a > mMax ? a : mMax;
      }, 0);
      if (yMax < 5) yMax = 5;
      var svgPhen1 = svg.append('svg').classed('brc-chart-phen1', true);
      svgPhen1.append("rect").classed("brc-chart-phen1-back", "true").attr("width", "100%").attr("height", "100%").attr("fill", "white");
      var gPhen1 = svgPhen1.append('g'); // For axis only

      var xScaleTime = d3.scaleTime().domain([new Date(2020, 0, 1), new Date(2020, 11, 31)]).range([0, width]);
      var xScale = d3.scaleLinear().domain([1, 53]).range([0, width]);
      var yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);
      var tAxis;

      if (axisTop === 'on') {
        tAxis = d3.axisTop().scale(xScale).tickValues([]).tickSizeOuter(0);
      }

      var xAxis;

      if (axisBottom === 'on' || axisBottom === 'tick') {
        xAxis = d3.axisBottom().scale(xScaleTime);

        if (axisBottom === 'tick') {
          xAxis.ticks(d3.timeMonth).tickSize(width >= 200 ? 13 : 5, 0).tickFormat(function (date) {
            if (width >= 750) {
              return d3.timeFormat('%B')(date);
            } else if (width >= 330) {
              return d3.timeFormat('%b')(date);
            } else if (width >= 200) {
              return date.toLocaleString('default', {
                month: 'short'
              }).substr(0, 1);
            } else {
              return '';
            }
          });
        } else {
          xAxis.tickValues([]);
        }
      }

      var rAxis;

      if (axisRight === 'on') {
        rAxis = d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0);
      }

      var yAxis;

      if (axisLeft === 'on' || axisLeft === 'tick') {
        yAxis = d3.axisLeft().scale(yScale).ticks(5);

        if (axisLeft !== 'tick') {
          yAxis.tickValues([]);
        } else {
          yAxis.tickFormat(d3.format("d"));
        }
      }

      var line = d3.line().curve(d3.curveBasis).x(function (d) {
        return xScale(d.week);
      }).y(function (d) {
        return yScale(d.n);
      });
      var lines = gPhen1.selectAll("lines").data(lineData).enter().append("g");
      lines.append("path").attr("d", function (d) {
        return line(d.points);
      }).attr("stroke", function (d) {
        return d.colour;
      }).attr("stroke-width", 2);
      var yAxisTextWidth = 0;
      var axisPadY = axisLeft === 'tick' ? 10 : 0;

      if (yAxis) {
        var gYaxis = svgPhen1.append("g").attr("class", "y axis").call(yAxis);
        gYaxis.selectAll("text").each(function () {
          if (this.getBBox().width > yAxisTextWidth) yAxisTextWidth = this.getBBox().width;
        });
        gYaxis.attr("transform", "translate(".concat(yAxisTextWidth + axisPadY, ",0)"));
      }

      var axisPadX = axisBottom === 'tick' ? 15 : 0;

      if (xAxis) {
        var gXaxis = svgPhen1.append("g").attr("class", "x axis").call(xAxis);
        gXaxis.selectAll(".tick text").style("text-anchor", "start").attr("x", 6).attr("y", 6);
        gXaxis.attr("transform", "translate(".concat(yAxisTextWidth + axisPadY, ",").concat(height, ")"));
      }

      if (tAxis) {
        var gTaxis = svgPhen1.append("g").call(tAxis);
        gTaxis.attr("transform", "translate(".concat(yAxisTextWidth + axisPadY, ",0)"));
      }

      if (rAxis) {
        var gRaxis = svgPhen1.append("g").call(rAxis);
        gRaxis.attr("transform", "translate(".concat(yAxisTextWidth + axisPadY + width, ",0)"));
      }

      gPhen1.attr("transform", "translate(".concat(yAxisTextWidth + axisPadY, ",0)"));
      svgPhen1.attr('width', width + yAxisTextWidth + axisPadY + 1).attr('height', height + axisPadX + 1);
      return svgPhen1;
    }

    function wrapText(text, svgTitle, maxWidth, fontSize) {
      var textSplit = text.split(" ");
      var lines = [''];
      var line = 0;

      for (var i = 0; i < textSplit.length; i++) {
        if (textSplit[i] === '\n') {
          line++;
          lines[line] = '';
        } else {
          var workingText = "".concat(lines[line], " ").concat(textSplit[i]);
          workingText = workingText.trim();
          var txt = svgTitle.append('text').text(workingText).style('font-size', fontSize);
          var _width = txt.node().getBBox().width;

          if (_width > maxWidth) {
            line++;
            lines[line] = textSplit[i];
          } else {
            lines[line] = workingText;
          }

          txt.remove();
        }
      }

      return lines;
    }
    /** @function setChartOpts
      * @param {Object} opts - text options.
      * @param {string} opts.title - Title for the chart.
      * @param {string} opts.subtitle - Subtitle for the chart.
      * @param {string} opts.footer - Footer for the chart.
      * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart title.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {Array.<Object>} opts.data - Specifies an array of data objects.
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Set's the value of the chart data, title, subtitle and/or footer. If an element is missing from the 
      * options object, it's value is not changed.
      */


    function setChartOpts(opts) {
      if ('title' in opts) {
        title = opts.title;
      }

      if ('subtitle' in opts) {
        subtitle = opts.subtitle;
      }

      if ('footer' in opts) {
        footer = opts.footer;
      }

      if ('titleFontSize' in opts) {
        titleFontSize = opts.titleFontSize;
      }

      if ('subtitleFontSize' in opts) {
        subtitleFontSize = opts.subtitleFontSize;
      }

      if ('footerFontSize' in opts) {
        footerFontSize = opts.footerFontSize;
      }

      if ('titleAlign' in opts) {
        titleAlign = opts.titleAlign;
      }

      if ('subtitleAlign' in opts) {
        subtitleAlign = opts.subtitleAlign;
      }

      if ('footerAlign' in opts) {
        footerAlign = opts.footerAlign;
      }

      svgTitle = makeText(title, svgTitle, 'titleText', titleFontSize, titleAlign);
      svgSubtitle = makeText(subtitle, svgSubtitle, 'subtitleText', subtitleFontSize, subtitleAlign);
      svgFooter = makeText(footer, svgFooter, 'footerText', footerFontSize, footerAlign);

      if ('data' in opts) {
        makePhen(opts.data);
      }

      positionElements();
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /**
     * @typedef {Object} api
     * @property {module:pie~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:pie~setChartOpts} setChartOpts - Sets text options for the chart. 
       */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts
    };
  }

  var name = "brc-d3";
  var version = "0.0.3";
  var description = "Javscript library for various D3 visualisations of biological record data.";
  var type = "module";
  var main = "dist/brccharts.umd.js";
  var browser = "dist/brccharts.umd.js";
  var scripts = {
  	lint: "npx eslint src",
  	test: "jest",
  	build: "rollup --config",
  	docs: "jsdoc ./src/ -R README.md -d ./docs/api"
  };
  var author = "UKCEH Biological Records Centre";
  var license = "GPL-3.0-only";
  var files = [
  	"dist"
  ];
  var repository = {
  	type: "git",
  	url: "https://github.com/BiologicalRecordsCentre/brc-charts.git"
  };
  var dependencies = {
  	d3: "^5.16.0"
  };
  var devDependencies = {
  	"@babel/core": "^7.10.4",
  	"@babel/preset-env": "^7.10.4",
  	"@rollup/plugin-babel": "^5.0.4",
  	"@rollup/plugin-commonjs": "^13.0.0",
  	"@rollup/plugin-json": "^4.1.0",
  	"@rollup/plugin-node-resolve": "^8.1.0",
  	eslint: "^7.4.0",
  	"eslint-plugin-jest": "^23.17.1",
  	jest: "^26.1.0",
  	rollup: "^2.23.0",
  	"rollup-plugin-css-only": "^2.1.0",
  	"rollup-plugin-eslint": "^7.0.0",
  	"rollup-plugin-terser": "^6.1.0"
  };
  var pkg = {
  	name: name,
  	version: version,
  	description: description,
  	type: type,
  	main: main,
  	browser: browser,
  	scripts: scripts,
  	author: author,
  	license: license,
  	files: files,
  	repository: repository,
  	dependencies: dependencies,
  	devDependencies: devDependencies
  };

  // to assist with trouble shooting.

  console.log("Running ".concat(pkg.name, " version ").concat(pkg.version));

  exports.phen1 = phen1;
  exports.pie = pie;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
