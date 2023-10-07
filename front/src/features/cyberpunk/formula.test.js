import { parse } from "./formula";

describe("parse", () => {
  test("empty", () => {
    expect(parse("")).toEqual(false);
  });

  test("single", () => {
    expect(parse("3")).toEqual(3);
    expect(parse("-1")).toEqual(-1);
    expect(parse("+2")).toEqual(2);
  });

  test("multiple", () => {
    expect(parse("3+2+5")).toEqual(10);
    expect(parse("+2-7-1")).toEqual(-6);
    expect(parse("-16+12")).toEqual(-4);
  });
});
