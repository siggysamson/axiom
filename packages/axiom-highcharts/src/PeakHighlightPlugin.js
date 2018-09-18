
class PeakHighlight {
  constructor(chart, peakCoordinates) {
    const path = peakCoordinates.map(({ x, y }, index) => (index > 0 ? 'L' : 'M') + ` ${x} ${y}`);

    return chart.renderer
    .path((path))
    .attr({
      fill: 'red',
    });
  }
}

class PeakHighlightGroup {
  constructor(chart) {
    this.chart = chart;

    const group = this.createGroup(0);
    const peakPaths = this.findPeakCoordinates();

    peakPaths.map(peakArea => {
      const svgElement = new PeakHighlight(this.chart, peakArea);
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

  findPeakCoordinates() {
    const data = this.chart.yAxis[0].series[0].data;

    return this.chart.peaks.data.map(peak => {
      const coordinates = data.filter(({ x }) => peak.includes(x)).map(item => ({
        x: item.plotX,
        y: item.plotY,
      }));

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

  chart.peaks._groups = [new PeakHighlightGroup(chart)];
}

export default (H) => {

  H.Chart.prototype.callbacks.push(chart => {
    chart.peaks = chart.peaks || {};

    chart.peaks.data = [
      [1512172800000, 1512259200000, 1512345600000, 1512432000000],
      [1513728000000, 1513814400000, 1513900800000],
    ];

    H.addEvent(chart, 'render', () => {
      drawPeakAreas(chart);
    });
 });
};
