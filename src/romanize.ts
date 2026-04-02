export function romanize(input: string): string {
  if (input.length === 0) {
    return "";
  }
  return input
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
