export function range(from: number, to: number, step = 1, include = false): number[] {
  const result = [];
  let current = from;
  const limit = include ? to + step : to;
  while (current < limit) {
    result.push(current);
    current += step;
  }
  return result;
}
