export const pattern = /^\s*((\+|-)?\s*[0-9]+)(\s*((\+|-)\s*[0-9]+\s*)*)$/;

export const parse = (str) => {
  if (!str) {
    return false;
  }

  const matches = str.replace(/\s+/g, "").match(pattern);

  if (!matches) {
    return false;
  }

  let total = parseInt(matches[1]);

  if (!!matches[3]) {
    matches[3].match(/(\+|-)[0-9]+/g).forEach((v) => (total += parseInt(v)));
  }

  return total;
};
