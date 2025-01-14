export const findMissingNumbers = (arr: number[]): number[] => {
  arr.sort((a, b) => a - b);

  const missingNumbers: number[] = [];

  for (let i = arr[0]; i <= arr[arr.length - 1]; i++) {
    if (!arr.includes(i)) {
      missingNumbers.push(i);
    }
  }

  return missingNumbers;
}
