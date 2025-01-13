export const flattenArray = (list: any[]) => list.reduce((a, b) =>
  a.concat(Array.isArray(b) ? flattenArray(b) : b), []);
