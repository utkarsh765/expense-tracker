export const fmtINR = (n = 0) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN');
