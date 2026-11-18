export function revealAt(clientX: number, left: number, width: number) {
  return Math.round(Math.max(0, Math.min(100, (1 - (clientX - left) / width) * 100)));
}
