export const NUMBER_SEPARATOR = '\u2009';

function isInvalidNumber(number) {
  return isNaN(parseFloat(number)) || !isFinite(number);
}

function isInvalidPrecision(precision) {
  return isNaN(parseInt(precision)) && precision % 1 === 0 && precision >= 0 && precision <= 20;
}

function toFixed(number, precision) {
  if (!isInvalidPrecision(precision)) {
    number = number.toFixed(precision);
  }

  return number.toString().replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
}

export function longNumber(number, precision = 0) {
  if (isInvalidNumber(number)) {
    return '-';
  }

  const [ integer, fraction ] = toFixed(number, precision).split('.');
  const formatted = integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${NUMBER_SEPARATOR}`);

  return fraction ? `${formatted}.${fraction}` : formatted;
}

export function shortNumber(number, precision = 0) {
  const threshold = 9999;
  const metricPrefixes = [
    { n: 1E12, prefix: 'trillion' },
    { n: 1E9, prefix: 'billion' },
    { n: 1E6, prefix: 'million' },
    { n: 1E3, prefix: 'thousand' },
  ];

  if (isInvalidNumber(number)) {
    return '-';
  }

  if (number <= threshold) {
    return longNumber(number, precision);
  }

  for (let i = 0; i < metricPrefixes.length; i++) {
    if (number >= metricPrefixes[i].n) {
      return `${toFixed(number / metricPrefixes[i].n, precision)} ${metricPrefixes[i].prefix}`;
    }
  }
}
