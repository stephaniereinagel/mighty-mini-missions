// Store settings and items. Prices are in cents. Max can add items or change prices here.
// cat: "runner" changes the runner, "trail" adds a trail, "room" goes on the Record Room shelf,
// "goal" items are big buys paid from the Save jar. power + lvl = the special power it gives.
window.CRR_STORE = {
  name: "Max's Mega Mart",
  shopkeeper: "assets/owl.png",
  greeting: "Welcome! Pick something and pay the exact price.",
  changeLevel: 5,

  // Things you buy give powers. Before each run you pick up to powerSlots of them.
  // values[lvl - 1] is how strong each power is at strength 1, 2, or 3.
  powerSlots: 2,
  powers: {
    magnet: { name: "Coin Magnet", values: [80, 120, 170] },
    shield: { name: "Shield", values: [1, 2, 3] },
    time: { name: "Extra Time", values: [5, 10, 15] },
    bag: { name: "Bigger Bag", values: [2, 4, 6] },
    slow: { name: "Slow-Mo", values: [0.85, 0.75, 0.65] },
    rain: { name: "Coin Shower", values: [1, 2, 3] },
    lucky: { name: "Lucky Coins", values: [1, 2, 3] },
    speed: { name: "Super Speed", values: [14, 20, 30] },
    fire: { name: "Dragon Fire", values: [1] }
  },

  tabs: [
    { id: "runner", name: "Runners" },
    { id: "trail", name: "Trails" },
    { id: "room", name: "Record Room" },
    { id: "goal", name: "Big Goals" }
  ],

  items: [
    { id: "ninja", cat: "runner", name: "Ninja", img: "assets/runner_ninja.png", price: 15, level: 1, power: "speed", lvl: 2 },
    { id: "robot", cat: "runner", name: "Robot", img: "assets/runner_robot.png", price: 30, level: 2, power: "magnet", lvl: 1 },
    { id: "astronaut", cat: "runner", name: "Astronaut", img: "assets/runner_astronaut.png", price: 45, level: 2, power: "slow", lvl: 2 },
    { id: "hero", cat: "runner", name: "Superhero", img: "assets/runner_hero.png", price: 75, level: 3, power: "shield", lvl: 2 },
    { id: "dino", cat: "runner", name: "Dino", img: "assets/runner_dino.png", price: 95, level: 3, power: "bag", lvl: 2 },
    { id: "wizard", cat: "runner", name: "Wizard", img: "assets/runner_wizard.png", price: 140, level: 4, power: "slow", lvl: 3 },

    { id: "sparkle", cat: "trail", name: "Sparkle Trail", img: "assets/sparkle.png", price: 10, level: 1, power: "lucky", lvl: 1 },
    { id: "fire", cat: "trail", name: "Fire Trail", img: "assets/fire.png", price: 25, level: 2, power: "time", lvl: 1 },
    { id: "rainbow", cat: "trail", name: "Rainbow Trail", img: "assets/rainbow.png", price: 60, level: 3, power: "lucky", lvl: 2 },
    { id: "stars", cat: "trail", name: "Star Trail", img: "assets/stars.png", price: 120, level: 4, power: "rain", lvl: 2 },

    { id: "duck", cat: "room", name: "Rubber Duck", img: "assets/duck.png", price: 6, level: 0, power: "shield", lvl: 1 },
    { id: "car", cat: "room", name: "Race Car", img: "assets/car.png", price: 9, level: 1, power: "speed", lvl: 1 },
    { id: "ball", cat: "room", name: "Soccer Ball", img: "assets/ball.png", price: 14, level: 1, power: "bag", lvl: 1 },
    { id: "kite", cat: "room", name: "Kite", img: "assets/kite.png", price: 22, level: 2, power: "slow", lvl: 1 },
    { id: "telescope", cat: "room", name: "Telescope", img: "assets/telescope.png", price: 48, level: 2, power: "rain", lvl: 1 },
    { id: "guitar", cat: "room", name: "Guitar", img: "assets/guitar.png", price: 65, level: 3, power: "time", lvl: 2 },
    { id: "rocket", cat: "room", name: "Rocket", img: "assets/rocket.png", price: 85, level: 3, power: "time", lvl: 3 },
    { id: "chest", cat: "room", name: "Treasure Chest", img: "assets/chest.png", price: 125, level: 4, power: "lucky", lvl: 3 },
    { id: "castle", cat: "room", name: "Castle", img: "assets/castle.png", price: 175, level: 5, power: "shield", lvl: 3 },
    { id: "crown", cat: "room", name: "Crown", img: "assets/crown.png", price: 250, level: 5, power: "rain", lvl: 3 },

    { id: "puppy", cat: "goal", name: "Puppy Pal", img: "assets/puppy.png", price: 50, level: 0, power: "magnet", lvl: 2 },
    { id: "treehouse", cat: "goal", name: "Treehouse", img: "assets/treehouse.png", price: 100, level: 1, power: "bag", lvl: 3 },
    { id: "racecar", cat: "goal", name: "Golden Race Car", img: "assets/racecar.png", price: 200, level: 2, power: "speed", lvl: 3 },
    { id: "ufo", cat: "goal", name: "Spaceship", img: "assets/ufo.png", price: 300, level: 3, power: "magnet", lvl: 3 },
    { id: "dragon", cat: "goal", name: "Dragon", img: "assets/dragon.png", price: 500, level: 4, power: "fire", lvl: 1 }
  ],

  // Equal-amount trades at the exchange counter. level = first level the trade appears.
  exchanges: {
    breakDown: [
      { from: { 500: 1 }, to: { 100: 5 }, level: 5 },
      { from: { 100: 1 }, to: { 25: 4 }, level: 4 },
      { from: { 25: 1 }, to: { 10: 2, 5: 1 }, level: 0 },
      { from: { 25: 1 }, to: { 5: 5 }, level: 0 },
      { from: { 10: 1 }, to: { 5: 2 }, level: 0 },
      { from: { 10: 1 }, to: { 1: 10 }, level: 0 },
      { from: { 5: 1 }, to: { 1: 5 }, level: 0 }
    ],
    tradeUp: [
      { from: { 1: 5 }, to: { 5: 1 }, level: 0 },
      { from: { 5: 2 }, to: { 10: 1 }, level: 0 },
      { from: { 10: 2, 5: 1 }, to: { 25: 1 }, level: 0 },
      { from: { 25: 4 }, to: { 100: 1 }, level: 4 },
      { from: { 100: 5 }, to: { 500: 1 }, level: 5 }
    ]
  }
};
