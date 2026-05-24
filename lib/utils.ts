export const fmtPrice = (n: number) => "Ksh " + n.toLocaleString("en-KE");

export function catalogueNumber(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const n = (h % 999) + 1;
  return "№ " + String(n).padStart(3, "0");
}
