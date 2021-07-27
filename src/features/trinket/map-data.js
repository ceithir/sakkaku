const data = [
  { label: "Aokami Forest", x: 41, y: 37 },
  { label: "Authorized City", x: 42, y: 27 },
  { label: "Barracks of the Damned", x: 19, y: 70 },
  { label: "Battle Maiden Castle", x: 17, y: 17 },
  { label: "Beiden", x: 32, y: 31 },
  { label: "Benten Seido", x: 42, y: 50 },
  { label: "Black Crane Estates", x: 28, y: 74 },
  { label: "Black Tear Peak", x: 8, y: 75 },
  { label: "Buzzing Fly Village", x: 34, y: 30 },
  { label: "Carpenter Castle", x: 23, y: 64 },
  { label: "Castle of Learning", x: 31, y: 39 },
  { label: "Castle of Organization", x: 26, y: 33 },
  { label: "Castle of Pretending", x: 29, y: 43 },
  { label: "Castle of the Badger", x: 13, y: 8 },
  { label: "Castle of the Cat", x: 55, y: 19 },
  { label: "Castle of the Centipede", x: 44, y: 30 },
  { label: "Castle of the Dragonfly", x: 34, y: 21 },
  { label: "Castle of the Emerald Champion", x: 44, y: 30 },
  { label: "Castle of the Falcon", x: 16, y: 50 },
  { label: "Castle of the Forgotten", x: 18, y: 74 },
  { label: "Castle of the Fox", x: 29, y: 65 },
  { label: "Castle of the Hare", x: 28, y: 57 },
  { label: "Castle of the Nation", x: 17, y: 70 },
  { label: "Castle of the Sparrow", x: 26, y: 69 },
  { label: "Castle of the Swirt Sword", x: 31, y: 24 },
  { label: "Castle of the Wasp", x: 40, y: 48 },
  { label: "Cave of the Stone Children", x: 44, y: 56 },
  { label: "City of Honor's Sacrifice", x: 28, y: 24 },
  { label: "City of Lies", x: 27, y: 36 },
  { label: "City of Lightning", x: 43, y: 79 },
  { label: "City of the Rich Frog", x: 25, y: 23 },
  { label: "Clear Water Village", x: 27, y: 79 },
  { label: "Cliffside Shrine", x: 52, y: 5 },
  { label: "Daughter Village", x: 30, y: 56 },
  { label: "Daylight Castle", x: 12, y: 76 },
  { label: "Estemed Palaces of the Crane", x: 46, y: 45 },
  { label: "Fallen Chrysanthemum", x: 9, y: 91 },
  { label: "False Lantern Grove", x: 4, y: 82 },
  { label: "Far Traveler Castle", x: 15, y: 14 },
  { label: "Fire Tooth Castle", x: 36, y: 14 },
  { label: "Forgotten Tomb of Fu Leng", x: 2, y: 79 },
  { label: "Forgotten Village", x: 18, y: 54 },
  { label: "Friendly Traveler Village", x: 24, y: 84 },
  { label: "Gatherer of Winds Castle", x: 22, y: 27 },
  { label: "Great Day Castle", x: 14, y: 29 },
  { label: "Great Wall of the North", x: 27, y: 6 },
  { label: "Heaven's Wisdom Temple", x: 31, y: 73 },
  { label: "Hida Castle", x: 22, y: 77 },
  { label: "High House of Light", x: 30, y: 9 },
  { label: "Hirosaka", x: 46, y: 35 },
  { label: "Hisu Mori Village", x: 27, y: 21 },
  { label: "Hyozensho", x: 26, y: 18 },
  { label: "Isawa Elemental Academies", x: 52, y: 11 },
  { label: "Kaori Tea Farm", x: 32, y: 58 },
  { label: "Khanbulak", x: 5, y: 18 },
  { label: "Kudo Village", x: 32, y: 54 },
  { label: "Kurosunai Village", x: 14, y: 67 },
  { label: "Kyuden Kakita", x: 42, y: 40 },
  { label: "Kyuden Shika", x: 39, y: 36 },
  { label: "Lake of Sorrows", x: 39, y: 43 },
  { label: "Last Breath Castle", x: 37, y: 37 },
  { label: "Buzzing Fly Village", x: 34, y: 30 },
  { label: "Last Step Castle", x: 32, y: 18 },
  { label: "Loyalty Castle", x: 43, y: 34 },
  { label: "Maemikake", x: 29, y: 65 },
  { label: "Morning Glory Castle", x: 49, y: 19 },
  { label: "Nameless Village", x: 29, y: 22 },
  { label: "Narrow pass City", x: 47, y: 32 },
  { label: "Otosan Uchi", x: 46, y: 38 },
  { label: "Palace of the Mantis", x: 49, y: 74 },
  { label: "Plains Wind Monastery", x: 14, y: 23 },
  { label: "Pool of Vile Reflections", x: 7, y: 66 },
  { label: "Razor of the Dawn Castle", x: 15, y: 61 },
  { label: "Red Horn Village", x: 44, y: 16 },
  { label: "Rive of the Blind Monk", x: 42, y: 46 },
  { label: "River of the Lost", x: 10, y: 80 },
  { label: "Rugashi City", x: 34, y: 27 },
  { label: "Sacred Watch Palace", x: 32, y: 32 },
  { label: "Seppun Palace", x: 48, y: 34 },
  { label: "Sheltered Plains City", x: 47, y: 16 },
  { label: "Shiba Castle", x: 53, y: 17 },
  { label: "Shimomura", x: 36, y: 48 },
  { label: "Shinden Kasai", x: 25, y: 47 },
  { label: "Shinomen Forest", x: 19, y: 41 },
  { label: "Shinsei's Last Hope", x: 19, y: 88 },
  { label: "Shizuka Toshi", x: 43, y: 43 },
  { label: "Shrine of the Ki-Rin", x: 41, y: 16 },
  { label: "Silent Ones Monastery", x: 23, y: 34 },
  { label: "Silk and Shadow Palace", x: 31, y: 45 },
  { label: "Slow Tide Harbor", x: 49, y: 37 },
  { label: "Son of the Crane", x: 40, y: 41 },
  { label: "Spine of the World", x: 15, y: 25 },
  { label: "Swirling Pool Village", x: 24, y: 76 },
  { label: "Tangles Path Village", x: 30, y: 56 },
  { label: "Temple of Listening Ghosts", x: 34, y: 35 },
  { label: "Temple of the Burned Monk", x: 42, y: 21 },
  { label: "Temple of the Morning Sun", x: 30, y: 79 },
  { label: "The Defiled Court of Lady Yukiko", x: 11, y: 84 },
  { label: "The Lost Library", x: 5, y: 89 },
  { label: "The Port That Never Sleeps", x: 34, y: 68 },
  { label: "The Summerlands", x: 32, y: 64 },
  { label: "Tsuma", x: 44, y: 41 },
  { label: "Tsumegiri's Blood Nourished Tree", x: 2, y: 73 },
  { label: "Twilight Mountains", x: 4, y: 66 },
  { label: "Twin Blessing Village", x: 44, y: 37 },
  { label: "Uebe Marshes", x: 32, y: 51 },
  { label: "Violence Gehind Courtliness City", x: 39, y: 24 },
  { label: "Wall Above the Ocean Village", x: 43, y: 60 },
  { label: "Water Music Village", x: 41, y: 66 },
  { label: "West Mountain Village", x: 21, y: 73 },
  { label: "Whirlpool of the Great Sea Spider", x: 38, y: 77 },
];

export default data;
