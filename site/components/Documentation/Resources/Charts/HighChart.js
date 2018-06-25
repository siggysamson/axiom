import React, { Component } from 'react';
import { HighChart } from '@brandwatch/axiom-charts';
import {
  DocumentationApi,
  DocumentationContent,
  DocumentationShowCase,
} from '@brandwatch/axiom-documentation-viewer';

import { highChartLineData, highChartBarData, highChartColumnData } from "./chartData";

export default class Documentation extends Component {
  render() {

    const lineChartOptions = {
      chart: {
        type: 'line',
      },
      yAxis: {
        title: {
          text: 'Volume of Total Mentions Daily',
        }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Previous 30 days'
        },
      },
      plotOptions: {
        series: {
          pointStart: Date.UTC(2017, 12, 1),
          pointInterval: 24 * 3600 * 1000,
        },
      },
      series: highChartLineData,
    };

    const columnChartOptions = {
      chart: {
        type: 'column',
      },
      yAxis: {
        title: {
          text: 'Volume of Total Mentions Daily',
        }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Previous 30 days'
        },
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          pointStart: Date.UTC(2017, 12, 1),
          pointInterval: 24 * 3600 * 1000,
        },
      },
      series: highChartColumnData,
    };

    const barChartOptions = {
      chart: {
        type: 'bar',
      },
      yAxis: {
        title: {
          text: 'Volume of Total Mentions Daily',
        },
      },
      xAxis: {
        title: {
          text: null,
        },
        categories: [
          'Adidas',
          'Nike',
        ],
      },
      plotOptions: {
        scatter: {
          marker: {
            symbol:'line',
            lineWidth: 3,
            radius: 8,
            lineColor:'#f00'
          }
        },
        series: {
          stacking: 'normal',
        },
      },
      series: highChartBarData,
    };

    return (
      <DocumentationContent>
        <DocumentationShowCase>
          <HighChart
            options={lineChartOptions}
          />
          <HighChart
            options={columnChartOptions}
          />

          <HighChart
            options={barChartOptions}
          />
        </DocumentationShowCase>

        <DocumentationApi components={ [
          require('!!axiom-documentation-loader!@brandwatch/axiom-charts/src/HighChart/HighChart'),
        ] } />
      </DocumentationContent>
    );
  }
}
