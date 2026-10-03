(() => {
  "use strict";

  // 7 adorable, distinct candy varieties using ultra-polished, cute 3D assets:
  // 1. Rainbow Swirl Lollipop (candy_swirl_pop.png)
  // 2. Halloween Candy Corn (candy_corn.png)
  // 3. Pink Strawberry Twist (candy_twist_pink.png)
  // 4. Emerald Gummy Bear (candy_gummy_bear.png)
  // 5. Royal Purple & Gold Truffle (candy_chocolate_truffle.png)
  // 6. Orange & Lemon Citrus Twist (candy_twist_citrus.png)
  // 7. Spooky Cute Pumpkin Sugar Drop (candy_pumpkin_drop.png)

  const CANDIES = [
    {
      id: "swirl-pop",
      name: "Rainbow Swirl Pop",
      src: "assets/candy_swirl_pop.png"
    },
    {
      id: "candy-corn",
      name: "Candy Corn",
      src: "assets/candy_corn.png"
    },
    {
      id: "twist-pink",
      name: "Strawberry Twist",
      src: "assets/candy_twist_pink.png"
    },
    {
      id: "gummy-bear",
      name: "Emerald Gummy Bear",
      src: "assets/candy_gummy_bear.png"
    },
    {
      id: "chocolate-truffle",
      name: "Purple Gold Truffle",
      src: "assets/candy_chocolate_truffle.png"
    },
    {
      id: "twist-citrus",
      name: "Citrus Twist",
      src: "assets/candy_twist_citrus.png"
    },
    {
      id: "pumpkin-drop",
      name: "Pumpkin Sugar Drop",
      src: "assets/candy_pumpkin_drop.png"
    }
  ];

  // Trick-or-Treat Street houses. sign: where the door's sign panel sits, as % of the image (center x, center y).
  const HOUSE_LIST = [
    { src: "assets/house_purple.png", ratio: 420 / 330, sign: [49.6, 66.3] },
    { src: "assets/house_orange.png", ratio: 420 / 367, sign: [49.4, 66.4] },
    { src: "assets/house_green.png", ratio: 420 / 334, sign: [49.4, 72.9] }
  ];
  const HOUSES = HOUSE_LIST.map((h) => h.src);

  const GHOST_ASSETS = {
    normal: "assets/ghost_normal.png",
    happy: "assets/ghost_happy.png",
    wobble: "assets/ghost_wobble.png",
    missed: "assets/ghost_wobble.png"
  };

  // Each costume is a complete picture of Boo dressed up; it replaces all three plain poses,
  // and the player's correct/missed animations carry the expression instead.
  // Unlocked in this order on Trick-or-Treat Street. Ids are stored in saved progress, so keep them stable.
  const COSTUMES = [
    { id: "pumpkin-cap", name: "Pumpkin Hat", spoken: "a pumpkin hat costume", src: "assets/boo_pumpkin_cap.png" },
    { id: "witch-hat", name: "Little Witch", spoken: "a witch costume", src: "assets/boo_witch.png" },
    { id: "cat-ears", name: "Kitty Cat", spoken: "a kitty cat costume", src: "assets/boo_cat.png" },
    { id: "crown", name: "Royal King", spoken: "a king costume", src: "assets/boo_king.png" },
    { id: "pirate-hat", name: "Pirate Captain", spoken: "a pirate costume", src: "assets/boo_pirate.png" },
    { id: "wizard-hat", name: "Wizard", spoken: "a wizard costume", src: "assets/boo_wizard.png" },
    { id: "top-hat", name: "Fancy Top Hat", spoken: "a fancy top hat costume", src: "assets/boo_top_hat.png" },
    { id: "bat-wings", name: "Little Bat", spoken: "a bat costume", src: "assets/boo_bat.png" }
  ];

  let wornCostumeId = null;
  function setCostume(id) {
    wornCostumeId = COSTUMES.some((c) => c.id === id) ? id : null;
  }

  function getCandyItem(indexOrId) {
    if (typeof indexOrId === "number") {
      return CANDIES[Math.abs(indexOrId) % CANDIES.length];
    }
    return CANDIES.find((c) => c.id === indexOrId) || CANDIES[0];
  }

  function getCandySVG(indexOrId, size = 40) {
    const item = getCandyItem(indexOrId);
    return `<img class="candy-img candy-svg candy-svg-${item.id}" src="${item.src}" width="${size}" height="${size}" alt="${item.name}" draggable="false" />`;
  }

  function getRandomCandySVG(size = 40) {
    const idx = Math.floor(Math.random() * CANDIES.length);
    return getCandySVG(idx, size);
  }

  // Boo the Ghost with expressive high-polish character states: normal, happy, and wobble,
  // wearing his current costume unless a costume id (or "none") is passed.
  function getGhostSVG(expression = "normal", size = 72, costumeId = wornCostumeId) {
    const costume = COSTUMES.find((c) => c.id === costumeId);
    const src = costume ? costume.src : (GHOST_ASSETS[expression] || GHOST_ASSETS.normal);
    const height = Math.round(size * 1.05);
    const label = costume ? `Boo the Ghost dressed as ${costume.name}` : `Boo the Ghost (${expression})`;
    return `<img class="ghost-img ghost-svg ghost-${expression}" src="${src}" width="${size}" height="${height}" alt="${label}" draggable="false" />`;
  }

  // Plump Jack-o'-Lantern Pumpkin Candy Bucket for the in-game HUD
  function getPumpkinBucketSVG(size = 48) {
    const width = size;
    const height = Math.round(size * 1.08);
    return `<img class="pumpkin-bucket-img pumpkin-bucket-svg" src="assets/pumpkin_bucket.png" width="${width}" height="${height}" alt="Pumpkin Candy Bucket" draggable="false" />`;
  }

  // Glorious overflowing Jack-o'-Lantern bucket piled high with sweets for the end celebration
  function getPumpkinBucketOverflowSVG(size = 210) {
    const width = size;
    const height = Math.round(size * 1.12);
    return `<img class="pumpkin-bucket-overflow-img big-bucket-img" src="assets/pumpkin_bucket_overflow.png" width="${width}" height="${height}" alt="Overflowing Candy Bucket" draggable="false" />`;
  }

  function getPumpkinBucketBackSVG(size = 154) {
    return getPumpkinBucketOverflowSVG(size);
  }

  function getPumpkinBucketFrontSVG() {
    return "";
  }

  // Preload all polished cute image assets for smooth zero-latency rendering
  function preloadAllAssets() {
    const allUrls = [
      ...Object.values(GHOST_ASSETS),
      "assets/pumpkin_bucket.png",
      "assets/pumpkin_bucket_overflow.png",
      "assets/candy_heart_restore.png",
      ...CANDIES.map(c => c.src),
      ...COSTUMES.map(c => c.src),
      ...HOUSES
    ];
    allUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  preloadAllAssets();

  window.GHOST_CANDIES = {
    list: CANDIES,
    costumes: COSTUMES,
    houses: HOUSE_LIST,
    setCostume,
    getCandySVG,
    getRandomCandySVG,
    getGhostSVG,
    getPumpkinBucketSVG,
    getPumpkinBucketBackSVG,
    getPumpkinBucketFrontSVG,
    getPumpkinBucketOverflowSVG,
    preloadAllAssets
  };
})();
