(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.brccharts = {}, global.d3));
}(this, (function (exports, d3) { 'use strict';

  //import * as d3 from 'd3'
  function testData() {
    return new Promise(function (resolve) {
      resolve({
        meta: {
          title: 'FIT Counts: insects counted on hawthorn flowers 2017 to 2020'
        },
        data: [{
          name: "bumblebees",
          number: 3,
          colour: '#5A99D3'
        }, {
          name: "honeybees",
          number: 10,
          colour: '#EB7C30'
        }, {
          name: "solitary bees",
          number: 7,
          colour: '#A3A3A3'
        }, {
          name: "wasps",
          number: 4,
          colour: '#FFBF00'
        }, {
          name: "hoverflies",
          number: 12,
          colour: '#4472C3'
        }, {
          name: "other flies",
          number: 34,
          colour: '#70AB46'
        }, {
          name: "butterflies & moths",
          number: 1,
          colour: '#1F5380'
        }, {
          name: "beetles",
          number: 6,
          colour: '#9D480E'
        }, {
          name: "small insects",
          number: 17,
          colour: '#626262'
        }, {
          name: "other insects",
          number: 6,
          colour: '#977200'
        }]
      });
    });
  }
  /** @constant
  * @description This object has properties corresponding to a number of data access
  * functions that can be used to load data provided in standard formats.
  *  @type {object}
  */


  var dataAccessors = {
    'test': testData
  };

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

  //https://github.com/d3/d3-shape/blob/v2.0.0/README.md#pie

  /** 
   * @param {Object} opts - Initialisation options.
   * @param {string} opts.selector - The CSS selector of the element which will be the parent of the SVG.
   * @param {string} opts.elid - The id for the dom object created.
   * @param {number} opts.radius - The desired radius of the chart in pixels.
   * @param {number} opts.innerRadius - The desired inner radius of the chart in pixels. Default of zero gives a pie char. Specify a value for donut chart.
   * @param {string} opts.sort - Sort function. Set to 'asc' for ascending, 'desc' for descending or '' for no sort.
   * @param {string} opts.label - How to label sections. Set to 'value' for raw number, 'percent' for percentage or '' for no sort.
   * @param {string} opts.labelFontSize - Set to a font size (pixels).
   * @param {string} opts.labelColour - Specifies the colour of label text.
   * @param {boolean} opts.expand - Indicates whether or not the chart will expand to fill parent element.
   * @param {string} opts.backgroundFill - Specifies the background colour of the chart.
   * @param {string} opts.legendSwatchSize - Specifies the size of legend swatches.
   * @param {string} opts.legendSwatchGap - Specifies the size of gap between legend swatches.
   * @param {string} opts.title - Title for the chart.
   * @param {string} opts.titleFontSize - Font size (pixels) of chart title.
   * @param {string} opts.titleAlign - Alignment of chart title: either 'left', 'right' or 'centre'.
   * @param {string} opts.interactivity - Specifies how item highlighting occurs. Can be 'mousemove', 'mouseclick' or 'none'.
   * @param {Array.<Object>} opts.data - Specifies an array of data objects.
   * @returns {module:pie~api} api - Returns an API for the map.
   */

  function pie() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? 'body' : _ref$selector,
        _ref$elid = _ref.elid,
        elid = _ref$elid === void 0 ? 'piechart' : _ref$elid,
        _ref$radius = _ref.radius,
        radius = _ref$radius === void 0 ? 200 : _ref$radius,
        _ref$innerRadius = _ref.innerRadius,
        innerRadius = _ref$innerRadius === void 0 ? 0 : _ref$innerRadius,
        _ref$sort = _ref.sort,
        sort = _ref$sort === void 0 ? '' : _ref$sort,
        _ref$label = _ref.label,
        label = _ref$label === void 0 ? '' : _ref$label,
        _ref$labelFontSize = _ref.labelFontSize,
        labelFontSize = _ref$labelFontSize === void 0 ? 10 : _ref$labelFontSize,
        _ref$labelColour = _ref.labelColour,
        labelColour = _ref$labelColour === void 0 ? 'black' : _ref$labelColour,
        _ref$expand = _ref.expand,
        expand = _ref$expand === void 0 ? false : _ref$expand,
        _ref$legendSwatchSize = _ref.legendSwatchSize,
        legendSwatchSize = _ref$legendSwatchSize === void 0 ? 30 : _ref$legendSwatchSize,
        _ref$legendSwatchGap = _ref.legendSwatchGap,
        legendSwatchGap = _ref$legendSwatchGap === void 0 ? 10 : _ref$legendSwatchGap,
        _ref$title = _ref.title,
        title = _ref$title === void 0 ? '' : _ref$title,
        _ref$titleFontSize = _ref.titleFontSize,
        titleFontSize = _ref$titleFontSize === void 0 ? 24 : _ref$titleFontSize,
        _ref$titleAlign = _ref.titleAlign,
        titleAlign = _ref$titleAlign === void 0 ? 'left' : _ref$titleAlign,
        _ref$imageWidth = _ref.imageWidth,
        imageWidth = _ref$imageWidth === void 0 ? 150 : _ref$imageWidth,
        _ref$interactivity = _ref.interactivity,
        interactivity = _ref$interactivity === void 0 ? 'mousemove' : _ref$interactivity,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? [] : _ref$data;

    var duration = 1000; // (parameterise)
    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).attr('class', 'brc-chart-pie').style('position', 'relative').style('display', 'inline');
    var chartDiv = mainDiv.append('div');
    var svg = chartDiv.append('svg');
    svg.on("click", function () {
      if (interactivity === 'mouseclick') {
        highlightItem(null, false);
      }
    });
    var svgPie;
    var svgLegend = makeLegend(data, svg);
    setChartData(data, true);
    console.log("pie is made");
    var imgSelected = makeImage(svg); // Title must come after chart and legend because the 
    // width of those is required to do wrapping for title

    var svgTitle = makeTitle();
    positionElements();

    function positionElements() {
      var width = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"));
      svgLegend.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap);
      svgPie.attr("x", Number(svgLegend.attr("width")) + legendSwatchGap);
      svgPie.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap);
      var height = Number(svgTitle.attr("height")) + 2 * legendSwatchGap + Math.max(Number(svgLegend.attr("height")), Number(svgPie.attr("height")));

      if (expand) {
        svg.attr("viewBox", "0 0 " + width + " " + height);
      } else {
        svg.attr("width", width);
        svg.attr("height", height);
      }
    }

    function makeTitle() {
      var svgTitle;

      if (svg.select('.brc-chart-title').size()) {
        svgTitle = svg.select('.brc-chart-title');
      } else {
        svgTitle = svg.append('svg').classed('brc-chart-title', true);
      }

      var chartWidth = Number(svgLegend.attr("width")) + legendSwatchGap + Number(svgPie.attr("width"));
      var lines = wrapText(title, svgTitle, chartWidth);
      var uTitleText = svgTitle.selectAll('.titleText').data(lines);
      uTitleText.enter().append('text').text(function (d) {
        return d;
      }).attr("class", "titleText").style('font-size', titleFontSize);
      uTitleText.exit().remove();
      var height = d3.select('.titleText').node().getBBox().height;
      var widths = d3.selectAll('.titleText').nodes().map(function (n) {
        return n.getBBox().width;
      });
      svgTitle.selectAll('.titleText').attr('y', function (d, i) {
        return (i + 1) * height;
      }).attr('x', function (d, i) {
        if (titleAlign === 'centre') {
          return (chartWidth - widths[i]) / 2;
        } else if (titleAlign === 'right') {
          return chartWidth - widths[i];
        } else {
          return 0;
        }
      });
      svgTitle.attr("height", height * lines.length);
      return svgTitle;
    }

    function makeLegend(data, svg) {
      var svgLegend = svg.append('svg');
      var uLegendSwatch = svgLegend.selectAll('.legendSwatch').data(data);
      var eLegendSwatch = uLegendSwatch.enter().append('rect');
      addEventHandlers(eLegendSwatch);
      eLegendSwatch.merge(uLegendSwatch).attr('id', function (d, i) {
        return "swatch-".concat(i);
      }).attr("class", "legendSwatch").attr('y', function (d, i) {
        return i * (legendSwatchSize + legendSwatchGap);
      }).attr('width', legendSwatchSize).attr('height', legendSwatchSize).style('fill', function (d) {
        return d.colour;
      });
      uLegendSwatch.exit().remove();
      var uLegendText = svgLegend.selectAll('.legendText').data(data);
      var eLegendText = uLegendText.enter().append('text');
      addEventHandlers(eLegendText);
      eLegendText.merge(uLegendText).text(function (d) {
        return d.name;
      }).attr('id', function (d, i) {
        return "legend-".concat(i);
      }).attr("class", "legendText").attr('x', function () {
        return legendSwatchSize + legendSwatchGap;
      }).style('font-size', labelFontSize);
      uLegendText.exit().remove();
      var legendTextWidth = d3.max(d3.selectAll('.legendText').nodes(), function (n) {
        return n.getBBox().width;
      });
      var legendTextHeight = d3.max(d3.selectAll('.legendText').nodes(), function (n) {
        return n.getBBox().height;
      }); // Prevent code failures if no data specified

      legendTextWidth = legendTextWidth ? legendTextWidth : 0;
      legendTextHeight = legendTextHeight ? legendTextHeight : 0; // We delay setting vertical position of legend text until we know the text height so that
      // we can centre with swatch

      svgLegend.selectAll('.legendText').data(data).attr('y', function (d, i) {
        return (i + 1) * (legendSwatchSize + legendSwatchGap) - legendSwatchSize / 2 - legendTextHeight / 4;
      });
      svgLegend.attr("width", legendSwatchSize + legendSwatchGap + legendTextWidth);
      var legendHeight = data.length * (legendSwatchSize + legendSwatchGap) - legendSwatchGap;
      svgLegend.attr("height", legendHeight > 0 ? legendHeight : 0);
      return svgLegend;
    }

    function makePie(piedata, duration, delay) {
      var svgPie, gPie;

      if (svg.select('.brc-chart-pie').size()) {
        svgPie = svg.select('.brc-chart-pie');
        gPie = svgPie.select('g');
      } else {
        svgPie = svg.append('svg').classed('brc-chart-pie', true).attr('width', 2 * radius).attr('height', 2 * radius);
        gPie = svgPie.append('g').attr('transform', "translate(".concat(radius, " ").concat(radius, ")"));
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

      var arcs = d3.pie().value(function (d) {
        return d.number;
      }).sortValues(fnSort)(piedata);
      console.log('arcs', arcs);
      var arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius); // Code for arcTween from https://bl.ocks.org/mbostock/1346410
      // Store the displayed angles in _current.
      // Then, interpolate from _current to the new angles.
      // During the transition, _current is updated in-place by d3.interpolate.

      function arcTween(arc) {
        console.log(arc);
        var i = d3.interpolate(this._current, arc);
        var rad0 = innerRadius;
        var rad1 = innerRadius + (radius - innerRadius) / 2;
        var rad2 = radius;
        var iRad_0_2 = d3.interpolate(rad0, rad2);
        var iRad_2_0 = d3.interpolate(rad2, rad0);
        var iRad_2_1 = d3.interpolate(rad2, rad1);
        var iRad_0_1 = d3.interpolate(rad0, rad1);
        this._current = i(0);
        return function (t) {
          //arcGenerator.outerRadius(arc.index%2 == 0 ? radius * 0.9 : radius) 
          //arcGenerator.outerRadius(iRad(t)) 
          //arcGenerator.outerRadius(arc.data.delete ? innerRadius : radius) 
          if (arc.data.sliceType === 'delete') {
            if (arc.data.pieRing === 'full') {
              arcGenerator.outerRadius(iRad_2_0(t));
              arcGenerator.innerRadius(rad0);
            } else {
              arcGenerator.outerRadius(iRad_2_1(t));
              arcGenerator.innerRadius(iRad_0_1(t));
            }
          } else if (arc.data.sliceType === 'deleted') {
            if (arc.data.pieRing === 'full') {
              arcGenerator.outerRadius(rad0);
              arcGenerator.innerRadius(rad0);
            } else {
              arcGenerator.outerRadius(rad1);
              arcGenerator.innerRadius(rad1);
            }
          } else if (arc.data.sliceType === 'changed') {
            if (arc.data.pieRing === 'full') {
              arcGenerator.outerRadius(rad2);
              arcGenerator.innerRadius(rad0);
            } //} else if (arc.data.sliceType === 'retained') {
            //   arcGenerator.outerRadius(radius)
            //   arcGenerator.innerRadius(iInnerRad_1(t)) 

          } else if (arc.data.sliceType === 'new') {
            arcGenerator.outerRadius(iRad_0_2(t));
            arcGenerator.innerRadius(innerRadius);
          } else {
            arcGenerator.outerRadius(radius);
            arcGenerator.innerRadius(innerRadius);
          }

          return arcGenerator(i(t));
        };
      }

      function centroidTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) {
          return "translate(".concat(arcGenerator.centroid(i(t)), ")");
        };
      } // map to data


      var uPie = gPie.selectAll('path').data(arcs, function (d) {
        return d.data.name;
      });
      var ePie = uPie.enter().append('path').attr('id', function (d, i) {
        return "pie-".concat(i);
      }).attr('stroke', 'white').style('stroke-width', '2px').style('opacity', 1).attr('fill', function (d) {
        return d.data.colour;
      });
      addEventHandlers(ePie);

      if (duration) {
        ePie.merge(uPie).transition().delay(delay).duration(duration).attrTween('d', arcTween);
      } else {
        ePie.merge(uPie).attr('d', function (a) {
          this._current = a;
          arcGenerator(a);
        });
      }

      uPie.exit().remove();

      if (label) {
        var uPieLabels = gPie.selectAll('.labelsPie').data(arcs);
        var total = piedata.reduce(function (t, c) {
          return t + c.number;
        }, 0);
        var ePieLabels = uPieLabels.enter().append('text').attr("class", "labelsPie").style('text-anchor', 'middle').style('font-size', labelFontSize).style('fill', labelColour);
        addEventHandlers(ePieLabels);
        ePieLabels.merge(uPieLabels).text(function (d) {
          if (label === 'value') {
            return d.data.number;
          } else if (label === 'percent') {
            return "".concat(Math.round(d.data.number / total * 100), "%");
          }
        }) //.attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
        .transition().delay(delay).duration(duration).attrTween('transform', centroidTween);
        uPieLabels.exit().remove();
      }

      return svgPie;
    }

    function makeImage(svg) {
      var img = svg.append('image').classed('brc-item-image-hide', true) //.attr('xlink:href', 'images/Bumblebees.png')
      .attr('width', imageWidth);
      return img;
    }

    function wrapText(text, svgTitle, maxWidth) {
      var textSplit = text.split(" ");
      var lines = [''];
      var line = 0;

      for (var i = 0; i < textSplit.length; i++) {
        var workingText = "".concat(lines[line], " ").concat(textSplit[i]);
        workingText = workingText.trim();
        var txt = svgTitle.append('text').text(workingText).style('font-size', titleFontSize);
        var width = txt.node().getBBox().width;

        if (width > maxWidth) {
          line++;
          lines[line] = textSplit[i];
        } else {
          lines[line] = workingText;
        }

        txt.remove();
      }

      return lines;
    }

    function addEventHandlers(sel) {
      sel.on("mouseover", function (d, i) {
        if (interactivity === 'mousemove') {
          highlightItem(i, true);
        }
      }).on("mouseout", function (d, i) {
        if (interactivity === 'mousemove') {
          highlightItem(i, false);
        }
      }).on("click", function (d, i) {
        if (interactivity === 'mouseclick') {
          highlightItem(i, true);
          d3.event.stopPropagation();
        }
      });
    }

    function highlightItem(i, show) {
      if (show) {
        svg.selectAll('path').classed('brc-lowlight', true);
        svg.selectAll('.legendSwatch').classed('brc-lowlight', true);
        svg.selectAll('.legendText').classed('brc-lowlight', true);
        svg.select("#swatch-".concat(i)).classed('brc-lowlight', false);
        svg.select("#legend-".concat(i)).classed('brc-lowlight', false);
        svg.select("#pie-".concat(i)).classed('brc-lowlight', false);

        if (data[i].image) {
          // Loading image into SVG and setting to specified width
          // and then querying bbox returns zero height. So in order
          // to get the height of the image (required for correct)
          // positioning, it is necessary first to load the image and
          // get the dimensions.
          if (data[i].imageHeight) {
            if (imgSelected.attr('xlink:href') !== data[i].image) {
              // The loaded image is different from that of the
              // highlighted item, so load.
              loadImage(data[i]);
            }

            imgSelected.classed('brc-item-image-hide', false);
          } else {
            var img = new Image();

            img.onload = function () {
              data[i].imageWidth = imageWidth;
              data[i].imageHeight = imageWidth * this.height / this.width;
              loadImage(data[i]);
            };

            img.src = 'images/Bumblebees.png';
            imgSelected.classed('brc-item-image-hide', false);
          }
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
      imgSelected.attr("y", Number(svgTitle.attr("height")) + 2 * legendSwatchGap + radius - d.imageHeight / 2);
    }

    function cloneData(data) {
      return data.map(function (d) {
        return _objectSpread2({}, d);
      });
    }
    /** @function setChartTitle
      * @param {string} text - text for chart title.
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Set's the value of the chart title.
      */


    function setChartTitle(text) {
      title = text;
      makeTitle();
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
    /** @function setChartData
      * @param {Array.<Object>} opts.data - Specifies an array of data objects.
      * @description <b>This function is exposed as a method on the API returned from the pie function</b>.
      * Set's the data array to be bound to the chart.
      */


    function setChartData(newData, init) {
      var oldNames = data.map(function (d) {
        return d.name;
      });
      var newNames = newData.map(function (d) {
        return d.name;
      });
      var deletedNames = oldNames.filter(function (d) {
        return !newNames.includes(d);
      });
      var insertedNames = newNames.filter(function (d) {
        return !oldNames.includes(d);
      });
      console.log('oldNames', oldNames);
      console.log('newNames', newNames);
      console.log('deletedNames', deletedNames);
      console.log('insertedNames', insertedNames);
      var inserted = insertedNames.length > 0;
      var deleted = deletedNames.length > 0;

      if (init) {
        console.log('init');
        var d0 = cloneData(newData);
        d0.forEach(function (d) {
          d.sliceType = 'new';
          d.pieRing = 'full';
        });
        svgPie = makePie(d0, duration, 0);
      } else if (!inserted && !deleted) {
        console.log('!inserted && !deleted');

        var _d = cloneData(newData);

        _d.forEach(function (d) {
          d.sliceType = 'changed';
          d.pieRing = 'full';
        });

        makePie(_d, duration, 0);
      } else if (deleted && !inserted) {
        console.log('deleted && !inserted');

        var _d2 = cloneData(data);

        _d2.forEach(function (d) {
          if (newNames.includes(d.name)) {
            d.sliceType = 'unchanged';
          } else {
            d.sliceType = 'delete';
          }

          d.pieRing = 'full';
        });

        makePie(_d2, duration, 0);
        var d1 = cloneData(_d2);
        d1.forEach(function (d) {
          if (d.sliceType === 'delete') {
            d.number = 0;
            d.sliceType = 'deleted';
          }
        });
        setTimeout(function () {
          makePie(d1, duration, 0);
        }, duration);
      } else {
        console.log('else...');
      }

      data = newData;
    }
    /**
     * @typedef {Object} api
     * @property {module:pie~getChartWidth} getChartWidth - Gets and returns the current width of the chart.
     * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     * @property {module:pie~setChartTitle} setChartTitle - Sets the title of the chart. 
     * @property {module:pie~setChartData} setChartData - Sets the data for the chart. 
       */


    return {
      getChartHeight: getChartHeight,
      getChartWidth: getChartWidth,
      setChartTitle: setChartTitle,
      setChartData: setChartData
    };
  }

  var name = "brc-d3";
  var version = "0.0.1";
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

  exports.dataAccessors = dataAccessors;
  exports.pie = pie;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
