
function createGroup(chart, index) {
  const group = chart.renderer.g('peak-group-' + index);
  group.add();
  return group;
}

function onChartLoad() {
  if (this.renderer.defs) { // is SVG

    const data = this.yAxis[0].series[0].data;

    const peaks = [
      [1512172800000, 1512259200000, 1512345600000, 1512432000000],
      [1513728000000, 1513814400000, 1513900800000],
    ];

    const areas = peaks.map(peak => {
      const inner = data.filter(({ x }) => peak.includes(x));
      inner.unshift({ plotX: inner[0].plotX, plotY: this.clipBox.height });
      inner.push({ plotX: inner[inner.length - 1].plotX, plotY: this.clipBox.height });
      return inner;
    });

    if (this.peakAreas) {
      this.peakAreas.forEach(svgElement => {
        svgElement.destroy();
        svgElement = null;
      });
    }

    const group = createGroup(this, 0);

    this.peakAreas = areas.map(peakArea => {
      const path = peakArea.map(({ plotX, plotY }, index) => (index > 0 ? 'L' : 'M') + ` ${plotX} ${plotY}`);
      const svgElement = this.renderer
        .path((path))
        .attr({
          fill: 'green',
        })
        .translate(this.plotLeft, this.plotTop);

      svgElement.add(group);

      return svgElement;
    });
  }
}

export default {
  global: {
    useUTC: true,
  },
  chart: {
    reflow: false,
    animation: false,
    events: {
      render: onChartLoad,
    },
  },
  title: {
    text: null,
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: true,
    buttons: null,
    fallbackToExportServer: true,
    url: '/exportchart',
  },
  plotOptions: {
    pie: {
      dataLabels: {
        enabled: true,
      },
    },
    bar: {
      states: {
        hover: {
          enabled: false,
        },
      },
      pointPadding: 0,
      groupPadding: 0,
    },
    column: {
      states: {
        hover: {
          enabled: false,
        },
      },
      stacking: 'normal',
      pointPadding: 0.05,
      groupPadding: 0,
      borderWidth: 0.1,
      lineWidth: 0,
    },
    series: {
      cursor: 'pointer',
      animation: false,
      marker: {
        symbol: 'circle',
        lineWidth: 10,
      },
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size: 13px">{point.key}</span><br/>',
  },
  xAxis: {
    title: {
      text: '',
    },
    minPadding: 0.05,
    maxPadding: 0.05,
    startOnTick: false,
    endOnTick: false,
    // prevent ticks to go deeper than days (only datetime axis)
    dateTimeLabelFormats: {
      day: '%e %b',
      week: '%e %b',
      month: '%b %Y',
    },
    units: [
      [
        'day', [1, 2],
      ],
      [
        'week', [1, 2],
      ],
      [
        'month', [1, 2, 3, 4, 6],
      ],
      [
        'year', [1],
      ],
    ],
  },
  yAxis: {
    allowDecimals: false,
    title: {
      text: '',
    },
    startOnTick: false,
    endOnTick: false,
    min: 0,
  },
};
