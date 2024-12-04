### BRC Charts library examples

## API documentation
For API details - [JSDoc API documentation](https://biologicalrecordscentre.github.io/brc-charts/docs/api/).

## Working chart examples

### Temporal charts
The temporal chart (`brccharts.temporal`) can be used for all sorts of charts which require 
their x-axis to span either a year (e.g. for phenology) or a number of years (e.g. to visualise
the accumulation of records over time). This is probably the most widely useful chart. Examples:
- [Temporal charts](example-8.html)
- [Temporal charts interactive](example-9.html)
- [UKBMS interactive](example-ukbms-1.html)
- [UKBMS example](example-ukbms-2.html)

### Pie/donut charts
The pie/donut chart (`brccharts.pie`) does what it says on the tin. Example:
- [Pie/donut charts](example-1.html)

### Phenology charts
The phenology chart (`brccharts.phen2`) is a specific type of temporal chart which
is purely for displaying phenological data. Example:
- [Phenology bands](example-10.html)

### Accumulation charts
The accumulation chart (`brccharts.accum`) was created for a very specific use case to chart record accumulation
over the course of a year, displaying both the cummulative number of taxa and
the cummulative number of records together. Example:
- [Species/record accumulation charts](example-3.html)

### Trend charts
Also created for a very specific use case, the trend chart (`brccharts.trend`) displays two graphics: 1) a bar 
chart showing the absolute yearly counts for each taxon shown and 2) a line graph showing, 
for each year, the percetage of the sum of counts for all species in that year 
which the count for the taxon represents. Two y-axes are shown (left and right) to reflect these
two metrics.
- [Trend charts](example-5.html)

### Latitude vs altitude charts
Another very specific use case, the latitude vs altitude chart (`brccharts.altlat`) is based on that which appears in the 
[Atlas of British and irish Bryophytes](https://www.britishbryologicalsociety.org.uk/publications/atlas-of-british-and-irish-bryophytes/).
The chart can be used to visualise how tetrad occupancy varies according to both altitude and latitude across Great Britain. This was developed for the [Plant Atlas 2020 website](https://plantatlas2020.org/).
- [BBS style latitude vs altitude charts](example-7.html). 

## Deprecated charts
When the library was first published, the functionality now provided by the temporal chart
was split across two chart types: 1) the 'phenology' chart (`brccharts.phen1`) provided charting ability for metrics
across the year and 2) the 'yearly chart (`brccharts.yearly`) provided charting ability for metrics across years. These
should no longer be used in new developments. Examples:
- [Deprecated 'phen1' chart](example-2.html)
- [Deprecated 'yearly' chart](example-6.html)
The 'yearly' chart is used to provide figures 1 and 2 on the 'trends' tab of the [Plant Atlas 2020 website](https://plantatlas2020.org/)
but these can now be produced with the temporal chart (see the foot of this [temporal charts example](example-8.html)).

## Experimental charts
The links chart (`brccharts.links`) was an experimental development to explore visualising inter-specific relationships.
It has not been developed past the point required to produce the example shown below:
- [Interspecific relationship charts](example-4.html)

## Undocumented charts
There are a couple of undocumented charts in the libarary - i.e. they do not appear in 
the [API documentation](https://biologicalrecordscentre.github.io/brc-charts/docs/api/). 
These were developed for the the [Plant Atlas 2020 website](https://plantatlas2020.org/).

### Undocumented 'bar' chart
The bar chart (`brccharts.bar`) is designed to display a bar chart.
Although initiallly created to facilitate the [Plant Atlas 2020 website](https://plantatlas2020.org/)
(figure 4 on the 'trends' tab),
it has been generalised and could be used in other contexts.

### Undocumented 'density' chart
The density chart (`brccharts.density`) is designed to show one or more density plots
derived from frequency data (data)
It was created to facilitate the [Plant Atlas 2020 website](https://plantatlas2020.org/)
(figure 3 on the 'trends' tab)
and although some features have been generalised, it contains some
code that is specific for that use case.

[[Back to repo]](https://github.com/BiologicalRecordsCentre/brc-charts)










