// bigint利用
function* xorShift1(initialState: bigint): Iterator<bigint> {
  let x: bigint = initialState & 0xFFFF_FFFF_FFFF_FFFFn;
  if (x === 0n) {
    throw Error("initialState must not be zero.");
  }
  for (; ;) {
    x ^= x << 13n;
    x &= 0xFFFF_FFFF_FFFF_FFFFn;
    x ^= x >> 7n;
    x ^= x << 17n;
    x &= 0xFFFF_FFFF_FFFF_FFFFn;
    yield x;
  }
}

// numberのペアを利用
function* xorShift2(initialState: [number, number]): Iterator<[number, number]> {
  let x0: number = initialState[0] & 0xFFFF_FFFF;
  let x1: number = initialState[1] & 0xFFFF_FFFF;
  if (x0 === 0 && x1 === 0) {
    throw Error("initialState must not be zero.");
  }
  for (; ;) {
    x1 ^= (x0 >>> 19) | (x1 << 13);
    x0 ^= x0 << 13;
    x0 ^= (x0 >>> 7) | (x1 << 25);
    x1 ^= x1 >>> 7;
    x1 ^= (x0 >>> 15) | (x1 << 17);
    x0 ^= x0 << 17;
    yield [x0 >>> 0, x1 >>> 0];
  }
}

function To64([x0, x1]: [number, number]): bigint {
  return BigInt(x0) + BigInt(x1) * 0x1_0000_0000n;
}

const gen1 = xorShift1(1n);
const gen2 = xorShift2([1, 0]);

// ガベコレを防ぐために配列に入れる
const a1 = new Set<bigint>();
const a2 = new Set<[number, number]>();
let cnt_a1 = 0;
let cnt_a2 = 0;

const int = 100000000;

console.time("xorShift1");
for (let i = 0; i < int; i += 1) {
  const val = gen1.next().value as bigint;
  if (a1.has(val)) {
    cnt_a1++;
  }
}
console.timeEnd("xorShift1");
console.log(gen1.next().value);
console.log(`duplicated: ${cnt_a1} out of ${int}`);

console.time("xorShift2");
for (let i = 0; i < int; i += 1) {
  const [val0, val1] = gen2.next().value as [number, number];
  if (a2.has([val0, val1])) {
    cnt_a2++;
  }
}
console.timeEnd("xorShift2");
console.log(To64(gen2.next().value as [number, number]));
console.log(`duplicated: ${cnt_a2} out of ${int}`);
