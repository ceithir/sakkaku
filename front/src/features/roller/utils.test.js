import {
  replaceRerollsOfType,
  replaceRerolls,
  rolledDicesCount,
  bestKeepableDice,
  bestDiceToReroll,
} from "./utils";

describe("replaceRerollsOfType", () => {
  describe("current", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
      ],
      metadata: { rerolls: ["distinction", "shadow"] },
      parameters: {
        tn: 3,
        ring: 3,
        skill: 3,
        modifiers: ["distinction", "shadow"],
      },
    };
    const dices = roll.dices;
    const basePool = roll.parameters.ring + roll.parameters.skill;

    test("filter first depth of reroll properly", () => {
      expect(
        replaceRerollsOfType({ dices, rerollType: "distinction", basePool })
      ).toStrictEqual([
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: [],
        },
      ]);
    });

    test("filter second depth of reroll properly", () => {
      expect(
        replaceRerollsOfType({
          dices,
          rerollType: "shadow",
          basePool,
          previousRerollTypes: ["distinction"],
        })
      ).toStrictEqual([
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: [],
        },
      ]);
    });
  });

  describe("legacy", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "rerolled",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "rerolled",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { modifier: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
      ],
      metadata: { rerolls: ["distinction"] },
      parameters: { tn: 3, ring: 2, skill: 3, modifiers: ["distinction"] },
    };
    const dices = roll.dices;

    test("filter simple legacy roll properly", () => {
      expect(
        replaceRerollsOfType({ dices, rerollType: "distinction", basePool: 5 })
      ).toStrictEqual([
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
      ]);
    });
  });

  test("three levels of depth", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "adversity" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "adversity" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "2heavens", source: "adversity" },
        },
        {
          type: "skill",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: { source: "adversity" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: { source: "2heavens" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: { source: "explosion" },
        },
      ],
      metadata: { rerolls: ["adversity", "2heavens", "shadow"] },
      parameters: {
        tn: 3,
        ring: 3,
        skill: 3,
        modifiers: ["adversity", "void", "2heavens", "shadow"],
      },
    };
    const { dices } = roll;
    expect(
      replaceRerollsOfType({
        dices,
        rerollType: "shadow",
        basePool: 7,
        previousRerollTypes: ["adversity", "2heavens"],
      })
    ).toStrictEqual([
      {
        type: "ring",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: { source: "2heavens" },
      },
      {
        type: "ring",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: [],
      },
      {
        type: "ring",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: [],
      },
      {
        type: "ring",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "kept",
        metadata: { source: "shadow" },
      },
      {
        type: "skill",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
        status: "kept",
        metadata: { source: "adversity" },
      },
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
        status: "kept",
        metadata: { source: "shadow" },
      },
    ]);
  });
});

describe("replaceRerolls", () => {
  test("order is consistent", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
      ],
      metadata: { rerolls: ["distinction", "shadow"] },
      parameters: {
        tn: 5,
        ring: 5,
        skill: 5,
        modifiers: ["distinction", "void", "stirring", "shadow"],
      },
    };
    const {
      dices,
      metadata: { rerolls },
      parameters: { ring, skill },
    } = roll;
    const basePool = ring + skill + 1;

    expect(
      replaceRerolls({
        dices,
        rerollTypes: rerolls,
        basePool,
      })
    ).toStrictEqual([
      {
        type: "ring",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
        status: "kept",
        metadata: [],
      },
      {
        type: "ring",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "ring",
        value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
        status: "dropped",
        metadata: [],
      },
      {
        type: "ring",
        value: { strife: 1, success: 0, explosion: 0, opportunity: 1 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "ring",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "kept",
        metadata: { source: "distinction" },
      },
      {
        type: "ring",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "skill",
        value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "kept",
        metadata: { source: "distinction" },
      },
      {
        type: "skill",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: [],
      },
    ]);
  });
  test("it tries to mix dice types if it has no other choice", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "reasonless" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
          status: "pending",
          metadata: { source: "reasonless" },
        },
      ],
      metadata: { rerolls: ["reasonless"] },
      parameters: {
        ring: 2,
        skill: 0,
        modifiers: ["unrestricted", "reasonless"],
      },
    };
    const { dices } = roll;
    expect(
      replaceRerolls({
        dices,
        rerollTypes: ["reasonless"],
        basePool: 1,
      })
    ).toStrictEqual([
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
        status: "pending",
        metadata: { source: "reasonless" },
      },
    ]);
  });
  test("just hides all rerolls if no reroll type is provided", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "pending",
          metadata: { source: "distinction" },
        },
      ],
      metadata: { rerolls: ["distinction"] },
      parameters: {
        ring: 2,
        skill: 0,
        modifiers: ["distinction"],
      },
    };
    const { dices } = roll;
    expect(
      replaceRerolls({
        dices,
      })
    ).toStrictEqual([
      {
        type: "ring",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
        status: "kept",
        metadata: [],
      },
      {
        type: "ring",
        value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
        status: "pending",
        metadata: { source: "distinction" },
      },
    ]);
  });
});

describe("assisted roll", () => {
  test("count skilled assist dice properly", () => {
    expect(
      rolledDicesCount({ ring: 2, skill: 3, modifiers: ["unskilledassist05"] })
    ).toStrictEqual(10);
  });
});

describe("preselect best keepable dice", () => {
  test("it prefers success over opportunity", () => {
    expect(
      bestKeepableDice({
        ring: 1,
        skill: 1,
        dices: [
          {
            type: "skill",
            value: { opportunity: 1 },
            status: "pending",
          },
          {
            type: "ring",
            value: { strife: 1, success: 1 },
            status: "pending",
          },
        ],
      })
    ).toStrictEqual([1]);
  });
  test("prefer to keep skill dice over ring dice", () => {
    expect(
      bestKeepableDice({
        ring: 2,
        skill: 2,
        dices: [
          {
            type: "ring",
            value: { strife: 1, explosion: 1 },
            status: "pending",
          },
          {
            type: "skill",
            value: { strife: 1, explosion: 1 },
            status: "pending",
          },
          {
            type: "ring",
            value: { strife: 1, explosion: 1 },
            status: "pending",
          },
          {
            type: "skill",
            value: { strife: 1, explosion: 1 },
            status: "pending",
          },
        ],
      })
    ).toStrictEqual([1, 3]);
  });
});

describe("preselect best dice to reroll", () => {
  test("it prefers opportunity over success", () => {
    expect(
      bestDiceToReroll({
        roll: {
          ring: 1,
          skill: 1,
          dices: [
            {
              type: "ring",
              value: { opportunity: 1 },
              status: "pending",
            },
            {
              type: "skill",
              value: { success: 1, strife: 1 },
              status: "pending",
            },
          ],
        },
        max: 1,
      })
    ).toStrictEqual([0]);
  });
  test("prefer to reroll skill dice over ring dice", () => {
    expect(
      bestDiceToReroll({
        roll: {
          ring: 2,
          skill: 2,
          dices: [
            {
              type: "ring",
              value: {},
              status: "pending",
            },
            {
              type: "skill",
              value: {},
              status: "pending",
            },
            {
              type: "ring",
              value: {},
              status: "pending",
            },
            {
              type: "skill",
              value: {},
              status: "pending",
            },
          ],
        },
        max: 2,
      })
    ).toStrictEqual([1, 3]);
  });
  test("can restrict reroll to only some kind of die", () => {
    expect(
      bestDiceToReroll({
        roll: {
          ring: 2,
          skill: 2,
          dices: [
            {
              type: "ring",
              value: { explosion: 1, strife: 1 },
              status: "pending",
            },
            {
              type: "ring",
              value: { success: 1 },
              status: "pending",
            },
            {
              type: "skill",
              value: {},
              status: "pending",
            },

            {
              type: "skill",
              value: { explosion: 1, strife: 1 },
              status: "pending",
            },
          ],
        },
        max: 2,
        restrictFunc: ({ value: { success = 0, explosion = 0 } }) =>
          success > 0 || explosion > 0,
      })
    ).toStrictEqual([1, 3]);
  });
  describe("compromised", () => {
    test("if compromised, it tries to reroll compromised dice first", () => {
      expect(
        bestDiceToReroll({
          roll: {
            ring: 1,
            skill: 1,
            dices: [
              {
                type: "ring",
                value: { opportunity: 1 },
                status: "pending",
              },
              {
                type: "skill",
                value: { success: 1, strife: 1 },
                status: "pending",
              },
            ],
            modifiers: ["compromised"],
          },
          max: 1,
        })
      ).toStrictEqual([1]);
    });
    test("if compromised, skill dice with strife are always rerolled first", () => {
      expect(
        bestDiceToReroll({
          roll: {
            ring: 1,
            skill: 1,
            dices: [
              {
                type: "ring",
                value: { opportunity: 1, strife: 1 },
                status: "pending",
              },
              {
                type: "skill",
                value: { success: 1, strife: 1 },
                status: "pending",
              },
            ],
            modifiers: ["compromised"],
          },
          max: 1,
        })
      ).toStrictEqual([1]);
    });
  });
});
