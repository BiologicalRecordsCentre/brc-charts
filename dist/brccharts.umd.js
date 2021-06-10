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

  function safeId(text) {
    return text ? text.replace(/\W/g, '_') : null;
  }
  function cloneData(data) {
    return data.map(function (d) {
      return _objectSpread2({}, d);
    });
  }
  function xAxisMonth(width, ticks) {
    var xScaleTime = d3.scaleTime().domain([new Date(2020, 0, 1), new Date(2020, 11, 31)]).range([0, width]);
    var xAxis = d3.axisBottom().scale(xScaleTime);

    if (ticks) {
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
      xAxis.tickValues([]).tickSizeOuter(0);
    }

    return xAxis;
  }
  function xAxisYear(width, ticks, min, max, bars) {
    var xScale = d3.scaleLinear().range([0, width]);

    if (bars) {
      xScale.domain([min - 0.5, max + 0.5]);
    } else {
      xScale.domain([min, max]);
    }

    var xAxis = d3.axisBottom().scale(xScale);

    if (ticks) {
      var years = max - min;
      var threshold = 30;

      var _ticks;

      if (width / years > threshold) {
        _ticks = years;
      } else if (width / years * 2 > threshold) {
        _ticks = years / 2;
      } else if (width / years * 5 > threshold) {
        _ticks = years / 5;
      } else if (width / years * 10 > threshold) {
        _ticks = years / 10;
      } else {
        _ticks = 2;
      }

      xAxis.ticks(_ticks); // .tickSize(width >= 200 ? 13 : 5, 0)
      // xAxis.tickFormat(year => {
      //   if (width / years < break1) {
      //     // No labels
      //     return ''
      //   } else if (width / years < break) {
      //     // Return last two digits of year as a string
      //     return year.toString().substr(2,2)
      //   } else {
      //     // Return year as a string
      //     return year.toString()
      //   }
      // })

      xAxis.tickFormat(function (year) {
        return year.toString();
      });

      if (bars) {
        xAxis.tickSizeOuter(0);
      }
    } else {
      xAxis.tickValues([]).tickSizeOuter(0);
    }

    return xAxis;
  }
  function wrapText(text, svg, maxWidth, fontSize) {
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
        var txt = svg.append('text').text(workingText).style('font-size', fontSize);
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
  function makeText(text, classText, fontSize, textAlign, textWidth, svg) {
    var svgText = svg.select(".".concat(classText));

    if (!svgText.size()) {
      svgText = svg.append('svg').attr("class", classText);
    }

    var lines = wrapText(text, svgText, textWidth, fontSize);
    var uText = svgText.selectAll(".".concat(classText, "-line")).data(lines);
    var eText = uText.enter().append('text').attr("class", "".concat(classText, "-line"));
    uText.merge(eText).text(function (d) {
      return d;
    }).style('font-size', fontSize);
    uText.exit().remove();
    var height = svgText.select(".".concat(classText, "-line")).node().getBBox().height;
    var widths = svgText.selectAll(".".concat(classText, "-line")).nodes().map(function (n) {
      return n.getBBox().width;
    });
    svgText.selectAll(".".concat(classText, "-line")).attr('y', function (d, i) {
      return (i + 1) * height;
    }).attr('x', function (d, i) {
      if (textAlign === 'centre') {
        return (textWidth - widths[i]) / 2;
      } else if (textAlign === 'right') {
        return textWidth - widths[i];
      } else {
        return 0;
      }
    });
    svgText.attr("height", height * lines.length + height * 0.2); // The 0.2 allows for tails of letters like g, y etc.

    return svgText;
  }
  function positionMainElements(svg, expand) {
    var space = 10;
    var svgTitle = svg.select('.titleText');
    var svgSubtitle = svg.select('.subtitleText');
    var svgChart = svg.select('.mainChart');
    var svgFooter = svg.select('.footerText');
    svgSubtitle.attr("y", Number(svgTitle.attr("height")));
    svgChart.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + space);
    svgFooter.attr("y", Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + space + Number(svgChart.attr("height")));
    var height = Number(svgTitle.attr("height")) + Number(svgSubtitle.attr("height")) + Number(svgChart.attr("height")) + Number(svgFooter.attr("height")) + 2 * space;

    if (expand) {
      svg.attr("viewBox", "0 0 " + Number(svgChart.attr("width")) + " " + height);
    } else {
      svg.attr("width", Number(svgChart.attr("width")));
      svg.attr("height", height);
    }
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
    var svgChart = svg.append('svg').attr('class', 'mainChart');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, false);
      }
    });
    makeChart(data);
    var textWidth = Number(svgChart.attr("width")); // Texts must come after chart and legend because the 
    // width of those is required to do wrap text

    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand);

    function makeChart(data) {
      makePie(data);
      makeLegend(data);
      var svgPie = svgChart.select('.brc-chart-pie');
      var svgLegend = svgChart.select('.brc-chart-legend');
      svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap);
      svgChart.attr("width", Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width")));
      svgChart.attr("height", Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))));
    }

    function makeLegend(data) {
      var svgLegend;

      if (svg.select('.brc-chart-legend').size()) {
        svgLegend = svgChart.select('.brc-chart-legend');
      } else {
        svgLegend = svgChart.append('svg').classed('brc-chart-legend', true).attr('overflow', 'auto');
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
      }

      var svgPie, gPie;

      if (svg.select('.brc-chart-pie').size()) {
        svgPie = svgChart.select('.brc-chart-pie');
        gPie = svgPie.select('g');
      } else {
        svgPie = svgChart.append('svg').classed('brc-chart-pie', true).attr('width', 2 * radius).attr('height', 2 * radius);
        gPie = svgPie.append('g').attr('transform', "translate(".concat(radius, " ").concat(radius, ")"));
        gPie.append('image').classed('brc-item-image', true).classed('brc-item-image-hide', true).attr('width', imageWidth);
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

    function highlightItem(name, show) {
      var i = safeId(name);
      var imgSelected = svg.select('.brc-item-image');

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
      var imgSelected = svg.select('.brc-item-image');
      imgSelected.attr('xlink:href', d.image);
      imgSelected.attr('width', d.imageWidth);
      imgSelected.attr('height', d.imageHeight);
      imgSelected.attr("x", -d.imageWidth / 2);
      imgSelected.attr("y", -d.imageHeight / 2);
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

        var _textWidth = Number(svgChart.attr("width"));

        makeText(title, 'titleText', titleFontSize, titleAlign, _textWidth, svg);
        makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, _textWidth, svg);
        makeText(footer, 'footerText', footerFontSize, footerAlign, _textWidth, svg);

        if ('data' in opts) {
          colourData(opts.data);
          makeChart(opts.data);
        } //positionElements()


        positionMainElements(svg, expand);
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
   * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
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
   * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph.
   * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label.
   * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.
   * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
   * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
   * @param {string} opts.axisTop- If set to 'on' line is drawn otherwise not.
   * @param {number} opts.duration - The duration of each transition phase in milliseconds.
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
   * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
   * If empty, graphs for all taxa are created.
   * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
   * data for which a line should be generated on the chart.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>prop</b> - the name of the numeric property in the data (count properties - 'c1' or 'c2' in the example below).
   * <li> <b>label</b> - a label for this metric.
   * <li> <b>colour</b> - optional colour to give the line for this metric. Any accepted way of specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
   * </ul>
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>week</b> - a number between 1 and 53 indicating the week of the year.
   * <li> <b>c1</b> - a count for a given time period (can have any name). 
   * <li> <b>c2</b> - a count for a given time period (can have any name).
   * ... - there must be at leas one count column, but there can be any number of them.
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
        _ref$ytype = _ref.ytype,
        ytype = _ref$ytype === void 0 ? 'count' : _ref$ytype,
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
        footerFontSize = _ref$footerFontSize === void 0 ? 10 : _ref$footerFontSize,
        _ref$legendFontSize = _ref.legendFontSize,
        legendFontSize = _ref$legendFontSize === void 0 ? 16 : _ref$legendFontSize,
        _ref$titleAlign = _ref.titleAlign,
        titleAlign = _ref$titleAlign === void 0 ? 'left' : _ref$titleAlign,
        _ref$subtitleAlign = _ref.subtitleAlign,
        subtitleAlign = _ref$subtitleAlign === void 0 ? 'left' : _ref$subtitleAlign,
        _ref$footerAlign = _ref.footerAlign,
        footerAlign = _ref$footerAlign === void 0 ? 'left' : _ref$footerAlign,
        _ref$showTaxonLabel = _ref.showTaxonLabel,
        showTaxonLabel = _ref$showTaxonLabel === void 0 ? true : _ref$showTaxonLabel,
        _ref$taxonLabelFontSi = _ref.taxonLabelFontSize,
        taxonLabelFontSize = _ref$taxonLabelFontSi === void 0 ? 16 : _ref$taxonLabelFontSi,
        _ref$taxonLabelItalic = _ref.taxonLabelItalics,
        taxonLabelItalics = _ref$taxonLabelItalic === void 0 ? false : _ref$taxonLabelItalic,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'tick' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'mousemove' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$taxa = _ref.taxa,
        taxa = _ref$taxa === void 0 ? [] : _ref$taxa,
        _ref$metrics = _ref.metrics,
        metrics = _ref$metrics === void 0 ? [] : _ref$metrics;

    var metricsPlus;
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, false);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart');
    preProcessMetrics();
    makeChart(); // Texts must come after chartbecause 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width"));
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand);

    function makeChart() {
      if (!taxa.length) {
        taxa = data.map(function (d) {
          return d.taxon;
        }).filter(function (v, i, a) {
          return a.indexOf(v) === i;
        });
      }

      var subChartPad = 10;
      var svgsTaxa = taxa.map(function (t) {
        return makePhen(t);
      });
      var subChartWidth = Number(svgsTaxa[0].attr("width"));
      var subChartHeight = Number(svgsTaxa[0].attr("height"));
      var legendHeight = makeLegend(perRow * (subChartWidth + subChartPad)) + subChartPad;
      svgsTaxa.forEach(function (svgTaxon, i) {
        var col = i % perRow;
        var row = Math.floor(i / perRow);
        svgTaxon.attr("x", col * (subChartWidth + subChartPad));
        svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight);
      });
      svgChart.attr("width", perRow * (subChartWidth + subChartPad));
      svgChart.attr("height", legendHeight + Math.ceil(svgsTaxa.length / perRow) * (subChartHeight + subChartPad));
    }

    function preProcessMetrics() {
      // Look for 'fading' colour in taxa and colour appropriately 
      // in fading shades of grey.
      var iFading = 0;
      metricsPlus = metrics.map(function (m) {
        var iFade, strokeWidth;

        if (m.colour === 'fading') {
          iFade = ++iFading;
          strokeWidth = 1;
        } else {
          strokeWidth = 2;
        }

        return {
          prop: m.prop,
          label: m.label,
          colour: m.colour,
          fading: iFade,
          strokeWidth: strokeWidth
        };
      }).reverse();
      var grey = d3.scaleLinear().range(['#808080', '#E0E0E0']).domain([1, iFading]);
      metricsPlus.forEach(function (m) {
        if (m.fading) {
          m.colour = grey(m.fading);
        }
      });
    }

    function makePhen(taxon) {
      // Pre-process data.
      // Filter to named taxon and sort in week order
      // Add max value to each.
      var dataFiltered = data.filter(function (d) {
        return d.taxon === taxon;
      }).sort(function (a, b) {
        return a.week > b.week ? 1 : -1;
      });
      var lineData = [];
      metricsPlus.forEach(function (m) {
        var total = dataFiltered.reduce(function (a, d) {
          return a + d[m.prop];
        }, 0);
        var max = Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
          return d[m.prop];
        })));
        var maxProportion = Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
          return d[m.prop] / total;
        })));
        lineData.push({
          id: safeId(m.label),
          colour: m.colour,
          strokeWidth: m.strokeWidth,
          max: max,
          maxProportion: maxProportion,
          total: total,
          points: dataFiltered.map(function (d) {
            return {
              n: d[m.prop],
              week: d.week
            };
          })
        });
      }); // Set the maximum value for the y axis

      var yMax;

      if (ytype === 'normalized') {
        yMax = 1;
      } else if (ytype === 'proportion') {
        yMax = Math.max.apply(Math, _toConsumableArray(lineData.map(function (d) {
          if (isNaN(d.maxProportion)) {
            return 0;
          } else {
            return d.maxProportion;
          }
        })));
      } else {
        yMax = Math.max.apply(Math, _toConsumableArray(lineData.map(function (d) {
          return d.max;
        })));
        if (yMax < 5) yMax = 5;
      } // Value scales


      var xScale = d3.scaleLinear().domain([1, 53]).range([0, width]);
      var yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]); // Top axis

      var tAxis;

      if (axisTop === 'on') {
        tAxis = d3.axisTop().scale(xScale).tickValues([]).tickSizeOuter(0);
      } // X (bottom) axis


      var xAxis;

      if (axisBottom === 'on' || axisBottom === 'tick') {
        xAxis = xAxisMonth(width, axisBottom === 'tick');
      } // Right axis


      var rAxis;

      if (axisRight === 'on') {
        rAxis = d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0);
      } // Y (left) axis


      var yAxis;

      if (axisLeft === 'on' || axisLeft === 'tick') {
        yAxis = d3.axisLeft().scale(yScale).ticks(5);

        if (axisLeft !== 'tick') {
          yAxis.tickValues([]).tickSizeOuter(0);
        } else if (ytype === 'count') {
          yAxis.tickFormat(d3.format("d"));
        }
      } // Line path generator


      var line = d3.line().curve(d3.curveMonotoneX).x(function (d) {
        return xScale(d.week);
      }).y(function (d) {
        return yScale(d.n);
      }); // Create or get the relevant chart svg

      var init, svgPhen1, gPhen1;

      if (taxa.length === 1 && svgChart.selectAll('.brc-chart-phen1').size() === 1) {
        svgPhen1 = svgChart.select('.brc-chart-phen1');
        gPhen1 = svgPhen1.select('.brc-chart-phen1-g');
        init = false;
      } else if (svgChart.select("#".concat(safeId(taxon))).size()) {
        svgPhen1 = svgChart.select("#".concat(safeId(taxon)));
        gPhen1 = svgPhen1.select('.brc-chart-phen1-g');
        init = false;
      } else {
        svgPhen1 = svgChart.append('svg').classed('brc-chart-phen1', true).attr('id', safeId(taxon));
        gPhen1 = svgPhen1.append('g').classed('brc-chart-phen1-g', true);
        init = true;
      } // Create/update the line paths with D3


      var mlines = gPhen1.selectAll("path").data(lineData, function (d) {
        return d.id;
      });
      var eLines = mlines.enter().append("path").attr("class", function (d) {
        return "phen-path-".concat(d.id, " phen-path");
      }).attr("d", function (d) {
        return line(d.points.map(function (p) {
          return {
            n: 0,
            week: p.week
          };
        }));
      });
      addEventHandlers(eLines, 'id');
      mlines.merge(eLines).transition().duration(duration).attr("d", function (d) {
        if (ytype === 'normalized') {
          return line(d.points.map(function (p) {
            return {
              n: d.max ? p.n / d.max : 0,
              week: p.week
            };
          }));
        } else if (ytype === 'proportion') {
          return line(d.points.map(function (p) {
            return {
              n: d.total === 0 ? 0 : p.n / d.total,
              week: p.week
            };
          }));
        } else {
          return line(d.points);
        }
      }).attr("stroke", function (d) {
        return d.colour;
      }).attr("stroke-width", function (d) {
        return d.strokeWidth;
      });
      mlines.exit().transition().duration(duration).attr("d", function (d) {
        return line(d.points.map(function (p) {
          return {
            n: 0,
            week: p.week
          };
        }));
      }).remove();

      if (init) {
        // Constants for positioning
        var axisPadX = axisLeft === 'tick' ? 35 : 0;
        var axisPadY = axisBottom === 'tick' ? 15 : 0;
        var labelPadY; // Taxon title

        if (showTaxonLabel) {
          var taxonLabel = svgPhen1.append('text').classed('brc-chart-phen1-label', true).text(taxon).style('font-size', taxonLabelFontSize).style('font-style', taxonLabelItalics ? 'italic' : '');
          var labelHeight = taxonLabel.node().getBBox().height;
          taxonLabel.attr("transform", "translate(".concat(axisPadX, ", ").concat(labelHeight, ")"));
          labelPadY = labelHeight * 1.5;
        } else {
          labelPadY = 0;
        } // Size SVG


        svgPhen1.attr('width', width + axisPadX + 1).attr('height', height + axisPadY + labelPadY + 1); // Position chart

        gPhen1.attr("transform", "translate(".concat(axisPadX, ",").concat(labelPadY, ")")); // Create axes and position within SVG

        if (yAxis) {
          var gYaxis = svgPhen1.append("g").attr("class", "y-axis");
          gYaxis.attr("transform", "translate(".concat(axisPadX, ",").concat(labelPadY, ")"));
        }

        if (xAxis) {
          var gXaxis = svgPhen1.append("g").attr("class", "x axis").call(xAxis);
          gXaxis.selectAll(".tick text").style("text-anchor", "start").attr("x", 6).attr("y", 6);
          gXaxis.attr("transform", "translate(".concat(axisPadX, ",").concat(height + labelPadY, ")"));
        }

        if (tAxis) {
          var gTaxis = svgPhen1.append("g").call(tAxis);
          gTaxis.attr("transform", "translate(".concat(axisPadX, ",").concat(labelPadY, ")"));
        }

        if (rAxis) {
          var gRaxis = svgPhen1.append("g").call(rAxis);
          gRaxis.attr("transform", "translate(".concat(axisPadX + width, ",").concat(labelPadY, ")"));
        }
      } else if (taxa.length === 1) {
        // Update taxon label
        if (showTaxonLabel) {
          svgPhen1.select('.brc-chart-phen1-label').text(taxon);
        }
      }

      svgPhen1.select(".y-axis").transition().duration(duration).call(yAxis);
      return svgPhen1;
    }

    function makeLegend(legendWidth) {
      var swatchSize = 20;
      var swatchFact = 1.3; // Loop through all the legend elements and work out their
      // positions based on swatch size, item lable text size and
      // legend width.

      var metricsReversed = cloneData(metricsPlus).reverse();
      var rows = 0;
      var lineWidth = -swatchSize;
      metricsReversed.forEach(function (m) {
        var tmpText = svgChart.append('text') //.style('display', 'none')
        .text(m.label).style('font-size', legendFontSize);
        var widthText = tmpText.node().getBBox().width;
        tmpText.remove();

        if (lineWidth + swatchSize + swatchSize * swatchFact + widthText > legendWidth) {
          ++rows;
          lineWidth = -swatchSize;
        }

        m.x = lineWidth + swatchSize;
        m.y = rows * swatchSize * swatchFact;
        lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText;
      });
      var ls = svgChart.selectAll('.brc-legend-item-rect').data(metricsReversed, function (m) {
        return safeId(m.label);
      }).join(function (enter) {
        var rect = enter.append("rect").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-rect brc-legend-item-".concat(safeId(m.label));
        }).attr('width', swatchSize).attr('height', 2);
        return rect;
      }).attr('x', function (m) {
        return m.x;
      }).attr('y', function (m) {
        return m.y + swatchSize / 2;
      }).attr('fill', function (m) {
        return m.colour;
      });
      var lt = svgChart.selectAll('.brc-legend-item-text').data(metricsReversed, function (m) {
        return safeId(m.label);
      }).join(function (enter) {
        var text = enter.append("text").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-text brc-legend-item-".concat(safeId(m.label));
        }).text(function (m) {
          return m.label;
        }).style('font-size', legendFontSize);
        return text;
      }).attr('x', function (m) {
        return m.x + swatchSize * swatchFact;
      }).attr('y', function (m) {
        return m.y + legendFontSize * 1;
      });
      addEventHandlers(ls, 'label');
      addEventHandlers(lt, 'label');
      return swatchSize * swatchFact * (rows + 1);
    }

    function highlightItem(id, highlight) {
      svgChart.selectAll('.phen-path').classed('lowlight', highlight);
      svgChart.selectAll(".phen-path-".concat(safeId(id))).classed('lowlight', false);
      svgChart.selectAll(".phen-path").classed('highlight', false);

      if (safeId(id)) {
        svgChart.selectAll(".phen-path-".concat(safeId(id))).classed('highlight', highlight);
      }

      svgChart.selectAll('.brc-legend-item').classed('lowlight', highlight);

      if (id) {
        svgChart.selectAll(".brc-legend-item-".concat(safeId(id))).classed('lowlight', false);
      }

      if (id) {
        svgChart.selectAll(".brc-legend-item-".concat(safeId(id))).classed('highlight', highlight);
      } else {
        svgChart.selectAll(".brc-legend-item").classed('highlight', false);
      }
    }

    function addEventHandlers(sel, prop) {
      sel.on("mouseover", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d[prop], true);
        }
      }).on("mouseout", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d[prop], false);
        }
      }).on("click", function (d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d[prop], true);
          d3.event.stopPropagation();
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
      * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
      * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
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

      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      var remakeChart = false;

      if ('data' in opts) {
        data = opts.data;
        remakeChart = true;
      }

      if ('ytype' in opts) {
        ytype = opts.ytype;
        remakeChart = true;
      }

      if ('metrics' in opts) {
        metrics = opts.metrics;
        preProcessMetrics();
        remakeChart = true;
      }

      if (remakeChart) makeChart();
      positionMainElements(svg, expand);
    }
    /** @function setTaxon
      * @param {string} opts.taxon - The taxon to display.
      * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
      * For single species charts, this allows you to change the taxon displayed.
      */


    function setTaxon(taxon) {
      if (taxa.length !== 1) {
        console.log("You can only use the setTaxon method when your chart displays a single taxon.");
      } else {
        taxa = [taxon];
        makeChart();
      }
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /**
     * @typedef {Object} api
     * @property {module:phen1~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:phen1~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:phen1~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:phen1~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon
    };
  }

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
   * @param {string} opts.elid - The id for the dom object created.
   * @param {number} opts.width - The width of the main chart area in pixels (excludes margins).
   * @param {number} opts.height - The height of the main chart area in pixels (excludes margins).
   * @param {Object} opts.margin - An object indicating the margins to add around the main chart area. 
   * @param {number} opts.margin.left - Left margin in pixels. 
   * @param {number} opts.margin.right - Right margin in pixels. 
   * @param {number} opts.margin.top - Top margin in pixels. 
   * @param {number} opts.margin.bottom - Bottom margin in pixels. 
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
   * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
   * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisTop - If set to 'on' line is drawn otherwise not.
   * @param {string} opts.axisTaxaLabel - Value for labelling taxa accumulation axis.
   * @param {string} opts.axisCountLabel - Value for labelling count accumulation axis.
   * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels.
   * @param {string} opts.show - Indicates whether to show accumulation curves for taxa, counts or both. Permitted values: 'taxa', 'counts' or 'both'.
   * @param {boolean} opts.swapYaxes - The default display is number of taxa on left axis and counts on right. Set this to true to swap that.
   * @param {number} opts.duration - The duration of each transition phase in milliseconds.
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
   * If empty, graphs for all taxa are created.
   * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
   * data for which taxa and/or count accumulation lines should be generated on the chart.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>prop</b> - the name of the numeric property in the data (count properties - 'c1' or 'c2' in the example below).
   * <li> <b>labelTaxa</b> - a label for the taxa accumulation metric.
   * <li> <b>labelCounts</b> - a label for the counts accumulation metric.
   * <li> <b>key</b> - a base key for this metric. If the options are updated using the setChartOpts API method, then if this value is set, it is used to uniquely identify the graphic elements. If not set, then the label is used.
   * <li> <b>ColourTaxa</b> - optional colour to give the line for the taxa accumulation metric. Any accepted way of specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
   * <li> <b>ColourCounts</b> - optional colour to give the line for the counts accumulation metric. Any accepted way of specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
   * <li> <b>styleTaxa</b> - options style to give the line for the taxa accumulation metric. Accepted value is 'dashed' which results in a dashed line. Anything else results in a solid line.
   * <li> <b>styleCounts</b> - options style to give the line for the counts accumulation metric. Accepted value is 'dashed' which results in a dashed line. Anything else results in a solid line.
   * </ul>
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>week</b> - a number between 1 and 53 indicating the week of the year.
   * <li> <b>c1</b> - a count for a given time period (can have any name). 
   * <li> <b>c2</b> - a count for a given time period (can have any name).
   * ... - there can be any number of these count columns.
   * </ul>
   * @returns {module:accum~api} api - Returns an API for the chart.
   */

  function accum() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'accum-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    } : _ref$margin,
        _ref$ytype = _ref.ytype,
        ytype = _ref$ytype === void 0 ? 'count' : _ref$ytype,
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
        footerFontSize = _ref$footerFontSize === void 0 ? 10 : _ref$footerFontSize,
        _ref$legendFontSize = _ref.legendFontSize,
        legendFontSize = _ref$legendFontSize === void 0 ? 16 : _ref$legendFontSize,
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
        axisRight = _ref$axisRight === void 0 ? 'tick' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$axisTaxaLabel = _ref.axisTaxaLabel,
        axisTaxaLabel = _ref$axisTaxaLabel === void 0 ? '' : _ref$axisTaxaLabel,
        _ref$axisCountLabel = _ref.axisCountLabel,
        axisCountLabel = _ref$axisCountLabel === void 0 ? '' : _ref$axisCountLabel,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$show = _ref.show,
        show = _ref$show === void 0 ? 'both' : _ref$show,
        _ref$swapYaxes = _ref.swapYaxes,
        swapYaxes = _ref$swapYaxes === void 0 ? false : _ref$swapYaxes,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'mousemove' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$metrics = _ref.metrics,
        metrics = _ref$metrics === void 0 ? [] : _ref$metrics;

    var metricsPlus;
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).attr('class', 'brc-chart-accum').style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, null, false);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart');
    preProcessMetrics();
    makeChart(); // Texts must come after chart because 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width"));
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand);

    function preProcessMetrics() {
      // Look for 'fading' colour in taxa and colour appropriately 
      // in fading shades of grey.
      var iFadingTaxa = 0;
      var iFadingCounts = 0;
      var iFadeTaxa, iFadeCounts, strokeWidth;
      metricsPlus = metrics.map(function (m) {
        if (m.colourCounts === 'fading') {
          iFadeCounts = ++iFadingCounts;
          strokeWidth = 1;
        } else {
          strokeWidth = 2;
        }

        if (m.colourTaxa === 'fading') {
          iFadeTaxa = ++iFadingTaxa;
          strokeWidth = 1;
        } else {
          strokeWidth = 2;
        }

        return {
          prop: m.prop,
          key: m.key,
          labelTaxa: m.labelTaxa,
          labelCounts: m.labelCounts,
          colourTaxa: m.colourTaxa,
          colourCounts: m.colourCounts,
          styleTaxa: m.styleTaxa,
          styleCounts: m.styleCounts,
          fadingTaxa: iFadeTaxa,
          fadingCounts: iFadeCounts,
          strokeWidth: strokeWidth
        };
      }).reverse();
      var greyTaxa = d3.scaleLinear().range(['#808080', '#E0E0E0']).domain([1, iFadeTaxa]);
      var greyCounts = d3.scaleLinear().range(['#808080', '#E0E0E0']).domain([1, iFadeCounts]);
      metricsPlus.forEach(function (m) {
        if (m.fadingTaxa) {
          m.colourTaxa = greyTaxa(m.fadingTaxa);
        }

        if (m.fadingCounts) {
          m.colourCounts = greyCounts(m.fadingCounts);
        }
      });
    }

    function makeChart() {
      var showTaxa = show === 'taxa' || show === 'both';
      var showCounts = show === 'counts' || show === 'both';
      var lineData = [];
      metricsPlus.forEach(function (m) {
        var pointsTaxa = [];
        var pointsCount = [];
        var accumTaxa = [];
        var accumCount = 0;

        var _loop = function _loop(week) {
          // Taxa for this week and property (normally a year)
          // Must have at least one non-zero) count to contribute to taxa count
          var weekStats = data.filter(function (d) {
            return d.week === week;
          }).reduce(function (a, d) {
            a.total = a.total + d[m.prop];

            if (!a.taxa.includes(d.taxon) && d[m.prop]) {
              a.taxa.push(d.taxon);
            }

            return a;
          }, {
            total: 0,
            taxa: []
          });
          accumTaxa = _toConsumableArray(new Set([].concat(_toConsumableArray(accumTaxa), _toConsumableArray(weekStats.taxa))));
          accumCount = accumCount + weekStats.total;
          pointsTaxa.push({
            num: weekStats.taxa.length,
            accum: accumTaxa.length,
            week: week
          });
          pointsCount.push({
            num: weekStats.total,
            accum: accumCount,
            week: week
          });
        };

        for (var week = 1; week <= 53; week++) {
          _loop(week);
        }

        if (showTaxa) {
          lineData.push({
            id: "".concat(safeId(m.labelTaxa)),
            key: m.key ? "".concat(m.key, "_taxa") : "".concat(safeId(m.labelTaxa)),
            type: 'taxa',
            label: m.labelTaxa,
            colour: m.colourTaxa,
            style: m.styleTaxa,
            strokeWidth: m.strokeWidth,
            max: Math.max.apply(Math, _toConsumableArray(pointsTaxa.map(function (p) {
              return p.accum;
            }))),
            points: pointsTaxa
          });
        }

        if (showCounts) {
          lineData.push({
            id: "".concat(safeId(m.labelCounts)),
            key: m.key ? "".concat(m.key, "_counts") : "".concat(safeId(m.labelCounts)),
            type: 'count',
            label: m.labelCounts,
            colour: m.colourCounts,
            style: m.styleCounts,
            strokeWidth: m.strokeWidth,
            max: Math.max.apply(Math, _toConsumableArray(pointsCount.map(function (p) {
              return p.accum;
            }))),
            points: pointsCount
          });
        }
      }); // Do the legend

      var legendHeight = makeLegend(lineData); // Value scales

      var xScale = d3.scaleLinear().domain([1, 53]).range([0, width]);
      var yScaleCount, yScaleTaxa;

      if (showCounts) {
        yScaleCount = d3.scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(lineData.filter(function (l) {
          return l.type === 'count';
        }).map(function (l) {
          return l.max;
        })))]).range([height, 0]);
      }

      if (showTaxa) {
        yScaleTaxa = d3.scaleLinear().domain([0, Math.max.apply(Math, _toConsumableArray(lineData.filter(function (l) {
          return l.type === 'taxa';
        }).map(function (l) {
          return l.max;
        })))]).range([height, 0]);
      } // Top axis


      var tAxis;

      if (axisTop === 'on') {
        tAxis = d3.axisTop().scale(xScale).tickValues([]).tickSizeOuter(0);
      } // Bottom axis


      var xAxis;

      if (axisBottom === 'on' || axisBottom === 'tick') {
        xAxis = xAxisMonth(width, axisBottom === 'tick');
      }

      var yScaleRight = swapYaxes ? yScaleTaxa : yScaleCount;
      var yScaleLeft = swapYaxes ? yScaleCount : yScaleTaxa; // Left axis

      var yAxisLeft;

      if (axisLeft === 'on' || axisLeft === 'tick') {
        if (yScaleLeft) {
          yAxisLeft = d3.axisLeft().scale(yScaleLeft).ticks(5);

          if (axisLeft !== 'tick') {
            yAxisLeft.tickValues([]).tickSizeOuter(0);
          } else if (ytype === 'count') {
            yAxisLeft.tickFormat(d3.format("d"));
          }
        } else {
          yAxisLeft = d3.axisLeft().scale(d3.scaleLinear().range([height, 0])).tickValues([]).tickSizeOuter(0);
        }
      } // Right axis


      var yAxisRight;

      if (axisRight === 'on' || axisRight === 'tick') {
        if (yScaleRight) {
          yAxisRight = d3.axisRight().scale(yScaleRight).ticks(5);

          if (axisRight !== 'tick') {
            yAxisRight.tickValues([]).tickSizeOuter(0);
          } else if (ytype === 'count') {
            yAxisRight.tickFormat(d3.format("d"));
          }
        } else {
          yAxisRight = d3.axisRight().scale(d3.scaleLinear().range([height, 0])).tickValues([]).tickSizeOuter(0);
        }
      } // Line path generators


      var lineTaxa;

      if (showTaxa) {
        lineTaxa = d3.line().curve(d3.curveMonotoneX).x(function (d) {
          return xScale(d.week);
        }).y(function (d) {
          return yScaleTaxa(d.accum);
        });
      }

      var lineCount;

      if (showCounts) {
        lineCount = d3.line().curve(d3.curveMonotoneX).x(function (d) {
          return xScale(d.week);
        }).y(function (d) {
          return yScaleCount(d.accum);
        });
      } // Create or get the relevant chart svg


      var init, svgAccum, gAccum;

      if (svgChart.select('.brc-chart-accum').size()) {
        svgAccum = svgChart.select('.brc-chart-accum');
        gAccum = svgAccum.select('.brc-chart-accum-g');
        init = false;
      } else {
        svgAccum = svgChart.append('svg').classed('brc-chart-accum', true);
        gAccum = svgAccum.append('g').classed('brc-chart-accum-g', true);
        init = true;
      } // Create/update the line paths with D3


      var mlines = gAccum.selectAll("path").data(lineData, function (d) {
        return d.key;
      });
      var eLines = mlines.enter().append("path") //.attr("class", d => `accum-path accum-path-${d.id}`)
      .attr("class", function (d) {
        return "accum-path accum-path-".concat(d.key);
      }).attr("d", function (d) {
        var lineGen = d.type === 'taxa' ? lineTaxa : lineCount;
        return lineGen(d.points.map(function (p) {
          return {
            accum: 0,
            week: p.week
          };
        }));
      });
      addEventHandlers(eLines);
      mlines.merge(eLines).transition().duration(duration).attr("d", function (d) {
        var lineGen = d.type === 'taxa' ? lineTaxa : lineCount;
        return lineGen(d.points);
      }).attr("stroke", function (d) {
        return d.colour;
      }).attr("stroke-dasharray", function (d) {
        return d.style === 'dashed' ? '5,5' : '';
      }).attr("stroke-width", function (d) {
        return d.strokeWidth;
      });
      mlines.exit().transition().duration(duration).attr("d", function (d) {
        var lineGen = d.type === 'taxa' ? lineTaxa : lineCount;
        return lineGen(d.points.map(function (p) {
          return {
            accum: 0,
            week: p.week
          };
        }));
      }).remove();

      if (init) {
        var axisLeftPadX = margin.left ? margin.left : 0;
        var axisRightPadX = margin.right ? margin.right : 0;
        var axisBottomPadY = margin.bottom ? margin.bottom : 0;
        var axisTopPadY = margin.top ? margin.top : 0; // Size SVG

        svgAccum.attr('width', width + axisLeftPadX + axisRightPadX).attr('height', height + axisBottomPadY + axisTopPadY + legendHeight); // Position chart

        gAccum.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(legendHeight + axisTopPadY, ")")); // Create axes and position within SVG

        var leftYaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(legendHeight + axisTopPadY, ")");
        var leftYaxisLabelTrans = "translate(".concat(axisLabelFontSize, ",").concat(legendHeight + axisTopPadY + height / 2, ") rotate(270)");
        var rightYaxisTrans = "translate(".concat(axisLeftPadX + width, ", ").concat(legendHeight + axisTopPadY, ")");
        var rightYaxisLabelTrans = "translate(".concat(axisLeftPadX + width + axisRightPadX - axisLabelFontSize, ", ").concat(legendHeight + axisTopPadY + height / 2, ") rotate(90)");

        if (yAxisLeft) {
          var axisLabelClass = swapYaxes ? 'brc-accum-axis-count' : 'brc-accum-axis-taxa';
          var gYaxisLeft = svgAccum.append("g").attr("class", "y-axis y-axis-left").classed(axisLabelClass, true);
          gYaxisLeft.attr("transform", leftYaxisTrans);

          if (!swapYaxes && showTaxa || swapYaxes && showCounts) {
            var axisLeftLabel = swapYaxes ? axisCountLabel : axisTaxaLabel;
            var tYaxisLeftLabel = svgAccum.append("text").classed(axisLabelClass, true).style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
            tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans);
          }
        }

        if (yAxisRight) {
          var _axisLabelClass = swapYaxes ? 'brc-accum-axis-taxa' : 'brc-accum-axis-count';

          var gYaxisCount = svgAccum.append("g").attr("class", "y-axis y-axis-right").classed(_axisLabelClass, true);
          gYaxisCount.attr("transform", rightYaxisTrans);

          if (!swapYaxes && showCounts || swapYaxes && showTaxa) {
            var axisRightLabel = swapYaxes ? axisTaxaLabel : axisCountLabel;
            var tYaxisCountLabel = svgAccum.append("text").classed(_axisLabelClass, true).style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisRightLabel);
            tYaxisCountLabel.attr("transform", rightYaxisLabelTrans);
          }
        }

        if (xAxis) {
          var gXaxis = svgAccum.append("g").attr("class", "x axis").call(xAxis);
          gXaxis.selectAll(".tick text").style("text-anchor", "start").attr("x", 6).attr("y", 6);
          gXaxis.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(legendHeight + axisTopPadY + height, ")"));
        }

        if (tAxis) {
          var gTaxis = svgAccum.append("g").call(tAxis);
          gTaxis.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(legendHeight + axisTopPadY, ")"));
        }
      }

      if (yAxisLeft) {
        svgAccum.select(".y-axis-left").transition().duration(duration).call(yAxisLeft);
      }

      if (yAxisRight) {
        svgAccum.select(".y-axis-right").transition().duration(duration).call(yAxisRight);
      }

      svgChart.attr("width", svgAccum.attr('width'));
      svgChart.attr("height", svgAccum.attr('height'));
      return svgAccum;
    }

    function makeLegend(lineData) {
      var legendWidth = width + margin.left + margin.right;
      var swatchSize = 20;
      var swatchFact = 1.3; // Loop through all the legend elements and work out their positions
      // based on swatch size, item label text size and legend width.

      var metricsReversed = cloneData(lineData).reverse();
      var rows = 0;
      var lineWidth = -swatchSize;
      metricsReversed.forEach(function (m) {
        var tmpText = svgChart.append('text').text(m.label).style('font-size', legendFontSize);
        var widthText = tmpText.node().getBBox().width;
        tmpText.remove();

        if (lineWidth + swatchSize + swatchSize * swatchFact + widthText > legendWidth) {
          ++rows;
          lineWidth = -swatchSize;
        }

        m.x = lineWidth + swatchSize;
        m.y = rows * swatchSize * swatchFact;
        lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText;
      });
      var ls = svgChart.selectAll('.brc-legend-item-rect').data(metricsReversed, function (m) {
        return m.key;
      }).join(function (enter) {
        var path = enter.append("path").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-rect brc-legend-item-".concat(m.key);
        }).attr('d', function (m) {
          return "M ".concat(m.x, " ").concat(m.y + swatchSize / 2, " L ").concat(m.x + swatchSize, " ").concat(m.y + swatchSize / 2);
        });
        return path;
      }).attr('fill', function (m) {
        return m.colour;
      }).attr("stroke", function (m) {
        return m.colour;
      }).attr("stroke-dasharray", function (m) {
        return m.style === 'dashed' ? '5,5' : '';
      }).attr("stroke-width", function (m) {
        return m.strokeWidth;
      });
      var lt = svgChart.selectAll('.brc-legend-item-text').data(metricsReversed, function (m) {
        return m.key;
      }).join(function (enter) {
        var text = enter.append("text").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-text brc-legend-item-".concat(m.key);
        }).style('font-size', legendFontSize);
        return text;
      }).text(function (m) {
        return m.label;
      }).attr('x', function (m) {
        return m.x + swatchSize * swatchFact;
      }).attr('y', function (m) {
        return m.y + legendFontSize * 1;
      });
      addEventHandlers(ls);
      addEventHandlers(lt);
      return swatchSize * swatchFact * (rows + 1);
    }

    function highlightItem(key, type, highlight) {
      // Graph lines
      svgChart.selectAll('.accum-path').classed('lowlight', highlight);
      svgChart.selectAll(".accum-path-".concat(key)).classed('lowlight', false);
      svgChart.selectAll(".accum-path").classed('highlight', false);

      if (key) {
        svgChart.selectAll(".accum-path-".concat(key)).classed('highlight', highlight);
      } // Legend items


      svgChart.selectAll('.brc-legend-item').classed('lowlight', highlight);

      if (key) {
        svgChart.selectAll(".brc-legend-item-".concat(key)).classed('lowlight', false);
      }

      if (key) {
        svgChart.selectAll(".brc-legend-item-".concat(key)).classed('highlight', highlight);
      } else {
        svgChart.selectAll(".brc-legend-item").classed('highlight', false);
      } // Axes and axis labels


      svgChart.selectAll('.brc-accum-axis-taxa, .brc-accum-axis-count').classed('lowlight', highlight);

      if (key) {
        svgChart.selectAll(".brc-accum-axis-".concat(type)).classed('lowlight', false);
      }

      if (key) {
        svgChart.selectAll(".brc-accum-axis-".concat(type)).classed('highlight', highlight);
      } else {
        svgChart.selectAll(".brc-accum-axis-taxa, .brc-accum-axis-count").classed('highlight', false);
      }
    }

    function addEventHandlers(sel) {
      sel.on("mouseover", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d.key, d.type, true);
        }
      }).on("mouseout", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d.key, d.type, false);
        }
      }).on("click", function (d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d.key, d.type, true);
          d3.event.stopPropagation();
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
      * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
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

      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      var remakeChart = false;

      if ('data' in opts) {
        data = opts.data;
        remakeChart = true;
      }

      if ('metrics' in opts) {
        metrics = opts.metrics;
        preProcessMetrics();
        remakeChart = true;
      }

      if (remakeChart) makeChart();
      positionMainElements(svg, expand);
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /**
     * @typedef {Object} api
     * @property {module:accum~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:accum~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:accum~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:accum~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
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
   * @param {number} opts.width - The width of the main chart area in pixels (excludes margins).
   * @param {number} opts.height - The height of the main chart area in pixels (excludes margins).
   * @param {number} opts.radius - The radius of the node in pixels. (Default - 5.)
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
   * @param {string} opts.interactivityLink - Specifies how link interactivity occurs. Can be 'mousemove', 'mouseclick' or 'none'. (Default - 'none'.)
   * @param {number} opts.duration - The duration of each transition phase in milliseconds (when nodes removed). (Default - 1000.)
   * @param {string} opts.backgroundColour - The background colour of the main chart area. Can be set to empty string for none. (Default - empty.)
   * @param {string} opts.taxa1colour - The colour to use for taxa in column taxa1. Can be any valid CSS colour string or 'auto' to specify a colour automatically. (Deafult - 'black'.)
   * @param {string} opts.taxa2colour - The colour to use for taxa in column taxa2. Can be any valid CSS colour string or 'auto' to specify a colour automatically. (Deafult - 'black'.)
   * @param {boolean} opts.overflow - A boolean that indicates whether or not to show graphics that overflow the svg boundary. (Default - true.)
   * @param {boolean} opts.zoom - A boolean that indicates whether or not implement zoom behaviour. (Default - true.)
   * @param {Object} opts.taxonInfoFn - A function called when the user interacts with a taxon node. 
   * Two arguments are passed to the function: the taxon name and a boolean indicating if this was from the field taxon1 in the input data. 
   * If the function returns a non-null value, it is displayed in a tool-tip. If no value is returned, no tool-tip is generated.
   * (Default - null.)
   * @param {Object} opts.linkInfoFn - A function called when the user interacts with a link.
   * Three arguments are passed to the function: the taxon name from the taxon1 property, the taxon name from the taxon2 property,
   * and the data object from the data property. If no value is returned, no tool-tip is generated.
   * If the function returns a non-null value, it is displayed in a tool-tip.
   * (Default - null.)
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon1</b> - the name of a taxon.
   * <li> <b>taxon2</b> - the name of a taxon linked with the taxon specified in taxon1.
   * <li> <b>data</b> - a data object, e.g. with data describing the relationship between taxon1 and taxon2, that will be passed to any
   * function specified in the linkInfoFn parameter.
   * </ul>
   * @returns {module:links~api} api - Returns an API for the chart.
   */

  function links() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'link-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
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
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$overflow = _ref.overflow,
        overflow = _ref$overflow === void 0 ? true : _ref$overflow,
        _ref$zoom = _ref.zoom,
        zoom = _ref$zoom === void 0 ? true : _ref$zoom,
        _ref$interactivityLin = _ref.interactivityLink,
        interactivityLink = _ref$interactivityLin === void 0 ? 'none' : _ref$interactivityLin,
        _ref$backgroundColour = _ref.backgroundColour,
        backgroundColour = _ref$backgroundColour === void 0 ? '' : _ref$backgroundColour,
        _ref$taxa1colour = _ref.taxa1colour,
        taxa1colour = _ref$taxa1colour === void 0 ? 'auto' : _ref$taxa1colour,
        _ref$taxa2colour = _ref.taxa2colour,
        taxa2colour = _ref$taxa2colour === void 0 ? 'black' : _ref$taxa2colour,
        _ref$taxonInfoFn = _ref.taxonInfoFn,
        taxonInfoFn = _ref$taxonInfoFn === void 0 ? null : _ref$taxonInfoFn,
        _ref$linkInfoFn = _ref.linkInfoFn,
        linkInfoFn = _ref$linkInfoFn === void 0 ? null : _ref$linkInfoFn,
        _ref$radius = _ref.radius,
        radius = _ref$radius === void 0 ? 5 : _ref$radius,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data;

    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).attr('class', 'brc-chart-links').style('position', 'relative').style('display', 'inline');
    mainDiv.classed('chart-overflow', overflow); // Define the div for the tooltip

    var popupDiv = d3.select("body").append("div").attr("class", "brc-chart-links-popup").style("opacity", 0);
    var svg = mainDiv.append('svg').style("cursor", zoom ? "move" : null);

    if (backgroundColour) {
      svg.style('background-color', backgroundColour);
    }

    svg.on("click", function () {
      if (interactivityLink === 'mouseclick' && d3.event.srcElement.tagName === 'svg') {
        unhighlightAllLinks();
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart').attr("width", width).attr("height", height);
    var gChart = svgChart.append('g');
    var gLinks = gChart.append('g');
    var gNodes = gChart.append('g');

    if (zoom) {
      svg.call(d3.zoom().scaleExtent([1 / 4, 4]).on('zoom', function () {
        gChart.attr('transform', d3.event.transform);
      }));
    }

    var simulation = d3.forceSimulation();
    var nodes;
    makeChart(data); // Texts must come after chart because 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width"));
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand);

    function makeChart(data) {
      // Make two separate arrays - one for nodes and one for links
      // We are using Set to get unique values and then spread these into an array
      var taxa1 = _toConsumableArray(new Set(data.map(function (d) {
        return d.taxon1;
      })));

      var taxa2 = _toConsumableArray(new Set(data.map(function (d) {
        return d.taxon2;
      })));

      var taxa = [].concat(_toConsumableArray(taxa1), _toConsumableArray(taxa2)); // Good example of modifying force layout here:
      // https://observablehq.com/@d3/modifying-a-force-directed-graph
      // In a force directed layout, the current positions of the nodes is stored
      // within the data objects - NOT the DOM ojbects. So to preserve current
      // position of elements when data is updated, we have to keep previous
      // version of the node object.

      var nodesPrev;

      if (nodes) {
        // Map gives a dictionary that can be used to lookup
        nodesPrev = new Map(nodes.map(function (d) {
          return [d.id, d];
        }));
      }

      nodes = taxa.map(function (t) {
        return {
          id: t,
          t1: taxa1.includes(t)
        };
      });

      if (nodesPrev) {
        // Use previous node where it exists
        nodes = nodes.map(function (d) {
          return Object.assign(nodesPrev.get(d.id) || {}, d);
        });
      }

      var links = data.map(function (d) {
        return {
          key: safeId("".concat(d.taxon1, "-").concat(d.taxon2)),
          source: d.taxon1,
          target: d.taxon2,
          data: d.data
        };
      }); //const simulation = d3.forceSimulation(nodes)

      simulation.nodes(nodes).force("link", d3.forceLink(links).id(function (d) {
        return d.id;
      })).force("charge", d3.forceManyBody().strength(-30)) // default strength is -30 (repel)
      .force("center", d3.forceCenter(width / 2, height / 2));
      simulation.alpha(1).restart();
      var link = gLinks.selectAll(".display-link").data(links, function (d) {
        return d.key;
      }).join(function (enter) {
        return enter.append("line").classed('display-link', true).attr("id", function (d) {
          return d.key;
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.remove();
      });
      var selectLink = gLinks.selectAll(".select-link").data(links, function (d) {
        return d.key;
      }).join(function (enter) {
        return enter.append("line").classed('select-link', true).style("cursor", interactivityLink !== "none" ? "pointer" : "").on("mouseover", function (d) {
          linkHit(d, "mouseover");
        }).on("click", function (d) {
          linkHit(d, "click");
        }).on("mouseout", function (d) {
          linkHitRemove(d);
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.remove();
      });

      function linkHit(d, eventType) {
        if (eventType == "mouseover" && interactivityLink === "mousemove" || eventType == "click" && interactivityLink === "mouseclick") {
          if (eventType == "click") {
            unhighlightAllLinks();
          }

          d3.select(".display-link#".concat(d.key)).classed('highlighted', true);
          d3.select("circle#".concat(safeId(d.source.id))).classed('highlighted', true);
          d3.select("circle#".concat(safeId(d.target.id))).classed('highlighted', true);
          var html = linkInfoFn ? linkInfoFn(d.source.id, d.target.id, d.data) : '';

          if (html) {
            popupDiv.transition().duration(200).style("opacity", 0.9);
            popupDiv.html(html).style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 30 + "px");
          }
        }
      }

      function linkHitRemove(d) {
        if (interactivityLink === "mousemove") {
          d3.select(".display-link#".concat(d.key)).classed('highlighted', false);
          d3.select("circle#".concat(safeId(d.source.id))).classed('highlighted', false);
          d3.select("circle#".concat(safeId(d.target.id))).classed('highlighted', false);
          popupDiv.transition().duration(500).style("opacity", 0);
        }
      }

      var node = gNodes.selectAll("circle").data(nodes, function (d) {
        return d.id;
      }).join(function (enter) {
        return enter.append("circle").attr('id', function (d) {
          return safeId(d.id);
        }).attr("r", radius).attr("x", width / 2).attr("y", height / 2).attr("fill", function (d, i) {
          return getColour(taxa1, taxa2, taxa, d);
        }).style("cursor", "pointer").on("click", function (d) {
          delete d.fx;
          delete d.fy;
          d3.select(this).classed("fixed", false);
          simulation.alpha(1).restart();
        }).on("mouseover", function (d) {
          //gNodes.selectAll('circle').classed("lowlighted", true)
          //d3.select(this).classed("lowlighted", false)
          d3.select(this).classed("highlighted", true);
          highLightLinks(d.id, true);
          var html = taxonInfoFn ? taxonInfoFn(d.id, d.t1) : d.id;

          if (html) {
            popupDiv.transition().duration(200).style("opacity", 0.9);
            popupDiv.html(html).style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 30 + "px");
          }
        }).on("mouseout", function () {
          //gNodes.selectAll('circle').classed("lowlighted", false)
          gLinks.selectAll(".display-link").classed('lowlighted', false);
          d3.select(this).classed("highlighted", false); //highLightLinks(d.id, false)

          popupDiv.transition().duration(500).style("opacity", 0);
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.call(function (exit) {
          return exit.transition().duration(duration).attr("r", 0).remove();
        });
      }).call(drag(simulation));
      simulation.on("tick", function () {
        node.attr("cx", function (d) {
          if (overflow) {
            return d.x;
          } else {
            return d.x; //Restrain to SVG
            //return d.x = Math.max(radius, Math.min(width - radius, d.x))
          }
        }).attr("cy", function (d) {
          if (overflow) {
            return d.y;
          } else {
            return d.y; //Restrain to SVG
            //return d.y = Math.max(radius, Math.min(height - radius, d.y))
          }
        });
        link.attr("x1", function (d) {
          return d.source.x;
        }).attr("y1", function (d) {
          return d.source.y;
        }).attr("x2", function (d) {
          return d.target.x;
        }).attr("y2", function (d) {
          return d.target.y;
        });
        selectLink.attr("x1", function (d) {
          return d.source.x;
        }).attr("y1", function (d) {
          return d.source.y;
        }).attr("x2", function (d) {
          return d.target.x;
        }).attr("y2", function (d) {
          return d.target.y;
        });
      });

      function highLightLinks(id, highlight) {
        var hLinks = links.filter(function (l) {
          return l.source.id === id || l.target.id === id;
        });
        gLinks.selectAll(".display-link").classed('lowlighted', true);
        hLinks.forEach(function (link) {
          //d3.selectAll(`.display-link#${link.key}`).classed('highlighted', highlight)
          d3.selectAll(".display-link#".concat(link.key)).classed('lowlighted', !highlight);
        });
      }
    }

    function getColour(taxa1, taxa2, taxa, d) {
      var iAuto;

      if (taxa1colour === 'auto' && taxa2colour === 'auto') {
        iAuto = taxa.indexOf(d.id);
      } else if (taxa1colour === 'auto') {
        iAuto = taxa1.indexOf(d.id);
      } else if (taxa2colour === 'auto') {
        iAuto = taxa2.indexOf(d.id);
      }

      if (d.t1) {
        if (taxa1colour === 'auto') {
          return autoColour(iAuto);
        } else {
          return taxa1colour;
        }
      } else {
        if (taxa2colour === 'auto') {
          return autoColour(iAuto);
        } else {
          return taxa2colour;
        }
      }

      function autoColour(i) {
        //console.log(i)
        if (!d.colour) {
          if (i < 10) {
            return d3.schemeCategory10[i];
          } else if (i < 18) {
            return d3.schemeDark2[i - 10];
          } else if (i < 26) {
            return d3.schemeAccent[i - 18];
          } else {
            return d3.interpolateSpectral(Math.random());
          }
        }
      }
    }

    function drag(simulation) {
      function dragstart() {
        d3.select(this).classed("fixed", true);
      }

      function dragged() {
        d3.event.subject.fx = clamp(d3.event.x);
        d3.event.subject.fy = clamp(d3.event.y);
        simulation.alpha(1).restart();
      }

      return d3.drag().on("start", dragstart).on("drag", dragged);
    }

    function clamp(x) {
      //return x < lo ? lo : x > hi ? hi : x;
      return x;
    }

    function unhighlightAllLinks() {
      d3.selectAll(".display-link").classed('highlighted', false);
      d3.selectAll("circle").classed('highlighted', false);
      d3.selectAll("circle").classed('highlighted', false);
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
      * @description <b>This function is exposed as a method on the API returned from the links function</b>.
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

      var textWidth = Number(svgChart.attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);

      if ('data' in opts) {
        makeChart(opts.data);
      } //positionElements()


      positionMainElements(svg, expand);
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the links function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the links function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /**
     * @typedef {Object} api
     * @property {module:links~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:links~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:links~setChartOpts} setChartOpts - Sets text options for the chart. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts
    };
  }

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG. (Default - 'body'.)
   * @param {string} opts.elid - The id for the dom object created. (Default - 'trend-chart'.)
   * @param {number} opts.width - The width of each sub-chart area in pixels. (Default - 300.)
   * @param {number} opts.height - The height of the each sub-chart area in pixels. (Default - 200.)
   * @param {Object} opts.margin - An object indicating the margins to add around each sub-chart area.
   * @param {number} opts.margin.left - Left margin in pixels. (Default - 40.)
   * @param {number} opts.margin.right - Right margin in pixels. (Default - 40.)
   * @param {number} opts.margin.top - Top margin in pixels. (Default - 20.)
   * @param {number} opts.margin.bottom - Bottom margin in pixels. (Default - 20.)
   * @param {number} opts.perRow - The number of sub-charts per row. (Default - 2.)
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized. (Default - false.)
   * @param {string} opts.title - Title for the chart. (Default - ''.)
   * @param {string} opts.subtitle - Subtitle for the chart. (Default - ''.)
   * @param {string} opts.footer - Footer for the chart. (Default - ''.)
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title. (Default - 24.)
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title. (Default - 16.)
   * @param {string} opts.footerFontSize - Font size (pixels) of chart title. (Default - 10.)
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph. (Default - true.)
   * @param {boolean} opts.showLegend - Whether or not to show an overall chart legend. (Default - true.)
   * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label. (Default - 10.)
   * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.(Default - true.)
   * @param {string} opts.legendFontSize - Font size (pixels) of legend item text. (Default - 16.)
   * @param {string} opts.axisLeftLabel - Value for labelling left axis. (Default - ''.)
   * @param {string} opts.axisRightLabel - Value for labelling right axis. (Default - ''.)
   * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
   * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. 
   * If set to 'counts' line and ticks drawn for counts scale. If set to 'proportions' line and ticks drawn for proportion scale (0-1). 
   * If set to 'percentages' line and ticks drawn for percentage scale (1-100). Any other value results in no axis. (Default - 'percentages'.)
   * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. 
   * If set to 'counts' line and ticks drawn for counts scale. If set to 'proportions' line and ticks drawn for proportion scale (0-1). 
   * If set to 'percentages' line and ticks drawn for percentage scale (1-100). Any other value results in no axis. (Default - 'counts'.)
   * @param {string} opts.axisTop - If set to 'on' line is drawn otherwise not. (Default - ''.)
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'tick'.)
   * @param {number} opts.duration - The duration of each transition phase in milliseconds. (Default - 1000.)
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'. (Default - 'none'.)
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>year</b> - a four digit number indicating a year.
   * <li> <b>count</b> - a count for the given year. 
   * </ul>
   * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
   * If empty, graphs for all taxa are created. (Default - [].)
   * @param {Array.<string>} opts.group - An array of taxa (names), indicating which taxa comprise the whole group for which proportion stats are calculated. 
   * If empty, all taxa are part of the group from which proportion data is calculated. (Default - [].)
   * @param {number} opts.minYear- Indicates the earliest year to use on the y axis. If left unset, the earliest year in the dataset is used. (Default - null.)
   * @param {number} opts.maxYear- Indicates the latest year to use on the y axis. If left unset, the latest year in the dataset is used. (Default - null.)
   * @param {string} opts.showCounts- Indicates whether or not to plot the actual number of records for each taxon and, if so, the style of chart to use.
   * Can be 'line' for a line graph or 'bar' for a bar chart. Any other value means that the metric will not be plotted. (Default - 'bar'.)
   * @param {string} opts.showProps- Indicates whether or not to plot the proportion of all records in the group accounted for by each taxon and, if so, the style of chart to use.
   * Can be 'line' for a line graph or 'bar' for a bar chart. Any other value means that the metric will not be plotted. (Default - 'line'.)
   * @param {Object} opts.styleCounts - An object specifying the style to use for the count graphic.
   * @param {string} opts.styleCounts.colour - Colour of bars or line (as determined by showCounts property). (Default - 'CornflowerBlue'.)
   * @param {number} opts.styleCounts.strokeWidth - If the showCounts property is set to 'line' then this property indicates the line width. (Default - not set.)
   * @param {number} opts.styleCounts.opacity - The opacity of the lines/bars in the chart. A number between 0 and 1. (Default - 1.)
   * @param {string} opts.styleCounts.legend - Text to use for the counts metric in the legend. (Default - ''.)
   * @param {Object} opts.styleProps - An object specifying the style to use for the proportions/percentage graphic.
   * @param {string} opts.styleProps.colour - Colour of bars or line (as determined by showProps property). (Default - 'black'.)
   * @param {number} opts.styleProps.strokeWidth - If the showProps property is set to 'line' then this property indicates the line width. (Default - 2.)
   * @param {number} opts.styleProps.opacity - The opacity of the lines/bars in the chart. A number between 0 and 1. (Default - 1.)
   * @param {string} opts.styleProps.legend - Text to use for the proportion/percentage metric in the legend. (Default - ''.)
   * @returns {module:trend~api} api - Returns an API for the chart.
   */

  function trend() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'trend-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 30,
      right: 30,
      top: 15,
      bottom: 15
    } : _ref$margin,
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
        footerFontSize = _ref$footerFontSize === void 0 ? 10 : _ref$footerFontSize,
        _ref$legendFontSize = _ref.legendFontSize,
        legendFontSize = _ref$legendFontSize === void 0 ? 16 : _ref$legendFontSize,
        _ref$showLegend = _ref.showLegend,
        showLegend = _ref$showLegend === void 0 ? false : _ref$showLegend,
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? '' : _ref$axisLeftLabel,
        _ref$axisRightLabel = _ref.axisRightLabel,
        axisRightLabel = _ref$axisRightLabel === void 0 ? '' : _ref$axisRightLabel,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$titleAlign = _ref.titleAlign,
        titleAlign = _ref$titleAlign === void 0 ? 'left' : _ref$titleAlign,
        _ref$subtitleAlign = _ref.subtitleAlign,
        subtitleAlign = _ref$subtitleAlign === void 0 ? 'left' : _ref$subtitleAlign,
        _ref$footerAlign = _ref.footerAlign,
        footerAlign = _ref$footerAlign === void 0 ? 'left' : _ref$footerAlign,
        _ref$showTaxonLabel = _ref.showTaxonLabel,
        showTaxonLabel = _ref$showTaxonLabel === void 0 ? true : _ref$showTaxonLabel,
        _ref$taxonLabelFontSi = _ref.taxonLabelFontSize,
        taxonLabelFontSize = _ref$taxonLabelFontSi === void 0 ? 10 : _ref$taxonLabelFontSi,
        _ref$taxonLabelItalic = _ref.taxonLabelItalics,
        taxonLabelItalics = _ref$taxonLabelItalic === void 0 ? false : _ref$taxonLabelItalic,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'counts' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? 'percentages' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$showCounts = _ref.showCounts,
        showCounts = _ref$showCounts === void 0 ? 'bar' : _ref$showCounts,
        _ref$showProps = _ref.showProps,
        showProps = _ref$showProps === void 0 ? 'line' : _ref$showProps,
        _ref$styleCounts = _ref.styleCounts,
        styleCounts = _ref$styleCounts === void 0 ? {
      colour: 'CornflowerBlue',
      opacity: 1
    } : _ref$styleCounts,
        _ref$styleProps = _ref.styleProps,
        styleProps = _ref$styleProps === void 0 ? {
      colour: 'black',
      opacity: 1,
      strokeWidth: 2
    } : _ref$styleProps,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'none' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$taxa = _ref.taxa,
        taxa = _ref$taxa === void 0 ? [] : _ref$taxa,
        _ref$group = _ref.group,
        group = _ref$group === void 0 ? [] : _ref$group,
        _ref$minYear = _ref.minYear,
        minYear = _ref$minYear === void 0 ? null : _ref$minYear,
        _ref$maxYear = _ref.maxYear,
        maxYear = _ref$maxYear === void 0 ? null : _ref$maxYear;

    // Ensure style prop objects have the required properties.
    styleCounts.colour = styleCounts.colour ? styleCounts.colour : 'CornflowerBlue';
    styleCounts.opacity = styleCounts.opacity ? styleCounts.opacity : 1;
    styleCounts.strokeWidth = styleCounts.strokeWidth ? styleCounts.strokeWidth : 2;
    styleProps.colour = styleProps.colour ? styleProps.colour : 'black';
    styleProps.opacity = styleProps.opacity ? styleProps.opacity : 1;
    styleProps.strokeWidth = styleProps.strokeWidth ? styleProps.strokeWidth : 2;
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, false);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart brc-chart-trend');
    makeChart(); // Texts must come after chartbecause 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width"));
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand);

    function makeChart() {
      // Set min and max year from data if not set
      if (!minYear) {
        minYear = Math.min.apply(Math, _toConsumableArray(data.map(function (d) {
          return d.year;
        })));
      }

      if (!maxYear) {
        maxYear = Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
          return d.year;
        })));
      } // If taxa for graphs not set, set to all in dataset


      if (!taxa.length) {
        taxa = data.map(function (d) {
          return d.taxon;
        }).filter(function (v, i, a) {
          return a.indexOf(v) === i;
        });
      } // If group for proportion/percentage data not set, set to all in dataset


      if (!group.length) {
        group = data.map(function (d) {
          return d.taxon;
        }).filter(function (v, i, a) {
          return a.indexOf(v) === i;
        });
      } // Generate object with yearly totals


      var yearTotals = {};
      data.filter(function (d) {
        return group.indexOf(d.taxon) > -1 && d.year >= minYear && d.year <= maxYear;
      }).forEach(function (d) {
        if (yearTotals[d.year]) {
          yearTotals[d.year] = yearTotals[d.year] + d.count;
        } else {
          yearTotals[d.year] = d.count;
        }
      });
      var subChartPad = 10;
      var svgsTaxa = taxa.map(function (t) {
        return makeTrend(t, yearTotals);
      });
      var subChartWidth = Number(svgsTaxa[0].attr("width"));
      var subChartHeight = Number(svgsTaxa[0].attr("height"));
      var legendHeight = showLegend ? makeLegend(perRow * (subChartWidth + subChartPad)) + subChartPad : 0;
      svgsTaxa.forEach(function (svgTaxon, i) {
        var col = i % perRow;
        var row = Math.floor(i / perRow);
        svgTaxon.attr("x", col * (subChartWidth + subChartPad));
        svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight);
      });
      svgChart.attr("width", perRow * (subChartWidth + subChartPad));
      svgChart.attr("height", legendHeight + Math.ceil(svgsTaxa.length / perRow) * (subChartHeight + subChartPad));
    }

    function makeTrend(taxon, yearTotals) {
      // Pre-process data.
      // Filter to named taxon and to min and max year and sort in year order
      // Add max value to each.
      var dataFiltered = data.filter(function (d) {
        return d.taxon === taxon && d.year >= minYear && d.year <= maxYear;
      }).sort(function (a, b) {
        return a.year > b.year ? 1 : -1;
      }); // Set the maximum values for the y axis

      var yMaxProp = Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
        return d.count / yearTotals[d.year];
      })));
      yMaxProp = yMaxProp < 0.005 ? 0.005 : yMaxProp; // Prevents tiny values

      var yMaxCount = Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
        return d.count;
      })));
      yMaxCount = yMaxCount < 5 ? 5 : yMaxCount; // Prevents tiny values
      // Value scales

      var years = [];

      for (var i = minYear; i <= maxYear; i++) {
        years.push(i);
      }

      var xScaleBar = d3.scaleBand().domain(years).range([0, width]).paddingInner(0.1);
      var xScaleLine = d3.scaleLinear().domain([minYear, maxYear]).range([0, width]);
      var yScaleCount = d3.scaleLinear().domain([0, yMaxCount]).range([height, 0]);
      var yScaleProps = d3.scaleLinear().domain([0, yMaxProp]).range([height, 0]); // Top axis

      var tAxis;

      if (axisTop === 'on') {
        tAxis = d3.axisTop().scale(xScaleLine) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0);
      } // Bottom axis


      var bAxis;

      if (axisBottom === 'on' || axisBottom === 'tick') {
        bAxis = xAxisYear(width, axisBottom === 'tick', minYear, maxYear, showCounts === 'bar' || showProps === 'bar');
      }

      var makeXaxis = function makeXaxis(leftRight, axisOpt) {
        var axis, format;
        var d3axis = leftRight === 'left' ? d3.axisLeft() : d3.axisRight();

        switch (axisOpt) {
          case 'on':
            axis = d3axis.scale(yScaleCount).tickValues([]).tickSizeOuter(0);
            break;

          case 'counts':
            axis = d3axis.scale(yScaleCount).ticks(5).tickFormat(d3.format("d"));
            break;

          case 'proportions':
            axis = d3axis.scale(yScaleProps).ticks(5);
            break;

          case 'percentages':
            format = yMaxProp < 0.05 ? d3.format(".1%") : d3.format(".0%");
            axis = d3axis.scale(yScaleProps).ticks(5).tickFormat(format);
            break;
        }

        return axis;
      };

      var lAxis = makeXaxis('left', axisLeft);
      var rAxis = makeXaxis('right', axisRight); // Create or get the relevant chart svg

      var init, svgTrend, gTrend;

      if (taxa.length === 1 && svgChart.selectAll('.brc-chart-trend').size() === 1) {
        svgTrend = svgChart.select('.brc-chart-trend');
        gTrend = svgTrend.select('.brc-chart-trend-g');
        init = false;
      } else if (svgChart.select("#".concat(safeId(taxon))).size()) {
        svgTrend = svgChart.select("#".concat(safeId(taxon)));
        gTrend = svgTrend.select('.brc-chart-trend-g');
        init = false;
      } else {
        svgTrend = svgChart.append('svg').classed('brc-chart-trend', true).attr('id', safeId(taxon));
        gTrend = svgTrend.append('g').classed('brc-chart-trend-g', true);
        init = true;
      } // Line path generators


      var lineCounts = d3.line().curve(d3.curveMonotoneX).x(function (d) {
        return xScaleLine(d.year);
      }).y(function (d) {
        return yScaleCount(d.n);
      });
      var lineProps = d3.line().curve(d3.curveMonotoneX).x(function (d) {
        return xScaleLine(d.year);
      }).y(function (d) {
        return yScaleProps(d.n);
      });
      var chartLines = [];
      var dataDict = dataFiltered.reduce(function (a, d) {
        a[d.year] = d.count;
        return a;
      }, {});

      if (showCounts === 'line') {
        chartLines.push({
          lineGen: lineCounts,
          colour: styleCounts.colour,
          opacity: styleCounts.opacity,
          strokeWidth: styleCounts.strokeWidth,
          type: 'counts',
          points: years.map(function (y) {
            return {
              year: y,
              n: dataDict[y] ? dataDict[y] : 0
            };
          })
        });
      }

      if (showProps === 'line') {
        chartLines.push({
          lineGen: lineProps,
          colour: styleProps.colour,
          opacity: styleProps.opacity,
          strokeWidth: styleProps.strokeWidth,
          type: 'props',
          points: years.map(function (y) {
            return {
              year: y,
              n: dataDict[y] ? dataDict[y] / yearTotals[y] : 0
            };
          })
        });
      }

      var chartBars = [];

      if (showCounts === 'bar') {
        var bars = dataFiltered.map(function (d) {
          return {
            yScale: yScaleCount,
            colour: styleCounts.colour,
            opacity: styleCounts.opacity,
            type: 'counts',
            year: d.year,
            n: yScaleCount(d.count)
          };
        });
        chartBars = [].concat(_toConsumableArray(chartBars), _toConsumableArray(bars));
      }

      if (showProps === 'bar') {
        var _bars = dataFiltered.map(function (d) {
          return {
            yScale: yScaleProps,
            colour: styleProps.colour,
            opacity: styleProps.opacity,
            type: 'props',
            year: d.year,
            n: yScaleProps(d.count / yearTotals[d.year])
          };
        });

        chartBars = [].concat(_toConsumableArray(chartBars), _toConsumableArray(_bars));
      }

      var t = svgTrend.transition().duration(duration);
      gTrend.selectAll("rect").data(chartBars, function (d) {
        return "props-".concat(d.year);
      }).join(function (enter) {
        return enter.append("rect").attr("class", function (d) {
          return "trend-type-".concat(d.type);
        }).attr('width', xScaleBar.bandwidth()).attr('height', 0).attr('fill', function (d) {
          return d.colour;
        }).attr('opacity', function (d) {
          return d.opacity;
        }).attr('y', height).attr('x', function (d) {
          return xScaleBar(d.year);
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.call(function (exit) {
          return exit.transition(t).attr('height', 0).attr('y', height).remove();
        });
      }).transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr('y', function (d) {
        return d.n;
      }).attr('height', function (d) {
        return height - d.n;
      }).attr("fill", function (d) {
        return d.colour;
      });
      gTrend.selectAll("path").data(chartLines, function (d) {
        return d.type;
      }).join(function (enter) {
        return enter.append("path").attr("class", function (d) {
          return "trend-type-".concat(d.type);
        }).attr("opacity", function (d) {
          return d.opacity;
        }).attr("stroke", function (d) {
          return d.colour;
        }).attr("stroke-width", function (d) {
          return d.strokeWidth;
        }).attr("d", function (d) {
          return d.lineGen(d.points.map(function (p) {
            return {
              n: 0,
              year: p.year
            };
          }));
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.call(function (exit) {
          return exit.transition(t).attr("d", function (d) {
            return d.lineGen(d.points.map(function (p) {
              return {
                n: 0,
                year: p.year
              };
            }));
          }).remove();
        });
      }).transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", function (d) {
        return d.lineGen(d.points);
      });
      addEventHandlers(gTrend.selectAll("path"), 'type');
      addEventHandlers(gTrend.selectAll("rect"), 'type');

      if (init) {
        // Constants for positioning
        var axisLeftPadX = margin.left ? margin.left : 0;
        var axisRightPadX = margin.right ? margin.right : 0;
        var axisBottomPadY = margin.bottom ? margin.bottom : 0;
        var axisTopPadY = margin.top ? margin.top : 0; // Taxon title

        if (showTaxonLabel) {
          var taxonLabel = svgTrend.append('text').classed('brc-chart-trend-label', true).text(taxon).style('font-size', taxonLabelFontSize).style('font-style', taxonLabelItalics ? 'italic' : '');
          var labelHeight = taxonLabel.node().getBBox().height;
          taxonLabel.attr("transform", "translate(".concat(axisLeftPadX, ", ").concat(labelHeight, ")"));
        } // Size SVG


        svgTrend.attr('width', width + axisLeftPadX + axisRightPadX).attr('height', height + axisBottomPadY + axisTopPadY); // Position chart

        gTrend.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")")); // Create axes and position within SVG

        var leftYaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")");
        var leftYaxisLabelTrans = "translate(".concat(axisLabelFontSize, ",").concat(axisTopPadY + height / 2, ") rotate(270)");
        var rightYaxisTrans = "translate(".concat(axisLeftPadX + width, ", ").concat(axisTopPadY, ")");
        var rightYaxisLabelTrans = "translate(".concat(axisLeftPadX + width + axisRightPadX - axisLabelFontSize, ", ").concat(axisTopPadY + height / 2, ") rotate(90)");
        var topXaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")");
        var bottomXaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY + height, ")"); // Create axes and position within SVG

        if (lAxis) {
          var gLaxis = svgTrend.append("g").attr("class", "l-axis").classed('trend-type-counts', axisLeft === 'counts').classed('trend-type-props', axisLeft !== 'counts');
          gLaxis.attr("transform", leftYaxisTrans);
        }

        if (bAxis) {
          var gBaxis = svgTrend.append("g").attr("class", "x axis").call(bAxis);
          gBaxis.attr("transform", bottomXaxisTrans);
        }

        if (tAxis) {
          var gTaxis = svgTrend.append("g").call(tAxis);
          gTaxis.attr("transform", topXaxisTrans);
        }

        if (rAxis) {
          var gRaxis = svgTrend.append("g") //.call(rAxis)
          .attr("class", "r-axis").classed('trend-type-counts', axisRight === 'counts').classed('trend-type-props', axisRight !== 'counts');
          gRaxis.attr("transform", rightYaxisTrans);
        }

        var tYaxisLeftLabel = svgTrend.append("text").classed('trend-type-counts', axisLeft === 'counts').classed('trend-type-props', axisLeft !== 'counts').style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
        tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans);
        var tYaxisRightLabel = svgTrend.append("text").classed('trend-type-counts', axisRight === 'counts').classed('trend-type-props', axisRight !== 'counts').style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisRightLabel);
        tYaxisRightLabel.attr("transform", rightYaxisLabelTrans);
      } else if (taxa.length === 1) {
        // Update taxon label
        if (showTaxonLabel) {
          svgTrend.select('.brc-chart-trend-label').text(taxon);
        }
      }

      if (svgTrend.selectAll(".l-axis").size()) {
        svgTrend.select(".l-axis").transition().duration(duration).call(lAxis);
      }

      if (svgTrend.selectAll(".r-axis").size()) {
        svgTrend.select(".r-axis").transition().duration(duration).call(rAxis);
      }

      return svgTrend;
    }

    function makeLegend(legendWidth) {
      var swatchSize = 20;
      var swatchFact = 1.3;
      var items = [];

      if (showCounts === 'line' || showCounts === 'bar') {
        items.push({
          colour: styleCounts.colour,
          opacity: styleCounts.opacity,
          graphic: showCounts,
          text: styleCounts.legend,
          type: 'counts'
        });
      }

      if (showProps === 'line' || showProps === 'bar') {
        items.push({
          colour: styleProps.colour,
          opacity: styleProps.opacity,
          graphic: showProps,
          text: styleProps.legend,
          type: 'props'
        });
      } // Loop through all the legend elements and work out their
      // positions based on swatch size, item label text size and
      // legend width.


      var rows = 0;
      var lineWidth = -swatchSize;
      items.forEach(function (i) {
        var tmpText = svgChart.append('text').text(i.text).style('font-size', legendFontSize);
        var widthText = tmpText.node().getBBox().width;
        tmpText.remove();

        if (lineWidth + swatchSize + swatchSize * swatchFact + widthText > legendWidth) {
          ++rows;
          lineWidth = -swatchSize;
        }

        i.x = lineWidth + swatchSize;
        i.y = rows * swatchSize * swatchFact;
        lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText;
      }); // Legend does not need to be recreated if it already exists

      if (!svgChart.selectAll('.brc-legend-item').size()) {
        var ls = svgChart.selectAll('.brc-legend-item-rect').data(items, function (i) {
          return safeId(i.label);
        }).join(function (enter) {
          var rect = enter.append("rect") //.attr("class", i=> `brc-legend-item brc-legend-item-rect brc-legend-item-${gen.safeId(i.label)}`)
          .attr('class', function (i) {
            return "brc-legend-item trend-type-".concat(i.type);
          }).attr('width', swatchSize).attr('height', function (i) {
            return i.graphic === 'bar' ? swatchSize / 2 : 2;
          });
          return rect;
        }).attr('x', function (i) {
          return i.x;
        }).attr('y', function (i) {
          return i.graphic === 'bar' ? i.y + legendFontSize - swatchSize / 2 : i.y + legendFontSize - 2;
        }).attr('fill', function (i) {
          return i.colour;
        }).attr('opacity', function (i) {
          return i.opacity;
        });
        var lt = svgChart.selectAll('.brc-legend-item-text').data(items, function (i) {
          return safeId(i.label);
        }).join(function (enter) {
          var text = enter.append("text") //.attr("class", i=> `brc-legend-item brc-legend-item-text brc-legend-item-${gen.safeId(i.label)}`)
          .attr('class', function (i) {
            return "brc-legend-item trend-type-".concat(i.type);
          }).text(function (i) {
            return i.text;
          }).style('font-size', legendFontSize);
          return text;
        }).attr('x', function (i) {
          return i.x + swatchSize * swatchFact;
        }).attr('y', function (i) {
          return i.y + legendFontSize * 1;
        });
        addEventHandlers(ls, 'type');
        addEventHandlers(lt, 'type');
      }

      return swatchSize * swatchFact * (rows + 1);
    }

    function highlightItem(id, highlight) {
      svgChart.selectAll('.trend-type-counts,.trend-type-props').classed('lowlight', false);

      if (highlight) {
        svgChart.selectAll('.trend-type-counts,.trend-type-props').classed('lowlight', true);
        svgChart.selectAll(".trend-type-".concat(id)).classed('lowlight', false);
      }
    }

    function addEventHandlers(sel, prop) {
      sel.on("mouseover", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d[prop], true);
        }
      }).on("mouseout", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d[prop], false);
        }
      }).on("click", function (d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d[prop], true);
          d3.event.stopPropagation();
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
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @description <b>This function is exposed as a method on the API returned from the trend function</b>.
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

      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      var remakeChart = false;

      if ('data' in opts) {
        data = opts.data;
        remakeChart = true;
      }

      if (remakeChart) makeChart();
      positionMainElements(svg, expand);
    }
    /** @function setTaxon
      * @param {string} opts.taxon - The taxon to display.
      * @description <b>This function is exposed as a method on the API returned from the trend function</b>.
      * For single species charts, this allows you to change the taxon displayed.
      */


    function setTaxon(taxon) {
      if (taxa.length !== 1) {
        console.log("You can only use the setTaxon method when your chart displays a single taxon.");
      } else {
        taxa = [taxon];
        highlightItem(null, false);
        makeChart();
      }
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the trend function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the trend function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /**
     * @typedef {Object} api
     * @property {module:trend~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:trend~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:trend~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:trend~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon
    };
  }

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG. (Default - 'body'.)
   * @param {string} opts.elid - The id for the dom object created. (Default - 'yearly-chart'.)
   * @param {number} opts.width - The width of each sub-chart area in pixels. (Default - 300.)
   * @param {number} opts.height - The height of the each sub-chart area in pixels. (Default - 200.)
   * @param {Object} opts.margin - An object indicating the margins to add around each sub-chart area.
   * @param {number} opts.margin.left - Left margin in pixels. (Default - 40.)
   * @param {number} opts.margin.right - Right margin in pixels. (Default - 40.)
   * @param {number} opts.margin.top - Top margin in pixels. (Default - 20.)
   * @param {number} opts.margin.bottom - Bottom margin in pixels. (Default - 20.)
   * @param {number} opts.perRow - The number of sub-charts per row. (Default - 2.)
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized. (Default - false.)
   * @param {string} opts.title - Title for the chart. (Default - ''.)
   * @param {string} opts.subtitle - Subtitle for the chart. (Default - ''.)
   * @param {string} opts.footer - Footer for the chart. (Default - ''.)
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title. (Default - 24.)
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart title. (Default - 16.)
   * @param {string} opts.footerFontSize - Font size (pixels) of chart title. (Default - 10.)
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph. (Default - true.)
   * @param {boolean} opts.showLegend - Whether or not to show an overall chart legend. (Default - true.)
   * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label. (Default - 10.)
   * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.(Default - true.)
   * @param {string} opts.legendFontSize - Font size (pixels) of legend item text. (Default - 16.)
   * @param {string} opts.axisLeftLabel - Value for labelling left axis. (Default - ''.)
   * @param {string} opts.axisRightLabel - Value for labelling right axis. (Default - ''.)
   * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
   * @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. 
   * If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'count'.)
   * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. 
   * If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - ''.)
   * @param {string} opts.axisTop - If set to 'on' line is drawn otherwise not. (Default - ''.)
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'tick'.)
   * @param {number} opts.duration - The duration of each transition phase in milliseconds. (Default - 1000.)
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'. (Default - 'none'.)
   * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
   * data for which graphics should be generated on the chart.
   * Each of the objects in the data array can be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>prop</b> - the name of the numeric property in the data (count properties - 'c1' or 'c2' in the example below).
   * <li> <b>label</b> - a label for this metric. (Optional - the default label will be the property name.)
   * <li> <b>colour</b> - optional colour to give the graphic for this metric. Any accepted way of 
   * specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
   * (Optional - default is 'blue'.)
   * <li> <b>opacity</b> - optional opacity to give the graphic for this metric. 
   * (Optional - default is 0.5.)
   * <li> <b>linewidth</b> - optional width of line for line for this metric if displayed as a line graph. 
   * (Optional - default is 1.)
   * </ul>
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>year</b> - a four digit number indicating a year.
   * <li> <b>c1</b> - a count for a given time year (can have any name). 
   * <li> <b>c2</b> - a count for a given time year (can have any name).
   * ... - there must be at leas one count column, but there can be any number of them.
   * </ul>
   * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
   * If empty, graphs for all taxa are created. (Default - [].)

   * @param {number} opts.minYear- Indicates the earliest year to use on the y axis. If left unset, the earliest year in the dataset is used. (Default - null.)
   * @param {number} opts.maxYear- Indicates the latest year to use on the y axis. If left unset, the latest year in the dataset is used. (Default - null.)
   * @returns {module:yearly~api} api - Returns an API for the chart.
   */

  function yearly() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'yearly-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 30,
      right: 30,
      top: 15,
      bottom: 20
    } : _ref$margin,
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
        footerFontSize = _ref$footerFontSize === void 0 ? 10 : _ref$footerFontSize,
        _ref$legendFontSize = _ref.legendFontSize,
        legendFontSize = _ref$legendFontSize === void 0 ? 16 : _ref$legendFontSize,
        _ref$showLegend = _ref.showLegend,
        showLegend = _ref$showLegend === void 0 ? false : _ref$showLegend,
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? '' : _ref$axisLeftLabel,
        _ref$axisRightLabel = _ref.axisRightLabel,
        axisRightLabel = _ref$axisRightLabel === void 0 ? '' : _ref$axisRightLabel,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$titleAlign = _ref.titleAlign,
        titleAlign = _ref$titleAlign === void 0 ? 'left' : _ref$titleAlign,
        _ref$subtitleAlign = _ref.subtitleAlign,
        subtitleAlign = _ref$subtitleAlign === void 0 ? 'left' : _ref$subtitleAlign,
        _ref$footerAlign = _ref.footerAlign,
        footerAlign = _ref$footerAlign === void 0 ? 'left' : _ref$footerAlign,
        _ref$showTaxonLabel = _ref.showTaxonLabel,
        showTaxonLabel = _ref$showTaxonLabel === void 0 ? true : _ref$showTaxonLabel,
        _ref$taxonLabelFontSi = _ref.taxonLabelFontSize,
        taxonLabelFontSize = _ref$taxonLabelFontSi === void 0 ? 10 : _ref$taxonLabelFontSi,
        _ref$taxonLabelItalic = _ref.taxonLabelItalics,
        taxonLabelItalics = _ref$taxonLabelItalic === void 0 ? false : _ref$taxonLabelItalic,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'tick' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$showCounts = _ref.showCounts,
        showCounts = _ref$showCounts === void 0 ? 'bar' : _ref$showCounts,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'none' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$taxa = _ref.taxa,
        taxa = _ref$taxa === void 0 ? [] : _ref$taxa,
        _ref$metrics = _ref.metrics,
        metrics = _ref$metrics === void 0 ? [] : _ref$metrics,
        _ref$minYear = _ref.minYear,
        minYear = _ref$minYear === void 0 ? null : _ref$minYear,
        _ref$maxYear = _ref.maxYear,
        maxYear = _ref$maxYear === void 0 ? null : _ref$maxYear;

    var metricsPlus;
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, false);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart brc-chart-yearly');
    preProcessMetrics();
    makeChart(); // Texts must come after chartbecause 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width"));
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand);

    function makeChart() {
      // Set min and max year from data if not set
      if (!minYear) {
        minYear = Math.min.apply(Math, _toConsumableArray(data.map(function (d) {
          return d.year;
        })));
      }

      if (!maxYear) {
        maxYear = Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
          return d.year;
        })));
      } // If taxa for graphs not set, set to all in dataset


      if (!taxa.length) {
        taxa = data.map(function (d) {
          return d.taxon;
        }).filter(function (v, i, a) {
          return a.indexOf(v) === i;
        });
      }

      var subChartPad = 10;
      var svgsTaxa = taxa.map(function (t) {
        return makeYearly(t);
      });
      var subChartWidth = Number(svgsTaxa[0].attr("width"));
      var subChartHeight = Number(svgsTaxa[0].attr("height"));
      var legendHeight = showLegend ? makeLegend(perRow * (subChartWidth + subChartPad)) + subChartPad : 0;
      svgsTaxa.forEach(function (svgTaxon, i) {
        var col = i % perRow;
        var row = Math.floor(i / perRow);
        svgTaxon.attr("x", col * (subChartWidth + subChartPad));
        svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight);
      });
      svgChart.attr("width", perRow * (subChartWidth + subChartPad));
      svgChart.attr("height", legendHeight + Math.ceil(svgsTaxa.length / perRow) * (subChartHeight + subChartPad));
    }

    function preProcessMetrics() {
      // Look for 'fading' colour in taxa and colour appropriately 
      // in fading shades of grey.
      var iFading = 0;
      metricsPlus = metrics.map(function (m) {
        var iFade, strokeWidth;

        if (m.colour === 'fading') {
          iFade = ++iFading;
          strokeWidth = 1;
        } else {
          strokeWidth = m.linewidth ? m.linewidth : 2;
        }

        return {
          prop: m.prop,
          label: m.label ? m.label : m.prop,
          opacity: m.opacity ? m.opacity : 0.5,
          colour: m.colour ? m.colour : 'blue',
          fading: iFade,
          strokeWidth: strokeWidth
        };
      }).reverse();
      var grey = d3.scaleLinear().range(['#808080', '#E0E0E0']).domain([1, iFading]);
      metricsPlus.forEach(function (m) {
        if (m.fading) {
          m.colour = grey(m.fading);
        }
      });
    }

    function makeYearly(taxon) {
      // Pre-process data.
      // Filter to named taxon and to min and max year and sort in year order
      // Add max value to each.
      var dataFiltered = data.filter(function (d) {
        return d.taxon === taxon && d.year >= minYear && d.year <= maxYear;
      }).sort(function (a, b) {
        return a.year > b.year ? 1 : -1;
      }); // Set the maximum values for the y axis

      var maxCounts = metricsPlus.map(function (m) {
        return Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
          return d[m.prop];
        })));
      });
      var yMaxCount = Math.max.apply(Math, _toConsumableArray(maxCounts));
      yMaxCount = yMaxCount < 5 ? 5 : yMaxCount; // Prevents tiny values
      // Value scales

      var years = [];

      for (var i = minYear; i <= maxYear; i++) {
        years.push(i);
      }

      var xScaleBar = d3.scaleBand().domain(years).range([0, width]).paddingInner(0.1);
      var xScaleLine = d3.scaleLinear().domain([minYear, maxYear]).range([0, width]);
      var yScaleCount = d3.scaleLinear().domain([0, yMaxCount]).range([height, 0]); // Top axis

      var tAxis;

      if (axisTop === 'on') {
        tAxis = d3.axisTop().scale(xScaleLine) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0);
      } // Bottom axis


      var bAxis;

      if (axisBottom === 'on' || axisBottom === 'tick') {
        bAxis = xAxisYear(width, axisBottom === 'tick', minYear, maxYear, showCounts === 'bar');
      }

      var makeXaxis = function makeXaxis(leftRight, axisOpt) {
        var axis;
        var d3axis = leftRight === 'left' ? d3.axisLeft() : d3.axisRight();

        switch (axisOpt) {
          case 'on':
            axis = d3axis.scale(yScaleCount).tickValues([]).tickSizeOuter(0);
            break;

          case 'tick':
            axis = d3axis.scale(yScaleCount).ticks(5).tickFormat(d3.format("d"));
            break;
        }

        return axis;
      };

      var lAxis = makeXaxis('left', axisLeft);
      var rAxis = makeXaxis('right', axisRight); // Create or get the relevant chart svg

      var init, svgYearly, gYearly;

      if (taxa.length === 1 && svgChart.selectAll('.brc-chart-yearly').size() === 1) {
        svgYearly = svgChart.select('.brc-chart-yearly');
        gYearly = svgYearly.select('.brc-chart-yearly-g');
        init = false;
      } else if (svgChart.select("#".concat(safeId(taxon))).size()) {
        svgYearly = svgChart.select("#".concat(safeId(taxon)));
        gYearly = svgYearly.select('.brc-chart-yearly-g');
        init = false;
      } else {
        svgYearly = svgChart.append('svg').classed('brc-chart-yearly', true).attr('id', safeId(taxon));
        gYearly = svgYearly.append('g').classed('brc-chart-yearly-g', true);
        init = true;
      } // Line path generators


      var lineCounts = d3.line().curve(d3.curveMonotoneX).x(function (d) {
        return xScaleLine(d.year);
      }).y(function (d) {
        return yScaleCount(d.n);
      });
      var chartLines = [];
      var chartBars = [];
      metricsPlus.forEach(function (m) {
        var dataDict = dataFiltered.reduce(function (a, d) {
          a[d.year] = d[m.prop];
          return a;
        }, {});

        if (showCounts === 'line') {
          chartLines.push({
            lineGen: lineCounts,
            colour: m.colour,
            opacity: m.opacity,
            strokeWidth: m.strokeWidth,
            type: 'counts',
            prop: m.prop,
            points: years.map(function (y) {
              return {
                year: y,
                n: dataDict[y] ? dataDict[y] : 0
              };
            })
          });
        }

        if (showCounts === 'bar') {
          var bars = dataFiltered.map(function (d) {
            return {
              yScale: yScaleCount,
              colour: m.colour,
              opacity: m.opacity,
              type: 'counts',
              prop: m.prop,
              year: d.year,
              n: yScaleCount(d[m.prop])
            };
          });
          chartBars = [].concat(_toConsumableArray(chartBars), _toConsumableArray(bars));
        }
      });
      var t = svgYearly.transition().duration(duration);
      gYearly.selectAll("rect").data(chartBars, function (d) {
        return "props-".concat(d.year);
      }).join(function (enter) {
        return enter.append("rect").attr("class", function (d) {
          return "yearly-graphic yearly-".concat(d.prop);
        }).attr('width', xScaleBar.bandwidth()).attr('height', 0).attr('fill', function (d) {
          return d.colour;
        }).attr('opacity', function (d) {
          return d.opacity;
        }).attr('y', height).attr('x', function (d) {
          return xScaleBar(d.year);
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.call(function (exit) {
          return exit.transition(t).attr('height', 0).attr('y', height).remove();
        });
      }).transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr('y', function (d) {
        return d.n;
      }).attr('height', function (d) {
        return height - d.n;
      }).attr("fill", function (d) {
        return d.colour;
      });
      gYearly.selectAll("path").data(chartLines, function (d) {
        return d.type;
      }).join(function (enter) {
        return enter.append("path").attr("class", function (d) {
          return "yearly-graphic yearly-".concat(d.prop);
        }).attr("opacity", function (d) {
          return d.opacity;
        }).attr("stroke", function (d) {
          return d.colour;
        }).attr("stroke-width", function (d) {
          return d.strokeWidth;
        }).attr("d", function (d) {
          return d.lineGen(d.points.map(function (p) {
            return {
              n: 0,
              year: p.year
            };
          }));
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.call(function (exit) {
          return exit.transition(t).attr("d", function (d) {
            return d.lineGen(d.points.map(function (p) {
              return {
                n: 0,
                year: p.year
              };
            }));
          }).remove();
        });
      }).transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", function (d) {
        return d.lineGen(d.points);
      });
      addEventHandlers(gYearly.selectAll("path"), 'prop');
      addEventHandlers(gYearly.selectAll("rect"), 'prop');

      if (init) {
        // Constants for positioning
        var axisLeftPadX = margin.left ? margin.left : 0;
        var axisRightPadX = margin.right ? margin.right : 0;
        var axisBottomPadY = margin.bottom ? margin.bottom : 0;
        var axisTopPadY = margin.top ? margin.top : 0; // Taxon title

        if (showTaxonLabel) {
          var taxonLabel = svgYearly.append('text').classed('brc-chart-yearly-label', true).text(taxon).style('font-size', taxonLabelFontSize).style('font-style', taxonLabelItalics ? 'italic' : '');
          var labelHeight = taxonLabel.node().getBBox().height;
          taxonLabel.attr("transform", "translate(".concat(axisLeftPadX, ", ").concat(labelHeight, ")"));
        } // Size SVG


        svgYearly.attr('width', width + axisLeftPadX + axisRightPadX).attr('height', height + axisBottomPadY + axisTopPadY); // Position chart

        gYearly.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")")); // Create axes and position within SVG

        var leftYaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")");
        var leftYaxisLabelTrans = "translate(".concat(axisLabelFontSize, ",").concat(axisTopPadY + height / 2, ") rotate(270)");
        var rightYaxisTrans = "translate(".concat(axisLeftPadX + width, ", ").concat(axisTopPadY, ")");
        var rightYaxisLabelTrans = "translate(".concat(axisLeftPadX + width + axisRightPadX - axisLabelFontSize, ", ").concat(axisTopPadY + height / 2, ") rotate(90)");
        var topXaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")");
        var bottomXaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY + height, ")"); // Create axes and position within SVG

        if (lAxis) {
          var gLaxis = svgYearly.append("g").attr("class", "l-axis"); // .classed('yearly-type-counts',  axisLeft === 'tick')
          // .classed('yearly-type-props',  axisLeft !== 'tick')

          gLaxis.attr("transform", leftYaxisTrans);
        }

        if (bAxis) {
          var gBaxis = svgYearly.append("g").attr("class", "x axis").call(bAxis);
          gBaxis.attr("transform", bottomXaxisTrans);
        }

        if (tAxis) {
          var gTaxis = svgYearly.append("g").call(tAxis);
          gTaxis.attr("transform", topXaxisTrans);
        }

        if (rAxis) {
          var gRaxis = svgYearly.append("g") //.call(rAxis)
          .attr("class", "r-axis"); // .classed('yearly-type-counts',  axisRight === 'tick')
          // .classed('yearly-type-props',  axisRight !== 'tick')

          gRaxis.attr("transform", rightYaxisTrans);
        }

        var tYaxisLeftLabel = svgYearly.append("text") // .classed('yearly-type-counts',  axisLeft === 'tick')
        // .classed('yearly-type-props',  axisLeft !== 'tick')
        .style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
        tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans);
        var tYaxisRightLabel = svgYearly.append("text") // .classed('yearly-type-counts',  axisRight === 'tick')
        // .classed('yearly-type-props',  axisRight !== 'tick')
        .style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisRightLabel);
        tYaxisRightLabel.attr("transform", rightYaxisLabelTrans);
      } else if (taxa.length === 1) {
        // Update taxon label
        if (showTaxonLabel) {
          svgYearly.select('.brc-chart-yearly-label').text(taxon);
        }
      }

      if (svgYearly.selectAll(".l-axis").size()) {
        svgYearly.select(".l-axis").transition().duration(duration).call(lAxis);
      }

      if (svgYearly.selectAll(".r-axis").size()) {
        svgYearly.select(".r-axis").transition().duration(duration).call(rAxis);
      }

      return svgYearly;
    }

    function makeLegend(legendWidth) {
      var swatchSize = 15;
      var swatchFact = 1.3; // Loop through all the legend elements and work out their
      // positions based on swatch size, item label text size and
      // legend width.

      var metricsReversed = cloneData(metricsPlus).reverse();
      var rows = 0;
      var lineWidth = -swatchSize;
      metricsReversed.forEach(function (m) {
        var tmpText = svgChart.append('text') //.style('display', 'none')
        .text(m.label).style('font-size', legendFontSize);
        var widthText = tmpText.node().getBBox().width;
        tmpText.remove();

        if (lineWidth + swatchSize + swatchSize * swatchFact + widthText > legendWidth) {
          ++rows;
          lineWidth = -swatchSize;
        }

        m.x = lineWidth + swatchSize;
        m.y = rows * swatchSize * swatchFact;
        lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText;
      });
      var ls = svgChart.selectAll('.brc-legend-item-rect').data(metricsReversed, function (m) {
        return safeId(m.label);
      }).join(function (enter) {
        var rect = enter.append("rect").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-rect yearly-graphic yearly-".concat(m.prop);
        }).attr('width', swatchSize).attr('height', showCounts === 'bar' ? swatchSize : 2);
        return rect;
      }).attr('x', function (m) {
        return m.x;
      }).attr('y', function (m) {
        return showCounts === 'bar' ? m.y + swatchSize / 5 : m.y + swatchSize / 2;
      }).attr('fill', function (m) {
        return m.colour;
      });
      var lt = svgChart.selectAll('.brc-legend-item-text').data(metricsReversed, function (m) {
        return safeId(m.label);
      }).join(function (enter) {
        var text = enter.append("text").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-text yearly-graphic yearly-".concat(m.prop);
        }).text(function (m) {
          return m.label;
        }).style('font-size', legendFontSize);
        return text;
      }).attr('x', function (m) {
        return m.x + swatchSize * swatchFact;
      }).attr('y', function (m) {
        return m.y + legendFontSize * 1;
      });
      addEventHandlers(ls, 'prop');
      addEventHandlers(lt, 'prop');
      return swatchSize * swatchFact * (rows + 1);
    }

    function highlightItem(id, highlight) {
      svgChart.selectAll('.yearly-graphic').classed('lowlight', false);

      if (highlight) {
        svgChart.selectAll('.yearly-graphic').classed('lowlight', true);
        svgChart.selectAll(".yearly-".concat(id)).classed('lowlight', false);
      }
    }

    function addEventHandlers(sel, prop) {
      sel.on("mouseover", function (d) {
        if (interactivity === 'mousemove') {
          console.log(d);
          highlightItem(d[prop], true);
        }
      }).on("mouseout", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d[prop], false);
        }
      }).on("click", function (d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d[prop], true);
          d3.event.stopPropagation();
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
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
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

      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      var remakeChart = false;

      if ('data' in opts) {
        data = opts.data;
        remakeChart = true;
      }

      if (remakeChart) makeChart();
      positionMainElements(svg, expand);
    }
    /** @function setTaxon
      * @param {string} opts.taxon - The taxon to display.
      * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
      * For single species charts, this allows you to change the taxon displayed.
      */


    function setTaxon(taxon) {
      if (taxa.length !== 1) {
        console.log("You can only use the setTaxon method when your chart displays a single taxon.");
      } else {
        taxa = [taxon];
        highlightItem(null, false);
        makeChart();
      }
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /**
     * @typedef {Object} api
     * @property {module:yearly~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:yearly~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:yearly~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:yearly~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon
    };
  }

  var name = "brc-d3";
  var version = "0.3.0";
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

  exports.accum = accum;
  exports.links = links;
  exports.phen1 = phen1;
  exports.pie = pie;
  exports.trend = trend;
  exports.yearly = yearly;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
