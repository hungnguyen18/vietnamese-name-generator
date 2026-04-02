export function romanize(input: string): string {
  if (input.length === 0) {
    return "";
  }
  return input
    .replace(/[\u0110\u00D0]/g, "D")
    .replace(/[\u0111\u00F0]/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
