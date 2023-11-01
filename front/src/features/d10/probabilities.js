export const getProbability = (
  rawData,
  { roll, keep, tn, explosions = [10], rerolls = [] }
) => {
  let key = `${roll}k${keep}`;
  if (rerolls.includes(1)) {
    key += "e";
  }
  if (explosions.length === 0) {
    key += "ne";
  }
  if (explosions.includes(9)) {
    key += "_e9";
  }

  const chancesToAchieveEachResultBelowTn = rawData[key].slice(0, tn - 1);
  return Math.round(
    100 -
      chancesToAchieveEachResultBelowTn.reduce((acc, val) => acc + val[1], 0)
  );
};
