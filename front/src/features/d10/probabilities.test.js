import { getProbability } from "./probabilities";

describe("getProbability", () => {
  test("classic", () => {
    expect(getProbability({ roll: 3, keep: 2, tn: 15 })).toEqual(47);
    expect(getProbability({ roll: 7, keep: 4, tn: 30 })).toEqual(63);
  });
  test("no explosion", () => {
    expect(
      getProbability({ roll: 3, keep: 2, tn: 15, explosions: [] })
    ).toEqual(43);
    expect(
      getProbability({ roll: 7, keep: 4, tn: 30, explosions: [] })
    ).toEqual(53);
  });
  test("explode on both 9 and 10", () => {
    expect(
      getProbability({ roll: 3, keep: 2, tn: 15, explosions: [9, 10] })
    ).toEqual(54);
    expect(
      getProbability({ roll: 7, keep: 4, tn: 30, explosions: [9, 10] })
    ).toEqual(74);
  });
  test("emphasises", () => {
    expect(getProbability({ roll: 3, keep: 2, tn: 15, rerolls: [1] })).toEqual(
      53
    );
    expect(getProbability({ roll: 7, keep: 4, tn: 30, rerolls: [1] })).toEqual(
      70
    );
  });
  test("emphasises and explode on both 9 and 10", () => {
    expect(
      getProbability({
        roll: 3,
        keep: 2,
        tn: 15,
        explosions: [9, 10],
        rerolls: [1],
      })
    ).toEqual(59);
    expect(
      getProbability({
        roll: 7,
        keep: 4,
        tn: 30,
        explosions: [9, 10],
        rerolls: [1],
      })
    ).toEqual(80);
  });
});
