import { parse, cap, stringify } from "./formula";

describe("parse", () => {
  test("empty", () => {
    expect(parse()).toEqual(false);
    expect(parse("")).toEqual(false);
  });
  test("zero", () => {
    expect(parse("3k0")).toEqual(false);
    expect(parse("0k2")).toEqual(false);
    expect(parse("1k2-1k0")).toEqual(false);
    expect(parse("5k3-1k3")).toEqual(false);
  });
  test("simple", () => {
    expect(parse("3k2")).toEqual({ roll: 3, keep: 2, modifier: 0 });
  });
  test("alltogether", () => {
    expect(parse("3k2+5+2k0-1k1-2+4k0")).toEqual({
      roll: 8,
      keep: 1,
      modifier: 3,
    });
  });

  describe("addition", () => {
    test("simple", () => {
      expect(parse("3k2+2k1")).toEqual({ roll: 5, keep: 3, modifier: 0 });
    });
    test("multiple", () => {
      expect(parse("3k2+2k1+3k0")).toEqual({ roll: 8, keep: 3, modifier: 0 });
    });
    test("substraction", () => {
      expect(parse("5k2-1k0")).toEqual({ roll: 4, keep: 2, modifier: 0 });
    });
    test("add and substract", () => {
      expect(parse("5k2+3k2-1k0")).toEqual({ roll: 7, keep: 4, modifier: 0 });
    });
  });

  describe("modifier", () => {
    test("simple", () => {
      expect(parse("3k2+5")).toEqual({ roll: 3, keep: 2, modifier: 5 });
    });
    test("negative", () => {
      expect(parse("3k2-2")).toEqual({ roll: 3, keep: 2, modifier: -2 });
    });
    test("addition", () => {
      expect(parse("3k2+3-2+5")).toEqual({ roll: 3, keep: 2, modifier: 6 });
    });
  });

  test("case insensitive", () => {
    expect(parse("4K2+1k1+0K1")).toEqual({ roll: 5, keep: 4, modifier: 0 });
  });
});

describe("cap", () => {
  test("nothing to do", () => {
    expect(cap({ roll: 5, keep: 3 })).toEqual({
      roll: 5,
      keep: 3,
      modifier: 0,
    });
  });

  test("more kept than rolled", () => {
    expect(cap({ roll: 3, keep: 4 })).toEqual({
      roll: 3,
      keep: 3,
      modifier: 0,
    });
  });

  describe("4ed ten dice rules", () => {
    test("book examples", () => {
      expect(cap({ roll: 12, keep: 4 })).toEqual({
        roll: 10,
        keep: 5,
        modifier: 0,
      });
      expect(cap({ roll: 13, keep: 9 })).toEqual({
        roll: 10,
        keep: 10,
        modifier: 2,
      });
      expect(cap({ roll: 10, keep: 12 })).toEqual({
        roll: 10,
        keep: 10,
        modifier: 4,
      });
      expect(cap({ roll: 14, keep: 12 })).toEqual({
        roll: 10,
        keep: 10,
        modifier: 12,
      });
    });
  });
});

describe("stringify", () => {
  test("full loop", () => {
    expect(stringify(parse("3k2-5"))).toEqual("3k2-5");
  });
});
