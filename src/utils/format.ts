export const formatNumber = (x: number, digest = 3) =>
  parseInt(Math.round(x * Math.pow(10, digest)) + "") / Math.pow(10, digest);
