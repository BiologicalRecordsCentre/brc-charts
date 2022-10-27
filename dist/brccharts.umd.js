(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.brccharts = {}, global.d3));
}(this, (function (exports, d3) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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
    // Ensure selector starts with a letter. Replace white space with underscores.
    return text ? "id_".concat(text.replace(/\W/g, '_')) : null;
  }
  function cloneData(data) {
    return data.map(function (d) {
      return _objectSpread2({}, d);
    });
  }
  var month2day = [1, 32, 61, 92, 122, 153, 183, 214, 245, 275, 306, 336, 367];
  var monthMid2day = [1];

  for (var i = 0; i < month2day.length - 1; i++) {
    monthMid2day.push(month2day[i] + (month2day[i + 1] - month2day[i]) / 2);
  }

  monthMid2day.push(367);
  function xAxisMonth(width, ticks, fontSize, font) {
    var ysDomain = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var ysRange = month2day.map(function (d) {
      return (d - 1) / 366 * width;
    });
    var xScaleTime = d3.scaleOrdinal().domain(ysDomain).range(ysRange);
    var xAxis = d3.axisBottom().scale(xScaleTime); // Work out the max text widths of the three styles
    // of month representation

    var svg = d3.select('body').append('svg');

    var getMaxTextWidth = function getMaxTextWidth(aText) {
      return Math.max.apply(Math, _toConsumableArray(aText.map(function (m) {
        var tmpText = svg.append('text').text(m);
        if (font) tmpText.style('font-family', font);
        if (fontSize) tmpText.style('font-size', fontSize);
        var textWidth = tmpText.node().getBBox().width;
        tmpText.remove();
        return textWidth;
      })));
    };

    var maxFullMonth = getMaxTextWidth(ysDomain);
    var maxMedMonth = getMaxTextWidth(ysDomain.map(function (m) {
      return m.substr(0, 3);
    }));
    var maxMinMonth = getMaxTextWidth(ysDomain.map(function (m) {
      return m.substr(0, 1);
    }));
    svg.remove();

    if (ticks) {
      xAxis.ticks(ysDomain).tickSize(width >= 200 ? 13 : 5, 0).tickFormat(function (month) {
        //if (width >= 750) {
        if (width / 12 > maxFullMonth + 4) {
          return month; //} else if (width >= 330) {
        } else if (width / 12 >= maxMedMonth + 4) {
          return month.substr(0, 3); //} else if (width >= 200) {
        } else if (width / 12 >= maxMinMonth + 4) {
          return month.substr(0, 1);
        } else {
          return '';
        }
      });
    } else {
      xAxis.tickValues([]).tickSizeOuter(0);
    }

    return xAxis;
  }
  function xAxisMonthNoText(width) {
    var ysDomain = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var ysRange = month2day.map(function (d) {
      return (d - 1) / 366 * width;
    });
    var xScaleTime = d3.scaleOrdinal().domain(ysDomain).range(ysRange);
    var xAxis = d3.axisBottom().scale(xScaleTime);
    xAxis.ticks(ysDomain).tickSize(width >= 200 ? 13 : 5, 0).tickFormat(function () {
      return '';
    });
    return xAxis;
  }
  function xAxisMonthText(width, ticks, fontSize, font) {
    var ysDomain = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var ysRange = monthMid2day.map(function (d) {
      return (d - 1) / 366 * width;
    });
    var xScaleTime = d3.scaleOrdinal().domain(ysDomain).range(ysRange);
    var xAxis = d3.axisBottom().scale(xScaleTime); // Work out the max text widths of the three styles
    // of month representation

    var svg = d3.select('body').append('svg');

    var getMaxTextWidth = function getMaxTextWidth(aText) {
      return Math.max.apply(Math, _toConsumableArray(aText.map(function (m) {
        var tmpText = svg.append('text').text(m);
        if (font) tmpText.style('font-family', font);
        if (fontSize) tmpText.style('font-size', fontSize);
        var textWidth = tmpText.node().getBBox().width;
        tmpText.remove();
        return textWidth;
      })));
    };

    var maxFullMonth = getMaxTextWidth(ysDomain);
    var maxMedMonth = getMaxTextWidth(ysDomain.map(function (m) {
      return m.substr(0, 3);
    }));
    var maxMinMonth = getMaxTextWidth(ysDomain.map(function (m) {
      return m.substr(0, 1);
    }));
    svg.remove();

    if (ticks) {
      xAxis.ticks(ysDomain).tickSize(0).tickFormat(function (month) {
        if (month === '') {
          return '';
        } else if (width / 12 > maxFullMonth + 4) {
          return month;
        } else if (width / 12 >= maxMedMonth + 4) {
          return month.substr(0, 3);
        } else if (width / 12 >= maxMinMonth + 4) {
          return month.substr(0, 1);
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

      xAxis.ticks(_ticks);
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

    for (var _i = 0; _i < textSplit.length; _i++) {
      if (textSplit[_i] === '\n') {
        line++;
        lines[line] = '';
      } else {
        var workingText = "".concat(lines[line], " ").concat(textSplit[_i]);
        workingText = workingText.trim();
        var txt = svg.append('text').text(workingText).style('font-size', fontSize);
        var width = txt.node().getBBox().width;

        if (width > maxWidth) {
          line++;
          lines[line] = textSplit[_i];
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
  function positionMainElements(svg, expand, headPad) {
    headPad = headPad ? headPad : 0; // For backward compatibility

    var space = 10;
    var svgTitle = svg.select('.titleText');
    var svgSubtitle = svg.select('.subtitleText');
    var svgChart = svg.select('.mainChart');
    var svgFooter = svg.select('.footerText');
    svgTitle.attr("x", headPad);
    svgSubtitle.attr("x", headPad);
    svgFooter.attr("x", headPad);
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
  function saveChartImage(svg, expand, asSvg, filename, font) {
    return new Promise(function (resolve) {
      if (asSvg) {
        var blob1 = serialize(svg, font);

        if (filename) {
          download(blob1, filename);
        }

        resolve(blob1);
      } else {
        rasterize(svg).then(function (blob2) {
          if (filename) {
            download(blob2, filename);
          }

          resolve(blob2);
        });
      }
    });

    function download(data, filename) {
      var dataUrl = URL.createObjectURL(data);
      var file = asSvg ? "".concat(filename, ".svg") : "".concat(filename, ".png");
      downloadLink(dataUrl, file);
    }

    function serialize(svg, font) {
      var xmlns = "http://www.w3.org/2000/xmlns/";
      var xlinkns = "http://www.w3.org/1999/xlink";
      var svgns = "http://www.w3.org/2000/svg";
      var domSvg = svg.node();
      var cloneSvg = domSvg.cloneNode(true);
      var d3Clone = d3.select(cloneSvg); // Explicitly change text in clone to required font

      var fontOut = font ? font : 'Arial, Helvetica, sans-serif';
      d3Clone.selectAll('text').style(fontOut);
      cloneSvg.setAttributeNS(xmlns, "xmlns", svgns);
      cloneSvg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
      var serializer = new window.XMLSerializer();
      var string = serializer.serializeToString(cloneSvg);
      return new Blob([string], {
        type: "image/svg+xml"
      });
    }

    function rasterize(svg, font) {
      var resolve, reject;
      var domSvg = svg.node();
      var promise = new Promise(function (y, n) {
        return resolve = y, reject = n;
      });
      var image = new Image();
      image.onerror = reject;

      image.onload = function () {
        var rect = domSvg.getBoundingClientRect(); // Create a canvas element

        var canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, rect.width, rect.height);
        context.canvas.toBlob(resolve);
      };

      image.src = URL.createObjectURL(serialize(svg, font));
      return promise;
    }

    function downloadLink(dataUrl, file) {
      // Create a link element
      var link = document.createElement("a"); // Set link's href to point to the data URL

      link.href = dataUrl;
      link.download = file; // Append link to the body

      document.body.appendChild(link); // Dispatch click event on the link
      // This is necessary as link.click() does not work on the latest firefox

      link.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })); // Remove link from body

      document.body.removeChild(link);
    }
  }
  function transPromise(transition, pArray) {
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
      var p = transition.end();
      p["catch"](function () {
        return null;
      });
      pArray.push(p);
    }
  }

  function addEventHandlers(svg, sel, isArc, interactivity, dataPrev, imageWidth, callback) {
    sel.on("mouseover", function (d) {
      if (interactivity === 'mousemove') {
        highlightItem(svg, isArc ? d.data.name : d.name, true, dataPrev, imageWidth, callback);
      }
    }).on("mouseout", function (d) {
      if (interactivity === 'mousemove') {
        highlightItem(svg, isArc ? d.data.name : d.name, false, dataPrev, imageWidth, callback);
      }
    }).on("click", function (d) {
      if (interactivity === 'mouseclick') {
        highlightItem(svg, isArc ? d.data.name : d.name, true, dataPrev, imageWidth, callback);
        d3.event.stopPropagation();
      }
    });
  }
  function highlightItem(svg, name, show, dataPrev, imageWidth, callback) {
    var i = safeId(name);
    var imgSelected = svg.select('.brc-item-image');

    if (show) {
      // Callback
      callback(name); // Highlighting

      svg.selectAll('path').classed('brc-lowlight', true);
      svg.selectAll('.legendSwatch').classed('brc-lowlight', true);
      svg.selectAll('.legendText').classed('brc-lowlight', true);
      svg.selectAll('.labelsPie').classed('brc-lowlight', true);
      svg.selectAll('.labelsPieHighlight').classed('brc-lowlight', true);
      svg.select("#swatch-".concat(i)).classed('brc-lowlight', false);
      svg.select("#legend-".concat(i)).classed('brc-lowlight', false);
      svg.select("#pie-".concat(i)).classed('brc-lowlight', false);
      svg.select("#label-highlight-".concat(i)).classed('brc-lowlight', false);
      svg.selectAll('.labelsPieHighlight').classed('brc-highlight', false);
      svg.select("#label-highlight-".concat(i)).classed('brc-highlight', true); // Image display

      var data = dataPrev.find(function (d) {
        return name === d.name;
      });

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
            loadImage(data, svg);
          }

          imgSelected.classed('brc-item-image-hide', false);
        } else {
          // console.log('data', data)
          var img = new Image();

          img.onload = function () {
            data.imageWidth = imageWidth;
            data.imageHeight = imageWidth * this.height / this.width;
            loadImage(data, svg);
          };

          img.src = data.image;
          imgSelected.classed('brc-item-image-hide', false);
        }
      } else {
        imgSelected.classed('brc-item-image-hide', true);
      }
    } else {
      callback('');
      svg.selectAll('.brc-lowlight').classed('brc-lowlight', false);
      imgSelected.classed('brc-item-image-hide', true);
      svg.selectAll('.labelsPie').classed('brc-highlight', false);
      svg.selectAll('.labelsPieHighlight').classed('brc-highlight', false);
      svg.selectAll('.labelsPieHighlight').classed('brc-lowlight', true);
    }
  }

  function loadImage(d, svg) {
    var imgSelected = svg.select('.brc-item-image');
    imgSelected.attr('xlink:href', d.image);
    imgSelected.attr('width', d.imageWidth);
    imgSelected.attr('height', d.imageHeight);
    imgSelected.attr("x", -d.imageWidth / 2);
    imgSelected.attr("y", -d.imageHeight / 2);
  }

  function makePie(data, dataPrevIn, sort, strokeWidth, radius, innerRadius, innerRadius2, svg, svgChart, imageWidth, interactivity, duration, label, labelColour, labelFontSize, callback) {
    //block = true
    var dataDeleted, dataInserted, dataRetained;
    var init = !dataPrevIn;
    var dataNew = cloneData(data);
    var dataPrev;

    if (init) {
      dataInserted = [];
      dataDeleted = [];
      dataRetained = [];
      dataPrev = [];
    } else {
      dataPrev = _toConsumableArray(dataPrevIn);
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
    var dataComb = cloneData([].concat(_toConsumableArray(dataNew), _toConsumableArray(dataDeleted2))); //const arcsPrev = d3.pie().value(d => d.number).sortValues(fnSort)(dataPrev)
    //const arcsComb = d3.pie().value(d => d.number).sortValues(fnSort)(dataComb) 

    var arcsPrev = getArcs(dataPrev);
    var arcsComb = getArcs(dataComb); //console.log('dataComb',dataComb)

    function getArcs(data) {
      var data1 = data.filter(function (d) {
        return !d.set || d.set === 1;
      });
      var data2 = data.filter(function (d) {
        return d.set && d.set === 2;
      });
      var arcs1 = d3.pie().value(function (d) {
        return d.number;
      }).sortValues(fnSort)(data1);
      var arcs2 = d3.pie().value(function (d) {
        return d.number;
      }).sortValues(fnSort)(data2);
      return [].concat(_toConsumableArray(arcs1), _toConsumableArray(arcs2));
    }

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
    var arcGeneratorLables = d3.arc().innerRadius(innerRadius).outerRadius(radius);
    var arcGeneratorLables2 = d3.arc().innerRadius(innerRadius2).outerRadius(innerRadius); // Good stuff here: https://bl.ocks.org/mbostock/4341417
    // and here https://bl.ocks.org/mbostock/1346410
    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.

    function arcTween(arc, _this, trans, radiusx, innerRadiusx, innerRadius2) {
      var radius, innerRadius;

      if (!arc.data.set || arc.data.set === 1) {
        radius = radiusx;
        innerRadius = innerRadiusx;
      } else {
        radius = innerRadiusx;
        innerRadius = innerRadius2;
      }

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
        var gen = a.data.set && a.data.set === 2 ? arcGeneratorLables2 : arcGeneratorLables; //console.log(i(t))

        return "translate(".concat(gen.centroid(i(t)), ")");
      };
    }

    var svgPie, gPie;

    if (svg.select('.brc-chart-pie').size()) {
      svgPie = svgChart.select('.brc-chart-pie');
      gPie = svgPie.select('g');
    } else {
      svgPie = svgChart.append('svg').classed('brc-chart-pie', true).attr('width', 2 * radius).attr('height', 2 * radius).style('overflow', 'visible');
      gPie = svgPie.append('g').attr('transform', "translate(".concat(radius, " ").concat(radius, ")"));
      gPie.append('image').classed('brc-item-image', true).classed('brc-item-image-hide', true).attr('width', imageWidth);
    } // Remove those paths that have been 'deleted'
    // This because in our transition, we never actually remove
    // arcs. Best done here because of better handling of
    // interrupted transitions


    gPie.selectAll("path[data-deleted='true']").remove(); // map to data

    var uPie = gPie.selectAll('path').data(arcsComb, function (d) {
      return d.data.name;
    });
    var ePie = uPie.enter().append('path').attr('id', function (d) {
      return "pie-".concat(safeId(d.data.name));
    }).attr('stroke', 'white').style('stroke-width', "".concat(strokeWidth, "px")).style('opacity', 1).attr('fill', function (d) {
      return d.data.colour;
    }).each(function (d) {
      this._current = d;
    });
    addEventHandlers(svg, ePie, true, interactivity, dataPrev, imageWidth, callback);
    var mPie = ePie.merge(uPie); // Mark paths corresponding to deleted arcs as
    // deleted so that they can be removed before next 
    // transition

    mPie.attr('data-deleted', function (arc) {
      return arc.deleted;
    });
    var trans;
    var transDuration = duration; // Transition 1

    trans = mPie.transition().duration(duration).attrTween('d', function (arc) {
      return arcTween(arc, this, 1, radius, innerRadius, innerRadius2);
    }); // Transition 2 

    if (dataDeleted.length || dataInserted.length) {
      trans = trans.transition().duration(duration).attrTween('d', function (arc) {
        return arcTween(arc, this, 2, radius, innerRadius, innerRadius2);
      });
      transDuration += duration;
    } // Transition 3


    if (dataInserted.length && dataRetained.length) {
      trans = trans.transition().duration(duration).attrTween('d', function (arc) {
        return arcTween(arc, this, 3, radius, innerRadius, innerRadius2);
      });
      transDuration += duration;
    } // Because we always retain deleted items in order
    // to make smooth transitions, the D3 exit selection
    // is never populated. Instead we have to remove
    // invisible deleted DOM items (SVG paths) ourselves after 
    // the last transition to avoid messing up the transition
    // next time the data changes.
    //uPie.exit().remove()  // there is no exit selection 


    trans.on("end", function () {// Be careful about doing anything in here in case transition interrupted
      //if (arc.deleted) {
      //d3.select(this).remove()
      //}
      //block = false
    });

    if (label) {
      //const arcsNew = d3.pie().value(d => d.number).sortValues(fnSort)(dataNew) 
      //console.log(arcsNew)
      var data1 = dataNew.filter(function (d) {
        return !d.set || d.set === 1;
      });
      var data2 = dataNew.filter(function (d) {
        return d.set && d.set === 2;
      });
      var arcs1 = d3.pie().value(function (d) {
        return d.number;
      }).sortValues(fnSort)(data1);
      var arcs2 = d3.pie().value(function (d) {
        return d.number;
      }).sortValues(fnSort)(data2);
      var arcsNew = [].concat(_toConsumableArray(arcs1), _toConsumableArray(arcs2));
      var total1 = data1.reduce(function (t, c) {
        return t + c.number;
      }, 0);
      var total2 = data2.reduce(function (t, c) {
        return t + c.number;
      }, 0);
      var uPieLabels = gPie.selectAll('.labelsPie').data(arcsNew, function (d) {
        return d.data.name;
      });
      var ePieLabels = uPieLabels.enter().append('text').attr('id', function (d) {
        return "label-".concat(safeId(d.data.name));
      }).attr("class", "labelsPie").style('text-anchor', 'middle').style('font-size', labelFontSize).style('fill', labelColour);
      addEventHandlers(svg, ePieLabels, true, interactivity, dataPrev, imageWidth, callback);
      ePieLabels.merge(uPieLabels).text(function (d) {
        if (label === 'value') {
          return d.data.number;
        } else {
          var total = total1;

          if (d.data.set && d.data.set === 2) {
            total = total2;
          }

          if (Number.isNaN(d.data.number) || total === 0) {
            return '';
          } else {
            var l = Math.round(d.data.number / total * 100); // if (l === 0) {
            //   l = Math.ceil(d.data.number / total * 1000)/10
            // }

            return "".concat(l, "%");
          }
        }
      }).attr('opacity', 0).transition().duration(transDuration).attrTween('transform', centroidTween).transition().duration(0).attr('opacity', function (d) {
        var total = total1;

        if (d.data.set && d.data.set === 2) {
          total = total2;
        }

        if (Math.round(d.data.number / total * 100) === 0) {
          return 0;
        } else {
          return 1;
        }
      });
      uPieLabels.exit().remove();
      var uPieLabelsHighlight = gPie.selectAll('.labelsPieHighlight').data(arcsNew, function (d) {
        return d.data.name;
      });
      var ePieLabelsHighlight = uPieLabelsHighlight.enter().append('text').attr('id', function (d) {
        return "label-highlight-".concat(safeId(d.data.name));
      }).classed('labelsPieHighlight', true).classed('brc-lowlight', true).style('text-anchor', 'middle').style('font-size', labelFontSize).style('fill', labelColour);
      addEventHandlers(svg, ePieLabelsHighlight, true, interactivity, dataPrev, imageWidth, callback);
      ePieLabelsHighlight.merge(uPieLabelsHighlight).text(function (d) {
        if (label === 'value') {
          return d.data.number;
        } else {
          var total = total1;

          if (d.data.set && d.data.set === 2) {
            total = total2;
          }

          if (Number.isNaN(d.data.number) || total === 0) {
            return '';
          } else {
            var l = Math.round(d.data.number / total * 1000) / 10;
            return label === 'pervalue' ? "".concat(l, "% (").concat(d.data.number, ")") : "".concat(l, "%");
          }
        }
      }).attr('transform', function (d) {
        var gen = d.data.set && d.data.set === 2 ? arcGeneratorLables2 : arcGeneratorLables;
        return "translate(".concat(gen.centroid(d), ")");
      });
      uPieLabelsHighlight.exit().remove();
    }

    return dataPrev;
  }

  function makeLegend(data, svg, svgChart, legendWidth, labelFontSize, legendSwatchSize, legendSwatchGap, legendTitle, legendTitle2, legendTitleFontSize, duration, interactivity, dataPrev, imageWidth, callback) {
    var svgLegend;

    if (svg.select('.brc-chart-legend').size()) {
      svgLegend = svgChart.select('.brc-chart-legend');
    } else {
      svgLegend = svgChart.append('svg').classed('brc-chart-legend', true).attr('overflow', 'auto');
    } // Constants relating to legendTexts


    var legendTitleHeight = legendTitle ? textHeight(legendTitleFontSize) : 0;
    var legendTitleGap = legendTitle ? legendSwatchGap : 0;
    var legendTitleHeight2 = legendTitle2 ? textHeight(legendTitleFontSize) : 0;
    var legendTitleGap2 = legendTitle2 ? legendSwatchGap : 0; // Legend swatches

    var uLegendSwatch = svgLegend.selectAll('.legendSwatch').data(data, function (d) {
      return d.name;
    });
    var durationUpdate = uLegendSwatch.nodes().length ? duration : 0;
    var durationExit = uLegendSwatch.exit().nodes().length ? duration : 0;
    var eLegendSwatch = uLegendSwatch.enter().append('rect').attr('id', function (d) {
      return "swatch-".concat(safeId(d.name));
    }).classed('legendSwatch', true).attr('y', function (d, i) {
      var titleHeight;

      if (!d.set || d.set === 1) {
        titleHeight = legendTitleHeight + legendTitleGap;
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2;
      }

      return titleHeight + i * (legendSwatchSize + legendSwatchGap);
    }).attr('width', legendSwatchSize).attr('height', legendSwatchSize).style('fill', function (d) {
      return d.colour;
    }).attr('opacity', 0);
    addEventHandlers(svg, eLegendSwatch, false, interactivity, dataPrev, imageWidth, callback);
    eLegendSwatch.transition().delay(durationExit + durationUpdate).duration(duration).attr('opacity', 1);
    uLegendSwatch.transition().delay(durationExit).duration(duration).attr('y', function (d, i) {
      var titleHeight;

      if (!d.set || d.set === 1) {
        titleHeight = legendTitleHeight + legendTitleGap;
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2;
      }

      return titleHeight + i * (legendSwatchSize + legendSwatchGap);
    }).attr('opacity', 1);
    uLegendSwatch.exit().transition().duration(duration).attr('opacity', 0).remove(); // Legend text

    var uLegendText = svgLegend.selectAll('.legendText').data(data, function (d) {
      return d.name;
    });
    var legendTextHeight = textHeight(labelFontSize);
    var eLegendText = uLegendText.enter().append('text').text(function (d) {
      return d.name;
    }).attr('alignment-baseline', 'middle').attr('id', function (d) {
      return "legend-".concat(safeId(d.name));
    }).classed('legendText', true).attr('x', function () {
      return legendSwatchSize + legendSwatchGap;
    }).attr('y', function (d, i) {
      var titleHeight;

      if (!d.set || d.set === 1) {
        titleHeight = legendTitleHeight + legendTitleGap;
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2;
      }

      return titleHeight + (i + 1) * (legendSwatchSize + legendSwatchGap) - legendSwatchSize / 2 - legendTextHeight / 3;
    }).style('font-size', labelFontSize).attr('opacity', 0);
    addEventHandlers(svg, eLegendText, false, dataPrev, imageWidth, callback);
    eLegendText.transition().delay(durationExit + durationUpdate).duration(duration).attr('opacity', 1);
    uLegendText.transition().delay(durationExit).duration(duration).attr('y', function (d, i) {
      var titleHeight;

      if (!d.set || d.set === 1) {
        titleHeight = legendTitleHeight + legendTitleGap;
      } else {
        titleHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2;
      }

      return titleHeight + (i + 1) * (legendSwatchSize + legendSwatchGap) - legendSwatchSize / 2 - legendTextHeight / 3;
    }).attr('opacity', 1);
    uLegendText.exit().transition().duration(duration).attr('opacity', 0).remove(); // Legend titles

    var legendTitles = [];
    if (legendTitle) legendTitles.push(legendTitle);
    if (legendTitle2) legendTitles.push(legendTitle2);
    var uLegendTitle = svgLegend.selectAll('.legendTitle').data(legendTitles, function (d) {
      return d;
    });
    var eLegendTitle = uLegendTitle.enter().append('text').text(function (d) {
      return d;
    }).attr('id', function (d) {
      return "legend-title-".concat(safeId(d));
    }).classed('legendTitle', true).attr('y', function (d, i) {
      if (i === 0) {
        return legendTitleHeight;
      } else {
        var dataSet1Length = data.filter(function (d) {
          return !d.set || d.set === 1;
        }).length;
        return 2 * legendTitleHeight + legendTitleGap + dataSet1Length * (legendSwatchSize + legendSwatchGap);
      }
    }).style('font-size', legendTitleFontSize).attr('opacity', 0);
    eLegendTitle.transition().delay(durationExit + durationUpdate).duration(duration).attr('opacity', 1);
    uLegendTitle.transition().delay(durationExit).duration(duration) //.attr('y', (d, i) => i * (legendTitleFontSize + legendTitleGap))
    .attr('y', function (d, i) {
      if (i === 0) {
        return legendTitleHeight;
      } else {
        var dataSet1Length = data.filter(function (d) {
          return !d.set || d.set === 1;
        }).length;
        return 2 * legendTitleHeight + legendTitleGap + dataSet1Length * (legendSwatchSize + legendSwatchGap);
      }
    }).attr('opacity', 1);
    uLegendTitle.exit().transition().duration(duration).attr('opacity', 0).remove(); //Legend size

    svgLegend.attr("width", legendWidth);
    var legendHeight = legendTitleHeight + legendTitleGap + legendTitleHeight2 + legendTitleGap2 + data.length * (legendSwatchSize + legendSwatchGap) - legendSwatchGap;
    svgLegend.attr("height", legendHeight > 0 ? legendHeight : 0); // Helper functions

    function textHeight(fontSize) {
      var dummyText = svgLegend.append('text').attr('opacity', 0).style('font-size', fontSize).text('Dummy');
      var textHeight = dummyText.node().getBBox().height;
      dummyText.remove();
      return textHeight;
    }
  }

  /** @module pie */
  //https://github.com/d3/d3-shape/blob/v2.0.0/README.md#pie

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
   * @param {string} opts.elid - The id for the dom object created.
   * @param {number} opts.strokeWidth - The desired width of the line delineating chart segments in pixels.
   * @param {number} opts.radius - The desired radius of the chart in pixels.
   * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie chart. Specify a value for donut chart.
   * If your data specify more than one dataset (for concentric donuts), this value is also the out-radius of the second set.
   * @param {number} opts.innerRadius2 - The desired inner radius of the second dataset in pixels, for a donut chart with two concentric donuts.
   * Default of zero gives a pie char. Specify a value for donut chart.
   * @param {number} opts.imageWidth - The width of images in pixels. Images will be resized to this width.
   * @param {string} opts.sort - Sort function. Set to 'asc' for ascending, 'desc' for descending or '' for no sort.
   * @param {string} opts.label - How to label sections. Set to 'value' for raw number, 'percent' for percentage or
   * 'pervalue' for percentage and count together.
   * @param {string} opts.labelFontSize - Specifies the size of label and legend text.
   * @param {string} opts.labelColour - Specifies the colour of label text.
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
   * @param {string} opts.legendTitle - Specifies text, if required, for a legend title.
   * @param {string} opts.legendTitle2 - Specifies text, if required, for a legend title for second dataset (inner concentric donut).
   * @param {string} opts.legendTitleFontSize - Font size (pixels) of legend title(s).
   * @param {string} opts.legendSwatchSize - Specifies the size of legend swatches.
   * @param {string} opts.legendSwatchGap - Specifies the size of gap between legend swatches.
   * @param {number} opts.legendWidth - The width of the legend in pixels.
   * @param {string} opts.title - Title for the chart.
   * @param {string} opts.subtitle - Subtitle for the chart.
   * @param {string} opts.footer - Footer for the chart.
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
   * @param {number} opts.duration - The duration of each transition phase in milliseconds.
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>set</b> - a number to indicate to which 'dataset' this item belongs. Used when concentric donuts are requred.
   * <li> <b>name</b> - the name of the data item uniquely identifies it and is shown in the legend.
   * <li> <b>number</b> - a numeric value associated with the item.
   * <li> <b>colour</b> - an optional colour for the symbol which can be hex format, e.g. #FFA500, 
   * RGB format, e.g. rgb(100, 255, 0) or a named colour, e.g. red. If not specified, a colour will be assigned.
   * <li> <b>image</b> - this optional property allows you to specify the url of an image file
   * which can be displayed when a user selects the associated item.
   * </ul>
   * @param {function} opts.callback - A callback function executed when a pie segment is highlighted. Gets passed
   * the name property of the highlighted data.
   * @returns {module:pie~api} api - Returns an API for the chart.
   */

  function pie() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'piechart' : _ref$elid,
        _ref$strokeWidth = _ref.strokeWidth,
        strokeWidth = _ref$strokeWidth === void 0 ? 2 : _ref$strokeWidth,
        _ref$radius = _ref.radius,
        radius = _ref$radius === void 0 ? 180 : _ref$radius,
        _ref$innerRadius = _ref.innerRadius,
        innerRadius = _ref$innerRadius === void 0 ? 0 : _ref$innerRadius,
        _ref$innerRadius2 = _ref.innerRadius2,
        innerRadius2 = _ref$innerRadius2 === void 0 ? 0 : _ref$innerRadius2,
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
        _ref$legendTitle = _ref.legendTitle,
        legendTitle = _ref$legendTitle === void 0 ? '' : _ref$legendTitle,
        _ref$legendTitle2 = _ref.legendTitle2,
        legendTitle2 = _ref$legendTitle2 === void 0 ? '' : _ref$legendTitle2,
        _ref$legendTitleFontS = _ref.legendTitleFontSize,
        legendTitleFontSize = _ref$legendTitleFontS === void 0 ? 16 : _ref$legendTitleFontS,
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
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$callback = _ref.callback,
        callback = _ref$callback === void 0 ? function () {
      return;
    } : _ref$callback;

    var dataPrev; //let block = false

    colourData(data);
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).attr('class', 'brc-chart-pie').style('position', 'relative').style('display', 'inline');
    var chartDiv = mainDiv.append('div');
    var svg = chartDiv.append('svg').attr('overflow', 'visible');
    var svgChart = svg.append('svg').attr('class', 'mainChart');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(svg, null, false, dataPrev, imageWidth, callback);
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
      dataPrev = makePie(data, dataPrev, sort, strokeWidth, radius, innerRadius, innerRadius2, svg, svgChart, imageWidth, interactivity, duration, label, labelColour, labelFontSize, callback);
      makeLegend(data, svg, svgChart, legendWidth, labelFontSize, legendSwatchSize, legendSwatchGap, legendTitle, legendTitle2, legendTitleFontSize, duration, interactivity, dataPrev, imageWidth, callback);
      var svgPie = svgChart.select('.brc-chart-pie');
      var svgLegend = svgChart.select('.brc-chart-legend');
      svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap);
      svgChart.attr("width", Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width")));
      svgChart.attr("height", Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height"))));
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
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {number} opts.radius - The desired radius of the chart in pixels.
      * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie chart. Specify a value for donut chart.
      * If your data specify more than one dataset (for concentric donuts), this value is also the out-radius of the second set.
      * @param {number} opts.innerRadius2 - The desired inner radius of the second dataset in pixels, for a donut chart with two concentric donuts.
      * Default of zero gives a pie char. Specify a value for donut chart.
      * @param {string} opts.legendTitle - Specifies text, if requiredi, for a legend title.
      * @param {string} opts.legendTitle2 - Specifies text, if required, for a legend title for second dataset (inner concentric donut).
      * @param {Array.<Object>} opts.data - Specifies an array of data objects.
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Set's the value of the chart data, title, subtitle and/or footer. If an element is missing from the 
      * options object, it's value is not changed.
      */


    function setChartOpts(opts) {
      //if (!block) {
      highlightItem(svg, null, false, dataPrev, imageWidth, callback);

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

      if ('radius' in opts) {
        radius = opts.radius;
      }

      if ('innerRadius' in opts) {
        innerRadius = opts.innerRadius;
      }

      if ('innerRadius2' in opts) {
        innerRadius2 = opts.innerRadius2;
      }

      if ('legendTitle' in opts) {
        legendTitle = opts.legendTitle;
      }

      if ('legendTitle2' in opts) {
        legendTitle2 = opts.legendTitle2;
      }

      var textWidth = Number(svgChart.attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);

      if ('data' in opts) {
        colourData(opts.data);
        makeChart(opts.data);
      } //positionElements()


      positionMainElements(svg, expand); // } else {
      //   console.log('Transition in progress')
      // }
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
    /** @function saveImage
      * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
      * @param {string} filename - Name of the file (without extension) to generate and download.
      * If the filename is falsey (e.g. blank), it will not automatically download the
      * file. (Allows caller to do something else with the data URL which is returned
      * as the promise's resolved value.)
      * @returns {Promise} promise object represents the data URL of the image.
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Download the chart as an image file.
      */


    function saveImage(asSvg, filename) {
      return saveChartImage(svg, expand, asSvg, filename);
    }
    /**
     * @typedef {Object} api
     * @property {module:pie~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:pie~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:pie~saveImage} saveImage - Generates and downloads and image file for the SVG. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      saveImage: saveImage
    };
  }

  function addEventHandlers$1(sel, prop, interactivity, svgChart) {
    sel.on("mouseover", function (d) {
      if (interactivity === 'mousemove') {
        highlightItem$1(d[prop], true, svgChart);
      }
    }).on("mouseout", function (d) {
      if (interactivity === 'mousemove') {
        highlightItem$1(d[prop], false, svgChart);
      }
    }).on("click", function (d) {
      if (interactivity === 'mouseclick') {
        highlightItem$1(d[prop], true, svgChart);
        d3.event.stopPropagation();
      }
    });
  }
  function highlightItem$1(id, highlight, svgChart) {
    svgChart.selectAll('.phen-metric path').classed('lowlight', highlight);
    svgChart.selectAll(".phen-metric-".concat(safeId(id), " path")).classed('lowlight', false);
    svgChart.selectAll(".phen-metric path").classed('highlight', false);

    if (safeId(id)) {
      svgChart.selectAll(".phen-metric-".concat(safeId(id), " path")).classed('highlight', highlight);
    }

    svgChart.selectAll('.phen-metric rect').classed('lowlight', highlight);
    svgChart.selectAll(".phen-metric-".concat(safeId(id), " rect")).classed('lowlight', false);
    svgChart.selectAll(".phen-metric rect").classed('highlight', false);

    if (safeId(id)) {
      svgChart.selectAll(".phen-metric-".concat(safeId(id), " rect")).classed('highlight', highlight);
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

  function makePhen(taxon, taxa, data, metricsin, svgChart, width, height, ytype, spread, axisTop, axisBottom, axisLeft, axisRight, monthLineWidth, bands, lines, style, stacked, duration, margin, showTaxonLabel, taxonLabelFontSize, taxonLabelItalics, axisLabelFontSize, axisLeftLabel, interactivity, pTrans, monthFontSize, font) {
    // Examine the first record to see if week or month is specified for period
    var period;

    if (data.length === 0 || 'week' in data[0]) {
      period = 'week';
    } else {
      period = 'month';
    } // Reverse the metrics if this is a stacked display


    var metrics = stacked ? _toConsumableArray(metricsin).reverse() : _toConsumableArray(metricsin); // Pre-process data.
    // Filter to named taxon and sort in week/month order
    // Add max value to each.

    var dataFiltered = data.filter(function (d) {
      return d.taxon === taxon;
    }).filter(function (d) {
      return period === 'week' ? d[period] < 53 : d[period] < 13;
    }).sort(function (a, b) {
      return a[period] > b[period] ? 1 : -1;
    });
    var metricData = [];
    var stackOffsets = new Array(period === 'week' ? 52 : 12).fill(0);
    metrics.forEach(function (m) {
      var total = dataFiltered.reduce(function (a, d) {
        return a + d[m.prop];
      }, 0);
      var max = Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
        return d[m.prop];
      })));
      var maxProportion = Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
        return d[m.prop] / total;
      }))); // If there are no data for this metric, then reset values
      // The metric will also be marked as no data so that it can
      // be styled as required.

      if (isNaN(total)) {
        total = max = maxProportion = 0;
      }

      var points = dataFiltered.map(function (d) {
        return {
          n: total ? d[m.prop] : 0,
          period: d[period],
          id: "".concat(safeId(m.label), "-").concat(d[period])
        };
      }); // If the style is areas, then ensure that there is a point 
      // for every week or month.

      if (style === 'areas') {
        var maxPeriod = period === 'week' ? 52 : 12;
        var pointsPlus = [];

        var _loop = function _loop(p) {
          var match = points.find(function (p1) {
            return p1.period === p;
          });

          if (typeof match !== 'undefined') {
            pointsPlus.push(match);
          } else {
            pointsPlus.push({
              n: 0,
              period: p,
              id: "".concat(safeId(m.label), "-").concat(p)
            });
          }
        };

        for (var p = 1; p <= maxPeriod; p++) {
          _loop(p);
        }

        points = pointsPlus;
      } // The closure array is a small array of points which can
      // be used, in conjunction with the main points, to make
      // a properly enclosed polygon that drops open sides down
      // to the x axis.


      var closure = [];

      if (points.length) {
        if (points[points.length - 1].n > 0) {
          closure.push({
            n: 0,
            period: points[points.length - 1].period
          });
        }

        if (points[0].n > 0) {
          closure.push({
            n: 0,
            period: points[0].period
          });
        }
      }

      metricData.push({
        id: safeId(m.label),
        colour: m.colour,
        strokeWidth: m.strokeWidth,
        fill: m.fill ? m.fill : 'none',
        max: max,
        maxProportion: maxProportion,
        total: total,
        points: points,
        stackOffsets: _toConsumableArray(stackOffsets),
        closure: closure,
        hasData: total ? true : false
      }); // If stacked display updated the stackOffsets array

      if (stacked) {
        points.forEach(function (d) {
          return stackOffsets[d.period - 1] += d.n;
        });
      }
    }); // Set the maximum value for the y axis

    var yMax;

    if (ytype === 'normalized') {
      yMax = 1;
    } else if (ytype === 'proportion') {
      yMax = Math.max.apply(Math, _toConsumableArray(metricData.map(function (d) {
        if (isNaN(d.maxProportion)) {
          return 0;
        } else {
          return d.maxProportion;
        }
      })));
    } else if (stacked) {
      yMax = Math.max.apply(Math, _toConsumableArray(stackOffsets.filter(function (d) {
        return d;
      })));
    } else {
      yMax = Math.max.apply(Math, _toConsumableArray(metricData.map(function (d) {
        return d.max;
      })));
      if (yMax < 5 && !spread && axisLeft === 'tick') yMax = 5;
    } // Calculate spread metrics


    var maxMetricHeight = height;
    var topProp = 0;
    var spreadHeight = 0;

    if (spread && metricData.length > 1) {
      var maxProp = 1.8;
      var valMax0, valMax1;

      if (ytype === 'normalized') {
        valMax0 = metricData[0].hasData ? 1 : 0;
        valMax1 = metricData[1].hasData ? 1 : 0;
      } else if (ytype === 'proportion') {
        valMax0 = metricData[0].maxProportion;
        valMax1 = metricData[1].maxProportion;
      } else {
        valMax0 = metricData[0].max;
        valMax1 = metricData[1].max;
      }

      var h1Prop = maxProp * valMax0 / yMax;
      var h2Prop = maxProp * valMax1 / yMax;
      topProp = Math.max(h1Prop, h2Prop - 1);
      spreadHeight = height / (0.5 + metricData.length - 1 + topProp);
      maxMetricHeight = maxProp * spreadHeight;
    } // Value scales and related data and functions


    function periodToDay(p) {
      if (period === 'week') {
        if (style === 'bars') {
          return (p - 1) * 7;
        } else {
          // style is lines
          return (p - 1) * 7 + 3.5;
        }
      } else {
        // period === month
        if (style === 'bars') {
          return month2day[p - 1];
        } else {
          // style is lines
          return month2day[p - 1] + (month2day[p] - month2day[p - 1]) / 2;
        }
      }
    }

    function periodToWidth(p) {
      if (period === 'week') {
        return xScale(7) - xScale(0) - 1;
      } else {
        return xScale(month2day[p]) - xScale(month2day[p - 1]) - 1;
      }
    }

    var xScale = d3.scaleLinear().domain([0, 366]).range([0, width]);
    var yScale = d3.scaleLinear().domain([0, yMax]).range([maxMetricHeight, 0]); // sScale is for the y axis for spread displays

    var ysDomain = [''];
    var ysRange = [0];

    if (metrics.length) {
      for (var i = 0; i < metrics.length; i++) {
        ysDomain.push(metrics[i].label);
        ysRange.push(topProp * spreadHeight + i * spreadHeight);
      }

      ysDomain.push('');
      ysRange.push(height);
    } else {
      ysRange.push(height);
    }

    var sScale = d3.scaleOrdinal().domain(ysDomain).range(ysRange); // Top axis

    var tAxis;

    if (axisTop === 'on') {
      tAxis = d3.axisTop().scale(xScale).tickValues([]).tickSizeOuter(0);
    } // X (bottom) axis


    var xAxis1, xAxis2;

    if (axisBottom === 'on' || axisBottom === 'tick') {
      //xAxis = xAxisMonth(width, axisBottom === 'tick')
      xAxis1 = xAxisMonthNoText(width);
      xAxis2 = xAxisMonthText(width, axisBottom === 'tick', monthFontSize, font);
    } // Right axis


    var rAxis;

    if (axisRight === 'on') {
      rAxis = d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0);
    } // Y (left) axis


    var yAxis;

    if (axisLeft === 'on' || axisLeft === 'tick') {
      if (spread) {
        yAxis = d3.axisLeft().scale(sScale).ticks(5);
      } else {
        yAxis = d3.axisLeft().scale(yScale).ticks(5);

        if (axisLeft !== 'tick') {
          yAxis.tickValues([]).tickSizeOuter(0);
        } else if (ytype === 'count') {
          yAxis.tickFormat(d3.format("d"));
        }
      }
    } // Line generator with curves


    var lineCurved = d3.line().curve(d3.curveMonotoneX).x(function (d) {
      return xScale(periodToDay(d.period));
    }).y(function (d) {
      return height - maxMetricHeight + yScale(d.n);
    }); // Line generator without curves

    var lineNotCurved = d3.line().x(function (d) {
      return xScale(periodToDay(d.period));
    }).y(function (d) {
      return height - maxMetricHeight + yScale(d.n);
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
      svgPhen1 = svgChart.append('svg').classed('brc-chart-phen1', true).attr('id', safeId(taxon)).style('overflow', 'visible');
      gPhen1 = svgPhen1.append('g').classed('brc-chart-phen1-g', true);
      init = true;
    } // Vertical bands and lines


    gPhen1.selectAll(".brc-chart-month-band").data(bands, function (b, i) {
      return "month-band-".concat(i);
    }).enter().append("rect").attr("class", "brc-chart-month-band").style("fill", function (d, i) {
      return bands[i];
    }).attr("y", 0).attr("x", function (d, i) {
      return xScale(month2day[i]) - 1;
    }).attr("height", height).attr("width", function (d, i) {
      return xScale(month2day[i + 1]) - xScale(month2day[i]);
    });
    gPhen1.selectAll(".brc-chart-month-line").data(lines, function (b, i) {
      return "month-line-".concat(i);
    }).enter().append("rect").attr("class", "brc-chart-month-line").style("fill", function (d, i) {
      return lines[i];
    }).attr("y", 0).attr("x", function (d, i) {
      return xScale(month2day[i + 1]) - monthLineWidth / 2 - 1;
    }).attr("height", height).attr("width", monthLineWidth); // Create/update the graphics for the metrics 

    var agroups = gPhen1.selectAll("g").data(metricData, function (d) {
      return d.id;
    });
    var egroups = agroups.enter().append("g").attr("opacity", 0).attr("class", function (d) {
      return "phen-metric-".concat(d.id, " phen-metric");
    });
    addEventHandlers$1(egroups, 'id', interactivity, svgChart);
    var mgroups = agroups.merge(egroups).classed("phen-metric-no-data", function (d) {
      return !d.hasData;
    });
    var t = svgChart.transition().duration(duration);
    transPromise(mgroups.transition(t).attr('opacity', 1).attr("transform", function (d, i) {
      return "translate(0,-".concat((metricData.length - 1 - i + 0.5) * spreadHeight, ")");
    }), pTrans);
    var xgroups = agroups.exit();

    if (style === 'bars') {
      mgroups.each(function (d) {
        var colour = d.colour;
        var max = d.max;
        var total = d.total;
        var stackOffsets = d.stackOffsets;
        gPhen1.select(".phen-metric-".concat(d.id)).selectAll('rect').data(d.points, function (d) {
          return d.id;
        }).join(function (enter) {
          return enter.append("rect").attr("fill", colour).attr("stroke", 'white').attr("stroke-width", 1).attr("x", function (d) {
            return xScale(periodToDay(d.period)) - 1;
          }).attr("y", height).attr("width", function (d) {
            return periodToWidth(d.period);
          }).attr("height", 0);
        }, function (update) {
          return update // Use call for transitions to avoid breaking the
          // method chain (https://observablehq.com/@d3/selection-join)
          .call(function (update) {
            return transPromise(update.transition(t).attr("fill", colour), pTrans);
          });
        }, function (exit) {
          return exit.call(function (exit) {
            return transPromise(exit.transition(t).attr("height", 0).remove(), pTrans);
          });
        }).call(function (merge) {
          return transPromise(merge.transition(t).attr("y", function (d) {
            return getBarY(d, max, total, stackOffsets);
          }).attr("height", function (d) {
            return getBarHeight(d, max, total);
          }), pTrans);
        });
      });
    } else if (style === 'areas') {
      egroups.append("path").attr("class", 'phen-path-area').attr("d", function (d) {
        return flatPath(d, true);
      });
    } else {
      // style ==='line'
      egroups.append("path").attr("class", 'phen-path-fill').attr("d", function (d) {
        return flatPath(d, true);
      });
      egroups.append("path").attr("class", 'phen-path-line').attr("d", function (d) {
        return flatPath(d, false);
      });
    } // Each phenology line consists of both a line and polygon. This
    // is necessary because if we relied on a single polygon, it is
    // not always possible to confine the line graphics to the part
    // of the polygon which represents the phenology line.
    // Important for correct data binding to use select - NOT selectAll
    // in sub-selections (https://bost.ocks.org/mike/selection/#non-grouping)


    transPromise(mgroups.select('.phen-path-line').transition(t).attr("d", function (d) {
      return getPath(d, false);
    }).attr("stroke", function (d) {
      return d.colour;
    }).attr("stroke-width", function (d) {
      return d.strokeWidth;
    }).attr("fill", "none"), pTrans);
    transPromise(mgroups.select('.phen-path-fill').transition(t).attr("d", function (d) {
      return getPath(d, true);
    }).attr("fill", function (d) {
      return d.fill;
    }), pTrans);
    transPromise(mgroups.select('.phen-path-area').transition(t).attr("d", function (d) {
      return getPath(d, true);
    }).attr("fill", function (d) {
      return d.colour;
    }), pTrans);
    transPromise(xgroups.select('.phen-path-line').transition(t).attr("d", function (d) {
      return flatPath(d, false);
    }), pTrans);
    transPromise(xgroups.select('.phen-path-fill').transition(t).attr("d", function (d) {
      return flatPath(d, true);
    }), pTrans);
    transPromise(xgroups.select('.phen-path-area').transition(t).attr("d", function (d) {
      return flatPath(d, true);
    }), pTrans);
    transPromise(xgroups.transition(t).attr("opacity", 0).remove(), pTrans); // Path and bar generation helper functions

    function flatPath(d, poly) {
      var lineFn = style === 'areas' ? lineNotCurved : lineCurved;
      var flat = lineFn(d.points.map(function (p) {
        return {
          n: 0,
          period: p.period
        };
      }));

      if (d.closure.length && poly) {
        flat = "".concat(flat, "L").concat(lineNotCurved(d.closure).substring(1));
      }

      return flat;
    }

    function getPath(d, poly) {
      var lineFn = style === 'areas' ? lineNotCurved : lineCurved;
      var lPath;

      if (ytype === 'normalized') {
        lPath = lineFn(d.points.map(function (p) {
          return {
            n: d.max ? p.n / d.max : 0,
            period: p.period
          };
        }));
      } else if (ytype === 'proportion') {
        lPath = lineFn(d.points.map(function (p) {
          return {
            n: d.total === 0 ? 0 : p.n / d.total,
            period: p.period
          };
        }));
      } else if (stacked) {
        var so1 = _toConsumableArray(d.stackOffsets);

        var so2 = _toConsumableArray(d.stackOffsets);

        d.points.forEach(function (p) {
          so2[p.period - 1] += p.n;
        });
        var p1 = so1.map(function (n, i) {
          return {
            period: i + 1,
            n: n
          };
        });
        var p2 = so2.map(function (n, i) {
          return {
            period: i + 1,
            n: n
          };
        });
        var all = [].concat(_toConsumableArray(p1), _toConsumableArray(p2.reverse()));
        lPath = lineFn(all);
      } else {
        lPath = lineFn(d.points);
      } // If this is for a poly underneath a line
      // display, close the path 


      if (poly && d.closure.length && !stacked) {
        lPath = "".concat(lPath, "L").concat(lineNotCurved(d.closure).substring(1));
      }

      return lPath;
    }

    function getBarHeight(d, max, total) {
      var v;

      if (ytype === 'normalized') {
        v = max ? d.n / max : 0;
      } else if (ytype === 'proportion') {
        v = total === 0 ? 0 : d.n / total;
      } else {
        v = d.n;
      }

      return maxMetricHeight - yScale(v);
    }

    function getBarY(d, max, total, stackOffsets) {
      var barY;

      if (ytype === 'normalized') {
        barY = yScale(max ? d.n / max : 0);
      } else if (ytype === 'proportion') {
        barY = yScale(total === 0 ? 0 : d.n / total);
      } else if (stacked) {
        barY = yScale(stackOffsets[d.period - 1] + d.n);
      } else {
        barY = yScale(d.n);
      }

      return barY + (height - maxMetricHeight);
    }

    if (init) {
      // Constants for positioning
      var axisLeftPadX = margin.left ? margin.left : 0;
      var axisRightPadX = margin.right ? margin.right : 0;
      var axisBottomPadY = margin.bottom ? margin.bottom : 0;
      var axisTopPadY = margin.top ? margin.top : 0; // Taxon title

      if (showTaxonLabel) {
        var taxonLabel = svgPhen1.append('text').classed('brc-chart-phen1-label', true).text(taxon).style('font-size', taxonLabelFontSize).style('font-style', taxonLabelItalics ? 'italic' : '');
        var labelHeight = taxonLabel.node().getBBox().height;
        taxonLabel.attr("transform", "translate(".concat(axisLeftPadX, ", ").concat(labelHeight, ")"));
      } // Size SVG


      svgPhen1.attr('width', width + axisLeftPadX + axisRightPadX) //.attr('height', height + axisBottomPadY + axisTopPadY)
      .attr('height', height + axisBottomPadY + axisTopPadY); // Position chart

      gPhen1.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")")); // Create axes and position within SVG

      var leftYaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")");
      var rightYaxisTrans = "translate(".concat(axisLeftPadX + width, ", ").concat(axisTopPadY, ")");
      var topXaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")"); //const bottomXaxisTrans = `translate(${axisLeftPadX},${axisTopPadY + height})`

      var leftYaxisLabelTrans = "translate(".concat(axisLabelFontSize, ",").concat(axisTopPadY + height / 2, ") rotate(270)"); // Create axes and position within SVG

      if (yAxis) {
        var gYaxis = svgPhen1.append("g").attr("class", "y-axis");
        gYaxis.attr("transform", leftYaxisTrans);
      }

      if (xAxis1 && xAxis2) {
        // const gXaxis = svgPhen1.append("g")
        //   .attr("class", "x axis")
        //   .call(xAxis)
        var gXaxis1 = svgPhen1.append("g").attr("class", "x axis").style('font-size', monthFontSize).call(xAxis1);
        var gXaxis2 = svgPhen1.append("g").attr("class", "x axis").style('font-size', monthFontSize).call(xAxis2); // gXaxis.selectAll(".tick text")
        //   .style("text-anchor", "start")
        //   .attr("x", 6)
        //   .attr("y", 6)
        // gXaxis.attr("transform", bottomXaxisTrans)

        gXaxis2.selectAll(".tick text").style("text-anchor", "middle");
        gXaxis1.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(height + axisTopPadY, ")"));
        gXaxis2.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(height + axisTopPadY, ")"));
      }

      if (tAxis) {
        var gTaxis = svgPhen1.append("g").call(tAxis);
        gTaxis.attr("transform", topXaxisTrans);
      }

      if (rAxis) {
        var gRaxis = svgPhen1.append("g").call(rAxis);
        gRaxis.attr("transform", rightYaxisTrans);
      }

      var tYaxisLeftLabel = svgPhen1.append("text").style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
      tYaxisLeftLabel.attr("transform", leftYaxisLabelTrans);
    } else if (taxa.length === 1) {
      // Update taxon label
      if (showTaxonLabel) {
        svgPhen1.select('.brc-chart-phen1-label').text(taxon);
      }
    }

    if (yAxis) {
      transPromise(svgPhen1.select(".y-axis").transition(t).call(yAxis), pTrans);
    }

    return svgPhen1;
  }

  function preProcessMetrics(metrics) {
    // Look for 'fading' colour in taxa and colour appropriately 
    // in fading shades of grey.
    var iFading = 0;
    var metricsPlus = metrics.map(function (m) {
      var iFade, strokeWidth;

      if (m.colour === 'fading') {
        iFade = ++iFading;
        strokeWidth = 1;
      } else {
        strokeWidth = m.strokeWidth;
      }

      return {
        prop: m.prop,
        label: m.label,
        colour: m.colour,
        fill: m.fill,
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
    return metricsPlus;
  }

  function makeLegend$1(legendWidth, metrics, svgChart, legendFontSize, headPad, interactivity, style) {
    var swatchSize = 20;
    var swatchFact = 1.3; // Loop through all the legend elements and work out their
    // positions based on swatch size, item lable text size and
    // legend width.

    var metricsReversed = cloneData(metrics).reverse();
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

      m.x = lineWidth + swatchSize + headPad;
      m.y = rows * swatchSize * swatchFact;
      lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText;
    });
    var ls = svgChart.selectAll('.brc-legend-item-rect').data(metricsReversed, function (m) {
      return safeId(m.label);
    }).join(function (enter) {
      var rect = enter.append("rect").attr("class", function (m) {
        return "brc-legend-item brc-legend-item-rect brc-legend-item-".concat(safeId(m.label));
      }).classed('brc-legend-item-line', style === 'lines').attr('width', swatchSize).attr('height', style === 'lines' ? 2 : swatchSize);
      return rect;
    }).attr('x', function (m) {
      return m.x;
    }).attr('y', function (m) {
      if (style === 'bars' || style === 'areas') {
        return m.y - swatchSize / 5;
      } else {
        return m.y + swatchSize / 2;
      }
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
    addEventHandlers$1(ls, 'label', interactivity, svgChart);
    addEventHandlers$1(lt, 'label', interactivity, svgChart);
    return swatchSize * swatchFact * (rows + 1);
  }

  /** @module phen1 */
  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
   * @param {string} opts.elid - The id for the dom object created.
   * @param {number} opts.width - The width of each sub-chart area in pixels.
   * @param {number} opts.height - The height of the each sub-chart area in pixels.
   * @param {Object} opts.margin - An object indicating the margins to add around each sub-chart area.
   * @param {number} opts.margin.left - Left margin in pixels. (Default - 35.)
   * @param {number} opts.margin.right - Right margin in pixels. (Default - 0.)
   * @param {number} opts.margin.top - Top margin in pixels. (Default - 20.)
   * @param {number} opts.margin.bottom - Bottom margin in pixels. (Default - 5.)
   * @param {number} opts.perRow - The number of sub-charts per row.
   * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
   * @param {boolean} opts.spread - Indicates whether multiple metrics are to be spread vertically across the chart.
   * @param {string} opts.style - Indicates the type of graphics to be used for the chart. Can be 'lines', 'bars' or 'areas'. (Default - 'lines'.)
   * @param {boolean} opts.stacked - Indicates whether to stack metrics or superimpose them. If true, the metrics are stacked. This
   * is only relevant for charts of style 'bars' or 'areas'. It has no effect on charts with the style 'lines'. (Default - false.)
   * @param {string} opts.title - Title for the chart.
   * @param {string} opts.subtitle - Subtitle for the chart.
   * @param {string} opts.footer - Footer for the chart.
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart sub-title.
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
   * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph.
   * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label.
   * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.
   * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
   * @param {string | number} opts.monthFontSize - Font size for month labels. Can be specified in any permitted SVG units. (Default - 12.)
   * @param {string } opts.font - Font to use for chart. (Default - sans-serif.)
   * @param {boolean} opts.showLegend - Whether or not to show the legend.
   * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
   * @param {string | number} opts.lineWidth - Sets the stroke-width of all lines on the chart. Can use any permitted SVG stroke-width units. (Default - 1.)* @param {string} opts.axisLeft - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
   * @param {string} opts.axisTop - If set to 'on' line is drawn otherwise not.
   * @param {string} opts.axisLeftLabel - Value for labelling left axis. (Default - ''.)
   * @param {Array.<string>} opts.bands - An array of up to 12 colours (any standard colour notation), used to display bands for each month
   * as a background on the chart. (Default is an empty array.)
   * @param {Array.<string>} opts.lines - An array of up to 12 colours (any standard colour notation), used to display vertical lines to
   * delineat each month as a background on the chart. (Default is an empty array.)
   * @param {number} opts.monthLineWidth - The width of lines used to delineate months.
   * @param {number} opts.headPad - A left hand offset, in pixels, for title, subtitle, legend and footer. (Default 0.)
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
   * <li> <b>fill</b> - optional colour to colour the graph area for this metric. Any accepted way of specifying web colours can be used.
   * </ul>
   * Note that if a metric has no data for a given taxon, then the graphics representing it will be
   * marked with the CSS class 'phen-path-no-data'. You can use this to style as you see fit.
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> either <b>week</b> - a number between 1 and 53 indicating the week of the year,
   * <li> or <b>month</b> - a number between 1 and 12 indicating the month of the year,
   * <li> <b>c1</b> - a count for a given time period (can have any name). 
   * <li> <b>c2</b> - a count for a given time period (can have any name).
   * ... - there must be at least one count column, but there can be any number of them.
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
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 35,
      right: 0,
      top: 20,
      bottom: 5
    } : _ref$margin,
        _ref$bands = _ref.bands,
        bands = _ref$bands === void 0 ? [] : _ref$bands,
        _ref$lines = _ref.lines,
        lines = _ref$lines === void 0 ? [] : _ref$lines,
        _ref$monthLineWidth = _ref.monthLineWidth,
        monthLineWidth = _ref$monthLineWidth === void 0 ? 1 : _ref$monthLineWidth,
        _ref$perRow = _ref.perRow,
        perRow = _ref$perRow === void 0 ? 2 : _ref$perRow,
        _ref$ytype = _ref.ytype,
        ytype = _ref$ytype === void 0 ? 'count' : _ref$ytype,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$spread = _ref.spread,
        spread = _ref$spread === void 0 ? false : _ref$spread,
        _ref$style = _ref.style,
        style = _ref$style === void 0 ? 'lines' : _ref$style,
        _ref$stacked = _ref.stacked,
        stacked = _ref$stacked === void 0 ? false : _ref$stacked,
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
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$monthFontSize = _ref.monthFontSize,
        monthFontSize = _ref$monthFontSize === void 0 ? 12 : _ref$monthFontSize,
        _ref$lineWidth = _ref.lineWidth,
        lineWidth = _ref$lineWidth === void 0 ? 1 : _ref$lineWidth,
        _ref$font = _ref.font,
        font = _ref$font === void 0 ? 'sans-serif' : _ref$font,
        _ref$showLegend = _ref.showLegend,
        showLegend = _ref$showLegend === void 0 ? true : _ref$showLegend,
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
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? '' : _ref$axisLeftLabel,
        _ref$headPad = _ref.headPad,
        headPad = _ref$headPad === void 0 ? 0 : _ref$headPad,
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

    metrics = preProcessMetrics(metrics);
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).classed('brc-chart-phen1-top', true).style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem$1(null, false, svgChart);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart').style('overflow', 'visible');
    makeChart(); // Texts must come after chart because 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width") - headPad);
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand, headPad);
    svg.selectAll('text').style('font-family', font);
    svg.selectAll('line, path').style('stroke-width', lineWidth);

    function makeChart() {
      // Give warning and return if invalid option combinations are used
      if (stacked && spread) {
        console.log('You cannot set both the stacked and spread options to true.');
        return;
      }

      if ((ytype === 'normalized' || ytype === 'proportion') && stacked) {
        console.log('You cannot used a y axis type of normalized or proportion with a stacked display.');
        return;
      }

      if (!taxa.length) {
        taxa = data.map(function (d) {
          return d.taxon;
        }).filter(function (v, i, a) {
          return a.indexOf(v) === i;
        });
      }

      var subChartPad = 10;
      var pTrans = [];
      var svgsTaxa = taxa.map(function (t) {
        return makePhen(t, taxa, data, metrics, svgChart, width, height, ytype, spread, axisTop, axisBottom, axisLeft, axisRight, monthLineWidth, bands, lines, style, stacked, duration, margin, showTaxonLabel, taxonLabelFontSize, taxonLabelItalics, axisLabelFontSize, axisLeftLabel, interactivity, pTrans, monthFontSize, font);
      });
      var subChartWidth = Number(svgsTaxa[0].attr("width"));
      var subChartHeight = Number(svgsTaxa[0].attr("height"));
      var legendHeight = 0;

      if (showLegend) {
        var legendWidth = perRow * (subChartWidth + subChartPad) - headPad;
        legendHeight = makeLegend$1(legendWidth, metrics, svgChart, legendFontSize, headPad, interactivity, style) + subChartPad;
      }

      svgsTaxa.forEach(function (svgTaxon, i) {
        var col = i % perRow;
        var row = Math.floor(i / perRow);
        svgTaxon.attr("x", col * (subChartWidth + subChartPad));
        svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight);
      });
      svgChart.attr("width", perRow * (subChartWidth + subChartPad));
      svgChart.attr("height", legendHeight + Math.ceil(svgsTaxa.length / perRow) * (subChartHeight + subChartPad));
      return Promise.allSettled(pTrans);
    }
    /** @function setChartOpts
      * @param {Object} opts - text options.
      * @param {string} opts.title - Title for the chart.
      * @param {string} opts.subtitle - Subtitle for the chart.
      * @param {string} opts.footer - Footer for the chart.
      * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {string} opts.ytype - Type of metric to show on the y axis, can be 'count', 'proportion' or 'normalized'.
      * @param {boolean} opts.spread - Indicates whether multiple metrics are to be spread vertically across the chart.
      * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @returns {Promise} promise resolves when all transitions complete.
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
        metrics = preProcessMetrics(opts.metrics);
        remakeChart = true;
      }

      if ('spread' in opts) {
        spread = opts.spread;
        remakeChart = true;
      }

      var pRet;

      if (remakeChart) {
        pRet = makeChart();
        positionMainElements(svg, expand);
      } else {
        pRet = Promise.resolve();
      }

      return pRet;
    }
    /** @function setTaxon
      * @param {string} opts.taxon - The taxon to display.
      * @returns {Promise} promise resolves when all transitions complete.
      * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
      * For single species charts, this allows you to change the taxon displayed.
      */


    function setTaxon(taxon) {
      var pRet;

      if (taxa.length !== 1) {
        console.log("You can only use the setTaxon method when your chart displays a single taxon.");
        pRet = Promise.resolve();
      } else {
        taxa = [taxon];
        pRet = makeChart();
      }

      return pRet;
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
    /** @function saveImage
      * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
      * @param {string} filename - Name of the file (without extension) to generate and download.
      * If the filename is falsey (e.g. blank), it will not automatically download the
      * file. (Allows caller to do something else with the data URL which is returned
      * as the promise's resolved value.)
      * @returns {Promise} promise object represents the data URL of the image.
      * @description <b>This function is exposed as a method on the API returned from the phen1 function</b>.
      * Download the chart as an image file.
      */


    function saveImage(asSvg, filename) {
      return saveChartImage(svg, expand, asSvg, filename);
    }
    /**
     * @typedef {Object} api
     * @property {module:phen1~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:phen1~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:phen1~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:phen1~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
     * @property {module:phen1~saveImage} saveImage - Generates and downloads and image file for the SVG. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon,
      saveImage: saveImage
    };
  }

  /** @module phen2 */
  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
   * @param {string} opts.elid - The id for the dom object created.
   * @param {number} opts.width - The width of each sub-chart area in pixels.
   * @param {number} opts.height - The height of the each sub-chart area in pixels.
   * @param {number} opts.split - Set to true to split bands over seperate lines - defalt is false.
   * @param {number} opts.perRow - The number of sub-charts per row.
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized.
   * @param {string} opts.title - Title for the chart.
   * @param {string} opts.subtitle - Subtitle for the chart.
   * @param {string} opts.footer - Footer for the chart.
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
   * @param {string | number} opts.monthFontSize - Font size for month labels. Can be specified in any permitted SVG units. (Default - 12.)
   * @param {string } opts.font - Font to use for chart. (Default - sans-serif.)
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
   * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph.
   * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label.
   * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.
   * @param {boolean} opts.displayLegend - Indicates whether or not to display a legend. (Default - true.)
   * @param {string} opts.legendFontSize - Font size (pixels) of legend item text.
   * @param {string | number} opts.lineWidth - Sets the stroke-width of all lines on the chart. Can use any permitted SVG stroke-width units. (Default - 1.)
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis.
   * @param {string} opts.axisLeft - If set to 'on' line is drawn otherwise not.
   * @param {string} opts.axisRight - If set to 'on' line is drawn otherwise not.
   * @param {string} opts.axisTop- If set to 'on' line is drawn otherwise not.
   * @param {number} opts.headPad - A left hand offset, in pixels, for title, subtitle, legend and footer. (Default 0.)
   * @param {number} opts.chartPad - A left hand offset, in pixels, for the chart. (Default 0.)
   * @param {number} opts.duration - The duration of each transition phase in milliseconds.
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
   * @param {string} opts.backColour - Background colour of the chart. Any accepted way of specifying web colours can be used. (Default - white.)
   * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
   * If empty, graphs for all taxa are created.
   * @param {Array.<Object>} opts.metrics - An array of objects, each describing a property in the input
   * data for which a band should be generated on the chart.
   * Each of the objects in the metrics array must be sepecified with the properties shown below.
   * <ul>
   * <li> <b>prop</b> - the name of the property in the data (properties - 'p1' or 'p2' in the example below).
   * <li> <b>label</b> - a label for this property.
   * <li> <b>colour</b> - colour to give the band for this property. Any accepted way of specifying web colours can be used.
   * <li> <b>opacity</b> - Optional opacity to give the band for this property. A value between 0 and 1 - default is 1.
   * <li> <b>svg</b> - Optional string defining an SVG path of an icon to use in place of a colour swatch in the legend.
   * <li> <b>svgScale</b> - Optional number defining a scaling factor to apply to SVG icon (relative to others) - default is 1.
   * <li> <b>legendOrder</b> - Optional number used to sort the legend items. Low to high = left to right. If supplied, it
   * should be supplied for all metrics items otherwise results undefined. If not defined, default is to reverse the order.
   * Numbering should start at one and increase in increments of 1. For split bands it is also used to position the bands
   * from top to bottom
   * </ul>
   * The order in which the metrics are specified determines the order in which properties are drawn on the chart. Each is
   * drawn over the previous so for overlapping properties (split = false), the one you want to draw on top should
   * come last. 
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. 
   * There should only be one object per taxon. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>p1</b> - an array of date band objects (see below), indicating start and end weeks for the property (can have any name).
   * <li> <b>p2</b> - an array of date band objects (see below), indicating start and end weeks for the property (can have any name).
   * ... - there must be at leas one property column, but there can be any number of them.
   * </ul>
   * The objects in each data band array have the following structure:
   * <ul>
   * <li> <b>start</b> - a number between 1 and 365 indicating the day of the year the band starts.
   * <li> <b>end</b> - a number between 1 and 365 indicating the day of the year the band ends.
  *  </ul>
   * @returns {module:phen2~api} api - Returns an API for the chart.
   */

  function phen2() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'phen2-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 30 : _ref$height,
        _ref$split = _ref.split,
        split = _ref$split === void 0 ? false : _ref$split,
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
        _ref$font = _ref.font,
        font = _ref$font === void 0 ? 'sans-serif' : _ref$font,
        _ref$titleFontSize = _ref.titleFontSize,
        titleFontSize = _ref$titleFontSize === void 0 ? 24 : _ref$titleFontSize,
        _ref$subtitleFontSize = _ref.subtitleFontSize,
        subtitleFontSize = _ref$subtitleFontSize === void 0 ? 16 : _ref$subtitleFontSize,
        _ref$footerFontSize = _ref.footerFontSize,
        footerFontSize = _ref$footerFontSize === void 0 ? 10 : _ref$footerFontSize,
        _ref$legendFontSize = _ref.legendFontSize,
        legendFontSize = _ref$legendFontSize === void 0 ? 16 : _ref$legendFontSize,
        _ref$displayLegend = _ref.displayLegend,
        displayLegend = _ref$displayLegend === void 0 ? true : _ref$displayLegend,
        _ref$monthFontSize = _ref.monthFontSize,
        monthFontSize = _ref$monthFontSize === void 0 ? 12 : _ref$monthFontSize,
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
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? 'on' : _ref$axisTop,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'on' : _ref$axisLeft,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? 'on' : _ref$axisRight,
        _ref$lineWidth = _ref.lineWidth,
        lineWidth = _ref$lineWidth === void 0 ? 1 : _ref$lineWidth,
        _ref$headPad = _ref.headPad,
        headPad = _ref$headPad === void 0 ? 0 : _ref$headPad,
        _ref$chartPad = _ref.chartPad,
        chartPad = _ref$chartPad === void 0 ? 0 : _ref$chartPad,
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
    var pTrans;
    var mainDiv = d3.select("".concat(selector)).append('div').classed('brc-chart-phen2-top', true).attr('id', elid).style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, false);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart');
    makeChart(); // Texts must come after chart because 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width") - headPad);
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand, headPad);
    svg.selectAll('line, path').style('stroke-width', lineWidth);
    svg.selectAll('text').style('font-family', font);

    function makeChart() {
      pTrans = [];
      metricsPlus = metrics.map(function (m, i) {
        return {
          id: safeId(m.label),
          prop: m.prop,
          label: m.label,
          colour: m.colour,
          opacity: m.opacity ? m.opacity : 1,
          svg: m.svg,
          // By default legend order is reversed
          legendOrder: m.legendOrder ? m.legendOrder : metrics.length - i,
          svgScale: m.svgScale ? m.svgScale : 1
        };
      });

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
      var legendHeight = 0;

      if (displayLegend) {
        legendHeight = makeLegend(perRow * (subChartWidth + subChartPad) - headPad) + subChartPad;
      }

      svgsTaxa.forEach(function (svgTaxon, i) {
        var col = i % perRow;
        var row = Math.floor(i / perRow);
        svgTaxon.attr("x", col * (subChartWidth + subChartPad));
        svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight);
      });
      svgChart.attr("width", perRow * (subChartWidth + subChartPad));
      svgChart.attr("height", legendHeight + Math.ceil(svgsTaxa.length / perRow) * (subChartHeight + subChartPad));
      return Promise.allSettled(pTrans);
    }

    function makePhen(taxon) {
      // Get data for named taxon
      var dataFiltered = data.find(function (d) {
        return d.taxon === taxon;
      });
      var rectData = [];

      if (dataFiltered) {
        metricsPlus.forEach(function (m, im) {
          dataFiltered[m.prop].forEach(function (d, i) {
            rectData.push({
              id: "".concat(m.id, "-").concat(i),
              iMetric: m.legendOrder ? m.legendOrder - 1 : im,
              "class": m.id,
              colour: m.colour,
              opacity: m.opacity,
              start: d.start,
              end: d.end
            });
          });
        });
      } // Value scale


      var xScale = d3.scaleLinear().domain([1, 365]).range([0, width]);
      var yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]); // X (bottom) axis

      var xAxis1, xAxis2;

      if (axisBottom === 'on' || axisBottom === 'tick') {
        //xAxis = xAxisMonth(width, axisBottom === 'tick', monthFontSize, font)
        xAxis1 = xAxisMonthNoText(width);
        xAxis2 = xAxisMonthText(width, axisBottom === 'tick', monthFontSize, font);
      } // Top axis


      var tAxis;

      if (axisTop === 'on') {
        tAxis = d3.axisTop().scale(xScale).tickValues([]).tickSizeOuter(0);
      } // Right axis


      var rAxis;

      if (axisRight === 'on') {
        rAxis = d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0);
      } // Y (left) axis


      var yAxis;

      if (axisLeft === 'on') {
        yAxis = d3.axisLeft().scale(yScale).tickValues([]).tickSizeOuter(0);
      } // Create or get the relevant chart svg


      var init, svgPhen2, gPhen2;

      if (taxa.length === 1 && svgChart.selectAll('.brc-chart-phen2').size() === 1) {
        svgPhen2 = svgChart.select('.brc-chart-phen2');
        gPhen2 = svgPhen2.select('.brc-chart-phen2-g');
        init = false;
      } else if (svgChart.select("#".concat(safeId(taxon))).size()) {
        svgPhen2 = svgChart.select("#".concat(safeId(taxon)));
        gPhen2 = svgPhen2.select('.brc-chart-phen2-g');
        init = false;
      } else {
        svgPhen2 = svgChart.append('svg').classed('brc-chart-phen2', true).attr('id', safeId(taxon)).style('overflow', 'visible');
        gPhen2 = svgPhen2.append('g').classed('brc-chart-phen2-g', true);
        init = true;
      } // Create/update the band rectangles with D3


      var mrects = gPhen2.selectAll("rect").data(rectData, function (d) {
        return d.id;
      });
      var erects = mrects.enter().append("rect").attr("class", function (d) {
        return "phen-rect-".concat(d["class"], " phen-rect");
      }).attr("width", 0).attr("height", 0).attr("x", function (d) {
        return xScale(d.start + (d.end - d.start) / 2);
      });
      addEventHandlers(erects, 'class');
      transPromise(mrects.merge(erects).transition().duration(duration).attr("width", function (d) {
        return xScale(d.end) - xScale(d.start);
      }).attr("height", split ? height / metricsPlus.length : height).attr("x", function (d) {
        return xScale(d.start);
      }).attr("y", function (d) {
        return split ? d.iMetric * height / metricsPlus.length : 0;
      }).attr("opacity", function (d) {
        return d.opacity;
      }).attr("fill", function (d) {
        return d.colour;
      }), pTrans);
      transPromise(mrects.exit().transition().duration(duration).attr("width", 0).attr("height", 0).remove(), pTrans);

      if (init) {
        // Constants for positioning
        var axisPadX = chartPad;
        var axisPadY = axisBottom === 'tick' ? 15 : 0;
        var labelPadY; // Taxon title

        if (showTaxonLabel) {
          var taxonLabel = svgPhen2.append('text').classed('brc-chart-phen2-label', true).text(taxon) //.style('font-family', font)
          .style('font-size', taxonLabelFontSize).style('font-style', taxonLabelItalics ? 'italic' : '');
          var labelHeight = taxonLabel.node().getBBox().height;
          taxonLabel.attr("transform", "translate(".concat(axisPadX, ", ").concat(labelHeight, ")"));
          labelPadY = labelHeight * 1.5;
        } else {
          labelPadY = 0;
        } // Size SVG


        svgPhen2.attr('width', width + axisPadX + 1).attr('height', height + axisPadY + labelPadY + 1); // Position chart

        gPhen2.attr("transform", "translate(".concat(axisPadX, ",").concat(labelPadY, ")")); // Create axes and position within SVG

        if (xAxis1 && xAxis2) {
          // const gXaxis = svgPhen2.append("g")
          //   .attr("class", "x axis")
          //   .style('font-size', monthFontSize)
          //   .call(xAxis)
          var gXaxis1 = svgPhen2.append("g").attr("class", "x axis").style('font-size', monthFontSize).call(xAxis1);
          var gXaxis2 = svgPhen2.append("g").attr("class", "x axis").style('font-size', monthFontSize).call(xAxis2); // gXaxis.selectAll(".tick text")
          //   .style("text-anchor", "start")
          //   .attr("x", 6)
          //   .attr("y", 6)

          gXaxis2.selectAll(".tick text").style("text-anchor", "middle");
          gXaxis1.attr("transform", "translate(".concat(axisPadX, ",").concat(height + labelPadY, ")"));
          gXaxis2.attr("transform", "translate(".concat(axisPadX, ",").concat(height + labelPadY, ")")); //gXaxis.attr("transform", `translate(${axisPadX},${height + labelPadY})`)
        }

        if (yAxis) {
          var gYaxis = svgPhen2.append("g") //.attr("class", "y-axis")
          .call(yAxis);
          gYaxis.attr("transform", "translate(".concat(axisPadX, ",").concat(labelPadY, ")"));
        }

        if (tAxis) {
          var gTaxis = svgPhen2.append("g").call(tAxis);
          gTaxis.attr("transform", "translate(".concat(axisPadX, ",").concat(labelPadY, ")"));
        }

        if (rAxis) {
          var gRaxis = svgPhen2.append("g").call(rAxis);
          gRaxis.attr("transform", "translate(".concat(axisPadX + width, ",").concat(labelPadY, ")"));
        }
      } else if (taxa.length === 1) {
        // Update taxon label
        if (showTaxonLabel) {
          svgPhen2.select('.brc-chart-phen2-label').text(taxon);
        }
      }

      return svgPhen2;
    }

    function makeLegend(legendWidth) {
      var swatchSize = 20;
      var swatchFact = 1.3; // Loop through all the legend elements and work out their
      // positions based on swatch size, item lable text size and
      // legend width.

      var rows = 0;
      var lineWidth = -swatchSize; //const metricsSorted = cloneData(metricsPlus).reverse()

      var metricsSorted = cloneData(metricsPlus).filter(function (m) {
        return m.label;
      }).sort(function (a, b) {
        return a.legendOrder > b.legendOrder ? 1 : -1;
      }); // Get the bbox of any SVG icons in metrics

      metricsSorted.filter(function (m) {
        return m.svg;
      }).forEach(function (m) {
        var path = svgChart.append('path').attr('d', m.svg).style('visibility', 'hidden');
        m.svgbbox = path.node().getBBox();
        path.remove();
      });
      metricsSorted.forEach(function (m) {
        var tmpText = svgChart.append('text') //.style('display', 'none')
        .text(m.label) //.style('font-family', font)
        .style('font-size', legendFontSize);
        var widthText = tmpText.node().getBBox().width;
        tmpText.remove();

        if (lineWidth + swatchSize + swatchSize * swatchFact + widthText > legendWidth) {
          ++rows;
          lineWidth = -swatchSize;
        }

        m.x = lineWidth + swatchSize + headPad;
        m.y = rows * swatchSize * swatchFact;
        lineWidth = lineWidth + swatchSize + swatchSize * swatchFact + widthText;
      }); // Note that the stuff below uses the D3 Join general udpate pattern
      // https://observablehq.com/@d3/selection-join
      // Swatch

      var ls = svgChart.selectAll('.brc-legend-item-rect').data(metricsSorted, function (m) {
        return m.id;
      }).join(function (enter) {
        var rect = enter.append("rect").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-rect brc-legend-item-".concat(m.id);
        }).attr('width', swatchSize).attr('height', swatchSize / 2).attr('display', function (m) {
          return m.svg ? 'none' : '';
        });
        return rect;
      }).attr('x', function (m) {
        return m.x;
      }).attr('y', function (m) {
        return m.y + swatchSize / 3;
      }).attr("opacity", function (d) {
        return d.opacity;
      }).attr('fill', function (m) {
        return m.colour;
      }); // SVG icon

      var li = svgChart.selectAll('.brc-legend-item-icon').data(metricsSorted, function (m) {
        return m.id;
      }).join(function (enter) {
        return enter.append("path").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-icon brc-legend-item-".concat(m.id);
        }).attr("d", function (m) {
          return m.svg;
        });
      }) // The transform has to come outside the enter selection so that it is executed whenever
      // the code is called. Important because the bbox stuff only works if gui is visible and
      // the first time this code is called, it may not be visible.
      // The svg is also scaled by a factor passed in the metrics (svgScale) which
      // defaults to 1.
      .attr('transform', function (m) {
        if (m.svg && m.svgbbox && m.svgbbox.width) {
          var iScale = swatchSize / m.svgbbox.width * m.svgScale;
          var xAdj = m.svgbbox.x * iScale;
          var yAdj = m.svgbbox.y * iScale - (swatchSize - m.svgbbox.height * iScale) / 2;
          return "translate(".concat(m.x - xAdj, " ").concat(m.y - yAdj, ") scale(").concat(iScale, " ").concat(iScale, ")");
        } else {
          return '';
        }
      }).attr('fill', function (m) {
        return m.colour;
      }).attr('opacity', function (m) {
        return m.opacity;
      }); // Text

      var lt = svgChart.selectAll('.brc-legend-item-text').data(metricsSorted, function (m) {
        return safeId(m.label);
      }).join(function (enter) {
        var text = enter.append("text").attr("class", function (m) {
          return "brc-legend-item brc-legend-item-text brc-legend-item-".concat(m.id);
        }).text(function (m) {
          return m.label;
        }) //.style('font-family', font)
        .style('font-size', legendFontSize);
        return text;
      }).attr('x', function (m) {
        return m.x + swatchSize * swatchFact * m.svgScale;
      }).attr('y', function (m) {
        return m.y + legendFontSize * 1;
      });
      addEventHandlers(ls, 'label');
      addEventHandlers(lt, 'label');
      addEventHandlers(li, 'label');
      return swatchSize * swatchFact * (rows + 1);
    }

    function highlightItem(cls, highlight) {
      svgChart.selectAll('.phen-rect').classed('lowlight', highlight);
      svgChart.selectAll(".phen-rect-".concat(cls)).classed('lowlight', false);
      svgChart.selectAll(".phen-rect").classed('highlight', false);

      if (cls) {
        svgChart.selectAll(".phen-rect-".concat(cls)).classed('highlight', highlight);
      }

      svgChart.selectAll('.brc-legend-item').classed('lowlight', highlight);

      if (cls) {
        svgChart.selectAll(".brc-legend-item-".concat(cls)).classed('lowlight', false);
      }

      if (cls) {
        svgChart.selectAll(".brc-legend-item-".concat(cls)).classed('highlight', highlight);
      } else {
        svgChart.selectAll(".brc-legend-item").classed('highlight', false);
      }
    }

    function addEventHandlers(sel, prop) {
      sel.on("mouseover", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(safeId(d[prop]), true);
        }
      }).on("mouseout", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(safeId(d[prop]), false);
        }
      }).on("click", function (d) {
        if (interactivity === 'mouseclick') {
          highlightItem(safeId(d[prop]), true);
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
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input data (see main interface for details).
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @returns {Promise} promise resolves when all transitions complete.
      * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
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
        remakeChart = true;
      }

      var pRet;

      if (remakeChart) {
        pRet = makeChart();
        positionMainElements(svg, expand);
      } else {
        pRet = Promise.resolve();
      }

      return pRet;
    }
    /** @function setTaxon
      * @param {string} opts.taxon - The taxon to display.
      * @returns {Promise} promise resolves when all transitions complete.
      * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
      * For single species charts, this allows you to change the taxon displayed.
      */


    function setTaxon(taxon) {
      var pRet;

      if (taxa.length !== 1) {
        console.log("You can only use the setTaxon method when your chart displays a single taxon.");
        pRet = Promise.resolve();
      } else {
        taxa = [taxon];
        pRet = makeChart();
      }

      return pRet;
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /** @function saveImage
      * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
      * @param {string} filename - Name of the file (without extension) to generate and download.
      * If the filename is falsey (e.g. blank), it will not automatically download the
      * file. (Allows caller to do something else with the data URL which is returned
      * as the promise's resolved value.)
      * @returns {Promise} promise object represents the data URL of the image.
      * @description <b>This function is exposed as a method on the API returned from the phen2 function</b>.
      * Download the chart as an image file.
      */


    function saveImage(asSvg, filename) {
      return saveChartImage(svg, expand, asSvg, filename, font);
    }
    /**
     * @typedef {Object} api
     * @property {module:phen2~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:phen2~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:phen2~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:phen2~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
     * @property {module:phen2~saveImage} saveImage - Generates and downloads and image file for the SVG. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon,
      saveImage: saveImage
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
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
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
   * @param {string} opts.axisLabelFontSize - Font size (pixels) for axis labels.
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
        svgAccum = svgChart.append('svg').classed('brc-chart-accum', true).style('overflow', 'visible');
        gAccum = svgAccum.append('g').classed('brc-chart-accum-g', true);
        init = true;
      } // Create/update the line paths with D3


      var mlines = gAccum.selectAll("path").data(lineData, function (d) {
        return d.key;
      });
      var eLines = mlines.enter().append("path") //.attr("class", d => `accum-path accum-path-${d.id}`)
      .attr("class", function (d) {
        return "accum-path accum-path-".concat(d.key);
      }).style("fill", "none").attr("d", function (d) {
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
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
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
    /** @function saveImage
      * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
      * @param {string} filename - Name of the file (without extension) to generate and download.
      * If the filename is falsey (e.g. blank), it will not automatically download the
      * file. (Allows caller to do something else with the data URL which is returned
      * as the promise's resolved value.)
      * @returns {Promise} promise object represents the data URL of the image.
      * @description <b>This function is exposed as a method on the API returned from the accum function</b>.
      * Download the chart as an image file.
      */


    function saveImage(asSvg, filename) {
      return saveChartImage(svg, expand, asSvg, filename);
    }
    /**
     * @typedef {Object} api
     * @property {module:accum~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:accum~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:accum~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:accum~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
     * @property {module:accum~saveImage} saveImage - Generates and downloads and image file for the SVG. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      saveImage: saveImage
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
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
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
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
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
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle. (Default - 16.)
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer. (Default - 10.)
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

    // Store list of currently displayed taxa charts in case of taxa list
    // being updated.
    var currentTaxa = []; // If store explicitly set min and max year so that changes in setChartOpts
    // can be dealt with properly. These can also be reset in setChartOpts.

    var minYearExplicit = minYear;
    var maxYearExplicit = maxYear; // Ensure style prop objects have the required properties.

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
    makeChart();
    makeTexts();

    function makeTexts() {
      // Texts must come after chartbecause 
      // the chart width is required
      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      positionMainElements(svg, expand);
    }

    function makeChart() {
      // Set min and max year from data if not set
      if (!minYearExplicit) {
        minYear = Math.min.apply(Math, _toConsumableArray(data.map(function (d) {
          return d.year;
        })));
      } else {
        minYear = minYearExplicit;
      }

      if (!maxYearExplicit) {
        maxYear = Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
          return d.year;
        })));
      } else {
        maxYear = maxYearExplicit;
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
      var subChartPad = 10; // Delete any existing charts which are not included in the new taxa
      // list - unless there's only one in each

      if (currentTaxa.length === 1 && currentTaxa[0] === '') {
        // This is a dummy taxon to get empty graph displayed.
        // Can't select by id as this is empty string. Select
        // by class.
        svgChart.select('.brc-chart-trend').remove();
      } else if (!(taxa.length === 1 && currentTaxa.length === 1)) {
        currentTaxa.forEach(function (t) {
          if (taxa.indexOf(t) === -1) {
            svgChart.select("#".concat(safeId(t))).remove();
          }
        });
      } // Make charts and update array of current taxa


      var svgsTaxa = taxa.map(function (t) {
        return makeTrend(t, yearTotals);
      });
      currentTaxa = taxa;
      var subChartWidth, subChartHeight;

      if (svgsTaxa.length) {
        subChartWidth = Number(svgsTaxa[0].attr("width"));
        subChartHeight = Number(svgsTaxa[0].attr("height"));
      } else {
        // No taxa specified
        subChartWidth = Number(width);
        subChartHeight = Number(height);
      }

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
      }))); //yMaxProp = yMaxProp < 0.005 ? 0.005 : yMaxProp // Prevents tiny values

      yMaxProp = yMaxProp < 0.001 ? 0.001 : yMaxProp; // Prevents tiny values

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
            //format = yMaxProp < 0.01 ? d3.format(".2%") : d3.format(".0%")
            if (yMaxProp < 0.01) {
              format = d3.format(".2%");
            } else if (yMaxProp < 0.05) {
              format = d3.format(".1%");
            } else {
              format = d3.format(".0%");
            }

            axis = d3axis.scale(yScaleProps).ticks(5).tickFormat(format);
            break;
        }

        return axis;
      };

      var lAxis = makeXaxis('left', axisLeft);
      var rAxis = makeXaxis('right', axisRight); // Create or get the relevant chart svg

      var init, svgTrend, gTrend, gTrendRect, gTrendPath;

      if (taxa.length === 1 && svgChart.selectAll('.brc-chart-trend').size() === 1) {
        svgTrend = svgChart.select('.brc-chart-trend');
        gTrend = svgTrend.select('.brc-chart-trend-g');
        gTrendPath = svgTrend.select('.brc-chart-trend-g-path');
        gTrendRect = svgTrend.select('.brc-chart-trend-g-rect');
        init = false;
      } else if (svgChart.select("#".concat(safeId(taxon))).size()) {
        svgTrend = svgChart.select("#".concat(safeId(taxon)));
        gTrend = svgTrend.select('.brc-chart-trend-g');
        gTrendPath = svgTrend.select('.brc-chart-trend-g-path');
        gTrendRect = svgTrend.select('.brc-chart-trend-g-rect');
        init = false;
      } else {
        svgTrend = svgChart.append('svg').classed('brc-chart-trend', true).attr('id', safeId(taxon)).style('overflow', 'visible');
        gTrend = svgTrend.append('g').classed('brc-chart-trend-g', true); // Add these in correct order so that lines are
        // always shown above bars

        gTrendRect = gTrend.append('g').classed('brc-chart-trend-g-rect', true);
        gTrendPath = gTrend.append('g').classed('brc-chart-trend-g-path', true);
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
      gTrendRect.selectAll("rect").data(chartBars, function (d) {
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
      }).attr('x', function (d) {
        return xScaleBar(d.year);
      }).attr('width', xScaleBar.bandwidth()).attr('height', function (d) {
        return height - d.n;
      }).attr("fill", function (d) {
        return d.colour;
      });
      gTrendPath.selectAll("path").data(chartLines, function (d) {
        return d.type;
      }).join(function (enter) {
        return enter.append("path").attr("class", function (d) {
          return "trend-type-".concat(d.type);
        }).attr("opacity", function (d) {
          return d.opacity;
        }).attr("fill", "none").attr("stroke", function (d) {
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
          var gBaxis = svgTrend.append("g").attr("class", "x axis b-axis").call(bAxis);
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

      if (svgTrend.selectAll(".b-axis").size()) {
        svgTrend.select(".b-axis").transition().duration(duration).call(bAxis);
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
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {string} opts.taxa - A list of taxa to create charts for.
      * @param {string} opts.group - A list of taxa to used to calculate group totals for percentage of group records.
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

      if ('footerAlign' in opts) {
        footerAlign = opts.footerAlign;
      }

      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      var remakeChart = false;
      var remakeTexts = false;

      if ('minYear' in opts) {
        minYearExplicit = opts.minYear;
        remakeChart = true;
      }

      if ('maxYear' in opts) {
        maxYearExplicit = opts.maxYear;
        remakeChart = true;
      }

      if ('data' in opts) {
        data = opts.data;
        remakeChart = true;
      }

      if ('taxa' in opts) {
        taxa = opts.taxa;
        remakeChart = true;
        remakeTexts = true;
      }

      if ('group' in opts) {
        group = opts.group;
        remakeChart = true;
      }

      if (remakeChart) {
        highlightItem(null, false);
        makeChart();
      }

      if (remakeTexts) makeTexts();
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
    /** @function saveImage
      * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
      * @param {string} filename - Name of the file (without extension) to generate and download.
      * If the filename is falsey (e.g. blank), it will not automatically download the
      * file. (Allows caller to do something else with the data URL which is returned
      * as the promise's resolved value.)
      * @returns {Promise} promise object represents the data URL of the image.
      * @description <b>This function is exposed as a method on the API returned from the trend function</b>.
      * Download the chart as an image file.
      */


    function saveImage(asSvg, filename) {
      return saveChartImage(svg, expand, asSvg, filename);
    }
    /**
     * @typedef {Object} api
     * @property {module:trend~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:trend~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:trend~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:trend~setTaxon} setTaxon - Changes the displayed taxon for single taxon charts. 
     * @property {module:trend~saveImage} saveImage - Generates and downloads and image file for the SVG. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon,
      saveImage: saveImage
    };
  }

  function trend2() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'trend2-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 35,
      right: 0,
      top: 20,
      bottom: 5
    } : _ref$margin,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'tick' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? '' : _ref$axisLeftLabel,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$yearMin = _ref.yearMin,
        yearMin = _ref$yearMin === void 0 ? null : _ref$yearMin,
        _ref$yearMax = _ref.yearMax,
        yearMax = _ref$yearMax === void 0 ? null : _ref$yearMax,
        _ref$yMin = _ref.yMin,
        yMin = _ref$yMin === void 0 ? null : _ref$yMin,
        _ref$yMax = _ref.yMax,
        yMax = _ref$yMax === void 0 ? null : _ref$yMax,
        _ref$adjust = _ref.adjust,
        adjust = _ref$adjust === void 0 ? true : _ref$adjust,
        _ref$ylines = _ref.ylines,
        ylines = _ref$ylines === void 0 ? [] : _ref$ylines,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$means = _ref.means,
        means = _ref$means === void 0 ? [] : _ref$means,
        _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style;

    // Ensure default style properties are present
    style.vStroke = style.vStroke ? style.vStroke : 'black';
    style.vStrokeWidth = style.vStrokeWidth ? style.vStrokeWidth : 2;
    style.cStroke = style.cStroke ? style.cStroke : 'black';
    style.cStrokeWidth = style.cStrokeWidth ? style.cStrokeWidth : 1;
    style.cFill = style.cFill ? style.cFill : 'silver';
    style.mFill = style.mFill ? style.mFill : 'white';
    style.mRad = style.mRad ? style.mRad : 2;
    style.mStroke = style.mStroke ? style.mStroke : 'black';
    style.mStrokeWidth = style.mStrokeWidth ? style.mStrokeWidth : 1;
    style.sdStroke = style.sdStroke ? style.sdStroke : 'black';
    style.sdStrokeWidth = style.sdStrokeWidth ? style.sdStrokeWidth : 1;
    var updateChart = makeChart(yMin, yMax, adjust, yearMin, yearMax, data, means, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style);
    return {
      updateChart: updateChart
    };
  }

  function maxYear(data) {
    return Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
      return d.year;
    })));
  }

  function minYear(data) {
    return Math.min.apply(Math, _toConsumableArray(data.map(function (d) {
      return d.year;
    })));
  }

  function maxY(data, means) {
    var dMax = Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
      return d.upper ? d.upper : d.value;
    })));
    var mMax = Math.max.apply(Math, _toConsumableArray(means.map(function (d) {
      return d.mean + d.sd;
    })));
    return Math.max(dMax, mMax);
  }

  function minY(data, means) {
    var dMin = Math.min.apply(Math, _toConsumableArray(data.map(function (d) {
      return d.lower ? d.lower : d.value;
    })));
    var mMin = Math.min.apply(Math, _toConsumableArray(means.map(function (d) {
      return d.mean - d.sd;
    })));
    return Math.min(dMin, mMin);
  }

  function makeChart(yMin, yMax, adjust, yearMin, yearMax, data, means, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style) {
    var svgWidth = width + margin.left + margin.right;
    var svgHeight = height + margin.top + margin.bottom; // Append the chart svg

    var svgTrend = d3.select("".concat(selector)).append('svg').attr('id', elid); // Size the chart svg

    if (expand) {
      svgTrend.attr("viewBox", "0 0 ".concat(svgWidth, " ").concat(svgHeight));
    } else {
      svgTrend.attr("width", svgWidth);
      svgTrend.attr("height", svgHeight);
    } // Axis labels


    if (axisLeftLabel) {
      svgTrend.append("text").attr("transform", "translate(".concat(axisLabelFontSize, ",").concat(margin.top + height / 2, ") rotate(270)")).style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
    } // Create axes and position within SVG


    var tAxis, bAxis, lAxis, rAxis;

    if (axisLeft === 'on' || axisLeft === 'tick') {
      lAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisBottom === 'on' || axisBottom === 'tick') {
      bAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top + height, ")"));
    }

    if (axisTop === 'on') {
      tAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisRight === 'on') {
      rAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left + width, ", ").concat(margin.top, ")"));
    } // Create g element for chart elements


    var gChart1 = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    var gChart2 = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")); // Create the API function for updating chart

    var updateChart = makeUpdateChart(svgTrend, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, style); // Update the chart with current data

    updateChart(data, means, yearMin, yearMax, yMin, yMax, adjust, ylines); // Return the api

    return updateChart;
  }

  function makeUpdateChart(svg, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, style) {
    return function (data, means, yearMin, yearMax, yMin, yMax, adjust, ylines) {
      // Set ylines to empty array if not set
      if (!ylines) {
        ylines = [];
      } // Data


      var dataWork = data.sort(function (a, b) {
        return a.year > b.year ? 1 : -1;
      }); // Adjustments

      var yMinBuff, yMaxBuff;

      if (yMin !== null && yMax !== null && typeof yMin !== 'undefined' && typeof yMax !== 'undefined') {
        yMinBuff = yMin;
        yMaxBuff = yMax;

        if (adjust) {
          if (minY(dataWork, means) < yMinBuff) yMinBuff = minY(dataWork, means);
          if (maxY(dataWork, means) > yMaxBuff) yMaxBuff = maxY(dataWork, means); // Add a margin to min/max values

          yMinBuff = yMinBuff - (yMaxBuff - yMinBuff) / 50;
          yMaxBuff = yMaxBuff + (yMaxBuff - yMinBuff) / 50;
        }
      } else {
        yMinBuff = minY(dataWork, means);
        yMaxBuff = maxY(dataWork, means); // Add a margin to min/max values

        yMinBuff = yMinBuff - (yMaxBuff - yMinBuff) / 50;
        yMaxBuff = yMaxBuff + (yMaxBuff - yMinBuff) / 50;
      }

      var yearMinData = minYear(dataWork);
      var yearMaxData = maxYear(dataWork);
      var yearMinBuff, yearMaxBuff;

      if (yearMin) {
        yearMinBuff = yearMin;
      } else {
        yearMinBuff = Math.floor(yearMinData - (yearMaxData - yearMinData) / 50);
      }

      if (yearMax) {
        yearMaxBuff = yearMax;
      } else {
        yearMaxBuff = Math.floor(yearMaxData + (yearMaxData - yearMinData) / 50);
      } // Value scales


      var xScale = d3.scaleLinear().domain([yearMinBuff, yearMaxBuff]).range([0, width]);
      var yScale = d3.scaleLinear().domain([yMinBuff, yMaxBuff]).range([height, 0]); // Generate axes

      if (tAxis) {
        tAxis.call(d3.axisTop().scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0));
      }

      if (bAxis) {
        bAxis.transition().duration(duration).call(xAxisYear(width, axisBottom === 'tick', yearMinBuff, yearMaxBuff, false));
      }

      if (lAxis) {
        lAxis.transition().duration(duration).call(d3.axisLeft().scale(yScale).ticks(5));
      }

      if (rAxis) {
        rAxis.call(d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0));
      } // Line path generator


      var linePath = d3.line() //.curve(d3.curveMonotoneX)
      .x(function (d) {
        return xScale(d.y);
      }).y(function (d) {
        return yScale(d.v);
      }); // Main data line

      var vData = data.map(function (p) {
        return {
          y: p.year,
          v: p.value
        };
      });
      d3Line(gChart2, linePath, duration, vData, 'valueLine', style.vStroke, style.vStrokeWidth, 'none'); // Upper confidence line

      var uData = data.map(function (p) {
        return {
          y: p.year,
          v: p.upper
        };
      });
      d3Line(gChart2, linePath, duration, uData, 'upperLine', style.cStroke, style.cStrokeWidth, 'none'); // Upper confidence line

      var lData = data.map(function (p) {
        return {
          y: p.year,
          v: p.lower
        };
      });
      d3Line(gChart2, linePath, duration, lData, 'lowerLine', style.cStroke, style.cStrokeWidth, 'none'); // Confidence polygon

      lData.sort(function (a, b) {
        return b.y - a.y;
      }); // Reverse order of lData

      var pData = [].concat(_toConsumableArray(uData), _toConsumableArray(lData));
      d3Line(gChart1, linePath, duration, pData, 'confidence', 'none', 0, style.cFill); // Mean and SDs

      var tMeans = means.map(function (p) {
        return {
          x: xScale(p.year),
          y: yScale(p.mean),
          bar: linePath([{
            y: p.year,
            v: p.mean - p.sd
          }, {
            y: p.year,
            v: p.mean + p.sd
          }])
        };
      });
      d3MeanSd(gChart2, linePath, duration, tMeans, style); // Add path to ylines and generate

      ylines.forEach(function (l) {
        l.path = linePath([{
          y: yearMinBuff,
          v: l.y
        }, {
          y: yearMaxBuff,
          v: l.y
        }]);
      });
      var tYlines = ylines.filter(function (l) {
        return l.y >= yMinBuff && l.y <= yMaxBuff;
      });
      d3Yline(gChart1, tYlines, duration);
    };
  }

  function d3Line(gChart, linePath, duration, data, lClass, stroke, strokeWidth, fill) {
    var aData;

    if (data.length === 0) {
      aData = data;
    } else {
      aData = [data];
    }

    gChart.selectAll(".".concat(lClass)).data(aData).join(function (enter) {
      return enter.append('path').attr("d", function (d) {
        return linePath(d);
      }).attr('class', lClass).style('fill', fill).style('stroke', stroke).style('stroke-width', strokeWidth).attr("opacity", 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr("d", function (d) {
      return linePath(d);
    }).attr("opacity", 1);
  }

  function d3MeanSd(gChart, linePath, duration, means, style) {
    //console.log(means)
    //console.log(style)
    // SDs
    gChart.selectAll('.sds').data(means).join(function (enter) {
      return enter.append('path').attr('d', function (d) {
        return d.bar;
      }).attr('class', 'sds').style('stroke', style.sdStroke).style('stroke-width', style.sdStrokeWidth).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr('d', function (d) {
      return d.bar;
    }).style('opacity', 1); // Means

    gChart.selectAll('.means').data(means).join(function (enter) {
      return enter.append('circle').attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).attr('r', style.mRad).attr('class', 'means').style('fill', style.mFill).style('stroke', style.mStroke).style('stroke-width', style.mStrokeWidth).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    }).style('opacity', 1);
  }

  function d3Yline(gChart, ylines, duration) {
    // Horizontal y lines
    gChart.selectAll('.ylines').data(ylines).join(function (enter) {
      return enter.append('path').attr('d', function (d) {
        return d.path;
      }).attr('class', 'ylines').style('stroke', function (d) {
        return d.stroke;
      }).style('stroke-width', function (d) {
        return d.strokeWidth;
      }).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr('d', function (d) {
      return d.path;
    }).style('opacity', 1);
  }

  function trend3() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'trend3-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 35,
      right: 0,
      top: 20,
      bottom: 5
    } : _ref$margin,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'tick' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? '' : _ref$axisLeftLabel,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$yearMin = _ref.yearMin,
        yearMin = _ref$yearMin === void 0 ? 1949 : _ref$yearMin,
        _ref$yearMax = _ref.yearMax,
        yearMax = _ref$yearMax === void 0 ? 2019 : _ref$yearMax,
        _ref$yMin = _ref.yMin,
        yMin = _ref$yMin === void 0 ? null : _ref$yMin,
        _ref$yMax = _ref.yMax,
        yMax = _ref$yMax === void 0 ? null : _ref$yMax,
        _ref$adjust = _ref.adjust,
        adjust = _ref$adjust === void 0 ? false : _ref$adjust,
        _ref$ylines = _ref.ylines,
        ylines = _ref$ylines === void 0 ? [] : _ref$ylines,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$means = _ref.means,
        means = _ref$means === void 0 ? [] : _ref$means,
        _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style;

    // Ensure default style properties are present
    style.vStroke = style.vStroke ? style.vStroke : 'black';
    style.vStrokeWidth = style.vStrokeWidth ? style.vStrokeWidth : 2;
    style.vOpacity = style.vOpacity ? style.vOpacity : 0.1;
    style.mFill = style.mFill ? style.mFill : 'white';
    style.mRad = style.mRad ? style.mRad : 2;
    style.mStroke = style.mStroke ? style.mStroke : 'black';
    style.mStrokeWidth = style.mStrokeWidth ? style.mStrokeWidth : 1;
    style.sdStroke = style.sdStroke ? style.sdStroke : 'black';
    style.sdStrokeWidth = style.sdStrokeWidth ? style.sdStrokeWidth : 1;
    var updateChart = makeChart$1(yMin, yMax, adjust, yearMin, yearMax, data, means, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style);
    return {
      updateChart: updateChart
    };
  }

  function maxY$1(data, means) {
    var dMax = Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
      return Math.max(d[0].v, d[1].v);
    })));
    var mMax = Math.max.apply(Math, _toConsumableArray(means.map(function (d) {
      return d.mean + d.sd;
    })));
    return Math.max(dMax, mMax);
  }

  function minY$1(data, means) {
    var dMin = Math.min.apply(Math, _toConsumableArray(data.map(function (d) {
      return Math.min(d[0].v, d[1].v);
    })));
    var mMin = Math.min.apply(Math, _toConsumableArray(means.map(function (d) {
      return d.mean - d.sd;
    })));
    return Math.min(dMin, mMin);
  }

  function makeChart$1(yMin, yMax, adjust, yearMin, yearMax, data, means, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration, style) {
    var svgWidth = width + margin.left + margin.right;
    var svgHeight = height + margin.top + margin.bottom; // Append the chart svg

    var svgTrend = d3.select("".concat(selector)).append('svg').attr('id', elid); // Size the chart svg

    if (expand) {
      svgTrend.attr("viewBox", "0 0 ".concat(svgWidth, " ").concat(svgHeight));
    } else {
      svgTrend.attr("width", svgWidth);
      svgTrend.attr("height", svgHeight);
    } // Axis labels


    if (axisLeftLabel) {
      svgTrend.append("text").attr("transform", "translate(".concat(axisLabelFontSize, ",").concat(margin.top + height / 2, ") rotate(270)")).style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
    } // Create axes and position within SVG


    var tAxis, bAxis, lAxis, rAxis;

    if (axisLeft === 'on' || axisLeft === 'tick') {
      lAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisBottom === 'on' || axisBottom === 'tick') {
      bAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top + height, ")"));
    }

    if (axisTop === 'on') {
      tAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisRight === 'on') {
      rAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left + width, ", ").concat(margin.top, ")"));
    } // Create g element for chart elements


    var gChart1 = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    var gChart2 = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")); // Create the API function for updating chart

    var updateChart = makeUpdateChart$1(svgTrend, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, style); // Update the chart with current data

    updateChart(data, means, yearMin, yearMax, yMin, yMax, adjust, ylines); // Return the api

    return updateChart;
  }

  function makeUpdateChart$1(svg, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, style) {
    return function (data, means, yearMin, yearMax, yMin, yMax, adjust, ylines) {
      // Set ylines to empty array if not set
      if (!ylines) {
        ylines = [];
      } // Convert data from an array of gradients and intercepts to an array 
      // of arrays of two point lines


      var dataWork = data.map(function (d) {
        var yStart = d.gradient * yearMin + d.intercept;
        var yEnd = d.gradient * yearMax + d.intercept;
        return [{
          y: yearMin,
          v: yStart
        }, {
          y: yearMax,
          v: yEnd
        }];
      }); // Adjustments

      var yMinBuff, yMaxBuff;

      if (yMin !== null && yMax !== null && typeof yMin !== 'undefined' && typeof yMax !== 'undefined') {
        yMinBuff = yMin;
        yMaxBuff = yMax;

        if (adjust) {
          if (minY$1(dataWork, means) < yMinBuff) yMinBuff = minY$1(dataWork, means);
          if (maxY$1(dataWork, means) > yMaxBuff) yMaxBuff = maxY$1(dataWork, means); // Add a margin to min/max values

          yMinBuff = yMinBuff - (yMaxBuff - yMinBuff) / 50;
          yMaxBuff = yMaxBuff + (yMaxBuff - yMinBuff) / 50;
        }
      } else {
        yMinBuff = minY$1(dataWork, means);
        yMaxBuff = maxY$1(dataWork, means); // Add a margin to min/max values

        yMinBuff = yMinBuff - (yMaxBuff - yMinBuff) / 50;
        yMaxBuff = yMaxBuff + (yMaxBuff - yMinBuff) / 50;
      }

      var yearMinBuff = yearMin;
      var yearMaxBuff = yearMax; // Value scales

      var xScale = d3.scaleLinear().domain([yearMinBuff, yearMaxBuff]).range([0, width]);
      var yScale = d3.scaleLinear().domain([yMinBuff, yMaxBuff]).range([height, 0]); // Generate axes

      if (tAxis) {
        tAxis.call(d3.axisTop().scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0));
      }

      if (bAxis) {
        bAxis.transition().duration(duration).call(xAxisYear(width, axisBottom === 'tick', yearMinBuff, yearMaxBuff, false));
      }

      if (lAxis) {
        lAxis.transition().duration(duration).call(d3.axisLeft().scale(yScale).ticks(5));
      }

      if (rAxis) {
        rAxis.call(d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0));
      } // Line path generator


      var linePath = d3.line() //.curve(d3.curveMonotoneX)
      .x(function (d) {
        return xScale(d.y);
      }).y(function (d) {
        return yScale(d.v);
      }); // Main data line

      d3Line$1(gChart2, linePath, duration, dataWork, style); // Mean and SDs

      var tMeans = means.map(function (p) {
        return {
          x: xScale(p.year),
          y: yScale(p.mean),
          bar: linePath([{
            y: p.year,
            v: p.mean - p.sd
          }, {
            y: p.year,
            v: p.mean + p.sd
          }]),
          barStart: linePath([{
            y: p.year,
            v: yMinBuff
          }, {
            y: p.year,
            v: yMinBuff
          }])
        };
      });
      d3MeanSd$1(gChart2, linePath, yScale(yMinBuff), duration, tMeans, style); // Add path to ylines and generate

      ylines.forEach(function (l) {
        l.path = linePath([{
          y: yearMinBuff,
          v: l.y
        }, {
          y: yearMaxBuff,
          v: l.y
        }]);
      });
      var tYlines = ylines.filter(function (l) {
        return l.y >= yMinBuff && l.y <= yMaxBuff;
      });
      d3Yline$1(gChart1, tYlines, duration);
    };
  }

  function d3Line$1(gChart, linePath, duration, data, style) {
    gChart.selectAll('.trend-line').data(data).join(function (enter) {
      return enter.append('path').attr("d", function (d) {
        return linePath(d);
      }).attr('class', 'trend-line').style('stroke', style.vStroke).style('stroke-width', style.vStrokeWidth).attr("opacity", 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr("d", function (d) {
      return linePath(d);
    }).attr("opacity", style.vOpacity);
  }

  function d3MeanSd$1(gChart, linePath, yMinBuff, duration, means, style) {
    // SDs
    gChart.selectAll('.sds').data(means).join(function (enter) {
      return enter.append('path').attr('d', function (d) {
        return d.bar;
      }).attr('class', 'sds').style('stroke', style.sdStroke).style('stroke-width', style.sdStrokeWidth).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr('d', function (d) {
      return d.bar;
    }).style('opacity', 1); // Means

    gChart.selectAll('.means').data(means).join(function (enter) {
      return enter.append('circle').attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).attr('r', style.mRad).attr('class', 'means').style('fill', style.mFill).style('stroke', style.mStroke).style('stroke-width', style.mStrokeWidth).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    }).style('opacity', 1);
  }

  function d3Yline$1(gChart, ylines, duration) {
    // Horizontal y lines
    gChart.selectAll('.ylines').data(ylines).join(function (enter) {
      return enter.append('path').attr('d', function (d) {
        return d.path;
      }).attr('class', 'ylines').style('stroke', function (d) {
        return d.stroke;
      }).style('stroke-width', function (d) {
        return d.strokeWidth;
      }).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.transition().duration(duration).style("opacity", 0).remove();
    }) // Join returns merged enter and update selection
    .transition().duration(duration).attr('d', function (d) {
      return d.path;
    }).style('opacity', 1);
  }

  function density() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'density-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 35,
      right: 0,
      top: 20,
      bottom: 5
    } : _ref$margin,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'tick' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? '' : _ref$axisLeftLabel,
        _ref$axisBottomLabel = _ref.axisBottomLabel,
        axisBottomLabel = _ref$axisBottomLabel === void 0 ? '' : _ref$axisBottomLabel,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$xMin = _ref.xMin,
        xMin = _ref$xMin === void 0 ? null : _ref$xMin,
        _ref$xMax = _ref.xMax,
        xMax = _ref$xMax === void 0 ? null : _ref$xMax,
        _ref$ylines = _ref.ylines,
        ylines = _ref$ylines === void 0 ? [] : _ref$ylines,
        _ref$xlines = _ref.xlines,
        xlines = _ref$xlines === void 0 ? [] : _ref$xlines,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$styles = _ref.styles,
        styles = _ref$styles === void 0 ? [] : _ref$styles,
        _ref$scaleHeight = _ref.scaleHeight,
        scaleHeight = _ref$scaleHeight === void 0 ? false : _ref$scaleHeight;

    var updateChart = makeChart$2(xMin, xMax, data, xlines, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisBottomLabel, axisLabelFontSize, duration, styles, scaleHeight);
    return {
      updateChart: updateChart,
      saveImage: function saveImage(asSvg, filename) {
        console.log('generate density image');
        saveChartImage(d3.select("#".concat(elid)), expand, asSvg, filename);
      }
    };
  }

  function maxX(data) {
    return Math.max.apply(Math, _toConsumableArray(data.map(function (ds) {
      return Math.max.apply(Math, _toConsumableArray(ds.map(function (d) {
        return d.slope;
      })));
    })));
  }

  function minX(data) {
    return Math.min.apply(Math, _toConsumableArray(data.map(function (ds) {
      return Math.min.apply(Math, _toConsumableArray(ds.map(function (d) {
        return d.slope;
      })));
    })));
  }

  function makeChart$2(xMin, xMax, data, xlines, ylines, selector, elid, width, height, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisBottomLabel, axisLabelFontSize, duration, styles, scaleHeight) {
    var svgWidth = width + margin.left + margin.right;
    var svgHeight = height + margin.top + margin.bottom; // Append the chart svg

    var svgDensity = d3.select("".concat(selector)).append('svg').attr('id', elid); // Size the chart svg

    if (expand) {
      svgDensity.attr("viewBox", "0 0 ".concat(svgWidth, " ").concat(svgHeight));
    } else {
      svgDensity.attr("width", svgWidth);
      svgDensity.attr("height", svgHeight);
    } // Axis labels


    if (axisLeftLabel) {
      svgDensity.append("text").attr("transform", "translate(".concat(axisLabelFontSize, ",").concat(margin.top + height / 2, ") rotate(270)")).style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
    }

    if (axisBottomLabel) {
      svgDensity.append("text").attr("transform", "translate(".concat(margin.left + width / 2, ",").concat(margin.top + height + margin.bottom - axisLabelFontSize, ")")).style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisBottomLabel);
    } // Create axes and position within SVG


    var tAxis, bAxis, lAxis, rAxis;

    if (axisLeft === 'on' || axisLeft === 'tick') {
      lAxis = svgDensity.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisBottom === 'on' || axisBottom === 'tick') {
      bAxis = svgDensity.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top + height, ")"));
    }

    if (axisTop === 'on') {
      tAxis = svgDensity.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisRight === 'on') {
      rAxis = svgDensity.append("g").attr("transform", "translate(".concat(margin.left + width, ", ").concat(margin.top, ")"));
    } // Create g element for chart elements


    var gChart1 = svgDensity.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    var gChart2 = svgDensity.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")); // Create the API function for updating chart

    var updateChart = makeUpdateChart$2(svgDensity, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, styles); // Update the chart with current data

    updateChart(data, xMin, xMax, xlines, ylines, scaleHeight); // Return the api

    return updateChart;
  }

  function makeUpdateChart$2(svg, width, height, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart1, gChart2, styles) {
    return function (data, xMin, xMax, xlines, ylines, scaleHeight) {
      // d3 transition object
      var t = svg.transition().duration(duration);
      var pTrans = []; // Set ylines and xlines to empty array if not set

      if (!xlines) xlines = [];
      if (!ylines) ylines = []; // Data - do any data pre-processing here

      var dataWork = data; // Adjustments - do any min/max adjustments here

      var xMinBuff, xMaxBuff;

      if (xMin !== null && xMax !== null && typeof xMin !== 'undefined' && typeof xMax !== 'undefined') {
        xMinBuff = xMin;
        xMaxBuff = xMax;
      } else {
        xMinBuff = minX(dataWork);
        xMaxBuff = maxX(dataWork); // Add a margin to min/max values

        xMinBuff = xMinBuff - (xMaxBuff - xMinBuff) / 50;
        xMaxBuff = xMaxBuff + (xMaxBuff - xMinBuff) / 50;
      } // X value scale


      var xScale = d3.scaleLinear().domain([xMinBuff, xMaxBuff]).range([0, width]); // !!!!!!!!!!!!!!!! Non-general custom scale required for BSBI atlas

      var custScale = d3.scaleOrdinal().domain(['', '- -', '-', '0', '+', '+ +', '']).range([xScale(xMinBuff), xScale(-0.004 - (-0.004 - xMinBuff) / 2), xScale(-0.0025), xScale(0), xScale(0.0025), xScale(0.004 + (xMaxBuff - 0.004) / 2), xScale(xMaxBuff)]); // Compute kernel density estimation

      var bandwidths = dataWork.map(function (ds) {
        var dataMin = Math.min.apply(Math, _toConsumableArray(ds.map(function (d) {
          return d.slope;
        })));
        var dataMax = Math.max.apply(Math, _toConsumableArray(ds.map(function (d) {
          return d.slope;
        })));
        var workMin = xMin === null ? dataMin : dataMin < xMin ? xMin : dataMin;
        var workMax = xMax === null ? dataMax : dataMax > xMax ? xMax : dataMax;
        return (workMax - workMin) / 8;
      }); //console.log('bandwidths', bandwidths)

      var densities = dataWork.map(function (ds, i) {
        //const ticks =  xScale.ticks(100)
        var incr = (xMaxBuff - xMinBuff) / 99;
        var ticks = d3.range(xMinBuff, xMaxBuff + incr, incr); // For transitions need consistent number of ticks

        var kde = kernelDensityEstimator(kernelEpanechnikov(bandwidths[i]), ticks);
        return kde(ds.map(function (d) {
          return d.slope;
        }));
      }); // For some reason which I don't understand, x values can occassionally overshoot
      // xMaxBuff - so correct.

      densities.forEach(function (ds) {
        ds.forEach(function (d) {
          if (d[0] > xMaxBuff) d[0] = xMaxBuff;
        });
      }); // Y value scales must be done on the density values
      // Add a buffer of 1/50 range so y value doesn't go to top of chart
      // Create an overall scale.

      var maxDensity = Math.max.apply(Math, _toConsumableArray(densities.map(function (ds) {
        return Math.max.apply(Math, _toConsumableArray(ds.map(function (d) {
          return d[1];
        })));
      })));
      var yScale = d3.scaleLinear().domain([0, maxDensity * 1.02]).range([height, 0]); // Create a Y scale for each density curve. If the value of scaleHeight is set to false,
      // these scales will all be identical, but if set to true then they will differ so that
      // maximum value of each curve achieves the same height.

      var yScales = densities.map(function (ds) {
        if (scaleHeight) {
          var _maxDensity = Math.max.apply(Math, _toConsumableArray(ds.map(function (d) {
            return d[1];
          })));

          return d3.scaleLinear().domain([0, _maxDensity * 1.02]).range([height, 0]);
        } else {
          return yScale;
        }
      }); // Generate axes

      if (tAxis) {
        transPromise(tAxis.transition(t).call(d3.axisTop().scale(data.length ? custScale : xScale).tickSize([0]).ticks(5).tickSizeOuter(0)), pTrans);
      }

      if (bAxis) {
        transPromise(bAxis.transition(t).call(d3.axisBottom().scale(xScale).ticks(5)), pTrans);
      }

      if (lAxis) {
        transPromise(lAxis.transition(t).call(d3.axisLeft().scale(yScale).tickValues([])), pTrans); //.ticks(5))
      }

      if (rAxis) {
        rAxis.call(d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0));
      } // Line path generator


      var linePath = d3.line().curve(d3.curveMonotoneX).x(function (d) {
        return xScale(d[0]);
      }).y(function (d) {
        return yScale(d[1]);
      });
      var linePaths = yScales.map(function (s) {
        return d3.line().curve(d3.curveMonotoneX).x(function (d) {
          return xScale(d[0]);
        }).y(function (d) {
          return s(d[1]);
        });
      });

      if (dataWork.length) ; // Generate density lines


      pTrans = [].concat(_toConsumableArray(pTrans), _toConsumableArray(d3Density(gChart1, densities, linePaths, styles, t))); // Add path to ylines and generate

      ylines.forEach(function (l) {
        l.path = linePath([[xMinBuff, l.y], [xMaxBuff, l.y]]);
      });
      pTrans = [].concat(_toConsumableArray(pTrans), _toConsumableArray(d3Line$2(gChart1, ylines, 'ylines', t))); // Add path to xlines and generate

      xlines.forEach(function (l) {
        l.path = linePath([[l.x, 0], [l.x, maxDensity * 1.02]]);
      });
      pTrans = [].concat(_toConsumableArray(pTrans), _toConsumableArray(d3Line$2(gChart1, xlines, 'xlines', t)));
      return Promise.allSettled(pTrans);
    };
  }

  function d3Density(gChart, data, linePaths, styles, t) {
    var pTrans = [];
    gChart.selectAll(".density-line").data(data).join(function (enter) {
      return enter.append('path').attr("opacity", 0).attr("d", function (d, i) {
        return linePaths[i](d);
      }).attr("class", "density-line").style('fill', 'none').style('stroke', function (d, i) {
        return getStyle(styles, i).stroke;
      }).style('stroke-width', function (d, i) {
        return getStyle(styles, i).strokeWidth;
      });
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style("opacity", 0).remove(), pTrans);
      });
    }) // The selection returned by the join function is the merged
    // enter and update selections
    .call(function (merge) {
      return transPromise(merge.transition(t).attr("opacity", 1).attr("d", function (d, i) {
        return linePaths[i](d);
      }), pTrans);
    });
    return pTrans;
  }

  function d3Line$2(gChart, lines, lineClass, t) {
    var pTrans = []; // Horizontal y lines

    gChart.selectAll(".".concat(lineClass)).data(lines).join(function (enter) {
      return enter.append('path').attr('d', function (d) {
        return d.path;
      }).attr('class', lineClass).style('stroke', function (d) {
        return d.stroke;
      }).style('stroke-width', function (d) {
        return d.strokeWidth;
      }).style('stroke-dasharray', function (d) {
        return d.strokeDasharray;
      }).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style("opacity", 0).remove(), pTrans);
      });
    }) // The selection returned by the join function is the merged
    // enter and update selections
    .call(function (merge) {
      return transPromise(merge.transition(t).attr('d', function (d) {
        return d.path;
      }).style('opacity', 1), pTrans);
    });
    return pTrans;
  } // Function to compute density


  function kernelDensityEstimator(kernel, X) {
    return function (V) {
      return X.map(function (x) {
        return [x, d3.mean(V, function (v) {
          return kernel(x - v);
        })];
      });
    };
  }

  function kernelEpanechnikov(k) {
    return function (v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }

  function getStyle(styles, i) {
    var style;

    if (styles[i]) {
      style = styles[i];
    } else {
      style = {};
    } // Default styles


    style.stroke = style.stroke ? style.stroke : 'black';
    style.strokeWidth = style.strokeWidth ? style.strokeWidth : 1;
    style.strokeDasharray = style.strokeDasharray ? style.strokeDasharray : '1';
    return style;
  }

  function bar() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'bar-chart' : _ref$elid,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$padding = _ref.padding,
        padding = _ref$padding === void 0 ? 0 : _ref$padding,
        _ref$barHeightOnZero = _ref.barHeightOnZero,
        barHeightOnZero = _ref$barHeightOnZero === void 0 ? 0 : _ref$barHeightOnZero,
        _ref$margin = _ref.margin,
        margin = _ref$margin === void 0 ? {
      left: 35,
      right: 0,
      top: 20,
      bottom: 5
    } : _ref$margin,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$axisLeft = _ref.axisLeft,
        axisLeft = _ref$axisLeft === void 0 ? 'tick' : _ref$axisLeft,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? '' : _ref$axisLeftLabel,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$labelPosition = _ref.labelPosition,
        labelPosition = _ref$labelPosition === void 0 ? {} : _ref$labelPosition;

    var updateChart = makeChart$3(data, labelPosition, selector, elid, width, height, padding, barHeightOnZero, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration);
    return {
      updateChart: updateChart,
      saveImage: function saveImage(asSvg, filename) {
        console.log('generate density image');
        saveChartImage(d3.select("#".concat(elid)), expand, asSvg, filename);
      }
    };
  }

  function makeChart$3(data, labelPosition, selector, elid, width, height, padding, barHeightOnZero, margin, expand, axisLeft, axisRight, axisTop, axisBottom, axisLeftLabel, axisLabelFontSize, duration) {
    var svgWidth = width + margin.left + margin.right;
    var svgHeight = height + margin.top + margin.bottom; // Append the chart svg

    var svgTrend = d3.select("".concat(selector)).append('svg').attr('id', elid); // Size the chart svg

    if (expand) {
      svgTrend.attr("viewBox", "0 0 ".concat(svgWidth, " ").concat(svgHeight));
    } else {
      svgTrend.attr("width", svgWidth);
      svgTrend.attr("height", svgHeight);
    } // Axis labels


    if (axisLeftLabel) {
      svgTrend.append("text").attr("transform", "translate(".concat(axisLabelFontSize, ",").concat(margin.top + height / 2, ") rotate(270)")).style("text-anchor", "middle").style('font-size', axisLabelFontSize).text(axisLeftLabel);
    } // Create axes and position within SVG


    var tAxis, bAxis, lAxis, rAxis;

    if (axisLeft === 'on' || axisLeft === 'tick') {
      lAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisBottom === 'on' || axisBottom === 'tick') {
      bAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top + height, ")"));
    }

    if (axisTop === 'on') {
      tAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    }

    if (axisRight === 'on') {
      rAxis = svgTrend.append("g").attr("transform", "translate(".concat(margin.left + width, ", ").concat(margin.top, ")"));
    } // Create g element for chart elements


    var gChart = svgTrend.append("g").attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")")); // Create the API function for updating chart

    var updateChart = makeUpdateChart$3(labelPosition, svgTrend, width, height, padding, barHeightOnZero, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart); // Update the chart with current data

    updateChart(data); // Return the api

    return updateChart;
  }

  function makeUpdateChart$3(labelPosition, svg, width, height, padding, barHeightOnZero, tAxis, bAxis, lAxis, rAxis, axisBottom, duration, gChart) {
    return function (data) {
      // d3 transition object
      var t = svg.transition().duration(duration);
      var pTrans = []; // Value scales

      var yMaxBuff = Math.max.apply(Math, _toConsumableArray(data.map(function (d) {
        return d.value;
      })));
      var xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
      var yScale = d3.scaleLinear().domain([yMaxBuff, 0]).range([0, height]);
      var xScaleBottom = d3.scaleBand().domain(data.map(function (d) {
        return d.label;
      })).range([0, width]).padding([padding]); // Generate axes

      if (tAxis) {
        tAxis.call(d3.axisTop().scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0));
      }

      if (bAxis && axisBottom === 'tick') {
        transPromise(bAxis.transition(t).call(d3.axisBottom().scale(xScaleBottom).tickSizeOuter(0)), pTrans);
        var labels = bAxis.selectAll("text");
        if (labelPosition["text-anchor"]) labels.style("text-anchor", labelPosition["text-anchor"]);
        if (labelPosition["dx"]) labels.attr("dx", labelPosition["dx"]);
        if (labelPosition["dy"]) labels.attr("dy", labelPosition["dy"]);
        if (labelPosition["transform"]) labels.attr("transform", labelPosition["transform"]);
      }

      if (bAxis && axisBottom === 'on') {
        transPromise(bAxis.transition(t).call(d3.axisBottom().scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0)), pTrans);
      }

      if (lAxis) {
        transPromise(lAxis.transition(t).call(d3.axisLeft().scale(yScale).ticks(5)), pTrans);
      }

      if (rAxis) {
        transPromise(rAxis.transition(t).call(d3.axisRight().scale(yScale).tickValues([]).tickSizeOuter(0)), pTrans);
      } // Bar data


      data.forEach(function (d) {
        d.x = xScaleBottom(d.label);
        d.y = yScale(d.value);
        d.ye = height;
        d.width = xScaleBottom.bandwidth();
        d.height = height - yScale(d.value) ? height - yScale(d.value) : barHeightOnZero;
      });
      pTrans = [].concat(_toConsumableArray(d3Bars(data, gChart, t)), _toConsumableArray(pTrans));
      return Promise.allSettled(pTrans);
    };
  }

  function d3Bars(data, gChart, t) {
    var pTrans = [];
    gChart.selectAll(".bar").data(data).join(function (enter) {
      return enter.append('rect').attr('class', 'bar').style('fill', function (d) {
        return d.fill;
      }).style('stroke', function (d) {
        return d.stroke;
      }).style('stroke-width', function (d) {
        return d.strokeWidth;
      }).style('opacity', 0).attr('x', function (d) {
        return d.x;
      }).attr('y', function (d) {
        return d.ye;
      }).attr('width', function (d) {
        return d.width;
      }).attr('height', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style('opacity', 0).remove(), pTrans);
      });
    }).call(function (merge) {
      return transPromise(merge.transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .style('opacity', 1).attr('x', function (d) {
        return d.x;
      }).attr('y', function (d) {
        return d.y;
      }).attr('width', function (d) {
        return d.width;
      }).attr('height', function (d) {
        return d.height;
      }), pTrans);
    });
    gChart.selectAll(".barLabel").data(data).join(function (enter) {
      return enter.append('text').attr('class', 'barLabel').style('opacity', 0).attr('x', function (d) {
        return d.x;
      }).attr('y', function (d) {
        return d.ye;
      }).attr('width', function (d) {
        return d.width;
      }).attr('height', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style('opacity', 0).remove(), pTrans);
      });
    }) // The selection returned by the join function is the merged
    // enter and update selections
    .call(function (merge) {
      return transPromise(merge.transition(t).style('opacity', 1).attr('x', function (d) {
        return d.x;
      }).attr('y', function (d) {
        return d.y;
      }).attr('width', function (d) {
        return d.width;
      }).attr('height', function (d) {
        return d.height;
      }), pTrans);
    });
    return pTrans;
  }

  function addEventHandlers$2(sel, prop, svgChart, interactivity) {
    sel.on("mouseover", function (d) {
      if (interactivity === 'mousemove') {
        highlightItem$2(d[prop], true, svgChart);
      }
    }).on("mouseout", function (d) {
      if (interactivity === 'mousemove') {
        highlightItem$2(d[prop], false, svgChart);
      }
    }).on("click", function (d) {
      if (interactivity === 'mouseclick') {
        highlightItem$2(d[prop], true, svgChart);
        d3.event.stopPropagation();
      }
    });
  }
  function highlightItem$2(id, highlight, svgChart) {
    svgChart.selectAll('.yearly-graphic').classed('lowlight', false);

    if (highlight) {
      svgChart.selectAll('.yearly-graphic').classed('lowlight', true);
      svgChart.selectAll(".yearly-".concat(id)).classed('lowlight', false);
    }
  }

  function makeYearly(svgChart, taxon, taxa, data, dataPoints, dataTrendLines, minYear, maxYear, minYearTrans, maxYearTrans, minCount, maxCount, xPadPercent, yPadPercent, metricsPlus, width, height, axisTop, axisBottom, showCounts, axisLeft, yAxisOpts, axisRight, duration, interactivity, margin, showTaxonLabel, taxonLabelFontSize, taxonLabelItalics, axisLabelFontSize, axisLeftLabel, axisRightLabel, fillGaps, pTrans) {
    // Pre-process data.
    // Filter to named taxon and to min and max year and sort in year order
    // Add max value to each.
    var dataFiltered = data.filter(function (d) {
      return d.taxon === taxon && d.year >= minYear && d.year <= maxYear;
    }).sort(function (a, b) {
      return a.year > b.year ? 1 : -1;
    });
    var dataPointsFiltered = dataPoints.filter(function (d) {
      return d.taxon === taxon && d.year >= minYear && d.year <= maxYear;
    }).sort(function (a, b) {
      return a.year > b.year ? 1 : -1;
    }); // Filter dataTrendLinesFiltered data on taxon and also from an array 
    // of gradients and intercepts to an array of arrays of two point lines

    var dataTrendLinesFiltered = dataTrendLines.filter(function (d) {
      return d.taxon === taxon;
    }).map(function (d) {
      return {
        taxon: d.taxon,
        colour: d.colour,
        width: d.width,
        opacity: d.opacity,
        y1: d.gradient * minYear + d.intercept,
        y2: d.gradient * maxYear + d.intercept
      };
    }); //Set the min and maximum values for the y axis

    var maxMetricCounts = metricsPlus.map(function (m) {
      return Math.max.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
        return d[m.prop];
      })).concat(_toConsumableArray(dataFiltered.filter(function (d) {
        return d[m.bandUpper];
      }).map(function (d) {
        return d[m.bandUpper];
      }))));
    });
    var maxCountA = maxCount !== null ? [maxCount] : [];
    var yMaxCount = Math.max.apply(Math, maxCountA.concat(_toConsumableArray(maxMetricCounts), _toConsumableArray(dataPointsFiltered.map(function (d) {
      return d.y;
    })), _toConsumableArray(dataPointsFiltered.filter(function (d) {
      return d.upper;
    }).map(function (d) {
      return d.upper;
    })), _toConsumableArray(dataTrendLinesFiltered.map(function (d) {
      return d.y1;
    })), _toConsumableArray(dataTrendLinesFiltered.map(function (d) {
      return d.y2;
    }))));
    var minMetricCounts = metricsPlus.map(function (m) {
      return Math.min.apply(Math, _toConsumableArray(dataFiltered.map(function (d) {
        return d[m.prop];
      })).concat(_toConsumableArray(dataFiltered.filter(function (d) {
        return d[m.bandLower];
      }).map(function (d) {
        return d[m.bandLower];
      }))));
    });
    var minCountA = minCount !== null ? [minCount] : [];
    var yMinCount = Math.min.apply(Math, minCountA.concat(_toConsumableArray(minMetricCounts), _toConsumableArray(dataPointsFiltered.map(function (d) {
      return d.y;
    })), _toConsumableArray(dataPointsFiltered.filter(function (d) {
      return d.lower;
    }).map(function (d) {
      return d.lower;
    })), _toConsumableArray(dataTrendLinesFiltered.map(function (d) {
      return d.y1;
    })), _toConsumableArray(dataTrendLinesFiltered.map(function (d) {
      return d.y2;
    }))));

    if (yAxisOpts.minMax !== null) {
      if (yMaxCount < yAxisOpts.minMax) {
        yMaxCount = yAxisOpts.minMax;
      }
    }

    if (yAxisOpts.fixedMin !== null) {
      yMinCount = yAxisOpts.fixedMin;
    } // Value scales


    var years = [];

    for (var i = minYear; i <= maxYear; i++) {
      years.push(i);
    }

    var xPadding = (maxYear - minYear) * xPadPercent;
    var yPadding = (yMaxCount - yMinCount) * yPadPercent;
    var xScaleBar = d3.scaleBand().domain(years).range([0, width]).paddingInner(0.1);
    var xScaleLine = d3.scaleLinear().domain([minYear - xPadding, maxYear + xPadding]).range([0, width]);
    var yScale = d3.scaleLinear().domain([yMinCount - yPadding, yMaxCount + yPadding]).range([height, 0]); // Top axis

    var tAxis;

    if (axisTop === 'on') {
      tAxis = d3.axisTop().scale(xScaleLine) // Actual scale doesn't matter, but needs one
      .tickValues([]).tickSizeOuter(0);
    } // Bottom axis


    var bAxis;

    if (axisBottom === 'on' || axisBottom === 'tick') {
      bAxis = xAxisYear(width, axisBottom === 'tick', minYear - xPadding, maxYear + xPadding, showCounts === 'bar');
    } // Left and right axes


    var makeXaxis = function makeXaxis(leftRight, axisOpt) {
      var axis;
      var d3axis = leftRight === 'left' ? d3.axisLeft() : d3.axisRight();

      switch (axisOpt) {
        case 'on':
          axis = d3axis.scale(yScale).tickValues([]).tickSizeOuter(0);
          break;

        case 'tick':
          axis = d3axis.scale(yScale).ticks(5).tickFormat(d3.format(yAxisOpts.numFormat));
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
      svgYearly = svgChart.append('svg').classed('brc-chart-yearly', true).attr('id', safeId(taxon)).style('overflow', 'visible');
      gYearly = svgYearly.append('g').classed('brc-chart-yearly-g', true);
      init = true;
    } // Line path generator


    var lineCounts = d3.line() //.curve(d3.curveMonotoneX) // Interpolating curves can make transitions of polygons iffy
    // because resulting number of points in path is not constant.
    .x(function (d) {
      return xScaleLine(d.year);
    }).y(function (d) {
      return yScale(d.n);
    });
    var chartLines = [];
    var chartBars = [];
    var chartBands = [];
    var chartPoints = [];
    var chartErrorBars = [];
    metricsPlus.forEach(function (m) {
      // Create a collection of the years in the dataset.
      var dataDict = dataFiltered.reduce(function (a, d) {
        a[d.year] = d[m.prop];
        return a;
      }, {}); // Construct data structure for line charts.

      if (showCounts === 'line' && isFinite(yMinCount)) {
        var points = adjustForTrans(years.map(function (y) {
          // Note below that if the year is not in the datasets, we create a
          // point with the value of zero.
          // TODO - this needs revisiting if we account for 'broken' lines
          // where gaps should be shown. So this will need parameterising 
          // somehow.
          return {
            year: y,
            n: dataDict[y] ? dataDict[y] : 0
          };
        }));
        chartLines.push({
          colour: m.colour,
          opacity: m.opacity,
          strokeWidth: m.strokeWidth,
          type: 'counts',
          prop: m.prop,
          yMin: yMinCount,
          pathEnter: lineCounts(points.map(function (p) {
            return {
              n: yMinCount,
              year: p.year
            };
          })),
          path: lineCounts(points)
        });
      } // Construct data structure for condidence band on line charts.


      if (showCounts === 'line' && m.bandUpper && m.bandLower && isFinite(yMinCount)) {
        var ddUpper = dataFiltered.reduce(function (a, d) {
          a[d.year] = d[m.bandUpper];
          return a;
        }, {});
        var ddLower = dataFiltered.reduce(function (a, d) {
          a[d.year] = d[m.bandLower];
          return a;
        }, {});
        var upperLine = years.map(function (y) {
          return {
            year: y,
            n: ddUpper[y] ? ddUpper[y] : 0
          };
        });
        var lowerLine = [].concat(years).map(function (y) {
          return {
            year: y,
            n: ddLower[y] ? ddLower[y] : 0
          };
        });
        var pointsLower = adjustForTrans(lowerLine);
        var pointsUpper = adjustForTrans(upperLine);
        var pointsBand = [].concat(_toConsumableArray(adjustForTrans(lowerLine)), _toConsumableArray(adjustForTrans(upperLine).reverse()));
        var pointsLowerEnter = pointsLower.map(function (p) {
          return {
            n: yMinCount,
            year: p.year
          };
        });
        var pointsUpderEnter = pointsUpper.map(function (p) {
          return {
            n: yMinCount,
            year: p.year
          };
        });
        chartBands.push({
          fill: m.bandFill ? m.bandFill : 'silver',
          stroke: m.bandStroke ? m.bandStroke : 'grey',
          fillOpacity: m.bandOpacity !== undefined ? m.bandOpacity : 0.5,
          strokeOpacity: m.bandStrokeOpacity !== undefined ? m.bandStrokeOpacity : 1,
          strokeWidth: m.bandStrokeWidth !== undefined ? m.bandStrokeWidth : 1,
          type: 'counts',
          prop: m.prop,
          bandPath: lineCounts(pointsBand),
          bandPathEnter: lineCounts(pointsBand.map(function (p) {
            return {
              n: yMinCount,
              year: p.year
            };
          })),
          bandBorders: [lineCounts(pointsLower), lineCounts(pointsUpper)],
          bandBordersEnter: [lineCounts(pointsLowerEnter), lineCounts(pointsUpderEnter)]
        });
      } // Construct data structure for bar charts.


      if (showCounts === 'bar') {
        var bars = dataFiltered.map(function (d) {
          return {
            colour: m.colour,
            opacity: m.opacity,
            type: 'counts',
            prop: m.prop,
            year: d.year,
            n: yScale(d[m.prop])
          };
        });
        chartBars = [].concat(_toConsumableArray(chartBars), _toConsumableArray(bars));
      } // Construct data structure for points.
      // TODO - if at some point we parameterise display styles
      // for points bars, then it must be specified in here.


      if (m.points) {
        var _points = dataFiltered.filter(function (d) {
          return d[m.prop];
        }).map(function (d) {
          var x;

          if (showCounts === 'bar') {
            x = xScaleBar(d.year) + xScaleBar.bandwidth() / 2;
          } else {
            x = xScaleLine(d.year);
          }

          return {
            x: x,
            y: yScale(d[m.prop]),
            year: d.year,
            prop: m.prop
          };
        });

        chartPoints = [].concat(_toConsumableArray(chartPoints), _toConsumableArray(_points));
      } // Construct data structure for error bars.
      // TODO - if at some point we parameterise display styles
      // for error bars, then it must be specified in here.


      if (m.errorBarUpper && m.errorBarLower) {
        var errorBars = dataFiltered.map(function (d) {
          var x;

          if (showCounts === 'bar') {
            x = xScaleBar(d.year) + xScaleBar.bandwidth() / 2;
          } else {
            x = xScaleLine(d.year);
          }

          return {
            year: d.year,
            pathEnter: "M ".concat(x, " ").concat(height, " L ").concat(x, " ").concat(height),
            path: "M ".concat(x, " ").concat(yScale(d[m.errorBarLower]), " L ").concat(x, " ").concat(yScale(d[m.errorBarUpper])),
            prop: m.prop
          };
        });
        chartErrorBars = [].concat(_toConsumableArray(chartErrorBars), _toConsumableArray(errorBars));
      }
    }); // Construct data structure for supplementary trend lines.
    // TODO - if at some point we parameterise display styles,
    // then it must be specified in here.

    var chartTrendLineSup = dataTrendLinesFiltered.map(function (d) {
      // y = mx + c
      var x1, x2;
      var minx = minYear - xPadding;
      var maxx = maxYear + xPadding;

      if (showCounts === 'bar') {
        x1 = xScaleBar(minx);
        x2 = xScaleBar(maxx) + xScaleBar.bandwidth();
      } else {
        x1 = xScaleLine(minx);
        x2 = xScaleLine(maxx);
      }

      return {
        colour: d.colour ? d.colour : 'red',
        width: d.width ? d.width : '1',
        opacity: d.opacity ? d.opacity : '1',
        pathEnter: "M ".concat(x1, " ").concat(height, " L ").concat(x2, " ").concat(height),
        path: "M ".concat(x1, " ").concat(yScale(d.y1), " L ").concat(x2, " ").concat(yScale(d.y2))
      };
    }); // Construct data structure for supplementary points.
    // TODO - if at some point we parameterise display styles,
    // then it must be specified in here.

    var chartPointsSup = dataPointsFiltered.map(function (d) {
      var x; // if (showCounts === 'bar') {
      //   x = xScaleBar(Math.floor(d.year)) + xScaleBar.bandwidth() * 0.5 +(d.year % 1)
      // } else {
      //   x = xScaleLine(d.year)
      // }

      x = xScaleLine(d.year);
      return {
        x: x,
        y: yScale(d.y),
        year: d.year
      };
    }); // Construct data structure for supplementary point error bars.
    // TODO - if at some point we parameterise display styles,
    // then it must be specified in here.

    var chartPointsSupErrorBars = dataPointsFiltered.map(function (d) {
      var x = xScaleLine(d.year);
      return {
        pathEnter: "M ".concat(x, " ").concat(height, " L ").concat(x, " ").concat(height),
        path: "M ".concat(x, " ").concat(yScale(d.lower), " L ").concat(x, " ").concat(yScale(d.upper)),
        year: d.year
      };
    }); // d3 transition object

    var t = svgYearly.transition().duration(duration); // Bars

    gYearly.selectAll(".yearly-bar").data(chartBars, function (d) {
      return "bars-".concat(d.prop, "-").concat(d.year);
    }).join(function (enter) {
      return enter.append("rect").attr("class", function (d) {
        return "yearly-bar yearly-graphic yearly-".concat(d.prop);
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
        return transPromise(exit.transition(t).attr('height', 0).attr('y', height).remove(), pTrans);
      });
    }).call(function (merge) {
      return transPromise(merge.transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr('y', function (d) {
        return d.n;
      }).attr('x', function (d) {
        return xScaleBar(d.year);
      }).attr('height', function (d) {
        return height - d.n;
      }).attr('width', xScaleBar.bandwidth()).attr("fill", function (d) {
        return d.colour;
      }).attr("opacity", function (d) {
        return d.opacity;
      }), pTrans);
    }); // Bands

    gYearly.selectAll(".yearly-band").data(chartBands, function (d) {
      return "band-".concat(d.prop);
    }).join(function (enter) {
      return enter.append("path").attr("class", function (d) {
        return "yearly-band yearly-graphic yearly-".concat(d.prop);
      }).attr("opacity", function (d) {
        return d.fillOpacity;
      }).attr("fill", function (d) {
        return d.fill;
      }).attr("stroke", "none").attr("d", function (d) {
        return d.bandPathEnter;
      });
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).attr("d", function (d) {
          return d.bandPathEnter;
        }).remove(), pTrans);
      });
    }).call(function (merge) {
      return transPromise(merge.transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", function (d) {
        return d.bandPath;
      }).attr("opacity", function (d) {
        return d.fillOpacity;
      }).attr("fill", function (d) {
        return d.fill;
      }), pTrans);
    }); // Band lines

    var _loop = function _loop(iLine) {
      gYearly.selectAll(".yearly-band-border-".concat(iLine)).data(chartBands, function (d) {
        return "band-line-".concat(d.prop, "-").concat(iLine);
      }).join(function (enter) {
        return enter.append("path").attr("class", function (d) {
          return "yearly-band-border-".concat(iLine, " yearly-graphic yearly-").concat(d.prop);
        }).attr("opacity", function (d) {
          return d.strokeOpacity;
        }).attr("fill", "none").attr("stroke", function (d) {
          return d.stroke;
        }).attr("stroke-width", function (d) {
          return d.strokeWidth;
        }).attr("d", function (d) {
          return d.bandBordersEnter[iLine];
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.call(function (exit) {
          return transPromise(exit.transition(t).attr("d", function (d) {
            return d.bandBordersEnter[iLine];
          }).remove(), pTrans);
        });
      }).call(function (merge) {
        return transPromise(merge.transition(t) // The selection returned by the join function is the merged
        // enter and update selections
        .attr("d", function (d) {
          return d.bandBorders[iLine];
        }).attr("opacity", function (d) {
          return d.strokeOpacity;
        }).attr("stroke", function (d) {
          return d.stroke;
        }).attr("stroke-width", function (d) {
          return d.strokeWidth;
        }), pTrans);
      });
    };

    for (var iLine = 0; iLine < 2; iLine++) {
      _loop(iLine);
    } // Main lines


    gYearly.selectAll(".yearly-line").data(chartLines, function (d) {
      return "line-".concat(d.prop);
    }).join(function (enter) {
      return enter.append("path").attr("class", function (d) {
        return "yearly-line yearly-graphic yearly-".concat(d.prop);
      }).attr("opacity", function (d) {
        return d.opacity;
      }).attr("fill", "none").attr("stroke", function (d) {
        return d.colour;
      }).attr("stroke-width", function (d) {
        return d.strokeWidth;
      }).attr("d", function (d) {
        return d.pathEnter;
      });
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).attr("d", function (d) {
          return d.pathEnter;
        }).remove(), pTrans);
      });
    }).call(function (merge) {
      return transPromise(merge.transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr("d", function (d) {
        return d.path;
      }).attr("opacity", function (d) {
        return d.opacity;
      }).attr("stroke", function (d) {
        return d.colour;
      }).attr("stroke-width", function (d) {
        return d.strokeWidth;
      }), pTrans);
    }); // Error bars

    gYearly.selectAll('.yearly-error-bars').data(chartErrorBars, function (d) {
      return "error-bars-".concat(d.prop, "-").concat(d.year);
    }).join(function (enter) {
      return enter.append('path').attr("class", function (d) {
        return "yearly-error-bars yearly-graphic yearly-".concat(d.prop);
      }).attr("d", function (d) {
        return d.pathEnter;
      }).style('fill', 'none').style('stroke', 'black').style('stroke-width', 1).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style("opacity", 0).attr("d", function (d) {
          return d.pathEnter;
        }).remove(), pTrans);
      });
    }) // The selection returned by the join function is the merged
    // enter and update selections
    .call(function (merge) {
      return transPromise(merge.transition(t).attr("d", function (d) {
        return d.path;
      }).style('opacity', 1), pTrans);
    }); // Points

    gYearly.selectAll('.yearly-point').data(chartPoints, function (d) {
      return "point-".concat(d.prop, "-").concat(d.year);
    }).join(function (enter) {
      return enter.append('circle').attr("class", function (d) {
        return "yearly-point yearly-graphic yearly-".concat(d.prop);
      }).attr('cx', function (d) {
        return d.x;
      }) //.attr('cy', d => d.y)
      .attr('cy', height).attr('r', 3).style('fill', 'white').style('stroke', 'black').style('stroke-width', 1).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style("opacity", 0).attr('cy', height).remove(), pTrans);
      });
    }) // The selection returned by the join function is the merged
    // enter and update selections
    .call(function (merge) {
      return transPromise(merge.transition(t).attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).style('opacity', 1), pTrans);
    }); // Supplementary trend lines

    gYearly.selectAll('.yearly-trend-lines-sup').data(chartTrendLineSup).join(function (enter) {
      return enter.append('path').attr("d", function (d) {
        return d.pathEnter;
      }).attr('class', 'yearly-trend-lines-sup').style('stroke', function (d) {
        return d.colour;
      }).style('stroke-width', function (d) {
        return d.width;
      }).attr("opacity", 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style("opacity", 0).attr("d", function (d) {
          return d.pathEnter;
        }).remove(), pTrans);
      });
    }) // Join returns merged enter and update selection
    .call(function (merge) {
      return transPromise(merge.transition(t).attr("d", function (d) {
        return d.path;
      }).attr("opacity", function (d) {
        return d.opacity;
      }).style('stroke', function (d) {
        return d.colour;
      }).style('stroke-width', function (d) {
        return d.width;
      }), pTrans);
    }); // Supplementary points error bars

    gYearly.selectAll('.yearly-error-bars-sup').data(chartPointsSupErrorBars, function (d) {
      return "error-bars-sup-".concat(d.year);
    }).join(function (enter) {
      return enter.append('path').attr("class", "yearly-error-bars-sup").attr("d", function (d) {
        return d.pathEnter;
      }).style('fill', 'none').style('stroke', 'black').style('stroke-width', 1).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style("opacity", 0).attr("d", function (d) {
          return d.pathEnter;
        }).remove(), pTrans);
      });
    }) // The selection returned by the join function is the merged
    // enter and update selections
    .call(function (merge) {
      return transPromise(merge.transition(t).attr("d", function (d) {
        return d.path;
      }).style('opacity', 1), pTrans);
    }); // Supplementary points

    gYearly.selectAll('.yearly-point-data-sup').data(chartPointsSup, function (d) {
      return "point-data-sup-".concat(d.year);
    }).join(function (enter) {
      return enter.append('circle').attr("class", "yearly-point-data-sup").attr('cx', function (d) {
        return d.x;
      }) //.attr('cy', d => d.y)
      .attr('cy', height).attr('r', 3).style('fill', 'white').style('stroke', 'black').style('stroke-width', 1).style('opacity', 0);
    }, function (update) {
      return update;
    }, function (exit) {
      return exit.call(function (exit) {
        return transPromise(exit.transition(t).style("opacity", 0).attr('cy', height).remove(), pTrans);
      });
    }) // The selection returned by the join function is the merged
    // enter and update selections
    .call(function (merge) {
      return transPromise(merge.transition(t).attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      }).style('opacity', 1), pTrans);
    });
    addEventHandlers$2(gYearly.selectAll("path"), 'prop', svgChart, interactivity);
    addEventHandlers$2(gYearly.selectAll(".yearly-bar"), 'prop', svgChart, interactivity);
    addEventHandlers$2(gYearly.selectAll(".yearly-point"), 'prop', svgChart, interactivity);

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
    } else {
      if (taxa.length === 1) {
        // Update taxon label
        if (showTaxonLabel) {
          svgYearly.select('.brc-chart-yearly-label').text(taxon);
        }
      } // Update the bottom axis if it exists. We do this because
      // yearMin and/or yearMax may have changed.


      if (axisBottom === 'on' || axisBottom === 'tick') {
        transPromise(svgYearly.select(".x.axis").transition(t).call(bAxis), pTrans);
      }
    }

    if (svgYearly.selectAll(".l-axis").size()) {
      transPromise(svgYearly.select(".l-axis").transition(t).call(lAxis), pTrans);
    }

    if (svgYearly.selectAll(".r-axis").size()) {
      transPromise(svgYearly.select(".r-axis").transition(t).call(rAxis), pTrans);
    }

    return svgYearly;

    function adjustForTrans(pnts) {
      var ret = _toConsumableArray(pnts);

      if (minYearTrans) {
        for (var _i = minYearTrans; _i <= pnts[0].year; _i++) {
          ret.unshift({
            n: pnts[0].n,
            year: pnts[0].year
          });
        }
      }

      if (maxYearTrans) {
        for (var _i2 = pnts[pnts.length - 1].year + 1; _i2 <= maxYearTrans; _i2++) {
          ret.push({
            n: pnts[pnts.length - 1].n,
            year: pnts[pnts.length - 1].year
          });
        }
      }

      return ret;
    }
  }

  function makeLegend$2(svgChart, metricsPlus, legendWidth, legendFontSize, headPad, showCounts, interactivity) {
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

      m.x = lineWidth + swatchSize + headPad;
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
    addEventHandlers$2(ls, 'prop', svgChart, interactivity);
    addEventHandlers$2(lt, 'prop', svgChart, interactivity);
    return swatchSize * swatchFact * (rows + 1);
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
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle. (Default - 16.)
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer. (Default - 10.)
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
   * @param {string} opts.yAxisOpts - Specifies options for scaling and displaying left axis.
   * @param {string} opts.yAxisOpts.numFormat - Indicates format for displaying numeric values (uses d3 format values - https://github.com/d3/d3-format). (Default is 'd'.)
   * @param {number} opts.yAxisOpts.minMax - Indicates a minumum value for the maximum value. Set to null for no minimum value. (Default is 5.)
   * @param {number} opts.yAxisOpts.fixedMin - Sets a fixed minimum. Set to null for no fixed minimum. (Default is 0.)
   * @param {number} opts.yAxisOpts.padding - Sets padding to add to the y axis limits as a proportion of data range. (Default is 0.)
   * @param {number} opts.headPad - A left hand offset, in pixels, for title, subtitle, legend and footer. (Default 0.)
   * @param {number} opts.duration - The duration of each transition phase in milliseconds. (Default - 1000.)
   * @param {string} opts.showCounts - The type of the graphic 'bar' for a barchart and 'line' for a line graph. (Default - 'bar'.)
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'. (Default - 'none'.)
   * @param {Array.<Object>} opts.metrics - An array of objects, each describing a numeric property in the input
   * data for which graphics should be generated on the chart.
   * Each of the objects in the data array can be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>prop</b> - the name of the numeric property in the data (metric properties - 'c1' or 'c2' in the example below).
   * <li> <b>label</b> - a label for this metric. (Optional - the default label will be the property name.)
   * <li> <b>colour</b> - optional colour to give the graphic for this metric. Any accepted way of 
   * specifying web colours can be used. Use the special term 'fading' to successively fading shades of grey.
   * (Optional - default is 'blue'.)
   * <li> <b>opacity</b> - optional opacity to give the graphic for this metric. 
   * (Optional - default is 0.5.)
   * <li> <b>linewidth</b> - optional width of line for line for this metric if displayed as a line graph. 
   * (Optional - default is 1.)
   * <li> <b>bandUpper</b> - optional name of a numeric property in the data which indicates the upper value
   * of a confidence band. Can only be used where <i>showCounts</i> is 'line'. 
   * <li> <b>bandLower</b> - optional name of a numeric property in the data which indicates the lower value
   * of a confidence band. Can only be used where <i>showCounts</i> is 'line'. 
   * <li> <b>bandFill</b> - optional colour to use for a confidence band. Any accepted way of 
   * specifying web colours can be used. 
   * (Optional - default is 'silver'.)
   * <li> <b>bandStroke</b> - optional colour to use for the uppder and lower boundaries of a confidence band. Any accepted way of 
   * specifying web colours can be used. 
   * (Optional - default is 'grey'.)
   * <li> <b>bandOpacity</b> - optional opacity to give the confidence band for this metric. 
   * (Optional - default is 0.5.)
   * <li> <b>bandStrokeOpacity</b> - optional opacity to give the boundaries of the confidence band for this metric. 
   * (Optional - default is 1.)
   * <li> <b>bandStrokewidth</b> - optional width of line for bounary lines of the confidence band this metric if displayed as a line graph. 
   * (Optional - default is 1.)
   * <li> <b>points</b> - optional name of a numeric property in the data which indicates where a point is to be displayed.
   * <li> <b>errorBarUpper</b> - optional name of a numeric property in the data which indicates the upper value
   * of an error bar. Used in conjunction with the <i>errorBarLower</i> property. 
  * <li> <b>errorBarLower</b> - optional name of a numeric property in the data which indicates the lower value
   * of an error bar. Used in conjunction with the <i>errorBarUpper</i> property. 
   * </ul>
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>year</b> - a four digit number indicating a year.
   * <li> <b>c1</b> - a metric for a given year (can have any name). 
   * <li> <b>c2</b> - a metric for a given year (can have any name).
   * ... - there must be at least one metric column, but there can be any number of them.
   * </ul>
   * @param {Array.<Object>} opts.dataPoints - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>year</b> - a four digit number indicating a year.
   * <li> <b>y</b> - y value for a given year. 
   * <li> <b>upper</b> - a value for upper confidence band.
   * <li> <b>lower</b> - a value for lower confidence band.
   * </ul>
   * @param {Array.<Object>} opts.dataTrendLines - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * <ul>
   * <li> <b>taxon</b> - name of a taxon.
   * <li> <b>gradient</b> - a gradient for the line.
   * <li> <b>inercept</b> - the y axis intercept value (at x = 0) for the line. 
   * <li> <b>colour</b> - the colour of the line the line. Any accepted way of specifying web colours can be used. (Default - red.)
   * <li> <b>width</b> - the width the line the line in pixels. (Default - 1.)
   * <li> <b>opacity</b> - the opacity of the line. (Default - 1.)
   * </ul>
   * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
   * If empty, graphs for all taxa are created. (Default - [].)

   * @param {number} opts.minYear Indicates the earliest year to use on the x axis. If left unset, the earliest year in the dataset is used. (Default - null.)
   * @param {number} opts.maxYear Indicates the latest year to use on the x axis. If left unset, the latest year in the dataset is used. (Default - null.)
   * @param {number} opts.minYearTrans If set, this indicates the lowest possible year. It is only useful if transitioning between datasets with different
   * year ranges - its purpose is to facilitate smooth transitions of lines and bands in these cases. (Default - null.)
   * @param {number} opts.maxYearTrans If set, this indicates the highest possible year. It is only useful if transitioning between datasets with different
   * year ranges - its purpose is to facilitate smooth transitions of lines and bands in these cases. (Default - null.)
   * @param {number} opts.minCount Indicates the lowest value to use on the y axis. If left unset, the lowest value in the dataset is used. (Default - null.)
   * @param {number} opts.maxCount Indicates the highest value to use on the y axis. If left unset, the highest value in the dataset is used. (Default - null.)
   * @param {number} opts.xPadPercent Padding to add either side of min and max year value - expressed as percentage of year range. Can only be used on line charts. (Default - 0.)
   * @param {number} opts.yPadPercent Padding to add either side of min and max y value - expressed as percentage of y range. Can only be used on line charts. (Default - 0.)
   * @param {boolean} opts.fillGaps A boolean which indicates if gaps in yearly data are to be replaced with a value of zero. (Default - true.)
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
        _ref$yAxisOpts = _ref.yAxisOpts,
        yAxisOpts = _ref$yAxisOpts === void 0 ? {
      numFormat: 'd',
      minMax: 5,
      fixedMin: 0,
      padding: 0
    } : _ref$yAxisOpts,
        _ref$axisBottom = _ref.axisBottom,
        axisBottom = _ref$axisBottom === void 0 ? 'tick' : _ref$axisBottom,
        _ref$axisRight = _ref.axisRight,
        axisRight = _ref$axisRight === void 0 ? '' : _ref$axisRight,
        _ref$axisTop = _ref.axisTop,
        axisTop = _ref$axisTop === void 0 ? '' : _ref$axisTop,
        _ref$showCounts = _ref.showCounts,
        showCounts = _ref$showCounts === void 0 ? 'bar' : _ref$showCounts,
        _ref$headPad = _ref.headPad,
        headPad = _ref$headPad === void 0 ? 0 : _ref$headPad,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'none' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$dataPoints = _ref.dataPoints,
        dataPoints = _ref$dataPoints === void 0 ? [] : _ref$dataPoints,
        _ref$dataTrendLines = _ref.dataTrendLines,
        dataTrendLines = _ref$dataTrendLines === void 0 ? [] : _ref$dataTrendLines,
        _ref$taxa = _ref.taxa,
        taxa = _ref$taxa === void 0 ? [] : _ref$taxa,
        _ref$metrics = _ref.metrics,
        metrics = _ref$metrics === void 0 ? [] : _ref$metrics,
        _ref$minYear = _ref.minYear,
        minYear = _ref$minYear === void 0 ? null : _ref$minYear,
        _ref$maxYear = _ref.maxYear,
        maxYear = _ref$maxYear === void 0 ? null : _ref$maxYear,
        _ref$minYearTrans = _ref.minYearTrans,
        minYearTrans = _ref$minYearTrans === void 0 ? null : _ref$minYearTrans,
        _ref$maxYearTrans = _ref.maxYearTrans,
        maxYearTrans = _ref$maxYearTrans === void 0 ? null : _ref$maxYearTrans,
        _ref$minCount = _ref.minCount,
        minCount = _ref$minCount === void 0 ? null : _ref$minCount,
        _ref$maxCount = _ref.maxCount,
        maxCount = _ref$maxCount === void 0 ? null : _ref$maxCount,
        _ref$xPadPercent = _ref.xPadPercent,
        xPadPercent = _ref$xPadPercent === void 0 ? 0 : _ref$xPadPercent,
        _ref$yPadPercent = _ref.yPadPercent,
        yPadPercent = _ref$yPadPercent === void 0 ? 0 : _ref$yPadPercent,
        _ref$fillGaps = _ref.fillGaps,
        fillGaps = _ref$fillGaps === void 0 ? true : _ref$fillGaps;

    // xPadPercent and yPadPercent can not be used with charts of bar type.
    if (showCounts === 'bar') {
      xPadPercent = 0;
      yPadPercent = 0;
    }

    var metricsPlus;
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem$2(null, false, svgChart);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart brc-chart-yearly');
    preProcessMetrics();
    makeChart(); // Texts must come after chartbecause 
    // the chart width is required

    var textWidth = Number(svg.select('.mainChart').attr("width") - headPad);
    makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
    makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
    makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
    positionMainElements(svg, expand, headPad);

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
      var pTrans = [];
      var svgsTaxa = taxa.map(function (t) {
        return makeYearly(svgChart, t, taxa, data, dataPoints, dataTrendLines, minYear, maxYear, minYearTrans, maxYearTrans, minCount, maxCount, xPadPercent, yPadPercent, metricsPlus, width, height, axisTop, axisBottom, showCounts, axisLeft, yAxisOpts, axisRight, duration, interactivity, margin, showTaxonLabel, taxonLabelFontSize, taxonLabelItalics, axisLabelFontSize, axisLeftLabel, axisRightLabel, fillGaps, pTrans);
      });
      var subChartWidth = Number(svgsTaxa[0].attr("width"));
      var subChartHeight = Number(svgsTaxa[0].attr("height"));
      var legendHeight = showLegend ? makeLegend$2(svgChart, metricsPlus, perRow * (subChartWidth + subChartPad) - headPad, legendFontSize, headPad, showCounts, interactivity) + subChartPad : 0;
      svgsTaxa.forEach(function (svgTaxon, i) {
        var col = i % perRow;
        var row = Math.floor(i / perRow);
        svgTaxon.attr("x", col * (subChartWidth + subChartPad));
        svgTaxon.attr("y", row * (subChartHeight + subChartPad) + legendHeight);
      });
      svgChart.attr("width", perRow * (subChartWidth + subChartPad));
      svgChart.attr("height", legendHeight + Math.ceil(svgsTaxa.length / perRow) * (subChartHeight + subChartPad));
      return Promise.allSettled(pTrans);
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
          opacity: m.opacity !== 'undefined' ? m.opacity : 0.5,
          colour: m.colour ? m.colour : 'blue',
          fading: iFade,
          strokeWidth: strokeWidth,
          bandUpper: m.bandUpper,
          bandLower: m.bandLower,
          bandFill: m.bandFill,
          bandOpacity: m.bandOpacity,
          bandStroke: m.bandStroke,
          bandStrokeWidth: m.bandStrokeWidth,
          bandStrokeOpacity: m.bandStrokeOpacity,
          points: m.points,
          errorBarUpper: m.errorBarUpper,
          errorBarLower: m.errorBarLower
        };
      }).reverse();
      var grey = d3.scaleLinear().range(['#808080', '#E0E0E0']).domain([1, iFading]);
      metricsPlus.forEach(function (m) {
        if (m.fading) {
          m.colour = grey(m.fading);
        }
      });
    }
    /** @function setChartOpts
      * @param {Object} opts - text options.
      * @param {string} opts.title - Title for the chart.
      * @param {string} opts.subtitle - Subtitle for the chart.
      * @param {string} opts.footer - Footer for the chart.
      * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {number} opts.minYear Indicates the earliest year to use on the y axis.
      * @param {number} opts.maxYear Indicates the latest year to use on the y axis.
      * @param {Array.<Object>} opts.metrics - Specifies an array of metrics objects (see main interface for details).
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @param {Array.<Object>} opts.dataPoints - Specifies an array of data objects (see main interface for details).
      * @returns {Promise} promise that resolves when all transitions complete.
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

      if ('minYear' in opts) {
        minYear = opts.minYear;
      }

      if ('maxYear' in opts) {
        maxYear = opts.maxYear;
      }

      if ('minCount' in opts) {
        minCount = opts.minCount;
      }

      if ('maxCount' in opts) {
        maxCount = opts.maxCount;
      }

      if ('metrics' in opts) {
        metrics = opts.metrics;
      }

      if ('data' in opts) {
        data = opts.data;
      }

      if ('dataPoints' in opts) {
        dataPoints = opts.dataPoints;
      }

      if ('dataTrendLines' in opts) {
        dataTrendLines = opts.dataTrendLines;
      }

      if ('taxa' in opts) {
        taxa = opts.taxa;
        highlightItem$2(null, false, svgChart);
      }

      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      var pRet;

      if ('taxa' in opts || 'data' in opts || 'minYear' in opts || 'maxYear' in opts || 'metrics' in opts || 'minCount' in opts || 'maxCount' in opts) {
        preProcessMetrics();
        pRet = makeChart();
        positionMainElements(svg, expand);
      } else {
        pRet = Promise.resolve();
      }

      return pRet;
    }
    /** @function setTaxon
      * @param {string} opts.taxon - The taxon to display.
      * @returns {Promise} promise that resolves when all transitions complete.
      * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
      * For single species charts, this allows you to change the taxon displayed.
      */


    function setTaxon(taxon) {
      var pRet;

      if (taxa.length !== 1) {
        console.log("You can only use the setTaxon method when your chart displays a single taxon.");
        pRet = Promise.resolve();
      } else {
        taxa = [taxon];
        highlightItem$2(null, false, svgChart);
        pRet = makeChart();
      }

      return pRet;
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
    /** @function saveImage
      * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
      * @param {string} filename - Name of the file (without extension) to generate and download.
      * If the filename is falsey (e.g. blank), it will not automatically download the
      * file. (Allows caller to do something else with the data URL which is returned
      * as the promise's resolved value.)
      * @returns {Promise} promise object represents the data URL of the image.
      * @description <b>This function is exposed as a method on the API returned from the yearly function</b>.
      * Download the chart as an image file.
      */


    function saveImage(asSvg, filename) {
      return saveChartImage(svg, expand, asSvg, filename);
    }
    /**
     * @typedef {Object} api
     * @property {module:yearly~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:yearly~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:yearly~setChartOpts} setChartOpts - Sets various options for the chart. 
     * @property {module:yearly~setChartOpts} setTaxon - Changes the displayed taxon for single taxon charts. 
     * @property {module:yearly~saveImage} saveImage - Generates and downloads and image file for the SVG. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon,
      saveImage: saveImage
    };
  }

  function globals (defs) {
    defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
    defs('EPSG:4269', "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees");
    defs('EPSG:3857', "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
    defs.WGS84 = defs['EPSG:4326'];
    defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857

    defs.GOOGLE = defs['EPSG:3857'];
    defs['EPSG:900913'] = defs['EPSG:3857'];
    defs['EPSG:102113'] = defs['EPSG:3857'];
  }

  var PJD_3PARAM = 1;
  var PJD_7PARAM = 2;
  var PJD_GRIDSHIFT = 3;
  var PJD_WGS84 = 4; // WGS84 or equivalent

  var PJD_NODATUM = 5; // WGS84 or equivalent

  var SRS_WGS84_SEMIMAJOR = 6378137.0; // only used in grid shift transforms

  var SRS_WGS84_SEMIMINOR = 6356752.314; // only used in grid shift transforms

  var SRS_WGS84_ESQUARED = 0.0066943799901413165; // only used in grid shift transforms

  var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
  var HALF_PI = Math.PI / 2; // ellipoid pj_set_ell.c

  var SIXTH = 0.1666666666666666667;
  /* 1/6 */

  var RA4 = 0.04722222222222222222;
  /* 17/360 */

  var RA6 = 0.02215608465608465608;
  var EPSLN = 1.0e-10; // you'd think you could use Number.EPSILON above but that makes
  // Mollweide get into an infinate loop.

  var D2R = 0.01745329251994329577;
  var R2D = 57.29577951308232088;
  var FORTPI = Math.PI / 4;
  var TWO_PI = Math.PI * 2; // SPI is slightly greater than Math.PI, so values that exceed the -180..180
  // degree range by a tiny amount don't get wrapped. This prevents points that
  // have drifted from their original location along the 180th meridian (due to
  // floating point error) from changing their sign.

  var SPI = 3.14159265359;

  var exports$1 = {};
  exports$1.greenwich = 0.0; //"0dE",

  exports$1.lisbon = -9.131906111111; //"9d07'54.862\"W",

  exports$1.paris = 2.337229166667; //"2d20'14.025\"E",

  exports$1.bogota = -74.080916666667; //"74d04'51.3\"W",

  exports$1.madrid = -3.687938888889; //"3d41'16.58\"W",

  exports$1.rome = 12.452333333333; //"12d27'8.4\"E",

  exports$1.bern = 7.439583333333; //"7d26'22.5\"E",

  exports$1.jakarta = 106.807719444444; //"106d48'27.79\"E",

  exports$1.ferro = -17.666666666667; //"17d40'W",

  exports$1.brussels = 4.367975; //"4d22'4.71\"E",

  exports$1.stockholm = 18.058277777778; //"18d3'29.8\"E",

  exports$1.athens = 23.7163375; //"23d42'58.815\"E",

  exports$1.oslo = 10.722916666667; //"10d43'22.5\"E"

  var _units = {
    ft: {
      to_meter: 0.3048
    },
    'us-ft': {
      to_meter: 1200 / 3937
    }
  };

  var ignoredChar = /[\s_\-\/\(\)]/g;
  function match(obj, key) {
    if (obj[key]) {
      return obj[key];
    }

    var keys = Object.keys(obj);
    var lkey = key.toLowerCase().replace(ignoredChar, '');
    var i = -1;
    var testkey, processedKey;

    while (++i < keys.length) {
      testkey = keys[i];
      processedKey = testkey.toLowerCase().replace(ignoredChar, '');

      if (processedKey === lkey) {
        return obj[testkey];
      }
    }
  }

  function projStr (defData) {
    var self = {};
    var paramObj = defData.split('+').map(function (v) {
      return v.trim();
    }).filter(function (a) {
      return a;
    }).reduce(function (p, a) {
      var split = a.split('=');
      split.push(true);
      p[split[0].toLowerCase()] = split[1];
      return p;
    }, {});
    var paramName, paramVal, paramOutname;
    var params = {
      proj: 'projName',
      datum: 'datumCode',
      rf: function rf(v) {
        self.rf = parseFloat(v);
      },
      lat_0: function lat_0(v) {
        self.lat0 = v * D2R;
      },
      lat_1: function lat_1(v) {
        self.lat1 = v * D2R;
      },
      lat_2: function lat_2(v) {
        self.lat2 = v * D2R;
      },
      lat_ts: function lat_ts(v) {
        self.lat_ts = v * D2R;
      },
      lon_0: function lon_0(v) {
        self.long0 = v * D2R;
      },
      lon_1: function lon_1(v) {
        self.long1 = v * D2R;
      },
      lon_2: function lon_2(v) {
        self.long2 = v * D2R;
      },
      alpha: function alpha(v) {
        self.alpha = parseFloat(v) * D2R;
      },
      gamma: function gamma(v) {
        self.rectified_grid_angle = parseFloat(v);
      },
      lonc: function lonc(v) {
        self.longc = v * D2R;
      },
      x_0: function x_0(v) {
        self.x0 = parseFloat(v);
      },
      y_0: function y_0(v) {
        self.y0 = parseFloat(v);
      },
      k_0: function k_0(v) {
        self.k0 = parseFloat(v);
      },
      k: function k(v) {
        self.k0 = parseFloat(v);
      },
      a: function a(v) {
        self.a = parseFloat(v);
      },
      b: function b(v) {
        self.b = parseFloat(v);
      },
      r_a: function r_a() {
        self.R_A = true;
      },
      zone: function zone(v) {
        self.zone = parseInt(v, 10);
      },
      south: function south() {
        self.utmSouth = true;
      },
      towgs84: function towgs84(v) {
        self.datum_params = v.split(",").map(function (a) {
          return parseFloat(a);
        });
      },
      to_meter: function to_meter(v) {
        self.to_meter = parseFloat(v);
      },
      units: function units(v) {
        self.units = v;
        var unit = match(_units, v);

        if (unit) {
          self.to_meter = unit.to_meter;
        }
      },
      from_greenwich: function from_greenwich(v) {
        self.from_greenwich = v * D2R;
      },
      pm: function pm(v) {
        var pm = match(exports$1, v);
        self.from_greenwich = (pm ? pm : parseFloat(v)) * D2R;
      },
      nadgrids: function nadgrids(v) {
        if (v === '@null') {
          self.datumCode = 'none';
        } else {
          self.nadgrids = v;
        }
      },
      axis: function axis(v) {
        var legalAxis = "ewnsud";

        if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
          self.axis = v;
        }
      },
      approx: function approx() {
        self.approx = true;
      }
    };

    for (paramName in paramObj) {
      paramVal = paramObj[paramName];

      if (paramName in params) {
        paramOutname = params[paramName];

        if (typeof paramOutname === 'function') {
          paramOutname(paramVal);
        } else {
          self[paramOutname] = paramVal;
        }
      } else {
        self[paramName] = paramVal;
      }
    }

    if (typeof self.datumCode === 'string' && self.datumCode !== "WGS84") {
      self.datumCode = self.datumCode.toLowerCase();
    }

    return self;
  }

  var NEUTRAL = 1;
  var KEYWORD = 2;
  var NUMBER = 3;
  var QUOTED = 4;
  var AFTERQUOTE = 5;
  var ENDED = -1;
  var whitespace = /\s/;
  var latin = /[A-Za-z]/;
  var keyword = /[A-Za-z84]/;
  var endThings = /[,\]]/;
  var digets = /[\d\.E\-\+]/; // const ignoredChar = /[\s_\-\/\(\)]/g;

  function Parser(text) {
    if (typeof text !== 'string') {
      throw new Error('not a string');
    }

    this.text = text.trim();
    this.level = 0;
    this.place = 0;
    this.root = null;
    this.stack = [];
    this.currentObject = null;
    this.state = NEUTRAL;
  }

  Parser.prototype.readCharicter = function () {
    var _char = this.text[this.place++];

    if (this.state !== QUOTED) {
      while (whitespace.test(_char)) {
        if (this.place >= this.text.length) {
          return;
        }

        _char = this.text[this.place++];
      }
    }

    switch (this.state) {
      case NEUTRAL:
        return this.neutral(_char);

      case KEYWORD:
        return this.keyword(_char);

      case QUOTED:
        return this.quoted(_char);

      case AFTERQUOTE:
        return this.afterquote(_char);

      case NUMBER:
        return this.number(_char);

      case ENDED:
        return;
    }
  };

  Parser.prototype.afterquote = function (_char2) {
    if (_char2 === '"') {
      this.word += '"';
      this.state = QUOTED;
      return;
    }

    if (endThings.test(_char2)) {
      this.word = this.word.trim();
      this.afterItem(_char2);
      return;
    }

    throw new Error('havn\'t handled "' + _char2 + '" in afterquote yet, index ' + this.place);
  };

  Parser.prototype.afterItem = function (_char3) {
    if (_char3 === ',') {
      if (this.word !== null) {
        this.currentObject.push(this.word);
      }

      this.word = null;
      this.state = NEUTRAL;
      return;
    }

    if (_char3 === ']') {
      this.level--;

      if (this.word !== null) {
        this.currentObject.push(this.word);
        this.word = null;
      }

      this.state = NEUTRAL;
      this.currentObject = this.stack.pop();

      if (!this.currentObject) {
        this.state = ENDED;
      }

      return;
    }
  };

  Parser.prototype.number = function (_char4) {
    if (digets.test(_char4)) {
      this.word += _char4;
      return;
    }

    if (endThings.test(_char4)) {
      this.word = parseFloat(this.word);
      this.afterItem(_char4);
      return;
    }

    throw new Error('havn\'t handled "' + _char4 + '" in number yet, index ' + this.place);
  };

  Parser.prototype.quoted = function (_char5) {
    if (_char5 === '"') {
      this.state = AFTERQUOTE;
      return;
    }

    this.word += _char5;
    return;
  };

  Parser.prototype.keyword = function (_char6) {
    if (keyword.test(_char6)) {
      this.word += _char6;
      return;
    }

    if (_char6 === '[') {
      var newObjects = [];
      newObjects.push(this.word);
      this.level++;

      if (this.root === null) {
        this.root = newObjects;
      } else {
        this.currentObject.push(newObjects);
      }

      this.stack.push(this.currentObject);
      this.currentObject = newObjects;
      this.state = NEUTRAL;
      return;
    }

    if (endThings.test(_char6)) {
      this.afterItem(_char6);
      return;
    }

    throw new Error('havn\'t handled "' + _char6 + '" in keyword yet, index ' + this.place);
  };

  Parser.prototype.neutral = function (_char7) {
    if (latin.test(_char7)) {
      this.word = _char7;
      this.state = KEYWORD;
      return;
    }

    if (_char7 === '"') {
      this.word = '';
      this.state = QUOTED;
      return;
    }

    if (digets.test(_char7)) {
      this.word = _char7;
      this.state = NUMBER;
      return;
    }

    if (endThings.test(_char7)) {
      this.afterItem(_char7);
      return;
    }

    throw new Error('havn\'t handled "' + _char7 + '" in neutral yet, index ' + this.place);
  };

  Parser.prototype.output = function () {
    while (this.place < this.text.length) {
      this.readCharicter();
    }

    if (this.state === ENDED) {
      return this.root;
    }

    throw new Error('unable to parse string "' + this.text + '". State is ' + this.state);
  };

  function parseString(txt) {
    var parser = new Parser(txt);
    return parser.output();
  }

  function mapit(obj, key, value) {
    if (Array.isArray(key)) {
      value.unshift(key);
      key = null;
    }

    var thing = key ? {} : obj;
    var out = value.reduce(function (newObj, item) {
      sExpr(item, newObj);
      return newObj;
    }, thing);

    if (key) {
      obj[key] = out;
    }
  }

  function sExpr(v, obj) {
    if (!Array.isArray(v)) {
      obj[v] = true;
      return;
    }

    var key = v.shift();

    if (key === 'PARAMETER') {
      key = v.shift();
    }

    if (v.length === 1) {
      if (Array.isArray(v[0])) {
        obj[key] = {};
        sExpr(v[0], obj[key]);
        return;
      }

      obj[key] = v[0];
      return;
    }

    if (!v.length) {
      obj[key] = true;
      return;
    }

    if (key === 'TOWGS84') {
      obj[key] = v;
      return;
    }

    if (key === 'AXIS') {
      if (!(key in obj)) {
        obj[key] = [];
      }

      obj[key].push(v);
      return;
    }

    if (!Array.isArray(key)) {
      obj[key] = {};
    }

    var i;

    switch (key) {
      case 'UNIT':
      case 'PRIMEM':
      case 'VERT_DATUM':
        obj[key] = {
          name: v[0].toLowerCase(),
          convert: v[1]
        };

        if (v.length === 3) {
          sExpr(v[2], obj[key]);
        }

        return;

      case 'SPHEROID':
      case 'ELLIPSOID':
        obj[key] = {
          name: v[0],
          a: v[1],
          rf: v[2]
        };

        if (v.length === 4) {
          sExpr(v[3], obj[key]);
        }

        return;

      case 'PROJECTEDCRS':
      case 'PROJCRS':
      case 'GEOGCS':
      case 'GEOCCS':
      case 'PROJCS':
      case 'LOCAL_CS':
      case 'GEODCRS':
      case 'GEODETICCRS':
      case 'GEODETICDATUM':
      case 'EDATUM':
      case 'ENGINEERINGDATUM':
      case 'VERT_CS':
      case 'VERTCRS':
      case 'VERTICALCRS':
      case 'COMPD_CS':
      case 'COMPOUNDCRS':
      case 'ENGINEERINGCRS':
      case 'ENGCRS':
      case 'FITTED_CS':
      case 'LOCAL_DATUM':
      case 'DATUM':
        v[0] = ['name', v[0]];
        mapit(obj, key, v);
        return;

      default:
        i = -1;

        while (++i < v.length) {
          if (!Array.isArray(v[i])) {
            return sExpr(v, obj[key]);
          }
        }

        return mapit(obj, key, v);
    }
  }

  var D2R$1 = 0.01745329251994329577;

  function rename(obj, params) {
    var outName = params[0];
    var inName = params[1];

    if (!(outName in obj) && inName in obj) {
      obj[outName] = obj[inName];

      if (params.length === 3) {
        obj[outName] = params[2](obj[outName]);
      }
    }
  }

  function d2r(input) {
    return input * D2R$1;
  }

  function cleanWKT(wkt) {
    if (wkt.type === 'GEOGCS') {
      wkt.projName = 'longlat';
    } else if (wkt.type === 'LOCAL_CS') {
      wkt.projName = 'identity';
      wkt.local = true;
    } else {
      if (_typeof(wkt.PROJECTION) === 'object') {
        wkt.projName = Object.keys(wkt.PROJECTION)[0];
      } else {
        wkt.projName = wkt.PROJECTION;
      }
    }

    if (wkt.AXIS) {
      var axisOrder = '';

      for (var i = 0, ii = wkt.AXIS.length; i < ii; ++i) {
        var axis = [wkt.AXIS[i][0].toLowerCase(), wkt.AXIS[i][1].toLowerCase()];

        if (axis[0].indexOf('north') !== -1 || (axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'north') {
          axisOrder += 'n';
        } else if (axis[0].indexOf('south') !== -1 || (axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'south') {
          axisOrder += 's';
        } else if (axis[0].indexOf('east') !== -1 || (axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'east') {
          axisOrder += 'e';
        } else if (axis[0].indexOf('west') !== -1 || (axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'west') {
          axisOrder += 'w';
        }
      }

      if (axisOrder.length === 2) {
        axisOrder += 'u';
      }

      if (axisOrder.length === 3) {
        wkt.axis = axisOrder;
      }
    }

    if (wkt.UNIT) {
      wkt.units = wkt.UNIT.name.toLowerCase();

      if (wkt.units === 'metre') {
        wkt.units = 'meter';
      }

      if (wkt.UNIT.convert) {
        if (wkt.type === 'GEOGCS') {
          if (wkt.DATUM && wkt.DATUM.SPHEROID) {
            wkt.to_meter = wkt.UNIT.convert * wkt.DATUM.SPHEROID.a;
          }
        } else {
          wkt.to_meter = wkt.UNIT.convert;
        }
      }
    }

    var geogcs = wkt.GEOGCS;

    if (wkt.type === 'GEOGCS') {
      geogcs = wkt;
    }

    if (geogcs) {
      //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
      //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
      //}
      if (geogcs.DATUM) {
        wkt.datumCode = geogcs.DATUM.name.toLowerCase();
      } else {
        wkt.datumCode = geogcs.name.toLowerCase();
      }

      if (wkt.datumCode.slice(0, 2) === 'd_') {
        wkt.datumCode = wkt.datumCode.slice(2);
      }

      if (wkt.datumCode === 'new_zealand_geodetic_datum_1949' || wkt.datumCode === 'new_zealand_1949') {
        wkt.datumCode = 'nzgd49';
      }

      if (wkt.datumCode === 'wgs_1984' || wkt.datumCode === 'world_geodetic_system_1984') {
        if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
          wkt.sphere = true;
        }

        wkt.datumCode = 'wgs84';
      }

      if (wkt.datumCode.slice(-6) === '_ferro') {
        wkt.datumCode = wkt.datumCode.slice(0, -6);
      }

      if (wkt.datumCode.slice(-8) === '_jakarta') {
        wkt.datumCode = wkt.datumCode.slice(0, -8);
      }

      if (~wkt.datumCode.indexOf('belge')) {
        wkt.datumCode = 'rnb72';
      }

      if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
        wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');

        if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
          wkt.ellps = 'intl';
        }

        wkt.a = geogcs.DATUM.SPHEROID.a;
        wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
      }

      if (geogcs.DATUM && geogcs.DATUM.TOWGS84) {
        wkt.datum_params = geogcs.DATUM.TOWGS84;
      }

      if (~wkt.datumCode.indexOf('osgb_1936')) {
        wkt.datumCode = 'osgb36';
      }

      if (~wkt.datumCode.indexOf('osni_1952')) {
        wkt.datumCode = 'osni52';
      }

      if (~wkt.datumCode.indexOf('tm65') || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
        wkt.datumCode = 'ire65';
      }

      if (wkt.datumCode === 'ch1903+') {
        wkt.datumCode = 'ch1903';
      }

      if (~wkt.datumCode.indexOf('israel')) {
        wkt.datumCode = 'isr93';
      }
    }

    if (wkt.b && !isFinite(wkt.b)) {
      wkt.b = wkt.a;
    }

    function toMeter(input) {
      var ratio = wkt.to_meter || 1;
      return input * ratio;
    }

    var renamer = function renamer(a) {
      return rename(wkt, a);
    };

    var list = [['standard_parallel_1', 'Standard_Parallel_1'], ['standard_parallel_1', 'Latitude of 1st standard parallel'], ['standard_parallel_2', 'Standard_Parallel_2'], ['standard_parallel_2', 'Latitude of 2nd standard parallel'], ['false_easting', 'False_Easting'], ['false_easting', 'False easting'], ['false-easting', 'Easting at false origin'], ['false_northing', 'False_Northing'], ['false_northing', 'False northing'], ['false_northing', 'Northing at false origin'], ['central_meridian', 'Central_Meridian'], ['central_meridian', 'Longitude of natural origin'], ['central_meridian', 'Longitude of false origin'], ['latitude_of_origin', 'Latitude_Of_Origin'], ['latitude_of_origin', 'Central_Parallel'], ['latitude_of_origin', 'Latitude of natural origin'], ['latitude_of_origin', 'Latitude of false origin'], ['scale_factor', 'Scale_Factor'], ['k0', 'scale_factor'], ['latitude_of_center', 'Latitude_Of_Center'], ['latitude_of_center', 'Latitude_of_center'], ['lat0', 'latitude_of_center', d2r], ['longitude_of_center', 'Longitude_Of_Center'], ['longitude_of_center', 'Longitude_of_center'], ['longc', 'longitude_of_center', d2r], ['x0', 'false_easting', toMeter], ['y0', 'false_northing', toMeter], ['long0', 'central_meridian', d2r], ['lat0', 'latitude_of_origin', d2r], ['lat0', 'standard_parallel_1', d2r], ['lat1', 'standard_parallel_1', d2r], ['lat2', 'standard_parallel_2', d2r], ['azimuth', 'Azimuth'], ['alpha', 'azimuth', d2r], ['srsCode', 'name']];
    list.forEach(renamer);

    if (!wkt.long0 && wkt.longc && (wkt.projName === 'Albers_Conic_Equal_Area' || wkt.projName === 'Lambert_Azimuthal_Equal_Area')) {
      wkt.long0 = wkt.longc;
    }

    if (!wkt.lat_ts && wkt.lat1 && (wkt.projName === 'Stereographic_South_Pole' || wkt.projName === 'Polar Stereographic (variant B)')) {
      wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
      wkt.lat_ts = wkt.lat1;
    }
  }

  function wkt (wkt) {
    var lisp = parseString(wkt);
    var type = lisp.shift();
    var name = lisp.shift();
    lisp.unshift(['name', name]);
    lisp.unshift(['type', type]);
    var obj = {};
    sExpr(lisp, obj);
    cleanWKT(obj);
    return obj;
  }

  function defs(name) {
    /*global console*/
    var that = this;

    if (arguments.length === 2) {
      var def = arguments[1];

      if (typeof def === 'string') {
        if (def.charAt(0) === '+') {
          defs[name] = projStr(arguments[1]);
        } else {
          defs[name] = wkt(arguments[1]);
        }
      } else {
        defs[name] = def;
      }
    } else if (arguments.length === 1) {
      if (Array.isArray(name)) {
        return name.map(function (v) {
          if (Array.isArray(v)) {
            defs.apply(that, v);
          } else {
            defs(v);
          }
        });
      } else if (typeof name === 'string') {
        if (name in defs) {
          return defs[name];
        }
      } else if ('EPSG' in name) {
        defs['EPSG:' + name.EPSG] = name;
      } else if ('ESRI' in name) {
        defs['ESRI:' + name.ESRI] = name;
      } else if ('IAU2000' in name) {
        defs['IAU2000:' + name.IAU2000] = name;
      } else {
        console.log(name);
      }

      return;
    }
  }

  globals(defs);

  function testObj(code) {
    return typeof code === 'string';
  }

  function testDef(code) {
    return code in defs;
  }

  var codeWords = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS', 'GEOCCS', 'PROJCS', 'LOCAL_CS', 'GEODCRS', 'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];

  function testWKT(code) {
    return codeWords.some(function (word) {
      return code.indexOf(word) > -1;
    });
  }

  var codes = ['3857', '900913', '3785', '102113'];

  function checkMercator(item) {
    var auth = match(item, 'authority');

    if (!auth) {
      return;
    }

    var code = match(auth, 'epsg');
    return code && codes.indexOf(code) > -1;
  }

  function checkProjStr(item) {
    var ext = match(item, 'extension');

    if (!ext) {
      return;
    }

    return match(ext, 'proj4');
  }

  function testProj(code) {
    return code[0] === '+';
  }

  function parse(code) {
    if (testObj(code)) {
      //check to see if this is a WKT string
      if (testDef(code)) {
        return defs[code];
      }

      if (testWKT(code)) {
        var out = wkt(code); // test of spetial case, due to this being a very common and often malformed

        if (checkMercator(out)) {
          return defs['EPSG:3857'];
        }

        var maybeProjStr = checkProjStr(out);

        if (maybeProjStr) {
          return projStr(maybeProjStr);
        }

        return out;
      }

      if (testProj(code)) {
        return projStr(code);
      }
    } else {
      return code;
    }
  }

  function extend (destination, source) {
    destination = destination || {};
    var value, property;

    if (!source) {
      return destination;
    }

    for (property in source) {
      value = source[property];

      if (value !== undefined) {
        destination[property] = value;
      }
    }

    return destination;
  }

  function msfnz (eccent, sinphi, cosphi) {
    var con = eccent * sinphi;
    return cosphi / Math.sqrt(1 - con * con);
  }

  function sign (x) {
    return x < 0 ? -1 : 1;
  }

  function adjust_lon (x) {
    return Math.abs(x) <= SPI ? x : x - sign(x) * TWO_PI;
  }

  function tsfnz (eccent, phi, sinphi) {
    var con = eccent * sinphi;
    var com = 0.5 * eccent;
    con = Math.pow((1 - con) / (1 + con), com);
    return Math.tan(0.5 * (HALF_PI - phi)) / con;
  }

  function phi2z (eccent, ts) {
    var eccnth = 0.5 * eccent;
    var con, dphi;
    var phi = HALF_PI - 2 * Math.atan(ts);

    for (var i = 0; i <= 15; i++) {
      con = eccent * Math.sin(phi);
      dphi = HALF_PI - 2 * Math.atan(ts * Math.pow((1 - con) / (1 + con), eccnth)) - phi;
      phi += dphi;

      if (Math.abs(dphi) <= 0.0000000001) {
        return phi;
      }
    } //console.log("phi2z has NoConvergence");


    return -9999;
  }

  function init() {
    var con = this.b / this.a;
    this.es = 1 - con * con;

    if (!('x0' in this)) {
      this.x0 = 0;
    }

    if (!('y0' in this)) {
      this.y0 = 0;
    }

    this.e = Math.sqrt(this.es);

    if (this.lat_ts) {
      if (this.sphere) {
        this.k0 = Math.cos(this.lat_ts);
      } else {
        this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
      }
    } else {
      if (!this.k0) {
        if (this.k) {
          this.k0 = this.k;
        } else {
          this.k0 = 1;
        }
      }
    }
  }
  /* Mercator forward equations--mapping lat,long to x,y
    --------------------------------------------------*/

  function forward(p) {
    var lon = p.x;
    var lat = p.y; // convert to radians

    if (lat * R2D > 90 && lat * R2D < -90 && lon * R2D > 180 && lon * R2D < -180) {
      return null;
    }

    var x, y;

    if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
      return null;
    } else {
      if (this.sphere) {
        x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
        y = this.y0 + this.a * this.k0 * Math.log(Math.tan(FORTPI + 0.5 * lat));
      } else {
        var sinphi = Math.sin(lat);
        var ts = tsfnz(this.e, lat, sinphi);
        x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
        y = this.y0 - this.a * this.k0 * Math.log(ts);
      }

      p.x = x;
      p.y = y;
      return p;
    }
  }
  /* Mercator inverse equations--mapping x,y to lat/long
    --------------------------------------------------*/

  function inverse(p) {
    var x = p.x - this.x0;
    var y = p.y - this.y0;
    var lon, lat;

    if (this.sphere) {
      lat = HALF_PI - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
    } else {
      var ts = Math.exp(-y / (this.a * this.k0));
      lat = phi2z(this.e, ts);

      if (lat === -9999) {
        return null;
      }
    }

    lon = adjust_lon(this.long0 + x / (this.a * this.k0));
    p.x = lon;
    p.y = lat;
    return p;
  }
  var names = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];
  var merc = {
    init: init,
    forward: forward,
    inverse: inverse,
    names: names
  };

  function init$1() {//no-op for longlat
  }

  function identity(pt) {
    return pt;
  }
  var names$1 = ["longlat", "identity"];
  var longlat = {
    init: init$1,
    forward: identity,
    inverse: identity,
    names: names$1
  };

  var projs = [merc, longlat];
  var names$2 = {};
  var projStore = [];

  function add(proj, i) {
    var len = projStore.length;

    if (!proj.names) {
      console.log(i);
      return true;
    }

    projStore[len] = proj;
    proj.names.forEach(function (n) {
      names$2[n.toLowerCase()] = len;
    });
    return this;
  }
  function get(name) {
    if (!name) {
      return false;
    }

    var n = name.toLowerCase();

    if (typeof names$2[n] !== 'undefined' && projStore[names$2[n]]) {
      return projStore[names$2[n]];
    }
  }
  function start() {
    projs.forEach(add);
  }
  var projections = {
    start: start,
    add: add,
    get: get
  };

  var exports$2 = {};
  exports$2.MERIT = {
    a: 6378137.0,
    rf: 298.257,
    ellipseName: "MERIT 1983"
  };
  exports$2.SGS85 = {
    a: 6378136.0,
    rf: 298.257,
    ellipseName: "Soviet Geodetic System 85"
  };
  exports$2.GRS80 = {
    a: 6378137.0,
    rf: 298.257222101,
    ellipseName: "GRS 1980(IUGG, 1980)"
  };
  exports$2.IAU76 = {
    a: 6378140.0,
    rf: 298.257,
    ellipseName: "IAU 1976"
  };
  exports$2.airy = {
    a: 6377563.396,
    b: 6356256.910,
    ellipseName: "Airy 1830"
  };
  exports$2.APL4 = {
    a: 6378137,
    rf: 298.25,
    ellipseName: "Appl. Physics. 1965"
  };
  exports$2.NWL9D = {
    a: 6378145.0,
    rf: 298.25,
    ellipseName: "Naval Weapons Lab., 1965"
  };
  exports$2.mod_airy = {
    a: 6377340.189,
    b: 6356034.446,
    ellipseName: "Modified Airy"
  };
  exports$2.andrae = {
    a: 6377104.43,
    rf: 300.0,
    ellipseName: "Andrae 1876 (Den., Iclnd.)"
  };
  exports$2.aust_SA = {
    a: 6378160.0,
    rf: 298.25,
    ellipseName: "Australian Natl & S. Amer. 1969"
  };
  exports$2.GRS67 = {
    a: 6378160.0,
    rf: 298.2471674270,
    ellipseName: "GRS 67(IUGG 1967)"
  };
  exports$2.bessel = {
    a: 6377397.155,
    rf: 299.1528128,
    ellipseName: "Bessel 1841"
  };
  exports$2.bess_nam = {
    a: 6377483.865,
    rf: 299.1528128,
    ellipseName: "Bessel 1841 (Namibia)"
  };
  exports$2.clrk66 = {
    a: 6378206.4,
    b: 6356583.8,
    ellipseName: "Clarke 1866"
  };
  exports$2.clrk80 = {
    a: 6378249.145,
    rf: 293.4663,
    ellipseName: "Clarke 1880 mod."
  };
  exports$2.clrk58 = {
    a: 6378293.645208759,
    rf: 294.2606763692654,
    ellipseName: "Clarke 1858"
  };
  exports$2.CPM = {
    a: 6375738.7,
    rf: 334.29,
    ellipseName: "Comm. des Poids et Mesures 1799"
  };
  exports$2.delmbr = {
    a: 6376428.0,
    rf: 311.5,
    ellipseName: "Delambre 1810 (Belgium)"
  };
  exports$2.engelis = {
    a: 6378136.05,
    rf: 298.2566,
    ellipseName: "Engelis 1985"
  };
  exports$2.evrst30 = {
    a: 6377276.345,
    rf: 300.8017,
    ellipseName: "Everest 1830"
  };
  exports$2.evrst48 = {
    a: 6377304.063,
    rf: 300.8017,
    ellipseName: "Everest 1948"
  };
  exports$2.evrst56 = {
    a: 6377301.243,
    rf: 300.8017,
    ellipseName: "Everest 1956"
  };
  exports$2.evrst69 = {
    a: 6377295.664,
    rf: 300.8017,
    ellipseName: "Everest 1969"
  };
  exports$2.evrstSS = {
    a: 6377298.556,
    rf: 300.8017,
    ellipseName: "Everest (Sabah & Sarawak)"
  };
  exports$2.fschr60 = {
    a: 6378166.0,
    rf: 298.3,
    ellipseName: "Fischer (Mercury Datum) 1960"
  };
  exports$2.fschr60m = {
    a: 6378155.0,
    rf: 298.3,
    ellipseName: "Fischer 1960"
  };
  exports$2.fschr68 = {
    a: 6378150.0,
    rf: 298.3,
    ellipseName: "Fischer 1968"
  };
  exports$2.helmert = {
    a: 6378200.0,
    rf: 298.3,
    ellipseName: "Helmert 1906"
  };
  exports$2.hough = {
    a: 6378270.0,
    rf: 297.0,
    ellipseName: "Hough"
  };
  exports$2.intl = {
    a: 6378388.0,
    rf: 297.0,
    ellipseName: "International 1909 (Hayford)"
  };
  exports$2.kaula = {
    a: 6378163.0,
    rf: 298.24,
    ellipseName: "Kaula 1961"
  };
  exports$2.lerch = {
    a: 6378139.0,
    rf: 298.257,
    ellipseName: "Lerch 1979"
  };
  exports$2.mprts = {
    a: 6397300.0,
    rf: 191.0,
    ellipseName: "Maupertius 1738"
  };
  exports$2.new_intl = {
    a: 6378157.5,
    b: 6356772.2,
    ellipseName: "New International 1967"
  };
  exports$2.plessis = {
    a: 6376523.0,
    rf: 6355863.0,
    ellipseName: "Plessis 1817 (France)"
  };
  exports$2.krass = {
    a: 6378245.0,
    rf: 298.3,
    ellipseName: "Krassovsky, 1942"
  };
  exports$2.SEasia = {
    a: 6378155.0,
    b: 6356773.3205,
    ellipseName: "Southeast Asia"
  };
  exports$2.walbeck = {
    a: 6376896.0,
    b: 6355834.8467,
    ellipseName: "Walbeck"
  };
  exports$2.WGS60 = {
    a: 6378165.0,
    rf: 298.3,
    ellipseName: "WGS 60"
  };
  exports$2.WGS66 = {
    a: 6378145.0,
    rf: 298.25,
    ellipseName: "WGS 66"
  };
  exports$2.WGS7 = {
    a: 6378135.0,
    rf: 298.26,
    ellipseName: "WGS 72"
  };
  var WGS84 = exports$2.WGS84 = {
    a: 6378137.0,
    rf: 298.257223563,
    ellipseName: "WGS 84"
  };
  exports$2.sphere = {
    a: 6370997.0,
    b: 6370997.0,
    ellipseName: "Normal Sphere (r=6370997)"
  };

  function eccentricity(a, b, rf, R_A) {
    var a2 = a * a; // used in geocentric

    var b2 = b * b; // used in geocentric

    var es = (a2 - b2) / a2; // e ^ 2

    var e = 0;

    if (R_A) {
      a *= 1 - es * (SIXTH + es * (RA4 + es * RA6));
      a2 = a * a;
      es = 0;
    } else {
      e = Math.sqrt(es); // eccentricity
    }

    var ep2 = (a2 - b2) / b2; // used in geocentric

    return {
      es: es,
      e: e,
      ep2: ep2
    };
  }
  function sphere(a, b, rf, ellps, sphere) {
    if (!a) {
      // do we have an ellipsoid?
      var ellipse = match(exports$2, ellps);

      if (!ellipse) {
        ellipse = WGS84;
      }

      a = ellipse.a;
      b = ellipse.b;
      rf = ellipse.rf;
    }

    if (rf && !b) {
      b = (1.0 - 1.0 / rf) * a;
    }

    if (rf === 0 || Math.abs(a - b) < EPSLN) {
      sphere = true;
      b = a;
    }

    return {
      a: a,
      b: b,
      rf: rf,
      sphere: sphere
    };
  }

  var exports$3 = {};
  exports$3.wgs84 = {
    towgs84: "0,0,0",
    ellipse: "WGS84",
    datumName: "WGS84"
  };
  exports$3.ch1903 = {
    towgs84: "674.374,15.056,405.346",
    ellipse: "bessel",
    datumName: "swiss"
  };
  exports$3.ggrs87 = {
    towgs84: "-199.87,74.79,246.62",
    ellipse: "GRS80",
    datumName: "Greek_Geodetic_Reference_System_1987"
  };
  exports$3.nad83 = {
    towgs84: "0,0,0",
    ellipse: "GRS80",
    datumName: "North_American_Datum_1983"
  };
  exports$3.nad27 = {
    nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
    ellipse: "clrk66",
    datumName: "North_American_Datum_1927"
  };
  exports$3.potsdam = {
    towgs84: "598.1,73.7,418.2,0.202,0.045,-2.455,6.7",
    ellipse: "bessel",
    datumName: "Potsdam Rauenberg 1950 DHDN"
  };
  exports$3.carthage = {
    towgs84: "-263.0,6.0,431.0",
    ellipse: "clark80",
    datumName: "Carthage 1934 Tunisia"
  };
  exports$3.hermannskogel = {
    towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
    ellipse: "bessel",
    datumName: "Hermannskogel"
  };
  exports$3.osni52 = {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "airy",
    datumName: "Irish National"
  };
  exports$3.ire65 = {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "mod_airy",
    datumName: "Ireland 1965"
  };
  exports$3.rassadiran = {
    towgs84: "-133.63,-157.5,-158.62",
    ellipse: "intl",
    datumName: "Rassadiran"
  };
  exports$3.nzgd49 = {
    towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
    ellipse: "intl",
    datumName: "New Zealand Geodetic Datum 1949"
  };
  exports$3.osgb36 = {
    towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
    ellipse: "airy",
    datumName: "Airy 1830"
  };
  exports$3.s_jtsk = {
    towgs84: "589,76,480",
    ellipse: 'bessel',
    datumName: 'S-JTSK (Ferro)'
  };
  exports$3.beduaram = {
    towgs84: '-106,-87,188',
    ellipse: 'clrk80',
    datumName: 'Beduaram'
  };
  exports$3.gunung_segara = {
    towgs84: '-403,684,41',
    ellipse: 'bessel',
    datumName: 'Gunung Segara Jakarta'
  };
  exports$3.rnb72 = {
    towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
    ellipse: "intl",
    datumName: "Reseau National Belge 1972"
  };

  function datum(datumCode, datum_params, a, b, es, ep2, nadgrids) {
    var out = {};

    if (datumCode === undefined || datumCode === 'none') {
      out.datum_type = PJD_NODATUM;
    } else {
      out.datum_type = PJD_WGS84;
    }

    if (datum_params) {
      out.datum_params = datum_params.map(parseFloat);

      if (out.datum_params[0] !== 0 || out.datum_params[1] !== 0 || out.datum_params[2] !== 0) {
        out.datum_type = PJD_3PARAM;
      }

      if (out.datum_params.length > 3) {
        if (out.datum_params[3] !== 0 || out.datum_params[4] !== 0 || out.datum_params[5] !== 0 || out.datum_params[6] !== 0) {
          out.datum_type = PJD_7PARAM;
          out.datum_params[3] *= SEC_TO_RAD;
          out.datum_params[4] *= SEC_TO_RAD;
          out.datum_params[5] *= SEC_TO_RAD;
          out.datum_params[6] = out.datum_params[6] / 1000000.0 + 1.0;
        }
      }
    }

    if (nadgrids) {
      out.datum_type = PJD_GRIDSHIFT;
      out.grids = nadgrids;
    }

    out.a = a; //datum object also uses these values

    out.b = b;
    out.es = es;
    out.ep2 = ep2;
    return out;
  }

  /**
   * Resources for details of NTv2 file formats:
   * - https://web.archive.org/web/20140127204822if_/http://www.mgs.gov.on.ca:80/stdprodconsume/groups/content/@mgs/@iandit/documents/resourcelist/stel02_047447.pdf
   * - http://mimaka.com/help/gs/html/004_NTV2%20Data%20Format.htm
   */
  var loadedNadgrids = {};
  /**
   * Load a binary NTv2 file (.gsb) to a key that can be used in a proj string like +nadgrids=<key>. Pass the NTv2 file
   * as an ArrayBuffer.
   */

  function nadgrid(key, data) {
    var view = new DataView(data);
    var isLittleEndian = detectLittleEndian(view);
    var header = readHeader(view, isLittleEndian);

    if (header.nSubgrids > 1) {
      console.log('Only single NTv2 subgrids are currently supported, subsequent sub grids are ignored');
    }

    var subgrids = readSubgrids(view, header, isLittleEndian);
    var nadgrid = {
      header: header,
      subgrids: subgrids
    };
    loadedNadgrids[key] = nadgrid;
    return nadgrid;
  }
  /**
   * Given a proj4 value for nadgrids, return an array of loaded grids
   */

  function getNadgrids(nadgrids) {
    // Format details: http://proj.maptools.org/gen_parms.html
    if (nadgrids === undefined) {
      return null;
    }

    var grids = nadgrids.split(',');
    return grids.map(parseNadgridString);
  }

  function parseNadgridString(value) {
    if (value.length === 0) {
      return null;
    }

    var optional = value[0] === '@';

    if (optional) {
      value = value.slice(1);
    }

    if (value === 'null') {
      return {
        name: 'null',
        mandatory: !optional,
        grid: null,
        isNull: true
      };
    }

    return {
      name: value,
      mandatory: !optional,
      grid: loadedNadgrids[value] || null,
      isNull: false
    };
  }

  function secondsToRadians(seconds) {
    return seconds / 3600 * Math.PI / 180;
  }

  function detectLittleEndian(view) {
    var nFields = view.getInt32(8, false);

    if (nFields === 11) {
      return false;
    }

    nFields = view.getInt32(8, true);

    if (nFields !== 11) {
      console.warn('Failed to detect nadgrid endian-ness, defaulting to little-endian');
    }

    return true;
  }

  function readHeader(view, isLittleEndian) {
    return {
      nFields: view.getInt32(8, isLittleEndian),
      nSubgridFields: view.getInt32(24, isLittleEndian),
      nSubgrids: view.getInt32(40, isLittleEndian),
      shiftType: decodeString(view, 56, 56 + 8).trim(),
      fromSemiMajorAxis: view.getFloat64(120, isLittleEndian),
      fromSemiMinorAxis: view.getFloat64(136, isLittleEndian),
      toSemiMajorAxis: view.getFloat64(152, isLittleEndian),
      toSemiMinorAxis: view.getFloat64(168, isLittleEndian)
    };
  }

  function decodeString(view, start, end) {
    return String.fromCharCode.apply(null, new Uint8Array(view.buffer.slice(start, end)));
  }

  function readSubgrids(view, header, isLittleEndian) {
    var gridOffset = 176;
    var grids = [];

    for (var i = 0; i < header.nSubgrids; i++) {
      var subHeader = readGridHeader(view, gridOffset, isLittleEndian);
      var nodes = readGridNodes(view, gridOffset, subHeader, isLittleEndian);
      var lngColumnCount = Math.round(1 + (subHeader.upperLongitude - subHeader.lowerLongitude) / subHeader.longitudeInterval);
      var latColumnCount = Math.round(1 + (subHeader.upperLatitude - subHeader.lowerLatitude) / subHeader.latitudeInterval); // Proj4 operates on radians whereas the coordinates are in seconds in the grid

      grids.push({
        ll: [secondsToRadians(subHeader.lowerLongitude), secondsToRadians(subHeader.lowerLatitude)],
        del: [secondsToRadians(subHeader.longitudeInterval), secondsToRadians(subHeader.latitudeInterval)],
        lim: [lngColumnCount, latColumnCount],
        count: subHeader.gridNodeCount,
        cvs: mapNodes(nodes)
      });
    }

    return grids;
  }

  function mapNodes(nodes) {
    return nodes.map(function (r) {
      return [secondsToRadians(r.longitudeShift), secondsToRadians(r.latitudeShift)];
    });
  }

  function readGridHeader(view, offset, isLittleEndian) {
    return {
      name: decodeString(view, offset + 8, offset + 16).trim(),
      parent: decodeString(view, offset + 24, offset + 24 + 8).trim(),
      lowerLatitude: view.getFloat64(offset + 72, isLittleEndian),
      upperLatitude: view.getFloat64(offset + 88, isLittleEndian),
      lowerLongitude: view.getFloat64(offset + 104, isLittleEndian),
      upperLongitude: view.getFloat64(offset + 120, isLittleEndian),
      latitudeInterval: view.getFloat64(offset + 136, isLittleEndian),
      longitudeInterval: view.getFloat64(offset + 152, isLittleEndian),
      gridNodeCount: view.getInt32(offset + 168, isLittleEndian)
    };
  }

  function readGridNodes(view, offset, gridHeader, isLittleEndian) {
    var nodesOffset = offset + 176;
    var gridRecordLength = 16;
    var gridShiftRecords = [];

    for (var i = 0; i < gridHeader.gridNodeCount; i++) {
      var record = {
        latitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength, isLittleEndian),
        longitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength + 4, isLittleEndian),
        latitudeAccuracy: view.getFloat32(nodesOffset + i * gridRecordLength + 8, isLittleEndian),
        longitudeAccuracy: view.getFloat32(nodesOffset + i * gridRecordLength + 12, isLittleEndian)
      };
      gridShiftRecords.push(record);
    }

    return gridShiftRecords;
  }

  function Projection(srsCode, callback) {
    if (!(this instanceof Projection)) {
      return new Projection(srsCode);
    }

    callback = callback || function (error) {
      if (error) {
        throw error;
      }
    };

    var json = parse(srsCode);

    if (_typeof(json) !== 'object') {
      callback(srsCode);
      return;
    }

    var ourProj = Projection.projections.get(json.projName);

    if (!ourProj) {
      callback(srsCode);
      return;
    }

    if (json.datumCode && json.datumCode !== 'none') {
      var datumDef = match(exports$3, json.datumCode);

      if (datumDef) {
        json.datum_params = json.datum_params || (datumDef.towgs84 ? datumDef.towgs84.split(',') : null);
        json.ellps = datumDef.ellipse;
        json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
      }
    }

    json.k0 = json.k0 || 1.0;
    json.axis = json.axis || 'enu';
    json.ellps = json.ellps || 'wgs84';
    json.lat1 = json.lat1 || json.lat0; // Lambert_Conformal_Conic_1SP, for example, needs this

    var sphere_ = sphere(json.a, json.b, json.rf, json.ellps, json.sphere);
    var ecc = eccentricity(sphere_.a, sphere_.b, sphere_.rf, json.R_A);
    var nadgrids = getNadgrids(json.nadgrids);
    var datumObj = json.datum || datum(json.datumCode, json.datum_params, sphere_.a, sphere_.b, ecc.es, ecc.ep2, nadgrids);
    extend(this, json); // transfer everything over from the projection because we don't know what we'll need

    extend(this, ourProj); // transfer all the methods from the projection
    // copy the 4 things over we calulated in deriveConstants.sphere

    this.a = sphere_.a;
    this.b = sphere_.b;
    this.rf = sphere_.rf;
    this.sphere = sphere_.sphere; // copy the 3 things we calculated in deriveConstants.eccentricity

    this.es = ecc.es;
    this.e = ecc.e;
    this.ep2 = ecc.ep2; // add in the datum object

    this.datum = datumObj; // init the projection

    this.init(); // legecy callback from back in the day when it went to spatialreference.org

    callback(null, this);
  }

  Projection.projections = projections;
  Projection.projections.start();

  function compareDatums(source, dest) {
    if (source.datum_type !== dest.datum_type) {
      return false; // false, datums are not equal
    } else if (source.a !== dest.a || Math.abs(source.es - dest.es) > 0.000000000050) {
      // the tolerance for es is to ensure that GRS80 and WGS84
      // are considered identical
      return false;
    } else if (source.datum_type === PJD_3PARAM) {
      return source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2];
    } else if (source.datum_type === PJD_7PARAM) {
      return source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2] && source.datum_params[3] === dest.datum_params[3] && source.datum_params[4] === dest.datum_params[4] && source.datum_params[5] === dest.datum_params[5] && source.datum_params[6] === dest.datum_params[6];
    } else {
      return true; // datums are equal
    }
  } // cs_compare_datums()

  /*
   * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
   * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
   * according to the current ellipsoid parameters.
   *
   *    Latitude  : Geodetic latitude in radians                     (input)
   *    Longitude : Geodetic longitude in radians                    (input)
   *    Height    : Geodetic height, in meters                       (input)
   *    X         : Calculated Geocentric X coordinate, in meters    (output)
   *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
   *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
   *
   */

  function geodeticToGeocentric(p, es, a) {
    var Longitude = p.x;
    var Latitude = p.y;
    var Height = p.z ? p.z : 0; //Z value not always supplied

    var Rn;
    /*  Earth radius at location  */

    var Sin_Lat;
    /*  Math.sin(Latitude)  */

    var Sin2_Lat;
    /*  Square of Math.sin(Latitude)  */

    var Cos_Lat;
    /*  Math.cos(Latitude)  */

    /*
     ** Don't blow up if Latitude is just a little out of the value
     ** range as it may just be a rounding issue.  Also removed longitude
     ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
     */

    if (Latitude < -HALF_PI && Latitude > -1.001 * HALF_PI) {
      Latitude = -HALF_PI;
    } else if (Latitude > HALF_PI && Latitude < 1.001 * HALF_PI) {
      Latitude = HALF_PI;
    } else if (Latitude < -HALF_PI) {
      /* Latitude out of range */
      //..reportError('geocent:lat out of range:' + Latitude);
      return {
        x: -Infinity,
        y: -Infinity,
        z: p.z
      };
    } else if (Latitude > HALF_PI) {
      /* Latitude out of range */
      return {
        x: Infinity,
        y: Infinity,
        z: p.z
      };
    }

    if (Longitude > Math.PI) {
      Longitude -= 2 * Math.PI;
    }

    Sin_Lat = Math.sin(Latitude);
    Cos_Lat = Math.cos(Latitude);
    Sin2_Lat = Sin_Lat * Sin_Lat;
    Rn = a / Math.sqrt(1.0e0 - es * Sin2_Lat);
    return {
      x: (Rn + Height) * Cos_Lat * Math.cos(Longitude),
      y: (Rn + Height) * Cos_Lat * Math.sin(Longitude),
      z: (Rn * (1 - es) + Height) * Sin_Lat
    };
  } // cs_geodetic_to_geocentric()

  function geocentricToGeodetic(p, es, a, b) {
    /* local defintions and variables */

    /* end-criterium of loop, accuracy of sin(Latitude) */
    var genau = 1e-12;
    var genau2 = genau * genau;
    var maxiter = 30;
    var P;
    /* distance between semi-minor axis and location */

    var RR;
    /* distance between center and location */

    var CT;
    /* sin of geocentric latitude */

    var ST;
    /* cos of geocentric latitude */

    var RX;
    var RK;
    var RN;
    /* Earth radius at location */

    var CPHI0;
    /* cos of start or old geodetic latitude in iterations */

    var SPHI0;
    /* sin of start or old geodetic latitude in iterations */

    var CPHI;
    /* cos of searched geodetic latitude */

    var SPHI;
    /* sin of searched geodetic latitude */

    var SDPHI;
    /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */

    var iter;
    /* # of continous iteration, max. 30 is always enough (s.a.) */

    var X = p.x;
    var Y = p.y;
    var Z = p.z ? p.z : 0.0; //Z value not always supplied

    var Longitude;
    var Latitude;
    var Height;
    P = Math.sqrt(X * X + Y * Y);
    RR = Math.sqrt(X * X + Y * Y + Z * Z);
    /*      special cases for latitude and longitude */

    if (P / a < genau) {
      /*  special case, if P=0. (X=0., Y=0.) */
      Longitude = 0.0;
      /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
       *  of ellipsoid (=center of mass), Latitude becomes PI/2 */

      if (RR / a < genau) {
        Latitude = HALF_PI;
        Height = -b;
        return {
          x: p.x,
          y: p.y,
          z: p.z
        };
      }
    } else {
      /*  ellipsoidal (geodetic) longitude
       *  interval: -PI < Longitude <= +PI */
      Longitude = Math.atan2(Y, X);
    }
    /* --------------------------------------------------------------
     * Following iterative algorithm was developped by
     * "Institut for Erdmessung", University of Hannover, July 1988.
     * Internet: www.ife.uni-hannover.de
     * Iterative computation of CPHI,SPHI and Height.
     * Iteration of CPHI and SPHI to 10**-12 radian resp.
     * 2*10**-7 arcsec.
     * --------------------------------------------------------------
     */


    CT = Z / RR;
    ST = P / RR;
    RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST);
    CPHI0 = ST * (1.0 - es) * RX;
    SPHI0 = CT * RX;
    iter = 0;
    /* loop to find sin(Latitude) resp. Latitude
     * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */

    do {
      iter++;
      RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0);
      /*  ellipsoidal (geodetic) height */

      Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0);
      RK = es * RN / (RN + Height);
      RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
      CPHI = ST * (1.0 - RK) * RX;
      SPHI = CT * RX;
      SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
      CPHI0 = CPHI;
      SPHI0 = SPHI;
    } while (SDPHI * SDPHI > genau2 && iter < maxiter);
    /*      ellipsoidal (geodetic) latitude */


    Latitude = Math.atan(SPHI / Math.abs(CPHI));
    return {
      x: Longitude,
      y: Latitude,
      z: Height
    };
  } // cs_geocentric_to_geodetic()

  /****************************************************************/
  // pj_geocentic_to_wgs84( p )
  //  p = point to transform in geocentric coordinates (x,y,z)

  /** point object, nothing fancy, just allows values to be
      passed back and forth by reference rather than by value.
      Other point classes may be used as long as they have
      x and y properties, which will get modified in the transform method.
  */

  function geocentricToWgs84(p, datum_type, datum_params) {
    if (datum_type === PJD_3PARAM) {
      // if( x[io] === HUGE_VAL )
      //    continue;
      return {
        x: p.x + datum_params[0],
        y: p.y + datum_params[1],
        z: p.z + datum_params[2]
      };
    } else if (datum_type === PJD_7PARAM) {
      var Dx_BF = datum_params[0];
      var Dy_BF = datum_params[1];
      var Dz_BF = datum_params[2];
      var Rx_BF = datum_params[3];
      var Ry_BF = datum_params[4];
      var Rz_BF = datum_params[5];
      var M_BF = datum_params[6]; // if( x[io] === HUGE_VAL )
      //    continue;

      return {
        x: M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF,
        y: M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF,
        z: M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF
      };
    }
  } // cs_geocentric_to_wgs84

  /****************************************************************/
  // pj_geocentic_from_wgs84()
  //  coordinate system definition,
  //  point to transform in geocentric coordinates (x,y,z)

  function geocentricFromWgs84(p, datum_type, datum_params) {
    if (datum_type === PJD_3PARAM) {
      //if( x[io] === HUGE_VAL )
      //    continue;
      return {
        x: p.x - datum_params[0],
        y: p.y - datum_params[1],
        z: p.z - datum_params[2]
      };
    } else if (datum_type === PJD_7PARAM) {
      var Dx_BF = datum_params[0];
      var Dy_BF = datum_params[1];
      var Dz_BF = datum_params[2];
      var Rx_BF = datum_params[3];
      var Ry_BF = datum_params[4];
      var Rz_BF = datum_params[5];
      var M_BF = datum_params[6];
      var x_tmp = (p.x - Dx_BF) / M_BF;
      var y_tmp = (p.y - Dy_BF) / M_BF;
      var z_tmp = (p.z - Dz_BF) / M_BF; //if( x[io] === HUGE_VAL )
      //    continue;

      return {
        x: x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp,
        y: -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp,
        z: Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp
      };
    } //cs_geocentric_from_wgs84()

  }

  function checkParams(type) {
    return type === PJD_3PARAM || type === PJD_7PARAM;
  }

  function datum_transform (source, dest, point) {
    // Short cut if the datums are identical.
    if (compareDatums(source, dest)) {
      return point; // in this case, zero is sucess,
      // whereas cs_compare_datums returns 1 to indicate TRUE
      // confusing, should fix this
    } // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest


    if (source.datum_type === PJD_NODATUM || dest.datum_type === PJD_NODATUM) {
      return point;
    } // If this datum requires grid shifts, then apply it to geodetic coordinates.


    var source_a = source.a;
    var source_es = source.es;

    if (source.datum_type === PJD_GRIDSHIFT) {
      var gridShiftCode = applyGridShift(source, false, point);

      if (gridShiftCode !== 0) {
        return undefined;
      }

      source_a = SRS_WGS84_SEMIMAJOR;
      source_es = SRS_WGS84_ESQUARED;
    }

    var dest_a = dest.a;
    var dest_b = dest.b;
    var dest_es = dest.es;

    if (dest.datum_type === PJD_GRIDSHIFT) {
      dest_a = SRS_WGS84_SEMIMAJOR;
      dest_b = SRS_WGS84_SEMIMINOR;
      dest_es = SRS_WGS84_ESQUARED;
    } // Do we need to go through geocentric coordinates?


    if (source_es === dest_es && source_a === dest_a && !checkParams(source.datum_type) && !checkParams(dest.datum_type)) {
      return point;
    } // Convert to geocentric coordinates.


    point = geodeticToGeocentric(point, source_es, source_a); // Convert between datums

    if (checkParams(source.datum_type)) {
      point = geocentricToWgs84(point, source.datum_type, source.datum_params);
    }

    if (checkParams(dest.datum_type)) {
      point = geocentricFromWgs84(point, dest.datum_type, dest.datum_params);
    }

    point = geocentricToGeodetic(point, dest_es, dest_a, dest_b);

    if (dest.datum_type === PJD_GRIDSHIFT) {
      var destGridShiftResult = applyGridShift(dest, true, point);

      if (destGridShiftResult !== 0) {
        return undefined;
      }
    }

    return point;
  }
  function applyGridShift(source, inverse, point) {
    if (source.grids === null || source.grids.length === 0) {
      console.log('Grid shift grids not found');
      return -1;
    }

    var input = {
      x: -point.x,
      y: point.y
    };
    var output = {
      x: Number.NaN,
      y: Number.NaN
    };
    var attemptedGrids = [];

    for (var i = 0; i < source.grids.length; i++) {
      var grid = source.grids[i];
      attemptedGrids.push(grid.name);

      if (grid.isNull) {
        output = input;
        break;
      }

      grid.mandatory;

      if (grid.grid === null) {
        if (grid.mandatory) {
          console.log("Unable to find mandatory grid '" + grid.name + "'");
          return -1;
        }

        continue;
      }

      var subgrid = grid.grid.subgrids[0]; // skip tables that don't match our point at all

      var epsilon = (Math.abs(subgrid.del[1]) + Math.abs(subgrid.del[0])) / 10000.0;
      var minX = subgrid.ll[0] - epsilon;
      var minY = subgrid.ll[1] - epsilon;
      var maxX = subgrid.ll[0] + (subgrid.lim[0] - 1) * subgrid.del[0] + epsilon;
      var maxY = subgrid.ll[1] + (subgrid.lim[1] - 1) * subgrid.del[1] + epsilon;

      if (minY > input.y || minX > input.x || maxY < input.y || maxX < input.x) {
        continue;
      }

      output = applySubgridShift(input, inverse, subgrid);

      if (!isNaN(output.x)) {
        break;
      }
    }

    if (isNaN(output.x)) {
      console.log("Failed to find a grid shift table for location '" + -input.x * R2D + " " + input.y * R2D + " tried: '" + attemptedGrids + "'");
      return -1;
    }

    point.x = -output.x;
    point.y = output.y;
    return 0;
  }

  function applySubgridShift(pin, inverse, ct) {
    var val = {
      x: Number.NaN,
      y: Number.NaN
    };

    if (isNaN(pin.x)) {
      return val;
    }

    var tb = {
      x: pin.x,
      y: pin.y
    };
    tb.x -= ct.ll[0];
    tb.y -= ct.ll[1];
    tb.x = adjust_lon(tb.x - Math.PI) + Math.PI;
    var t = nadInterpolate(tb, ct);

    if (inverse) {
      if (isNaN(t.x)) {
        return val;
      }

      t.x = tb.x - t.x;
      t.y = tb.y - t.y;
      var i = 9,
          tol = 1e-12;
      var dif, del;

      do {
        del = nadInterpolate(t, ct);

        if (isNaN(del.x)) {
          console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");
          break;
        }

        dif = {
          x: tb.x - (del.x + t.x),
          y: tb.y - (del.y + t.y)
        };
        t.x += dif.x;
        t.y += dif.y;
      } while (i-- && Math.abs(dif.x) > tol && Math.abs(dif.y) > tol);

      if (i < 0) {
        console.log("Inverse grid shift iterator failed to converge.");
        return val;
      }

      val.x = adjust_lon(t.x + ct.ll[0]);
      val.y = t.y + ct.ll[1];
    } else {
      if (!isNaN(t.x)) {
        val.x = pin.x + t.x;
        val.y = pin.y + t.y;
      }
    }

    return val;
  }

  function nadInterpolate(pin, ct) {
    var t = {
      x: pin.x / ct.del[0],
      y: pin.y / ct.del[1]
    };
    var indx = {
      x: Math.floor(t.x),
      y: Math.floor(t.y)
    };
    var frct = {
      x: t.x - 1.0 * indx.x,
      y: t.y - 1.0 * indx.y
    };
    var val = {
      x: Number.NaN,
      y: Number.NaN
    };
    var inx;

    if (indx.x < 0 || indx.x >= ct.lim[0]) {
      return val;
    }

    if (indx.y < 0 || indx.y >= ct.lim[1]) {
      return val;
    }

    inx = indx.y * ct.lim[0] + indx.x;
    var f00 = {
      x: ct.cvs[inx][0],
      y: ct.cvs[inx][1]
    };
    inx++;
    var f10 = {
      x: ct.cvs[inx][0],
      y: ct.cvs[inx][1]
    };
    inx += ct.lim[0];
    var f11 = {
      x: ct.cvs[inx][0],
      y: ct.cvs[inx][1]
    };
    inx--;
    var f01 = {
      x: ct.cvs[inx][0],
      y: ct.cvs[inx][1]
    };
    var m11 = frct.x * frct.y,
        m10 = frct.x * (1.0 - frct.y),
        m00 = (1.0 - frct.x) * (1.0 - frct.y),
        m01 = (1.0 - frct.x) * frct.y;
    val.x = m00 * f00.x + m10 * f10.x + m01 * f01.x + m11 * f11.x;
    val.y = m00 * f00.y + m10 * f10.y + m01 * f01.y + m11 * f11.y;
    return val;
  }

  function adjust_axis (crs, denorm, point) {
    var xin = point.x,
        yin = point.y,
        zin = point.z || 0.0;
    var v, t, i;
    var out = {};

    for (i = 0; i < 3; i++) {
      if (denorm && i === 2 && point.z === undefined) {
        continue;
      }

      if (i === 0) {
        v = xin;

        if ("ew".indexOf(crs.axis[i]) !== -1) {
          t = 'x';
        } else {
          t = 'y';
        }
      } else if (i === 1) {
        v = yin;

        if ("ns".indexOf(crs.axis[i]) !== -1) {
          t = 'y';
        } else {
          t = 'x';
        }
      } else {
        v = zin;
        t = 'z';
      }

      switch (crs.axis[i]) {
        case 'e':
          out[t] = v;
          break;

        case 'w':
          out[t] = -v;
          break;

        case 'n':
          out[t] = v;
          break;

        case 's':
          out[t] = -v;
          break;

        case 'u':
          if (point[t] !== undefined) {
            out.z = v;
          }

          break;

        case 'd':
          if (point[t] !== undefined) {
            out.z = -v;
          }

          break;

        default:
          //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
          return null;
      }
    }

    return out;
  }

  function common (array) {
    var out = {
      x: array[0],
      y: array[1]
    };

    if (array.length > 2) {
      out.z = array[2];
    }

    if (array.length > 3) {
      out.m = array[3];
    }

    return out;
  }

  function checkSanity (point) {
    checkCoord(point.x);
    checkCoord(point.y);
  }

  function checkCoord(num) {
    if (typeof Number.isFinite === 'function') {
      if (Number.isFinite(num)) {
        return;
      }

      throw new TypeError('coordinates must be finite numbers');
    }

    if (typeof num !== 'number' || num !== num || !isFinite(num)) {
      throw new TypeError('coordinates must be finite numbers');
    }
  }

  function checkNotWGS(source, dest) {
    return (source.datum.datum_type === PJD_3PARAM || source.datum.datum_type === PJD_7PARAM) && dest.datumCode !== 'WGS84' || (dest.datum.datum_type === PJD_3PARAM || dest.datum.datum_type === PJD_7PARAM) && source.datumCode !== 'WGS84';
  }

  function transform(source, dest, point, enforceAxis) {
    var wgs84;

    if (Array.isArray(point)) {
      point = common(point);
    }

    checkSanity(point); // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84

    if (source.datum && dest.datum && checkNotWGS(source, dest)) {
      wgs84 = new Projection('WGS84');
      point = transform(source, wgs84, point, enforceAxis);
      source = wgs84;
    } // DGR, 2010/11/12


    if (enforceAxis && source.axis !== 'enu') {
      point = adjust_axis(source, false, point);
    } // Transform source points to long/lat, if they aren't already.


    if (source.projName === 'longlat') {
      point = {
        x: point.x * D2R,
        y: point.y * D2R,
        z: point.z || 0
      };
    } else {
      if (source.to_meter) {
        point = {
          x: point.x * source.to_meter,
          y: point.y * source.to_meter,
          z: point.z || 0
        };
      }

      point = source.inverse(point); // Convert Cartesian to longlat

      if (!point) {
        return;
      }
    } // Adjust for the prime meridian if necessary


    if (source.from_greenwich) {
      point.x += source.from_greenwich;
    } // Convert datums if needed, and if possible.


    point = datum_transform(source.datum, dest.datum, point);

    if (!point) {
      return;
    } // Adjust for the prime meridian if necessary


    if (dest.from_greenwich) {
      point = {
        x: point.x - dest.from_greenwich,
        y: point.y,
        z: point.z || 0
      };
    }

    if (dest.projName === 'longlat') {
      // convert radians to decimal degrees
      point = {
        x: point.x * R2D,
        y: point.y * R2D,
        z: point.z || 0
      };
    } else {
      // else project
      point = dest.forward(point);

      if (dest.to_meter) {
        point = {
          x: point.x / dest.to_meter,
          y: point.y / dest.to_meter,
          z: point.z || 0
        };
      }
    } // DGR, 2010/11/12


    if (enforceAxis && dest.axis !== 'enu') {
      return adjust_axis(dest, true, point);
    }

    return point;
  }

  var wgs84 = Projection('WGS84');

  function transformer(from, to, coords, enforceAxis) {
    var transformedArray, out, keys;

    if (Array.isArray(coords)) {
      transformedArray = transform(from, to, coords, enforceAxis) || {
        x: NaN,
        y: NaN
      };

      if (coords.length > 2) {
        if (typeof from.name !== 'undefined' && from.name === 'geocent' || typeof to.name !== 'undefined' && to.name === 'geocent') {
          if (typeof transformedArray.z === 'number') {
            return [transformedArray.x, transformedArray.y, transformedArray.z].concat(coords.splice(3));
          } else {
            return [transformedArray.x, transformedArray.y, coords[2]].concat(coords.splice(3));
          }
        } else {
          return [transformedArray.x, transformedArray.y].concat(coords.splice(2));
        }
      } else {
        return [transformedArray.x, transformedArray.y];
      }
    } else {
      out = transform(from, to, coords, enforceAxis);
      keys = Object.keys(coords);

      if (keys.length === 2) {
        return out;
      }

      keys.forEach(function (key) {
        if (typeof from.name !== 'undefined' && from.name === 'geocent' || typeof to.name !== 'undefined' && to.name === 'geocent') {
          if (key === 'x' || key === 'y' || key === 'z') {
            return;
          }
        } else {
          if (key === 'x' || key === 'y') {
            return;
          }
        }

        out[key] = coords[key];
      });
      return out;
    }
  }

  function checkProj(item) {
    if (item instanceof Projection) {
      return item;
    }

    if (item.oProj) {
      return item.oProj;
    }

    return Projection(item);
  }

  function proj4(fromProj, toProj, coord) {
    fromProj = checkProj(fromProj);
    var single = false;
    var obj;

    if (typeof toProj === 'undefined') {
      toProj = fromProj;
      fromProj = wgs84;
      single = true;
    } else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
      coord = toProj;
      toProj = fromProj;
      fromProj = wgs84;
      single = true;
    }

    toProj = checkProj(toProj);

    if (coord) {
      return transformer(fromProj, toProj, coord);
    } else {
      obj = {
        forward: function forward(coords, enforceAxis) {
          return transformer(fromProj, toProj, coords, enforceAxis);
        },
        inverse: function inverse(coords, enforceAxis) {
          return transformer(toProj, fromProj, coords, enforceAxis);
        }
      };

      if (single) {
        obj.oProj = toProj;
      }

      return obj;
    }
  }

  /**
   * UTM zones are grouped, and assigned to one of a group of 6
   * sets.
   *
   * {int} @private
   */
  var NUM_100K_SETS = 6;
  /**
   * The column letters (for easting) of the lower left value, per
   * set.
   *
   * {string} @private
   */

  var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';
  /**
   * The row letters (for northing) of the lower left value, per
   * set.
   *
   * {string} @private
   */

  var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';
  var A = 65; // A

  var I = 73; // I

  var O = 79; // O

  var V = 86; // V

  var Z = 90; // Z

  var mgrs = {
    forward: forward$1,
    inverse: inverse$1,
    toPoint: toPoint
  };
  /**
   * Conversion of lat/lon to MGRS.
   *
   * @param {object} ll Object literal with lat and lon properties on a
   *     WGS84 ellipsoid.
   * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
   *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
   * @return {string} the MGRS string for the given location and accuracy.
   */

  function forward$1(ll, accuracy) {
    accuracy = accuracy || 5; // default accuracy 1m

    return encode(LLtoUTM({
      lat: ll[1],
      lon: ll[0]
    }), accuracy);
  }
  /**
   * Conversion of MGRS to lat/lon.
   *
   * @param {string} mgrs MGRS string.
   * @return {array} An array with left (longitude), bottom (latitude), right
   *     (longitude) and top (latitude) values in WGS84, representing the
   *     bounding box for the provided MGRS reference.
   */

  function inverse$1(mgrs) {
    var bbox = UTMtoLL(decode(mgrs.toUpperCase()));

    if (bbox.lat && bbox.lon) {
      return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
    }

    return [bbox.left, bbox.bottom, bbox.right, bbox.top];
  }
  function toPoint(mgrs) {
    var bbox = UTMtoLL(decode(mgrs.toUpperCase()));

    if (bbox.lat && bbox.lon) {
      return [bbox.lon, bbox.lat];
    }

    return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
  }
  /**
   * Conversion from degrees to radians.
   *
   * @private
   * @param {number} deg the angle in degrees.
   * @return {number} the angle in radians.
   */

  function degToRad(deg) {
    return deg * (Math.PI / 180.0);
  }
  /**
   * Conversion from radians to degrees.
   *
   * @private
   * @param {number} rad the angle in radians.
   * @return {number} the angle in degrees.
   */


  function radToDeg(rad) {
    return 180.0 * (rad / Math.PI);
  }
  /**
   * Converts a set of Longitude and Latitude co-ordinates to UTM
   * using the WGS84 ellipsoid.
   *
   * @private
   * @param {object} ll Object literal with lat and lon properties
   *     representing the WGS84 coordinate to be converted.
   * @return {object} Object literal containing the UTM value with easting,
   *     northing, zoneNumber and zoneLetter properties, and an optional
   *     accuracy property in digits. Returns null if the conversion failed.
   */


  function LLtoUTM(ll) {
    var Lat = ll.lat;
    var Long = ll.lon;
    var a = 6378137.0; //ellip.radius;

    var eccSquared = 0.00669438; //ellip.eccsq;

    var k0 = 0.9996;
    var LongOrigin;
    var eccPrimeSquared;
    var N, T, C, A, M;
    var LatRad = degToRad(Lat);
    var LongRad = degToRad(Long);
    var LongOriginRad;
    var ZoneNumber; // (int)

    ZoneNumber = Math.floor((Long + 180) / 6) + 1; //Make sure the longitude 180.00 is in Zone 60

    if (Long === 180) {
      ZoneNumber = 60;
    } // Special zone for Norway


    if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
      ZoneNumber = 32;
    } // Special zones for Svalbard


    if (Lat >= 72.0 && Lat < 84.0) {
      if (Long >= 0.0 && Long < 9.0) {
        ZoneNumber = 31;
      } else if (Long >= 9.0 && Long < 21.0) {
        ZoneNumber = 33;
      } else if (Long >= 21.0 && Long < 33.0) {
        ZoneNumber = 35;
      } else if (Long >= 33.0 && Long < 42.0) {
        ZoneNumber = 37;
      }
    }

    LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
    // in middle of
    // zone

    LongOriginRad = degToRad(LongOrigin);
    eccPrimeSquared = eccSquared / (1 - eccSquared);
    N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
    T = Math.tan(LatRad) * Math.tan(LatRad);
    C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
    A = Math.cos(LatRad) * (LongRad - LongOriginRad);
    M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - 35 * eccSquared * eccSquared * eccSquared / 3072 * Math.sin(6 * LatRad));
    var UTMEasting = k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0;
    var UTMNorthing = k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0));

    if (Lat < 0.0) {
      UTMNorthing += 10000000.0; //10000000 meter offset for
      // southern hemisphere
    }

    return {
      northing: Math.round(UTMNorthing),
      easting: Math.round(UTMEasting),
      zoneNumber: ZoneNumber,
      zoneLetter: getLetterDesignator(Lat)
    };
  }
  /**
   * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
   * class where the Zone can be specified as a single string eg."60N" which
   * is then broken down into the ZoneNumber and ZoneLetter.
   *
   * @private
   * @param {object} utm An object literal with northing, easting, zoneNumber
   *     and zoneLetter properties. If an optional accuracy property is
   *     provided (in meters), a bounding box will be returned instead of
   *     latitude and longitude.
   * @return {object} An object literal containing either lat and lon values
   *     (if no accuracy was provided), or top, right, bottom and left values
   *     for the bounding box calculated according to the provided accuracy.
   *     Returns null if the conversion failed.
   */


  function UTMtoLL(utm) {
    var UTMNorthing = utm.northing;
    var UTMEasting = utm.easting;
    var zoneLetter = utm.zoneLetter;
    var zoneNumber = utm.zoneNumber; // check the ZoneNummber is valid

    if (zoneNumber < 0 || zoneNumber > 60) {
      return null;
    }

    var k0 = 0.9996;
    var a = 6378137.0; //ellip.radius;

    var eccSquared = 0.00669438; //ellip.eccsq;

    var eccPrimeSquared;
    var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
    var N1, T1, C1, R1, D, M;
    var LongOrigin;
    var mu, phi1Rad; // remove 500,000 meter offset for longitude

    var x = UTMEasting - 500000.0;
    var y = UTMNorthing; // We must know somehow if we are in the Northern or Southern
    // hemisphere, this is the only time we use the letter So even
    // if the Zone letter isn't exactly correct it should indicate
    // the hemisphere correctly

    if (zoneLetter < 'N') {
      y -= 10000000.0; // remove 10,000,000 meter offset used
      // for southern hemisphere
    } // There are 60 zones with zone 1 being at West -180 to -174


    LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
    // in middle of
    // zone

    eccPrimeSquared = eccSquared / (1 - eccSquared);
    M = y / k0;
    mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));
    phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + 151 * e1 * e1 * e1 / 96 * Math.sin(6 * mu); // double phi1 = ProjMath.radToDeg(phi1Rad);

    N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
    T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
    C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
    R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
    D = x / (N1 * k0);
    var lat = phi1Rad - N1 * Math.tan(phi1Rad) / R1 * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
    lat = radToDeg(lat);
    var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
    lon = LongOrigin + radToDeg(lon);
    var result;

    if (utm.accuracy) {
      var topRight = UTMtoLL({
        northing: utm.northing + utm.accuracy,
        easting: utm.easting + utm.accuracy,
        zoneLetter: utm.zoneLetter,
        zoneNumber: utm.zoneNumber
      });
      result = {
        top: topRight.lat,
        right: topRight.lon,
        bottom: lat,
        left: lon
      };
    } else {
      result = {
        lat: lat,
        lon: lon
      };
    }

    return result;
  }
  /**
   * Calculates the MGRS letter designator for the given latitude.
   *
   * @private
   * @param {number} lat The latitude in WGS84 to get the letter designator
   *     for.
   * @return {char} The letter designator.
   */


  function getLetterDesignator(lat) {
    //This is here as an error flag to show that the Latitude is
    //outside MGRS limits
    var LetterDesignator = 'Z';

    if (84 >= lat && lat >= 72) {
      LetterDesignator = 'X';
    } else if (72 > lat && lat >= 64) {
      LetterDesignator = 'W';
    } else if (64 > lat && lat >= 56) {
      LetterDesignator = 'V';
    } else if (56 > lat && lat >= 48) {
      LetterDesignator = 'U';
    } else if (48 > lat && lat >= 40) {
      LetterDesignator = 'T';
    } else if (40 > lat && lat >= 32) {
      LetterDesignator = 'S';
    } else if (32 > lat && lat >= 24) {
      LetterDesignator = 'R';
    } else if (24 > lat && lat >= 16) {
      LetterDesignator = 'Q';
    } else if (16 > lat && lat >= 8) {
      LetterDesignator = 'P';
    } else if (8 > lat && lat >= 0) {
      LetterDesignator = 'N';
    } else if (0 > lat && lat >= -8) {
      LetterDesignator = 'M';
    } else if (-8 > lat && lat >= -16) {
      LetterDesignator = 'L';
    } else if (-16 > lat && lat >= -24) {
      LetterDesignator = 'K';
    } else if (-24 > lat && lat >= -32) {
      LetterDesignator = 'J';
    } else if (-32 > lat && lat >= -40) {
      LetterDesignator = 'H';
    } else if (-40 > lat && lat >= -48) {
      LetterDesignator = 'G';
    } else if (-48 > lat && lat >= -56) {
      LetterDesignator = 'F';
    } else if (-56 > lat && lat >= -64) {
      LetterDesignator = 'E';
    } else if (-64 > lat && lat >= -72) {
      LetterDesignator = 'D';
    } else if (-72 > lat && lat >= -80) {
      LetterDesignator = 'C';
    }

    return LetterDesignator;
  }
  /**
   * Encodes a UTM location as MGRS string.
   *
   * @private
   * @param {object} utm An object literal with easting, northing,
   *     zoneLetter, zoneNumber
   * @param {number} accuracy Accuracy in digits (1-5).
   * @return {string} MGRS string for the given UTM location.
   */


  function encode(utm, accuracy) {
    // prepend with leading zeroes
    var seasting = "00000" + utm.easting,
        snorthing = "00000" + utm.northing;
    return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
  }
  /**
   * Get the two letter 100k designator for a given UTM easting,
   * northing and zone number value.
   *
   * @private
   * @param {number} easting
   * @param {number} northing
   * @param {number} zoneNumber
   * @return the two letter 100k designator for the given UTM location.
   */


  function get100kID(easting, northing, zoneNumber) {
    var setParm = get100kSetForZone(zoneNumber);
    var setColumn = Math.floor(easting / 100000);
    var setRow = Math.floor(northing / 100000) % 20;
    return getLetter100kID(setColumn, setRow, setParm);
  }
  /**
   * Given a UTM zone number, figure out the MGRS 100K set it is in.
   *
   * @private
   * @param {number} i An UTM zone number.
   * @return {number} the 100k set the UTM zone is in.
   */


  function get100kSetForZone(i) {
    var setParm = i % NUM_100K_SETS;

    if (setParm === 0) {
      setParm = NUM_100K_SETS;
    }

    return setParm;
  }
  /**
   * Get the two-letter MGRS 100k designator given information
   * translated from the UTM northing, easting and zone number.
   *
   * @private
   * @param {number} column the column index as it relates to the MGRS
   *        100k set spreadsheet, created from the UTM easting.
   *        Values are 1-8.
   * @param {number} row the row index as it relates to the MGRS 100k set
   *        spreadsheet, created from the UTM northing value. Values
   *        are from 0-19.
   * @param {number} parm the set block, as it relates to the MGRS 100k set
   *        spreadsheet, created from the UTM zone. Values are from
   *        1-60.
   * @return two letter MGRS 100k code.
   */


  function getLetter100kID(column, row, parm) {
    // colOrigin and rowOrigin are the letters at the origin of the set
    var index = parm - 1;
    var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
    var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index); // colInt and rowInt are the letters to build to return

    var colInt = colOrigin + column - 1;
    var rowInt = rowOrigin + row;
    var rollover = false;

    if (colInt > Z) {
      colInt = colInt - Z + A - 1;
      rollover = true;
    }

    if (colInt === I || colOrigin < I && colInt > I || (colInt > I || colOrigin < I) && rollover) {
      colInt++;
    }

    if (colInt === O || colOrigin < O && colInt > O || (colInt > O || colOrigin < O) && rollover) {
      colInt++;

      if (colInt === I) {
        colInt++;
      }
    }

    if (colInt > Z) {
      colInt = colInt - Z + A - 1;
    }

    if (rowInt > V) {
      rowInt = rowInt - V + A - 1;
      rollover = true;
    } else {
      rollover = false;
    }

    if (rowInt === I || rowOrigin < I && rowInt > I || (rowInt > I || rowOrigin < I) && rollover) {
      rowInt++;
    }

    if (rowInt === O || rowOrigin < O && rowInt > O || (rowInt > O || rowOrigin < O) && rollover) {
      rowInt++;

      if (rowInt === I) {
        rowInt++;
      }
    }

    if (rowInt > V) {
      rowInt = rowInt - V + A - 1;
    }

    var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
    return twoLetter;
  }
  /**
   * Decode the UTM parameters from a MGRS string.
   *
   * @private
   * @param {string} mgrsString an UPPERCASE coordinate string is expected.
   * @return {object} An object literal with easting, northing, zoneLetter,
   *     zoneNumber and accuracy (in meters) properties.
   */


  function decode(mgrsString) {
    if (mgrsString && mgrsString.length === 0) {
      throw "MGRSPoint coverting from nothing";
    }

    var length = mgrsString.length;
    var hunK = null;
    var sb = "";
    var testChar;
    var i = 0; // get Zone number

    while (!/[A-Z]/.test(testChar = mgrsString.charAt(i))) {
      if (i >= 2) {
        throw "MGRSPoint bad conversion from: " + mgrsString;
      }

      sb += testChar;
      i++;
    }

    var zoneNumber = parseInt(sb, 10);

    if (i === 0 || i + 3 > length) {
      // A good MGRS string has to be 4-5 digits long,
      // ##AAA/#AAA at least.
      throw "MGRSPoint bad conversion from: " + mgrsString;
    }

    var zoneLetter = mgrsString.charAt(i++); // Should we check the zone letter here? Why not.

    if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
      throw "MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString;
    }

    hunK = mgrsString.substring(i, i += 2);
    var set = get100kSetForZone(zoneNumber);
    var east100k = getEastingFromChar(hunK.charAt(0), set);
    var north100k = getNorthingFromChar(hunK.charAt(1), set); // We have a bug where the northing may be 2000000 too low.
    // How
    // do we know when to roll over?

    while (north100k < getMinNorthing(zoneLetter)) {
      north100k += 2000000;
    } // calculate the char index for easting/northing separator


    var remainder = length - i;

    if (remainder % 2 !== 0) {
      throw "MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString;
    }

    var sep = remainder / 2;
    var sepEasting = 0.0;
    var sepNorthing = 0.0;
    var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;

    if (sep > 0) {
      accuracyBonus = 100000.0 / Math.pow(10, sep);
      sepEastingString = mgrsString.substring(i, i + sep);
      sepEasting = parseFloat(sepEastingString) * accuracyBonus;
      sepNorthingString = mgrsString.substring(i + sep);
      sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
    }

    easting = sepEasting + east100k;
    northing = sepNorthing + north100k;
    return {
      easting: easting,
      northing: northing,
      zoneLetter: zoneLetter,
      zoneNumber: zoneNumber,
      accuracy: accuracyBonus
    };
  }
  /**
   * Given the first letter from a two-letter MGRS 100k zone, and given the
   * MGRS table set for the zone number, figure out the easting value that
   * should be added to the other, secondary easting value.
   *
   * @private
   * @param {char} e The first letter from a two-letter MGRS 100´k zone.
   * @param {number} set The MGRS table set for the zone number.
   * @return {number} The easting value for the given letter and set.
   */


  function getEastingFromChar(e, set) {
    // colOrigin is the letter at the origin of the set for the
    // column
    var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
    var eastingValue = 100000.0;
    var rewindMarker = false;

    while (curCol !== e.charCodeAt(0)) {
      curCol++;

      if (curCol === I) {
        curCol++;
      }

      if (curCol === O) {
        curCol++;
      }

      if (curCol > Z) {
        if (rewindMarker) {
          throw "Bad character: " + e;
        }

        curCol = A;
        rewindMarker = true;
      }

      eastingValue += 100000.0;
    }

    return eastingValue;
  }
  /**
   * Given the second letter from a two-letter MGRS 100k zone, and given the
   * MGRS table set for the zone number, figure out the northing value that
   * should be added to the other, secondary northing value. You have to
   * remember that Northings are determined from the equator, and the vertical
   * cycle of letters mean a 2000000 additional northing meters. This happens
   * approx. every 18 degrees of latitude. This method does *NOT* count any
   * additional northings. You have to figure out how many 2000000 meters need
   * to be added for the zone letter of the MGRS coordinate.
   *
   * @private
   * @param {char} n Second letter of the MGRS 100k zone
   * @param {number} set The MGRS table set number, which is dependent on the
   *     UTM zone number.
   * @return {number} The northing value for the given letter and set.
   */


  function getNorthingFromChar(n, set) {
    if (n > 'V') {
      throw "MGRSPoint given invalid Northing " + n;
    } // rowOrigin is the letter at the origin of the set for the
    // column


    var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
    var northingValue = 0.0;
    var rewindMarker = false;

    while (curRow !== n.charCodeAt(0)) {
      curRow++;

      if (curRow === I) {
        curRow++;
      }

      if (curRow === O) {
        curRow++;
      } // fixing a bug making whole application hang in this loop
      // when 'n' is a wrong character


      if (curRow > V) {
        if (rewindMarker) {
          // making sure that this loop ends
          throw "Bad character: " + n;
        }

        curRow = A;
        rewindMarker = true;
      }

      northingValue += 100000.0;
    }

    return northingValue;
  }
  /**
   * The function getMinNorthing returns the minimum northing value of a MGRS
   * zone.
   *
   * Ported from Geotrans' c Lattitude_Band_Value structure table.
   *
   * @private
   * @param {char} zoneLetter The MGRS zone to get the min northing for.
   * @return {number}
   */


  function getMinNorthing(zoneLetter) {
    var northing;

    switch (zoneLetter) {
      case 'C':
        northing = 1100000.0;
        break;

      case 'D':
        northing = 2000000.0;
        break;

      case 'E':
        northing = 2800000.0;
        break;

      case 'F':
        northing = 3700000.0;
        break;

      case 'G':
        northing = 4600000.0;
        break;

      case 'H':
        northing = 5500000.0;
        break;

      case 'J':
        northing = 6400000.0;
        break;

      case 'K':
        northing = 7300000.0;
        break;

      case 'L':
        northing = 8200000.0;
        break;

      case 'M':
        northing = 9100000.0;
        break;

      case 'N':
        northing = 0.0;
        break;

      case 'P':
        northing = 800000.0;
        break;

      case 'Q':
        northing = 1700000.0;
        break;

      case 'R':
        northing = 2600000.0;
        break;

      case 'S':
        northing = 3500000.0;
        break;

      case 'T':
        northing = 4400000.0;
        break;

      case 'U':
        northing = 5300000.0;
        break;

      case 'V':
        northing = 6200000.0;
        break;

      case 'W':
        northing = 7000000.0;
        break;

      case 'X':
        northing = 7900000.0;
        break;

      default:
        northing = -1.0;
    }

    if (northing >= 0.0) {
      return northing;
    } else {
      throw "Invalid zone letter: " + zoneLetter;
    }
  }

  function Point(x, y, z) {
    if (!(this instanceof Point)) {
      return new Point(x, y, z);
    }

    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2] || 0.0;
    } else if (_typeof(x) === 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z || 0.0;
    } else if (typeof x === 'string' && typeof y === 'undefined') {
      var coords = x.split(',');
      this.x = parseFloat(coords[0], 10);
      this.y = parseFloat(coords[1], 10);
      this.z = parseFloat(coords[2], 10) || 0.0;
    } else {
      this.x = x;
      this.y = y;
      this.z = z || 0.0;
    }

    console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
  }

  Point.fromMGRS = function (mgrsStr) {
    return new Point(toPoint(mgrsStr));
  };

  Point.prototype.toMGRS = function (accuracy) {
    return forward$1([this.x, this.y], accuracy);
  };

  var C00 = 1;
  var C02 = 0.25;
  var C04 = 0.046875;
  var C06 = 0.01953125;
  var C08 = 0.01068115234375;
  var C22 = 0.75;
  var C44 = 0.46875;
  var C46 = 0.01302083333333333333;
  var C48 = 0.00712076822916666666;
  var C66 = 0.36458333333333333333;
  var C68 = 0.00569661458333333333;
  var C88 = 0.3076171875;
  function pj_enfn (es) {
    var en = [];
    en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
    en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
    var t = es * es;
    en[2] = t * (C44 - es * (C46 + es * C48));
    t *= es;
    en[3] = t * (C66 - es * C68);
    en[4] = t * es * C88;
    return en;
  }

  function pj_mlfn (phi, sphi, cphi, en) {
    cphi *= sphi;
    sphi *= sphi;
    return en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4])));
  }

  var MAX_ITER = 20;
  function pj_inv_mlfn (arg, es, en) {
    var k = 1 / (1 - es);
    var phi = arg;

    for (var i = MAX_ITER; i; --i) {
      /* rarely goes over 2 iterations */
      var s = Math.sin(phi);
      var t = 1 - es * s * s; //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
      //phi -= t * (t * Math.sqrt(t)) * k;

      t = (pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
      phi -= t;

      if (Math.abs(t) < EPSLN) {
        return phi;
      }
    } //..reportError("cass:pj_inv_mlfn: Convergence error");


    return phi;
  }

  // Heavily based on this tmerc projection implementation
  function init$2() {
    this.x0 = this.x0 !== undefined ? this.x0 : 0;
    this.y0 = this.y0 !== undefined ? this.y0 : 0;
    this.long0 = this.long0 !== undefined ? this.long0 : 0;
    this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

    if (this.es) {
      this.en = pj_enfn(this.es);
      this.ml0 = pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
    }
  }
  /**
      Transverse Mercator Forward  - long/lat to x/y
      long/lat in radians
    */

  function forward$2(p) {
    var lon = p.x;
    var lat = p.y;
    var delta_lon = adjust_lon(lon - this.long0);
    var con;
    var x, y;
    var sin_phi = Math.sin(lat);
    var cos_phi = Math.cos(lat);

    if (!this.es) {
      var b = cos_phi * Math.sin(delta_lon);

      if (Math.abs(Math.abs(b) - 1) < EPSLN) {
        return 93;
      } else {
        x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b)) + this.x0;
        y = cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - Math.pow(b, 2));
        b = Math.abs(y);

        if (b >= 1) {
          if (b - 1 > EPSLN) {
            return 93;
          } else {
            y = 0;
          }
        } else {
          y = Math.acos(y);
        }

        if (lat < 0) {
          y = -y;
        }

        y = this.a * this.k0 * (y - this.lat0) + this.y0;
      }
    } else {
      var al = cos_phi * delta_lon;
      var als = Math.pow(al, 2);
      var c = this.ep2 * Math.pow(cos_phi, 2);
      var cs = Math.pow(c, 2);
      var tq = Math.abs(cos_phi) > EPSLN ? Math.tan(lat) : 0;
      var t = Math.pow(tq, 2);
      var ts = Math.pow(t, 2);
      con = 1 - this.es * Math.pow(sin_phi, 2);
      al = al / Math.sqrt(con);
      var ml = pj_mlfn(lat, sin_phi, cos_phi, this.en);
      x = this.a * (this.k0 * al * (1 + als / 6 * (1 - t + c + als / 20 * (5 - 18 * t + ts + 14 * c - 58 * t * c + als / 42 * (61 + 179 * ts - ts * t - 479 * t))))) + this.x0;
      y = this.a * (this.k0 * (ml - this.ml0 + sin_phi * delta_lon * al / 2 * (1 + als / 12 * (5 - t + 9 * c + 4 * cs + als / 30 * (61 + ts - 58 * t + 270 * c - 330 * t * c + als / 56 * (1385 + 543 * ts - ts * t - 3111 * t)))))) + this.y0;
    }

    p.x = x;
    p.y = y;
    return p;
  }
  /**
      Transverse Mercator Inverse  -  x/y to long/lat
    */

  function inverse$2(p) {
    var con, phi;
    var lat, lon;
    var x = (p.x - this.x0) * (1 / this.a);
    var y = (p.y - this.y0) * (1 / this.a);

    if (!this.es) {
      var f = Math.exp(x / this.k0);
      var g = 0.5 * (f - 1 / f);
      var temp = this.lat0 + y / this.k0;
      var h = Math.cos(temp);
      con = Math.sqrt((1 - Math.pow(h, 2)) / (1 + Math.pow(g, 2)));
      lat = Math.asin(con);

      if (y < 0) {
        lat = -lat;
      }

      if (g === 0 && h === 0) {
        lon = 0;
      } else {
        lon = adjust_lon(Math.atan2(g, h) + this.long0);
      }
    } else {
      // ellipsoidal form
      con = this.ml0 + y / this.k0;
      phi = pj_inv_mlfn(con, this.es, this.en);

      if (Math.abs(phi) < HALF_PI) {
        var sin_phi = Math.sin(phi);
        var cos_phi = Math.cos(phi);
        var tan_phi = Math.abs(cos_phi) > EPSLN ? Math.tan(phi) : 0;
        var c = this.ep2 * Math.pow(cos_phi, 2);
        var cs = Math.pow(c, 2);
        var t = Math.pow(tan_phi, 2);
        var ts = Math.pow(t, 2);
        con = 1 - this.es * Math.pow(sin_phi, 2);
        var d = x * Math.sqrt(con) / this.k0;
        var ds = Math.pow(d, 2);
        con = con * tan_phi;
        lat = phi - con * ds / (1 - this.es) * 0.5 * (1 - ds / 12 * (5 + 3 * t - 9 * c * t + c - 4 * cs - ds / 30 * (61 + 90 * t - 252 * c * t + 45 * ts + 46 * c - ds / 56 * (1385 + 3633 * t + 4095 * ts + 1574 * ts * t))));
        lon = adjust_lon(this.long0 + d * (1 - ds / 6 * (1 + 2 * t + c - ds / 20 * (5 + 28 * t + 24 * ts + 8 * c * t + 6 * c - ds / 42 * (61 + 662 * t + 1320 * ts + 720 * ts * t)))) / cos_phi);
      } else {
        lat = HALF_PI * sign(y);
        lon = 0;
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$3 = ["Fast_Transverse_Mercator", "Fast Transverse Mercator"];
  var tmerc = {
    init: init$2,
    forward: forward$2,
    inverse: inverse$2,
    names: names$3
  };

  function sinh (x) {
    var r = Math.exp(x);
    r = (r - 1 / r) / 2;
    return r;
  }

  function hypot (x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    var a = Math.max(x, y);
    var b = Math.min(x, y) / (a ? a : 1);
    return a * Math.sqrt(1 + Math.pow(b, 2));
  }

  function log1py (x) {
    var y = 1 + x;
    var z = y - 1;
    return z === 0 ? x : x * Math.log(y) / z;
  }

  function asinhy (x) {
    var y = Math.abs(x);
    y = log1py(y * (1 + y / (hypot(1, y) + 1)));
    return x < 0 ? -y : y;
  }

  function gatg (pp, B) {
    var cos_2B = 2 * Math.cos(2 * B);
    var i = pp.length - 1;
    var h1 = pp[i];
    var h2 = 0;
    var h;

    while (--i >= 0) {
      h = -h2 + cos_2B * h1 + pp[i];
      h2 = h1;
      h1 = h;
    }

    return B + h * Math.sin(2 * B);
  }

  function clens (pp, arg_r) {
    var r = 2 * Math.cos(arg_r);
    var i = pp.length - 1;
    var hr1 = pp[i];
    var hr2 = 0;
    var hr;

    while (--i >= 0) {
      hr = -hr2 + r * hr1 + pp[i];
      hr2 = hr1;
      hr1 = hr;
    }

    return Math.sin(arg_r) * hr;
  }

  function cosh (x) {
    var r = Math.exp(x);
    r = (r + 1 / r) / 2;
    return r;
  }

  function clens_cmplx (pp, arg_r, arg_i) {
    var sin_arg_r = Math.sin(arg_r);
    var cos_arg_r = Math.cos(arg_r);
    var sinh_arg_i = sinh(arg_i);
    var cosh_arg_i = cosh(arg_i);
    var r = 2 * cos_arg_r * cosh_arg_i;
    var i = -2 * sin_arg_r * sinh_arg_i;
    var j = pp.length - 1;
    var hr = pp[j];
    var hi1 = 0;
    var hr1 = 0;
    var hi = 0;
    var hr2;
    var hi2;

    while (--j >= 0) {
      hr2 = hr1;
      hi2 = hi1;
      hr1 = hr;
      hi1 = hi;
      hr = -hr2 + r * hr1 - i * hi1 + pp[j];
      hi = -hi2 + i * hr1 + r * hi1;
    }

    r = sin_arg_r * cosh_arg_i;
    i = cos_arg_r * sinh_arg_i;
    return [r * hr - i * hi, r * hi + i * hr];
  }

  // Heavily based on this etmerc projection implementation
  function init$3() {
    if (!this.approx && (isNaN(this.es) || this.es <= 0)) {
      throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
    }

    if (this.approx) {
      // When '+approx' is set, use tmerc instead
      tmerc.init.apply(this);
      this.forward = tmerc.forward;
      this.inverse = tmerc.inverse;
    }

    this.x0 = this.x0 !== undefined ? this.x0 : 0;
    this.y0 = this.y0 !== undefined ? this.y0 : 0;
    this.long0 = this.long0 !== undefined ? this.long0 : 0;
    this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;
    this.cgb = [];
    this.cbg = [];
    this.utg = [];
    this.gtu = [];
    var f = this.es / (1 + Math.sqrt(1 - this.es));
    var n = f / (2 - f);
    var np = n;
    this.cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675))))));
    this.cbg[0] = n * (-2 + n * (2 / 3 + n * (4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));
    np = np * n;
    this.cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
    this.cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * (-13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));
    np = np * n;
    this.cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
    this.cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));
    np = np * n;
    this.cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
    this.cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * (-24832 / 14175)));
    np = np * n;
    this.cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
    this.cbg[4] = np * (-734 / 315 + n * (109598 / 31185));
    np = np * n;
    this.cgb[5] = np * (601676 / 22275);
    this.cbg[5] = np * (444337 / 155925);
    np = Math.pow(n, 2);
    this.Qn = this.k0 / (1 + n) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));
    this.utg[0] = n * (-0.5 + n * (2 / 3 + n * (-37 / 96 + n * (1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
    this.gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));
    this.utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
    this.gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));
    np = np * n;
    this.utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720))));
    this.gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));
    np = np * n;
    this.utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
    this.gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));
    np = np * n;
    this.utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
    this.gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));
    np = np * n;
    this.utg[5] = np * (-20648693 / 638668800);
    this.gtu[5] = np * (212378941 / 319334400);
    var Z = gatg(this.cbg, this.lat0);
    this.Zb = -this.Qn * (Z + clens(this.gtu, 2 * Z));
  }
  function forward$3(p) {
    var Ce = adjust_lon(p.x - this.long0);
    var Cn = p.y;
    Cn = gatg(this.cbg, Cn);
    var sin_Cn = Math.sin(Cn);
    var cos_Cn = Math.cos(Cn);
    var sin_Ce = Math.sin(Ce);
    var cos_Ce = Math.cos(Ce);
    Cn = Math.atan2(sin_Cn, cos_Ce * cos_Cn);
    Ce = Math.atan2(sin_Ce * cos_Cn, hypot(sin_Cn, cos_Cn * cos_Ce));
    Ce = asinhy(Math.tan(Ce));
    var tmp = clens_cmplx(this.gtu, 2 * Cn, 2 * Ce);
    Cn = Cn + tmp[0];
    Ce = Ce + tmp[1];
    var x;
    var y;

    if (Math.abs(Ce) <= 2.623395162778) {
      x = this.a * (this.Qn * Ce) + this.x0;
      y = this.a * (this.Qn * Cn + this.Zb) + this.y0;
    } else {
      x = Infinity;
      y = Infinity;
    }

    p.x = x;
    p.y = y;
    return p;
  }
  function inverse$3(p) {
    var Ce = (p.x - this.x0) * (1 / this.a);
    var Cn = (p.y - this.y0) * (1 / this.a);
    Cn = (Cn - this.Zb) / this.Qn;
    Ce = Ce / this.Qn;
    var lon;
    var lat;

    if (Math.abs(Ce) <= 2.623395162778) {
      var tmp = clens_cmplx(this.utg, 2 * Cn, 2 * Ce);
      Cn = Cn + tmp[0];
      Ce = Ce + tmp[1];
      Ce = Math.atan(sinh(Ce));
      var sin_Cn = Math.sin(Cn);
      var cos_Cn = Math.cos(Cn);
      var sin_Ce = Math.sin(Ce);
      var cos_Ce = Math.cos(Ce);
      Cn = Math.atan2(sin_Cn * cos_Ce, hypot(sin_Ce, cos_Ce * cos_Cn));
      Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);
      lon = adjust_lon(Ce + this.long0);
      lat = gatg(this.cgb, Cn);
    } else {
      lon = Infinity;
      lat = Infinity;
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$4 = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc", "Transverse_Mercator", "Transverse Mercator", "tmerc"];
  var etmerc = {
    init: init$3,
    forward: forward$3,
    inverse: inverse$3,
    names: names$4
  };

  function adjust_zone (zone, lon) {
    if (zone === undefined) {
      zone = Math.floor((adjust_lon(lon) + Math.PI) * 30 / Math.PI) + 1;

      if (zone < 0) {
        return 0;
      } else if (zone > 60) {
        return 60;
      }
    }

    return zone;
  }

  var dependsOn = 'etmerc';
  function init$4() {
    var zone = adjust_zone(this.zone, this.long0);

    if (zone === undefined) {
      throw new Error('unknown utm zone');
    }

    this.lat0 = 0;
    this.long0 = (6 * Math.abs(zone) - 183) * D2R;
    this.x0 = 500000;
    this.y0 = this.utmSouth ? 10000000 : 0;
    this.k0 = 0.9996;
    etmerc.init.apply(this);
    this.forward = etmerc.forward;
    this.inverse = etmerc.inverse;
  }
  var names$5 = ["Universal Transverse Mercator System", "utm"];
  var utm = {
    init: init$4,
    names: names$5,
    dependsOn: dependsOn
  };

  function srat (esinp, exp) {
    return Math.pow((1 - esinp) / (1 + esinp), exp);
  }

  var MAX_ITER$1 = 20;
  function init$5() {
    var sphi = Math.sin(this.lat0);
    var cphi = Math.cos(this.lat0);
    cphi *= cphi;
    this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
    this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
    this.phic0 = Math.asin(sphi / this.C);
    this.ratexp = 0.5 * this.C * this.e;
    this.K = Math.tan(0.5 * this.phic0 + FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + FORTPI), this.C) * srat(this.e * sphi, this.ratexp));
  }
  function forward$4(p) {
    var lon = p.x;
    var lat = p.y;
    p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + FORTPI), this.C) * srat(this.e * Math.sin(lat), this.ratexp)) - HALF_PI;
    p.x = this.C * lon;
    return p;
  }
  function inverse$4(p) {
    var DEL_TOL = 1e-14;
    var lon = p.x / this.C;
    var lat = p.y;
    var num = Math.pow(Math.tan(0.5 * lat + FORTPI) / this.K, 1 / this.C);

    for (var i = MAX_ITER$1; i > 0; --i) {
      lat = 2 * Math.atan(num * srat(this.e * Math.sin(p.y), -0.5 * this.e)) - HALF_PI;

      if (Math.abs(lat - p.y) < DEL_TOL) {
        break;
      }

      p.y = lat;
    }
    /* convergence failed */


    if (!i) {
      return null;
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$6 = ["gauss"];
  var gauss = {
    init: init$5,
    forward: forward$4,
    inverse: inverse$4,
    names: names$6
  };

  function init$6() {
    gauss.init.apply(this);

    if (!this.rc) {
      return;
    }

    this.sinc0 = Math.sin(this.phic0);
    this.cosc0 = Math.cos(this.phic0);
    this.R2 = 2 * this.rc;

    if (!this.title) {
      this.title = "Oblique Stereographic Alternative";
    }
  }
  function forward$5(p) {
    var sinc, cosc, cosl, k;
    p.x = adjust_lon(p.x - this.long0);
    gauss.forward.apply(this, [p]);
    sinc = Math.sin(p.y);
    cosc = Math.cos(p.y);
    cosl = Math.cos(p.x);
    k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
    p.x = k * cosc * Math.sin(p.x);
    p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
    p.x = this.a * p.x + this.x0;
    p.y = this.a * p.y + this.y0;
    return p;
  }
  function inverse$5(p) {
    var sinc, cosc, lon, lat, rho;
    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;
    p.x /= this.k0;
    p.y /= this.k0;

    if (rho = Math.sqrt(p.x * p.x + p.y * p.y)) {
      var c = 2 * Math.atan2(rho, this.R2);
      sinc = Math.sin(c);
      cosc = Math.cos(c);
      lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
      lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
    } else {
      lat = this.phic0;
      lon = 0;
    }

    p.x = lon;
    p.y = lat;
    gauss.inverse.apply(this, [p]);
    p.x = adjust_lon(p.x + this.long0);
    return p;
  }
  var names$7 = ["Stereographic_North_Pole", "Oblique_Stereographic", "Polar_Stereographic", "sterea", "Oblique Stereographic Alternative", "Double_Stereographic"];
  var sterea = {
    init: init$6,
    forward: forward$5,
    inverse: inverse$5,
    names: names$7
  };

  function ssfn_(phit, sinphi, eccen) {
    sinphi *= eccen;
    return Math.tan(0.5 * (HALF_PI + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen);
  }
  function init$7() {
    this.coslat0 = Math.cos(this.lat0);
    this.sinlat0 = Math.sin(this.lat0);

    if (this.sphere) {
      if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
        this.k0 = 0.5 * (1 + sign(this.lat0) * Math.sin(this.lat_ts));
      }
    } else {
      if (Math.abs(this.coslat0) <= EPSLN) {
        if (this.lat0 > 0) {
          //North pole
          //trace('stere:north pole');
          this.con = 1;
        } else {
          //South pole
          //trace('stere:south pole');
          this.con = -1;
        }
      }

      this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));

      if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
        this.k0 = 0.5 * this.cons * msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / tsfnz(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
      }

      this.ms1 = msfnz(this.e, this.sinlat0, this.coslat0);
      this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - HALF_PI;
      this.cosX0 = Math.cos(this.X0);
      this.sinX0 = Math.sin(this.X0);
    }
  } // Stereographic forward equations--mapping lat,long to x,y

  function forward$6(p) {
    var lon = p.x;
    var lat = p.y;
    var sinlat = Math.sin(lat);
    var coslat = Math.cos(lat);
    var A, X, sinX, cosX, ts, rh;
    var dlon = adjust_lon(lon - this.long0);

    if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= EPSLN && Math.abs(lat + this.lat0) <= EPSLN) {
      //case of the origine point
      //trace('stere:this is the origin point');
      p.x = NaN;
      p.y = NaN;
      return p;
    }

    if (this.sphere) {
      //trace('stere:sphere case');
      A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
      p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
      p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
      return p;
    } else {
      X = 2 * Math.atan(this.ssfn_(lat, sinlat, this.e)) - HALF_PI;
      cosX = Math.cos(X);
      sinX = Math.sin(X);

      if (Math.abs(this.coslat0) <= EPSLN) {
        ts = tsfnz(this.e, lat * this.con, this.con * sinlat);
        rh = 2 * this.a * this.k0 * ts / this.cons;
        p.x = this.x0 + rh * Math.sin(lon - this.long0);
        p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0); //trace(p.toString());

        return p;
      } else if (Math.abs(this.sinlat0) < EPSLN) {
        //Eq
        //trace('stere:equateur');
        A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
        p.y = A * sinX;
      } else {
        //other case
        //trace('stere:normal case');
        A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
        p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
      }

      p.x = A * cosX * Math.sin(dlon) + this.x0;
    } //trace(p.toString());


    return p;
  } //* Stereographic inverse equations--mapping x,y to lat/long

  function inverse$6(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var lon, lat, ts, ce, Chi;
    var rh = Math.sqrt(p.x * p.x + p.y * p.y);

    if (this.sphere) {
      var c = 2 * Math.atan(rh / (2 * this.a * this.k0));
      lon = this.long0;
      lat = this.lat0;

      if (rh <= EPSLN) {
        p.x = lon;
        p.y = lat;
        return p;
      }

      lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);

      if (Math.abs(this.coslat0) < EPSLN) {
        if (this.lat0 > 0) {
          lon = adjust_lon(this.long0 + Math.atan2(p.x, -1 * p.y));
        } else {
          lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
        }
      } else {
        lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)));
      }

      p.x = lon;
      p.y = lat;
      return p;
    } else {
      if (Math.abs(this.coslat0) <= EPSLN) {
        if (rh <= EPSLN) {
          lat = this.lat0;
          lon = this.long0;
          p.x = lon;
          p.y = lat; //trace(p.toString());

          return p;
        }

        p.x *= this.con;
        p.y *= this.con;
        ts = rh * this.cons / (2 * this.a * this.k0);
        lat = this.con * phi2z(this.e, ts);
        lon = this.con * adjust_lon(this.con * this.long0 + Math.atan2(p.x, -1 * p.y));
      } else {
        ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
        lon = this.long0;

        if (rh <= EPSLN) {
          Chi = this.X0;
        } else {
          Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
          lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)));
        }

        lat = -1 * phi2z(this.e, Math.tan(0.5 * (HALF_PI + Chi)));
      }
    }

    p.x = lon;
    p.y = lat; //trace(p.toString());

    return p;
  }
  var names$8 = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)"];
  var stere = {
    init: init$7,
    forward: forward$6,
    inverse: inverse$6,
    names: names$8,
    ssfn_: ssfn_
  };

  /*
    references:
      Formules et constantes pour le Calcul pour la
      projection cylindrique conforme à axe oblique et pour la transformation entre
      des systèmes de référence.
      http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
    */
  function init$8() {
    var phy0 = this.lat0;
    this.lambda0 = this.long0;
    var sinPhy0 = Math.sin(phy0);
    var semiMajorAxis = this.a;
    var invF = this.rf;
    var flattening = 1 / invF;
    var e2 = 2 * flattening - Math.pow(flattening, 2);
    var e = this.e = Math.sqrt(e2);
    this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
    this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
    this.b0 = Math.asin(sinPhy0 / this.alpha);
    var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
    var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
    var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
    this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
  }
  function forward$7(p) {
    var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
    var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
    var S = -this.alpha * (Sa1 + Sa2) + this.K; // spheric latitude

    var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4); // spheric longitude

    var I = this.alpha * (p.x - this.lambda0); // psoeudo equatorial rotation

    var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));
    var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));
    p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
    p.x = this.R * rotI + this.x0;
    return p;
  }
  function inverse$7(p) {
    var Y = p.x - this.x0;
    var X = p.y - this.y0;
    var rotI = Y / this.R;
    var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);
    var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
    var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));
    var lambda = this.lambda0 + I / this.alpha;
    var S = 0;
    var phy = b;
    var prevPhy = -1000;
    var iteration = 0;

    while (Math.abs(phy - prevPhy) > 0.0000001) {
      if (++iteration > 20) {
        //...reportError("omercFwdInfinity");
        return;
      } //S = Math.log(Math.tan(Math.PI / 4 + phy / 2));


      S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
      prevPhy = phy;
      phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
    }

    p.x = lambda;
    p.y = phy;
    return p;
  }
  var names$9 = ["somerc"];
  var somerc = {
    init: init$8,
    forward: forward$7,
    inverse: inverse$7,
    names: names$9
  };

  var TOL = 1e-7;

  function isTypeA(P) {
    var typeAProjections = ['Hotine_Oblique_Mercator', 'Hotine_Oblique_Mercator_Azimuth_Natural_Origin'];
    var projectionName = _typeof(P.PROJECTION) === "object" ? Object.keys(P.PROJECTION)[0] : P.PROJECTION;
    return 'no_uoff' in P || 'no_off' in P || typeAProjections.indexOf(projectionName) !== -1;
  }
  /* Initialize the Oblique Mercator  projection
      ------------------------------------------*/


  function init$9() {
    var con,
        com,
        cosph0,
        D,
        F,
        H,
        L,
        sinph0,
        p,
        J,
        gamma = 0,
        gamma0,
        lamc = 0,
        lam1 = 0,
        lam2 = 0,
        phi1 = 0,
        phi2 = 0,
        alpha_c = 0;
   // only Type A uses the no_off or no_uoff property
    // https://github.com/OSGeo/proj.4/issues/104

    this.no_off = isTypeA(this);
    this.no_rot = 'no_rot' in this;
    var alp = false;

    if ("alpha" in this) {
      alp = true;
    }

    var gam = false;

    if ("rectified_grid_angle" in this) {
      gam = true;
    }

    if (alp) {
      alpha_c = this.alpha;
    }

    if (gam) {
      gamma = this.rectified_grid_angle * D2R;
    }

    if (alp || gam) {
      lamc = this.longc;
    } else {
      lam1 = this.long1;
      phi1 = this.lat1;
      lam2 = this.long2;
      phi2 = this.lat2;

      if (Math.abs(phi1 - phi2) <= TOL || (con = Math.abs(phi1)) <= TOL || Math.abs(con - HALF_PI) <= TOL || Math.abs(Math.abs(this.lat0) - HALF_PI) <= TOL || Math.abs(Math.abs(phi2) - HALF_PI) <= TOL) {
        throw new Error();
      }
    }

    var one_es = 1.0 - this.es;
    com = Math.sqrt(one_es);

    if (Math.abs(this.lat0) > EPSLN) {
      sinph0 = Math.sin(this.lat0);
      cosph0 = Math.cos(this.lat0);
      con = 1 - this.es * sinph0 * sinph0;
      this.B = cosph0 * cosph0;
      this.B = Math.sqrt(1 + this.es * this.B * this.B / one_es);
      this.A = this.B * this.k0 * com / con;
      D = this.B * com / (cosph0 * Math.sqrt(con));
      F = D * D - 1;

      if (F <= 0) {
        F = 0;
      } else {
        F = Math.sqrt(F);

        if (this.lat0 < 0) {
          F = -F;
        }
      }

      this.E = F += D;
      this.E *= Math.pow(tsfnz(this.e, this.lat0, sinph0), this.B);
    } else {
      this.B = 1 / com;
      this.A = this.k0;
      this.E = D = F = 1;
    }

    if (alp || gam) {
      if (alp) {
        gamma0 = Math.asin(Math.sin(alpha_c) / D);

        if (!gam) {
          gamma = alpha_c;
        }
      } else {
        gamma0 = gamma;
        alpha_c = Math.asin(D * Math.sin(gamma0));
      }

      this.lam0 = lamc - Math.asin(0.5 * (F - 1 / F) * Math.tan(gamma0)) / this.B;
    } else {
      H = Math.pow(tsfnz(this.e, phi1, Math.sin(phi1)), this.B);
      L = Math.pow(tsfnz(this.e, phi2, Math.sin(phi2)), this.B);
      F = this.E / H;
      p = (L - H) / (L + H);
      J = this.E * this.E;
      J = (J - L * H) / (J + L * H);
      con = lam1 - lam2;

      if (con < -Math.pi) {
        lam2 -= TWO_PI;
      } else if (con > Math.pi) {
        lam2 += TWO_PI;
      }

      this.lam0 = adjust_lon(0.5 * (lam1 + lam2) - Math.atan(J * Math.tan(0.5 * this.B * (lam1 - lam2)) / p) / this.B);
      gamma0 = Math.atan(2 * Math.sin(this.B * adjust_lon(lam1 - this.lam0)) / (F - 1 / F));
      gamma = alpha_c = Math.asin(D * Math.sin(gamma0));
    }

    this.singam = Math.sin(gamma0);
    this.cosgam = Math.cos(gamma0);
    this.sinrot = Math.sin(gamma);
    this.cosrot = Math.cos(gamma);
    this.rB = 1 / this.B;
    this.ArB = this.A * this.rB;
    this.BrA = 1 / this.ArB;
    this.A * this.B;

    if (this.no_off) {
      this.u_0 = 0;
    } else {
      this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(D * D - 1) / Math.cos(alpha_c)));

      if (this.lat0 < 0) {
        this.u_0 = -this.u_0;
      }
    }

    F = 0.5 * gamma0;
    this.v_pole_n = this.ArB * Math.log(Math.tan(FORTPI - F));
    this.v_pole_s = this.ArB * Math.log(Math.tan(FORTPI + F));
  }
  /* Oblique Mercator forward equations--mapping lat,long to x,y
      ----------------------------------------------------------*/

  function forward$8(p) {
    var coords = {};
    var S, T, U, V, W, temp, u, v;
    p.x = p.x - this.lam0;

    if (Math.abs(Math.abs(p.y) - HALF_PI) > EPSLN) {
      W = this.E / Math.pow(tsfnz(this.e, p.y, Math.sin(p.y)), this.B);
      temp = 1 / W;
      S = 0.5 * (W - temp);
      T = 0.5 * (W + temp);
      V = Math.sin(this.B * p.x);
      U = (S * this.singam - V * this.cosgam) / T;

      if (Math.abs(Math.abs(U) - 1.0) < EPSLN) {
        throw new Error();
      }

      v = 0.5 * this.ArB * Math.log((1 - U) / (1 + U));
      temp = Math.cos(this.B * p.x);

      if (Math.abs(temp) < TOL) {
        u = this.A * p.x;
      } else {
        u = this.ArB * Math.atan2(S * this.cosgam + V * this.singam, temp);
      }
    } else {
      v = p.y > 0 ? this.v_pole_n : this.v_pole_s;
      u = this.ArB * p.y;
    }

    if (this.no_rot) {
      coords.x = u;
      coords.y = v;
    } else {
      u -= this.u_0;
      coords.x = v * this.cosrot + u * this.sinrot;
      coords.y = u * this.cosrot - v * this.sinrot;
    }

    coords.x = this.a * coords.x + this.x0;
    coords.y = this.a * coords.y + this.y0;
    return coords;
  }
  function inverse$8(p) {
    var u, v, Qp, Sp, Tp, Vp, Up;
    var coords = {};
    p.x = (p.x - this.x0) * (1.0 / this.a);
    p.y = (p.y - this.y0) * (1.0 / this.a);

    if (this.no_rot) {
      v = p.y;
      u = p.x;
    } else {
      v = p.x * this.cosrot - p.y * this.sinrot;
      u = p.y * this.cosrot + p.x * this.sinrot + this.u_0;
    }

    Qp = Math.exp(-this.BrA * v);
    Sp = 0.5 * (Qp - 1 / Qp);
    Tp = 0.5 * (Qp + 1 / Qp);
    Vp = Math.sin(this.BrA * u);
    Up = (Vp * this.cosgam + Sp * this.singam) / Tp;

    if (Math.abs(Math.abs(Up) - 1) < EPSLN) {
      coords.x = 0;
      coords.y = Up < 0 ? -HALF_PI : HALF_PI;
    } else {
      coords.y = this.E / Math.sqrt((1 + Up) / (1 - Up));
      coords.y = phi2z(this.e, Math.pow(coords.y, 1 / this.B));

      if (coords.y === Infinity) {
        throw new Error();
      }

      coords.x = -this.rB * Math.atan2(Sp * this.cosgam - Vp * this.singam, Math.cos(this.BrA * u));
    }

    coords.x += this.lam0;
    return coords;
  }
  var names$a = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Two_Point_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "Oblique_Mercator", "omerc"];
  var omerc = {
    init: init$9,
    forward: forward$8,
    inverse: inverse$8,
    names: names$a
  };

  function init$a() {
    //double lat0;                    /* the reference latitude               */
    //double long0;                   /* the reference longitude              */
    //double lat1;                    /* first standard parallel              */
    //double lat2;                    /* second standard parallel             */
    //double r_maj;                   /* major axis                           */
    //double r_min;                   /* minor axis                           */
    //double false_east;              /* x offset in meters                   */
    //double false_north;             /* y offset in meters                   */
    //the above value can be set with proj4.defs
    //example: proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    if (!this.lat2) {
      this.lat2 = this.lat1;
    } //if lat2 is not defined


    if (!this.k0) {
      this.k0 = 1;
    }

    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0; // Standard Parallels cannot be equal and on opposite sides of the equator

    if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
      return;
    }

    var temp = this.b / this.a;
    this.e = Math.sqrt(1 - temp * temp);
    var sin1 = Math.sin(this.lat1);
    var cos1 = Math.cos(this.lat1);
    var ms1 = msfnz(this.e, sin1, cos1);
    var ts1 = tsfnz(this.e, this.lat1, sin1);
    var sin2 = Math.sin(this.lat2);
    var cos2 = Math.cos(this.lat2);
    var ms2 = msfnz(this.e, sin2, cos2);
    var ts2 = tsfnz(this.e, this.lat2, sin2);
    var ts0 = tsfnz(this.e, this.lat0, Math.sin(this.lat0));

    if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
      this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
    } else {
      this.ns = sin1;
    }

    if (isNaN(this.ns)) {
      this.ns = sin1;
    }

    this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
    this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);

    if (!this.title) {
      this.title = "Lambert Conformal Conic";
    }
  } // Lambert Conformal conic forward equations--mapping lat,long to x,y
  // -----------------------------------------------------------------

  function forward$9(p) {
    var lon = p.x;
    var lat = p.y; // singular cases :

    if (Math.abs(2 * Math.abs(lat) - Math.PI) <= EPSLN) {
      lat = sign(lat) * (HALF_PI - 2 * EPSLN);
    }

    var con = Math.abs(Math.abs(lat) - HALF_PI);
    var ts, rh1;

    if (con > EPSLN) {
      ts = tsfnz(this.e, lat, Math.sin(lat));
      rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
    } else {
      con = lat * this.ns;

      if (con <= 0) {
        return null;
      }

      rh1 = 0;
    }

    var theta = this.ns * adjust_lon(lon - this.long0);
    p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
    p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;
    return p;
  } // Lambert Conformal Conic inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------

  function inverse$9(p) {
    var rh1, con, ts;
    var lat, lon;
    var x = (p.x - this.x0) / this.k0;
    var y = this.rh - (p.y - this.y0) / this.k0;

    if (this.ns > 0) {
      rh1 = Math.sqrt(x * x + y * y);
      con = 1;
    } else {
      rh1 = -Math.sqrt(x * x + y * y);
      con = -1;
    }

    var theta = 0;

    if (rh1 !== 0) {
      theta = Math.atan2(con * x, con * y);
    }

    if (rh1 !== 0 || this.ns > 0) {
      con = 1 / this.ns;
      ts = Math.pow(rh1 / (this.a * this.f0), con);
      lat = phi2z(this.e, ts);

      if (lat === -9999) {
        return null;
      }
    } else {
      lat = -HALF_PI;
    }

    lon = adjust_lon(theta / this.ns + this.long0);
    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$b = ["Lambert Tangential Conformal Conic Projection", "Lambert_Conformal_Conic", "Lambert_Conformal_Conic_1SP", "Lambert_Conformal_Conic_2SP", "lcc"];
  var lcc = {
    init: init$a,
    forward: forward$9,
    inverse: inverse$9,
    names: names$b
  };

  function init$b() {
    this.a = 6377397.155;
    this.es = 0.006674372230614;
    this.e = Math.sqrt(this.es);

    if (!this.lat0) {
      this.lat0 = 0.863937979737193;
    }

    if (!this.long0) {
      this.long0 = 0.7417649320975901 - 0.308341501185665;
    }
    /* if scale not set default to 0.9999 */


    if (!this.k0) {
      this.k0 = 0.9999;
    }

    this.s45 = 0.785398163397448;
    /* 45 */

    this.s90 = 2 * this.s45;
    this.fi0 = this.lat0;
    this.e2 = this.es;
    this.e = Math.sqrt(this.e2);
    this.alfa = Math.sqrt(1 + this.e2 * Math.pow(Math.cos(this.fi0), 4) / (1 - this.e2));
    this.uq = 1.04216856380474;
    this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
    this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
    this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
    this.k1 = this.k0;
    this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
    this.s0 = 1.37008346281555;
    this.n = Math.sin(this.s0);
    this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
    this.ad = this.s90 - this.uq;
  }
  /* ellipsoid */

  /* calculate xy from lat/lon */

  /* Constants, identical to inverse transform function */

  function forward$a(p) {
    var gfi, u, deltav, s, d, eps, ro;
    var lon = p.x;
    var lat = p.y;
    var delta_lon = adjust_lon(lon - this.long0);
    /* Transformation */

    gfi = Math.pow((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat)), this.alfa * this.e / 2);
    u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
    deltav = -delta_lon * this.alfa;
    s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
    d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
    eps = this.n * d;
    ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
    p.y = ro * Math.cos(eps) / 1;
    p.x = ro * Math.sin(eps) / 1;

    if (!this.czech) {
      p.y *= -1;
      p.x *= -1;
    }

    return p;
  }
  /* calculate lat/lon from xy */

  function inverse$a(p) {
    var u, deltav, s, d, eps, ro, fi1;
    var ok;
    /* Transformation */

    /* revert y, x*/

    var tmp = p.x;
    p.x = p.y;
    p.y = tmp;

    if (!this.czech) {
      p.y *= -1;
      p.x *= -1;
    }

    ro = Math.sqrt(p.x * p.x + p.y * p.y);
    eps = Math.atan2(p.y, p.x);
    d = eps / Math.sin(this.s0);
    s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
    u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
    deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
    p.x = this.long0 - deltav / this.alfa;
    fi1 = u;
    ok = 0;
    var iter = 0;

    do {
      p.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);

      if (Math.abs(fi1 - p.y) < 0.0000000001) {
        ok = 1;
      }

      fi1 = p.y;
      iter += 1;
    } while (ok === 0 && iter < 15);

    if (iter >= 15) {
      return null;
    }

    return p;
  }
  var names$c = ["Krovak", "krovak"];
  var krovak = {
    init: init$b,
    forward: forward$a,
    inverse: inverse$a,
    names: names$c
  };

  function mlfn (e0, e1, e2, e3, phi) {
    return e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi);
  }

  function e0fn (x) {
    return 1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x));
  }

  function e1fn (x) {
    return 0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x));
  }

  function e2fn (x) {
    return 0.05859375 * x * x * (1 + 0.75 * x);
  }

  function e3fn (x) {
    return x * x * x * (35 / 3072);
  }

  function gN (a, e, sinphi) {
    var temp = e * sinphi;
    return a / Math.sqrt(1 - temp * temp);
  }

  function adjust_lat (x) {
    return Math.abs(x) < HALF_PI ? x : x - sign(x) * Math.PI;
  }

  function imlfn (ml, e0, e1, e2, e3) {
    var phi;
    var dphi;
    phi = ml / e0;

    for (var i = 0; i < 15; i++) {
      dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
      phi += dphi;

      if (Math.abs(dphi) <= 0.0000000001) {
        return phi;
      }
    } //..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");


    return NaN;
  }

  function init$c() {
    if (!this.sphere) {
      this.e0 = e0fn(this.es);
      this.e1 = e1fn(this.es);
      this.e2 = e2fn(this.es);
      this.e3 = e3fn(this.es);
      this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
    }
  }
  /* Cassini forward equations--mapping lat,long to x,y
    -----------------------------------------------------------------------*/

  function forward$b(p) {
    /* Forward equations
        -----------------*/
    var x, y;
    var lam = p.x;
    var phi = p.y;
    lam = adjust_lon(lam - this.long0);

    if (this.sphere) {
      x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
      y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
    } else {
      //ellipsoid
      var sinphi = Math.sin(phi);
      var cosphi = Math.cos(phi);
      var nl = gN(this.a, this.e, sinphi);
      var tl = Math.tan(phi) * Math.tan(phi);
      var al = lam * Math.cos(phi);
      var asq = al * al;
      var cl = this.es * cosphi * cosphi / (1 - this.es);
      var ml = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);
      x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
      y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);
    }

    p.x = x + this.x0;
    p.y = y + this.y0;
    return p;
  }
  /* Inverse equations
    -----------------*/

  function inverse$b(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var x = p.x / this.a;
    var y = p.y / this.a;
    var phi, lam;

    if (this.sphere) {
      var dd = y + this.lat0;
      phi = Math.asin(Math.sin(dd) * Math.cos(x));
      lam = Math.atan2(Math.tan(x), Math.cos(dd));
    } else {
      /* ellipsoid */
      var ml1 = this.ml0 / this.a + y;
      var phi1 = imlfn(ml1, this.e0, this.e1, this.e2, this.e3);

      if (Math.abs(Math.abs(phi1) - HALF_PI) <= EPSLN) {
        p.x = this.long0;
        p.y = HALF_PI;

        if (y < 0) {
          p.y *= -1;
        }

        return p;
      }

      var nl1 = gN(this.a, this.e, Math.sin(phi1));
      var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
      var tl1 = Math.pow(Math.tan(phi1), 2);
      var dl = x * this.a / nl1;
      var dsq = dl * dl;
      phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
      lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);
    }

    p.x = adjust_lon(lam + this.long0);
    p.y = adjust_lat(phi);
    return p;
  }
  var names$d = ["Cassini", "Cassini_Soldner", "cass"];
  var cass = {
    init: init$c,
    forward: forward$b,
    inverse: inverse$b,
    names: names$d
  };

  function qsfnz (eccent, sinphi) {
    var con;

    if (eccent > 1.0e-7) {
      con = eccent * sinphi;
      return (1 - eccent * eccent) * (sinphi / (1 - con * con) - 0.5 / eccent * Math.log((1 - con) / (1 + con)));
    } else {
      return 2 * sinphi;
    }
  }

  /*
    reference
      "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
      The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
    */

  var S_POLE = 1;
  var N_POLE = 2;
  var EQUIT = 3;
  var OBLIQ = 4;
  /* Initialize the Lambert Azimuthal Equal Area projection
    ------------------------------------------------------*/

  function init$d() {
    var t = Math.abs(this.lat0);

    if (Math.abs(t - HALF_PI) < EPSLN) {
      this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE;
    } else if (Math.abs(t) < EPSLN) {
      this.mode = this.EQUIT;
    } else {
      this.mode = this.OBLIQ;
    }

    if (this.es > 0) {
      var sinphi;
      this.qp = qsfnz(this.e, 1);
      this.mmf = 0.5 / (1 - this.es);
      this.apa = authset(this.es);

      switch (this.mode) {
        case this.N_POLE:
          this.dd = 1;
          break;

        case this.S_POLE:
          this.dd = 1;
          break;

        case this.EQUIT:
          this.rq = Math.sqrt(0.5 * this.qp);
          this.dd = 1 / this.rq;
          this.xmf = 1;
          this.ymf = 0.5 * this.qp;
          break;

        case this.OBLIQ:
          this.rq = Math.sqrt(0.5 * this.qp);
          sinphi = Math.sin(this.lat0);
          this.sinb1 = qsfnz(this.e, sinphi) / this.qp;
          this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
          this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
          this.ymf = (this.xmf = this.rq) / this.dd;
          this.xmf *= this.dd;
          break;
      }
    } else {
      if (this.mode === this.OBLIQ) {
        this.sinph0 = Math.sin(this.lat0);
        this.cosph0 = Math.cos(this.lat0);
      }
    }
  }
  /* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
    -----------------------------------------------------------------------*/

  function forward$c(p) {
    /* Forward equations
        -----------------*/
    var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
    var lam = p.x;
    var phi = p.y;
    lam = adjust_lon(lam - this.long0);

    if (this.sphere) {
      sinphi = Math.sin(phi);
      cosphi = Math.cos(phi);
      coslam = Math.cos(lam);

      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        y = this.mode === this.EQUIT ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;

        if (y <= EPSLN) {
          return null;
        }

        y = Math.sqrt(2 / y);
        x = y * cosphi * Math.sin(lam);
        y *= this.mode === this.EQUIT ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
      } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
        if (this.mode === this.N_POLE) {
          coslam = -coslam;
        }

        if (Math.abs(phi + this.lat0) < EPSLN) {
          return null;
        }

        y = FORTPI - phi * 0.5;
        y = 2 * (this.mode === this.S_POLE ? Math.cos(y) : Math.sin(y));
        x = y * Math.sin(lam);
        y *= coslam;
      }
    } else {
      sinb = 0;
      cosb = 0;
      b = 0;
      coslam = Math.cos(lam);
      sinlam = Math.sin(lam);
      sinphi = Math.sin(phi);
      q = qsfnz(this.e, sinphi);

      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        sinb = q / this.qp;
        cosb = Math.sqrt(1 - sinb * sinb);
      }

      switch (this.mode) {
        case this.OBLIQ:
          b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
          break;

        case this.EQUIT:
          b = 1 + cosb * coslam;
          break;

        case this.N_POLE:
          b = HALF_PI + phi;
          q = this.qp - q;
          break;

        case this.S_POLE:
          b = phi - HALF_PI;
          q = this.qp + q;
          break;
      }

      if (Math.abs(b) < EPSLN) {
        return null;
      }

      switch (this.mode) {
        case this.OBLIQ:
        case this.EQUIT:
          b = Math.sqrt(2 / b);

          if (this.mode === this.OBLIQ) {
            y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
          } else {
            y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
          }

          x = this.xmf * b * cosb * sinlam;
          break;

        case this.N_POLE:
        case this.S_POLE:
          if (q >= 0) {
            x = (b = Math.sqrt(q)) * sinlam;
            y = coslam * (this.mode === this.S_POLE ? b : -b);
          } else {
            x = y = 0;
          }

          break;
      }
    }

    p.x = this.a * x + this.x0;
    p.y = this.a * y + this.y0;
    return p;
  }
  /* Inverse equations
    -----------------*/

  function inverse$c(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var x = p.x / this.a;
    var y = p.y / this.a;
    var lam, phi, cCe, sCe, q, rho, ab;

    if (this.sphere) {
      var cosz = 0,
          rh,
          sinz = 0;
      rh = Math.sqrt(x * x + y * y);
      phi = rh * 0.5;

      if (phi > 1) {
        return null;
      }

      phi = 2 * Math.asin(phi);

      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        sinz = Math.sin(phi);
        cosz = Math.cos(phi);
      }

      switch (this.mode) {
        case this.EQUIT:
          phi = Math.abs(rh) <= EPSLN ? 0 : Math.asin(y * sinz / rh);
          x *= sinz;
          y = cosz * rh;
          break;

        case this.OBLIQ:
          phi = Math.abs(rh) <= EPSLN ? this.lat0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
          x *= sinz * this.cosph0;
          y = (cosz - Math.sin(phi) * this.sinph0) * rh;
          break;

        case this.N_POLE:
          y = -y;
          phi = HALF_PI - phi;
          break;

        case this.S_POLE:
          phi -= HALF_PI;
          break;
      }

      lam = y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ) ? 0 : Math.atan2(x, y);
    } else {
      ab = 0;

      if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
        x /= this.dd;
        y *= this.dd;
        rho = Math.sqrt(x * x + y * y);

        if (rho < EPSLN) {
          p.x = this.long0;
          p.y = this.lat0;
          return p;
        }

        sCe = 2 * Math.asin(0.5 * rho / this.rq);
        cCe = Math.cos(sCe);
        x *= sCe = Math.sin(sCe);

        if (this.mode === this.OBLIQ) {
          ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
          q = this.qp * ab;
          y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
        } else {
          ab = y * sCe / rho;
          q = this.qp * ab;
          y = rho * cCe;
        }
      } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
        if (this.mode === this.N_POLE) {
          y = -y;
        }

        q = x * x + y * y;

        if (!q) {
          p.x = this.long0;
          p.y = this.lat0;
          return p;
        }

        ab = 1 - q / this.qp;

        if (this.mode === this.S_POLE) {
          ab = -ab;
        }
      }

      lam = Math.atan2(x, y);
      phi = authlat(Math.asin(ab), this.apa);
    }

    p.x = adjust_lon(this.long0 + lam);
    p.y = phi;
    return p;
  }
  /* determine latitude from authalic latitude */

  var P00 = 0.33333333333333333333;
  var P01 = 0.17222222222222222222;
  var P02 = 0.10257936507936507936;
  var P10 = 0.06388888888888888888;
  var P11 = 0.06640211640211640211;
  var P20 = 0.01641501294219154443;

  function authset(es) {
    var t;
    var APA = [];
    APA[0] = es * P00;
    t = es * es;
    APA[0] += t * P01;
    APA[1] = t * P10;
    t *= es;
    APA[0] += t * P02;
    APA[1] += t * P11;
    APA[2] = t * P20;
    return APA;
  }

  function authlat(beta, APA) {
    var t = beta + beta;
    return beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t);
  }

  var names$e = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
  var laea = {
    init: init$d,
    forward: forward$c,
    inverse: inverse$c,
    names: names$e,
    S_POLE: S_POLE,
    N_POLE: N_POLE,
    EQUIT: EQUIT,
    OBLIQ: OBLIQ
  };

  function asinz (x) {
    if (Math.abs(x) > 1) {
      x = x > 1 ? 1 : -1;
    }

    return Math.asin(x);
  }

  function init$e() {
    if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
      return;
    }

    this.temp = this.b / this.a;
    this.es = 1 - Math.pow(this.temp, 2);
    this.e3 = Math.sqrt(this.es);
    this.sin_po = Math.sin(this.lat1);
    this.cos_po = Math.cos(this.lat1);
    this.t1 = this.sin_po;
    this.con = this.sin_po;
    this.ms1 = msfnz(this.e3, this.sin_po, this.cos_po);
    this.qs1 = qsfnz(this.e3, this.sin_po, this.cos_po);
    this.sin_po = Math.sin(this.lat2);
    this.cos_po = Math.cos(this.lat2);
    this.t2 = this.sin_po;
    this.ms2 = msfnz(this.e3, this.sin_po, this.cos_po);
    this.qs2 = qsfnz(this.e3, this.sin_po, this.cos_po);
    this.sin_po = Math.sin(this.lat0);
    this.cos_po = Math.cos(this.lat0);
    this.t3 = this.sin_po;
    this.qs0 = qsfnz(this.e3, this.sin_po, this.cos_po);

    if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
      this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
    } else {
      this.ns0 = this.con;
    }

    this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
    this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
  }
  /* Albers Conical Equal Area forward equations--mapping lat,long to x,y
    -------------------------------------------------------------------*/

  function forward$d(p) {
    var lon = p.x;
    var lat = p.y;
    this.sin_phi = Math.sin(lat);
    this.cos_phi = Math.cos(lat);
    var qs = qsfnz(this.e3, this.sin_phi, this.cos_phi);
    var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
    var theta = this.ns0 * adjust_lon(lon - this.long0);
    var x = rh1 * Math.sin(theta) + this.x0;
    var y = this.rh - rh1 * Math.cos(theta) + this.y0;
    p.x = x;
    p.y = y;
    return p;
  }
  function inverse$d(p) {
    var rh1, qs, con, theta, lon, lat;
    p.x -= this.x0;
    p.y = this.rh - p.y + this.y0;

    if (this.ns0 >= 0) {
      rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
      con = 1;
    } else {
      rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
      con = -1;
    }

    theta = 0;

    if (rh1 !== 0) {
      theta = Math.atan2(con * p.x, con * p.y);
    }

    con = rh1 * this.ns0 / this.a;

    if (this.sphere) {
      lat = Math.asin((this.c - con * con) / (2 * this.ns0));
    } else {
      qs = (this.c - con * con) / this.ns0;
      lat = this.phi1z(this.e3, qs);
    }

    lon = adjust_lon(theta / this.ns0 + this.long0);
    p.x = lon;
    p.y = lat;
    return p;
  }
  /* Function to compute phi1, the latitude for the inverse of the
     Albers Conical Equal-Area projection.
  -------------------------------------------*/

  function phi1z(eccent, qs) {
    var sinphi, cosphi, con, com, dphi;
    var phi = asinz(0.5 * qs);

    if (eccent < EPSLN) {
      return phi;
    }

    var eccnts = eccent * eccent;

    for (var i = 1; i <= 25; i++) {
      sinphi = Math.sin(phi);
      cosphi = Math.cos(phi);
      con = eccent * sinphi;
      com = 1 - con * con;
      dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
      phi = phi + dphi;

      if (Math.abs(dphi) <= 1e-7) {
        return phi;
      }
    }

    return null;
  }
  var names$f = ["Albers_Conic_Equal_Area", "Albers", "aea"];
  var aea = {
    init: init$e,
    forward: forward$d,
    inverse: inverse$d,
    names: names$f,
    phi1z: phi1z
  };

  /*
    reference:
      Wolfram Mathworld "Gnomonic Projection"
      http://mathworld.wolfram.com/GnomonicProjection.html
      Accessed: 12th November 2009
    */

  function init$f() {
    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    this.sin_p14 = Math.sin(this.lat0);
    this.cos_p14 = Math.cos(this.lat0); // Approximation for projecting points to the horizon (infinity)

    this.infinity_dist = 1000 * this.a;
    this.rc = 1;
  }
  /* Gnomonic forward equations--mapping lat,long to x,y
      ---------------------------------------------------*/

  function forward$e(p) {
    var sinphi, cosphi;
    /* sin and cos value        */

    var dlon;
    /* delta longitude value      */

    var coslon;
    /* cos of longitude        */

    var ksp;
    /* scale factor          */

    var g;
    var x, y;
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
        -----------------*/

    dlon = adjust_lon(lon - this.long0);
    sinphi = Math.sin(lat);
    cosphi = Math.cos(lat);
    coslon = Math.cos(dlon);
    g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
    ksp = 1;

    if (g > 0 || Math.abs(g) <= EPSLN) {
      x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
      y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
    } else {
      // Point is in the opposing hemisphere and is unprojectable
      // We still need to return a reasonable point, so we project
      // to infinity, on a bearing
      // equivalent to the northern hemisphere equivalent
      // This is a reasonable approximation for short shapes and lines that
      // straddle the horizon.
      x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
      y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
    }

    p.x = x;
    p.y = y;
    return p;
  }
  function inverse$e(p) {
    var rh;
    /* Rho */

    var sinc, cosc;
    var c;
    var lon, lat;
    /* Inverse equations
        -----------------*/

    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;
    p.x /= this.k0;
    p.y /= this.k0;

    if (rh = Math.sqrt(p.x * p.x + p.y * p.y)) {
      c = Math.atan2(rh, this.rc);
      sinc = Math.sin(c);
      cosc = Math.cos(c);
      lat = asinz(cosc * this.sin_p14 + p.y * sinc * this.cos_p14 / rh);
      lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
      lon = adjust_lon(this.long0 + lon);
    } else {
      lat = this.phic0;
      lon = 0;
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$g = ["gnom"];
  var gnom = {
    init: init$f,
    forward: forward$e,
    inverse: inverse$e,
    names: names$g
  };

  function iqsfnz (eccent, q) {
    var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));

    if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
      if (q < 0) {
        return -1 * HALF_PI;
      } else {
        return HALF_PI;
      }
    } //var phi = 0.5* q/(1-eccent*eccent);


    var phi = Math.asin(0.5 * q);
    var dphi;
    var sin_phi;
    var cos_phi;
    var con;

    for (var i = 0; i < 30; i++) {
      sin_phi = Math.sin(phi);
      cos_phi = Math.cos(phi);
      con = eccent * sin_phi;
      dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
      phi += dphi;

      if (Math.abs(dphi) <= 0.0000000001) {
        return phi;
      }
    } //console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");


    return NaN;
  }

  /*
    reference:
      "Cartographic Projection Procedures for the UNIX Environment-
      A User's Manual" by Gerald I. Evenden,
      USGS Open File Report 90-284and Release 4 Interim Reports (2003)
  */

  function init$g() {
    //no-op
    if (!this.sphere) {
      this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
    }
  }
  /* Cylindrical Equal Area forward equations--mapping lat,long to x,y
      ------------------------------------------------------------*/

  function forward$f(p) {
    var lon = p.x;
    var lat = p.y;
    var x, y;
    /* Forward equations
        -----------------*/

    var dlon = adjust_lon(lon - this.long0);

    if (this.sphere) {
      x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
      y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
    } else {
      var qs = qsfnz(this.e, Math.sin(lat));
      x = this.x0 + this.a * this.k0 * dlon;
      y = this.y0 + this.a * qs * 0.5 / this.k0;
    }

    p.x = x;
    p.y = y;
    return p;
  }
  /* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
      ------------------------------------------------------------*/

  function inverse$f(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var lon, lat;

    if (this.sphere) {
      lon = adjust_lon(this.long0 + p.x / this.a / Math.cos(this.lat_ts));
      lat = Math.asin(p.y / this.a * Math.cos(this.lat_ts));
    } else {
      lat = iqsfnz(this.e, 2 * p.y * this.k0 / this.a);
      lon = adjust_lon(this.long0 + p.x / (this.a * this.k0));
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$h = ["cea"];
  var cea = {
    init: init$g,
    forward: forward$f,
    inverse: inverse$f,
    names: names$h
  };

  function init$h() {
    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    this.lat0 = this.lat0 || 0;
    this.long0 = this.long0 || 0;
    this.lat_ts = this.lat_ts || 0;
    this.title = this.title || "Equidistant Cylindrical (Plate Carre)";
    this.rc = Math.cos(this.lat_ts);
  } // forward equations--mapping lat,long to x,y
  // -----------------------------------------------------------------

  function forward$g(p) {
    var lon = p.x;
    var lat = p.y;
    var dlon = adjust_lon(lon - this.long0);
    var dlat = adjust_lat(lat - this.lat0);
    p.x = this.x0 + this.a * dlon * this.rc;
    p.y = this.y0 + this.a * dlat;
    return p;
  } // inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------

  function inverse$g(p) {
    var x = p.x;
    var y = p.y;
    p.x = adjust_lon(this.long0 + (x - this.x0) / (this.a * this.rc));
    p.y = adjust_lat(this.lat0 + (y - this.y0) / this.a);
    return p;
  }
  var names$i = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];
  var eqc = {
    init: init$h,
    forward: forward$g,
    inverse: inverse$g,
    names: names$i
  };

  var MAX_ITER$2 = 20;
  function init$i() {
    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    this.temp = this.b / this.a;
    this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles

    this.e = Math.sqrt(this.es);
    this.e0 = e0fn(this.es);
    this.e1 = e1fn(this.es);
    this.e2 = e2fn(this.es);
    this.e3 = e3fn(this.es);
    this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
  }
  /* Polyconic forward equations--mapping lat,long to x,y
      ---------------------------------------------------*/

  function forward$h(p) {
    var lon = p.x;
    var lat = p.y;
    var x, y, el;
    var dlon = adjust_lon(lon - this.long0);
    el = dlon * Math.sin(lat);

    if (this.sphere) {
      if (Math.abs(lat) <= EPSLN) {
        x = this.a * dlon;
        y = -1 * this.a * this.lat0;
      } else {
        x = this.a * Math.sin(el) / Math.tan(lat);
        y = this.a * (adjust_lat(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
      }
    } else {
      if (Math.abs(lat) <= EPSLN) {
        x = this.a * dlon;
        y = -1 * this.ml0;
      } else {
        var nl = gN(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
        x = nl * Math.sin(el);
        y = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
      }
    }

    p.x = x + this.x0;
    p.y = y + this.y0;
    return p;
  }
  /* Inverse equations
    -----------------*/

  function inverse$h(p) {
    var lon, lat, x, y, i;
    var al, bl;
    var phi, dphi;
    x = p.x - this.x0;
    y = p.y - this.y0;

    if (this.sphere) {
      if (Math.abs(y + this.a * this.lat0) <= EPSLN) {
        lon = adjust_lon(x / this.a + this.long0);
        lat = 0;
      } else {
        al = this.lat0 + y / this.a;
        bl = x * x / this.a / this.a + al * al;
        phi = al;
        var tanphi;

        for (i = MAX_ITER$2; i; --i) {
          tanphi = Math.tan(phi);
          dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
          phi += dphi;

          if (Math.abs(dphi) <= EPSLN) {
            lat = phi;
            break;
          }
        }

        lon = adjust_lon(this.long0 + Math.asin(x * Math.tan(phi) / this.a) / Math.sin(lat));
      }
    } else {
      if (Math.abs(y + this.ml0) <= EPSLN) {
        lat = 0;
        lon = adjust_lon(this.long0 + x / this.a);
      } else {
        al = (this.ml0 + y) / this.a;
        bl = x * x / this.a / this.a + al * al;
        phi = al;
        var cl, mln, mlnp, ma;
        var con;

        for (i = MAX_ITER$2; i; --i) {
          con = this.e * Math.sin(phi);
          cl = Math.sqrt(1 - con * con) * Math.tan(phi);
          mln = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);
          mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
          ma = mln / this.a;
          dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
          phi -= dphi;

          if (Math.abs(dphi) <= EPSLN) {
            lat = phi;
            break;
          }
        } //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);


        cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
        lon = adjust_lon(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$j = ["Polyconic", "poly"];
  var poly = {
    init: init$i,
    forward: forward$h,
    inverse: inverse$h,
    names: names$j
  };

  function init$j() {
    this.A = [];
    this.A[1] = 0.6399175073;
    this.A[2] = -0.1358797613;
    this.A[3] = 0.063294409;
    this.A[4] = -0.02526853;
    this.A[5] = 0.0117879;
    this.A[6] = -0.0055161;
    this.A[7] = 0.0026906;
    this.A[8] = -0.001333;
    this.A[9] = 0.00067;
    this.A[10] = -0.00034;
    this.B_re = [];
    this.B_im = [];
    this.B_re[1] = 0.7557853228;
    this.B_im[1] = 0;
    this.B_re[2] = 0.249204646;
    this.B_im[2] = 0.003371507;
    this.B_re[3] = -0.001541739;
    this.B_im[3] = 0.041058560;
    this.B_re[4] = -0.10162907;
    this.B_im[4] = 0.01727609;
    this.B_re[5] = -0.26623489;
    this.B_im[5] = -0.36249218;
    this.B_re[6] = -0.6870983;
    this.B_im[6] = -1.1651967;
    this.C_re = [];
    this.C_im = [];
    this.C_re[1] = 1.3231270439;
    this.C_im[1] = 0;
    this.C_re[2] = -0.577245789;
    this.C_im[2] = -0.007809598;
    this.C_re[3] = 0.508307513;
    this.C_im[3] = -0.112208952;
    this.C_re[4] = -0.15094762;
    this.C_im[4] = 0.18200602;
    this.C_re[5] = 1.01418179;
    this.C_im[5] = 1.64497696;
    this.C_re[6] = 1.9660549;
    this.C_im[6] = 2.5127645;
    this.D = [];
    this.D[1] = 1.5627014243;
    this.D[2] = 0.5185406398;
    this.D[3] = -0.03333098;
    this.D[4] = -0.1052906;
    this.D[5] = -0.0368594;
    this.D[6] = 0.007317;
    this.D[7] = 0.01220;
    this.D[8] = 0.00394;
    this.D[9] = -0.0013;
  }
  /**
      New Zealand Map Grid Forward  - long/lat to x/y
      long/lat in radians
    */

  function forward$i(p) {
    var n;
    var lon = p.x;
    var lat = p.y;
    var delta_lat = lat - this.lat0;
    var delta_lon = lon - this.long0; // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
    // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.

    var d_phi = delta_lat / SEC_TO_RAD * 1E-5;
    var d_lambda = delta_lon;
    var d_phi_n = 1; // d_phi^0

    var d_psi = 0;

    for (n = 1; n <= 10; n++) {
      d_phi_n = d_phi_n * d_phi;
      d_psi = d_psi + this.A[n] * d_phi_n;
    } // 2. Calculate theta


    var th_re = d_psi;
    var th_im = d_lambda; // 3. Calculate z

    var th_n_re = 1;
    var th_n_im = 0; // theta^0

    var th_n_re1;
    var th_n_im1;
    var z_re = 0;
    var z_im = 0;

    for (n = 1; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
      z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
    } // 4. Calculate easting and northing


    p.x = z_im * this.a + this.x0;
    p.y = z_re * this.a + this.y0;
    return p;
  }
  /**
      New Zealand Map Grid Inverse  -  x/y to long/lat
    */

  function inverse$i(p) {
    var n;
    var x = p.x;
    var y = p.y;
    var delta_x = x - this.x0;
    var delta_y = y - this.y0; // 1. Calculate z

    var z_re = delta_y / this.a;
    var z_im = delta_x / this.a; // 2a. Calculate theta - first approximation gives km accuracy

    var z_n_re = 1;
    var z_n_im = 0; // z^0

    var z_n_re1;
    var z_n_im1;
    var th_re = 0;
    var th_im = 0;

    for (n = 1; n <= 6; n++) {
      z_n_re1 = z_n_re * z_re - z_n_im * z_im;
      z_n_im1 = z_n_im * z_re + z_n_re * z_im;
      z_n_re = z_n_re1;
      z_n_im = z_n_im1;
      th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
      th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
    } // 2b. Iterate to refine the accuracy of the calculation
    //        0 iterations gives km accuracy
    //        1 iteration gives m accuracy -- good enough for most mapping applications
    //        2 iterations bives mm accuracy


    for (var i = 0; i < this.iterations; i++) {
      var th_n_re = th_re;
      var th_n_im = th_im;
      var th_n_re1;
      var th_n_im1;
      var num_re = z_re;
      var num_im = z_im;

      for (n = 2; n <= 6; n++) {
        th_n_re1 = th_n_re * th_re - th_n_im * th_im;
        th_n_im1 = th_n_im * th_re + th_n_re * th_im;
        th_n_re = th_n_re1;
        th_n_im = th_n_im1;
        num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
        num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
      }

      th_n_re = 1;
      th_n_im = 0;
      var den_re = this.B_re[1];
      var den_im = this.B_im[1];

      for (n = 2; n <= 6; n++) {
        th_n_re1 = th_n_re * th_re - th_n_im * th_im;
        th_n_im1 = th_n_im * th_re + th_n_re * th_im;
        th_n_re = th_n_re1;
        th_n_im = th_n_im1;
        den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
        den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
      } // Complex division


      var den2 = den_re * den_re + den_im * den_im;
      th_re = (num_re * den_re + num_im * den_im) / den2;
      th_im = (num_im * den_re - num_re * den_im) / den2;
    } // 3. Calculate d_phi              ...                                    // and d_lambda


    var d_psi = th_re;
    var d_lambda = th_im;
    var d_psi_n = 1; // d_psi^0

    var d_phi = 0;

    for (n = 1; n <= 9; n++) {
      d_psi_n = d_psi_n * d_psi;
      d_phi = d_phi + this.D[n] * d_psi_n;
    } // 4. Calculate latitude and longitude
    // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.


    var lat = this.lat0 + d_phi * SEC_TO_RAD * 1E5;
    var lon = this.long0 + d_lambda;
    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$k = ["New_Zealand_Map_Grid", "nzmg"];
  var nzmg = {
    init: init$j,
    forward: forward$i,
    inverse: inverse$i,
    names: names$k
  };

  /*
    reference
      "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
      The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
    */

  /* Initialize the Miller Cylindrical projection
    -------------------------------------------*/

  function init$k() {//no-op
  }
  /* Miller Cylindrical forward equations--mapping lat,long to x,y
      ------------------------------------------------------------*/

  function forward$j(p) {
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
        -----------------*/

    var dlon = adjust_lon(lon - this.long0);
    var x = this.x0 + this.a * dlon;
    var y = this.y0 + this.a * Math.log(Math.tan(Math.PI / 4 + lat / 2.5)) * 1.25;
    p.x = x;
    p.y = y;
    return p;
  }
  /* Miller Cylindrical inverse equations--mapping x,y to lat/long
      ------------------------------------------------------------*/

  function inverse$j(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var lon = adjust_lon(this.long0 + p.x / this.a);
    var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);
    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$l = ["Miller_Cylindrical", "mill"];
  var mill = {
    init: init$k,
    forward: forward$j,
    inverse: inverse$j,
    names: names$l
  };

  var MAX_ITER$3 = 20;
  function init$l() {
    /* Place parameters in static storage for common use
      -------------------------------------------------*/
    if (!this.sphere) {
      this.en = pj_enfn(this.es);
    } else {
      this.n = 1;
      this.m = 0;
      this.es = 0;
      this.C_y = Math.sqrt((this.m + 1) / this.n);
      this.C_x = this.C_y / (this.m + 1);
    }
  }
  /* Sinusoidal forward equations--mapping lat,long to x,y
    -----------------------------------------------------*/

  function forward$k(p) {
    var x, y;
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
      -----------------*/

    lon = adjust_lon(lon - this.long0);

    if (this.sphere) {
      if (!this.m) {
        lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
      } else {
        var k = this.n * Math.sin(lat);

        for (var i = MAX_ITER$3; i; --i) {
          var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
          lat -= V;

          if (Math.abs(V) < EPSLN) {
            break;
          }
        }
      }

      x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
      y = this.a * this.C_y * lat;
    } else {
      var s = Math.sin(lat);
      var c = Math.cos(lat);
      y = this.a * pj_mlfn(lat, s, c, this.en);
      x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
    }

    p.x = x;
    p.y = y;
    return p;
  }
  function inverse$k(p) {
    var lat, temp, lon, s;
    p.x -= this.x0;
    lon = p.x / this.a;
    p.y -= this.y0;
    lat = p.y / this.a;

    if (this.sphere) {
      lat /= this.C_y;
      lon = lon / (this.C_x * (this.m + Math.cos(lat)));

      if (this.m) {
        lat = asinz((this.m * lat + Math.sin(lat)) / this.n);
      } else if (this.n !== 1) {
        lat = asinz(Math.sin(lat) / this.n);
      }

      lon = adjust_lon(lon + this.long0);
      lat = adjust_lat(lat);
    } else {
      lat = pj_inv_mlfn(p.y / this.a, this.es, this.en);
      s = Math.abs(lat);

      if (s < HALF_PI) {
        s = Math.sin(lat);
        temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat)); //temp = this.long0 + p.x / (this.a * Math.cos(lat));

        lon = adjust_lon(temp);
      } else if (s - EPSLN < HALF_PI) {
        lon = this.long0;
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$m = ["Sinusoidal", "sinu"];
  var sinu = {
    init: init$l,
    forward: forward$k,
    inverse: inverse$k,
    names: names$m
  };

  function init$m() {}
  /* Mollweide forward equations--mapping lat,long to x,y
      ----------------------------------------------------*/

  function forward$l(p) {
    /* Forward equations
        -----------------*/
    var lon = p.x;
    var lat = p.y;
    var delta_lon = adjust_lon(lon - this.long0);
    var theta = lat;
    var con = Math.PI * Math.sin(lat);
    /* Iterate using the Newton-Raphson method to find theta
        -----------------------------------------------------*/

    while (true) {
      var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
      theta += delta_theta;

      if (Math.abs(delta_theta) < EPSLN) {
        break;
      }
    }

    theta /= 2;
    /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
         this is done here because of precision problems with "cos(theta)"
         --------------------------------------------------------------------------*/

    if (Math.PI / 2 - Math.abs(lat) < EPSLN) {
      delta_lon = 0;
    }

    var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
    var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;
    p.x = x;
    p.y = y;
    return p;
  }
  function inverse$l(p) {
    var theta;
    var arg;
    /* Inverse equations
        -----------------*/

    p.x -= this.x0;
    p.y -= this.y0;
    arg = p.y / (1.4142135623731 * this.a);
    /* Because of division by zero problems, 'arg' can not be 1.  Therefore
         a number very close to one is used instead.
         -------------------------------------------------------------------*/

    if (Math.abs(arg) > 0.999999999999) {
      arg = 0.999999999999;
    }

    theta = Math.asin(arg);
    var lon = adjust_lon(this.long0 + p.x / (0.900316316158 * this.a * Math.cos(theta)));

    if (lon < -Math.PI) {
      lon = -Math.PI;
    }

    if (lon > Math.PI) {
      lon = Math.PI;
    }

    arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;

    if (Math.abs(arg) > 1) {
      arg = 1;
    }

    var lat = Math.asin(arg);
    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$n = ["Mollweide", "moll"];
  var moll = {
    init: init$m,
    forward: forward$l,
    inverse: inverse$l,
    names: names$n
  };

  function init$n() {
    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    // Standard Parallels cannot be equal and on opposite sides of the equator
    if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
      return;
    }

    this.lat2 = this.lat2 || this.lat1;
    this.temp = this.b / this.a;
    this.es = 1 - Math.pow(this.temp, 2);
    this.e = Math.sqrt(this.es);
    this.e0 = e0fn(this.es);
    this.e1 = e1fn(this.es);
    this.e2 = e2fn(this.es);
    this.e3 = e3fn(this.es);
    this.sinphi = Math.sin(this.lat1);
    this.cosphi = Math.cos(this.lat1);
    this.ms1 = msfnz(this.e, this.sinphi, this.cosphi);
    this.ml1 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1);

    if (Math.abs(this.lat1 - this.lat2) < EPSLN) {
      this.ns = this.sinphi;
    } else {
      this.sinphi = Math.sin(this.lat2);
      this.cosphi = Math.cos(this.lat2);
      this.ms2 = msfnz(this.e, this.sinphi, this.cosphi);
      this.ml2 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
      this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
    }

    this.g = this.ml1 + this.ms1 / this.ns;
    this.ml0 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
    this.rh = this.a * (this.g - this.ml0);
  }
  /* Equidistant Conic forward equations--mapping lat,long to x,y
    -----------------------------------------------------------*/

  function forward$m(p) {
    var lon = p.x;
    var lat = p.y;
    var rh1;
    /* Forward equations
        -----------------*/

    if (this.sphere) {
      rh1 = this.a * (this.g - lat);
    } else {
      var ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
      rh1 = this.a * (this.g - ml);
    }

    var theta = this.ns * adjust_lon(lon - this.long0);
    var x = this.x0 + rh1 * Math.sin(theta);
    var y = this.y0 + this.rh - rh1 * Math.cos(theta);
    p.x = x;
    p.y = y;
    return p;
  }
  /* Inverse equations
    -----------------*/

  function inverse$m(p) {
    p.x -= this.x0;
    p.y = this.rh - p.y + this.y0;
    var con, rh1, lat, lon;

    if (this.ns >= 0) {
      rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
      con = 1;
    } else {
      rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
      con = -1;
    }

    var theta = 0;

    if (rh1 !== 0) {
      theta = Math.atan2(con * p.x, con * p.y);
    }

    if (this.sphere) {
      lon = adjust_lon(this.long0 + theta / this.ns);
      lat = adjust_lat(this.g - rh1 / this.a);
      p.x = lon;
      p.y = lat;
      return p;
    } else {
      var ml = this.g - rh1 / this.a;
      lat = imlfn(ml, this.e0, this.e1, this.e2, this.e3);
      lon = adjust_lon(this.long0 + theta / this.ns);
      p.x = lon;
      p.y = lat;
      return p;
    }
  }
  var names$o = ["Equidistant_Conic", "eqdc"];
  var eqdc = {
    init: init$n,
    forward: forward$m,
    inverse: inverse$m,
    names: names$o
  };

  /* Initialize the Van Der Grinten projection
    ----------------------------------------*/

  function init$o() {
    //this.R = 6370997; //Radius of earth
    this.R = this.a;
  }
  function forward$n(p) {
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
      -----------------*/

    var dlon = adjust_lon(lon - this.long0);
    var x, y;

    if (Math.abs(lat) <= EPSLN) {
      x = this.x0 + this.R * dlon;
      y = this.y0;
    }

    var theta = asinz(2 * Math.abs(lat / Math.PI));

    if (Math.abs(dlon) <= EPSLN || Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
      x = this.x0;

      if (lat >= 0) {
        y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
      } else {
        y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
      } //  return(OK);

    }

    var al = 0.5 * Math.abs(Math.PI / dlon - dlon / Math.PI);
    var asq = al * al;
    var sinth = Math.sin(theta);
    var costh = Math.cos(theta);
    var g = costh / (sinth + costh - 1);
    var gsq = g * g;
    var m = g * (2 / sinth - 1);
    var msq = m * m;
    var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);

    if (dlon < 0) {
      con = -con;
    }

    x = this.x0 + con; //con = Math.abs(con / (Math.PI * this.R));

    var q = asq + g;
    con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);

    if (lat >= 0) {
      //y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
      y = this.y0 + con;
    } else {
      //y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
      y = this.y0 - con;
    }

    p.x = x;
    p.y = y;
    return p;
  }
  /* Van Der Grinten inverse equations--mapping x,y to lat/long
    ---------------------------------------------------------*/

  function inverse$n(p) {
    var lon, lat;
    var xx, yy, xys, c1, c2, c3;
    var a1;
    var m1;
    var con;
    var th1;
    var d;
    /* inverse equations
      -----------------*/

    p.x -= this.x0;
    p.y -= this.y0;
    con = Math.PI * this.R;
    xx = p.x / con;
    yy = p.y / con;
    xys = xx * xx + yy * yy;
    c1 = -Math.abs(yy) * (1 + xys);
    c2 = c1 - 2 * yy * yy + xx * xx;
    c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
    d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
    a1 = (c1 - c2 * c2 / 3 / c3) / c3;
    m1 = 2 * Math.sqrt(-a1 / 3);
    con = 3 * d / a1 / m1;

    if (Math.abs(con) > 1) {
      if (con >= 0) {
        con = 1;
      } else {
        con = -1;
      }
    }

    th1 = Math.acos(con) / 3;

    if (p.y >= 0) {
      lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
    } else {
      lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
    }

    if (Math.abs(xx) < EPSLN) {
      lon = this.long0;
    } else {
      lon = adjust_lon(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx);
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$p = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
  var vandg = {
    init: init$o,
    forward: forward$n,
    inverse: inverse$n,
    names: names$p
  };

  function init$p() {
    this.sin_p12 = Math.sin(this.lat0);
    this.cos_p12 = Math.cos(this.lat0);
  }
  function forward$o(p) {
    var lon = p.x;
    var lat = p.y;
    var sinphi = Math.sin(p.y);
    var cosphi = Math.cos(p.y);
    var dlon = adjust_lon(lon - this.long0);
    var e0, e1, e2, e3, Mlp, Ml, tanphi, Nl1, Nl, psi, Az, G, H, GH, Hs, c, kp, cos_c, s, s2, s3, s4, s5;

    if (this.sphere) {
      if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
        //North Pole case
        p.x = this.x0 + this.a * (HALF_PI - lat) * Math.sin(dlon);
        p.y = this.y0 - this.a * (HALF_PI - lat) * Math.cos(dlon);
        return p;
      } else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
        //South Pole case
        p.x = this.x0 + this.a * (HALF_PI + lat) * Math.sin(dlon);
        p.y = this.y0 + this.a * (HALF_PI + lat) * Math.cos(dlon);
        return p;
      } else {
        //default case
        cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
        c = Math.acos(cos_c);
        kp = c ? c / Math.sin(c) : 1;
        p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
        p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
        return p;
      }
    } else {
      e0 = e0fn(this.es);
      e1 = e1fn(this.es);
      e2 = e2fn(this.es);
      e3 = e3fn(this.es);

      if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
        //North Pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        Ml = this.a * mlfn(e0, e1, e2, e3, lat);
        p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
        p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
        return p;
      } else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
        //South Pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        Ml = this.a * mlfn(e0, e1, e2, e3, lat);
        p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
        p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
        return p;
      } else {
        //Default case
        tanphi = sinphi / cosphi;
        Nl1 = gN(this.a, this.e, this.sin_p12);
        Nl = gN(this.a, this.e, sinphi);
        psi = Math.atan((1 - this.es) * tanphi + this.es * Nl1 * this.sin_p12 / (Nl * cosphi));
        Az = Math.atan2(Math.sin(dlon), this.cos_p12 * Math.tan(psi) - this.sin_p12 * Math.cos(dlon));

        if (Az === 0) {
          s = Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
        } else if (Math.abs(Math.abs(Az) - Math.PI) <= EPSLN) {
          s = -Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
        } else {
          s = Math.asin(Math.sin(dlon) * Math.cos(psi) / Math.sin(Az));
        }

        G = this.e * this.sin_p12 / Math.sqrt(1 - this.es);
        H = this.e * this.cos_p12 * Math.cos(Az) / Math.sqrt(1 - this.es);
        GH = G * H;
        Hs = H * H;
        s2 = s * s;
        s3 = s2 * s;
        s4 = s3 * s;
        s5 = s4 * s;
        c = Nl1 * s * (1 - s2 * Hs * (1 - Hs) / 6 + s3 / 8 * GH * (1 - 2 * Hs) + s4 / 120 * (Hs * (4 - 7 * Hs) - 3 * G * G * (1 - 7 * Hs)) - s5 / 48 * GH);
        p.x = this.x0 + c * Math.sin(Az);
        p.y = this.y0 + c * Math.cos(Az);
        return p;
      }
    }
  }
  function inverse$o(p) {
    p.x -= this.x0;
    p.y -= this.y0;
    var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, N1, psi, Az, cosAz, tmp, A, B, D, Ee, F, sinpsi;

    if (this.sphere) {
      rh = Math.sqrt(p.x * p.x + p.y * p.y);

      if (rh > 2 * HALF_PI * this.a) {
        return;
      }

      z = rh / this.a;
      sinz = Math.sin(z);
      cosz = Math.cos(z);
      lon = this.long0;

      if (Math.abs(rh) <= EPSLN) {
        lat = this.lat0;
      } else {
        lat = asinz(cosz * this.sin_p12 + p.y * sinz * this.cos_p12 / rh);
        con = Math.abs(this.lat0) - HALF_PI;

        if (Math.abs(con) <= EPSLN) {
          if (this.lat0 >= 0) {
            lon = adjust_lon(this.long0 + Math.atan2(p.x, -p.y));
          } else {
            lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
          }
        } else {
          /*con = cosz - this.sin_p12 * Math.sin(lat);
          if ((Math.abs(con) < EPSLN) && (Math.abs(p.x) < EPSLN)) {
            //no-op, just keep the lon value as is
          } else {
            var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
            lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
          }*/
          lon = adjust_lon(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz));
        }
      }

      p.x = lon;
      p.y = lat;
      return p;
    } else {
      e0 = e0fn(this.es);
      e1 = e1fn(this.es);
      e2 = e2fn(this.es);
      e3 = e3fn(this.es);

      if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
        //North pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        M = Mlp - rh;
        lat = imlfn(M / this.a, e0, e1, e2, e3);
        lon = adjust_lon(this.long0 + Math.atan2(p.x, -1 * p.y));
        p.x = lon;
        p.y = lat;
        return p;
      } else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
        //South pole case
        Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        M = rh - Mlp;
        lat = imlfn(M / this.a, e0, e1, e2, e3);
        lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
        p.x = lon;
        p.y = lat;
        return p;
      } else {
        //default case
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        Az = Math.atan2(p.x, p.y);
        N1 = gN(this.a, this.e, this.sin_p12);
        cosAz = Math.cos(Az);
        tmp = this.e * this.cos_p12 * cosAz;
        A = -tmp * tmp / (1 - this.es);
        B = 3 * this.es * (1 - A) * this.sin_p12 * this.cos_p12 * cosAz / (1 - this.es);
        D = rh / N1;
        Ee = D - A * (1 + A) * Math.pow(D, 3) / 6 - B * (1 + 3 * A) * Math.pow(D, 4) / 24;
        F = 1 - A * Ee * Ee / 2 - D * Ee * Ee * Ee / 6;
        psi = Math.asin(this.sin_p12 * Math.cos(Ee) + this.cos_p12 * Math.sin(Ee) * cosAz);
        lon = adjust_lon(this.long0 + Math.asin(Math.sin(Az) * Math.sin(Ee) / Math.cos(psi)));
        sinpsi = Math.sin(psi);
        lat = Math.atan2((sinpsi - this.es * F * this.sin_p12) * Math.tan(psi), sinpsi * (1 - this.es));
        p.x = lon;
        p.y = lat;
        return p;
      }
    }
  }
  var names$q = ["Azimuthal_Equidistant", "aeqd"];
  var aeqd = {
    init: init$p,
    forward: forward$o,
    inverse: inverse$o,
    names: names$q
  };

  function init$q() {
    //double temp;      /* temporary variable    */

    /* Place parameters in static storage for common use
        -------------------------------------------------*/
    this.sin_p14 = Math.sin(this.lat0);
    this.cos_p14 = Math.cos(this.lat0);
  }
  /* Orthographic forward equations--mapping lat,long to x,y
      ---------------------------------------------------*/

  function forward$p(p) {
    var sinphi, cosphi;
    /* sin and cos value        */

    var dlon;
    /* delta longitude value      */

    var coslon;
    /* cos of longitude        */

    var ksp;
    /* scale factor          */

    var g, x, y;
    var lon = p.x;
    var lat = p.y;
    /* Forward equations
        -----------------*/

    dlon = adjust_lon(lon - this.long0);
    sinphi = Math.sin(lat);
    cosphi = Math.cos(lat);
    coslon = Math.cos(dlon);
    g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
    ksp = 1;

    if (g > 0 || Math.abs(g) <= EPSLN) {
      x = this.a * ksp * cosphi * Math.sin(dlon);
      y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
    }

    p.x = x;
    p.y = y;
    return p;
  }
  function inverse$p(p) {
    var rh;
    /* height above ellipsoid      */

    var z;
    /* angle          */

    var sinz, cosz;
    /* sin of z and cos of z      */

    var con;
    var lon, lat;
    /* Inverse equations
        -----------------*/

    p.x -= this.x0;
    p.y -= this.y0;
    rh = Math.sqrt(p.x * p.x + p.y * p.y);
    z = asinz(rh / this.a);
    sinz = Math.sin(z);
    cosz = Math.cos(z);
    lon = this.long0;

    if (Math.abs(rh) <= EPSLN) {
      lat = this.lat0;
      p.x = lon;
      p.y = lat;
      return p;
    }

    lat = asinz(cosz * this.sin_p14 + p.y * sinz * this.cos_p14 / rh);
    con = Math.abs(this.lat0) - HALF_PI;

    if (Math.abs(con) <= EPSLN) {
      if (this.lat0 >= 0) {
        lon = adjust_lon(this.long0 + Math.atan2(p.x, -p.y));
      } else {
        lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
      }

      p.x = lon;
      p.y = lat;
      return p;
    }

    lon = adjust_lon(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p14 * cosz - p.y * this.sin_p14 * sinz));
    p.x = lon;
    p.y = lat;
    return p;
  }
  var names$r = ["ortho"];
  var ortho = {
    init: init$q,
    forward: forward$p,
    inverse: inverse$p,
    names: names$r
  };

  // QSC projection rewritten from the original PROJ4
  /* constants */

  var FACE_ENUM = {
    FRONT: 1,
    RIGHT: 2,
    BACK: 3,
    LEFT: 4,
    TOP: 5,
    BOTTOM: 6
  };
  var AREA_ENUM = {
    AREA_0: 1,
    AREA_1: 2,
    AREA_2: 3,
    AREA_3: 4
  };
  function init$r() {
    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    this.lat0 = this.lat0 || 0;
    this.long0 = this.long0 || 0;
    this.lat_ts = this.lat_ts || 0;
    this.title = this.title || "Quadrilateralized Spherical Cube";
    /* Determine the cube face from the center of projection. */

    if (this.lat0 >= HALF_PI - FORTPI / 2.0) {
      this.face = FACE_ENUM.TOP;
    } else if (this.lat0 <= -(HALF_PI - FORTPI / 2.0)) {
      this.face = FACE_ENUM.BOTTOM;
    } else if (Math.abs(this.long0) <= FORTPI) {
      this.face = FACE_ENUM.FRONT;
    } else if (Math.abs(this.long0) <= HALF_PI + FORTPI) {
      this.face = this.long0 > 0.0 ? FACE_ENUM.RIGHT : FACE_ENUM.LEFT;
    } else {
      this.face = FACE_ENUM.BACK;
    }
    /* Fill in useful values for the ellipsoid <-> sphere shift
     * described in [LK12]. */


    if (this.es !== 0) {
      this.one_minus_f = 1 - (this.a - this.b) / this.a;
      this.one_minus_f_squared = this.one_minus_f * this.one_minus_f;
    }
  } // QSC forward equations--mapping lat,long to x,y
  // -----------------------------------------------------------------

  function forward$q(p) {
    var xy = {
      x: 0,
      y: 0
    };
    var lat, lon;
    var theta, phi;
    var t, mu;
    /* nu; */

    var area = {
      value: 0
    }; // move lon according to projection's lon

    p.x -= this.long0;
    /* Convert the geodetic latitude to a geocentric latitude.
     * This corresponds to the shift from the ellipsoid to the sphere
     * described in [LK12]. */

    if (this.es !== 0) {
      //if (P->es != 0) {
      lat = Math.atan(this.one_minus_f_squared * Math.tan(p.y));
    } else {
      lat = p.y;
    }
    /* Convert the input lat, lon into theta, phi as used by QSC.
     * This depends on the cube face and the area on it.
     * For the top and bottom face, we can compute theta and phi
     * directly from phi, lam. For the other faces, we must use
     * unit sphere cartesian coordinates as an intermediate step. */


    lon = p.x; //lon = lp.lam;

    if (this.face === FACE_ENUM.TOP) {
      phi = HALF_PI - lat;

      if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
        area.value = AREA_ENUM.AREA_0;
        theta = lon - HALF_PI;
      } else if (lon > HALF_PI + FORTPI || lon <= -(HALF_PI + FORTPI)) {
        area.value = AREA_ENUM.AREA_1;
        theta = lon > 0.0 ? lon - SPI : lon + SPI;
      } else if (lon > -(HALF_PI + FORTPI) && lon <= -FORTPI) {
        area.value = AREA_ENUM.AREA_2;
        theta = lon + HALF_PI;
      } else {
        area.value = AREA_ENUM.AREA_3;
        theta = lon;
      }
    } else if (this.face === FACE_ENUM.BOTTOM) {
      phi = HALF_PI + lat;

      if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
        area.value = AREA_ENUM.AREA_0;
        theta = -lon + HALF_PI;
      } else if (lon < FORTPI && lon >= -FORTPI) {
        area.value = AREA_ENUM.AREA_1;
        theta = -lon;
      } else if (lon < -FORTPI && lon >= -(HALF_PI + FORTPI)) {
        area.value = AREA_ENUM.AREA_2;
        theta = -lon - HALF_PI;
      } else {
        area.value = AREA_ENUM.AREA_3;
        theta = lon > 0.0 ? -lon + SPI : -lon - SPI;
      }
    } else {
      var q, r, s;
      var sinlat, coslat;
      var sinlon, coslon;

      if (this.face === FACE_ENUM.RIGHT) {
        lon = qsc_shift_lon_origin(lon, +HALF_PI);
      } else if (this.face === FACE_ENUM.BACK) {
        lon = qsc_shift_lon_origin(lon, +SPI);
      } else if (this.face === FACE_ENUM.LEFT) {
        lon = qsc_shift_lon_origin(lon, -HALF_PI);
      }

      sinlat = Math.sin(lat);
      coslat = Math.cos(lat);
      sinlon = Math.sin(lon);
      coslon = Math.cos(lon);
      q = coslat * coslon;
      r = coslat * sinlon;
      s = sinlat;

      if (this.face === FACE_ENUM.FRONT) {
        phi = Math.acos(q);
        theta = qsc_fwd_equat_face_theta(phi, s, r, area);
      } else if (this.face === FACE_ENUM.RIGHT) {
        phi = Math.acos(r);
        theta = qsc_fwd_equat_face_theta(phi, s, -q, area);
      } else if (this.face === FACE_ENUM.BACK) {
        phi = Math.acos(-q);
        theta = qsc_fwd_equat_face_theta(phi, s, -r, area);
      } else if (this.face === FACE_ENUM.LEFT) {
        phi = Math.acos(-r);
        theta = qsc_fwd_equat_face_theta(phi, s, q, area);
      } else {
        /* Impossible */
        phi = theta = 0;
        area.value = AREA_ENUM.AREA_0;
      }
    }
    /* Compute mu and nu for the area of definition.
     * For mu, see Eq. (3-21) in [OL76], but note the typos:
     * compare with Eq. (3-14). For nu, see Eq. (3-38). */


    mu = Math.atan(12 / SPI * (theta + Math.acos(Math.sin(theta) * Math.cos(FORTPI)) - HALF_PI));
    t = Math.sqrt((1 - Math.cos(phi)) / (Math.cos(mu) * Math.cos(mu)) / (1 - Math.cos(Math.atan(1 / Math.cos(theta)))));
    /* Apply the result to the real area. */

    if (area.value === AREA_ENUM.AREA_1) {
      mu += HALF_PI;
    } else if (area.value === AREA_ENUM.AREA_2) {
      mu += SPI;
    } else if (area.value === AREA_ENUM.AREA_3) {
      mu += 1.5 * SPI;
    }
    /* Now compute x, y from mu and nu */


    xy.x = t * Math.cos(mu);
    xy.y = t * Math.sin(mu);
    xy.x = xy.x * this.a + this.x0;
    xy.y = xy.y * this.a + this.y0;
    p.x = xy.x;
    p.y = xy.y;
    return p;
  } // QSC inverse equations--mapping x,y to lat/long
  // -----------------------------------------------------------------

  function inverse$q(p) {
    var lp = {
      lam: 0,
      phi: 0
    };
    var mu, nu, cosmu, tannu;
    var tantheta, theta, cosphi, phi;
    var t;
    var area = {
      value: 0
    };
    /* de-offset */

    p.x = (p.x - this.x0) / this.a;
    p.y = (p.y - this.y0) / this.a;
    /* Convert the input x, y to the mu and nu angles as used by QSC.
     * This depends on the area of the cube face. */

    nu = Math.atan(Math.sqrt(p.x * p.x + p.y * p.y));
    mu = Math.atan2(p.y, p.x);

    if (p.x >= 0.0 && p.x >= Math.abs(p.y)) {
      area.value = AREA_ENUM.AREA_0;
    } else if (p.y >= 0.0 && p.y >= Math.abs(p.x)) {
      area.value = AREA_ENUM.AREA_1;
      mu -= HALF_PI;
    } else if (p.x < 0.0 && -p.x >= Math.abs(p.y)) {
      area.value = AREA_ENUM.AREA_2;
      mu = mu < 0.0 ? mu + SPI : mu - SPI;
    } else {
      area.value = AREA_ENUM.AREA_3;
      mu += HALF_PI;
    }
    /* Compute phi and theta for the area of definition.
     * The inverse projection is not described in the original paper, but some
     * good hints can be found here (as of 2011-12-14):
     * http://fits.gsfc.nasa.gov/fitsbits/saf.93/saf.9302
     * (search for "Message-Id: <9302181759.AA25477 at fits.cv.nrao.edu>") */


    t = SPI / 12 * Math.tan(mu);
    tantheta = Math.sin(t) / (Math.cos(t) - 1 / Math.sqrt(2));
    theta = Math.atan(tantheta);
    cosmu = Math.cos(mu);
    tannu = Math.tan(nu);
    cosphi = 1 - cosmu * cosmu * tannu * tannu * (1 - Math.cos(Math.atan(1 / Math.cos(theta))));

    if (cosphi < -1) {
      cosphi = -1;
    } else if (cosphi > +1) {
      cosphi = +1;
    }
    /* Apply the result to the real area on the cube face.
     * For the top and bottom face, we can compute phi and lam directly.
     * For the other faces, we must use unit sphere cartesian coordinates
     * as an intermediate step. */


    if (this.face === FACE_ENUM.TOP) {
      phi = Math.acos(cosphi);
      lp.phi = HALF_PI - phi;

      if (area.value === AREA_ENUM.AREA_0) {
        lp.lam = theta + HALF_PI;
      } else if (area.value === AREA_ENUM.AREA_1) {
        lp.lam = theta < 0.0 ? theta + SPI : theta - SPI;
      } else if (area.value === AREA_ENUM.AREA_2) {
        lp.lam = theta - HALF_PI;
      } else
        /* area.value == AREA_ENUM.AREA_3 */
        {
          lp.lam = theta;
        }
    } else if (this.face === FACE_ENUM.BOTTOM) {
      phi = Math.acos(cosphi);
      lp.phi = phi - HALF_PI;

      if (area.value === AREA_ENUM.AREA_0) {
        lp.lam = -theta + HALF_PI;
      } else if (area.value === AREA_ENUM.AREA_1) {
        lp.lam = -theta;
      } else if (area.value === AREA_ENUM.AREA_2) {
        lp.lam = -theta - HALF_PI;
      } else
        /* area.value == AREA_ENUM.AREA_3 */
        {
          lp.lam = theta < 0.0 ? -theta - SPI : -theta + SPI;
        }
    } else {
      /* Compute phi and lam via cartesian unit sphere coordinates. */
      var q, r, s;
      q = cosphi;
      t = q * q;

      if (t >= 1) {
        s = 0;
      } else {
        s = Math.sqrt(1 - t) * Math.sin(theta);
      }

      t += s * s;

      if (t >= 1) {
        r = 0;
      } else {
        r = Math.sqrt(1 - t);
      }
      /* Rotate q,r,s into the correct area. */


      if (area.value === AREA_ENUM.AREA_1) {
        t = r;
        r = -s;
        s = t;
      } else if (area.value === AREA_ENUM.AREA_2) {
        r = -r;
        s = -s;
      } else if (area.value === AREA_ENUM.AREA_3) {
        t = r;
        r = s;
        s = -t;
      }
      /* Rotate q,r,s into the correct cube face. */


      if (this.face === FACE_ENUM.RIGHT) {
        t = q;
        q = -r;
        r = t;
      } else if (this.face === FACE_ENUM.BACK) {
        q = -q;
        r = -r;
      } else if (this.face === FACE_ENUM.LEFT) {
        t = q;
        q = r;
        r = -t;
      }
      /* Now compute phi and lam from the unit sphere coordinates. */


      lp.phi = Math.acos(-s) - HALF_PI;
      lp.lam = Math.atan2(r, q);

      if (this.face === FACE_ENUM.RIGHT) {
        lp.lam = qsc_shift_lon_origin(lp.lam, -HALF_PI);
      } else if (this.face === FACE_ENUM.BACK) {
        lp.lam = qsc_shift_lon_origin(lp.lam, -SPI);
      } else if (this.face === FACE_ENUM.LEFT) {
        lp.lam = qsc_shift_lon_origin(lp.lam, +HALF_PI);
      }
    }
    /* Apply the shift from the sphere to the ellipsoid as described
     * in [LK12]. */


    if (this.es !== 0) {
      var invert_sign;
      var tanphi, xa;
      invert_sign = lp.phi < 0 ? 1 : 0;
      tanphi = Math.tan(lp.phi);
      xa = this.b / Math.sqrt(tanphi * tanphi + this.one_minus_f_squared);
      lp.phi = Math.atan(Math.sqrt(this.a * this.a - xa * xa) / (this.one_minus_f * xa));

      if (invert_sign) {
        lp.phi = -lp.phi;
      }
    }

    lp.lam += this.long0;
    p.x = lp.lam;
    p.y = lp.phi;
    return p;
  }
  /* Helper function for forward projection: compute the theta angle
   * and determine the area number. */

  function qsc_fwd_equat_face_theta(phi, y, x, area) {
    var theta;

    if (phi < EPSLN) {
      area.value = AREA_ENUM.AREA_0;
      theta = 0.0;
    } else {
      theta = Math.atan2(y, x);

      if (Math.abs(theta) <= FORTPI) {
        area.value = AREA_ENUM.AREA_0;
      } else if (theta > FORTPI && theta <= HALF_PI + FORTPI) {
        area.value = AREA_ENUM.AREA_1;
        theta -= HALF_PI;
      } else if (theta > HALF_PI + FORTPI || theta <= -(HALF_PI + FORTPI)) {
        area.value = AREA_ENUM.AREA_2;
        theta = theta >= 0.0 ? theta - SPI : theta + SPI;
      } else {
        area.value = AREA_ENUM.AREA_3;
        theta += HALF_PI;
      }
    }

    return theta;
  }
  /* Helper function: shift the longitude. */


  function qsc_shift_lon_origin(lon, offset) {
    var slon = lon + offset;

    if (slon < -SPI) {
      slon += TWO_PI;
    } else if (slon > +SPI) {
      slon -= TWO_PI;
    }

    return slon;
  }

  var names$s = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
  var qsc = {
    init: init$r,
    forward: forward$q,
    inverse: inverse$q,
    names: names$s
  };

  // Robinson projection
  var COEFS_X = [[1.0000, 2.2199e-17, -7.15515e-05, 3.1103e-06], [0.9986, -0.000482243, -2.4897e-05, -1.3309e-06], [0.9954, -0.00083103, -4.48605e-05, -9.86701e-07], [0.9900, -0.00135364, -5.9661e-05, 3.6777e-06], [0.9822, -0.00167442, -4.49547e-06, -5.72411e-06], [0.9730, -0.00214868, -9.03571e-05, 1.8736e-08], [0.9600, -0.00305085, -9.00761e-05, 1.64917e-06], [0.9427, -0.00382792, -6.53386e-05, -2.6154e-06], [0.9216, -0.00467746, -0.00010457, 4.81243e-06], [0.8962, -0.00536223, -3.23831e-05, -5.43432e-06], [0.8679, -0.00609363, -0.000113898, 3.32484e-06], [0.8350, -0.00698325, -6.40253e-05, 9.34959e-07], [0.7986, -0.00755338, -5.00009e-05, 9.35324e-07], [0.7597, -0.00798324, -3.5971e-05, -2.27626e-06], [0.7186, -0.00851367, -7.01149e-05, -8.6303e-06], [0.6732, -0.00986209, -0.000199569, 1.91974e-05], [0.6213, -0.010418, 8.83923e-05, 6.24051e-06], [0.5722, -0.00906601, 0.000182, 6.24051e-06], [0.5322, -0.00677797, 0.000275608, 6.24051e-06]];
  var COEFS_Y = [[-5.20417e-18, 0.0124, 1.21431e-18, -8.45284e-11], [0.0620, 0.0124, -1.26793e-09, 4.22642e-10], [0.1240, 0.0124, 5.07171e-09, -1.60604e-09], [0.1860, 0.0123999, -1.90189e-08, 6.00152e-09], [0.2480, 0.0124002, 7.10039e-08, -2.24e-08], [0.3100, 0.0123992, -2.64997e-07, 8.35986e-08], [0.3720, 0.0124029, 9.88983e-07, -3.11994e-07], [0.4340, 0.0123893, -3.69093e-06, -4.35621e-07], [0.4958, 0.0123198, -1.02252e-05, -3.45523e-07], [0.5571, 0.0121916, -1.54081e-05, -5.82288e-07], [0.6176, 0.0119938, -2.41424e-05, -5.25327e-07], [0.6769, 0.011713, -3.20223e-05, -5.16405e-07], [0.7346, 0.0113541, -3.97684e-05, -6.09052e-07], [0.7903, 0.0109107, -4.89042e-05, -1.04739e-06], [0.8435, 0.0103431, -6.4615e-05, -1.40374e-09], [0.8936, 0.00969686, -6.4636e-05, -8.547e-06], [0.9394, 0.00840947, -0.000192841, -4.2106e-06], [0.9761, 0.00616527, -0.000256, -4.2106e-06], [1.0000, 0.00328947, -0.000319159, -4.2106e-06]];
  var FXC = 0.8487;
  var FYC = 1.3523;
  var C1 = R2D / 5; // rad to 5-degree interval

  var RC1 = 1 / C1;
  var NODES = 18;

  var poly3_val = function poly3_val(coefs, x) {
    return coefs[0] + x * (coefs[1] + x * (coefs[2] + x * coefs[3]));
  };

  var poly3_der = function poly3_der(coefs, x) {
    return coefs[1] + x * (2 * coefs[2] + x * 3 * coefs[3]);
  };

  function newton_rapshon(f_df, start, max_err, iters) {
    var x = start;

    for (; iters; --iters) {
      var upd = f_df(x);
      x -= upd;

      if (Math.abs(upd) < max_err) {
        break;
      }
    }

    return x;
  }

  function init$s() {
    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    this.long0 = this.long0 || 0;
    this.es = 0;
    this.title = this.title || "Robinson";
  }
  function forward$r(ll) {
    var lon = adjust_lon(ll.x - this.long0);
    var dphi = Math.abs(ll.y);
    var i = Math.floor(dphi * C1);

    if (i < 0) {
      i = 0;
    } else if (i >= NODES) {
      i = NODES - 1;
    }

    dphi = R2D * (dphi - RC1 * i);
    var xy = {
      x: poly3_val(COEFS_X[i], dphi) * lon,
      y: poly3_val(COEFS_Y[i], dphi)
    };

    if (ll.y < 0) {
      xy.y = -xy.y;
    }

    xy.x = xy.x * this.a * FXC + this.x0;
    xy.y = xy.y * this.a * FYC + this.y0;
    return xy;
  }
  function inverse$r(xy) {
    var ll = {
      x: (xy.x - this.x0) / (this.a * FXC),
      y: Math.abs(xy.y - this.y0) / (this.a * FYC)
    };

    if (ll.y >= 1) {
      // pathologic case
      ll.x /= COEFS_X[NODES][0];
      ll.y = xy.y < 0 ? -HALF_PI : HALF_PI;
    } else {
      // find table interval
      var i = Math.floor(ll.y * NODES);

      if (i < 0) {
        i = 0;
      } else if (i >= NODES) {
        i = NODES - 1;
      }

      for (;;) {
        if (COEFS_Y[i][0] > ll.y) {
          --i;
        } else if (COEFS_Y[i + 1][0] <= ll.y) {
          ++i;
        } else {
          break;
        }
      } // linear interpolation in 5 degree interval


      var coefs = COEFS_Y[i];
      var t = 5 * (ll.y - coefs[0]) / (COEFS_Y[i + 1][0] - coefs[0]); // find t so that poly3_val(coefs, t) = ll.y

      t = newton_rapshon(function (x) {
        return (poly3_val(coefs, x) - ll.y) / poly3_der(coefs, x);
      }, t, EPSLN, 100);
      ll.x /= poly3_val(COEFS_X[i], t);
      ll.y = (5 * i + t) * D2R;

      if (xy.y < 0) {
        ll.y = -ll.y;
      }
    }

    ll.x = adjust_lon(ll.x + this.long0);
    return ll;
  }
  var names$t = ["Robinson", "robin"];
  var robin = {
    init: init$s,
    forward: forward$r,
    inverse: inverse$r,
    names: names$t
  };

  function init$t() {
    this.name = 'geocent';
  }
  function forward$s(p) {
    var point = geodeticToGeocentric(p, this.es, this.a);
    return point;
  }
  function inverse$s(p) {
    var point = geocentricToGeodetic(p, this.es, this.a, this.b);
    return point;
  }
  var names$u = ["Geocentric", 'geocentric', "geocent", "Geocent"];
  var geocent = {
    init: init$t,
    forward: forward$s,
    inverse: inverse$s,
    names: names$u
  };

  var mode = {
    N_POLE: 0,
    S_POLE: 1,
    EQUIT: 2,
    OBLIQ: 3
  };
  var params = {
    h: {
      def: 100000,
      num: true
    },
    // default is Karman line, no default in PROJ.7
    azi: {
      def: 0,
      num: true,
      degrees: true
    },
    // default is North
    tilt: {
      def: 0,
      num: true,
      degrees: true
    },
    // default is Nadir
    long0: {
      def: 0,
      num: true
    },
    // default is Greenwich, conversion to rad is automatic
    lat0: {
      def: 0,
      num: true
    } // default is Equator, conversion to rad is automatic

  };
  function init$u() {
    Object.keys(params).forEach(function (p) {
      if (typeof this[p] === "undefined") {
        this[p] = params[p].def;
      } else if (params[p].num && isNaN(this[p])) {
        throw new Error("Invalid parameter value, must be numeric " + p + " = " + this[p]);
      } else if (params[p].num) {
        this[p] = parseFloat(this[p]);
      }

      if (params[p].degrees) {
        this[p] = this[p] * D2R;
      }
    }.bind(this));

    if (Math.abs(Math.abs(this.lat0) - HALF_PI) < EPSLN) {
      this.mode = this.lat0 < 0 ? mode.S_POLE : mode.N_POLE;
    } else if (Math.abs(this.lat0) < EPSLN) {
      this.mode = mode.EQUIT;
    } else {
      this.mode = mode.OBLIQ;
      this.sinph0 = Math.sin(this.lat0);
      this.cosph0 = Math.cos(this.lat0);
    }

    this.pn1 = this.h / this.a; // Normalize relative to the Earth's radius

    if (this.pn1 <= 0 || this.pn1 > 1e10) {
      throw new Error("Invalid height");
    }

    this.p = 1 + this.pn1;
    this.rp = 1 / this.p;
    this.h1 = 1 / this.pn1;
    this.pfact = (this.p + 1) * this.h1;
    this.es = 0;
    var omega = this.tilt;
    var gamma = this.azi;
    this.cg = Math.cos(gamma);
    this.sg = Math.sin(gamma);
    this.cw = Math.cos(omega);
    this.sw = Math.sin(omega);
  }
  function forward$t(p) {
    p.x -= this.long0;
    var sinphi = Math.sin(p.y);
    var cosphi = Math.cos(p.y);
    var coslam = Math.cos(p.x);
    var x, y;

    switch (this.mode) {
      case mode.OBLIQ:
        y = this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
        break;

      case mode.EQUIT:
        y = cosphi * coslam;
        break;

      case mode.S_POLE:
        y = -sinphi;
        break;

      case mode.N_POLE:
        y = sinphi;
        break;
    }

    y = this.pn1 / (this.p - y);
    x = y * cosphi * Math.sin(p.x);

    switch (this.mode) {
      case mode.OBLIQ:
        y *= this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
        break;

      case mode.EQUIT:
        y *= sinphi;
        break;

      case mode.N_POLE:
        y *= -(cosphi * coslam);
        break;

      case mode.S_POLE:
        y *= cosphi * coslam;
        break;
    } // Tilt 


    var yt, ba;
    yt = y * this.cg + x * this.sg;
    ba = 1 / (yt * this.sw * this.h1 + this.cw);
    x = (x * this.cg - y * this.sg) * this.cw * ba;
    y = yt * ba;
    p.x = x * this.a;
    p.y = y * this.a;
    return p;
  }
  function inverse$t(p) {
    p.x /= this.a;
    p.y /= this.a;
    var r = {
      x: p.x,
      y: p.y
    }; // Un-Tilt

    var bm, bq, yt;
    yt = 1 / (this.pn1 - p.y * this.sw);
    bm = this.pn1 * p.x * yt;
    bq = this.pn1 * p.y * this.cw * yt;
    p.x = bm * this.cg + bq * this.sg;
    p.y = bq * this.cg - bm * this.sg;
    var rh = hypot(p.x, p.y);

    if (Math.abs(rh) < EPSLN) {
      r.x = 0;
      r.y = p.y;
    } else {
      var cosz, sinz;
      sinz = 1 - rh * rh * this.pfact;
      sinz = (this.p - Math.sqrt(sinz)) / (this.pn1 / rh + rh / this.pn1);
      cosz = Math.sqrt(1 - sinz * sinz);

      switch (this.mode) {
        case mode.OBLIQ:
          r.y = Math.asin(cosz * this.sinph0 + p.y * sinz * this.cosph0 / rh);
          p.y = (cosz - this.sinph0 * Math.sin(r.y)) * rh;
          p.x *= sinz * this.cosph0;
          break;

        case mode.EQUIT:
          r.y = Math.asin(p.y * sinz / rh);
          p.y = cosz * rh;
          p.x *= sinz;
          break;

        case mode.N_POLE:
          r.y = Math.asin(cosz);
          p.y = -p.y;
          break;

        case mode.S_POLE:
          r.y = -Math.asin(cosz);
          break;
      }

      r.x = Math.atan2(p.x, p.y);
    }

    p.x = r.x + this.long0;
    p.y = r.y;
    return p;
  }
  var names$v = ["Tilted_Perspective", "tpers"];
  var tpers = {
    init: init$u,
    forward: forward$t,
    inverse: inverse$t,
    names: names$v
  };

  function includedProjections (proj4) {
    proj4.Proj.projections.add(tmerc);
    proj4.Proj.projections.add(etmerc);
    proj4.Proj.projections.add(utm);
    proj4.Proj.projections.add(sterea);
    proj4.Proj.projections.add(stere);
    proj4.Proj.projections.add(somerc);
    proj4.Proj.projections.add(omerc);
    proj4.Proj.projections.add(lcc);
    proj4.Proj.projections.add(krovak);
    proj4.Proj.projections.add(cass);
    proj4.Proj.projections.add(laea);
    proj4.Proj.projections.add(aea);
    proj4.Proj.projections.add(gnom);
    proj4.Proj.projections.add(cea);
    proj4.Proj.projections.add(eqc);
    proj4.Proj.projections.add(poly);
    proj4.Proj.projections.add(nzmg);
    proj4.Proj.projections.add(mill);
    proj4.Proj.projections.add(sinu);
    proj4.Proj.projections.add(moll);
    proj4.Proj.projections.add(eqdc);
    proj4.Proj.projections.add(vandg);
    proj4.Proj.projections.add(aeqd);
    proj4.Proj.projections.add(ortho);
    proj4.Proj.projections.add(qsc);
    proj4.Proj.projections.add(robin);
    proj4.Proj.projections.add(geocent);
    proj4.Proj.projections.add(tpers);
  }

  proj4.defaultDatum = 'WGS84'; //default datum

  proj4.Proj = Projection;
  proj4.WGS84 = new proj4.Proj('WGS84');
  proj4.Point = Point;
  proj4.toPoint = common;
  proj4.defs = defs;
  proj4.nadgrid = nadgrid;
  proj4.transform = transform;
  proj4.mgrs = mgrs;
  proj4.version = '__VERSION__';
  includedProjections(proj4);

  /** @module src/km100 */

  /** @constant
    * @description This the array from which the default object is derived. If you
    * need to work with an array of objects where the 100 km grid reference is a property
    * of the object alongside x, y, and proj, you can use this.
    * @type {array}
  */

  var a100km = [{
    "GridRef": "SV",
    "x": 0,
    "y": 0,
    "proj": "gb"
  }, {
    "GridRef": "NL",
    "x": 0,
    "y": 7,
    "proj": "gb"
  }, {
    "GridRef": "NF",
    "x": 0,
    "y": 8,
    "proj": "gb"
  }, {
    "GridRef": "NA",
    "x": 0,
    "y": 9,
    "proj": "gb"
  }, {
    "GridRef": "SW",
    "x": 1,
    "y": 0,
    "proj": "gb"
  }, {
    "GridRef": "SR",
    "x": 1,
    "y": 1,
    "proj": "gb"
  }, {
    "GridRef": "SM",
    "x": 1,
    "y": 2,
    "proj": "gb"
  }, {
    "GridRef": "NW",
    "x": 1,
    "y": 5,
    "proj": "gb"
  }, {
    "GridRef": "NR",
    "x": 1,
    "y": 6,
    "proj": "gb"
  }, {
    "GridRef": "NM",
    "x": 1,
    "y": 7,
    "proj": "gb"
  }, {
    "GridRef": "NG",
    "x": 1,
    "y": 8,
    "proj": "gb"
  }, {
    "GridRef": "NB",
    "x": 1,
    "y": 9,
    "proj": "gb"
  }, {
    "GridRef": "HW",
    "x": 1,
    "y": 10,
    "proj": "gb"
  }, {
    "GridRef": "SX",
    "x": 2,
    "y": 0,
    "proj": "gb"
  }, {
    "GridRef": "SS",
    "x": 2,
    "y": 1,
    "proj": "gb"
  }, {
    "GridRef": "SN",
    "x": 2,
    "y": 2,
    "proj": "gb"
  }, {
    "GridRef": "SH",
    "x": 2,
    "y": 3,
    "proj": "gb"
  }, {
    "GridRef": "SC",
    "x": 2,
    "y": 4,
    "proj": "gb"
  }, {
    "GridRef": "NX",
    "x": 2,
    "y": 5,
    "proj": "gb"
  }, {
    "GridRef": "NS",
    "x": 2,
    "y": 6,
    "proj": "gb"
  }, {
    "GridRef": "NN",
    "x": 2,
    "y": 7,
    "proj": "gb"
  }, {
    "GridRef": "NH",
    "x": 2,
    "y": 8,
    "proj": "gb"
  }, {
    "GridRef": "NC",
    "x": 2,
    "y": 9,
    "proj": "gb"
  }, {
    "GridRef": "HX",
    "x": 2,
    "y": 10,
    "proj": "gb"
  }, {
    "GridRef": "SY",
    "x": 3,
    "y": 0,
    "proj": "gb"
  }, {
    "GridRef": "ST",
    "x": 3,
    "y": 1,
    "proj": "gb"
  }, {
    "GridRef": "SO",
    "x": 3,
    "y": 2,
    "proj": "gb"
  }, {
    "GridRef": "SJ",
    "x": 3,
    "y": 3,
    "proj": "gb"
  }, {
    "GridRef": "SD",
    "x": 3,
    "y": 4,
    "proj": "gb"
  }, {
    "GridRef": "NY",
    "x": 3,
    "y": 5,
    "proj": "gb"
  }, {
    "GridRef": "NT",
    "x": 3,
    "y": 6,
    "proj": "gb"
  }, {
    "GridRef": "NO",
    "x": 3,
    "y": 7,
    "proj": "gb"
  }, {
    "GridRef": "NJ",
    "x": 3,
    "y": 8,
    "proj": "gb"
  }, {
    "GridRef": "ND",
    "x": 3,
    "y": 9,
    "proj": "gb"
  }, {
    "GridRef": "HY",
    "x": 3,
    "y": 10,
    "proj": "gb"
  }, {
    "GridRef": "HT",
    "x": 3,
    "y": 11,
    "proj": "gb"
  }, {
    "GridRef": "SZ",
    "x": 4,
    "y": 0,
    "proj": "gb"
  }, {
    "GridRef": "SU",
    "x": 4,
    "y": 1,
    "proj": "gb"
  }, {
    "GridRef": "SP",
    "x": 4,
    "y": 2,
    "proj": "gb"
  }, {
    "GridRef": "SK",
    "x": 4,
    "y": 3,
    "proj": "gb"
  }, {
    "GridRef": "SE",
    "x": 4,
    "y": 4,
    "proj": "gb"
  }, {
    "GridRef": "NZ",
    "x": 4,
    "y": 5,
    "proj": "gb"
  }, {
    "GridRef": "NU",
    "x": 4,
    "y": 6,
    "proj": "gb"
  }, {
    "GridRef": "NK",
    "x": 4,
    "y": 8,
    "proj": "gb"
  }, {
    "GridRef": "HZ",
    "x": 4,
    "y": 10,
    "proj": "gb"
  }, {
    "GridRef": "HU",
    "x": 4,
    "y": 11,
    "proj": "gb"
  }, {
    "GridRef": "HP",
    "x": 4,
    "y": 12,
    "proj": "gb"
  }, {
    "GridRef": "TV",
    "x": 5,
    "y": 0,
    "proj": "gb"
  }, {
    "GridRef": "TQ",
    "x": 5,
    "y": 1,
    "proj": "gb"
  }, {
    "GridRef": "TL",
    "x": 5,
    "y": 2,
    "proj": "gb"
  }, {
    "GridRef": "TF",
    "x": 5,
    "y": 3,
    "proj": "gb"
  }, {
    "GridRef": "TA",
    "x": 5,
    "y": 4,
    "proj": "gb"
  }, {
    "GridRef": "OV",
    "x": 5,
    "y": 5,
    "proj": "gb"
  }, {
    "GridRef": "TR",
    "x": 6,
    "y": 1,
    "proj": "gb"
  }, {
    "GridRef": "TM",
    "x": 6,
    "y": 2,
    "proj": "gb"
  }, {
    "GridRef": "TG",
    "x": 6,
    "y": 3,
    "proj": "gb"
  }, {
    "GridRef": "V",
    "x": 0,
    "y": 0,
    "proj": "ir"
  }, {
    "GridRef": "Q",
    "x": 0,
    "y": 1,
    "proj": "ir"
  }, {
    "GridRef": "L",
    "x": 0,
    "y": 2,
    "proj": "ir"
  }, {
    "GridRef": "F",
    "x": 0,
    "y": 3,
    "proj": "ir"
  }, {
    "GridRef": "A",
    "x": 0,
    "y": 4,
    "proj": "ir"
  }, {
    "GridRef": "W",
    "x": 1,
    "y": 0,
    "proj": "ir"
  }, {
    "GridRef": "R",
    "x": 1,
    "y": 1,
    "proj": "ir"
  }, {
    "GridRef": "M",
    "x": 1,
    "y": 2,
    "proj": "ir"
  }, {
    "GridRef": "G",
    "x": 1,
    "y": 3,
    "proj": "ir"
  }, {
    "GridRef": "B",
    "x": 1,
    "y": 4,
    "proj": "ir"
  }, {
    "GridRef": "X",
    "x": 2,
    "y": 0,
    "proj": "ir"
  }, {
    "GridRef": "S",
    "x": 2,
    "y": 1,
    "proj": "ir"
  }, {
    "GridRef": "N",
    "x": 2,
    "y": 2,
    "proj": "ir"
  }, {
    "GridRef": "H",
    "x": 2,
    "y": 3,
    "proj": "ir"
  }, {
    "GridRef": "C",
    "x": 2,
    "y": 4,
    "proj": "ir"
  }, {
    "GridRef": "Y",
    "x": 3,
    "y": 0,
    "proj": "ir"
  }, {
    "GridRef": "T",
    "x": 3,
    "y": 1,
    "proj": "ir"
  }, {
    "GridRef": "O",
    "x": 3,
    "y": 2,
    "proj": "ir"
  }, {
    "GridRef": "J",
    "x": 3,
    "y": 3,
    "proj": "ir"
  }, {
    "GridRef": "D",
    "x": 3,
    "y": 4,
    "proj": "ir"
  }, {
    "GridRef": "Z",
    "x": 4,
    "y": 0,
    "proj": "ir"
  }, {
    "GridRef": "U",
    "x": 4,
    "y": 1,
    "proj": "ir"
  }, {
    "GridRef": "P",
    "x": 4,
    "y": 2,
    "proj": "ir"
  }, {
    "GridRef": "K",
    "x": 4,
    "y": 3,
    "proj": "ir"
  }, {
    "GridRef": "E",
    "x": 4,
    "y": 4,
    "proj": "ir"
  }, {
    "GridRef": "WV",
    "x": 5,
    "y": 54,
    "proj": "ci"
  }, {
    "GridRef": "WA",
    "x": 5,
    "y": 55,
    "proj": "ci"
  }];
  /** @constant
    * @description The default export from this module is an object with a property
    * for every 100 km square reference for Britain (Brtish National Grid),
    * Ireland (Irish National Grid) and the Channel Islands (abbreviated UTM 30N).
    * Each grid reference references an object that has properties x, y and proj.
    * The x and y coordinates represent the centroid of the 100 km square in the
    * coordinate reference system corresponding to the aforementioned areas, respectively
    * epsg:27700, epsg:29903 and epsg:32630. Another property, proj, indicates the region/CRS
    * with two letter codes, respectively gb, ir and ci.
    * <p>An example of the object referenced through the property 'SO' is shown below:</p>
    * <pre>
    * {
    *   "x": 3,
    *   "y": 2,
    *   "proj": "gb"
    * }
    * </pre>
    * @type {object}
  */

  var km100s = a100km.reduce(function (acc, km100) {
    acc[km100.GridRef] = {
      x: km100.x,
      y: km100.y,
      proj: km100.proj
    };
    return acc;
  }, {});
  /** @module src/checkGr */

  function invalidGridRef(gr) {
    throw "The value '".concat(gr, "' is not recognised as a valid grid reference.");
  }
  /**
   * Given a grid reference (British National Grid, Irish Grid or UTM zone 30N shorthand),
   * check that ths is a valid GR. If it is, return an object which includes the 
   * GR precision in metres, the prefix and the two-letter projection code.
   * If an invalid grid reference is supplied throws an error.
   * @param {string} gr - the grid reference.
   * @returns {object} Object of the form {precision: n, prefix: 'prefix', projection: 'code'}.
   */


  function checkGr(gr) {
    var r100km = RegExp('^[a-zA-Z]{1,2}$');
    var rHectad = RegExp('^[a-zA-Z]{1,2}[0-9]{2}$');
    var rQuandrant = RegExp('^[a-zA-Z]{1,2}[0-9]{2}[SsNn][WwEe]$');
    var rTetrad = RegExp('^[a-zA-Z]{1,2}[0-9]{2}[a-np-zA-NP-Z]$');
    var rMonad = RegExp('^[a-zA-Z]{1,2}[0-9]{4}$');
    var r6fig = RegExp('^[a-zA-Z]{1,2}[0-9]{6}$');
    var r8fig = RegExp('^[a-zA-Z]{1,2}[0-9]{8}$');
    var r10fig = RegExp('^[a-zA-Z]{1,2}[0-9]{10}$');
    var match = gr.match(/^[A-Za-z]+/);
    if (!match) invalidGridRef(gr);
    var prefix = match[0].toUpperCase();
    var km100 = km100s[prefix];
    if (!km100) invalidGridRef(gr);
    var ret = {
      precision: null,
      prefix: prefix,
      projection: km100.proj
    };

    if (r100km.test(gr)) {
      // The GR is a 100 km square reference
      ret.precision = 100000;
    } else if (rHectad.test(gr)) {
      // The GR is a hectad
      ret.precision = 10000;
    } else if (rQuandrant.test(gr)) {
      // The GR is a quandrant
      ret.precision = 5000;
    } else if (rTetrad.test(gr)) {
      // The GR is a tetrad
      ret.precision = 2000;
    } else if (rMonad.test(gr)) {
      // The GR is a monad
      ret.precision = 1000;
    } else if (r6fig.test(gr)) {
      // The GR is a 6 figure GR
      ret.precision = 100;
    } else if (r8fig.test(gr)) {
      // The GR is a 8 figure GR
      ret.precision = 10;
    } else if (r10fig.test(gr)) {
      // The GR is a 10 figure GR
      ret.precision = 1;
    } else {
      invalidGridRef(gr);
    }

    return ret;
  }
  /** @module src/projections */

  /** @constant
    * @description This object describes the coordinate reference systems used in this project corresponding
    * to the British National Grid, Irish Grid, UTM zone 30N (used for the Channel Islands)  and WGS 84. The object contains
    * four properties, each named with the two letter code used throughout this package to represent one of the
    * three systems: gb, ir, ci and wg. Each of these properties provides access to an object defining the name,
    * epsg code and proj4 string for the CRS.
    * @type {array}
  */


  var projections$1 = {
    gb: {
      name: 'OSGB 1936 / British National Grid',
      epsg: '27700',
      proj4: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs'
    },
    ir: {
      name: 'TM75 / Irish Grid',
      epsg: '29903',
      proj4: '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs'
    },
    ci: {
      name: 'WGS 84 / UTM zone 30N',
      epsg: '32630',
      proj4: '+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs'
    },
    wg: {
      name: 'WGS 84',
      epsg: '4326',
      proj4: '+proj=longlat +datum=WGS84 +no_defs'
    }
  };
  /** @module src/quadrants */

  /** @constant
    * @description This object specifies the x, y offsets associated with suffixes for quandrant grid refs.
    * @type {Object}
  */

  var qOffsets = {
    sw: {
      x: 0,
      y: 0
    },
    se: {
      x: 5000,
      y: 0
    },
    nw: {
      x: 0,
      y: 5000
    },
    ne: {
      x: 5000,
      y: 5000
    }
  };
  /** @module src/tetrads */

  /** @constant
    * @description This object specifies the x, y offsets associated with suffixes for tetrad grid refs.
    * @type {Object}
  */

  var tOffsets = {
    a: {
      x: 0,
      y: 0
    },
    b: {
      x: 0,
      y: 2000
    },
    c: {
      x: 0,
      y: 4000
    },
    d: {
      x: 0,
      y: 6000
    },
    e: {
      x: 0,
      y: 8000
    },
    f: {
      x: 2000,
      y: 0
    },
    g: {
      x: 2000,
      y: 2000
    },
    h: {
      x: 2000,
      y: 4000
    },
    i: {
      x: 2000,
      y: 6000
    },
    j: {
      x: 2000,
      y: 8000
    },
    k: {
      x: 4000,
      y: 0
    },
    l: {
      x: 4000,
      y: 2000
    },
    m: {
      x: 4000,
      y: 4000
    },
    n: {
      x: 4000,
      y: 6000
    },
    p: {
      x: 4000,
      y: 8000
    },
    q: {
      x: 6000,
      y: 0
    },
    r: {
      x: 6000,
      y: 2000
    },
    s: {
      x: 6000,
      y: 4000
    },
    t: {
      x: 6000,
      y: 6000
    },
    u: {
      x: 6000,
      y: 8000
    },
    v: {
      x: 8000,
      y: 0
    },
    w: {
      x: 8000,
      y: 2000
    },
    x: {
      x: 8000,
      y: 4000
    },
    y: {
      x: 8000,
      y: 6000
    },
    z: {
      x: 8000,
      y: 8000
    }
  };
  /** @module src/getCentroid */

  /**
   * Given a grid reference (British National Grid, Irish Grid or UTM zone 30N shorthand),
   * and a two-letter code defining the requested output projection, this function
   * returns the centroid of the grid reference.
   * @param {string} gr - the grid reference
   * @param {string} toProjection - two letter code specifying the required output CRS.
   * @returns {object} - of the form {centroid: [x, y], proj: 'code'}; x and y are 
   * coordinates in CRS specified by toProjection. The proj code indicates the source projection.
   */

  function getCentroid(gr, toProjection) {
    var x, y, outCoords, suffix;
    var grType = checkGr(gr);
    var prefix = grType.prefix;
    var km100 = km100s[prefix];

    switch (grType.precision) {
      case 100000:
        x = km100.x * 100000 + 50000;
        y = km100.y * 100000 + 50000;
        break;

      case 10000:
        x = km100.x * 100000 + Number(gr.substr(prefix.length, 1)) * 10000 + 5000;
        y = km100.y * 100000 + Number(gr.substr(prefix.length + 1, 1)) * 10000 + 5000;
        break;

      case 5000:
        suffix = gr.substr(prefix.length + 2, 2).toLowerCase();
        x = km100.x * 100000 + Number(gr.substr(prefix.length, 1)) * 10000 + qOffsets[suffix].x + 2500;
        y = km100.y * 100000 + Number(gr.substr(prefix.length + 1, 1)) * 10000 + qOffsets[suffix].y + 2500;
        break;

      case 2000:
        suffix = gr.substr(prefix.length + 2, 1).toLowerCase();
        x = km100.x * 100000 + Number(gr.substr(prefix.length, 1)) * 10000 + tOffsets[suffix].x + 1000;
        y = km100.y * 100000 + Number(gr.substr(prefix.length + 1, 1)) * 10000 + tOffsets[suffix].y + 1000;
        break;

      case 1000:
        x = km100.x * 100000 + Number(gr.substr(prefix.length, 2)) * 1000 + 500;
        y = km100.y * 100000 + Number(gr.substr(prefix.length + 2, 2)) * 1000 + 500;
        break;

      case 100:
        x = km100.x * 100000 + Number(gr.substr(prefix.length, 3)) * 100 + 50;
        y = km100.y * 100000 + Number(gr.substr(prefix.length + 3, 3)) * 100 + 50;
        break;

      case 10:
        x = km100.x * 100000 + Number(gr.substr(prefix.length, 4)) * 10 + 5;
        y = km100.y * 100000 + Number(gr.substr(prefix.length + 4, 4)) * 10 + 5;
        break;

      default:
        x = km100.x * 100000 + Number(gr.substr(prefix.length, 5)) + 0.5;
        y = km100.y * 100000 + Number(gr.substr(prefix.length + 5, 5)) + 0.5;
    } // If the required output projection does not match the projection of the input GR
    // then use proj4 to reproject


    if (toProjection !== km100.proj) {
      outCoords = proj4(projections$1[km100.proj].proj4, projections$1[toProjection].proj4, [x, y]);
    } else {
      outCoords = [x, y];
    }

    return {
      centroid: outCoords,
      proj: km100.proj
    };
  }

  var constants = {
    thisCdn: 'https://cdn.jsdelivr.net/gh/biologicalrecordscentre/brc-charts@latest/dist'
  };

  var backData = [
  	[
  		1200,
  		0,
  		67
  	],
  	[
  		1200,
  		100,
  		4
  	],
  	[
  		1100,
  		100,
  		17
  	],
  	[
  		1100,
  		0,
  		162
  	],
  	[
  		1100,
  		200,
  		1
  	],
  	[
  		1150,
  		0,
  		367
  	],
  	[
  		1150,
  		100,
  		39
  	],
  	[
  		1150,
  		200,
  		3
  	],
  	[
  		1150,
  		300,
  		1
  	],
  	[
  		1000,
  		0,
  		381
  	],
  	[
  		1000,
  		100,
  		24
  	],
  	[
  		1000,
  		200,
  		2
  	],
  	[
  		1050,
  		0,
  		31
  	],
  	[
  		900,
  		0,
  		664
  	],
  	[
  		900,
  		100,
  		630
  	],
  	[
  		900,
  		200,
  		408
  	],
  	[
  		900,
  		300,
  		211
  	],
  	[
  		900,
  		400,
  		55
  	],
  	[
  		950,
  		0,
  		538
  	],
  	[
  		950,
  		100,
  		200
  	],
  	[
  		900,
  		500,
  		30
  	],
  	[
  		950,
  		200,
  		54
  	],
  	[
  		950,
  		300,
  		10
  	],
  	[
  		900,
  		600,
  		6
  	],
  	[
  		950,
  		500,
  		3
  	],
  	[
  		950,
  		400,
  		3
  	],
  	[
  		850,
  		100,
  		482
  	],
  	[
  		850,
  		0,
  		1132
  	],
  	[
  		800,
  		0,
  		783
  	],
  	[
  		800,
  		100,
  		673
  	],
  	[
  		800,
  		300,
  		509
  	],
  	[
  		800,
  		200,
  		628
  	],
  	[
  		850,
  		200,
  		300
  	],
  	[
  		850,
  		300,
  		232
  	],
  	[
  		800,
  		400,
  		366
  	],
  	[
  		800,
  		600,
  		167
  	],
  	[
  		800,
  		500,
  		263
  	],
  	[
  		850,
  		400,
  		146
  	],
  	[
  		850,
  		500,
  		110
  	],
  	[
  		800,
  		700,
  		94
  	],
  	[
  		850,
  		600,
  		32
  	],
  	[
  		850,
  		700,
  		18
  	],
  	[
  		800,
  		800,
  		31
  	],
  	[
  		850,
  		800,
  		2
  	],
  	[
  		800,
  		900,
  		9
  	],
  	[
  		800,
  		1000,
  		6
  	],
  	[
  		800,
  		1100,
  		1
  	],
  	[
  		750,
  		0,
  		518
  	],
  	[
  		750,
  		100,
  		393
  	],
  	[
  		700,
  		0,
  		920
  	],
  	[
  		750,
  		200,
  		373
  	],
  	[
  		750,
  		300,
  		502
  	],
  	[
  		700,
  		100,
  		581
  	],
  	[
  		700,
  		200,
  		399
  	],
  	[
  		750,
  		400,
  		429
  	],
  	[
  		700,
  		300,
  		307
  	],
  	[
  		700,
  		400,
  		242
  	],
  	[
  		700,
  		600,
  		89
  	],
  	[
  		750,
  		500,
  		305
  	],
  	[
  		750,
  		600,
  		259
  	],
  	[
  		700,
  		500,
  		144
  	],
  	[
  		700,
  		700,
  		46
  	],
  	[
  		750,
  		700,
  		153
  	],
  	[
  		750,
  		900,
  		20
  	],
  	[
  		750,
  		800,
  		66
  	],
  	[
  		700,
  		800,
  		2
  	],
  	[
  		700,
  		900,
  		1
  	],
  	[
  		750,
  		1000,
  		4
  	],
  	[
  		750,
  		1100,
  		1
  	],
  	[
  		650,
  		0,
  		1262
  	],
  	[
  		650,
  		100,
  		714
  	],
  	[
  		600,
  		0,
  		655
  	],
  	[
  		600,
  		100,
  		625
  	],
  	[
  		650,
  		200,
  		471
  	],
  	[
  		600,
  		200,
  		731
  	],
  	[
  		650,
  		300,
  		234
  	],
  	[
  		650,
  		400,
  		63
  	],
  	[
  		600,
  		300,
  		502
  	],
  	[
  		600,
  		400,
  		266
  	],
  	[
  		600,
  		500,
  		70
  	],
  	[
  		650,
  		500,
  		6
  	],
  	[
  		600,
  		600,
  		13
  	],
  	[
  		600,
  		700,
  		3
  	],
  	[
  		550,
  		0,
  		1063
  	],
  	[
  		550,
  		100,
  		818
  	],
  	[
  		500,
  		0,
  		697
  	],
  	[
  		550,
  		200,
  		632
  	],
  	[
  		500,
  		100,
  		581
  	],
  	[
  		550,
  		300,
  		283
  	],
  	[
  		550,
  		400,
  		77
  	],
  	[
  		550,
  		500,
  		25
  	],
  	[
  		550,
  		600,
  		2
  	],
  	[
  		500,
  		200,
  		355
  	],
  	[
  		500,
  		300,
  		255
  	],
  	[
  		500,
  		400,
  		220
  	],
  	[
  		500,
  		500,
  		141
  	],
  	[
  		500,
  		600,
  		50
  	],
  	[
  		500,
  		700,
  		5
  	],
  	[
  		450,
  		0,
  		1242
  	],
  	[
  		450,
  		100,
  		600
  	],
  	[
  		450,
  		300,
  		238
  	],
  	[
  		450,
  		200,
  		370
  	],
  	[
  		450,
  		400,
  		146
  	],
  	[
  		400,
  		0,
  		1751
  	],
  	[
  		450,
  		500,
  		58
  	],
  	[
  		400,
  		100,
  		431
  	],
  	[
  		400,
  		200,
  		219
  	],
  	[
  		400,
  		300,
  		144
  	],
  	[
  		400,
  		400,
  		31
  	],
  	[
  		450,
  		600,
  		4
  	],
  	[
  		400,
  		500,
  		2
  	],
  	[
  		300,
  		0,
  		3021
  	],
  	[
  		300,
  		100,
  		1145
  	],
  	[
  		350,
  		0,
  		2412
  	],
  	[
  		300,
  		200,
  		299
  	],
  	[
  		300,
  		300,
  		223
  	],
  	[
  		350,
  		100,
  		566
  	],
  	[
  		350,
  		200,
  		356
  	],
  	[
  		300,
  		500,
  		41
  	],
  	[
  		350,
  		300,
  		252
  	],
  	[
  		350,
  		400,
  		101
  	],
  	[
  		300,
  		400,
  		155
  	],
  	[
  		350,
  		500,
  		18
  	],
  	[
  		350,
  		700,
  		3
  	],
  	[
  		350,
  		600,
  		11
  	],
  	[
  		350,
  		800,
  		2
  	],
  	[
  		300,
  		600,
  		8
  	],
  	[
  		200,
  		0,
  		2821
  	],
  	[
  		200,
  		100,
  		1742
  	],
  	[
  		200,
  		200,
  		531
  	],
  	[
  		200,
  		300,
  		266
  	],
  	[
  		200,
  		400,
  		105
  	],
  	[
  		250,
  		0,
  		2800
  	],
  	[
  		250,
  		100,
  		1334
  	],
  	[
  		250,
  		200,
  		404
  	],
  	[
  		250,
  		300,
  		292
  	],
  	[
  		250,
  		400,
  		182
  	],
  	[
  		200,
  		500,
  		36
  	],
  	[
  		250,
  		500,
  		28
  	],
  	[
  		250,
  		600,
  		2
  	],
  	[
  		200,
  		600,
  		11
  	],
  	[
  		150,
  		0,
  		2748
  	],
  	[
  		100,
  		0,
  		2728
  	],
  	[
  		100,
  		100,
  		1640
  	],
  	[
  		100,
  		200,
  		243
  	],
  	[
  		150,
  		100,
  		1225
  	],
  	[
  		100,
  		300,
  		80
  	],
  	[
  		100,
  		400,
  		19
  	],
  	[
  		150,
  		200,
  		155
  	],
  	[
  		150,
  		300,
  		30
  	],
  	[
  		150,
  		400,
  		9
  	],
  	[
  		0,
  		0,
  		402
  	],
  	[
  		0,
  		100,
  		88
  	],
  	[
  		0,
  		200,
  		4
  	],
  	[
  		50,
  		0,
  		1122
  	],
  	[
  		50,
  		100,
  		670
  	],
  	[
  		50,
  		200,
  		183
  	],
  	[
  		50,
  		300,
  		74
  	],
  	[
  		50,
  		400,
  		45
  	],
  	[
  		50,
  		500,
  		12
  	]
  ];

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG. (Default - 'body'.)
   * @param {string} opts.elid - The id for the dom object created. (Default - 'altlat-chart'.)
   * @param {number} opts.width - The width of each sub-chart area in pixels. (Default - 300.)
   * @param {number} opts.height - The height of the each sub-chart area in pixels. (Default - 200.)
   * @param {Object} opts.margin - An object indicating the margins to add around each sub-chart area.
   * @param {number} opts.margin.left - Left margin in pixels. (Default - 40.)
   * @param {number} opts.margin.right - Right margin in pixels. (Default - 40.)
   * @param {number} opts.margin.top - Top margin in pixels. (Default - 20.)
   * @param {number} opts.margin.bottom - Bottom margin in pixels. (Default - 20.)
   * @param {number} opts.perRow - The number of sub-charts per row. (Default - 2.)
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element and scale as that element resized. (Default - false.)
   * @param {string } opts.font - Font to use for chart. (Default - sans-serif.)
   * @param {string} opts.title - Title for the chart. (Default - ''.)
   * @param {string} opts.subtitle - Subtitle for the chart. (Default - ''.)
   * @param {string} opts.footer - Footer for the chart. (Default - ''.)
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title. (Default - 24.)
   * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle. (Default - 16.)
   * @param {string} opts.footerFontSize - Font size (pixels) of chart footer. (Default - 10.)
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'. (Default - 'left'.)
   * @param {boolean} opts.showTaxonLabel - Whether or not to show taxon label above each sub-graph. (Default - true.)
   * @param {boolean} opts.showLegend - Whether or not to show an overall chart legend. (Default - true.)
   * @param {string} opts.taxonLabelFontSize - Font size (pixels) of taxon sub-chart label. (Default - 10.)
   * @param {boolean} opts.taxonLabelItalics - Whether or not to italicise taxon label.(Default - true.)
   * @param {string} opts.legendFontSize - Font size (pixels) of legend item text. (Default - 10.)
   * @param {number | null} opts.legendSpacing - A value (pixels) the separate the centres of the legend cirles. If not set, calcualted automatically. (Default - null.)
   * @param {string} opts.legendBaseline - Allows the 'dominant-baseline' CSS property to be set on legend text. (Default - 'central'.)
   * @param {number} opts.legendXoffset - Allows the legend to be positioned precisely. This is the x value in pixels. (Default - 1050.)
   * @param {number} opts.legendYoffset - Allows the legend to be positioned precisely. This is the y value in pixels. (Default - 1150.)* @param {string} opts.axisLeftLabel - Value for labelling left axis. (Default - 'Altitude (m)'.)
   * @param {string} opts.axisBottomLabel - Value for labelling bottom axis. (Default - 'Distance north (km)'.)
   * @param {string} opts.axisLabelFontSize - Font size (pixels) for axist labels. (Default - 10.)
   * @param {string} opts.axisLeft -  If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'tick'.)
   * @param {string} opts.axisRight - If set to 'on' line is drawn without ticks. Any other value results in no axis. (Default - ''.)
   * @param {string} opts.axisTop - If set to 'on' line is drawn without ticks. Any other value results in no axis. (Default - ''.)
   * @param {string} opts.axisBottom - If set to 'on' line is drawn without ticks. If set to 'tick' line and ticks drawn. Any other value results in no axis. (Default - 'tick'.)
   * @param {string | number | null} opts.axisTickFontSize - Sets the font size of the axis values. Will accept any valid SVG font-size units. If not set, uses D3 default. (Default - null.)
   * @param {boolean} opts.yAxisLabelToTop - If set to true the y-axis label is moved to the top of the axis and not rotated. (Default - false.)
   * @param {string | number} opts.lineWidth - Sets the stroke-width of all lines on the chart. Can use any permitted SVG stroke-width units. (Default - 1.)
   * @param {number} opts.duration - The duration of each transition phase in milliseconds. (Default - 1000.)
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick', 'toggle' or 'none'. (Default - 'none'.)
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order is not important.)
   * For each taxon, there is assumed to be a single data item for each rounded distance/altitude combination for which there is a metric value.
   * <ul>
   * <li> <b>taxon</b> - The taxon for which this point refers.
   * <li> <b>distance</b> - The distance north (OS northing) in kilometers rounded down to the nearest 50 km.
   * <li> <b>altitude</b> - The altitude (asl) in metres rounded down to the nearest 100 m.
   * <li> <b>metric</b> - a metric (number) for the given distance and altitude. 
   * </ul>
   * @param {Array.<Object>} opts.ranges - Specifies an array of objects defining ranges for displaying the metrics.
   * Each of the objects in the data array must be sepecified with the properties shown below. (The order affects how they appear in the legend.)
   * <ul>
   * <li> <b>min</b> - The minimum metric value to be included in this range.
   * <li> <b>max</b> - The maximum metric value to be included in this range.
   * <li> <b>radius</b> - The radius of the dot to be drawn for this range.
   * <li> <b>legend</b> - Text for the legend item for this range. 
   * </ul>
   * @param {Array.<string>} opts.taxa - An array of taxa (names), indicating which taxa create charts for. 
   * If empty, graphs for all taxa are created. (Default - [].)
   * @returns {module:altlat~api} api - Returns an API for the chart.
   */

  function altlat() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'altlat-chart' : _ref$elid,
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
        _ref$font = _ref.font,
        font = _ref$font === void 0 ? 'sans-serif' : _ref$font,
        _ref$lineWidth = _ref.lineWidth,
        lineWidth = _ref$lineWidth === void 0 ? 1 : _ref$lineWidth,
        _ref$titleFontSize = _ref.titleFontSize,
        titleFontSize = _ref$titleFontSize === void 0 ? 24 : _ref$titleFontSize,
        _ref$subtitleFontSize = _ref.subtitleFontSize,
        subtitleFontSize = _ref$subtitleFontSize === void 0 ? 16 : _ref$subtitleFontSize,
        _ref$footerFontSize = _ref.footerFontSize,
        footerFontSize = _ref$footerFontSize === void 0 ? 10 : _ref$footerFontSize,
        _ref$legendFontSize = _ref.legendFontSize,
        legendFontSize = _ref$legendFontSize === void 0 ? 10 : _ref$legendFontSize,
        _ref$showLegend = _ref.showLegend,
        showLegend = _ref$showLegend === void 0 ? true : _ref$showLegend,
        _ref$legendSpacing = _ref.legendSpacing,
        legendSpacing = _ref$legendSpacing === void 0 ? null : _ref$legendSpacing,
        _ref$axisLeftLabel = _ref.axisLeftLabel,
        axisLeftLabel = _ref$axisLeftLabel === void 0 ? 'Altitude (m)' : _ref$axisLeftLabel,
        _ref$axisBottomLabel = _ref.axisBottomLabel,
        axisBottomLabel = _ref$axisBottomLabel === void 0 ? 'Distance north (km)' : _ref$axisBottomLabel,
        _ref$axisLabelFontSiz = _ref.axisLabelFontSize,
        axisLabelFontSize = _ref$axisLabelFontSiz === void 0 ? 10 : _ref$axisLabelFontSiz,
        _ref$axisTickFontSize = _ref.axisTickFontSize,
        axisTickFontSize = _ref$axisTickFontSize === void 0 ? null : _ref$axisTickFontSize,
        _ref$yAxisLabelToTop = _ref.yAxisLabelToTop,
        yAxisLabelToTop = _ref$yAxisLabelToTop === void 0 ? false : _ref$yAxisLabelToTop,
        _ref$legendBaseline = _ref.legendBaseline,
        legendBaseline = _ref$legendBaseline === void 0 ? 'central' : _ref$legendBaseline,
        _ref$legendXoffset = _ref.legendXoffset,
        legendXoffset = _ref$legendXoffset === void 0 ? 1050 : _ref$legendXoffset,
        _ref$legendYoffset = _ref.legendYoffset,
        legendYoffset = _ref$legendYoffset === void 0 ? 1150 : _ref$legendYoffset,
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
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 1000 : _ref$duration,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'none' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data,
        _ref$taxa = _ref.taxa,
        taxa = _ref$taxa === void 0 ? [] : _ref$taxa,
        _ref$ranges = _ref.ranges,
        ranges = _ref$ranges === void 0 ? [] : _ref$ranges;

    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).style('position', 'relative').style('display', 'inline');
    var svg = mainDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem({}, false);
      }
    });
    var svgChart = svg.append('svg').attr('class', 'mainChart brc-chart-altlat'); // Value scales

    var xScale = d3.scaleLinear().domain([0, 1250]).range([0, width]);
    var yScale = d3.scaleLinear().domain([0, 1200]).range([height, 0]);
    makeChart().then(function () {
      // Texts must come after chartbecause 
      // the chart width is required
      var textWidth = Number(svg.select('.mainChart').attr("width"));
      makeText(title, 'titleText', titleFontSize, titleAlign, textWidth, svg);
      makeText(subtitle, 'subtitleText', subtitleFontSize, subtitleAlign, textWidth, svg);
      makeText(footer, 'footerText', footerFontSize, footerAlign, textWidth, svg);
      positionMainElements(svg, expand);
      svg.selectAll('rect, path, line').style('stroke-width', lineWidth);
    });

    function makeChart() {
      // If taxa for graphs not set, set to all in dataset
      if (!taxa.length) {
        taxa = data.map(function (d) {
          return d.taxon;
        }).filter(function (v, i, a) {
          return a.indexOf(v) === i;
        });
      }

      var subChartPad = 10;
      var pSvgsTaxa = taxa.map(function (t) {
        return makeAltLat(t);
      });
      return Promise.all(pSvgsTaxa).then(function (svgsTaxa) {
        var subChartWidth = Number(svgsTaxa[0].attr("width"));
        var subChartHeight = Number(svgsTaxa[0].attr("height"));
        svgsTaxa.forEach(function (svgTaxon, i) {
          var col = i % perRow;
          var row = Math.floor(i / perRow);
          svgTaxon.attr("x", col * (subChartWidth + subChartPad));
          svgTaxon.attr("y", row * (subChartHeight + subChartPad));
        });
        svgChart.attr("width", perRow * (subChartWidth + subChartPad));
        svgChart.attr("height", Math.ceil(svgsTaxa.length / perRow) * (subChartHeight + subChartPad));
      });
    }

    function makeAltLat(taxon) {
      // Filter out any empty rows
      data = data.filter(function (d) {
        return d.metric !== 0;
      }); // Top axis

      var tAxis;

      if (axisTop === 'on') {
        tAxis = d3.axisTop().scale(xScale) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0);
      } // Bottom axis


      var bAxis;

      if (axisBottom === 'on' || axisBottom === 'tick') {
        var tickVals = axisBottom === 'tick' ? [200, 400, 600, 800, 1000, 1200] : [];
        bAxis = d3.axisBottom().scale(xScale).tickValues(tickVals) // km north
        .tickFormat(d3.format("d")).tickSizeOuter(0);
      } // Left axis


      var lAxis;

      if (axisLeft === 'on' || axisLeft === 'tick') {
        var _tickVals = axisLeft === 'tick' ? [200, 400, 600, 800, 1000, 1200] : [];

        lAxis = d3.axisLeft().scale(yScale).tickValues(_tickVals) // m above sea level
        .tickFormat(d3.format("d")).tickSizeOuter(0);
      } // right axis


      var rAxis;

      if (axisRight === 'on') {
        rAxis = d3.axisRight().scale(yScale) // Actual scale doesn't matter, but needs one
        .tickValues([]).tickSizeOuter(0);
      } // Create or get the relevant chart svg


      var init, svgAltLat, gAltLat;

      if (taxa.length === 1 && svgChart.selectAll('.brc-chart-altlat').size() === 1) {
        svgAltLat = svgChart.select('.brc-chart-altlat');
        gAltLat = svgAltLat.select('.brc-chart-altlat-g');
        init = false;
      } else if (svgChart.select("#".concat(safeId(taxon))).size()) {
        svgAltLat = svgChart.select("#".concat(safeId(taxon)));
        gAltLat = svgAltLat.select('.brc-chart-altlat-g');
        init = false;
      } else {
        svgAltLat = svgChart.append('svg').classed('brc-chart-altlat', true).attr('id', safeId(taxon)).style('overflow', 'visible');
        gAltLat = svgAltLat.append('g').classed('brc-chart-altlat-g', true);
        init = true;
      }

      var backSquareWidth = xScale(50);
      var backSquareHeight = height - yScale(100); // Create the background squares

      gAltLat.selectAll("rect").data(backData).join(function (enter) {
        return enter.append("rect").attr('width', backSquareWidth).attr('height', backSquareHeight).attr('stroke', 'black').attr('stroke-width', 0.5).attr('fill', function (d) {
          if (d[1] < 200) {
            return 'white';
          }

          if (d[1] < 400) {
            return '#CCE192';
          }

          if (d[1] < 600) {
            return '#AED367';
          }

          if (d[1] < 800) {
            return '#ECDA49';
          }

          if (d[1] < 1000) {
            return '#D9A738';
          }

          return '#BE8D66';
        }).attr('y', function (d) {
          return yScale(d[1]) - backSquareHeight;
        }).attr('x', function (d) {
          return xScale(d[0]);
        });
      }); // Create the metric circles

      var t = svgAltLat.transition().duration(duration);
      var mainTrans = gAltLat.selectAll(".brc-altlat-metric-circle").data(data, function (d) {
        return "".concat(d.distance, "-").concat(d.altitude);
      }).join(function (enter) {
        return enter.append("circle").attr("r", 0).attr("cx", function (d) {
          return xScale(d.distance + 25);
        }).attr("cy", function (d) {
          return yScale(d.altitude + 50);
        });
      }, function (update) {
        return update;
      }, function (exit) {
        return exit.call(function (exit) {
          return exit.transition(t).attr("r", 0).remove();
        });
      }).attr("class", function (d) {
        return "brc-altlat-metric-circle brc-altlat brc-altlat-".concat(getRadius(d.metric));
      }).transition(t) // The selection returned by the join function is the merged
      // enter and update selections
      .attr("r", function (d) {
        return xScale(getRadius(d.metric));
      });
      addEventHandlers(gAltLat.selectAll(".brc-altlat-metric-circle"));

      if (init) {
        // Constants for positioning
        var axisLeftPadX = margin.left ? margin.left : 0;
        var axisRightPadX = margin.right ? margin.right : 0;
        var axisBottomPadY = margin.bottom ? margin.bottom : 0;
        var axisTopPadY = margin.top ? margin.top : 0; // Taxon title

        if (showTaxonLabel) {
          var taxonLabel = svgAltLat.append('text').classed('brc-chart-altlat-label', true).text(taxon).style('font-family', font).style('font-size', taxonLabelFontSize).style('font-style', taxonLabelItalics ? 'italic' : '');
          var labelHeight = taxonLabel.node().getBBox().height;
          taxonLabel.attr("transform", "translate(".concat(axisLeftPadX, ", ").concat(labelHeight, ")"));
        } // Size SVG


        svgAltLat.attr('width', width + axisLeftPadX + axisRightPadX).attr('height', height + axisBottomPadY + axisTopPadY); // Position chart and legend

        gAltLat.attr("transform", "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")")); // Create axes and position within SVG

        var leftYaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")"); //const leftYaxisLabelTrans = `translate(${axisLabelFontSize},${axisTopPadY + height/2}) rotate(270)`

        var leftYaxisLabelTrans;

        if (yAxisLabelToTop) {
          leftYaxisLabelTrans = "translate(0,0)";
        } else {
          leftYaxisLabelTrans = "translate(0,".concat(axisTopPadY + height / 2, ") rotate(270)");
        }

        var rightYaxisTrans = "translate(".concat(axisLeftPadX + width, ", ").concat(axisTopPadY, ")");
        var topXaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY, ")");
        var bottomXaxisTrans = "translate(".concat(axisLeftPadX, ",").concat(axisTopPadY + height, ")");
        var bottomXaxisLabelTrans = "translate(".concat(axisLeftPadX + width / 2, ",  ").concat(height + axisTopPadY + axisBottomPadY, ")"); // Create axes and position within SVG

        if (lAxis) {
          var gLaxis = svgAltLat.append("g").style('font-family', font).style('font-size', axisTickFontSize).call(lAxis);
          gLaxis.attr("transform", leftYaxisTrans);
        }

        if (bAxis) {
          var gBaxis = svgAltLat.append("g").style('font-family', font).style('font-size', axisTickFontSize).call(bAxis);
          gBaxis.attr("transform", bottomXaxisTrans);
        }

        if (tAxis) {
          var gTaxis = svgAltLat.append("g").style('font-family', font).style('font-size', axisTickFontSize).call(tAxis);
          gTaxis.attr("transform", topXaxisTrans);
        }

        if (rAxis) {
          var gRaxis = svgAltLat.append("g").style('font-family', font).style('font-size', axisTickFontSize).call(rAxis);
          gRaxis.attr("transform", rightYaxisTrans);
        }

        var tYaxisLabel = svgAltLat.append("text").style("text-anchor", yAxisLabelToTop ? "left" : "middle").style('font-size', axisLabelFontSize).style('font-family', font).style('dominant-baseline', 'hanging').text(axisLeftLabel);
        tYaxisLabel.attr("transform", leftYaxisLabelTrans);
        var tXaxisLabel = svgAltLat.append("text").style("text-anchor", "middle").style('font-size', axisLabelFontSize).style('font-family', font).text(axisBottomLabel);
        tXaxisLabel.attr("transform", bottomXaxisLabelTrans);
      } else if (taxa.length === 1) {
        // Update taxon label
        if (showTaxonLabel) {
          svgAltLat.select('.brc-chart-altlat-label').text(taxon);
        }
      } // Make the legend


      var pLegend;

      if (showLegend) {
        pLegend = makeLegend(gAltLat);
      } else {
        pLegend = Promise.resolve();
      } // Return a promise which resolves to the svg when transitions complete


      return new Promise(function (resolve) {
        var pTrans = [pLegend];
        transPromise(mainTrans, pTrans);
        Promise.allSettled(pTrans).then(function () {
          resolve(svgAltLat);
        }); //.catch(e => console.log(e))
      });
    }

    function makeLegend(gAltLat) {
      var items = ranges.map(function (r) {
        return {
          text: r.legend,
          radiusTrans: xScale(r.radius),
          radius: r.radius
        };
      });
      var maxRadius = Math.max.apply(Math, _toConsumableArray(items.map(function (i) {
        return i.radiusTrans;
      })));
      var spacing;

      if (legendSpacing) {
        spacing = legendSpacing;
      } else {
        spacing = maxRadius * 2.2;
      }

      var xOffset = xScale(legendXoffset);
      var yOffset = yScale(legendYoffset);
      var t = gAltLat.transition().duration(duration);
      var lt = gAltLat.selectAll('.brc-altlat-legend-item-text').data(items, function (i) {
        return safeId(i.text);
      }).join(function (enter) {
        var text = enter.append("text").text(function (i) {
          return i.text;
        }).style('font-family', font).style('font-size', legendFontSize).style('dominant-baseline', legendBaseline).attr('x', xOffset + maxRadius * 1.3).attr('y', function (i, j) {
          return yOffset + spacing * j;
        }).style('opacity', 0);
        return text;
      }, function (update) {
        return update;
      }).attr("class", function (i) {
        return "brc-altlat-legend-item-text brc-altlat brc-altlat-".concat(i.radius);
      });
      var ls = gAltLat.selectAll('.brc-altlat-legend-item-circle').data(items, function (i) {
        return safeId(i.text);
      }).join(function (enter) {
        var swatches = enter.append("circle").attr('r', 0).attr('cx', xOffset).attr('cy', function (i, j) {
          return yOffset + spacing * j;
        });
        return swatches;
      }, function (update) {
        return update;
      }).attr("class", function (i) {
        return "brc-altlat-legend-item-circle brc-altlat brc-altlat-".concat(i.radius);
      });
      var textTrans = lt.transition(t).attr('x', xOffset + maxRadius * 1.3).attr('y', function (i, j) {
        return yOffset + spacing * j;
      }).style('opacity', 1);
      var swatchTrans = ls.transition(t).attr('r', function (i) {
        return i.radiusTrans;
      }).attr('cx', xOffset).attr('cy', function (i, j) {
        return yOffset + spacing * j;
      });
      addEventHandlers(ls);
      addEventHandlers(lt);
      var pTrans = [];
      transPromise(swatchTrans, pTrans);
      transPromise(textTrans, pTrans);
      return Promise.allSettled(pTrans);
    }

    function getRadius(metric) {
      for (var i = 0; i < ranges.length; i++) {
        if (metric >= ranges[i].min && metric <= ranges[i].max) {
          return ranges[i].radius;
        }
      }
    }

    function highlightItem(d, highlight) {
      svgChart.selectAll(".brc-altlat").classed('lowlight', false);
      var rad = d.radius ? d.radius : d.metric ? getRadius(d.metric) : null;

      if (highlight && rad) {
        svgChart.selectAll(".brc-altlat").classed('lowlight', true);
        svgChart.selectAll(".brc-altlat-".concat(rad)).classed('lowlight', false);
      }
    }

    function highlightItemToggle(d) {
      var rad = d.radius ? d.radius : d.metric ? getRadius(d.metric) : null;

      if (rad) {
        var lowlighted = svgChart.selectAll(".brc-altlat-".concat(rad)).classed('lowlight');
        svgChart.selectAll(".brc-altlat-".concat(rad)).classed('lowlight', !lowlighted);
      }
    }

    function addEventHandlers(sel) {
      sel.on("mouseover", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d, true);
        }
      }).on("mouseout", function (d) {
        if (interactivity === 'mousemove') {
          highlightItem(d, false);
        }
      }).on("click", function (d) {
        if (interactivity === 'mouseclick') {
          highlightItem(d, true);
          d3.event.stopPropagation();
        }

        if (interactivity === 'toggle') {
          highlightItemToggle(d);
          d3.event.stopPropagation();
        }
      });
    }
    /** @function dataFromTetrads
      * @param {Array.<string>} tetrads
      * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
      * This function takes a single list of tetrad references and returns a promise that resolves to a
      * data object suitable for displaying with the chart.
      */


    function dataFromTetrads(tetrads) {
      var altlatTetrads;

      if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        altlatTetrads = "../dist/altlat-tetrads.csv";
      } else {
        altlatTetrads = "".concat(constants.thisCdn, "/altlat-tetrads.csv");
      }

      return d3.csv(altlatTetrads).then(function (altlat) {
        // To maximise the performance of this function, both the altlat and tetrad arrays
        // are sorted on tetrad name. Then when we loop the tetrad array, when a match is
        // found and the tetrad processed, all the leading tetrads in the altlat list, up
        // to and including the matched tetrad, are removed from the list.
        var altlatSorted = altlat.sort(function (a, b) {
          if (a.tetrad < b.tetrad) {
            return -1;
          }

          if (a.tetrad > b.tetrad) {
            return 1;
          }

          return 0;
        });
        var tetradsSorted = tetrads.sort(function (a, b) {
          if (a.tetrad < b.tetrad) {
            return -1;
          }

          if (a.tetrad > b.tetrad) {
            return 1;
          }

          return 0;
        });
        var groups = [];
        console.time("process tetrads");
        tetradsSorted.forEach(function (t) {
          //const tmi = altlatSorted.findIndex(al => al.tetrad === t)
          // A for loop is faster that the findIndex array method
          var tmi;

          for (var i = 0; i < altlatSorted.length; i++) {
            if (altlatSorted[i].tetrad === t) {
              tmi = i;
              break;
            }
          }

          var tm = altlatSorted[tmi];

          if (tm) {
            var c = getCentroid(t, 'gb');
            var distance = c.centroid[1] / 1000;
            var gDistance = Math.floor(distance / 50) * 50;
            var gAltitude = Math.floor(Math.abs(tm.altMean) / 100) * 100; //Altitudes below zero considered in lowest cat

            var group = groups.find(function (g) {
              return g.distance === gDistance && g.altitude === gAltitude;
            });

            if (group) {
              group.tetrads += 1;
            } else {
              groups.push({
                distance: gDistance,
                altitude: gAltitude,
                tetrads: 1
              });
            }
          } // Remove all tetrads from the altlat array up to and including the matched tetrad
          // to speed up subsequent searches.


          altlatSorted.splice(0, tmi + 1);
        });
        console.timeEnd("process tetrads"); // Convert the tetrad counts to a proportion of all tetrads in group

        var pgroupss = groups.map(function (g) {
          var backSquare = backData.find(function (bd) {
            return g.distance === bd[0] && g.altitude === bd[1];
          });
          var totalTetrads = backSquare[2]; //console.log(g.tetrads, totalTetrads)

          return {
            distance: g.distance,
            altitude: g.altitude,
            metric: g.tetrads / totalTetrads * 100,
            taxon: 'dummy'
          };
        });
        return new Promise(function (resolve) {
          resolve(pgroupss);
        });
      });
    }
    /** @function setChartOpts
      * @param {Object} opts - text options.
      * @param {string} opts.title - Title for the chart.
      * @param {string} opts.subtitle - Subtitle for the chart.
      * @param {string} opts.footer - Footer for the chart.
      * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
      * @param {string} opts.subtitleFontSize - Font size (pixels) of chart subtitle.
      * @param {string} opts.footerFontSize - Font size (pixels) of chart footer.
      * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
      * @param {string} opts.subtitleAlign - Alignment of chart subtitle: either 'left', 'right' or 'centre'.
      * @param {string} opts.footerAlign - Alignment of chart footer: either 'left', 'right' or 'centre'.
      * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick', 'toggle' or 'none'. (Default - 'none'.)
      * @param {Array.<Object>} opts.data - Specifies an array of data objects (see main interface for details).
      * @param {Array.<Object>} opts.ranges - Specifies an array of objects defining ranges for displaying the metrics (see main interface for details).
      * @returns {Promise} promise resolves when all transitions complete.
      * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
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

      if ('interactivity' in opts) {
        interactivity = opts.interactivity;
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

      if ('ranges' in opts) {
        ranges = opts.ranges;
        remakeChart = true;
      }

      if (remakeChart) {
        return makeChart().then(function () {
          positionMainElements(svg, expand);
        });
      } else {
        return Promise.resolve();
      }
    }
    /** @function setTaxon
      * @param {string} taxon - The taxon to display.
      * @returns {Promise} promise resolves when all transitions complete.
      * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
      * This allows you to change the taxon displayed.
      */


    function setTaxon(taxon) {
      if (taxa.length !== 1) {
        console.log("You can only use the setTaxon method when your chart displays a single taxon.");
      } else {
        taxa = [taxon];
        highlightItem({}, false);
        return makeChart();
      }
    }
    /** @function getChartWidth
      * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
      * Return the full width of the chart svg.
      */


    function getChartWidth() {
      return svg.attr("width") ? svg.attr("width") : svg.attr("viewBox").split(' ')[2];
    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
      * Return the full height of the chart svg.
      */


    function getChartHeight() {
      return svg.attr("height") ? svg.attr("height") : svg.attr("viewBox").split(' ')[3];
    }
    /** @function saveImage
      * @param {boolean} asSvg - If true, file is generated as SVG, otherwise PNG.
      * @param {string} filename - Name of the file (without extension) to generate and download.
      * If the filename is falsey (e.g. blank), it will not automatically download the
      * file. (Allows caller to do something else with the data URL which is returned
      * as the promise's resolved value.)
      * @returns {Promise} promise object represents the data URL of the image.
      * @description <b>This function is exposed as a method on the API returned from the altlat function</b>.
      * Download the chart as an image file.
      */


    function saveImage(asSvg, filename) {
      return saveChartImage(svg, expand, asSvg, filename);
    }
    /**
     * @typedef {Object} api
     * @property {module:altlat~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:altlat~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:altlat~setChartOpts} setChartOpts - Sets text options for the chart. 
     * @property {module:altlat~setTaxon} setTaxon - Changes the displayed taxon for single taxon charts. 
     * @property {module:altlat~dataFromTetrads} dataFromTetrads - Generates data in the format required for the chart from a raw list of tetrad references. 
     * @property {module:altlat~saveImage} saveImage - Generates and downloads and image file for the SVG. 
     */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartOpts: setChartOpts,
      setTaxon: setTaxon,
      dataFromTetrads: dataFromTetrads,
      saveImage: saveImage
    };
  }

  var name = "brc-d3";
  var version = "0.16.1";
  var description = "Javscript library for various D3 visualisations of biological record data.";
  var type = "module";
  var main = "dist/brccharts.umd.js";
  var browser = "dist/brccharts.umd.js";
  var browsermin = "dist/brccharts.min.umd.js";
  var scripts = {
  	lint: "npx eslint src",
  	test: "jest",
  	build: "rollup --config",
  	docs: "jsdoc ./src/ --recurse -R README.md -d ./docs/api"
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
  	"brc-atlas-bigr": "^2.2.2",
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
  	jest: "^27.2.5",
  	rollup: "^2.23.0",
  	"rollup-plugin-css-only": "^2.1.0",
  	"rollup-plugin-eslint": "^4.0.0",
  	"rollup-plugin-terser": "^6.1.0"
  };
  var pkg = {
  	name: name,
  	version: version,
  	description: description,
  	type: type,
  	main: main,
  	browser: browser,
  	browsermin: browsermin,
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
  exports.altlat = altlat;
  exports.bar = bar;
  exports.density = density;
  exports.links = links;
  exports.phen1 = phen1;
  exports.phen2 = phen2;
  exports.pie = pie;
  exports.trend = trend;
  exports.trend2 = trend2;
  exports.trend3 = trend3;
  exports.yearly = yearly;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
