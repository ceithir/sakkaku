// Caveat: Nothing has been done to avoid rounding errors piling up

export const binomial = (n, k) => {
  return factorial(n) / (factorial(n - k) * factorial(k));
};

const factorial = (n) => {
  if (n < 0) {
    throw "n must be >= 0";
  }
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
};

export const funcSum = ({ func, n, i = 0 }) => {
  let result = 0;
  for (let j = i; j <= n; j++) {
    result += func(j);
  }
  return result;
};

/**
 * Chances to get _exactly_ n success out of a given ring die
 */
export const pR = (n) => {
  if (n === 0) {
    return 1 / 2;
  }

  return Math.pow(1 / 6, n - 1) * (1 / 3 + (1 / 6) * (1 / 2));
};

/**
 * Chances to get _exactly_ n success out of a given skill die
 */
export const pS = (n) => {
  if (n === 0) {
    return 5 / 12;
  }

  return Math.pow(1 / 6, n - 1) * (5 / 12 + (1 / 6) * (5 / 12));
};

/**
 * Determine the different sums that can end up with a result of n
 * Example:
 * n=4 -> [
      [1, 1, 1, 1],
      [1, 1, 2],
      [1, 2, 1],
      [1, 3],
      [2, 1, 1],
      [2, 2],
      [3, 1],
      [4],
    ]
 */
export const combinations = (n, options = {}) => {
  const { maxCardinality = null } = options;

  // TODO: Check if a smoother algorithm exists
  const findCombinations = ({ n, candidate, storage, maxCardinality }) => {
    if (maxCardinality !== null && candidate.length > maxCardinality) {
      return;
    }

    const total = candidate.reduce((acc, val) => acc + val, 0);
    if (total < n) {
      const newCandidateA = [...candidate, 1];
      const newCandidateB = [...candidate];
      newCandidateB[newCandidateB.length - 1] =
        newCandidateB[newCandidateB.length - 1] + 1;
      findCombinations({
        n,
        candidate: newCandidateA,
        storage,
        maxCardinality,
      });
      findCombinations({
        n,
        candidate: newCandidateB,
        storage,
        maxCardinality,
      });
    }
    if (total === n) {
      storage.push(candidate);
    }
  };

  let storage = [];
  findCombinations({ n, candidate: [1], storage, maxCardinality });
  return storage;
};

/**
 * Same as previous except it groups together combinations identical but for sorting order
 * Example:
 * n=4 -> [
      { value: [1, 1, 1, 1], count: 1 },
      { value: [1, 1, 2], count: 3 },
      { value: [1, 3], count: 2 },
      { value: [2, 2], count: 1 },
      { value: [4], count: 1 },
    ]
 */
export const sortedCombinations = (n, options = {}) => {
  const sameArray = (a, b) => {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  };

  const combs = combinations(n, options);
  let result = [];
  let analyzedIndex = [];

  for (let i = 0; i < combs.length; i++) {
    if (analyzedIndex.includes(i)) {
      continue;
    }
    const value = [...combs[i]].sort();
    let count = 1;

    for (let j = i + 1; j < combs.length; j++) {
      if (sameArray(value, [...combs[j]].sort())) {
        count++;
        analyzedIndex.push(j);
      }
    }

    result.push({ value, count });
    analyzedIndex.push(i);
  }

  return result;
};

/**
 * Chances to _exactly_ match the TN out of a given roll assuming a "always pick highest" strategy
 */
const exactSuccess = ({ ring, skill, tn }) => {
  if (tn === 0) {
    return Math.pow(pR(0), ring) * Math.pow(pS(0), skill);
  }

  if (skill === 0) {
    return sortedCombinations(tn, { maxCardinality: ring }).reduce(
      (acc, { value, count }) => {
        const diceCount = value.length;
        return (
          acc +
          count *
            binomial(ring, diceCount) *
            value.reduce((acc, dieValue) => acc * pR(dieValue), 1) *
            Math.pow(pR(0), ring - diceCount)
        );
      },
      0
    );
  }

  if (ring === 1) {
    const exactlyXSuccessFromSkillDice = (x) =>
      binomial(skill, x) *
      Math.pow(pS(tn), x) *
      Math.pow(funcSum({ func: pS, n: tn - 1 }), skill - x);

    return (
      pR(tn) * Math.pow(funcSum({ func: pS, n: tn }), skill) +
      funcSum({ func: pR, n: tn - 1 }) *
        funcSum({
          func: exactlyXSuccessFromSkillDice,
          n: skill,
          i: 1,
        })
    );
  }

  throw "TODO";
};

/**
 * Chances to _at least_ match the tn out of a given roll
 */
export const cumulativeSuccess = ({ ring, skill, tn }) => {
  if (ring <= 0) {
    return tn <= 0 ? 1 : 0;
  }

  let result = 1;
  for (let i = 0; i < tn; i++) {
    result -= exactSuccess({ ring, skill, tn: i });
  }
  return result;
};
