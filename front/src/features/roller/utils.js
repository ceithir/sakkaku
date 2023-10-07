const REROLL_TYPES = [
  "adversity",
  "distinction",
  "deathdealer",
  "manipulator",
  "ishiken",
  "wandering",
  "offering",
];

const DEPRECATED_REROLL_TYPES = ["ruthless", "sailor", "shadow", "2heavens"];

export const isReroll = (modifier) => {
  if (isSpecialReroll(modifier) || isSpecialAlteration(modifier)) {
    return true;
  }

  return REROLL_TYPES.includes(modifier);
};

export const isSpecialReroll = (modifier) => {
  return (
    /^ruleless([0-9]{2})?$/.test(modifier) ||
    DEPRECATED_REROLL_TYPES.includes(modifier)
  );
};

export const isSpecialAlteration = (modifier) => {
  return /^reasonless([0-9]{2})?$/.test(modifier);
};

export const rolledDicesCount = ({ ring, skill, modifiers = [] }) => {
  return (
    ring +
    skill +
    assistDiceCount(modifiers) +
    (modifiers.includes("void") ? 1 : 0) +
    (modifiers.includes("wandering") ? 1 : 0)
  );
};

export const keptDicesCount = ({ ring, modifiers = [] }) => {
  return (
    ring + (modifiers.includes("void") ? 1 : 0) + assistDiceCount(modifiers)
  );
};

export const isAlteration = (modifier) => {
  return (
    ["ishiken", "wandering"].includes(modifier) || isSpecialAlteration(modifier)
  );
};

const assistDiceCount = (modifiers) => {
  if (!modifiers?.length) {
    return 0;
  }

  return modifiers
    .filter((modifier) => /^(un)?skilledassist([0-9]{2})$/.test(modifier))
    .map((modifier) => parseInt(modifier.slice(-2)))
    .reduce((acc, val) => acc + val, 0);
};

export const countDices = (keptDices) => {
  return {
    successCount: keptDices.reduce(
      (acc, dice) =>
        acc + (dice.value.explosion || 0) + (dice.value.success || 0),
      0
    ),
    opportunityCount: keptDices.reduce(
      (acc, dice) => acc + (dice.value.opportunity || 0),
      0
    ),
    strifeCount: keptDices.reduce(
      (acc, dice) => acc + (dice.value.strife || 0),
      0
    ),
    blankCount: keptDices.filter(
      ({ value: { strife, opportunity, success, explosion } }) =>
        strife === 0 && opportunity === 0 && success === 0 && explosion === 0
    ).length,
  };
};

export const orderDices = (dices) => {
  const reorder = [...dices];

  reorder.sort((a, b) => {
    if (a.type === "ring" && b.type === "skill") {
      return -1;
    }
    if (b.type === "ring" && a.type === "skill") {
      return 1;
    }
    return 0;
  });

  return reorder;
};

export const isRerollOfType = ({ status, metadata }, rerollType) => {
  if (status !== "rerolled") {
    return false;
  }

  // Legacy
  if (!metadata.end) {
    return metadata.modifier === rerollType;
  }

  return metadata.end === rerollType;
};

export const isFromRerollOfType = ({ status, metadata }, rerollType) => {
  // Legacy
  if (!metadata.source && !metadata.end && metadata.modifier) {
    return status !== "rerolled" && metadata.modifier === rerollType;
  }

  return metadata.source === rerollType;
};

export const replaceRerollsOfType = ({
  dices,
  rerollType,
  previousRerollTypes = [],
  basePool,
}) => {
  const isRerollOfRightType = (dice) => isRerollOfType(dice, rerollType);

  const previousDices = () => {
    if (previousRerollTypes.length === 0) {
      return dices.slice(0, basePool);
    }

    const previousTypesMinusOne = [...previousRerollTypes];
    const previousType = previousTypesMinusOne.pop();

    return replaceRerollsOfType({
      dices,
      rerollType: previousType,
      previousRerollTypes: previousTypesMinusOne,
      basePool,
    });
  };

  const rerollResults = dices.filter((dice) =>
    isFromRerollOfType(dice, rerollType)
  );
  const ringResults = rerollResults.filter(({ type }) => type === "ring");
  const skillResults = rerollResults.filter(({ type }) => type === "skill");
  const getAppropriateResults = (type) => {
    if (type === "skill") {
      if (skillResults.length === 0) {
        return ringResults;
      }
      return skillResults;
    }

    if (ringResults.length === 0) {
      return skillResults;
    }
    return ringResults;
  };

  return previousDices().map((dice) => {
    if (isRerollOfRightType(dice)) {
      return getAppropriateResults(dice.type).shift();
    }
    return dice;
  });
};

export const replaceRerolls = ({ dices, rerollTypes, basePool }) => {
  const rerollCount = dices.filter(
    ({ status }) => status === "rerolled"
  ).length;
  if (rerollCount === 0) {
    return dices;
  }

  if (!basePool || !rerollTypes?.length) {
    return orderDices(dices.filter(({ status }) => status !== "rerolled"));
  }

  const previousRerollTypes = [...rerollTypes];
  const rerollType = previousRerollTypes.pop();

  return [
    ...replaceRerollsOfType({
      dices,
      rerollType,
      previousRerollTypes,
      basePool,
    }),
    ...dices.slice(basePool + rerollCount), // Explosions
  ];
};

export const splitExplosions = ({ dices, basePool, rerollTypes }) => {
  let split = [];
  let remainingDices = replaceRerolls({ dices, basePool, rerollTypes });
  let size =
    basePool +
    dices.filter(({ metadata }) => metadata?.source === "addkept").length;
  while (remainingDices.length > 0) {
    const currentDices = orderDices(remainingDices.slice(0, size));
    remainingDices = remainingDices.slice(size, remainingDices.length);
    size = currentDices.filter(
      ({ status, value: { explosion } }) => status === "kept" && explosion > 0
    ).length;
    split.push(currentDices);
  }
  return split;
};

const dieWeight = ({
  value: { success = 0, opportunity = 0, explosion = 0, strife = 0 },
}) => {
  return explosion * 10 + success * 5 + opportunity * 2 + strife * -1;
};

export const bestKeepableDice = (roll) => {
  const { dices, modifiers = [] } = roll;

  let pendingIndexes = [];
  dices.forEach(({ status, value: { strife = 0 } }, i) => {
    if (
      status === "pending" &&
      (!modifiers.includes("compromised") || strife === 0)
    ) {
      pendingIndexes.push(i);
    }
  });

  if (dices.some(({ status }) => status === "kept")) {
    return pendingIndexes;
  }

  return pendingIndexes
    .map((index) => {
      const die = dices[index];

      return {
        index,
        weight: dieWeight(die),
        type: die["type"],
      };
    })
    .sort(({ weight: a, type: tA }, { weight: b, type: tB }) => {
      if (a === b) {
        if (tA === tB) {
          return 0;
        }
        return tA > tB ? -1 : 1;
      }
      return a > b ? -1 : 1;
    })
    .map(({ index }) => index)
    .slice(0, keptDicesCount(roll));
};

export const bestDiceToReroll = ({ roll, max, restrictFunc }) => {
  const { dices, modifiers = [] } = roll;
  const compromised = modifiers.includes("compromised");

  let pendingIndexes = [];
  dices.forEach((die, i) => {
    const { status } = die;
    if (status === "pending" && (!restrictFunc || restrictFunc(die))) {
      pendingIndexes.push(i);
    }
  });

  return pendingIndexes
    .map((index) => {
      const die = dices[index];
      const {
        type,
        value: { strife = 0 },
      } = die;
      const weight = compromised && strife > 0 ? -100 : dieWeight(die);

      return {
        index,
        weight,
        type,
      };
    })
    .sort(({ weight: a, type: tA }, { weight: b, type: tB }) => {
      if (a === b) {
        if (tA === tB) {
          return 0;
        }
        return tA > tB ? -1 : 1;
      }
      return a < b ? -1 : 1;
    })
    .map(({ index }) => index)
    .slice(0, max);
};

export const getCustomLabel = ({ modifier, metadata }) => {
  if (DEPRECATED_REROLL_TYPES.includes(modifier)) {
    if (modifier === "sailor") {
      return `Storm Fleet Sailor School Ability`;
    }
    if (modifier === "shadow") {
      return `Ikoma Shadow School Ability`;
    }
    if (modifier === "2heavens") {
      return `Attacking a warding Mirumoto Two-Heavens Adept`;
    }
  }

  return metadata?.labels?.find(({ key }) => key === modifier)?.label;
};

export const getMysteriousModifierLabel = ({ modifier, metadata }) => {
  const isReroll = isSpecialReroll(modifier);
  const isAlteration = isSpecialAlteration(modifier);

  if (!isReroll && !isAlteration) {
    return `???`;
  }

  const customLabel = getCustomLabel({ modifier, metadata });

  if (!customLabel) {
    if (isAlteration) {
      return `Unspecified Alteration`;
    }
    return `Unspecified Reroll`;
  }

  if (isAlteration) {
    return `“${customLabel}” Alteration`;
  }
  return `“${customLabel}” Reroll`;
};
