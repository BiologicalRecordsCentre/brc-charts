//import * as d3 from 'd3'

function testData() {
  return new Promise(function (resolve) {
    resolve ({
      meta: {
        title: 'FIT Counts: insects counted on hawthorn flowers 2017 to 2020'
      },
      data: [
        {
            name: "bumblebees",
            number: 3,
            colour: '#5A99D3'
        },
        {
            name: "honeybees",
            number: 10,
            colour: '#EB7C30'
        },
        {
            name: "solitary bees",
            number: 7,
            colour: '#A3A3A3'
        },
        {
            name: "wasps",
            number: 4,
            colour: '#FFBF00'
        },
        {
            name: "hoverflies",
            number: 12,
            colour: '#4472C3'
        },
        {
            name: "other flies",
            number: 34,
            colour: '#70AB46'
        },
        {
            name: "butterflies & moths",
            number: 1,
            colour: '#1F5380'
        },
        {
            name: "beetles",
            number: 6,
            colour: '#9D480E'
        },
        {
            name: "small insects",
            number: 17,
            colour: '#626262'
        },
        {
            name: "other insects",
            number: 6,
            colour: '#977200'
        }
      ]
    })
  })
}

/** @constant
* @description This object has properties corresponding to a number of data access
* functions that can be used to load data provided in standard formats.
*  @type {object}
*/
export const dataAccessors = {
  'test': testData,
}