
function createGroup(chart, index) {
  const group = chart.renderer.g('peak-group-' + index);
  group.add();
  return group;
}

function findPeakCoordinates(chart) {
  const data = chart.yAxis[0].series[0].data;

  return chart.peaks.data.map(peak => {
    const inner = data.filter(({ x }) => peak.includes(x));
    inner.unshift({ plotX: inner[0].plotX, plotY: chart.clipBox.height });
    inner.push({ plotX: inner[inner.length - 1].plotX, plotY: chart.clipBox.height });
    return inner;
  });
}

function drawPeakAreas(chart) {

  if (chart.peaks._groups) {
    chart.peaks._groups.forEach(svgElement => {
      svgElement.destroy();
      svgElement = null;
    });
  }

  const peakPaths = findPeakCoordinates(chart);

  const group = createGroup(chart, 0);

  chart.peaks._groups = peakPaths.map(peakArea => {
    const path = peakArea.map(({ plotX, plotY }, index) => (index > 0 ? 'L' : 'M') + ` ${plotX} ${plotY}`);
    const svgElement = chart.renderer
      .path((path))
      .attr({
        fill: 'green',
      })
      .translate(chart.plotLeft, chart.plotTop);

    svgElement.add(group);

    return svgElement;
  });

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
