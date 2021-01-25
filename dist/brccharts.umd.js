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

  /** @module pie */
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
   * @param {Object} opts.accessFns - Sets an object whose properties are data access functions. The property
   * names are the 'keys'.
   * @param {string} opts.accessorKey - Sets the key of the selected data accessor function.
   * @param {string} opts.backgroundFill - Specifies the background colour of the chart.
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
        _ref$accessFns = _ref.accessFns,
        accessFns = _ref$accessFns === void 0 ? dataAccessors : _ref$accessFns,
        _ref$fnKey = _ref.fnKey,
        fnKey = _ref$fnKey === void 0 ? 'test' : _ref$fnKey;

    var mainDiv = d3.select("".concat(selector)).append('div').attr('id', elid).attr('class', 'brc-chart-pie').style('position', 'relative').style('display', 'inline');
    var titleDiv = mainDiv.append('div').attr('class', 'brc-chart-pie-title');
    var legendDiv = mainDiv.append('div').attr('class', 'brc-chart-pie-legend');
    var chartDiv = mainDiv.append('div').attr('class', 'brc-chart-pie-chart');
    accessFns[fnKey]().then(function (odata) {
      makeTitle(odata);
      makeLegend();
      makeChart(odata);
    });

    function makeTitle(odata) {
      var title = titleDiv.append('h4').text(odata.meta.title);
    }

    function makeLegend(odata) {
      var legend = legendDiv.append('h4').text('Legend');
    }

    function makeChart(odata) {
      var width = 2 * radius + 100;
      var height = 2 * radius + 100;
      var svg = chartDiv.append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')'); // Read the data and then create the pie chart
      //fn().then((odata) => {

      console.log(odata);
      var total = odata.data.reduce(function (t, c) {
        return t + c.number;
      }, 0);
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
      }).sortValues(fnSort)(odata.data);
      var arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius);
      console.log(arcs); // map to data

      var u = svg.selectAll('path').data(arcs);
      u.enter().append('path').merge(u).attr('d', arcGenerator).attr('fill', function (d) {
        return d.data.colour;
      }).attr('stroke', 'white').style('stroke-width', '2px').style('opacity', 1);
      u.exit().remove();

      if (label) {
        console.log('label', label);
        var l = svg.selectAll('text').data(arcs);
        l.enter().append('text').text(function (d) {
          if (label === 'value') {
            return d.data.number;
          } else if (label === 'percent') {
            return "".concat(Math.round(d.data.number / total * 100), "%");
          }
        }).attr('transform', function (d) {
          return "translate(".concat(arcGenerator.centroid(d), ")");
        }).style('text-anchor', 'middle').style('font-size', labelFontSize).style('fill', labelColour);
        l.exit().remove();
      } //})

    }
    /** @function getChartHeight
      * @description <b>This function is exposed as a method on the API returned from the svgMap function</b>.
      * Return the blah.
      */


    function getChartHeight() {
      //todo
      return height;
    }
    /**
     * @typedef {Object} api
     * @property {module:pie~getChartHeight} getChartHeight - Gets and returns the current height of the chart. 
     */


    return {
      getChartHeight: getChartHeight
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
