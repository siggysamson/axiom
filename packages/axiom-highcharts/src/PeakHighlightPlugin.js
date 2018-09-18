
class PeakHighlight {
  constructor(chart, peakCoordinates, color) {
    const path = peakCoordinates.map(({ x, y }, index) => (index > 0 ? 'L' : 'M') + ` ${x} ${y}`);

    return chart.renderer
    .path((path))
    .attr({
      fill: color,
    });
  }
}

class PeakHighlightGroup {
  constructor(chart, peaks, series, color) {
    this.chart = chart;
    const group = this.createGroup(0);
    const peakPaths = this.findPeakCoordinates(peaks, series.data);

    peakPaths.map(peakArea => {
      const svgElement = new PeakHighlight(this.chart, peakArea, color);
      svgElement.add(group);
    });

    return group;
  }

  createGroup(index) {
    const group = this.chart.renderer.g('peak-group-' + index);
    group.translate(this.chart.plotLeft, this.chart.plotTop);
    group.add();
    return group;
  }

  findPeakCoordinates(peaks, data) {
    return peaks.map(peak => {
      const coordinates = data.filter(({ x }) => peak.includes(x)).map(item => ({
        x: item.plotX,
        y: item.plotY,
      }));

      if (!coordinates.length) {
        return [];
      }

      // Left bottom
      coordinates.unshift({
        x: coordinates[0].x,
        y: this.chart.clipBox.height,
      });

      // Right bottom
      coordinates.push({
        x: coordinates[coordinates.length - 1].x,
        y: this.chart.clipBox.height,
      });

      return coordinates;
    });
  }
}

function drawPeakAreas(chart) {

  if (chart.peaks._groups) {
    chart.peaks._groups.forEach(peakHighlightGroup => {
      peakHighlightGroup.destroy();
      peakHighlightGroup = null;
    });
  }

  chart.peaks._groups = chart.peaks.data.map((peaks, index) => {
    const series = chart.yAxis[0].series[index];

    const color = ['red', 'green'][index]; // Get color from series
    return new PeakHighlightGroup(chart, peaks, series, color);
  });
}

export default (H) => {

  H.Chart.prototype.callbacks.push(chart => {
    chart.peaks = chart.peaks || {};

    chart.peaks.data = [
      [
        [
          Date.UTC(2017, 11, 2),
          Date.UTC(2017, 11, 3),
          Date.UTC(2017, 11, 4),
        ],
        [
          Date.UTC(2017, 11, 20),
          Date.UTC(2017, 11, 21),
          Date.UTC(2017, 11, 22),
        ],
      ],
      [
        [
          Date.UTC(2017, 11, 6),
          Date.UTC(2017, 11, 7),
          Date.UTC(2017, 11, 8),
          Date.UTC(2017, 11, 9),
          Date.UTC(2017, 11, 10),
          Date.UTC(2017, 11, 11),
        ],
        [
          Date.UTC(2017, 11, 18),
          Date.UTC(2017, 11, 19),
          Date.UTC(2017, 11, 20),
          Date.UTC(2017, 11, 21),
        ],
      ],
    ];

    H.addEvent(chart, 'render', () => {
      try {
        drawPeakAreas(chart);
      } catch(error) {
        console.log(error);
      }
    });
 });
};
