export function sumArray(arr: number[]): number[] {
  const output: number[] = [];
  let sum = 0;
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    sum += arr[i];
    output[i] = sum;
  }
  return output;
}
