import './styles/axiom-highcharts.css';
import base from './base';
import Highcharts from 'highcharts/js/highcharts';
import AnnotationsModule from 'highcharts/js/modules/annotations.src.js';
import PeakHighlightPlugin from './PeakHighlightPlugin';

AnnotationsModule(Highcharts);
PeakHighlightPlugin(Highcharts);

if (Highcharts.setOptions && typeof Highcharts.setOptions === 'function') {
  Highcharts.setOptions(base);
}

export default Highcharts;
