import { parse, stringify } from "./formula";

describe("parse", () => {
  test("empty", () => {
    expect(parse()).toEqual(false);
    expect(parse("")).toEqual(false);
  });
  test("simple", () => {
    expect(parse("2d6")).toEqual({
      dices: [{ sides: 6, number: 2 }],
      modifier: 0,
    });
  });
  test("modifier", () => {
    expect(parse("1d12+3")).toEqual({
      dices: [{ sides: 12, number: 1 }],
      modifier: 3,
    });
    expect(parse("3d10-5")).toEqual({
      dices: [{ sides: 10, number: 3 }],
      modifier: -5,
    });
  });
  test("exclude zero", () => {
    expect(parse("0d12")).toEqual(false);
    expect(parse("3d0")).toEqual(false);
    expect(parse("0d0")).toEqual(false);
  });
  test("modifier addition", () => {
    expect(parse("1d20+3-2+4")).toEqual({
      dices: [{ sides: 20, number: 1 }],
      modifier: 5,
    });
  });
  test("multiple dice type", () => {
    expect(parse("1d20+3d6")).toEqual({
      dices: [
        { sides: 20, number: 1 },
        { sides: 6, number: 3 },
      ],
      modifier: 0,
    });
  });
  describe("keep", () => {
    test("keep highest", () => {
      expect(parse("2d20k1")).toEqual({
        dices: [
          { sides: 20, number: 2, keepNumber: 1, keepCriteria: "highest" },
        ],
        modifier: 0,
      });
    });
    test("keep lowest", () => {
      expect(parse("3d6kl2")).toEqual({
        dices: [{ sides: 6, number: 3, keepNumber: 2, keepCriteria: "lowest" }],
        modifier: 0,
      });
    });
    test("refuse to keep more than rolled", () => {
      expect(parse("3d6k4")).toEqual(false);
    });
    test("refuse to keep zero", () => {
      expect(parse("1d20k0")).toEqual(false);
    });
  });
  describe("explode", () => {
    test("one die", () => {
      expect(parse("1d10!")).toEqual({
        dices: [
          {
            sides: 10,
            number: 1,
            explode: true,
          },
        ],
        modifier: 0,
      });
    });
    test("mixed with keep", () => {
      expect(parse("3d6k1!+3")).toEqual({
        dices: [
          {
            sides: 6,
            number: 3,
            explode: true,
            keepNumber: 1,
            keepCriteria: "highest",
          },
        ],
        modifier: 3,
      });
    });
  });
});

describe("stringify", () => {
  test("one type, no modifier", () => {
    expect(
      stringify({
        dices: [{ sides: 6, number: 3 }],
      })
    ).toBe("3d6");
  });

  test("show keep if relevant", () => {
    expect(
      stringify({
        dices: [{ sides: 6, number: 3, keepNumber: 2 }],
      })
    ).toBe("3d6kh2");
  });

  test("do not show keep if irrelevant", () => {
    expect(
      stringify({
        dices: [{ sides: 6, number: 3, keepNumber: 3 }],
      })
    ).toBe("3d6");
  });

  test("show explode", () => {
    expect(
      stringify({
        dices: [{ sides: 6, number: 3, keepNumber: 2, explode: true }],
        modifier: 5,
      })
    ).toBe("3d6kh2!+5");
  });
});
