class PeakLabel {
  constructor(chart, data, colorIndex, seriesIndex, labelIndex) {

    this.seriesIndex = seriesIndex;
    this.labelIndex = labelIndex;

    const path = ['M15.73,23.41,12,29,8.27,23.41a12,12,0,1,1,7.46,0Z'];
    const bg = chart.renderer
      .path((path))
      .attr({
        class: `highcharts-color-${colorIndex}`,
      });

    const WIDTH = 12;
    const HEIGHT = 35;

    const group = chart.renderer.g('peak-label')
      .translate(data.x - WIDTH, data.y - HEIGHT);

    bg.add(group);


    const text = chart.renderer.text(data.letter).attr({
      y: 15,
      x: 9,
      style: 'pointer-events: none; fill: #fff',
    });
    text.add(group);

    bg.on('click', data.events.click.bind(null, this));
    bg.on('mouseover', data.events.mouseover.bind(null, this));
    bg.on('mouseout', data.events.mouseout.bind(null, this));

    this.el = group;

    return this;
  }

  destroy() {
    this.el.destroy();
  }
}

class PeakLabelGroup {
  constructor(chart, labels, series, colorIndex, seriesIndex) {
    this.chart = chart;
    const group = this.createGroup(0);
    const labelsWithCoordinates = this.findPeakCoordinates(labels, series.data);
    this.peakLabels = labelsWithCoordinates.map((label, index) => {
      const peakLabel = new PeakLabel(this.chart, label, colorIndex, seriesIndex, index);
      peakLabel.el.add(group);

      return peakLabel;
    });

    return this;
  }

  destroy() {
    this.peakLabels.forEach(peak => peak.destroy());
  }

  createGroup(index) {
    const group = this.chart.renderer.g('peak-group-' + index)
      .translate(this.chart.plotLeft, this.chart.plotTop)
      .attr({
        zIndex: 9999,
      })
      .add();
    return group;
  }

  findPeakCoordinates(labels, data) {
    return labels.map(label => {
      const coordinates = data.filter(({ x }) => label.position === x).map(item => ({
        ...label,
        x: item.plotX,
        y: item.plotY,
      }));

      if (!coordinates.length) {
        return [];
      }


      return coordinates[0];
    });
  }
}

function drawPeakLabels(chart) {

  if (chart.peakLabels._groups) {
    chart.peakLabels._groups.forEach(peakLabelGroup => {
      if (peakLabelGroup) {
        peakLabelGroup.destroy();
        peakLabelGroup = null;
      }
    });
  }

  chart.peakLabels._groups = chart.peakLabels.data.map((labels, index) => {
    const series = chart.yAxis[0].series[index];

    if (!series.visible) {
      return null;
    }

    return new PeakLabelGroup(chart, labels, series, series.colorIndex, index);
  });
}

export default (H) => {
  H.Chart.prototype.callbacks.push(chart => {
    chart.peakLabels = chart.peakLabels || {};


    const events = {
      click: (event, peakLabel) => { console.log('click', event, peakLabel); },
      mouseover: (peakLabel) => {
        chart.peaks.show(peakLabel.seriesIndex, peakLabel.labelIndex);
      },
      mouseout: (peakLabel) => {
        chart.peaks.hide(peakLabel.seriesIndex, peakLabel.labelIndex);
      },
    };

    chart.peakLabels.data = [
      [
        {
          position: Date.UTC(2017, 11, 3),
          letter: 'A',
          events,
        },
        {
          position: Date.UTC(2017, 11, 21),
          letter: 'B',
          events,
        },
      ],
      [],
      [
        {
          position: Date.UTC(2017, 11, 8),
          letter: 'C',
          events,
        },
        {
          position: Date.UTC(2017, 11, 24),
          letter: 'D',
          events,
        },
      ],
    ];

    H.addEvent(chart, 'render', () => {
      try {
        drawPeakLabels(chart);
      } catch(error) {
        console.log(error);
      }
    });
 });
};
