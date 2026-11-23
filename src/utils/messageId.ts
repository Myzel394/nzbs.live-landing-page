/** A made-up but stable Message-ID for article `i` (0-based) of `total`, in the shape real ones take. */
export function messageId(i: number, total: number): string {
  const hash = (Math.imul(i + 7, 2654435761) >>> 0).toString(36).slice(0, 6);
  return `part${i + 1}of${total}.${hash}@news.example`;
}
