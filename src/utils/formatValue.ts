const formatValue = (value: number): string =>
  Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
export default formatValue;
