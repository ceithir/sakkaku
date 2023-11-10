export const parse = (str) => {
  if (!str) {
    return false;
  }

  const s = str.replace(/\s+/g, "").toLowerCase();
  const matches = s.match(
    /^([0-9]+)k([0-9]+)((\+|-)([0-9]+k[0-9]+|[0-9]+))*(#[0-9]+)?$/
  );

  if (!matches) {
    return false;
  }
  let roll = parseInt(matches[1]);
  let keep = parseInt(matches[2]);
  let modifier = 0;

  const plusXKeepYGroups = s.match(/\+[0-9]+k[0-9]+/g);
  if (!!plusXKeepYGroups) {
    plusXKeepYGroups.forEach((plusXKeepY) => {
      const [, extraRoll, extraKeep] = plusXKeepY.match(
        /^\+([0-9]+)k([0-9]+)$/
      );
      roll += parseInt(extraRoll);
      keep += parseInt(extraKeep);
    });
  }
  const minusXKeepYGroups = s.match(/-[0-9]+k[0-9]+/g);
  if (!!minusXKeepYGroups) {
    minusXKeepYGroups.forEach((minusXKeepY) => {
      const [, extraRoll, extraKeep] =
        minusXKeepY.match(/^-([0-9]+)k([0-9]+)$/);
      roll -= parseInt(extraRoll);
      keep -= parseInt(extraKeep);
    });
  }

  const modifiers = s.match(/(\+|-)[0-9]+(?!k)/g);
  if (!!modifiers) {
    modifiers.forEach((mod) => {
      modifier += parseInt(mod);
    });
  }

  if (keep <= 0 || roll <= 0) {
    return false;
  }

  const result = { roll, keep, modifier };

  const rMatches = s.match(/#([0-9]+)$/);
  if (!!rMatches) {
    const repeat = parseInt(rMatches[1]);
    if (repeat < 1) {
      return false;
    }
    if (repeat > 1) {
      result["repeat"] = Math.min(parseInt(rMatches[1]), 10);
    }
  }

  return result;
};

export const cap = ({ roll, keep, modifier = 0 }) => {
  if (roll < 10 || (roll === 10 && keep <= 10)) {
    return { roll, keep: keep > roll ? roll : keep, modifier };
  }

  let cappedRoll = roll;
  let cappedKeep = keep;
  let updatedModifier = modifier;

  while (cappedRoll > 10) {
    if (cappedKeep < 10) {
      if (cappedRoll === 11) {
        cappedRoll = 10;
      } else {
        cappedRoll -= 2;
        cappedKeep += 1;
      }
    } else {
      cappedRoll -= 1;
      updatedModifier += 2;
    }
  }
  while (cappedKeep > 10) {
    cappedKeep -= 1;
    updatedModifier += 2;
  }
  return { roll: cappedRoll, keep: cappedKeep, modifier: updatedModifier };
};

export const stringify = ({ roll, keep, modifier }) => {
  return `${roll}k${keep}${
    !!modifier ? (modifier > 0 ? `+${modifier}` : modifier) : ""
  }`;
};
