/**
 * Creates an array of numbers progressing from start up to.
 * @param start - lower limit of array elements
 * @param stop - upper limit of array elements
 * @returns processed array
 */
export function range({ start = 0, stop }: { start?: number; stop: number }): number[] {
  const array = [];
  for (let i = start; i <= stop; i++) {
    array.push(i);
  }
  return array;
}
