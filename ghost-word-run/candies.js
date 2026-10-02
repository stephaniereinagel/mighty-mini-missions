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

  const GHOST_ASSETS = {
    normal: "assets/ghost_normal.png",
    happy: "assets/ghost_happy.png",
    wobble: "assets/ghost_wobble.png",
    missed: "assets/ghost_wobble.png"
  };

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

  // Boo the Ghost with expressive high-polish character states: normal, happy, and wobble
  function getGhostSVG(expression = "normal", size = 72) {
    const src = GHOST_ASSETS[expression] || GHOST_ASSETS.normal;
    const height = Math.round(size * 1.05);
    return `<img class="ghost-img ghost-svg ghost-${expression}" src="${src}" width="${size}" height="${height}" alt="Boo the Ghost (${expression})" draggable="false" />`;
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
      ...CANDIES.map(c => c.src)
    ];
    allUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  preloadAllAssets();

  window.GHOST_CANDIES = {
    list: CANDIES,
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
