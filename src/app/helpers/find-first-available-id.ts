export const findFirstAvailableId = (arr: number[]): number => {
  arr.sort((a, b) => a - b);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] + 1 !== arr[i + 1]) {
      return arr[i] + 1;
    }
  }

  return arr[arr.length - 1] + 1;
};
