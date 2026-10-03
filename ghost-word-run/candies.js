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

  // Natural pixel size of each Boo pose and where his head sits in it, as fractions of the image:
  // [center x, top of head y, head width]. Measured from the art; check fit with tools/preview_costumes.py.
  const GHOST_POSES = {
    normal: { w: 439, h: 460, head: [0.52, 0.06, 0.62] },
    happy: { w: 460, h: 445, head: [0.505, 0.10, 0.46] },
    wobble: { w: 460, h: 421, head: [0.53, 0.06, 0.60] }
  };

  // Unlocked in this order on Trick-or-Treat Street. Fit: width and drop are in head widths,
  // drop is how far below the top of the head the item's bottom edge sits; ratio is the image's h/w.
  const COSTUMES = [
    { id: "pumpkin-cap", name: "Pumpkin Hat", spoken: "a pumpkin hat", src: "assets/costume_pumpkin_cap.png", ratio: 320 / 315, width: 0.95, drop: 0.30 },
    { id: "witch-hat", name: "Witch Hat", spoken: "a witch hat", src: "assets/costume_witch_hat.png", ratio: 316 / 320, width: 1.25, drop: 0.22 },
    { id: "cat-ears", name: "Cat Ears", spoken: "cat ears", src: "assets/costume_cat_ears.png", ratio: 303 / 320, width: 1.2, drop: 0.46 },
    { id: "crown", name: "Royal Crown", spoken: "a royal crown", src: "assets/costume_crown.png", ratio: 246 / 320, width: 0.8, drop: 0.16 },
    { id: "pirate-hat", name: "Pirate Hat", spoken: "a pirate hat", src: "assets/costume_pirate_hat.png", ratio: 183 / 320, width: 1.15, drop: 0.22 },
    { id: "wizard-hat", name: "Wizard Hat", spoken: "a wizard hat", src: "assets/costume_wizard_hat.png", ratio: 320 / 315, width: 1.15, drop: 0.22 },
    { id: "top-hat", name: "Fancy Top Hat", spoken: "a fancy top hat", src: "assets/costume_top_hat.png", ratio: 265 / 320, width: 0.85, drop: 0.16 },
    { id: "bat-wings", name: "Bat Wings", spoken: "bat wings", src: "assets/costume_bat_wings.png", ratio: 136 / 320, width: 2.4, drop: 0.95, behind: true }
  ];

  let wornCostumeId = null;
  function setCostume(id) {
    wornCostumeId = COSTUMES.some((c) => c.id === id) ? id : null;
  }

  function costumeLayer(pose, costume) {
    const { w, h, head: [cx, top, head] } = pose;
    const width = head * costume.width;
    const height = (width * w * costume.ratio) / h;
    const left = cx - width / 2;
    const itemTop = top + (costume.drop * head * w) / h - height;
    const pct = (n) => `${(n * 100).toFixed(2)}%`;
    return `<img class="boo-costume${costume.behind ? " behind" : ""}" src="${costume.src}" style="left:${pct(left)};top:${pct(itemTop)};width:${pct(width)}" alt="" draggable="false" />`;
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
    const poseName = expression === "missed" ? "wobble" : (GHOST_POSES[expression] ? expression : "normal");
    const pose = GHOST_POSES[poseName];
    const src = GHOST_ASSETS[poseName];
    const height = Math.round(size * 1.05);
    const costume = COSTUMES.find((c) => c.id === costumeId);
    const ghost = `<img class="ghost-img ghost-svg ghost-${poseName}" src="${src}" width="${size}" height="${height}" alt="Boo the Ghost (${poseName})" draggable="false" />`;
    const layer = costume ? costumeLayer(pose, costume) : "";
    return `<span class="boo-dressed" style="aspect-ratio:${pose.w}/${pose.h}">${costume?.behind ? layer : ""}${ghost}${costume && !costume.behind ? layer : ""}</span>`;
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
