
class PeakHighlight {
  constructor(chart, peakCoordinates, colorIndex) {
    const path = peakCoordinates.map(({ x, y }, index) => (index > 0 ? 'L' : 'M') + ` ${x} ${y}`);

    this.el = chart.renderer
    .path((path))
    .attr({
      style: 'display: none',
      class: `peak-gradient-${colorIndex}`,
    });

    return this;
  }

  destroy() {
    this.el.destroy();
  }

  show() {
    this.el.attr({
      style: 'display: block',
    });
  }

  hide() {
    this.el.attr({
      style: 'display: none',
    });
  }
}

class PeakHighlightGroup {
  constructor(chart, peaks, series, colorIndex) {
    this.chart = chart;
    const group = this.createGroup(0);
    const peakPaths = this.findPeakCoordinates(peaks, series.data);

    this.peakHighlights = peakPaths.map(peakArea => {
      const peakHighlight = new PeakHighlight(this.chart, peakArea, colorIndex);
      peakHighlight.el.add(group);

      return peakHighlight;
    });

    return this;
  }

  destroy() {
    this.peakHighlights.forEach(peak => peak.destroy());
  }

  show(peakIndex) {
    this.peakHighlights[peakIndex].show();
  }

  hide(peakIndex) {
    this.peakHighlights[peakIndex].hide();
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
      if (peakHighlightGroup) {
        peakHighlightGroup.destroy();
        peakHighlightGroup = null;
      }
    });
  }

  chart.peaks._groups = chart.peaks.data.map((peaks, index) => {
    const series = chart.yAxis[0].series[index];

    if (!series.visible) {
      return null;
    }

    return new PeakHighlightGroup(chart, peaks, series, series.colorIndex);
  });
}

export default (H) => {
  H.Chart.prototype.callbacks.push(chart => {
    chart.peaks = chart.peaks || {};

    chart.peaks.show = function(seriesIndex, peakIndex) {
      const group = chart.peaks._groups[seriesIndex];
      if (group) {
        group.show(peakIndex);
      }
    };

    chart.peaks.hide = function(seriesIndex, peakIndex) {
      const group = chart.peaks._groups[seriesIndex];
      if (group) {
        group.hide(peakIndex);
      }
    };

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
      [],
      [
        [
          Date.UTC(2017, 11, 7),
          Date.UTC(2017, 11, 8),
          Date.UTC(2017, 11, 9),
          Date.UTC(2017, 11, 10),
          Date.UTC(2017, 11, 11),
        ],
        [
          Date.UTC(2017, 11, 23),
          Date.UTC(2017, 11, 24),
          Date.UTC(2017, 11, 25),
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
