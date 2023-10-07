const TABLES = {
  core: {
    name: "Core Rulebook (page 96)",
    entries: [
      {
        name: "Famous Deed",
        min: 1,
        max: 1,
        description:
          "One of your ancestors won a great victory for their clan or even the Emperor, and was rewarded with an item of incredible quality.",
        modifier: "Increase your glory by 3.",
        effect: {
          intro:
            "Roll a ten-sided die again and add the resulting family heirloom to your starting items (",
          outro:
            "). You choose one quality and the GM chooses one quality from the list of item qualities, on page 240 of the core rulebook; these are applied to the item.",
          options: [
            {
              min: 1,
              max: 3,
              text: "a weapon",
            },
            {
              min: 4,
              max: 6,
              text: "a set of armor",
            },
            {
              min: 7,
              max: 8,
              text: "another item",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or other animal",
            },
            {
              min: 10,
              max: 10,
              text: "a boat or estate",
            },
          ],
        },
      },
      {
        name: "Glorious Sacrifice",
        min: 2,
        max: 2,
        description:
          "One of your ancestors perished nobly in battle, and one of their signature items vanished with them or was lost in the subsequent years.",
        modifier: "Increase your honor by 5 and your glory by 5.",
        effect: {
          intro:
            "Roll a ten-sided die again to determine your lost family heirloom (",
          outro:
            "), which exists somewhere in the world. You choose one quality and the GM chooses one quality; these are applied to the item. You do not know where the heirloom is, but you could later reclaim it during the campaign.",
          options: [
            {
              min: 1,
              max: 3,
              text: "a weapon",
            },
            {
              min: 4,
              max: 6,
              text: "a set of armor",
            },
            {
              min: 7,
              max: 8,
              text: "another item",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or other animal",
            },
            {
              min: 10,
              max: 10,
              text: "a boat or estate",
            },
          ],
        },
      },
      {
        name: "Wondrous Work",
        min: 3,
        max: 3,
        description:
          "One of your ancestors crafted a piece of great beauty that won renown for your family, and others expect you to live up to that legacy.",
        modifier: "Increase your glory by 5.",
        effect: {
          intro: "Roll a ten-sided die again to determine an Artisan skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Aesthetics",
            },
            {
              min: 4,
              max: 6,
              text: "Composition",
            },
            {
              min: 7,
              max: 8,
              text: "Design",
            },
            {
              min: 9,
              max: 10,
              text: "Smithing",
            },
          ],
        },
      },
      {
        name: "Dynasty Builder",
        min: 4,
        max: 4,
        description:
          "One of your ancestors was instrumental in the rise of a powerful lord, using cunning stratagems and shrewd advice to secure their ascension. You have heard this story many times and know the importance of power subtly wielded.",
        modifier: "Decrease your glory by 3.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Social skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Command",
            },
            {
              min: 4,
              max: 6,
              text: "Courtesy",
            },
            {
              min: 7,
              max: 8,
              text: "Games",
            },
            {
              min: 9,
              max: 10,
              text: "Performance",
            },
          ],
        },
      },
      {
        name: "Discovery",
        min: 5,
        max: 5,
        description:
          "One of your ancestors made an incredible discovery, invented something of great importance, or uncovered an ancient secret. Thanks to family lore, you have at least a rudimentary understanding of the subject of their discovery.",
        modifier: "Increase your glory by 3.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Scholar skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Culture",
            },
            {
              min: 4,
              max: 5,
              text: "Sentiment",
            },
            {
              min: 6,
              max: 7,
              text: "Government",
            },
            {
              min: 8,
              max: 9,
              text: "Medicine",
            },
            {
              min: 10,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Ruthless Victor",
        min: 6,
        max: 6,
        description:
          "One of your ancestors claimed a bloody victory over a rival, smashing their forces with a cunning maneuver or seizing their domain after vanquishing them in battle. From this relative or their story, you learned well the importance of brute force.",
        modifier: "Decrease your honor by 5.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Martial skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Fitness",
            },
            {
              min: 4,
              max: 5,
              text: "Martial Arts [Melee]",
            },
            {
              min: 6,
              max: 7,
              text: "Martial Arts [Ranged]",
            },
            {
              min: 8,
              max: 8,
              text: "Martial Arts [Unarmed]",
            },
            {
              min: 9,
              max: 9,
              text: "Tactics",
            },
            {
              min: 10,
              max: 10,
              text: "Meditation",
            },
          ],
        },
      },
      {
        name: "Elevated for Service",
        min: 7,
        max: 7,
        description:
          "One of your ancestors was a jizamurai or even a commoner who served with such distinction that their position was elevated to that of a Great Clan samurai by marriage or mandate of a daimyō. As a child, you learned the basics of the skills for which they won their esteem.",
        modifier: "Decrease your glory by 3 and increase your honor by 3.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Trade skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Commerce",
            },
            {
              min: 4,
              max: 5,
              text: "Labor",
            },
            {
              min: 6,
              max: 7,
              text: "Seafaring",
            },
            {
              min: 8,
              max: 8,
              text: "Skulduggery",
            },
            {
              min: 9,
              max: 10,
              text: "Survival",
            },
          ],
        },
      },
      {
        name: "Stolen Knowledge",
        min: 8,
        max: 8,
        description:
          "One of your ancestors learned a secret of another school and clandestinely passed it down through the ages; now, it has reached you.",
        modifier: "Decrease your honor by 5.",
        effect: {
          intro:
            "You know one additional technique. Roll a ten-sided die again to determine the category (",
          outro:
            "), and then select one technique with a prerequisite of school rank 1 and learn that technique. You can perform that technique even if it is not normally allowed by your school.",
          options: [
            {
              min: 1,
              max: 3,
              text: "kata",
            },
            {
              min: 4,
              max: 6,
              text: "shūji",
            },
            {
              min: 7,
              max: 7,
              text: "ritual",
            },
            {
              min: 8,
              max: 8,
              text: "invocation",
            },
            {
              min: 9,
              max: 9,
              text: "kihō",
            },
            {
              min: 10,
              max: 10,
              text: "mahō or ninjutsu",
            },
          ],
        },
      },
      {
        name: "Imperial Heritage",
        min: 9,
        max: 9,
        description: "You can trace your lineage back to the Imperial line.",
        modifier: "Increase your status by 10.",
        effect:
          "You gain the Blessed Lineage advantage (see page 103 of the core rulebook) (this can be assigned in excess of the normal limitations on advantages at character creation).",
      },
      {
        name: "Unusual Name Origin",
        min: 10,
        max: 10,
        description:
          "Your character was not named for an ancestor—perhaps they were named for an outsider who did a great service to the clan, perhaps their name was bestowed upon them for a unique deed, or perhaps someone was trying to send a specific message in the selection of their name.",
        modifier: "Decrease your glory by 3.",
        effect:
          "Choose two of your character’s rings; you may reduce the value of one of these rings by 1 to increase the value of the other by 1 (this still cannot raise a ring above 3). If you do not do so, choose one item of rarity 6 or lower and assign it to your starting outfit.",
      },
    ],
  },
  court: {
    name: "Courts of Stone (page 104)",
    entries: [
      {
        name: "Dishonorable Cheat",
        min: 1,
        max: 1,
        description:
          "One of your kin was caught cheating in a high-profile duel. Instead of committing seppuku to purge their dishonor and redeem their family, they ran away and became a rōnin, disgracing their bloodline.",
        modifier: "Decrease your glory by 5.",
        effect: {
          intro:
            "Roll a ten-sided die to determine a skill to aid you in bringing your disgraced kin to justice (",
          outro: ").",
          options: [
            {
              min: 1,
              max: 3,
              text: "Martial Arts [Choose One]",
            },
            {
              min: 4,
              max: 6,
              text: "Survival",
            },
            {
              min: 7,
              max: 10,
              text: "Government",
            },
          ],
        },
      },
      {
        name: "Triumph over the Lion",
        min: 2,
        max: 3,
        description:
          "In your family line one of your ancestors held a decisive victory over the Lion. It may have been a duel, a critical game of Go, a battle, or any number of things. The circumstances are irrelevant; the Lion were embarrassed, and your ancestor brought honor to your clan.",
        modifier: "Increase your honor by 5.",
        effect: {
          intro:
            "Roll a ten-sided die and add the resulting family heirloom to your starting items (",
          outro:
            "). You choose one quality and the GM chooses one quality from the list of item qualities; these are applied to the item.",
          options: [
            {
              min: 1,
              max: 3,
              text: "a weapon",
            },
            {
              min: 4,
              max: 6,
              text: "a game set of your choice",
            },
            {
              min: 7,
              max: 8,
              text: "some other item relevant to your ancestor’s victory",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or another animal",
            },
            {
              min: 10,
              max: 10,
              text: "the deed to a small piece of land on the border of Lion territory",
            },
          ],
        },
      },
      {
        name: "Unforgivable Performance",
        min: 4,
        max: 5,
        description:
          "In the recent past one of your kin gave a truly horrible performance in the presence of the Imperial line. Through their embarrassing acting in a scene they caused the Emperor to leave the theatre and now rumors abound of your family being cursed by the Fortunes for such a failure.",
        modifier: "Decrease your status by 3.",
        effect: {
          intro:
            "You gain the Benten’s Curse (Air) disadvantage (see page 116 of the core rulebook). Roll a ten-sided die to determine a skill that will help redeem your family (",
          outro: ").",
          options: [
            {
              min: 1,
              max: 3,
              text: "Performance",
            },
            {
              min: 4,
              max: 6,
              text: "Culture",
            },
            {
              min: 7,
              max: 9,
              text: "Command",
            },
            {
              min: 10,
              max: 10,
              text: "Courtesy",
            },
          ],
        },
      },
      {
        name: "Triumph During Gempuku",
        min: 6,
        max: 7,
        description:
          "One of your parents was a Topaz Champion and brought honor to your clan and your family.",
        modifier: "Increase your honor and glory by 3.",
        effect:
          "You gain the Support of the Kakita Dueling Academy distinction, where the Topaz Championship takes place.",
      },
      {
        name: "A Little Too Close to Heaven",
        min: 8,
        max: 9,
        description:
          "One of your ancestors is rumored to have had an illegitimate child with an Emperor. While you may be able to link your heritage to the Imperial line, the disgrace of such an affair stains this joy.",
        modifier: "Increase your status by 5 and decrease your honor by 5.",
        effect: {
          intro:
            "Roll a ten-sided die to determine a skill that can aid you in discovering the truth about your lineage (",
          outro: ").",
          options: [
            {
              min: 1,
              max: 2,
              text: "Government",
            },
            {
              min: 3,
              max: 4,
              text: "Commerce",
            },
            {
              min: 5,
              max: 6,
              text: "Sentiment",
            },
            {
              min: 7,
              max: 8,
              text: "Meditation",
            },
            {
              min: 9,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Elegant Craftsman",
        min: 10,
        max: 10,
        description:
          "Your ancestor was a truly gifted artisan and produced in their lifetime a masterwork that is still renowned today. You now live in the shadow of this ancestor, and your clan expects your complete focus in bringing glory to your line once again.",
        modifier: "Increase your glory by 5.",
        effect:
          "You gain the Isolation anxiety (see page 103 of Courts of Stone). Choose one of your character’s rings; you may reduce the value of this ring by 1 to increase the value of your Fire or Air Ring by 1 (this still cannot raise it above 3).",
      },
    ],
  },
  shadowlands: {
    name: "Shadowlands (page 101)",
    entries: [
      {
        name: "Blood and Mortar",
        min: 1,
        max: 1,
        description:
          "You can unequivocally trace your lineage back to the earliest days of the Kaiu Wall. It is said that the blood of your family is mixed with the mortar holding together the first stones of the Wall.",
        modifier: "Increase your status by 3.",
        effect:
          "You gain the Blessed Lineage advantage (see page 103 of the core rulebook). This can be assigned in excess of the normal limitations on disadvantages at character creation. While on the Wall, your glory rank is treated as 1 higher.",
      },
      {
        name: "Infamous Builder",
        min: 2,
        max: 3,
        description:
          "One of your distant ancestors designed and built a fortification or weapon that failed at a crucial moment. Many samurai perished as a result, and your ancestor’s name is still cursed to this day.",
        modifier: "Decrease your glory by 5.",
        effect: {
          intro:
            "Roll a ten-sided die again to determine a skill to aid in restoring your ancestor’s name (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Government",
            },
            {
              min: 4,
              max: 6,
              text: "Labor",
            },
            {
              min: 7,
              max: 10,
              text: "Smithing",
            },
          ],
        },
      },
      {
        name: "Lost in the Darkness",
        min: 4,
        max: 5,
        description:
          "One of your ancestors vanished in the Shadowlands. Rumors dog your family that your ancestor simply fled out of cowardice... or that they even came to embrace corruption as one of the fallen samurai known as the Lost. One day you vow to learn the truth of the matter.",
        modifier: "Increase your honor by 5 and decrease your glory by 5.",
        effect: {
          intro:
            "Roll a ten-sided die again to determine a skill to aid in learning of your ancestor’s fate (",
          outro:
            "); gain +1 rank in that skill. Additionally, your ancestor might still be alive, in the Shadowlands...waiting.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Culture",
            },
            {
              min: 4,
              max: 6,
              text: "Survival",
            },
            {
              min: 7,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Vengeance for the Fallen",
        min: 6,
        max: 7,
        description:
          "Your ancestor fought many battles against the Shadowlands, and finally fell while facing an immensely powerful oni. Your ancestor calls to you to find and destroy the vile creature responsible for their death, for only then can they find true peace in the afterlife.",
        modifier: "Increase your honor by 5.",
        effect: {
          intro:
            "You gain the Haunting (Void) adversity (see page 122 of the core rulebook). This can be assigned in excess of the normal limitations on disadvantages at character creation. Roll a ten-sided die again to determine a Martial skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Fitness",
            },
            {
              min: 4,
              max: 5,
              text: "Martial Arts [Melee]",
            },
            {
              min: 6,
              max: 7,
              text: "Martial Arts [Ranged]",
            },
            {
              min: 8,
              max: 8,
              text: "Martial Arts [Unarmed]",
            },
            {
              min: 9,
              max: 9,
              text: "Tactics",
            },
            {
              min: 10,
              max: 10,
              text: "Meditation",
            },
          ],
        },
      },
      {
        name: "Twenty Goblin Thief",
        min: 8,
        max: 9,
        description:
          "The Crab periodically announce a “Twenty Goblin Winter,” during which rōnin who return with the heads of twenty goblins are accepted as members of the Crab Clan. One of your ancestors is said to have stolen heads from another rōnin and claimed the heads as their own.",
        modifier: "Decrease your glory by 3.",
        effect: {
          intro:
            "Roll a ten-sided die again to determine a skill to aid in learning of your ancestor’s fate (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Culture",
            },
            {
              min: 4,
              max: 6,
              text: "Skulduggery",
            },
            {
              min: 7,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Tainted Blood",
        min: 10,
        max: 10,
        description:
          "Your ancestor is rumored to have flouted Imperial law and hidden their Taint. Worse, you worry that perhaps your bloodline is also corrupted, and a foul influence still lurks deep in your being— and that it influences you in subtle and insidious ways.",
        modifier: "Decrease your status by 3.",
        effect:
          "You gain the Fallen Ancestor disadvantage (see page 98 of the Shadowlands book). Choose one of your character’s rings; you may reduce the value of that ring by 1 to increase the value of your Void Ring by 1 (this still cannot raise it above 3).",
      },
    ],
  },
  celestial: {
    name: "Celestial Realms (page 95)",
    entries: [
      {
        name: "Associated with a Natural Disaster",
        min: 1,
        max: 1,
        description:
          "An ancestor, through folly or hubris, caused or responded problematically to a natural disaster. They may have abused the power of the kami or taken flawed action such as refusing to allocate funds to repair a dam, leading poorly during a tsunami, or ignoring the severity of a plague outbreak.",
        modifier: "Decrease your honor by 3.",
        effect:
          "You gain the Whispers of Failure (Fire) adversity (see page 130 of the core rulebook). You may reduce the value of one of your character’s rings by 1 to increase the value of a ring associated with the disaster—such as Earth for an earthquake or Water for a tsunami—by 1 (this still cannot raise a ring above 3).",
      },
      {
        name: "Great Treatise",
        min: 2,
        max: 2,
        description:
          "One of your kin has written a scholarly text, religious treatise, philosophical essay, or collection of poems known through- out the Emerald Empire.",
        modifier: "Increase your status by 3.",
        effect: {
          intro:
            "Roll a ten-sided die again to determine a skill your family values (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Composition",
            },
            {
              min: 4,
              max: 6,
              text: "Culture",
            },
            {
              min: 7,
              max: 8,
              text: "Government",
            },
            {
              min: 9,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Guardian of Forbidden Knowledge",
        min: 3,
        max: 4,
        description:
          "One of your kin guards or once guarded a reliquary of forbidden knowledge. Either your family still has responsibility for guarding the reliquary, or it has gone missing.",
        modifier: "Decrease your status by 5.",
        effect: {
          intro:
            "Roll a ten-sided die again to determine the skill your family uses to guard this knowledge (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Martial Arts [Melee]",
            },
            {
              min: 4,
              max: 6,
              text: "Government",
            },
            {
              min: 7,
              max: 8,
              text: "Theology",
            },
            {
              min: 9,
              max: 10,
              text: "Skulduggery",
            },
          ],
        },
      },
      {
        name: "Mark of the Elements",
        min: 5,
        max: 6,
        description:
          "An ancestor had a story—perhaps true, perhaps apocryphal—of having been blessed by an element: i.e., was born of Fire, couldn’t drown or could swim as a baby, fell a great distance and didn’t get hurt, was buried alive but survived, etc.",
        modifier: "Increase your status by 5.",
        effect:
          "Choose one of your character’s rings; you may reduce the value of that ring by 1 to increase the value of the ring associated with the element by 1 (this still cannot raise a ring above 3).",
      },
      {
        name: "Sacrifice",
        min: 7,
        max: 8,
        description:
          "A forebear sacrificed something for the greater good of their clan or the Empire. The sacrifice doesn’t necessarily mean their life. It could have been as personal as love or family, but it should illustrate giving up an individual want, need, or desire for the good of society.",
        modifier: "Increase your glory by 5.",
        effect: {
          intro:
            "Roll a ten-sided die again and add the resulting heirloom to your starting items (",
          outro:
            "). You choose one item quality and the GM chooses another from the list of item qualities starting on page 240 of the core rulebook; these are applied to the item.",
          options: [
            {
              min: 1,
              max: 3,
              text: "a weapon",
            },
            {
              min: 4,
              max: 6,
              text: "a set of armor",
            },
            {
              min: 7,
              max: 8,
              text: "a valued piece of art",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or other animal",
            },
            {
              min: 10,
              max: 10,
              text: "the deed to a small piece of land on the border of Phoenix territory",
            },
          ],
        },
      },
      {
        name: "Spirit of the Phoenix",
        min: 9,
        max: 9,
        description:
          "One of your kin was reborn, either literally from death or figuratively through a public religious conversion, personal Enlightenment, or a famous second career after some debilitating trouble.",
        modifier: "Increase your glory by 3.",
        effect: {
          intro:
            "You gain an advantage associated with your predecessor’s rebirth (this can be assigned in excess of the normal limitations on advantages at character creation). Roll a ten-sided die again and add the resulting advantage (",
          outro: ").",
          options: [
            {
              min: 1,
              max: 2,
              text: "Famously Kind",
            },
            {
              min: 3,
              max: 4,
              text: "Famously Lucky",
            },
            {
              min: 5,
              max: 6,
              text: "Famously Reliable",
            },
            {
              min: 7,
              max: 8,
              text: "Famously Successful",
            },
            {
              min: 9,
              max: 10,
              text: "Famously Wealthy",
            },
          ],
        },
      },
      {
        name: "Touched by the Fortunes",
        min: 10,
        max: 10,
        description:
          "An ancestor spent too much time with the Fortunes and forgot their humanity, or saw a mystical truth too terrible to bear.",
        modifier: "Decrease your glory by 5.",
        effect:
          "You gain the Sixth Sense distinction (see page 110 of the core rulebook) (this can be assigned in excess of the normal limitations on advantages at character creation).",
      },
    ],
  },
  victory: {
    name: "Fields of Victory (pages 86-87)",
    entries: [
      {
        name: "Born on the Battlefield",
        min: 1,
        max: 1,
        description:
          "One of your ancestors was born amid war and bloodshed, even if not literally on the front lines. The omens of your birth reflect an affinity for that ancestor, as such omens have done for others in your family line.",
        modifier: "Decrease your glory by 3.",
        effect:
          "You gain the Guiding Ancestor (Void) distinction (see page 82 of Fields of Victory).",
      },
      {
        name: "Strategic Mastermind",
        min: 2,
        max: 2,
        description:
          "You are descended from a warrior known for their cunning and wartime acumen.",
        modifier: "Increase your glory by 5 and decrease your honor by 5.",
        effect: {
          intro:
            "Roll a ten-sided die to determine a skill you learned by studying your ancestor’s deeds (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 2,
              text: "Tactics",
            },
            {
              min: 3,
              max: 4,
              text: "Command",
            },
            {
              min: 5,
              max: 6,
              text: "Government",
            },
            {
              min: 7,
              max: 8,
              text: "Culture",
            },
            {
              min: 9,
              max: 9,
              text: "Commerce",
            },
            {
              min: 10,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Victory against the Crane",
        min: 3,
        max: 3,
        description:
          "In your family, one of your ancestors held a decisive victory over the Crane. It may have been a battle, a game of shōgi, a duel, or any number of other things. The circumstances are irrelevant; the Crane were humbled, and your ancestor brought honor to your clan.",
        modifier: "Increase your glory by 3.",
        effect: {
          intro:
            "Roll a ten-sided die and add the following family heirloom to your starting items (",
          outro:
            "). In addition of its other properties, the item is a battlefield heirloom (see page 90 of Fields of Victory).",
          options: [
            {
              min: 1,
              max: 3,
              text: "a weapon",
            },
            {
              min: 4,
              max: 6,
              text: "a game set of your choice",
            },
            {
              min: 7,
              max: 8,
              text: "some other item relevant to your ancestor’s victory",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or other animal",
            },
            {
              min: 10,
              max: 10,
              text: "the deed to a small piece of land on the border of Crane territory",
            },
          ],
        },
      },
      {
        name: "Victory against Invaders",
        min: 4,
        max: 4,
        description:
          "The Lion Clan’s foremost duty is to protect the Empire from outside threats, and one of your kin acquitted themselves honorably in this endeavor long ago.",
        modifier: "Increase your honor by 3.",
        effect: {
          intro:
            "Roll a ten-sided die to determine a skill you learned to honor your ancestor (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 2,
              text: "Command",
            },
            {
              min: 3,
              max: 4,
              text: "Government",
            },
            {
              min: 5,
              max: 6,
              text: "Tactics",
            },
            {
              min: 7,
              max: 8,
              text: "Survival",
            },
            {
              min: 9,
              max: 9,
              text: "Theology",
            },
            {
              min: 10,
              max: 10,
              text: "Meditation",
            },
          ],
        },
      },
      {
        name: "Shamed by Defeat",
        min: 5,
        max: 5,
        description:
          "Among your kin is one who failed the clan. Whether they were beaten in battle or a duel, humiliated in court, or something else, the need to redeem your line burns within you and drive you to excel.",
        modifier: "Decrease your glory by 3.",
        effect:
          "Choose of the starting skills for your school in which your character has no ranks; gain +1 rank in that skill.",
      },
      {
        name: "Blade of 10,000 Battles",
        min: 6,
        max: 6,
        description:
          "You have been entrusted with a storied weapon, with an ancient history and lineage, and you must prove worthy to continue its legacy.",
        modifier: "Increase your glory by 3.",
        effect:
          "Choose a weapon and add it to your starting outfit. At the GM’s discretion, certain weapons may be inappropriate choices and cannot be selected. In addition to being a weapon, this item is a battlefield heirloom (see page 90 of Fields of Victory).",
      },
      {
        name: "Lost Heirloom",
        min: 7,
        max: 7,
        description:
          "An ancestor of yours was once entrusted with a peerless weapon, but through their own failure, they lost it. It may have been taken by another clan as a trophy in battle after your ancestor’s defeat, stolen by bandits or shinobi, or even dishonorably sold to cover gambling debts. Whatever its fate, it has fallen to you to recover it.",
        modifier: "Increase your honor by 5 and decrease your glory by 3.",
        effect:
          "Choose a weapon to be the lost heirloom, which is now held by some individual or group hostile to you or your clan. At the GM’s discretion, certain weapons may be inappropriate choices and cannot be selected. In addition to being a weapon, this item is a battlefield heirloom (see page 90 of Fields of Victory).",
      },
      {
        name: "Selfless Sentinel",
        min: 8,
        max: 8,
        description:
          "Your ancestor was not well-known or highly favored, but they served with honor, if not glory, and protected Lion lands from attack for all their life.",
        modifier: "Increase your honor by 5 and decrease your glory by 3.",
        effect:
          "Gain the Traditional Adherent (Earth) distinction (see page 82 of Fields of Victory).",
      },
      {
        name: "Mighty Conqueror",
        min: 9,
        max: 9,
        description:
          "One of your ancestors once seized a valuable prize for the Lion Clan in a past war, such as a village, castle, or valuable hostage. The benefits of this prize still come to those of their descent.",
        modifier: "Increase your glory by 3 and decrease your honor by 3.",
        effect:
          "Choose one: double your starting koku, add one item of rarity 6 or lower to your starting items that is a battlefield heirloom (see page 90 of Fields of Victory) in addition to its other properties, or gain the Glorious Deeds passion (see page 83 of Fields of Victory).",
      },
      {
        name: "Right Hand of the Emperor",
        min: 10,
        max: 10,
        description:
          "The crowning glory of your line is the victory one of your ancestors won in the name of a past Emperor. They may have crushed an enemy of the Empire, won great political favor, or even been a close associate or friend of the Emperor in times past. As such, the Imperial families have more respect for you than for most clan samurai—and they expect you to achieve accomplishments as glorious as those of your ancestor.",
        modifier: "Increase your status by 3.",
        effect:
          "Gain the Support of [One Group] distinction. The group chosen must be the Seppun, Otomo, or Miya family, or the Imperial Legions.",
      },
    ],
  },
  custom: {
    name: "Other / Custom",
  },
};

export const entry = ({ table, firstRoll, secondRoll }) => {
  if (!firstRoll) {
    return {
      name: `TBD`,
      description: `TBD`,
      modifier: `TBD`,
      effect: `TBD`,
    };
  }

  if (!table || table === "custom") {
    const stringRoll = [firstRoll, secondRoll].filter(Boolean).join(" / ");

    return {
      name: stringRoll,
      description: `TBD (you rolled: ${stringRoll})`,
      modifier: `TBD`,
      effect: `TBD`,
    };
  }

  return TABLES[table]["entries"].find(
    ({ min, max }) => min <= firstRoll && max >= firstRoll
  );
};

export default TABLES;
