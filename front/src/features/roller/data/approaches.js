export const rings = ["Air", "Earth", "Fire", "Water", "Void"];

export const skills = [
  {
    name: "Aesthetics",
    group: "Artisan",
  },
  {
    name: "Composition",
    group: "Artisan",
  },
  {
    name: "Design",
    group: "Artisan",
  },
  {
    name: "Smithing",
    group: "Artisan",
  },

  {
    name: "Command",
    group: "Social",
  },
  {
    name: "Courtesy",
    group: "Social",
  },
  {
    name: "Games",
    group: "Social",
  },
  {
    name: "Performance",
    group: "Social",
  },

  {
    name: "Culture",
    group: "Scholar",
  },
  {
    name: "Government",
    group: "Scholar",
  },
  {
    name: "Medicine",
    group: "Scholar",
  },
  {
    name: "Sentiment",
    group: "Scholar",
  },
  {
    name: "Theology",
    group: "Scholar",
  },

  {
    name: "Fitness",
    group: "Martial",
  },
  {
    name: "Martial Arts [Melee]",
    group: "Martial",
  },
  {
    name: "Martial Arts [Ranged]",
    group: "Martial",
  },
  {
    name: "Martial Arts [Unarmed]",
    group: "Martial",
  },
  {
    name: "Meditation",
    group: "Martial",
  },
  {
    name: "Tactics",
    group: "Martial",
  },

  {
    name: "Commerce",
    group: "Trade",
  },
  {
    name: "Labor",
    group: "Trade",
  },
  {
    name: "Seafaring",
    group: "Trade",
  },
  {
    name: "Skulduggery",
    group: "Trade",
  },
  {
    name: "Survival",
    group: "Trade",
  },
];

export const skillGroup = (skill) =>
  skills.find(({ name }) => name === skill)?.group;
