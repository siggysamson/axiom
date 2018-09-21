export default H => {
  H.Chart.prototype.callbacks.push(chart => {
    console.log(chart);

    H.each(chart.series, series => {
      H.each(series.points, point => {
        H.addEvent(point, 'mouseOver', ({ target }) => {
          const { series: { index: currentActiveIndex } } = target;

          H.each(chart.series, (series, index) => {
            if (index !== currentActiveIndex) {
              series.group.element.setAttribute('opacity', '0.25');
              series.markerGroup.element.setAttribute('opacity', '0.25');
            } else {
              series.group.element.setAttribute('opacity', 1);
              series.markerGroup.element.setAttribute('opacity', 1);
            }
          });
        });

        H.addEvent(point, 'mouseOut', () => {
          H.each(chart.series, (series) => {
            series.group.element.setAttribute('opacity', 1);
            series.markerGroup.element.setAttribute('opacity', 1);
          });
        })
      });
    });

    console.log(H.addEvent);
  });
};
