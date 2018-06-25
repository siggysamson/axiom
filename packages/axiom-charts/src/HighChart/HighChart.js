import React, { Component } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import patternFill from 'highcharts/modules/pattern-fill';

import { Tooltip } from '@brandwatch/axiom-web-components';

import { colors } from '@brandwatch/axiom-materials';

patternFill(Highcharts);

const mapColors = colors => {
  return Object.keys(colors).map(key => {
    const rgb = colors[key];

    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  });
};

Highcharts.setOptions({
  global: {
    useUTC: true,
  },
  credits: {
    enabled: false,
  },
  defs: {
    patterns: [{
      'id': 'custom-pattern',
      'path': {
        d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
        stroke: Highcharts.getOptions().colors[0],
        strokeWidth: 3
      }
    }]
  },
  chart: {
    style: {
      fontFamily: 'inherit',
      fontSize: 'var(--font-size-small)'
    }
  },
  title: {
    text: null,
  },
  xAxis: {
    lineWidth: 0,
    tickLength: 0,
    allowDecimals: false,
    dateTimeLabelFormats: {
      day: '%e %b',
      week: '%e %b',
      month: '%b %Y'
    },
    labels: {
      style: {
        fontSize: 'var(--font-size-small)',
        colors: 'var(--color-theme-text--subtle)',
      },
    },
    title: {
      margin: 20,
    }
  },
  yAxis: {
    allowDecimals: false,
    title: {
      margin: 20,
      style: {
        'font-size': 'var(--font-size-small)'
      }
    },
    labels: {
      style: {
        fontSize: 'var(--font-size-small)',
      },
    },
  },
  colors: mapColors(colors.productColors),
  plotOptions: {
    line: {
      states: {
        hover: {
          lineWidthPlus: 0,
        }
      },
      marker: {
        symbol: 'circle'
      },
      point: {
        events: {
          mouseOut: () => {
            if (this.axTooltip) {
              this.axTooltip.remove();
              this.axTooltip = null;
            }
          },
          mouseOver: ({ target }) => {
            this.axTooltip = document.createElement('ax-tooltip');
            this.axTooltip.target = target.graphic.element;
            this.axTooltip.innerHTML = `
              <span style="color: ${target.color}">${target.series.name} ${target.y}</span>
            `;
            document.body.appendChild(this.axTooltip);
          }
        }
      }
    },
    column: {
      borderWidth: 0,
    },
    bar: {
      borderWidth: 0,
    },
    series: {
      cursor: 'pointer',
    },
  },
  tooltip: {
    enabled: false,
  },
});

class HighChart extends Component {
  render() {
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={this.props.options}
        />
      </div>
    );
  }
}

HighChart.propTypes = {};

export default HighChart;
