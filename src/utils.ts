/**
 * Creates an array of numbers progressing from start up to.
 * @param start - inclusive lower limit of array elements (defaults: 0)
 * @param stop - exclusive upper limit of array elements
 * @returns generated array
 * @example
 * range({stop: 10}); // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 * range({start: 1, stop: 10}); // => [1, 2, 3, 4, 5, 6, 7, 8, 9]
 */
export function range({ start = 0, stop }: { start?: number; stop: number }): number[] {
  const array = [];
  for (let i = start; i < stop; i++) {
    array.push(i);
  }
  return array;
}

export type ObjectProperties<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];
export type ObjectMethods<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type ZeroToNine = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type OneToNine = Exclude<ZeroToNine, "0">;
type TenToNinetynine = `${OneToNine}${ZeroToNine}`;
export type OneToNinetynine = OneToNine | TenToNinetynine;

export type AtoZ =
  | ("a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m")
  | ("n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z");
export type AAtoBZ = `${"a" | "b"}${AtoZ}`;
