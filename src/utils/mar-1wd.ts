export function mar1wd(y: number): number {
  const r = (y + ((y / 4) | 0) - ((y / 100) | 0) + ((y / 400) | 0) + 3) % 7;
  return r === 0 ? 7 : r;
}
