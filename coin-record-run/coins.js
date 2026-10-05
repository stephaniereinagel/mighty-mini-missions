// Game settings Max can change: name, runner, run length, record phrase, players.
// Source files stay plain ASCII: use \u escapes for symbols like the cent sign.
window.CRR_GAME = {
  name: "Coin Record Run",
  tagline: "Grab the coins. Count your haul. Give, grow, save, and spend!",
  runner: "assets/runner_default.png",
  obstacles: ["assets/rock.png", "assets/cactus.png"],
  runSeconds: 40,
  fanfare: "NEW WORLD RECORD!",
  unlockPerfectCounts: 3,
  players: [
    { name: "Max", startLevel: 1 },
    { name: "Gabi", startLevel: 0 },
    { name: "Connor", startLevel: 0 }
  ]
};

// Real coin diameters in millimeters, so the dime is drawn smaller than the penny.
window.CRR_COINS = {
  1: { name: "penny", plural: "pennies", mm: 19.05, img: "assets/coin_1.png" },
  5: { name: "nickel", plural: "nickels", mm: 21.21, img: "assets/coin_5.png" },
  10: { name: "dime", plural: "dimes", mm: 17.91, img: "assets/coin_10.png" },
  25: { name: "quarter", plural: "quarters", mm: 24.26, img: "assets/coin_25.png" },
  100: { name: "dollar bill", plural: "dollar bills", bill: true, img: "assets/bill_100.png" },
  500: { name: "five dollar bill", plural: "five dollar bills", bill: true, img: "assets/bill_500.png" }
};

// weights: how often each coin shows up during a run.
window.CRR_LEVELS = [
  {
    id: 0, name: "Little Counters", short: "Pennies",
    weights: { 1: 1 }, maxCoins: 10, speed: 170, obstacles: false,
    labels: true, titheShown: true,
    note: "Pennies only. Great for Gabi and Connor."
  },
  {
    id: 1, name: "Penny & Nickel Park", short: "1\u00a2 5\u00a2",
    weights: { 1: 3, 5: 2 }, maxCoins: 8, speed: 190, obstacles: false,
    labels: true, titheShown: true,
    note: "Pennies and nickels."
  },
  {
    id: 2, name: "Dime Drive", short: "+10\u00a2",
    weights: { 1: 3, 5: 2, 10: 2 }, maxCoins: 10, speed: 205, obstacles: false,
    labels: true, titheShown: true,
    note: "Dimes join the run. Dimes are small but worth a lot!"
  },
  {
    id: 3, name: "Quarter Canyon", short: "+25\u00a2",
    weights: { 1: 3, 5: 2, 10: 2, 25: 1 }, maxCoins: 10, speed: 215, obstacles: true,
    labels: true, titheShown: true,
    note: "Quarters and rocks to dodge."
  },
  {
    id: 4, name: "Mystery Mountain", short: "No labels",
    weights: { 1: 3, 5: 2, 10: 2, 25: 1 }, maxCoins: 12, speed: 225, obstacles: true,
    labels: false, titheShown: false,
    note: "Coin labels disappear, and you figure out God's part yourself."
  },
  {
    id: 5, name: "Dollar Summit", short: "$1+",
    weights: { 1: 2, 5: 2, 10: 3, 25: 3 }, maxCoins: 15, speed: 235, obstacles: true,
    labels: false, titheShown: false,
    note: "Big hauls past one dollar."
  }
];
