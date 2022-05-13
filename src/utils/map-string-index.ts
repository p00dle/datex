export function mapStringIndex(arr: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (let i = 0, l = arr.length; i < l; i++) {
    map[arr[i].toLowerCase()] = i;
  }
  return map;
}
